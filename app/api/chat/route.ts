import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, LanguageModelUsage, streamText } from "ai";
import { getIronSession, SessionData } from "iron-session";
import { cookies } from "next/headers";
import StatusCode from "status-code-enum";

import { AI_MODEL, CACHED_INPUT_USD_PER_MILLION, INPUT_USD_PER_MILLION, OUTPUT_USD_PER_MILLION } from "@/lib/constants";
import { IRON_SESSION_OPTIONS } from "@/lib/ironSession";
import { SmallTransfersClient } from "@/lib/smalltransfers";
import { Micros } from "@/lib/smalltransfersTypes";
import { ApiError, MyUIMessage } from "@/lib/types";
import { handleApiError } from "@/lib/utils";

export const maxDuration = 30;

const MAX_INPUT_LENGTH = 10_000;
const MAX_OUTPUT_TOKENS = 1_000;
const COST_SAFETY_FACTOR = 10;
const MARGIN_PERCENTAGE = 30;

export async function POST(request: Request): Promise<Response> {
    try {
        // Get the access token from the signed-in user.
        const session = await getIronSession<SessionData>(await cookies(), IRON_SESSION_OPTIONS);
        if (session.user === undefined) {
            throw new ApiError("You are not signed in.", StatusCode.ClientErrorUnauthorized);
        }
        const accessToken = session.user.accessToken;

        const smallTransfers = new SmallTransfersClient();

        const { messages }: { messages: MyUIMessage[] } = await request.json();

        // Check that messages are only text and that the total length is less than the maximum.
        let totalTextLength = 0;
        for (const message of messages) {
            for (const part of message.parts) {
                if (part.type === "step-start" || part.type === "reasoning") {
                    continue;
                }
                if (part.type !== "text") {
                    throw new ApiError("All messages must be text.", StatusCode.ClientErrorBadRequest);
                }
                const text = part.text;
                totalTextLength += text.length;
            }
        }
        if (totalTextLength > MAX_INPUT_LENGTH) {
            throw new ApiError("Total length of messages must be less than 10_000.", StatusCode.ClientErrorBadRequest);
        }

        // Get a conservative maximum cost in micros.
        const maxCostMicros =
            COST_SAFETY_FACTOR *
            Math.ceil(MAX_INPUT_LENGTH * INPUT_USD_PER_MILLION + MAX_OUTPUT_TOKENS * OUTPUT_USD_PER_MILLION);

        // Authorize a charge.
        const chargeId = await smallTransfers.authorizeCharge(accessToken, maxCostMicros);

        // Stream the response.
        const result = streamText({
            model: openai(AI_MODEL),
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            messages: convertToModelMessages(messages),
            onFinish: async ({ totalUsage }) => {
                // Capture the cost when done.
                const costMicros = getCostMicros(totalUsage);
                await smallTransfers.captureCharge(accessToken, chargeId, costMicros);
            },
        });

        // Stream the response to the client.
        return result.toUIMessageStreamResponse({
            originalMessages: messages,
            messageMetadata: ({ part }) => {
                // Send the cost as metadata with final part.
                if (part.type === "finish") {
                    return {
                        costMicros: getCostMicros(part.totalUsage),
                    };
                }
            },
        });
    } catch (error: unknown) {
        return handleApiError(error);
    }
}

function getCostMicros(totalUsage: LanguageModelUsage): Micros {
    const inputMicros = (totalUsage.inputTokens ?? 0) * INPUT_USD_PER_MILLION;
    const cachedInputMicros = (totalUsage.cachedInputTokens ?? 0) * CACHED_INPUT_USD_PER_MILLION;
    const outputMicros = (totalUsage.outputTokens ?? 0) * OUTPUT_USD_PER_MILLION;
    const underlyingCostMicros = Math.ceil(inputMicros + cachedInputMicros + outputMicros);
    return Math.ceil(underlyingCostMicros * (1 + MARGIN_PERCENTAGE / 100));
}

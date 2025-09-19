import { UIMessage } from "ai";
import StatusCode from "status-code-enum";
import { z } from "zod";

import type { Micros } from "@/lib/smalltransfersTypes";

export class ApiError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: StatusCode,
    ) {
        super(message);
    }
}

export interface ErrorResponse {
    readonly error: string;
}

export type ApiResponse<ResponseBody = object> = ErrorResponse | ResponseBody;

export type Opaque<BaseType, OpaqueType> = BaseType & {
    readonly __type?: OpaqueType;
};

export type Email = Opaque<string, "Email">;
export type Url = Opaque<string, "Url">;

export const MESSAGE_METADATA_SCHEMA = z.object({
    costMicros: z
        .number()
        .optional()
        .transform((value): Micros => value as Micros),
});
export type MessageMetadata = z.infer<typeof MESSAGE_METADATA_SCHEMA>;

export type MyUIMessage = UIMessage<MessageMetadata>;

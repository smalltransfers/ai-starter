"use client";

import { useChat } from "@ai-sdk/react";
import { JSX, useEffect, useState } from "react";
import { toast } from "react-toastify";

import ChatCost from "@/components/ChatCost";
import Conversation from "@/components/Conversation";
import MessageInput from "@/components/MessageInput";
import { MyUIMessage } from "@/lib/types";
import { getErrorString } from "@/lib/utils";

export default function Chat(): JSX.Element {
    const { messages, sendMessage, error } = useChat<MyUIMessage>();
    const [isThinking, setIsThinking] = useState(false);
    const [messageCountWhenThinking, setMessageCountWhenThinking] = useState(0);

    // Show error messages caused by useChat.
    useEffect(() => {
        if (error !== undefined) {
            const message = error.message;
            try {
                const object = JSON.parse(message);
                if ("error" in object) {
                    toast.error(object.error);
                } else {
                    toast.error(message);
                }
            } catch {
                toast.error(message);
            }
        }
    }, [error]);

    async function handleNewMessage(message: string): Promise<void> {
        try {
            setIsThinking(true);
            setMessageCountWhenThinking(messages.length + 1);
            await sendMessage({ text: message });
        } catch (error: unknown) {
            toast.error(getErrorString(error));
        }
        setIsThinking(false);
    }

    function getShowTypingIndicator(): boolean {
        if (!isThinking) {
            return false;
        }
        if (messages.length === messageCountWhenThinking) {
            return true;
        }
        if (messages.length === 0) {
            return false;
        }
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.parts.length === 0) {
            return false;
        }
        const lastPart = lastMessage.parts[lastMessage.parts.length - 1];
        if (lastPart.type === "reasoning") {
            return true;
        }
        return false;
    }

    return (
        <div className="flex h-full min-h-0 w-full flex-col">
            <Conversation messages={messages} showTypingIndicator={getShowTypingIndicator()} />
            <MessageInput onNewMessage={handleNewMessage} disabled={isThinking} />
            <ChatCost messages={messages} />
        </div>
    );
}

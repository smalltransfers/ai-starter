"use client";

import { JSX, useEffect, useRef } from "react";

import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MyUIMessage } from "@/lib/types";

interface Props {
    readonly messages: MyUIMessage[];
    readonly showTypingIndicator: boolean;
}

export default function Conversation(props: Props): JSX.Element {
    const { messages, showTypingIndicator } = props;
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // When new messages are added, scroll to the bottom of the chat.
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    return (
        <ScrollArea className="h-full min-h-0 w-full flex-1" ref={scrollAreaRef}>
            <div className="space-y-4 p-4">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
                {showTypingIndicator && <TypingIndicator />}
            </div>
        </ScrollArea>
    );
}

import { JSX } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { AI_MODEL } from "@/lib/constants";
import { MyUIMessage } from "@/lib/types";
import { cn, formatMicros } from "@/lib/utils";

interface Props {
    readonly message: MyUIMessage;
}

export default function MessageBubble(props: Props): JSX.Element | false {
    const { message } = props;

    const hasText = message.parts.some((part) => part.type === "text" && part.text.length > 0);

    if (!hasText) {
        return false;
    }

    return (
        <div key={message.id} className={cn("flex flex-1", message.role === "user" ? "justify-end" : "justify-start")}>
            <div className="flex max-w-[70%] flex-col gap-1">
                <Card
                    className={cn(
                        "w-fit shrink-0 py-1",
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                >
                    <CardContent className="px-3">
                        {message.parts.map((part, i) => {
                            switch (part.type) {
                                case "text":
                                    return (
                                        <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                                            {part.text}
                                        </div>
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </CardContent>
                </Card>
                {message.metadata?.costMicros && (
                    <div className="text-muted-foreground text-xs">
                        Message cost: {formatMicros(message.metadata.costMicros)} USD ({AI_MODEL})
                    </div>
                )}
            </div>
        </div>
    );
}

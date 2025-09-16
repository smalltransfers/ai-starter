import { JSX } from "react";

import { Card, CardContent } from "@/components/ui/card";

export default function TypingIndicator(): JSX.Element {
    return (
        <div className="flex">
            <div className="flex flex-1 justify-start">
                <Card className="bg-muted w-fit max-w-[400px] shrink-0 py-1">
                    <CardContent className="px-3">
                        <div className="flex items-center gap-1">
                            <div className="flex gap-1">
                                <div className="bg-muted-foreground h-1 w-1 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
                                <div className="bg-muted-foreground h-1 w-1 animate-bounce rounded-full [animation-delay:-0.15s]"></div>
                                <div className="bg-muted-foreground h-1 w-1 animate-bounce rounded-full"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

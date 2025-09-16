import { JSX } from "react";

import { AI_MODEL } from "@/lib/constants";
import { MyUIMessage } from "@/lib/types";
import { formatMicros } from "@/lib/utils";

interface Props {
    readonly messages: MyUIMessage[];
}

export default function ChatCost(props: Props): JSX.Element {
    const { messages } = props;
    const totalCostMicros = messages.reduce((acc, message) => acc + (message.metadata?.costMicros ?? 0), 0);

    return (
        <div className="text-muted-foreground my-1 text-xs">
            Chat cost: {formatMicros(totalCostMicros)} USD ({AI_MODEL})
        </div>
    );
}

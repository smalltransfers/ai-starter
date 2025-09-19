"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { JSX, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useIsHydrated } from "@/lib/useIsHydrated";

const FORM_SCHEMA = z.object({
    message: z
        .string()
        .min(1, {
            message: "Message must be at least 1 character.",
        })
        .max(1000, {
            message: "Message must not be longer than 1000 characters.",
        }),
});
type FormSchema = z.infer<typeof FORM_SCHEMA>;

interface Props {
    readonly onNewMessage: (message: string) => void;
    readonly disabled: boolean;
}

export default function MessageInput(props: Props): JSX.Element {
    const { onNewMessage, disabled: parentDisabled } = props;
    const isHydrated = useIsHydrated();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const disabled = !isHydrated || parentDisabled;

    useEffect(() => {
        if (!disabled && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [disabled]);

    const form = useForm<FormSchema>({
        resolver: zodResolver(FORM_SCHEMA),
        defaultValues: {
            message: "",
        },
    });

    async function onSubmit(data: FormSchema): Promise<void> {
        setIsProcessing(true);
        form.reset();
        onNewMessage(data.message);
        setIsProcessing(false);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            form.handleSubmit(onSubmit)();
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="z-10 flex w-full items-center gap-2">
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <Textarea
                            onKeyDown={handleKeyDown}
                            disabled={disabled}
                            autoFocus
                            placeholder="Ask me anything..."
                            className="max-h-[6rem] w-full resize-none overflow-y-auto"
                            {...field}
                            ref={textareaRef}
                        />
                    )}
                />
                <Button
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={disabled}
                    variant="secondary"
                    size="icon"
                    className="size-8 rounded-full"
                >
                    {isProcessing ? <Loader2Icon className="animate-spin" /> : <ArrowUpIcon />}
                </Button>
            </form>
        </Form>
    );
}

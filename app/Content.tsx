"use client";

import { Loader2Icon } from "lucide-react";
import { JSX, useEffect } from "react";
import { toast } from "react-toastify";

import Chat from "@/components/Chat";
import SignInButton from "@/components/SignInButton";
import { getUser } from "@/lib/api";
import { useCurrentUserEmail, useSetCurrentUserEmail } from "@/lib/store/hooks";

export default function Content(): JSX.Element {
    const currentUserEmail = useCurrentUserEmail();
    const setCurrentUserEmail = useSetCurrentUserEmail();

    useEffect(() => {
        async function getCurrentUser(): Promise<void> {
            const result = await getUser();
            if (result.ok) {
                setCurrentUserEmail(result.value);
            } else {
                toast.error(result.error);
            }
        }

        getCurrentUser();
    }, [setCurrentUserEmail]);

    if (currentUserEmail === undefined) {
        return (
            <div className="flex items-center gap-2">
                <Loader2Icon className="animate-spin" />
                <p className="text-2xl">Loading...</p>
            </div>
        );
    }

    if (currentUserEmail === null) {
        return <SignInButton />;
    }

    return (
        <div className="h-full min-h-0 w-full">
            <Chat />
        </div>
    );
}

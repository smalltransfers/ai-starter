"use client";

import { Loader2Icon } from "lucide-react";
import { JSX, useEffect } from "react";

import Chat from "@/components/Chat";
import SignInButton from "@/components/SignInButton";
import { useCurrentUserEmail, useSetCurrentUserEmail } from "@/lib/store/hooks";

interface Props {
    readonly baseUrl: string;
}

export default function Content(props: Props): JSX.Element {
    const { baseUrl } = props;
    const currentUserEmail = useCurrentUserEmail();
    const setCurrentUserEmail = useSetCurrentUserEmail();

    useEffect(() => {
        async function getCurrentUser() {
            const response = await fetch("/api/users/me");
            const userEmail = await response.json();
            setCurrentUserEmail(userEmail);
        }

        getCurrentUser();
    }, [setCurrentUserEmail]);

    if (currentUserEmail === undefined) {
        return (
            <div className="flex flex-col items-center gap-2">
                <p className="text-2xl">Loading...</p>
                <Loader2Icon className="animate-spin" />
            </div>
        );
    }

    if (currentUserEmail === null) {
        return <SignInButton baseUrl={baseUrl} />;
    }

    return (
        <div className="h-full min-h-0 w-full">
            <Chat />
        </div>
    );
}

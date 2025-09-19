import { call } from "@/lib/apiCall";
import { Result } from "@/lib/result";
import type { Email } from "@/lib/types";

export async function getUser(): Promise<Result<Email | null>> {
    return call(`/api/users/me`, { method: "GET" });
}

export async function signOut(): Promise<Result<void>> {
    return call(`/api/users/me`, { method: "DELETE" });
}

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/server/better-auth";


export async function logoutAction() {
    const headersList = await headers();

    await auth.api.signOut({
        headers: headersList
    });
}
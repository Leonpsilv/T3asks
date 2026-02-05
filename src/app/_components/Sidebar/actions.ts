"use server";

import { headers } from "next/headers";
import { auth } from "~/server/better-auth";


export async function logoutAction() {
    const headersList = await headers();

    await auth.api.signOut({
        headers: headersList
    });
}
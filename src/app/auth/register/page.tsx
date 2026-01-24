import { getSession } from "~/server/better-auth/server";
import { redirect } from "next/navigation";
import LoginForm from "./RegisterForm";

export default async function LoginPage() {
    const session = await getSession();
    if (session) redirect("/");

    return (
        <LoginForm />
    );
}

import RegisterForm from "@/components/auth/register-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Register() {
    const session = await auth.api.getSession({
            headers: await headers(),
          });
        
          if (session?.user) return redirect("/");
    return <RegisterForm />;
}
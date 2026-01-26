import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    async function handleSignOut() {
        "use server";
        await signOut();
    }

    return (
        <AdminShell session={session} signOutAction={handleSignOut}>
            {children}
        </AdminShell>
    );
}

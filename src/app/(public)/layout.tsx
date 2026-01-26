import { Navbar } from "@/components/layout/navbar";
import { auth } from "@/auth";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <>
            <Navbar session={session} />
            {children}
        </>
    );
}

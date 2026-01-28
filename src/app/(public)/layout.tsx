import { Navbar } from "@/components/layout/navbar";
import { WhatsappFloat } from "@/components/layout/whatsapp-float";
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
            <WhatsappFloat />
        </>
    );
}

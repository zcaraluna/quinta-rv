// Next 16: proxy runs on the Node.js runtime (middleware ran on Edge, which can't use the postgres driver)
export { auth as proxy } from "@/auth"

export const config = {
    // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\.png$).*)'],
};

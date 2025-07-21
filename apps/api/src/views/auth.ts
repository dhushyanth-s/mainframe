import { Elysia, type Context } from "elysia";
import { auth } from "../lib/auth";
 
export const betterAuthView = (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
    // validate request method
    if(BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
        return auth.handler(context.request);
    // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
        context.error(405)
    }
}
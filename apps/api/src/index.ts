import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { betterAuthView } from "./views/auth";

const app = new Elysia()
  .use(cors())
  .all("/api/auth/*", betterAuthView)
  .get("/", () => "Hello Elysia")
  .get("/ping", () => "pong")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;

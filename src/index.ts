import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => ({ status: "ok", message: "Server is healthy" }))
  .get("/health", () => ({ status: "ok", message: "Server is healthy" }))
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

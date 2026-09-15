import { Elysia, t } from "elysia";
import { registerUser, loginUser } from "../services/users-service";

export const usersRoutes = new Elysia({ prefix: "/api/users" })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const result = await registerUser(body);
        set.status = 201; // Created
        return result;
      } catch (error: any) {
        if (error.message === "Email sudah terdaftar") {
          set.status = 400; // Bad Request
          return { error: error.message };
        }
        set.status = 500;
        return { error: "Internal Server Error" };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      try {
        const result = await loginUser(body);
        return result;
      } catch (error: any) {
        if (error.message === "Email atau password salah") {
          set.status = 400;
          return { error: error.message };
        }
        set.status = 500;
        return { error: "Internal Server Error" };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  );

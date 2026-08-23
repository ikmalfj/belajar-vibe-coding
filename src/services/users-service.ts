import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export const registerUser = async (payload: any) => {
  const { name, email, password } = payload;

  // Cek apakah email sudah terdaftar
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  // Hash password dengan bcrypt menggunakan Bun bawaan
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
  });

  // Simpan data ke database
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { data: "OK" };
};

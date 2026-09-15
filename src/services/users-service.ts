import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, sessions } from "../db/schema";

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

export const loginUser = async (payload: any) => {
  const { email, password } = payload;

  // Cari user berdasarkan email
  const foundUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = foundUsers[0];
  if (!user) {
    throw new Error("Email atau password salah");
  }

  // Verifikasi kecocokan password
  const isPasswordValid = await Bun.password.verify(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Email atau password salah");
  }

  // Generate UUID sebagai token
  const token = crypto.randomUUID();

  // Simpan sesi login baru
  await db.insert(sessions).values({
    token,
    email: user.email,
    userId: user.id,
  });

  return { data: token };
};

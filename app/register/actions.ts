"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists. Please login instead.");
  }

  // Create new user
  await prisma.user.create({
    data: {
      email,
      name,
      password: await bcrypt.hash(password, 10),
    },
  });

  // Redirect to login page after successful registration
  redirect('/login');
}

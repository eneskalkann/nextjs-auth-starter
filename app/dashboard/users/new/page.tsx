export const dynamic = "force-dynamic"; // This disables SSG and ISR

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Form from "next/form";
import bcrypt from 'bcryptjs';

export default function NewUser() {
  async function createUser(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate passwords match
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error("A user with this email already exists");
    }

    // Create the admin user
    await prisma.admin.create({
      data: { 
        name, 
        email, 
        password: hashedPassword,
        role: 'ADMIN' // Default role
      },
    });

    redirect("/dashboard/users");
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-12">
      <h1 className="text-3xl font-bold mb-6">Create New User</h1>
      <Form action={createUser} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg font-medium mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter user name ..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="email" className="flex text-lg font-medium mb-2 items-center">
            Email 
            <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
              Required
            </span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Enter user email ..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="flex text-lg font-medium mb-2 items-center">
              Password
              <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                Required
              </span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              placeholder="Enter password (min 6 characters)"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="flex text-lg font-medium mb-2 items-center">
              Confirm Password
              <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                Required
              </span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={6}
              placeholder="Confirm password"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Admin User
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}

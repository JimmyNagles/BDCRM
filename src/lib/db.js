import { hash } from "bcrypt";

let users = [];

export async function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

export async function createUser(email, password, name) {
  const hashedPassword = await hash(password, 10);
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    name,
  };
  users.push(newUser);
  return newUser;
}

// Initialize with a test user
createUser("test@example.com", "password123", "Test User");

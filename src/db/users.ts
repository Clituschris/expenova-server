import type { CreateUserBody, UserRecord } from '@type/auth';

import sql from './client';

export async function createUser(data: CreateUserBody): Promise<UserRecord> {
  const [user] = await sql<UserRecord[]>`
    INSERT INTO users (email, name, phone, password_hash)
    VALUES (${data.email}, ${data.name}, ${data.phone}, ${data.password_hash})
    RETURNING *
  `;
  return user;
}

export async function findUserByEmail(
  email: string
): Promise<UserRecord | undefined> {
  const [user] = await sql<UserRecord[]>`
    SELECT *
    FROM users
    WHERE email = ${email}
  `;
  return user;
}

export async function updateLastLogin(id: string): Promise<void> {
  await sql`
    UPDATE users
    SET last_login = now()
    WHERE id = ${id}
  `;
}

export async function getUserByEmailAndPhone(
  email: string,
  phone: string
): Promise<UserRecord | undefined> {
  const [user] = await sql<UserRecord[]>`
  SELECT * FROM users
  WHERE email = ${email} AND phone = ${phone}
  `;

  return user;
}

export async function updateUserPassword(
  email: string,
  password_hash: string
): Promise<UserRecord> {
  const [user] = await sql<UserRecord[]>`
    UPDATE users
    SET password_hash = ${password_hash}
    WHERE email = ${email}
    RETURNING *
  `;
  return user;
}

import type { CreateUserBody, UserRecord } from '@type/auth';
import { conflict, internal } from '@utils/common';
import { isPostgresError } from '@utils/helpers';
import logger from '@utils/logger';

import sql from './client';

export async function createUser(data: CreateUserBody): Promise<UserRecord> {
  try {
    const [user] = await sql<UserRecord[]>`
      INSERT INTO users (email, name, phone, password_hash)
      VALUES (${data.email}, ${data.name}, ${data.phone}, ${data.password_hash})
      RETURNING *
    `;
    return user;
  } catch (err: unknown) {
    if (isPostgresError(err) && err?.code === '23505') {
      throw conflict('Email is already registered');
    }
    throw internal('Failed to create user', err);
  }
}

export async function findUserById(
  id: string
): Promise<UserRecord | undefined> {
  try {
    const [user] = await sql<UserRecord[]>`
      SELECT *
      FROM users
      WHERE id = ${id}
    `;
    return user;
  } catch (err) {
    throw internal('Failed to fetch user by id', err);
  }
}

export async function findUserByEmail(
  email: string
): Promise<UserRecord | undefined> {
  try {
    const [user] = await sql<UserRecord[]>`
      SELECT *
      FROM users
      WHERE email = ${email}
    `;
    return user;
  } catch (err) {
    throw internal('Failed to fetch user by email', err);
  }
}

export async function updateLastLogin(id: string): Promise<void> {
  try {
    await sql`
      UPDATE users
      SET last_login = now()
      WHERE id = ${id}
    `;
  } catch (err) {
    logger.error(err);
  }
}

export async function getUserByEmailAndPhone(
  email: string,
  phone: string
): Promise<UserRecord | undefined> {
  try {
    const [user] = await sql<UserRecord[]>`
      SELECT * FROM users
      WHERE email = ${email} AND phone = ${phone}
    `;
    return user;
  } catch (err) {
    throw internal('Failed to fetch user by email/phone', err);
  }
}

export async function updateUserPassword(
  email: string,
  password_hash: string
): Promise<UserRecord> {
  try {
    const [user] = await sql<UserRecord[]>`
      UPDATE users
      SET password_hash = ${password_hash}
      WHERE email = ${email}
      RETURNING *
    `;
    if (!user) {
      throw internal(`No user updated for email ${email}`);
    }
    return user;
  } catch (err) {
    if (isPostgresError(err) && err?.status) {
      throw err;
    }
    throw internal('Failed to update password', err);
  }
}

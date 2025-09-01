import { sessions } from '@@/db/schema';
import { eq } from 'drizzle-orm';
import { DB } from './database';

export interface Session {
  id: string;
  user_id: number;
  secretHash: Uint8Array;
  createdAt: Date;
}

interface SessionWithToken extends Session {
  token: string;
}

const SESSION_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 30;

function generateSecureRandomString(): string {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';

  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);

  let id = '';
  for (let i = 0; i < bytes.length; i++) {
    id += alphabet[bytes[i] >> 3];
  }
  return id;
}

async function hashSecret(secret: string): Promise<Uint8Array> {
  const secretBytes = new TextEncoder().encode(secret);
  const secretHashBuffer = await crypto.subtle.digest('SHA-256', secretBytes);
  return new Uint8Array(secretHashBuffer);
}

export async function createSession(db: DB, user_id: number): Promise<SessionWithToken> {
  const now = new Date();

  const id = generateSecureRandomString();
  const secret = generateSecureRandomString();
  const secretHash = await hashSecret(secret);

  const token = id + '.' + secret;

  const session: SessionWithToken = {
    id,
    user_id,
    secretHash,
    createdAt: now,
    token,
  };

  await db.insert(sessions).values({
    id: session.id,
    user_id: user_id,
    secret_hash: session.secretHash,
    created_at: Math.floor(session.createdAt.getTime() / 1000),
  });

  return session;
}

async function deleteSession(db: DB, sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

async function getSession(db: DB, sessionId: string): Promise<Session | null> {
  const now = new Date();

  const result = await db.select().from(sessions).where(eq(sessions.id, sessionId));
  if (result.length !== 1) {
    return null;
  }
  const s = result[0];
  const session: Session = {
    id: s.id,
    user_id: s.user_id,
    secretHash: s.secret_hash,
    createdAt: new Date(s.created_at * 1000),
  };

  if (now.getTime() - session.createdAt.getTime() >= SESSION_EXPIRES_IN_SECONDS * 1000) {
    await deleteSession(db, sessionId);
    return null;
  }

  return session;
}

export async function validateSessionToken(db: DB, token: string): Promise<Session | null> {
  const tokenParts = token.split('.');
  if (tokenParts.length !== 2) {
    return null;
  }

  const sessionId = tokenParts[0];
  const sessionSecret = tokenParts[1];
  const session = await getSession(db, sessionId);
  if (!session) {
    return null;
  }

  const tokenSecretHash = await hashSecret(sessionSecret);
  const validSecret = constantTimeEqual(tokenSecretHash, session.secretHash);
  if (!validSecret) {
    return null;
  }

  return session;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) {
    return false;
  }

  let c = 0;
  for (let i = 0; i < a.byteLength; i++) {
    c |= a[i] ^ b[i];
  }
  return c === 0;
}

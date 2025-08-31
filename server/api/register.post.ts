import { registerSchema } from '#shared/zod/auth';
import { ZodError } from 'zod';
import { users } from '@@/db/schema';
import { eq } from 'drizzle-orm';
import { createSession, validateSessionToken } from './utils/session';
import { hash } from './utils/auth';
import { db } from './utils/database';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const validated = registerSchema.parse(body);

    const sessionToken = getCookie(event, 'session_token');
    if (sessionToken) {
      const validSessionToken = await validateSessionToken(db, sessionToken);
      if (validSessionToken) {
        return {
          success: false,
          error: 'You are already logged in',
        };
      }
    }

    const existingUsers = await db.select().from(users).where(eq(users.username, validated.username));
    if (existingUsers[0]) {
      return {
        success: false,
        error: 'Username already taken',
      };
    }

    const hashedPassword = await hash(validated.password);
    const user = await db
      .insert(users)
      .values({
        username: validated.username,
        password: hashedPassword,
      })
      .returning();

    const session = await createSession(db, user[0].id);
    setCookie(event, 'session_token', session.token, {
      maxAge: 86400,
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
    });

    return {
      success: true,
      error: null,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        success: false,
        error: `Credentials ${JSON.stringify(body)} not parsed successfully: ${JSON.stringify(err)}`,
      };
    } else {
      return {
        success: false,
        error: JSON.stringify(err),
      };
    }
  }
});

import { loginSchema } from '#shared/zod/auth';
import { ZodError } from 'zod';
import { db } from './utils/database';
import { createSession, validateSessionToken } from './utils/session';
import { users } from '~~/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from './utils/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const validated = loginSchema.parse(body);

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
    if (!existingUsers.length) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }
    const user = existingUsers[0];

    if ((await hash(validated.password)) === user.password) {
      const session = await createSession(db, user.id);
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
    }

    return {
      success: false,
      error: 'Invalid credentials',
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

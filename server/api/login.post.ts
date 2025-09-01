import { loginSchema } from '#shared/zod/auth';
import { ZodError } from 'zod';
import { db } from './utils/database';
import { createSession } from './utils/session';
import { users } from '~~/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from './utils/auth';

export default defineEventHandler(
  async (
    event,
  ): Promise<
    | { success: false; error: string; user: null }
    | {
        success: true;
        error: null;
        user: {
          id: number;
          admin: boolean;
          username: string;
          created_at: Date;
          updated_at: Date;
          password: undefined;
        };
      }
  > => {
    if (event.context.auth.validSessionToken) {
      return {
        success: false,
        user: null,
        error: 'You are already logged in',
      };
    }

    const body = await readBody(event);

    try {
      const validated = loginSchema.parse(body);

      const existingUsers = await db.select().from(users).where(eq(users.username, validated.username));
      if (!existingUsers.length) {
        return {
          success: false,
          user: null,
          error: 'Invalid credentials',
        };
      }

      const user = existingUsers[0];
      const devAdmin = process.env.APP_ENV === 'development' && validated.username === 'admin' && validated.password === 'admin';

      if (devAdmin || (await hash(validated.password)) === user.password) {
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
          user: {
            ...user,
            password: undefined,
          },
          error: null,
        };
      }

      return {
        success: false,
        user: null,
        error: 'Invalid credentials',
      };
    } catch (err) {
      if (err instanceof ZodError) {
        return {
          success: false,
          user: null,
          error: `Credentials ${JSON.stringify(body)} not parsed successfully: ${JSON.stringify(err)}`,
        };
      } else {
        return {
          success: false,
          user: null,
          error: JSON.stringify(err),
        };
      }
    }
  },
);

import { validateSessionToken } from './utils/session';
import { db } from './utils/database';
import { eq } from 'drizzle-orm';
import { sessions } from '~~/db/schema';

export default defineEventHandler(
  async (
    event,
  ): Promise<
    | { success: false; error: string; data: null }
    | {
        success: true;
        error: null;
        data: {
          id: number;
          admin: boolean;
          username: string;
          created_at: Date;
          updated_at: Date;
          password: undefined;
        };
      }
  > => {
    const sessionToken = getCookie(event, 'session_token');
    if (!sessionToken) {
      return {
        success: false,
        error: 'You are not logged in',
        data: null,
      };
    }

    const validSessionToken = await validateSessionToken(db, sessionToken);
    if (!validSessionToken) {
      return {
        success: false,
        error: 'You are not logged in',
        data: null,
      };
    }

    const sessionWithUser = await db.query.sessions.findFirst({
      where: eq(sessions.id, validSessionToken.id),
      with: {
        user: true,
      },
    });
    const user = sessionWithUser!.user;

    return {
      success: true,
      error: null,
      data: {
        ...user,
        password: undefined,
      },
    };
  },
);

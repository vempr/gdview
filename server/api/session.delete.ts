import { sessions } from '~~/db/schema';
import { db } from './utils/database';
import { validateSessionToken } from './utils/session';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const sessionToken = getCookie(event, 'session_token');
    if (sessionToken) {
      const validSessionToken = await validateSessionToken(db, sessionToken);
      if (validSessionToken) {
        await db.delete(sessions).where(eq(sessions.id, validSessionToken.id));
        deleteCookie(event, 'session_token');

        return {
          success: true,
          error: null,
        };
      }
    }
    return {
      success: false,
      error: 'You are not logged in',
    };
  } catch (err) {
    return {
      success: false,
      error: JSON.stringify(err),
    };
  }
});

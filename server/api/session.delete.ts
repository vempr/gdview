import { sessions } from '~~/db/schema';
import { db } from './utils/database';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    if (event.context.auth.validSessionToken) {
      await db.delete(sessions).where(eq(sessions.id, event.context.auth.validSessionToken.id));
      deleteCookie(event, 'session_token');
      deleteCookie(event, 'user');

      return {
        success: true,
        error: null,
      };
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

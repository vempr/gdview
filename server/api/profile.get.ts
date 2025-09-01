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
    const validSessionToken = event.context.auth.validSessionToken;
    if (!validSessionToken) {
      return {
        success: false,
        error: 'You are not logged in',
        user: null,
      };
    }

    return {
      success: true,
      error: null,
      user: {
        ...event.context.auth.user,
        password: undefined,
      },
    };
  },
);

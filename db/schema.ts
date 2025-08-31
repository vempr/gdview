import { pgTable, serial, text, timestamp, customType, boolean, integer } from 'drizzle-orm/pg-core';

const bytea = customType<{
  data: Uint8Array<ArrayBufferLike>;
  default: false;
}>({
  dataType() {
    return 'bytea';
  },
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  admin: boolean('admin').notNull().default(false),
  username: text('username').notNull(),
  password: text('password').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  secret_hash: bytea('secret_hash').notNull(),
  created_at: integer('created_at').notNull(),
});

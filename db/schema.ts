import { pgTable, serial, text, timestamp, customType, boolean } from 'drizzle-orm/pg-core';
import { Buffer } from 'buffer';

const bytea = customType<{
  data: Buffer;
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
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  secret_hash: bytea('secret_hash').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

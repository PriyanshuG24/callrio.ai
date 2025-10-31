import { pgTable, text, timestamp, boolean,uuid } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const meeting=pgTable("meeting",{
  id: uuid("id").defaultRandom().primaryKey(),
  meetingId:text("meeting_id").notNull().unique(),
  title:text("title"),
  ownerId:text("owner_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  startAt:timestamp("start_at"),
  endedAt:timestamp("ended_at"),
  isStarted:boolean("is_started").default(false),
  isEnded:boolean("is_ended").default(false),
  createdAt:timestamp("created_at").defaultNow()
})

export const meetingParticipant = pgTable("meeting_participant", {
  id: uuid("id").defaultRandom().primaryKey(),
  meetingId: text("meeting_id")
    .notNull()
    .references(() => meeting.meetingId, { onDelete: "cascade" }),
  participantId: text("participant_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  participantName:text("participant_name").notNull(),
  role: text("role").default("guest").notNull(),
  createdAt:timestamp("created_at").defaultNow()
});

export const meetingParticipantSessionHistory = pgTable("meeting_participant_session_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  meetingId: text("meeting_id")
    .notNull()
    .references(() => meeting.meetingId, { onDelete: "cascade" }),
  participantId: text("participant_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  sessionId:text("session_id").notNull(),
  joinedAt:timestamp("joined_at"),
  leftAt:timestamp("left_at"),
  createdAt:timestamp("created_at").defaultNow()
});

export const meetingTranscription = pgTable("meeting_transcription", {
  id: uuid("id").defaultRandom().primaryKey(),
  meetingId: text("meeting_id")
    .notNull()
    .references(() => meeting.meetingId, { onDelete: "cascade" }),
  url:text("url").notNull().unique(),
  sessionId:text("session_id").notNull(),
  start_time:timestamp("start_time").notNull(),
  end_time:timestamp("end_time").notNull(),
  createdAt:timestamp("created_at").defaultNow()
});

export const meetingRecording = pgTable("meeting_recording", {
  id: uuid("id").defaultRandom().primaryKey(),
  meetingId: text("meeting_id")
    .notNull()
    .references(() => meeting.meetingId, { onDelete: "cascade" }),
  url:text("url").notNull().unique(),
  sessionId:text("session_id").notNull(),
  start_time:timestamp("start_time").notNull(),
  end_time:timestamp("end_time").notNull(),
  createdAt:timestamp("created_at").defaultNow()
});


export const linkedinToken = pgTable("linkedin_token", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId:text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  linkedinUserId:text("linkedin_user_id").notNull().unique(),
  accessToken:text("access_token").notNull(),
  expiresIn:text("expires_in").notNull(),
  createdAt:timestamp("created_at").defaultNow()
})
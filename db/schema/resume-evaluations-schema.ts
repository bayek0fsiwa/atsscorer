import { pgTable, text, timestamp, integer, json, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const resumeEvaluation = pgTable("resume_evaluation", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    file_name: text("file_name").notNull(),
    file_content: text("file_content").notNull(),
    job_description: text("job_description").notNull(),
    score: integer("score").notNull(),
    metrics: json("metrics").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});
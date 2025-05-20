// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    deleted: v.boolean(),
    deletedAt: v.optional(v.string()),
  }),
  sessions: defineTable({
    documentId: v.id("documents"),
    active: v.boolean(),
    awareness: v.optional(v.bytes()),
    delta: v.optional(v.bytes()),
  }).index("by_document_and_status", ["documentId", "active"]),
});

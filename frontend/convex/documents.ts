import { s } from "framer-motion/client";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import * as Y from "yjs";

export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("documents", {
      deleted: false,
      title: args.title,
    });

    return id;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});

export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const deleteOne = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, {
      deleted: true,
      deletedAt: new Date().toUTCString(),
    });
  },
});

export const getCurrentSession = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const id = ctx.db.normalizeId("documents", documentId);
    return await ctx.db
      .query("sessions")
      .filter((s) =>
        s.and(s.eq(s.field("documentId"), id), s.eq(s.field("active"), true))
      )
      .unique();
  },
});

export const getYDoc = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const id = ctx.db.normalizeId("documents", documentId);

    const history = await ctx.db
      .query("sessions")
      .withIndex("by_document_and_status", (s) =>
        s.eq("documentId", documentId).eq("active", false)
      )
      .collect();

    const tempDoc = new Y.Doc();

    history.forEach((session) => {
      Y.applyUpdate(tempDoc, new Uint8Array(session.delta!));
    });

    const shadowState = Y.encodeStateAsUpdate(tempDoc)

    const arraybuf = new Uint8Array(shadowState).buffer

    return arraybuf
  },
});

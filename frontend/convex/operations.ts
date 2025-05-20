import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createOrJoinSession = mutation({
  args: { docId: v.id("documents") },
  handler: async (ctx, { docId }) => {
    const nDocId = ctx.db.normalizeId("documents", docId);

    if (!nDocId) {
      throw Error(`Not a valid document ID, Recieved: ${docId}`);
    }

    const currentSession = await ctx.db
      .query("sessions")
      .filter((s) => s.eq(s.field("documentId"), nDocId))
      .unique();

    if (currentSession === null) {
      const newSessionId = await ctx.db.insert("sessions", {
        active: true,
        documentId: nDocId,
      });

      const session = await ctx.db.get(newSessionId);

      return session!;
    }

    return currentSession;
  },
});

export const updateAwareness = mutation({
  args: { awareness: v.bytes(), sessionId: v.id("sessions") },
  handler: async (ctx, { awareness, sessionId }) => {
    await ctx.db.patch(sessionId, {
      awareness: awareness,
    });
  },
});

export const updateCurrentState = mutation({
  args: { state: v.bytes(), sessionId: v.id("sessions") },
  handler: async (ctx, { state, sessionId }) => {
		await ctx.db.patch(sessionId, {
			delta: state
		})
	},
});

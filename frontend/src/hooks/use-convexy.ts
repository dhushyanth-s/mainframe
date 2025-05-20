import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import * as Y from "yjs";
import { useEffect, useState } from "react";
import * as AwarenessProtocol from "y-protocols/awareness";
import { useUser } from "@clerk/nextjs";

export function useConvexY(doc: Y.Doc, docId: string) {
  const data = useQuery(api.getYDoc.getYDoc, {
    docId,
  });
  const mutation = useMutation(api.updateYDoc.updateYDoc);
  const updateAwareness = useMutation(api.updateYDoc.updateDocAwareness);
  const [awareness, _] = useState(new AwarenessProtocol.Awareness(doc));
  const user = useUser();

  // Handle remote changes (when data changes)
  useEffect(() => {
    if (data === null || data === undefined || data.state === undefined) {
      return;
    }
    const array = new Uint8Array(data.state!);

    Y.applyUpdate(doc, array);

    if (data.awareness && user.isLoaded) {
      AwarenessProtocol.applyAwarenessUpdate(
        awareness,
        new Uint8Array(data.awareness),
        user.user?.id
      );
    }
  }, [data, user]);

  useEffect(() => {
    if (user.isLoaded) {
      awareness.setLocalStateField("user", {
        name: user.user?.fullName,
      });
    }
  }, [user.isLoaded]);

  // Handle local changes
  useEffect(() => {
    const updateDoc = () => {
      const state = Y.encodeStateAsUpdate(doc);
      mutation({
        docId,
        update: new Uint8Array(state).buffer,
      });
    };
    doc.on("update", updateDoc);

    // Sync initial data
    if (data && data.state) {
      const array = new Uint8Array(data.state);
      Y.applyUpdate(doc, array);
    }

    awareness.on(
      "update",
      ({
        added,
        updated,
        removed,
      }: {
        added: Array<number>;
        updated: Array<number>;
        removed: Array<number>;
      }) => {
        const changedClients = added.concat(updated).concat(removed);

        const encodedAwareness = AwarenessProtocol.encodeAwarenessUpdate(
          awareness,
          changedClients
        );

        updateAwareness({
          docId,
          awareness: new Uint8Array(encodedAwareness).buffer,
        });
      }
    );

    return () => doc.off("update", updateDoc);
  }, []);

  return { awareness };
}

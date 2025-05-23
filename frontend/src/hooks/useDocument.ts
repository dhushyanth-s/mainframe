import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import * as Y from "yjs";
import { useEffect, useMemo, useState } from "react";
import * as AwarenessProtocol from "y-protocols/awareness";
import { useUser } from "@clerk/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { useDebouncedCallback, useThrottledCallback } from "use-debounce";

const DEBOUNCE_DELAY = 300;

export function useDocument(docId: string) {
  const session = useQuery(api.documents.getCurrentSession, {
    documentId: docId as Id<"documents">,
  });
  const createOrJoinSession = useMutation(api.operations.createOrJoinSession);

  const updateState = useMutation(api.operations.updateCurrentState);
  const updateAwareness = useMutation(api.operations.updateAwareness);

  const user = useUser();

  const shadowState = useQuery(
    api.documents.getYDoc,
    session ? { documentId: session.documentId } : "skip"
  );

  const shadow = useMemo(() => {
    if (shadowState) {
      const temp = new Y.Doc();
      Y.applyUpdate(temp, new Uint8Array(shadowState));

      return temp;
    }
  }, [shadowState]);

  const [doc, _] = useState(new Y.Doc());

  const awareness = useMemo(() => {
    if (shadow && user.isLoaded) {
      const awarenessTemp = new AwarenessProtocol.Awareness(shadow);

      awarenessTemp.setLocalStateField("user", {
        name: user.user?.fullName,
        id: user.user?.id,
      });

      return awarenessTemp;
    }
  }, [shadow, user]);

  // Document state has changed remotely
  useEffect(() => {
    if (session && session.delta) {
      const array = new Uint8Array(session.delta);

      Y.applyUpdate(doc, array);
    }
  }, [session?.delta]);

  // Awareness has changed remotely
  useEffect(() => {
    if (session && session.awareness && awareness && user.isLoaded) {
      AwarenessProtocol.applyAwarenessUpdate(
        awareness,
        new Uint8Array(session.awareness),
        user.user?.id
      );
    }
  }, [session?.awareness, user]);

  const updateDocThrottled = useThrottledCallback(() => {
    if (!shadow || !session) return;

    const shadowStateVector = Y.encodeStateVector(shadow);
    const delta = Y.encodeStateAsUpdate(doc, shadowStateVector);
    updateState({
      sessionId: session._id,
      state: new Uint8Array(delta).buffer,
    });
  }, DEBOUNCE_DELAY);

  const updateAwarenessThrottled = useThrottledCallback(
    ({
      added,
      updated,
      removed,
    }: {
      added: Array<number>;
      updated: Array<number>;
      removed: Array<number>;
    }) => {
      if (awareness && session) {
        const changedClients = added.concat(updated).concat(removed);

        const encodedAwareness = AwarenessProtocol.encodeAwarenessUpdate(
          awareness,
          changedClients
        );

        // updateAwarenessDebounced(encodedAwareness, session._id);
        updateAwareness({
          sessionId: session._id,
          awareness: new Uint8Array(encodedAwareness).buffer,
        });
      }
    },
    DEBOUNCE_DELAY
  );

  useEffect(() => {
    // Send local updates to remote
    doc.on("update", updateDocThrottled);

    // Sync initial data
    if (session && session.delta && shadow) {
      //Bring doc up to speed to shadow
      const shadowState = Y.encodeStateAsUpdate(shadow);
      Y.applyUpdate(doc, shadowState);

      // Then apply current updates too
      const array = new Uint8Array(session.delta);
      Y.applyUpdate(doc, array);
    }

    if (awareness && session) {
      awareness.on("update", updateAwarenessThrottled);
    }

    return () => doc.off("update", updateDocThrottled);
  }, [session?._id, shadow, awareness]);

  const onExitUser = useDebouncedCallback(() => {
    if (awareness && session) {
      AwarenessProtocol.removeAwarenessStates(awareness, [awareness.clientID], user.user?.id);
      
    }
  }, DEBOUNCE_DELAY);

  return {
    session,
    awareness,
    doc,
    createOrJoinSession,
    onExitUser
  };
}

"use client";

import { Editor, rootCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import React, { PropsWithChildren, useEffect } from "react";
import { nord } from "@milkdown/theme-nord";

import "@milkdown/theme-nord/style.css";

import * as Y from "yjs";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { useConvexY } from "@/hooks/use-convexy";
import { myPlugin } from "@/app/utils/test-plugin";
import { useDocument } from "@/hooks/useDocument";
import { Id } from "../../convex/_generated/dataModel";
import { usePathname, useSearchParams } from "next/navigation";

export const MilkdownEditor = ({ documentId }: { documentId: string }) => {
  const { loading, get } = useEditor((root) =>
    Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root);
      })
      .use(commonmark)
      .use(collab)
      .use(myPlugin)
  );
  // const { awareness } = useConvexY(doc, "room");
  const { session, awareness, createOrJoinSession, doc, onExitUser } =
    useDocument(documentId);

  useEffect(() => {
    if (!loading && awareness && doc) {
      const editor = get();
      if (editor) {
        editor.action((ctx) => {
          const collabService = ctx.get(collabServiceCtx);

          collabService
            // bind doc and awareness
            .bindDoc(doc)
            .setAwareness(awareness)
            .setOptions({
              yCursorOpts: {
                cursorBuilder: (args) => {
                  const element = document.createElement("span");
                  element.dataset["name"] = args.name;
                  element.id = "remote-cursor";
                  return element;
                },
              },
            })
            // connect yjs with milkdown
            .connect();
        });
      }
    }
  }, [loading, awareness, doc]);

  useEffect(() => {
    createOrJoinSession({ docId: documentId as Id<"documents"> });
  }, []);

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [init, setInit] = React.useState(false)
  useEffect(() => {
    console.log("path changed", pathname, searchParams, init)
    if (!init) {
      setInit(true)
    } else {
      console.log(awareness?.states,"navigated")
      onExitUser()
    }
  }, [pathname, searchParams])

  return <Milkdown />;
};

export function MilkdownEditorWrapper(props: PropsWithChildren) {
  return (
    <MilkdownProvider>
      <div className="m-10 border rounded-md p-5">{props.children}</div>
    </MilkdownProvider>
  );
}

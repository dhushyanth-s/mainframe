"use client";

import { Editor, rootCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { nord } from "@milkdown/theme-nord";

import "@milkdown/theme-nord/style.css";

import * as Y from "yjs";
import { useDocument } from "@/hooks/useDocument";
import { Id } from "../../convex/_generated/dataModel";
import { usePathname, useSearchParams } from "next/navigation";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";

const theme = {
  // Theme styling goes here
  //...
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

function MyOnChangePlugin({ onChange }: { onChange: (editorState: EditorState) => void }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      onChange(editorState);
      console.log(editorState);
    });
  }, [editor, onChange]);
  return null;
}

export const MilkdownEditor = ({ documentId }: { documentId: string }) => {
  // const { awareness } = useConvexY(doc, "room");
  const { session, awareness, createOrJoinSession, doc, onExitUser } =
    useDocument(documentId);

  useEffect(() => {
    createOrJoinSession({ docId: documentId as Id<"documents"> });
  }, []);

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };

  const [editorState, setEditorState] = useState<EditorState>();
  function onChange(editorState: EditorState) {
    setEditorState(editorState);
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            aria-placeholder={"Enter some text..."}
            placeholder={<div>Enter some text...</div>}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <MyOnChangePlugin onChange={onChange}/>
    </LexicalComposer>
  );
};

"use client";

import Collaboration from "@tiptap/extension-collaboration";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import * as Y from "yjs";
import { useConvexY } from "@/hooks/use-convexy";

const doc = new Y.Doc();

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.extend().configure({
        document: doc,
      }),
    ],
    content: "<p>Hello World! 🌎️</p>",
    immediatelyRender: false,
  });
	useConvexY(doc, "room")

  return <EditorContent editor={editor} />;
};

export default Tiptap;

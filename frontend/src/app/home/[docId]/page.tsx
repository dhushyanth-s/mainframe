"use client";

import { MilkdownEditor, MilkdownEditorWrapper } from "@/components/Doc";
import { useParams } from "next/navigation";

export default function Page() {
  const { docId } = useParams();

  return (
    <MilkdownEditorWrapper>
      <MilkdownEditor documentId={docId!.toString()} />
    </MilkdownEditorWrapper>
  );
}

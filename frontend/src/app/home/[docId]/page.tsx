"use client";

import { MilkdownEditor } from "@/components/Doc";
import { useParams } from "next/navigation";

export default function Page() {
  const { docId } = useParams();

  return (
    <MilkdownEditor documentId={docId!.toString()} />
  );
}

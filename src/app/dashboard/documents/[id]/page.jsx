"use client";
import { DocumentView } from "../../../../routes/Dashboard/Documents/view";

export default function DocumentPage({ params }) {
  return <DocumentView documentId={params.id} />;
} 
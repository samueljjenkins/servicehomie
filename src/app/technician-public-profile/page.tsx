import { Suspense } from "react";
import TechnicianPublicProfileClient from "./TechnicianPublicProfileClient";

export default function TechnicianPublicProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TechnicianPublicProfileClient />
    </Suspense>
  );
} 
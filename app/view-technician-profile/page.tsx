import { Suspense } from "react";
import ViewTechnicianProfileClient from "./ViewTechnicianProfileClient";

export default function ViewTechnicianProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewTechnicianProfileClient />
    </Suspense>
  );
} 
import { Suspense } from "react";
import DocPageInner from "./DocPageInner";

export default function Page() {
  return (
    <Suspense>
      <DocPageInner />
    </Suspense>
  );
}

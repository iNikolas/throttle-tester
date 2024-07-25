import React from "react";

import { RequestResults, ThrottleForm } from "./_components";

export default function Home() {
  return (
    <main>
      <ThrottleForm />
      <RequestResults />
    </main>
  );
}

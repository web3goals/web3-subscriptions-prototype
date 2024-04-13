"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mintUSDTokens } from "@/lib/actions";

export default function SandboxPage() {
  async function runTest1() {
    try {
      console.log("runTest1()");
      mintUSDTokens();
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Sandbox</h2>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col items-start gap-6"></div>
      <Button onClick={runTest1}>Run Test 1</Button>
    </div>
  );
}

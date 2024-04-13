"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { usdTokenAbi } from "@/contracts/abi/usdTokenAbi";
import { executeViaSmartAccount } from "@/lib/actions";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";

export default function SandboxPage() {
  const { address } = useAccount();

  async function printConnectedAccount() {
    console.log("Connected account:", address);
  }

  async function runTest1() {
    try {
      console.log("runTest1()");
      executeViaSmartAccount(
        address as `0x${string}`,
        siteConfig.contracts.usdt,
        encodeFunctionData({
          abi: usdTokenAbi,
          functionName: "mint",
          args: [BigInt(3)],
        })
      );
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
      <div className="flex flex-col items-start gap-4">
        <Button onClick={printConnectedAccount}>Print connected account</Button>
        <Button onClick={runTest1} variant="outline">
          Run Test 1
        </Button>
      </div>
    </div>
  );
}

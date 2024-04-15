"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usdTokenAbi } from "@/contracts/abi/usdTokenAbi";
import useSiteConfigContracts from "@/hooks/useSiteConfigContracts";
import { executeViaSmartAccount } from "@/lib/actions";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";

export default function SandboxPage() {
  const { address, chain } = useAccount();
  const { contracts } = useSiteConfigContracts(chain);

  async function mintUsdtViaSmartAccount() {
    try {
      console.log("mintUsdtViaSmartAccount");
      // console.log(contracts);
      executeViaSmartAccount(
        address as `0x${string}`,
        contracts.usdt,
        encodeFunctionData({
          abi: usdTokenAbi,
          functionName: "mint",
          args: [BigInt(3)],
        }),
        contracts
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
        <p>Account — {address}</p>
        <p>Chain — {chain?.id}</p>
        <Button onClick={mintUsdtViaSmartAccount}>
          Mint USDT (via Smart Account)
        </Button>
      </div>
    </div>
  );
}

"use server";

import { SiteConfigContracts, siteConfig } from "@/config/site";
import { accountAbi } from "@/contracts/abi/accountAbi";
import { accountFactoryAbi } from "@/contracts/abi/accountFactory";
import { entryPointAbi } from "@/contracts/abi/entryPoints";
import {
  createPublicClient,
  createWalletClient,
  decodeErrorResult,
  encodeFunctionData,
  etherUnits,
  http,
  parseUnits,
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

export async function generateAccount() {
  console.log("generateAccount");
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  console.log("privateKey:", privateKey);
  console.log("address:", account.address);
}

export async function getSmartAccountAddress(
  owner: `0x${string}`,
  contracts: SiteConfigContracts
): Promise<string | undefined> {
  console.log("getSmartAccountAddress");

  const fakeBundlerAccount = privateKeyToAccount(
    process.env.FAKE_BUNDLER_ACCOUNT_PRIVATE_KEY as `0x${string}`
  );

  const fakeBundlerWalletClient = createWalletClient({
    account: fakeBundlerAccount,
    chain: contracts.chain,
    transport: http(),
  });

  let initCode =
    contracts.accountFactory +
    encodeFunctionData({
      abi: accountFactoryAbi,
      functionName: "createAccount",
      args: [owner],
    }).slice(2);
  console.log("initCode:", initCode);

  let sender;
  try {
    await fakeBundlerWalletClient.writeContract({
      address: contracts.entryPoint,
      abi: entryPointAbi,
      functionName: "getSenderAddress",
      args: [initCode as `0x${string}`],
    });
  } catch (error: any) {
    console.log(
      "error:",
      error?.cause?.cause?.cause?.cause?.cause?.cause?.data
    );
    const value = decodeErrorResult({
      abi: entryPointAbi,
      data: error?.cause?.cause?.cause?.cause?.cause?.cause
        ?.data as `0x${string}`,
    });
    sender = value.args[0];
  }
  console.log("sender:", sender);

  return sender?.toString();
}

export async function executeViaSmartAccount(
  owner: `0x${string}`,
  executeDestination: `0x${string}`,
  executeFunction: `0x${string}`,
  contracts: SiteConfigContracts
): Promise<string> {
  console.log("executeViaSmartAccount");

  const fakeBundlerAccount = privateKeyToAccount(
    process.env.FAKE_BUNDLER_ACCOUNT_PRIVATE_KEY as `0x${string}`
  );

  const publicClient = createPublicClient({
    chain: contracts.chain,
    transport: http(),
  });

  const fakeBundlerWalletClient = createWalletClient({
    account: fakeBundlerAccount,
    chain: contracts.chain,
    transport: http(),
  });

  let initCode =
    contracts.accountFactory +
    encodeFunctionData({
      abi: accountFactoryAbi,
      functionName: "createAccount",
      args: [owner],
    }).slice(2);
  console.log("initCode:", initCode);

  let sender;
  try {
    await fakeBundlerWalletClient.writeContract({
      address: contracts.entryPoint,
      abi: entryPointAbi,
      functionName: "getSenderAddress",
      args: [initCode as `0x${string}`],
    });
  } catch (error: any) {
    // console.log("error:", JSON.stringify(error));
    // console.log(
    //   "error:",
    //   error?.cause?.cause?.cause?.cause?.cause?.cause?.data
    // );
    const value = decodeErrorResult({
      abi: entryPointAbi,
      data: error?.cause?.cause?.cause?.cause?.cause?.cause
        ?.data as `0x${string}`,
    });
    sender = value.args[0];
  }
  console.log("sender:", sender);

  const code = await publicClient.getBytecode({
    address: sender as `0x${string}`,
  });
  if (code) {
    initCode = "0x";
  }
  console.log("code:", code);

  const nonce = await publicClient.readContract({
    address: contracts.entryPoint,
    abi: entryPointAbi,
    functionName: "getNonce",
    args: [sender as `0x${string}`, BigInt(0)],
  });
  console.log("nonce:", nonce);

  const callData = encodeFunctionData({
    abi: accountAbi,
    functionName: "execute",
    args: [executeDestination, BigInt(0), executeFunction],
  });
  console.log("callData:", callData);

  const userOp = {
    sender: sender as `0x${string}`,
    nonce: nonce,
    initCode: initCode as `0x${string}`,
    callData: callData as `0x${string}`,
    callGasLimit: BigInt(10_000_000),
    verificationGasLimit: BigInt(1_000_000),
    preVerificationGas: BigInt(1_000_000),
    maxFeePerGas: parseUnits("2", etherUnits.gwei),
    maxPriorityFeePerGas: parseUnits("2", etherUnits.gwei),
    paymasterAndData: contracts.paymaster,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c" as `0x${string}`,
  };

  // Handle user operation without real bundler
  const tx = await fakeBundlerWalletClient.writeContract({
    address: contracts.entryPoint,
    abi: entryPointAbi,
    functionName: "handleOps",
    args: [[userOp], process.env.FAKE_BUNDLER_ACCOUNT_ADDRESS as `0x${string}`],
  });
  console.log("tx:", tx);

  return tx.toString();
}

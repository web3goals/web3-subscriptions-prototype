import { SiteConfigContracts } from "@/config/site";
import { productAbi } from "@/contracts/abi/product";
import { decodeErrorResult } from "viem";

/**
 * Convert error object to pretty object with error message and severity.
 */
export function errorToPrettyError(
  error: any,
  contracts: SiteConfigContracts
): {
  message: string;
  severity: "info" | "error" | undefined;
} {
  let message = JSON.stringify(error, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
  let severity: "info" | "error" | undefined = undefined;
  if (error?.message) {
    message = error.message;
  }
  if (error?.cause?.shortMessage) {
    message = error.cause.shortMessage;
  }
  if (
    error?.cause?.cause?.cause?.cause?.cause?.data &&
    error?.contractAddress == contracts?.product
  ) {
    const value = decodeErrorResult({
      abi: productAbi,
      data: error.cause.cause.cause.cause.cause?.data as `0x${string}`,
    });
    message = value.args[0] as string;
  }
  return {
    message: message,
    severity: severity,
  };
}

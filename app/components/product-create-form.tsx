"use client";

import { productAbi } from "@/contracts/abi/product";
import useError from "@/hooks/useError";
import { executeViaSmartAccount } from "@/lib/actions";
import { uploadJsonToIpfs } from "@/lib/ipfs";
import { chainToSiteConfigContracts } from "@/lib/siteConfig";
import { ProductMetadata } from "@/types/product-metadata";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  encodeFunctionData,
  isAddress,
  parseEther,
  parseEventLogs,
} from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";

export function ProductCreateForm() {
  const { handleError } = useError();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const router = useRouter();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const formSchema = z.object({
    icon: z.string(),
    label: z.string().min(1),
    description: z.string().min(1),
    subscriptionCost: z.coerce.number().gt(0),
    subscriptionToken: z.string().length(42),
    subscriptionChain: z.string(),
    subscriptionPeriod: z.string(),
    webhook: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: undefined,
      label: "",
      description: "",
      subscriptionCost: 5,
      subscriptionToken: "",
      subscriptionChain: undefined,
      subscriptionPeriod: undefined,
      webhook: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsFormSubmitting(true);
      // Check public client
      if (!publicClient) {
        throw new Error("Public client is not ready");
      }
      // Check wallet
      if (!address) {
        throw new Error("Wallet is not connected");
      }
      // Define contracts
      const contracts = chainToSiteConfigContracts(values.subscriptionChain);
      // Parse values
      let subscriptionCost = parseEther(String(values.subscriptionCost));
      let subscriptionToken;
      if (!isAddress(values.subscriptionToken)) {
        throw new Error("Subscription token address is incorrect");
      } else {
        subscriptionToken = values.subscriptionToken as `0x${string}`;
      }
      let subscriptionPeriod;
      if (values.subscriptionPeriod === "10minutes") {
        subscriptionPeriod = BigInt(10 * 60);
      } else if (values.subscriptionPeriod === "1day") {
        subscriptionPeriod = BigInt(24 * 60 * 60);
      } else if (values.subscriptionPeriod === "1week") {
        subscriptionPeriod = BigInt(7 * 24 * 60 * 60);
      } else if (values.subscriptionPeriod === "30days") {
        subscriptionPeriod = BigInt(30 * 24 * 60 * 60);
      } else {
        throw new Error("Subscription period is incorrect");
      }
      // Upload metadata to IPFS
      const metadata: ProductMetadata = {
        icon: values.icon,
        label: values.label,
        description: values.description,
        webhook: values.webhook,
      };
      const metadataUri = await uploadJsonToIpfs(metadata);
      // Send requests to create a product via smart account
      const createTxHash = await executeViaSmartAccount(
        address,
        contracts.product,
        encodeFunctionData({
          abi: productAbi,
          functionName: "create",
          args: [metadataUri],
        }),
        contracts
      );
      const createTxReceipt = await publicClient.waitForTransactionReceipt({
        hash: createTxHash as `0x${string}`,
      });
      const createTxLogs = parseEventLogs({
        abi: productAbi,
        eventName: "Transfer",
        logs: createTxReceipt.logs,
      });
      const createdProductId = createTxLogs[0].args.tokenId;
      // Send request to set product params via smart account
      const setParamstxHash = await executeViaSmartAccount(
        address,
        contracts.product,
        encodeFunctionData({
          abi: productAbi,
          functionName: "setParams",
          args: [
            createdProductId,
            subscriptionCost,
            subscriptionToken,
            subscriptionPeriod,
          ],
        }),
        contracts
      );
      await publicClient.waitForTransactionReceipt({
        hash: setParamstxHash as `0x${string}`,
      });
      // Show success message
      toast({
        title: "Product created 👌",
      });
      router.push("/dashboard");
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isFormSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="🤖">🤖</SelectItem>
                  <SelectItem value="🦄">🦄</SelectItem>
                  <SelectItem value="⭐">⭐</SelectItem>
                  <SelectItem value="📧">📧</SelectItem>
                  <SelectItem value="🎁">🎁</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="AI Assistant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="All features, 24/7 support..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subscriptionCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription cost</FormLabel>
              <FormControl>
                <Input placeholder="5" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subscriptionToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription token</FormLabel>
              <FormControl>
                <Input
                  placeholder="0x0000000000000000000000000000000000000000"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subscriptionChain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription chain</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isFormSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a chain" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="128123">Etherlink Testnet</SelectItem>
                  <SelectItem value="8082">Shardeum Testnet</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subscriptionPeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription period</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isFormSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="10minutes">10 minutes</SelectItem>
                  <SelectItem value="1day">1 day</SelectItem>
                  <SelectItem value="1week">1 week</SelectItem>
                  <SelectItem value="30days">30 days</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="webhook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Webhook</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://company.com/api/subscriptions"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isFormSubmitting}>
          {isFormSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create
        </Button>
      </form>
    </Form>
  );
}

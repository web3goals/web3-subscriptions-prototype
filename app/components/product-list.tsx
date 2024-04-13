"use client";

import { siteConfig } from "@/config/site";
import { entryPointAbi } from "@/contracts/abi/entryPoints";
import { productAbi } from "@/contracts/abi/product";
import useError from "@/hooks/useError";
import { getSmartAccountAddress } from "@/lib/actions";
import { addressToShortAddress } from "@/lib/converters";
import { ProductMetadata } from "@/types/product-metadata";
import { Separator } from "@radix-ui/react-separator";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { erc20Abi, formatEther, isAddressEqual, zeroAddress } from "viem";
import {
  useAccount,
  useInfiniteReadContracts,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from "wagmi";
import EntityList from "./entity-list";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { toast } from "./ui/use-toast";
import useMetadataLoader from "@/hooks/useMetadataLoader";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const LIMIT = 42;

export function ProductList() {
  const { address } = useAccount();
  const [smartAccountAddress, setSmartAccountAddress] = useState<
    `0x${string}` | undefined
  >();
  const [products, setProducts] = useState<string[] | undefined>();

  const { data } = useInfiniteReadContracts({
    cacheKey: "products",
    contracts(pageParam) {
      return [...new Array(LIMIT)].map(
        (_, i) =>
          ({
            address: siteConfig.contracts.product,
            abi: productAbi,
            functionName: "ownerOf",
            args: [BigInt(pageParam + i)],
          } as const)
      );
    },
    query: {
      initialPageParam: 0,
      getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
        return lastPageParam + 1;
      },
    },
  });

  useEffect(() => {
    setSmartAccountAddress(undefined);
    if (address) {
      getSmartAccountAddress(address).then((smartAccountAddress) =>
        setSmartAccountAddress(smartAccountAddress as `0x${string}`)
      );
    }
  }, [address]);

  useEffect(() => {
    setProducts(undefined);
    if (address && data && smartAccountAddress) {
      const products: string[] = [];
      const owners = (data as any).pages[0];
      for (let i = 0; i < owners.length; i++) {
        const element = owners[i];
        if (
          isAddressEqual(element.result || zeroAddress, smartAccountAddress)
        ) {
          products.push(String(i));
        }
      }
      setProducts(products);
    }
  }, [address, data, smartAccountAddress]);

  return (
    <EntityList
      entities={products}
      renderEntityCard={(product, index) => (
        <ProductCard key={index} product={product} />
      )}
      noEntitiesText="No products 😐"
    />
  );
}

export function ProductCard(props: { product: string }) {
  return (
    <div className="w-full flex flex-col items-center border rounded px-4 py-4">
      <ProductCardHeader product={props.product} />
      <Separator className="my-4" />
      <ProductCardSubscribers product={props.product} />
    </div>
  );
}

function ProductCardHeader(props: { product: string }) {
  /**
   * Define product data
   */
  const {
    data: productParams,
    isFetched: isProductParamsFetched,
    refetch: refetchProductParams,
  } = useReadContract({
    address: siteConfig.contracts.product,
    abi: productAbi,
    functionName: "getParams",
    args: [BigInt(props.product)],
  });
  const { data: productMetadataUri, isFetched: isProductMetadataUriFetched } =
    useReadContract({
      address: siteConfig.contracts.product,
      abi: productAbi,
      functionName: "tokenURI",
      args: [BigInt(props.product)],
    });
  const { data: productMetadata, isLoaded: isProductMetadataLoaded } =
    useMetadataLoader<ProductMetadata>(productMetadataUri);

  /**
   * Define product subscription token symbol
   */
  const {
    data: productSubscriptionTokenSymbol,
    isFetched: isProductSubscriptionTokenSymbol,
  } = useReadContract({
    address: productParams?.subscriptionToken || zeroAddress,
    abi: erc20Abi,
    functionName: "symbol",
  });

  function OpenPageButton() {
    return (
      <a href={`/products/${props.product}`} target="_blank">
        <Button>Open Product Page</Button>
      </a>
    );
  }

  function WithdrawButton() {
    const { handleError } = useError();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // TODO: Use smart account
    async function onSubmit() {
      try {
        setIsSubmitting(true);
        // Check clients
        if (!publicClient) {
          throw new Error("Public client is not ready");
        }
        if (!walletClient) {
          throw new Error("Wallet is not connected");
        }
        // Send request
        const { request } = await publicClient.simulateContract({
          account: walletClient.account.address,
          address: siteConfig.contracts.product,
          abi: productAbi,
          functionName: "withdraw",
          args: [BigInt(props.product)],
        });
        const txHash = await walletClient.writeContract(request);
        await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });
        // Show success message
        refetchProductParams();
        toast({
          title: "Withdrawn successfully 👌",
        });
      } catch (error: any) {
        handleError(error, true);
      } finally {
        setIsSubmitting(false);
      }
    }

    return (
      <Button
        variant="outline"
        disabled={isSubmitting}
        onClick={() => onSubmit()}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Withdraw Balance
      </Button>
    );
  }

  if (
    !isProductParamsFetched ||
    !isProductMetadataUriFetched ||
    !isProductMetadataLoaded ||
    !isProductSubscriptionTokenSymbol
  ) {
    return <Skeleton className="w-full h-8" />;
  }

  return (
    <div className="w-full flex flex-row gap-4">
      {/* Icon */}
      <div>
        <Avatar className="size-16">
          <AvatarImage src="" alt="Icon" />
          <AvatarFallback className="text-3xl bg-slate-500">
            {productMetadata?.icon}
          </AvatarFallback>
        </Avatar>
      </div>
      {/* Content */}
      <div className="w-full">
        <p className="text-xl font-bold">{productMetadata?.label}</p>
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[140px] text-sm text-muted-foreground">
              Subscription cost:
            </p>
            <p className="text-sm break-all">
              {formatEther(productParams?.subscriptionCost || BigInt(0))}{" "}
              {productSubscriptionTokenSymbol}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[140px] text-sm text-muted-foreground">
              Subscription period:
            </p>
            <p className="text-sm break-all">
              {productParams?.subscriptionPeriod === BigInt(60 * 10)
                ? "10 minutes"
                : productParams?.subscriptionPeriod === BigInt(24 * 60 * 60)
                ? "1 day"
                : productParams?.subscriptionPeriod === BigInt(7 * 24 * 60 * 60)
                ? "7 days"
                : productParams?.subscriptionPeriod ===
                  BigInt(30 * 24 * 60 * 60)
                ? "30 days"
                : `${productParams?.subscriptionPeriod?.toString()} seconds`}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[140px] text-sm text-muted-foreground">
              Subscription token:
            </p>
            <p className="text-sm break-all">
              <a
                href={`${siteConfig.contracts.chain.blockExplorers.default.url}/address/${productParams?.subscriptionToken}`}
                target="_blank"
                className="underline underline-offset-4"
              >
                {addressToShortAddress(
                  productParams?.subscriptionToken || zeroAddress
                )}
              </a>
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[140px] text-sm text-muted-foreground">
              Balance:
            </p>
            <p className="text-sm break-all">
              {formatEther(productParams?.balance || BigInt(0))}{" "}
              {productSubscriptionTokenSymbol}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-6 md:flex-row">
          <OpenPageButton />
          <WithdrawButton />
        </div>
      </div>
    </div>
  );
}

// TODO: Implement
function ProductCardSubscribers(props: { product: string }) {
  return <Skeleton className="w-full h-4" />;
}

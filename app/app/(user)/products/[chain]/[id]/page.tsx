"use client";

import { Product } from "@/components/product";
import useSiteConfigContracts from "@/hooks/useSiteConfigContracts";

export default function ProfilePage({
  params,
}: {
  params: { chain: number; id: string };
}) {
  const { contracts } = useSiteConfigContracts(params.chain);

  return (
    <div className="container py-10 lg:px-80">
      <Product product={params.id} contracts={contracts} />
    </div>
  );
}

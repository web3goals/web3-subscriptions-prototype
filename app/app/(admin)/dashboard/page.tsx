import { ProductList } from "@/components/product-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Products you offer to Web3 users
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col items-start gap-6">
        <Link href="/dashboard/products/new">
          <Button>Create Product</Button>
        </Link>
        <ProductList contracts={siteConfig.contracts.etherlinkTestnet} />
        {/* TODO: Use the next code  */}
        {/* {Object.values(siteConfig.contracts).map((contracts, index) => (
          <ProductList key={index} contracts={contracts} />
        ))} */}
      </div>
    </div>
  );
}

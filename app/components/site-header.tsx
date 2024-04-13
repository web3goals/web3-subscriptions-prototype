"use client";

import { siteConfig } from "@/config/site";
import { addressToShortAddress } from "@/lib/converters";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export function SiteHeader() {
  const { address } = useAccount();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block text-primary font-bold">
              {siteConfig.emoji}{" "}
              <span className="hidden md:inline-block">{siteConfig.name}</span>
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-8">
          <ConnectButton />
          {address && (
            <Link
              href={`/dashboard`}
              className="hidden md:block text-sm font-medium text-muted-foreground"
            >
              Dashboard
            </Link>
          )}
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="hidden md:block text-sm font-medium text-muted-foreground"
          >
            GitHub
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function ConnectButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { address } = useAccount();

  if (ready && !authenticated) {
    return <Button onClick={login}>Login</Button>;
  }

  if (ready && authenticated) {
    return (
      <Button variant="outline" onClick={logout}>
        Logout{" "}
        {address && (
          <span className="text-xs text-muted-foreground pl-1">
            ({addressToShortAddress(address)})
          </span>
        )}
      </Button>
    );
  }

  return <></>;
}

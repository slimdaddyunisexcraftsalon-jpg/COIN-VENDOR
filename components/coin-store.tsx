"use client"

import { useMemo, useState } from "react"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { platforms, type PlatformId } from "@/lib/packages"
import { PackageCard } from "@/components/package-card"
import { CheckoutPanel } from "@/components/checkout-panel"

export function CoinStore() {
  const [platformId, setPlatformId] = useState<PlatformId>("mashi")
  // selected package id per platform, so switching tabs keeps a sensible default
  const [selectedByPlatform, setSelectedByPlatform] = useState<Record<string, string>>({})

  const platform = useMemo(
    () => platforms.find((p) => p.id === platformId)!,
    [platformId],
  )

  const defaultPackage =
    platform.packages.find((p) => p.popular) ?? platform.packages[0]
  const selectedId = selectedByPlatform[platformId] ?? defaultPackage.id
  const selected =
    platform.packages.find((p) => p.id === selectedId) ?? defaultPackage

  function selectPackage(id: string) {
    setSelectedByPlatform((prev) => ({ ...prev, [platformId]: id }))
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 text-center sm:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-64 max-w-2xl rounded-full bg-primary/15 blur-3xl"
        />
        <p className="relative inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
          <Zap className="size-3.5" aria-hidden />
          Instant Coin Delivery
        </p>
        <h1 className="relative mx-auto mt-5 max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
          Top Up Your <span className="text-primary">{platform.name}</span> Instantly
        </h1>
        <p className="relative mx-auto mt-4 max-w-lg text-pretty text-sm text-muted-foreground sm:text-base">
          Select your platform and package — top up directly to your Account ID
          within minutes.
        </p>
      </section>

      {/* Platform tabs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {platforms.map((p) => {
          const active = p.id === platformId
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatformId(p.id)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                active
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border/60 bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <span aria-hidden>{p.emoji}</span>
              {p.name}
            </button>
          )
        })}
      </div>

      {/* Section title */}
      <h2 className="mt-9 text-center text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
        <span className="text-primary">{platform.short} Coins</span> Packages
      </h2>

      {/* Package grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {platform.packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            selected={pkg.id === selected.id}
            onSelect={() => selectPackage(pkg.id)}
          />
        ))}
      </div>

      <CheckoutPanel platformName={platform.name} selected={selected} />
    </main>
  )
    }

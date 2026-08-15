import { Crown } from "lucide-react"
import { platforms } from "@/lib/packages"

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-10 text-center sm:px-6">
        <div className="flex items-center gap-2">
          <Crown className="size-5 text-primary" aria-hidden />
          <span className="font-display text-lg font-extrabold">APP&apos;S COIN HUB</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Fast, Secure &amp; Reliable Coin Top-Ups
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-2">
          {platforms.map((p) => (
            <li
              key={p.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <span aria-hidden>{p.emoji}</span>
              {p.short}
            </li>
          ))}
        </ul>

        <p className="text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} APP&apos;S COIN HUB. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

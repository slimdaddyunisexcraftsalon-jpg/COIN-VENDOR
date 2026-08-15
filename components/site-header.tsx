import Image from "next/image"
import { Headphones, MessageCircle } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center overflow-hidden rounded-full ring-2 ring-primary/60 shadow-[0_0_18px_-2px_var(--color-primary)]">
            <Image
              src="/coin-hub-logo.jpg"
              alt="APP'S COIN HUB logo"
              width={36}
              height={36}
              className="size-full object-cover"
              priority
            />
          </span>
          <span className="font-display text-base font-extrabold tracking-tight sm:text-lg">
            APP&apos;S COIN HUB
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/2347030821026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-xs font-semibold text-accent-foreground transition-transform hover:scale-[1.03] sm:text-sm"
          >
            <Headphones className="size-4" aria-hidden />
            Customer Care
          </a>
          <a
            href="https://wa.me/2347030821026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary sm:text-sm"
          >
            <MessageCircle className="size-4" aria-hidden />
            Contact Traders
          </a>
        </div>
      </div>
    </header>
  )
}

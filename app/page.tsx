import { SiteHeader } from "@/components/site-header"
import { CoinStore } from "@/components/coin-store"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div 
      className="min-h-dvh bg-cover bg-center bg-no-repeat bg-fixed text-foreground relative"
      style={{
        backgroundImage: "url('/space-bg.jpg')",
      }}
    >
      {/* Dark overlay so your text/buttons stay easy to read */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      <div className="relative z-10">
        <SiteHeader />
        <CoinStore />
        <SiteFooter />
      </div>
    </div>
  )
}

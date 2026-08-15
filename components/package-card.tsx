import { cn } from "@/lib/utils"
import { formatCoins, formatNaira, type CoinPackage } from "@/lib/packages"

type Props = {
  pkg: CoinPackage
  selected: boolean
  onSelect: () => void
}

export function PackageCard({ pkg, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card p-3.5 text-left transition-all",
        "hover:-translate-y-0.5 hover:border-primary/60",
        selected
          ? "border-primary shadow-[0_0_0_1px_var(--color-primary),0_10px_30px_-12px_var(--color-primary)]"
          : "border-border/60",
      )}
    >
      {pkg.popular && (
        <span className="absolute -top-2 right-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
          Popular
        </span>
      )}

      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {pkg.label}
      </span>
      <span className="mt-1 font-display text-lg font-extrabold text-primary tabular-nums">
        {formatCoins(pkg.coins)}
      </span>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold tabular-nums">
          <span className="text-muted-foreground">₦</span>
          {formatNaira(pkg.price)}
        </span>
        <span
          className={cn(
            "rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground",
          )}
        >
          {selected ? "Selected" : "Select"}
        </span>
      </div>
    </button>
  )
        }

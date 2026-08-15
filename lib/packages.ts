export type PlatformId = "mashi" | "yogo" 

export type CoinPackage = {
  id: string
  /** small caption above the coin amount, e.g. "COINS ($5)" or "COINS" */
  label: string
  /** number of coins delivered */
  coins: number
  /** price in Naira */
  price: number
  popular?: boolean
}

export type Platform = {
  id: PlatformId
  name: string
  /** short label used on badges/footer */
  short: string
  emoji: string
  packages: CoinPackage[]
}

/** Naira number formatting with thousands separators */
export function formatNaira(value: number): string {
  return new Intl.NumberFormat("en-NG").format(value)
}

export function formatCoins(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

// --- Mashi: priced in dollar tiers ($0.5, $1, $2 ... $50) ---
const mashiTiers = [0.5, ...Array.from({ length: 50 }, (_, i) => i + 1)]
const mashiPackages: CoinPackage[] = mashiTiers.map((usd, i) => {
  const coins = Math.round(usd * 120_000)
  // Base rate ₦1,350 per $1, with a small ₦150 discount from $2 upward.
  const price = usd >= 2 ? usd * 1350 - 150 : usd * 1350
  return {
    id: `mashi-${i}`,
    label: `COINS ($${usd})`,
    coins,
    price: Math.round(price),
    popular: usd === 5 || usd === 10,
  }
})

// Generic linear generator for the other platforms.
function linearPackages(
  prefix: PlatformId,
  coinsPerUnit: number,
  pricePerUnit: number,
  count: number,
  popularUnits: number[] = [5],
): CoinPackage[] {
  return Array.from({ length: count }, (_, i) => {
    const unit = i + 1
    return {
      id: `${prefix}-${i}`,
      label: "COINS",
      coins: coinsPerUnit * unit,
      price: pricePerUnit * unit,
      popular: popularUnits.includes(unit),
    }
  })
}

export const platforms: Platform[] = [
  {
    id: "mashi",
    name: "Mashi Coins",
    short: "Mashi",
    emoji: "🎯",
    packages: mashiPackages,
  },
  {
    id: "yogo",
    name: "YoGo Coins",
    short: "Yogo",
    emoji: "🪩",
    packages: linearPackages("yogo", 100_500, 1400, 40, [5, 10]),
  },
  { 
    
export const BANK_DETAILS = {
  accountNumber: "9033710830",
  bankName: "Moniepoint Microfinance Bank",
  accountName: "AB DOT VENTURES AND PROPERTY",
    }

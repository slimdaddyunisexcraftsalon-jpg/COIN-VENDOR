"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy, FileText, Landmark, Upload, Wallet, X } from "lucide-react"
import { BANK_DETAILS, formatNaira, type CoinPackage } from "@/lib/packages"

type Props = {
  platformName: string
  selected: CoinPackage | null
}

export function CheckoutPanel({ platformName, selected }: Props) {
  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [appName, setAppName] = useState(platformName)
  const [username, setUsername] = useState("")
  const [accountId, setAccountId] = useState("")
  const [phone, setPhone] = useState("")
  const [invoice, setInvoice] = useState<File | null>(null)
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setAppName(platformName)
  }, [platformName])

  useEffect(() => {
    if (invoice && invoice.type.startsWith("image/")) {
      const url = URL.createObjectURL(invoice)
      setInvoicePreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setInvoicePreview(null)
  }, [invoice])

  function handleInvoiceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInvoice(e.target.files?.[0] ?? null)
  }

  function removeInvoice() {
    setInvoice(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(BANK_DETAILS.accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // ignore
    }
  }

  async function handleSubmit() {
    setLoading(true)

    const coinsCount = selected ? selected.coins : 0
    const rawPrice = selected ? selected.price : 0
    const packageDetails = selected
      ? `${selected.coins.toLocaleString()} Coins`
      : "N/A"
    const totalAmount = selected
      ? `₦${formatNaira(selected.price)}`
      : "₦0"

    const webhookUrl =
      process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL ||
      "https://hook.eu1.make.com/s5sof2mux4u4smu2nf3opml11cylme1l"

    let telegramSuccess = false

    // 1. Primary Call: Send Order to Next.js API (Telegram Alert)
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appName: appName || platformName,
          name: username,
          userId: accountId,
          phone: phone,
          coins: coinsCount,
          price: rawPrice,
          paymentType: "Bank Transfer",
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        telegramSuccess = true
      } else {
        console.error("Telegram API Error:", data)
      }
    } catch (err) {
      console.error("Failed to connect to /api/order:", err)
    }

    // 2. Backup Call: Make.com Webhook
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "bank_transfer_order",
          customer_name: username,
          amount: totalAmount,
          platform: appName,
          status: "pending_verification",
          accountId: accountId,
          phone: phone,
          package: packageDetails,
        }),
      })
    } catch (err) {
      console.error("Webhook error:", err)
    }

    setLoading(false)

    if (telegramSuccess) {
      setSubmitted(true)
    } else {
      alert("Order submission failed. Please check your network or try again.")
    }
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background/60 px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring"

  return (
    <section
      id="checkout"
      aria-label="Payment details"
      className="mx-auto mt-14 max-w-md rounded-2xl border border-primary/25 bg-card/70 p-5 shadow-[0_20px_60px_-30px_var(--color-primary)] sm:p-6"
    >
      <div className="rounded-xl border border-border/60 bg-background/50 p-4 text-center">
        <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <Landmark className="size-3.5" aria-hidden />
          Bank Transfer Details
        </p>
        <p className="mt-3 font-display text-2xl font-extrabold tracking-[0.15em] tabular-nums sm:text-3xl">
          {BANK_DETAILS.accountNumber}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{BANK_DETAILS.bankName}</p>
        <p className="text-sm text-muted-foreground">
          Account Name: {BANK_DETAILS.accountName}
        </p>
        <button
          type="button"
          onClick={copyAccount}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? "Copied!" : "Copy Account Number"}
        </button>
      </div>

      <form
        className="mt-5 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!invoice || loading) return
          handleSubmit()
        }}
      >
        <Field label="App Name" required>
          <input
            className={inputClass}
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            aria-label="App Name"
          />
        </Field>

        <Field label="Username" required>
          <input
            className={inputClass}
            placeholder="e.g. Coin Seller"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="Username"
            required
          />
        </Field>

        <Field label="Account ID" required>
          <input
            className={inputClass}
            placeholder="e.g. 10094"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            aria-label="Account ID"
            required
          />
        </Field>

        <Field label="Phone Number (WhatsApp)">
          <input
            className={inputClass}
            placeholder="+2347030821026"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-label="Phone Number (WhatsApp)"
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">
            Payment Invoice / Receipt<span className="text-primary"> *</span>
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="sr-only"
            onChange={handleInvoiceChange}
            aria-label="Upload payment invoice or receipt"
          />
          {!invoice ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 bg-background/40 px-4 py-6 text-center transition-colors hover:border-primary hover:bg-primary/5"
            >
              <Upload className="size-5 text-primary" aria-hidden />
              <span className="text-sm font-medium">Upload proof of payment</span>
              <span className="text-xs text-muted-foreground">
                Image or PDF, after you complete the transfer
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2.5">
              {invoicePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={invoicePreview || "/placeholder.svg"}
                  alt="Payment invoice preview"
                  className="size-10 rounded-md object-cover"
                />
              ) : (
                <FileText className="size-6 shrink-0 text-accent" aria-hidden />
              )}
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{invoice.name}</span>
              <button
                type="button"
                onClick={removeInvoice}
                aria-label="Remove uploaded invoice"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-3.5 py-3">
          <span className="text-sm font-medium text-muted-foreground">
            Selected Package Price:
          </span>
          <span className="font-display text-lg font-extrabold text-primary tabular-nums">
            ₦{selected ? formatNaira(selected.price) : "0"}
          </span>
        </div>

        <button
          type="submit"
          disabled={!invoice || loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <Wallet className="size-4" aria-hidden />
          {loading ? "Submitting Order..." : "Confirm Bank Transfer Order"}
        </button>
        {!invoice && (
          <p className="-mt-2 text-center text-xs text-muted-foreground">
            Upload your payment invoice to enable order confirmation.
          </p>
        )}

        {submitted && (
          <p
            role="status"
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 text-center text-sm font-medium text-emerald-400"
          >
            ✅ Order received! We are processing your coins now.
          </p>
        )}
      </form>
    </section>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-primary"> *</span>}
      </span>
      {children}
    </label>
  )
          }

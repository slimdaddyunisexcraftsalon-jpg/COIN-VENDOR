import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { appName, name, userId, phone, coins, price, paymentType } = body

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    // Safety check for Environment Variables
    if (!botToken || !chatId) {
      console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in Vercel settings.")
      return NextResponse.json(
        { success: false, error: "Telegram keys are missing in Vercel Environment Variables." },
        { status: 400 }
      )
    }

    const message = 
      `🚨 *NEW COIN ORDER RECEIVED!* 🚨\n\n` +
      `📱 *App Name:* ${appName || "N/A"}\n` +
      `👤 *Username:* ${name || "N/A"}\n` +
      `🆔 *Account ID:* ${userId || "N/A"}\n` +
      `📞 *WhatsApp:* ${phone || "N/A"}\n` +
      `🪙 *Coins:* ${coins ? coins.toLocaleString() : 0}\n` +
      `💰 *Price:* ₦${price ? price.toLocaleString() : 0}\n` +
      `💳 *Payment Method:* ${paymentType || "Bank Transfer"}`

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

    const telegramRes = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })

    const telegramData = await telegramRes.json()

    if (!telegramRes.ok) {
      console.error("Telegram API Error:", telegramData)
      return NextResponse.json(
        { success: false, error: telegramData.description || "Failed to send Telegram alert" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: telegramData })
  } catch (error: any) {
    console.error("Internal Route Error:", error)
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
} 

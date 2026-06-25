import generatePayload from "promptpay-qr";
import QRCode from "qrcode";
import { getSetting } from "@/lib/settings";

// Build an EMVCo PromptPay QR (as a PNG data URL) for the given THB amount,
// using the shop's configured PromptPay id (phone number or national ID).
export async function promptpayQrDataUrl(
  amount: number,
): Promise<{ dataUrl: string; id: string } | null> {
  const id = (await getSetting("promptpayId")).trim();
  if (!id) return null;
  try {
    const payload = generatePayload(id, { amount });
    const dataUrl = await QRCode.toDataURL(payload, {
      margin: 1,
      width: 240,
      color: { dark: "#1b1a18", light: "#ffffff" },
    });
    return { dataUrl, id };
  } catch {
    return null;
  }
}

import QRCode from "qrcode";

export function getPublicUrl(qrToken: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/q/${qrToken}`;
}

export async function generateQRDataUrl(url: string) {
  return QRCode.toDataURL(url, {
    width: 300,
    margin: 1,
    errorCorrectionLevel: "M",
  });
}

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;
export const QR_SIZE_PX = 105;
export const QR_TOP_PX = 225;
export const QR_LEFT_PX = 640;
export const QR_RIGHT_PX = 49;

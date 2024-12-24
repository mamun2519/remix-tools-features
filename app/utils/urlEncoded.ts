/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlEncoded = (text: any, charset = "utf-8" as any) => {
  const buffer = Buffer.from(text, charset);
  const encoded = buffer.toString("base64");
  const urlSafeBase64 = encoded
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // URL-safe encoding
  return urlSafeBase64;
};

export const urlDecoded = (text: any, charset = "utf-8" as any) => {
  const base64 = text.replace(/-/g, "+").replace(/_/g, "/"); // Convert URL-safe Base64 to standard Base64
  const buffer = Buffer.from(base64, "base64");
  const decoded = buffer.toString(charset);
  return decoded;
};

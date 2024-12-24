// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlEncoded = (text: any, charset = "utf-8" as any) => {
  const buffer = Buffer.from(text, charset);
  const result = buffer.toString("base64");
  return result;
};

export const urlDecoded = (text: any, charset = "utf-8" as any) => {
  const buffer = Buffer.from(text, "base64");
  const result = buffer.toString(charset);
  return result;
};

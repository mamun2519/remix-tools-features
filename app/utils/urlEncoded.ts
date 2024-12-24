/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlEncoded = (text: any) => {
  return encodeURIComponent(text);
};

export const urlDecoded = (text: any) => {
  const decoded = decodeURIComponent(text);
  return decoded;
};

export function encodeToBase64(input, charset = "utf-8") {
  const buffer = iconv.encode(input, charset);
  return buffer.toString("base64");
}

export function decodeFromBase64(input, charset = "utf-8") {
  const buffer = Buffer.from(input, "base64");
  return iconv.decode(buffer, charset);
}

const Base64EncodedDecodedConverter = () => {
  return <div>Hello world</div>;
};

export default Base64EncodedDecodedConverter;

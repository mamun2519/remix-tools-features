import iconv from "iconv-lite";
export function encodeToBase64(input: string, charset = "utf-8") {
  const buffer = iconv.encode(input, charset);
  return buffer.toString("base64");
}

const Base64EncodedDecodedConverter = () => {
  return <div>Hello world</div>;
};

export default Base64EncodedDecodedConverter;

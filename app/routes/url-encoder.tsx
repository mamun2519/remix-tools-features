import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Url encoded" },
    {
      name: "description",
      content: "url encoded tools",
    },
  ];
};

const UrlEncodedTools = () => {
  return (
    <div className="mx-auto mt-20 max-w-4xl border p-6">
      <h1 className="mb-4 text-2xl font-bold">Base64 Encoder/Decoder Tools</h1>
    </div>
  );
};

export default UrlEncodedTools;

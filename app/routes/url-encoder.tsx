import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Base64 encoded & decoded" },
    {
      name: "description",
      content: "Base64 encoded & decoded tools",
    },
  ];
};

const UrlEncodedTools = () => {
  return <div>This is url encoded tools</div>;
};

export default UrlEncodedTools;

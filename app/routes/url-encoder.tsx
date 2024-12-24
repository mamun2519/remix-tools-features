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
  return <div>This is url encoded tools</div>;
};

export default UrlEncodedTools;

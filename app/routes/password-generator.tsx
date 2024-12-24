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
const PasswordGeneratorTools = () => {
  return <div>Hello password generator tools</div>;
};

export default PasswordGeneratorTools;

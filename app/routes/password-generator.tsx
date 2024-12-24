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
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    useNumbers: true,
    useUppercase: true,
    useLowercase: true,
    useSymbols: false,
    allowDuplicates: true,
    allowSequential: true,
  });
  return <div>Hello password generator tools</div>;
};

export default PasswordGeneratorTools;

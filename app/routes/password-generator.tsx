import { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { generatePassword } from "~/utils/passwordGenerator";

export const meta: MetaFunction = () => {
  return [
    { title: "Password Generator" },
    {
      name: "description",
      content: "password generator tools",
    },
  ];
};

interface Options {
  useNumbers: boolean;
  useUppercase: boolean;
  useLowercase: boolean;
  useSymbols: boolean;
  allowDuplicates: boolean;
  allowSequential: boolean;
}
const PasswordGeneratorTools = () => {
  const [length, setLength] = useState<number>(12);
  const [options, setOptions] = useState<Options>({
    useNumbers: true,
    useUppercase: true,
    useLowercase: true,
    useSymbols: false,
    allowDuplicates: true,
    allowSequential: true,
  });

  const [passwords, setPasswords] = useState<string[]>([]);

  const handleOptionChange = (key: keyof Options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = () => {
    const generated = generatePassword({ length, ...options });
    setPasswords(generated);
  };

  return <div>Hello password generator tools</div>;
};

export default PasswordGeneratorTools;

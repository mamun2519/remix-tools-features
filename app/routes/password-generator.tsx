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

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-6">
      <h1 className="mb-4 text-2xl font-bold">Password Generator</h1>

      <div className="w-full max-w-md rounded-md bg-white p-4 shadow-md">
        <label className="mb-2 block">
          <span className="text-gray-700">Password Length</span>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-1 w-full rounded-md border px-3 py-2 focus:ring focus:ring-blue-200"
            min={4}
            max={128}
          />
        </label>

        <div className="mb-4">
          {[
            { label: "Numbers", key: "useNumbers" },
            { label: "Uppercase Letters", key: "useUppercase" },
            { label: "Lowercase Letters", key: "useLowercase" },
            { label: "Symbols", key: "useSymbols" },
            { label: "Allow Duplicate Characters", key: "allowDuplicates" },
            { label: "Allow Sequential Characters", key: "allowSequential" },
          ].map(({ label, key }) => (
            <label key={key} className="block text-gray-700">
              <input
                type="checkbox"
                checked={options[key as keyof Options]}
                onChange={() => handleOptionChange(key as keyof Options)}
                className="mr-2"
              />
              {label}
            </label>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          Generate Passwords
        </button>
      </div>

      {passwords.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="mb-2 text-lg font-bold">Generated Passwords</h2>
          <ul className="rounded-md bg-white p-4 shadow-md">
            {passwords.map((pwd, idx) => (
              <li
                key={idx}
                className="border-b py-2 text-gray-800 last:border-b-0"
              >
                {pwd}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordGeneratorTools;

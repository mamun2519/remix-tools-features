// routes/password-generator.tsx
import { useState, useEffect } from "react";
import { generatePassword } from "~/utils/passwordGenerator";
// import { generatePassword } from "~/utils/passwordGenerator";

interface Options {
  useNumbers: boolean;
  useUppercase: boolean;
  useLowercase: boolean;
  useSymbols: boolean;
  allowDuplicates: boolean;
  allowSequential: boolean;
}
const SelectOptions = [
  { label: "Numbers", key: "useNumbers" },
  { label: "Uppercase Letters", key: "useUppercase" },
  { label: "Lowercase Letters", key: "useLowercase" },
  { label: "Symbols", key: "useSymbols" },
  { label: "Allow Duplicate Characters", key: "allowDuplicates" },
  { label: "Allow Sequential Characters", key: "allowSequential" },
];
export default function PasswordGenerator() {
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

  // Generate passwords whenever length or options change
  useEffect(() => {
    const generated = generatePassword({ length, ...options });
    setPasswords(generated);
  }, [length, options]);

  const handleOptionChange = (key: keyof Options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
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
            onChange={(e) =>
              setLength(Math.max(4, Math.min(128, Number(e.target.value))))
            }
            className="mt-1 w-full rounded-md border px-3 py-2 focus:ring focus:ring-blue-200"
            min={4}
            max={128}
          />
        </label>

        <div className="mb-4">
          {SelectOptions.map(({ label, key }) => (
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
      </div>

      {passwords.length > 0 && <SuccessResult passwords={passwords} />}
    </div>
  );
}

export const SuccessResult = ({ passwords }: string[]) => {
  return (
    <div className="mt-6 w-full max-w-md">
      <h2 className="mb-2 text-lg font-bold">Generated Passwords</h2>
      <ul className="rounded-md bg-white p-4 shadow-md">
        {passwords.map((pwd, idx) => (
          <li key={idx} className="border-b py-2 text-gray-800 last:border-b-0">
            {pwd}
          </li>
        ))}
      </ul>
    </div>
  );
};

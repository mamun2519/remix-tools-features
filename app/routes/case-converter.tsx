import { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Case-Converter" },
    {
      name: "description",
      content: "Case-Converter tools",
    },
  ];
};

const CaseConverter = () => {
  const [text, setText] = useState("");
  const [converterOptions, setConverterOptions] = useState([
    "sentence-case",
    "capitalized-case",
    "title-case",
    "lower-case",
    "upper-case",
    "snake-case",
    "dot-case",
    "hyphen-case",
    "remove-extra-spaces",
    "remove-all-spaces",
    "remove-enter",
  ]);

  return (
    <div className="p-10">
      <div className="mt-10 h-full rounded border p-6">
        <h3>Text Converter</h3>

        <div className="mt-2">
          <div>
            <textarea
              onChange={(e) => setText(e.target.value)}
              name="videoURL"
              placeholder="Enter your text here..."
              className="h-72 w-full rounded border p-4 outline-slate-300"
            />

            <div>
              {converterOptions.map((type) => (
                <button
                  key={type}
                  // onClick={() => handleConversion(type)}
                  className="rounded bg-red-500 p-2 text-white"
                  style={{ margin: "5px" }}
                >
                  {type.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;

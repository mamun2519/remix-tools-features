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
    //     "remove-extra-spaces",
    //     "remove-all-spaces",
    //     "remove-enter",
    "clear",
    "rAndOM caSE",
    "iNVERSE cASE",
  ]);

  const convertSentenceCase = () => {
    return text
      .toLowerCase()
      .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const convertCapitalizedCase = () => {
    return text.replace(/\b\w/g, (c) => c.toUpperCase());
  };
  const handleConversion = (conversionType: string) => {
    setText("");
    switch (conversionType) {
      case "sentence-case":
        setText(
          text
            .toLowerCase()
            .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()),
        );
        break;
      case "capitalized-case":
        setText(text.replace(/\b\w/g, (c) => c.toUpperCase()));
        break;
      case "title-case":
        setText(
          text
            .toLowerCase()
            .replace(
              /\b(?!and|or|but|nor|for|so|yet|a|an|the|in|on|at|by|to|of|off|up|down)\w+/g,
              (c) => c.charAt(0).toUpperCase() + c.slice(1),
            ),
        );
        break;
      case "lower-case":
        setText(text.toLowerCase());
        break;
      case "upper-case":
        setText(text.toUpperCase());
        break;
      case "snake-case":
        setText(text.toLowerCase().replace(/\s+/g, "_"));
        break;
      case "dot-case":
        setText(text.toLowerCase().replace(/\s+/g, "."));
        break;
      case "hyphen-case":
        setText(text.toLowerCase().replace(/\s+/g, "-"));
        break;
      case "remove-extra-spaces":
        setText(text.replace(/\s+/g, " ").trim());
        break;
      case "remove-all-spaces":
        setText(text.replace(/\s+/g, ""));
        break;
      case "remove-enter":
        setText(text.replace(/\n+/g, ""));
        break;
      case "clear":
        setText("");
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-10">
      <div className="mt-10 h-full rounded border p-6">
        <h3>Text Converter</h3>

        <div className="mt-2">
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              name="videoURL"
              placeholder="Enter your text here..."
              className="h-72 w-full rounded border p-4 outline-slate-300"
            />

            <div>
              {converterOptions.map((type) => (
                <button
                  key={type}
                  onClick={() => handleConversion(type)}
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

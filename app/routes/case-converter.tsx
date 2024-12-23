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
    "clear",
    "random-case",
    "inverse-case",
  ]);

  const convertSentenceCase = () => {
    return text
      .toLowerCase()
      .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const convertCapitalizedCase = () => {
    return text.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const convertTitleCase = () => {
    return text
      .toLowerCase()
      .replace(
        /\b(?!and|or|but|nor|for|so|yet|a|an|the|in|on|at|by|to|of|off|up|down)\w+/g,
        (c) => c.charAt(0).toUpperCase() + c.slice(1),
      );
  };

  const convertTowerCase = () => {
    return text.toLowerCase();
  };
  const convertUpperCase = () => {
    return text.toLowerCase().replace(/\s+/g, "_");
  };

  const convertSnakeCase = () => {
    return text.toLowerCase().replace(/\s+/g, "_");
  };

  const convertDotCase = () => {
    return text.toLowerCase().replace(/\s+/g, ".");
  };

  const convertHyphenCase = () => {
    return text.toLowerCase().replace(/\s+/g, "-");
  };

  const convertRemoveExtraSpaces = () => {
    return text.replace(/\s+/g, " ").trim();
  };

  const removeExtraSpaces = () => {
    return text.replace(/\s+/g, "");
  };

  const addRandomCase = () => {
    return text
      .split("")
      .map((char) =>
        Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase(),
      )
      .join("");
  };

  const inverseCase = () => {
    return text
      .split("")
      .map((char) =>
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase(),
      )
      .join("");
  };
  const handleConversion = (conversionType: string) => {
    setText("");
    switch (conversionType) {
      case "sentence-case":
        setText(convertSentenceCase());
        break;
      case "capitalized-case":
        setText(convertCapitalizedCase());
        break;
      case "title-case":
        setText(convertTitleCase());
        break;
      case "lower-case":
        setText(convertTowerCase());
        break;
      case "upper-case":
        setText(convertUpperCase());
        break;
      case "snake-case":
        setText(convertSnakeCase());
        break;
      case "dot-case":
        setText(convertDotCase());
        break;
      case "hyphen-case":
        setText(convertHyphenCase());
        break;
      case "remove-extra-spaces":
        setText(convertRemoveExtraSpaces());
        break;
      case "remove-all-spaces":
        setText(removeExtraSpaces());
        break;
      case "remove-enter":
        setText(removeExtraSpaces());
        break;

      case "random-case":
        setText(addRandomCase());
        break;
      case "inverse-case":
        setText(inverseCase());
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

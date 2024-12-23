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

  const convertSentenceCase = (text: string) => {
    return text
      .toLowerCase()
      .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const convertCapitalizedCase = (text: string) => {
    return text.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const convertTitleCase = (text: string) => {
    return text
      .toLowerCase()
      .replace(
        /\b(?!and|or|but|nor|for|so|yet|a|an|the|in|on|at|by|to|of|off|up|down)\w+/g,
        (c) => c.charAt(0).toUpperCase() + c.slice(1),
      );
  };

  const convertTowerCase = (text: string) => {
    return text.toLowerCase();
  };
  const convertUpperCase = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, "_");
  };

  const convertSnakeCase = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, "_");
  };

  const convertDotCase = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, ".");
  };

  const convertHyphenCase = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, "-");
  };

  const convertRemoveExtraSpaces = (text: string) => {
    return text.replace(/\s+/g, " ").trim();
  };

  const removeExtraSpaces = (text: string) => {
    return text.replace(/\s+/g, "");
  };

  const addRandomCase = (text: string) => {
    return text
      .split("")
      .map((char) =>
        Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase(),
      )
      .join("");
  };

  const inverseCase = (text: string) => {
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
        setText(convertSentenceCase(text));
        break;
      case "capitalized-case":
        setText(convertCapitalizedCase(text));
        break;
      case "title-case":
        setText(convertTitleCase(text));
        break;
      case "lower-case":
        setText(convertTowerCase(text));
        break;
      case "upper-case":
        setText(convertUpperCase(text));
        break;
      case "snake-case":
        setText(convertSnakeCase(text));
        break;
      case "dot-case":
        setText(convertDotCase(text));
        break;
      case "hyphen-case":
        setText(convertHyphenCase(text));
        break;
      case "remove-extra-spaces":
        setText(convertRemoveExtraSpaces(text));
        break;
      case "remove-all-spaces":
        setText(removeExtraSpaces(text));
        break;
      case "remove-enter":
        setText(removeExtraSpaces(text));
        break;

      case "random-case":
        setText(addRandomCase(text));
        break;
      case "inverse-case":
        setText(inverseCase(text));
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

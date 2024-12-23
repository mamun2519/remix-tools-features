import { MetaFunction } from "@remix-run/node";

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
  return (
    <div className="p-10">
      <div className="mt-10 h-full rounded border p-6">
        <h3>Text Converter</h3>

        <div className="mt-2">
          <div>
            <textarea
              //   rows={10}
              //   cols={150}
              name="videoURL"
              placeholder="Enter your text here..."
              className="h-80 w-96 rounded border px-4 outline-slate-300"
            />

            <div>
              {[
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
              ].map((type) => (
                <button
                  key={type}
                  // onClick={() => handleConversion(type)}
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

import { useActionData } from "@remix-run/react";
import { decodeFromBase64, encodeToBase64 } from "./base64";

import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const input = formData.get("input") || "";
  const charset = formData.get("charset") || "utf-8";
  const operation = formData.get("operation") || "encode";

  try {
    let output;
    if (operation === "encode") {
      output = encodeToBase64(input, charset);
    } else {
      output = decodeFromBase64(input, charset);
    }
    return json({ success: true, output });
  } catch (error) {
    return json({ success: false, error: "Invalid input or character set." });
  }
};

const Base64EncodedDecodedConverter = () => {
  const actionData = useActionData();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Base64 Encoder/Decoder</h1>
      <form method="post" className="space-y-4">
        <div>
          <label htmlFor="input" className="mb-1 block font-medium">
            Input Text
          </label>
          <textarea
            id="input"
            name="input"
            rows="4"
            className="w-full rounded border p-2"
            defaultValue=""
          />
        </div>
        <div>
          <label htmlFor="charset" className="mb-1 block font-medium">
            Character Set
          </label>
          <select
            id="charset"
            name="charset"
            className="w-full rounded border p-2"
            defaultValue="utf-8"
          >
            <option value="utf-8">UTF-8 (Default)</option>
            <option value="ascii">ASCII</option>
            <option value="utf-16">UTF-16</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block font-medium">Operation</label>
          <div className="space-x-4">
            <label>
              <input
                type="radio"
                name="operation"
                value="encode"
                defaultChecked
              />
              <span className="ml-2">Encode</span>
            </label>
            <label>
              <input type="radio" name="operation" value="decode" />
              <span className="ml-2">Decode</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Convert
        </button>
      </form>
      {actionData && (
        <div className="mt-6">
          <h2 className="mb-2 text-xl font-bold">Output</h2>
          {actionData.success ? (
            <textarea
              value={actionData.output}
              readOnly
              rows="4"
              className="w-full rounded border bg-gray-100 p-2"
            />
          ) : (
            <p className="text-red-500">{actionData.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Base64EncodedDecodedConverter;

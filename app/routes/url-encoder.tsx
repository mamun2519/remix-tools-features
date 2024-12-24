/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { ActionFunctionArgs, json, MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { urlDecoded, urlEncoded } from "~/utils/urlEncoded";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const inputText = formData.get("inputText") || "";
  const charset = formData.get("charset") || "utf-8";
  const operation = formData.get("operation") || "encode";

  console.log("inputText", inputText);
  console.log("charset", charset);
  console.log("operation", operation);

  try {
    let result;
    if (operation == "encode") {
      result = urlEncoded(inputText, charset);
    } else {
      result = urlDecoded(inputText, charset);
    }
    return json({ success: true, result });
  } catch (error) {
    console.log(error);
    return json({ success: false, error: "Invalid input or character set." });
  }
};

export const meta: MetaFunction = () => {
  return [
    { title: "Url encoded" },
    {
      name: "description",
      content: "url encoded tools",
    },
  ];
};

const UrlEncodedTools = () => {
  const actionData = useActionData();
  return (
    <div className="mx-auto mt-20 max-w-4xl border p-6">
      <h1 className="mb-4 text-2xl font-bold">Base64 Url encoded Tools</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="input" className="mb-1 block font-medium">
            Input text
          </label>
          <textarea
            id="inputText"
            name="inputText"
            rows={4}
            className="w-full rounded border p-2 outline-slate-100"
            defaultValue=""
          ></textarea>
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
            <label htmlFor="">
              <input
                type="radio"
                name="operation"
                value="encode"
                defaultChecked
              />
              <span className="ml-2">Encode</span>
            </label>
            <input type="radio" name="operation" value="decode" />
            <span className="ml-2">Decode</span>
          </div>
        </div>

        <button
          type="submit"
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          Convert
        </button>

        {actionData?.success && <SuccessResult actionData={actionData} />}
        {actionData?.error && <ErrorResult actionData={actionData} />}
      </Form>
    </div>
  );
};

export const SuccessResult = ({ actionData }: any) => {
  return (
    <div className="mt-6">
      <h2 className="mb-2 text-xl font-bold">Output</h2>
      <textarea
        value={actionData?.output}
        readOnly
        rows={4}
        className="w-full rounded border bg-gray-100 p-2"
      ></textarea>
    </div>
  );
};

export const ErrorResult = ({ actionData }: any) => {
  return <p className="text-red-500">{actionData.error}</p>;
};

export default UrlEncodedTools;

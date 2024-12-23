import { useActionData } from "@remix-run/react";
import { decodeFromBase64, encodeToBase64 } from "./base64";

import { json, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Base64 encoded & decoded" },
    {
      name: "description",
      content: "Base64 encoded & decoded tools",
    },
  ];
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const inputText = formData.get("inputText") || "";
  const charset = formData.get("charset") || "utf-8";
  const operation = formData.get("operation") || "encode";

  try {
    let output;
    if (operation === "encode") {
      output = encodeToBase64(inputText, charset);
    } else {
      output = decodeFromBase64(inputText, charset);
    }
    return json({ success: true, output });
  } catch (error) {
    return json({ success: false, error: "Invalid input or character set." });
  }
};

const Base64EncodedDecodedConverter = () => {
  const actionData = useActionData();

  return (
    <div className="p-10">
      <div className="mt-10 h-full rounded border p-6"></div>
    </div>
  );
};

export default Base64EncodedDecodedConverter;

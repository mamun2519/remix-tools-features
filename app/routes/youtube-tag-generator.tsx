import { MetaFunction } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";
import OpenAI from "openai";

const openaiApiKey = process.env.OPENAI_API_KEY;

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const videoDescription = formData.get("videoDescription");
  const videoType = formData.get("videoType");
  const keyword = formData.get("keyword");

  console.log("videoDescription", videoDescription);
  console.log("videoType", videoType);
  //* handle input filed error
  if (!videoDescription && !videoType && !keyword) {
    return json(
      { error: "Description, video type, or keyword is required." },
      { status: 400 },
    );
  }

  try {
    //* open api integration
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    //* generate prompt
    const prompt = `
    Generate 15 engaging and click-worthy YouTube video titles optimized for SEO. 
    - Video Type: ${videoType || "N/A"}
    - Video Description: ${videoDescription || "N/A"}
    - Keyword to include in titles: ${keyword || "N/A"}
      Generate exactly 12 titles only.
  `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });

    console.log("response", response);

    // //* receive only first index
    // const rawContent = response.choices[0].message.content?.trim() || "";

    // //* convert to array
    // const generatedNames = rawContent
    //   .split("\n") // Split into lines
    //   .filter((line) => line.trim() !== "")
    //   .map((line) => line.replace(/^\d+\.\s*/, "").trim());
    const titles =
      response.choices[0]?.message?.content?.split("\n").filter(Boolean) || [];
    console.log("titles", titles);
    return json({
      titles: titles,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return json(
      {
        names: [],
        error: "Failed to generate channel name",
      },
      { status: 500 },
    );
  }
}

export const meta: MetaFunction = () => {
  return [
    { title: "YouTube Title Generator" },
    {
      name: "description",
      content: "Generate unique YouTube channel names instantly",
    },
  ];
};
const YoutubeTitleGenerate = () => {
  const actionData = useActionData();
  return (
    <div className="p-10">
      <div className="mt-10 h-96 rounded border p-6">
        <h3>YouTube Title Generate</h3>

        <div className="mt-2">
          <Form method="post">
            <input
              type="text"
              name="videoDescription"
              placeholder="Enter Video description"
              className="h-14 w-96 rounded border px-4 outline-slate-300"
            />
            <input
              type="text"
              name="videoType"
              placeholder="Enter Account videoType"
              className="h-14 w-96 rounded border px-4 outline-slate-300"
            />
            <input
              type="text"
              name="keyword"
              placeholder="Enter Account keyword"
              className="h-14 w-96 rounded border px-4 outline-slate-300"
            />

            <button
              type="submit"
              className="h-14 border bg-red-400 px-4 font-bold text-white"
            >
              Generate
            </button>
          </Form>
        </div>

        {actionData?.error && (
          <div className="mt-4 text-center text-red-600">
            {actionData.error}
          </div>
        )}
        {actionData?.titles?.length > 0 && (
          <div>
            <h2>Generated Titles:</h2>
            <ul>
              {actionData?.titles.map((title, index) => (
                <li key={index}>{title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
//* title
export default YoutubeTitleGenerate;

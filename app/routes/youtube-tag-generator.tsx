import { MetaFunction } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";
import OpenAI from "openai";

const openaiApiKey = process.env.OPENAI_API_KEY;

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const keyword = formData.get("keyword");

  //* handle input filed error
  if (!keyword) {
    return json({ error: "keyword is required." }, { status: 400 });
  }

  try {
    //* open api integration
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    //* generate prompt
    const prompt = `Generate a list of SEO-friendly YouTube tags for the keyword: "${keyword}".`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
      temperature: 0.7,
    });

    console.log("response", response);

    const tags =
      response.choices[0]?.message?.content?.split("\n").filter(Boolean) || [];
    console.log("tags", tags);
    return json({
      titles: tags,
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
    { title: "YouTube Tags Generator" },
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
        <h3>YouTube Tags Generate</h3>

        <div className="mt-2">
          <Form method="post">
            <input
              type="text"
              name="keyword"
              placeholder="Enter Keyword"
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

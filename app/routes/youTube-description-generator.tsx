import { MetaFunction } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";
import OpenAI from "openai";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const videoTopic = formData.get("videoTopic");
  const keywords = formData.get("keywords");

  //* handle input filed error
  if (!videoTopic || !keywords) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    //* open api integration
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    //* generate prompt
    const prompt = `Generate a YouTube video description for the topic: "${videoTopic}". Include the following keywords: "${keywords}".`;
    const response = await openai.chat.completions.create({
      // model: "gpt-3.5-turbo",
      model: "text-davinci-003",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      max_tokens: 120,
      temperature: 0.7,
    });
    console.log("response", response);

    //* receive only first index
    const rawContent = response.choices[0].message.content?.trim() || "";

    //* convert to array
    const description = rawContent
      .split("\n") // Split into lines
      .filter((line) => line.trim() !== "")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim());
    console.log("description", description);
    return json({
      generatedNames: description,
      error: null,
    });

    //
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
    { title: "YouTube Video Description Generator" },
    {
      name: "description",
      content: "Generate unique YouTube channel names instantly",
    },
  ];
};
const YoutubeDescriptionGenerate = () => {
  const actionData = useActionData();
  return (
    <div className="p-10">
      <div className="mt-10 h-96 rounded border p-6">
        <h3>YouTube Description Generate</h3>

        <div className="mt-2">
          <Form method="post">
            <input
              type="text"
              name="videoTopic"
              placeholder="Enter Video Topic"
              className="h-14 w-96 rounded border px-4 outline-slate-300"
            />
            <input
              type="text"
              name="keywords"
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
        {actionData?.generatedNames && actionData.generatedNames.length > 0 && (
          <div className="mt-6 rounded-md bg-gray-100 p-4">
            <h2 className="mb-4 text-center text-xl font-semibold">
              Generated Channel Names
            </h2>
            <div className="space-y-2">
              {actionData.generatedNames.map((name, index) => (
                <div key={index} className="text-left text-lg text-indigo-600">
                  {name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeDescriptionGenerate;

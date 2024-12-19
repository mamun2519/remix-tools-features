import { MetaFunction } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";
import OpenAI from "openai";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const accountType = formData.get("accountType");
  const category = formData.get("category");
  const description = formData.get("description");

  //* handle input filed error
  if (!accountType || !category || !description) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    //* open api integration
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    //* generate prompt
    const prompt = `Generate  12 YouTube channel names for a ${accountType} channel focused on ${category}. 
    The channel's essence is: ${description}. 
    
    Output Format:
    1. Descriptive Word + Thematic Noun 
    2. Compact Brand Name
    3. Descriptive Phrase + Content Type
  
    Generate names that are:
    - Unique and memorable
    - Reflect the channel's content
    - Concise 
    - Appealing to viewers`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a creative YouTube channel name generator. Provide output in the specified format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 120,
      temperature: 0.7,
      n: 3,
    });

    //* receive only first index
    const rawContent = response.choices[0].message.content?.trim() || "";

    //* convert to array
    const generatedNames = rawContent
      .split("\n") // Split into lines
      .filter((line) => line.trim() !== "")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim());

    return json({
      generatedNames: generatedNames,
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
              name="accountType"
              placeholder="Enter Account Type"
              className="h-14 w-96 rounded border px-4 outline-slate-300"
            />
            <input
              type="text"
              name="category"
              placeholder="Enter Account Category"
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

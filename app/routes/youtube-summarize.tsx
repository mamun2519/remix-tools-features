import { ActionFunctionArgs, json, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import OpenAI from "openai";
import { Innertube } from "youtubei.js";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const videoUrl = formData.get("videoURL") as string;

  try {
    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    // Initialize Youtube
    const youtube = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });

    //* get video info by video id
    const info = await youtube.getInfo(videoId);

    //* get video transcript
    const transcriptData = await info.getTranscript();
    // transcript data
    const transcript =
      transcriptData?.transcript?.content?.body?.initial_segments?.map(
        (segment) => segment.snippet.text,
      );

    //* convert string
    const cleanedTranscript = transcript
      ?.filter((text) => typeof text === "string")
      ?.join(" ");

    // console.log("Cleaned Transcript:", cleanedTranscript);

    const prompt =
      "You are a helpful assistant. Provide a summary, outlines, mindmap, keywords, and highlights for the given transcript.";

    const openAi = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        { role: "user", content: cleanedTranscript as string },
      ],
    });

    console.log("response", response);

    const content = response.choices[0].message?.content;
    console.log("content", content);

    const [summary, outlines, mindmap, keywords, highlights] =
      parseOpenAIResponse(content);

    return json({
      success: true,
      videoId,
      summary,
      outlines,
      mindmap,
      keywords,
      highlights,
    });
  } catch (error) {
    return json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get transcript",
    });
  }
}

const parseOpenAIResponse = (content: string) => {
  const summary = content.match(/Summary:\n([\s\S]*?)\nOutlines:/)?.[1]?.trim();
  const outlines = content
    .match(/Outlines:\n([\s\S]*?)\nMindmap:/)?.[1]
    ?.trim();
  const mindmap = content.match(/Mindmap:\n([\s\S]*?)\nKeywords:/)?.[1]?.trim();
  const keywords = content
    .match(/Keywords:\n([\s\S]*?)\nHighlights:/)?.[1]
    ?.trim();
  const highlights = content.match(/Highlights:\n([\s\S]*)/)?.[1]?.trim();

  return [summary, outlines, mindmap, keywords, highlights];
};

//* extract video id using regex
const extractVideoId = (url: string) => {
  const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "YouTube Summarize" },
    {
      name: "description",
      content: "Youtube summarize tools",
    },
  ];
};

const YoutubeSummarize = () => {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isGenerating = navigation.state === "submitting";
  return (
    <div className="p-10">
      <div className="mt-10 h-full rounded border p-6">
        <h3>YouTube Summarize</h3>

        <div className="mt-2">
          <Form method="post">
            <input
              type="text"
              name="videoURL"
              placeholder="Enter Youtube Video URL"
              className="h-14 w-96 rounded border px-4 outline-slate-300"
            />

            <button
              type="submit"
              className="h-14 border bg-red-400 px-4 font-bold text-white"
            >
              {isGenerating ? "Summarizing..." : "Summarize"}
            </button>
          </Form>
        </div>

        {actionData?.error && (
          <div className="mt-4 text-center text-red-600">
            {actionData.error}
          </div>
        )}

        {actionData?.transcript && (
          <>
            <div className="text-md mt-10 max-h-[400px] overflow-y-auto rounded-md border p-4 text-justify">
              {actionData?.transcript?.map((line, index) => {
                return (
                  <div key={index} className={index !== 0 && "mt-4"}>
                    <span className="text-gray-90">{line}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YoutubeSummarize;

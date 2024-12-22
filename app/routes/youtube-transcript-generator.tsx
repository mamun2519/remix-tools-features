import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, useActionData, useNavigation } from "@remix-run/react";

interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

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
      transcriptData.transcript.content.body.initial_segments.map(
        (segment) => segment.snippet.text,
      );

    console.log("transcript", transcript);

    return json({
      success: true,
      transcript: transcript,
    });
  } catch (error) {
    return json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get transcript",
    });
  }
}

const decodeHTMLEntities = (text: string): string => {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
};

//* extract video id using regex
const extractVideoId = (url: string) => {
  const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "YouTube Transcript Generator" },
    {
      name: "description",
      content: "Generate youtube transcript generator",
    },
  ];
};

const convertToSRT = (items: TranscriptItem[]): string => {
  return items
    .map((item, index) => {
      const startTime = formatSRTTime(item.offset);
      const endTime = formatSRTTime(item.offset + item.duration);
      const decodedText = decodeHTMLEntities(item.text);

      return `${index + 1}\n${startTime} --> ${endTime}\n${decodedText}\n`;
    })
    .join("\n");
};
const YoutubeTranscriptGenerator = () => {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isGenerating = navigation.state === "submitting";

  return (
    <div className="p-10">
      <div className="mt-10 h-full rounded border p-6">
        <h3>YouTube Transcript Generate</h3>

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
              {isGenerating ? "Generating..." : "Generate Transcript"}
            </button>
          </Form>
        </div>

        {actionData?.error && (
          <div className="mt-4 text-center text-red-600">
            {actionData.error}
          </div>
        )}
        {/* {actionData?.success && (
          <div className="mt-6">
            <h2 className="mb-3 text-xl font-semibold">Transcript</h2>
            <div className="whitespace-pre-wrap rounded bg-gray-100 p-4 font-mono text-sm">
              {actionData.transcript}
            </div>
          </div>
        )} */}

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
            {/* Download transcript button */}
            <div className="mt-5">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                  actionData?.transcript,
                )}`}
                download="test.txt"
                className="rounded-xl bg-red-500 px-2 py-1 text-white"
                target="_blank"
                rel="noopener noreferrer"
                title="Download Transcript"
              >
                Download .txt
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YoutubeTranscriptGenerator;

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

//* format time
const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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

const convertToVTT = (items: TranscriptItem[]): string => {
  const header = "WEBVTT\n\n";
  const body = items
    .map((item, index) => {
      const startTime = formatVTTTime(item.offset);
      const endTime = formatVTTTime(item.offset + item.duration);
      const decodedText = decodeHTMLEntities(item.text);

      return `${startTime} --> ${endTime}\n${decodedText}\n`;
    })
    .join("\n");

  return header + body;
};

const convertToTXT = (items: TranscriptItem[]): string => {
  return items
    .map((item) => {
      const timestamp = formatTime(item.offset * 1000);
      const decodedText = decodeHTMLEntities(item.text);
      return `[${timestamp}] ${decodedText}`;
    })
    .join("\n");
};

function formatSRTTime(seconds: number): string {
  const pad = (num: number): string => num.toString().padStart(2, "0");
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${ms.toString().padStart(3, "0")}`;
}

const formatVTTTime = (seconds: number): string => {
  const pad = (num: number): string => num.toString().padStart(2, "0");
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}.${ms.toString().padStart(3, "0")}`;
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

  const downloadTranscript = (format: "txt" | "srt" | "vtt") => {
    if (!actionData?.success || !actionData.rawTranscript) return;

    let content = "";
    let filename = `transcript.${format}`;
    let mimeType = "text/plain";
    console.log("format", format);
    switch (format) {
      case "srt":
        content = convertToSRT(actionData.rawTranscript);
        mimeType = "application/x-subrip";
        break;
      case "vtt":
        content = convertToVTT(actionData.rawTranscript);
        mimeType = "text/vtt";
        break;
      case "txt":
      default:
        content = convertToTXT(actionData.rawTranscript);
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          <div className="text-md max-h-[400px] overflow-y-auto rounded-md border p-4 text-justify">
            {actionData?.transcript?.map((line, index) => {
              return (
                <div key={index} className={index !== 0 && "mt-4"}>
                  <span className="text-gray-90">{line}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeTranscriptGenerator;

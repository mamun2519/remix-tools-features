import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, useActionData, useNavigation } from "@remix-run/react";
import { Innertube } from "youtubei.js";

interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

// Helper function to format time (converts seconds to HH:MM:SS,mmm format)
const formatTime = (seconds: number) => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours().toString().padStart(2, "0");
  const mm = date.getUTCMinutes().toString().padStart(2, "0");
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  const ms = date.getUTCMilliseconds().toString().padStart(3, "0");
  return `${hh}:${mm}:${ss},${ms}`;
};

// Utility functions for format conversion
const convertToSRT = (transcript: string[]) => {
  return transcript
    .map((text, index) => {
      const startTime = formatTime(index * 5); // Assuming 5 seconds per segment
      const endTime = formatTime((index + 1) * 5);
      return `${index + 1}\n${startTime} --> ${endTime}\n${text}\n\n`;
    })
    .join("");
};

const convertToVTT = (transcript: string[]) => {
  const vtt = "WEBVTT\n\n";
  return (
    vtt +
    transcript
      .map((text, index) => {
        const startTime = formatTime(index * 5);
        const endTime = formatTime((index + 1) * 5);
        return `${startTime} --> ${endTime}\n${text}\n\n`;
      })
      .join("")
  );
};

const convertToTTML = (transcript: string[]) => {
  let ttml = `<?xml version="1.0" encoding="UTF-8"?>
<tt xmlns="http://www.w3.org/ns/ttml">
  <body>
    <div>\n`;

  transcript.forEach((text, index) => {
    const startTime = formatTime(index * 5);
    const endTime = formatTime((index + 1) * 5);
    ttml += `      <p begin="${startTime}" end="${endTime}">${text}</p>\n`;
  });

  ttml += `    </div>
  </body>
</tt>`;
  return ttml;
};
const convertToTXT = (transcript: string[]) => {
  return transcript.join("\n\n");
};

// Helper function to trigger download
const downloadTranscript = (
  content: string,
  format: string,
  videoId: string,
) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transcript-${videoId}.${format.toLowerCase()}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

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

const YoutubeTranscriptGenerator = () => {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isGenerating = navigation.state === "submitting";

  const handleDownload = (format: string) => {
    if (!actionData?.transcript) return;

    let content = "";
    switch (format) {
      case "SRT":
        content = convertToSRT(actionData.transcript);
        break;
      case "VTT":
        content = convertToVTT(actionData.transcript);
        break;
      case "TTML":
        content = convertToTTML(actionData.transcript);
        break;
      case "TXT":
        content = convertToTXT(actionData.transcript);
        break;
      default:
        content = convertToTXT(actionData.transcript);
    }

    downloadTranscript(content, format, actionData.videoId);
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
            {/* <div className="mt-5">
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
            </div> */}

            <div className="mt-4 flex gap-2">
              {["SRT", "VTT", "TTML", "TXT"].map((format) => (
                <button
                  key={format}
                  onClick={() => handleDownload(format)}
                  className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
                >
                  Download {format}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YoutubeTranscriptGenerator;

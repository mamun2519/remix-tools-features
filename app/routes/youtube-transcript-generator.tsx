import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, useActionData, useNavigation } from "@remix-run/react";

import { YoutubeTranscript } from "youtube-transcript";

// const youtube = google.youtube("v3");
// export async function action({ request }: { request: Request }) {
//   const formData = await request.formData();
//   const videoUrl = formData.get("videoURL");

//   //* handle input filed error
//   if (!videoUrl) {
//     return json({ error: "All fields are required" }, { status: 400 });
//   }

//   const videoId = extractVideoId(videoUrl as string);
//   if (!videoId) {
//     return json({ error: "Invalid YouTube URL provided." }, { status: 400 });
//   }

//   const youTube = google.youtube({
//     version: "v3",
//     auth: process.env.YOUTUBE_API_KEY,
//   });

//   //* get the video details
//   const captionResponse = await youTube.captions.list({
//     videoId,
//     part: ["snippet"],
//   });

//   if (!captionResponse.data.items || captionResponse.data.items.length === 0) {
//     return json(
//       { error: "No captions available for this video." },
//       { status: 404 },
//     );
//   }

//   //* get the video caption id
//   const captionId = captionResponse.data.items[0].id;
//   console.log("captionId", captionId);
//   const transcriptResponse = await youTube.captions.download(
//     { id: captionId },
//     { responseType: "text" },
//   );
//   console.log("transcriptResponse", transcriptResponse);

//   const transcript = transcriptResponse.data;
//   console.log("transcript", transcript);

//   try {
//     return json({
//       // fullDescription: fullDescription,
//       error: null,
//     });

//     //
//   } catch (error) {
//     console.log(error);
//     return json(
//       {
//         names: [],
//         error: "Failed to generate channel name",
//       },
//       { status: 500 },
//     );
//   }
// }

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const videoUrl = formData.get("videoURL") as string;

  try {
    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    // Get transcript
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

    // Format transcript with timestamps
    const formattedTranscript = transcriptItems
      .map((item) => {
        const decodedText = decodeHTMLEntities(item.text);
        return `[${formatTime(item.offset * 1000)}] ${decodedText}`;
      })
      .join("\n");

    return json({
      success: true,
      transcript: formattedTranscript,
    });
  } catch (error) {
    return json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get transcript",
    });
  }
}

// function decodeHTMLEntities(text: string): string {
//   const textarea = document.createElement("textarea");
//   textarea.innerHTML = text;
//   return textarea.value;
// }

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
}

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function extractVideoId(url: string) {
  const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

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
  return (
    <div className="p-10">
      <div className="mt-10 h-96 rounded border p-6">
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
        {actionData?.success && (
          <div className="mt-6">
            <h2 className="mb-3 text-xl font-semibold">Transcript</h2>
            <div className="whitespace-pre-wrap rounded bg-gray-100 p-4 font-mono text-sm">
              {actionData.transcript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeTranscriptGenerator;

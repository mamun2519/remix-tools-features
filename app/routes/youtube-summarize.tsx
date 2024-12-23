import { ActionFunctionArgs, json, MetaFunction } from "@remix-run/node";
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

    return json({
      success: true,
      transcript: transcript,
      videoId: videoId,
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
    { title: "YouTube Summarize" },
    {
      name: "description",
      content: "Youtube summarize tools",
    },
  ];
};

const YoutubeSummarize = () => {
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
            <div className="mt-4 flex flex-wrap gap-2">
              {["SRT", "VTT", "TTML", "STL", "SUB", "DFXP", "SBV", "TXT"].map(
                (format) => (
                  <button
                    key={format}
                    onClick={() => handleDownload(format)}
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
                  >
                    Download {format}
                  </button>
                ),
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YoutubeSummarize;

import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";
import { google } from "googleapis";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const url = formData.get("videoURL");

  if (!url) {
    return json({ error: "YouTube URL is required." }, { status: 400 });
  }

  const videoId = extractVideoId(url as string);
  if (!videoId) {
    return json({ error: "Invalid YouTube URL provided." }, { status: 400 });
  }

  //   console.log("video id", videoId);

  const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
  });

  const response = await youtube.videos.list({
    id: videoId,
    part: ["snippet", "statistics", "status"],
  });
  //   console.log("response", response);
  const video = response.data.items?.[0];
  //   console.log("video", video);

  if (!video) {
    return json({ error: "Video not found." }, { status: 404 });
  }
  console.log("response", response);
  const { snippet } = video;
  console.log("tags", snippet.tags);
  return json({
    tags: snippet.tags,
  });
}

function extractVideoId(url: string) {
  const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export const meta: MetaFunction = () => {
  return [
    { title: "YouTube Tag Extractor" },
    {
      name: "description",
      content: "Generate unique YouTube channel names instantly",
    },
  ];
};
const YoutubeTagExtractor = () => {
  const actionData = useActionData();

  return (
    <div className="p-10">
      <div className="mt-10 h-96 rounded border p-6">
        <h3>YouTube Tag Extractor</h3>

        <div className="mt-2">
          <Form method="post">
            <input
              type="text"
              name="videoURL"
              placeholder="Enter Youtube Video link"
              className="h-14 w-96 rounded border px-4 outline-slate-300"
            />

            <button
              type="submit"
              className="h-14 border bg-red-400 px-4 font-bold text-white"
            >
              Get Tag
            </button>
          </Form>
        </div>

        {actionData?.error && (
          <div className="mt-4 text-center text-red-600">
            {actionData.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeTagExtractor;

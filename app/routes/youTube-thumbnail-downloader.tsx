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

  const { snippet, contentDetails, statistics } = video;

  return json({
    video: {
      title: snippet.title,
      thumbnails: snippet.thumbnails,
      category: snippet.categoryId,
      uploadDate: snippet.publishedAt,
      duration: contentDetails?.duration ?? null,
      views: statistics.viewCount,
    },
  });
}

export async function loader({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get("imageUrl");

  if (!imageUrl) {
    return new Response("No image URL provided", { status: 400 });
  }

  try {
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();

    return new Response(imageBlob, {
      headers: {
        "Content-Type":
          imageResponse.headers.get("Content-Type") || "image/jpeg",
        "Content-Disposition": "attachment; filename=thumbnail.jpg",
      },
    });
  } catch (error) {
    return new Response("Error fetching image", { status: 500 });
  }
}

function extractVideoId(url: string) {
  const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export const meta: MetaFunction = () => {
  return [
    { title: "YouTube Thumbnail Download" },
    {
      name: "description",
      content: "Generate unique YouTube channel names instantly",
    },
  ];
};
const YoutubeThumbnailDownloader = () => {
  const actionData = useActionData();

  const handleDownload = (url, filename) => {
    // Create a temporary <a> element to trigger the download
    const link = document.createElement("a");
    link.href = url; // Set the thumbnail URL
    link.download = filename; // Set the desired file name for the download

    // Trigger the download by clicking the link programmatically
    link.click();
  };

  return (
    <div className="p-10">
      <div className="mt-10 h-96 rounded border p-6">
        <h3>YouTube Thumbnail Download</h3>

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
              Download
            </button>
          </Form>
        </div>

        {actionData?.error && (
          <div className="mt-4 text-center text-red-600">
            {actionData.error}
          </div>
        )}
        {actionData?.video && (
          <div>
            <h2>{actionData.video.title}</h2>
            <img src={actionData.video.thumbnails.high.url} alt="Thumbnail" />
            <p>
              Upload Date:{" "}
              {new Date(actionData.video.uploadDate).toLocaleDateString()}
            </p>
            <p>Category: {actionData.video.category}</p>
            <p>Duration: {actionData.video?.duration}</p>
            <p>Views: {actionData.video.views}</p>

            {/* <div className="download-links flex gap-5">
              <button
                onClick={() =>
                  handleDownload(
                    actionData.video.thumbnails.default.url,
                    "default_thumbnail.jpg",
                  )
                }
                className="runded bg-red-500 px-2 text-white"
                //     href={actionData.video.thumbnails.default.url}
              >
                Download Default
              </button>
              <button
                onClick={() =>
                  handleDownload(
                    actionData.video.thumbnails.medium.url,
                    "medium_thumbnail.jpg",
                  )
                }
                className="runded bg-red-500 px-2 text-white"
                //     href={actionData.video.thumbnails.medium.url}
                //     download
              >
                Download Medium
              </button>
              <button
                onClick={() =>
                  handleDownload(
                    actionData.video.thumbnails.high.url,
                    "hd_thumbnail.jpg",
                  )
                }
                className="runded bg-red-500 px-2 text-white"
                //     href={actionData.video.thumbnails.high.url}
                //     download
              >
                Download HD
              </button>
              {actionData.video.thumbnails.maxres && (
                <button
                  className="runded bg-red-500 px-2 text-white"
                  // href={actionData.video.thumbnails.maxres.url}
                  onClick={() =>
                    handleDownload(
                      actionData.video.thumbnails.maxres.url,
                      "4k_thumbnail.jpg",
                    )
                  }
                >
                  Download 4K
                </button>
              )}
            </div> */}

            <div className="download-links mt-4 flex gap-4">
              <button
                onClick={() =>
                  handleDownload(
                    actionData.video.thumbnails.default.url,
                    "default_thumbnail.jpg",
                  )
                }
                className="rounded bg-red-500 px-4 py-2 text-white"
              >
                Download Default
              </button>
              <button
                onClick={() =>
                  handleDownload(
                    actionData.video.thumbnails.medium.url,
                    "medium_thumbnail.jpg",
                  )
                }
                className="rounded bg-red-500 px-4 py-2 text-white"
              >
                Download Medium
              </button>
              <button
                onClick={() =>
                  handleDownload(
                    actionData.video.thumbnails.high.url,
                    "hd_thumbnail.jpg",
                  )
                }
                className="rounded bg-red-500 px-4 py-2 text-white"
              >
                Download HD
              </button>
              {actionData.video.thumbnails.maxres && (
                <button
                  onClick={() =>
                    handleDownload(
                      actionData.video.thumbnails.maxres.url,
                      "4k_thumbnail.jpg",
                    )
                  }
                  className="rounded bg-red-500 px-4 py-2 text-white"
                >
                  Download 4K
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeThumbnailDownloader;

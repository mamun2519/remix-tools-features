import { Form } from "@remix-run/react";
import axios from "axios";
import { useState } from "react";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Get user inputs
  const keywords = searchParams.get("keywords")?.split(",") || [];
  const includeText = searchParams.get("includeText")?.toLowerCase() || "";
  const excludeText = searchParams.get("excludeText")?.toLowerCase() || "";
  const minViews =
    parseInt(searchParams.get("minViews") as string, 10) || 250000;

  //fetch the view base on keyword
  const apiKey = "AIzaSyBP2Qar2ApC_UDVS1Yv-AI-LwP3EPAiW8U";
  console.log("send", keywords, includeText, excludeText, minViews);

  const videos = await searchVideosByKeywordAndViews(
    keywords.join("|"),
    minViews,
    apiKey,
  );
  return null;
};

const searchVideosByKeywordAndViews = async (
  keywords: string[],
  mainViews: number,
  key: string,
) => {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    keywords,
  )}&type=video&maxResults=50&key=${key}`;

  const { data } = await axios.get(searchUrl);

  if (!data?.items) return [];

  const videoIds = data.items.map((item) => item.id.videoId);

  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(
    ",",
  )}&key=${key}`;

  const { data: videoDetailsResult } = await axios.get(detailsUrl);
  console.log(videoDetailsResult);

  if (!videoDetailsResult?.items) return [];

  // Step 4: Combine video data with view counts
  const videosWithViews = data.items.map((item) => {
    const details = videoDetailsResult.items.find(
      (detail) => detail.id === item.id.videoId,
    );
    return {
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: details ? parseInt(details.statistics.viewCount, 10) : 0,
    };
  });

  console.log("videosWithViews", videosWithViews);
};

const YoutubeTrends = () => {
  const Views = [100000, 250000, 500000, 750000, 900000];
  const [selectedView, setSelectedView] = useState(250000);
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Youtube Trend video
        </h1>

        {/* Search Form */}
        <Form method="get" className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="space-y-4">
            {/* Keywords Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Keywords
              </label>
              <input
                type="text"
                name="keywords"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Title Include Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title Include Text:
              </label>
              <input
                type="text"
                name="includeText"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Title Exclude Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title Exclude Text:
              </label>
              <input
                type="text"
                name="excludeText"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Minimum Views Input */}
            <div className="hidden">
              <input
                type="number"
                name="minViews"
                defaultValue={selectedView}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Views:
              </label>
              <div className="mt-2 flex gap-5">
                {Views?.map((view) => (
                  <button
                    onClick={() => setSelectedView(view)}
                    type="button"
                    className={`h-10 w-36 rounded ${view === selectedView ? "bg-red-500 text-white" : "border bg-white text-black"}`}
                    key={view}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </div>
        </Form>

        {/* Results */}
        {/* <h2 className="mb-4 text-2xl font-bold text-gray-900">Results</h2>
        <ul className="space-y-4">
          {videos.map((video) => (
            <li
              key={video.videoId}
              className="rounded-lg bg-white p-6 shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {video.title}
              </h3>
              <p className="mt-2 text-gray-600">{video.description}</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Channel:</span>{" "}
                  {video.channelTitle}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Views:</span>{" "}
                  {video.viewCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Published:</span>{" "}
                  {new Date(video.publishedAt).toLocaleDateString()}
                </p>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Watch Video
              </a>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default YoutubeTrends;

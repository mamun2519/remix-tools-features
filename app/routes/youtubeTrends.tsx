import { Form, json, useLoaderData } from "@remix-run/react";
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

  // Filter videos based on title include/exclude text
  const filterVideos = videos.filter((video) => {
    const title = video.title.toLowerCase();

    // Check if title includes the includeText
    const includesText = includeText ? title.includes(includeText) : true;

    // Check if title excludes the excludeText
    const excludesText = excludeText ? !title.includes(excludeText) : true;

    return includesText && excludesText;
  });
  // console.log("videos", filterVideos);
  return json({ success: true, data: filterVideos });
};

const searchVideosByKeywordAndViews = async (
  keywords: string[],
  mainViews: number,
  key: string,
) => {
  // Step 1: Search for videos by keywords

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    keywords,
  )}&type=video&maxResults=500&key=${key}`;

  const { data: searchResult } = await axios.get(searchUrl);

  if (!searchResult?.items) return [];
  // Step 2: Extract video IDs
  const videoIds = searchResult.items.map((item) => item.id.videoId);

  // Step 3: Fetch video details (including view counts)

  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(
    ",",
  )}&key=${key}`;

  const { data: videoDetailsResult } = await axios.get(detailsUrl);

  if (!videoDetailsResult?.items) return [];

  // Step 4: Combine video data with view counts
  const videosWithViews = searchResult.items.map((item) => {
    const details = videoDetailsResult.items.find(
      (detail) => detail.id === item.id.videoId,
    );
    console.log("item", item.snippet.thumbnails.high.url);
    return {
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: details ? parseInt(details.statistics.viewCount, 10) : 0,
      thumbnail: item.snippet.thumbnails.high.url,
    };
  });

  // Step 5: Filter videos by minimum view count
  return videosWithViews.filter((video) => video.viewCount >= mainViews);
};

const YoutubeTrends = () => {
  const Views = [100000, 250000, 500000, 750000, 900000];
  const [selectedView, setSelectedView] = useState(250000);
  const { data } = useLoaderData();
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
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Results</h2>
        <div className="grid grid-cols-3 gap-3 space-y-6">
          {data.map((video) => (
            <div
              key={video.videoId}
              className="overflow-hidden rounded-lg bg-white shadow-md"
            >
              {/* Thumbnail */}
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-48 w-full object-cover"
              />

              {/* Video Details */}
              <div className="p-4">
                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {video.title}
                </h3>

                {/* Channel Name */}
                <p className="mb-2 text-sm text-gray-600">
                  {video.channelTitle}
                </p>

                {/* Views and Publish Date */}
                <p className="text-sm text-gray-500">
                  {video.viewCount.toLocaleString()} views •{" "}
                  {new Date(video.publishedAt).toLocaleDateString()}
                </p>

                {/* Description */}
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {video.description}
                </p>

                {/* Watch Button */}
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Watch Video
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YoutubeTrends;

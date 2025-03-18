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
  const videoType = searchParams.get("videoType") || "both"; // Default to "both"

  //fetch the view base on keyword
  // const apiKey = "AIzaSyBP2Qar2ApC_UDVS1Yv-AI-LwP3EPAiW8U";
  const apiKey = "AIzaSyA-07DvNBFsMAa2yMDyhCRkWSPZeI-Xz7c";
  const maxResults = 150;
  const videos = await searchVideosByKeywordAndViews(
    keywords,
    minViews,
    apiKey,
    // maxResults,
  );

  // Filter videos based on title include/exclude text
  const filterVideos = videos.filter((video) => {
    const title = video.title.toLowerCase();

    // Check if title includes the includeText
    const includesText = includeText ? title.includes(includeText) : true;

    // Check if title excludes the excludeText
    const excludesText = excludeText ? !title.includes(excludeText) : true;

    // Check video type
    const isShortVideo = video.duration < 60; // Short videos are less than 60 seconds
    const isLongVideo = video.duration >= 60; // Long videos are 60 seconds or longer

    // let matchesVideoType = true;
    // if (videoType === "short") {
    //   matchesVideoType = isShortVideo;
    // } else if (videoType === "long") {
    //   matchesVideoType = isLongVideo;
    // } else if (videoType === "both") {
    //   matchesVideoType = true; // Show both short and long videos
    // }

    return includesText && excludesText;
  });
  // console.log("videos", filterVideos);

  console.log("Total output", filterVideos.length);
  return json({ success: true, data: filterVideos });
};

//version 1

const searchVideosByKeywordAndViews = async (
  keywords: string[],
  mainViews: number,
  key: string,
) => {
  // Step 1: Search for videos by keywords

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    keywords,
  )}&type=video&maxResults=50&key=${key}`;

  const { data: searchResult } = await axios.get(searchUrl);

  if (!searchResult?.items) return [];

  console.log("Total Search", searchResult.items.length);

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

// version 2

/* const searchVideosByKeywordAndViews = async (
  keywords,
  minViews,
  key,
  maxResults = 500,
) => {
  let allVideos = [];
  let nextPageToken = null;
  let totalResults = 0;

  do {
    // Step 1: Build the API URL
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      keywords.join("|"),
    )}&type=video&maxResults=50&key=${key}${
      nextPageToken ? `&pageToken=${nextPageToken}` : ""
    }`;

    // Step 2: Fetch the search results
    const searchResponse = await axios.get(searchUrl);
    const searchData = searchResponse.data;

    if (!searchData.items) break;

    // Step 3: Extract video IDs
    const videoIds = searchData.items.map((item) => item.id.videoId);

    // Step 4: Fetch video details (including view counts)
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds.join(
      ",",
    )}&key=${key}`;

    const detailsResponse = await axios.get(detailsUrl);
    const detailsData = detailsResponse.data;

    if (!detailsData.items) break;

    // Step 5: Combine search results with view counts and thumbnails
    const videosWithViews = searchData.items.map((item) => {
      const details = detailsData.items.find(
        (detail) => detail.id === item.id.videoId,
      );
      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: details ? parseInt(details.statistics.viewCount, 10) : 0,
        thumbnail: item.snippet.thumbnails.medium.url, // Use medium-sized thumbnail
      };
    });

    // Step 6: Add the videos to the results array
    allVideos = [...allVideos, ...videosWithViews];
    totalResults += searchData.items.length;

    // Step 7: Update the nextPageToken
    nextPageToken = searchData.nextPageToken;

    // Step 8: Break if we've reached the maxResults limit
    if (totalResults >= maxResults) break;
  } while (nextPageToken);

  // Step 9: Filter videos by minimum view count
  return allVideos.filter((video) => video.viewCount >= minViews);
}; */
const YoutubeTrends = () => {
  const Views = [5000, 25000, 100000, 250000, 500000, 750000, 900000];
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

            {/* Video Type Filter */}
            {/*  <div>
              <label className="block text-sm font-medium text-gray-700">
                Video Type:
              </label>
              <select
                name="videoType"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="both">Both (Short & Long)</option>
                <option value="short">Short Video</option>
                <option value="long">Long Video</option>
              </select>
            </div>
 */}
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
        <div className="grid grid-cols-3 gap-3">
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
                {/* <p className="mb-2 text-sm text-gray-600">
                  {video.channelTitle}
                </p> */}

                {/* Views and Publish Date */}
                <p className="mb-4 text-sm text-gray-500">
                  {video.viewCount.toLocaleString()} views •{" "}
                  {new Date(video.publishedAt).toLocaleDateString()}
                </p>

                {/* Description */}
                {/* <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                  {video.description}
                </p> */}

                {/* Watch Button */}
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

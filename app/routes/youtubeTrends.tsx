import { Form } from "@remix-run/react";
import React from "react";

const YoutubeTrends = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Video Search</h1>

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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Views:
              </label>
              <input
                hidden
                type="number"
                name="minViews"
                defaultValue={0}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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

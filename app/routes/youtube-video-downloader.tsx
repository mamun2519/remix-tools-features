import { ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const fromData = await request.formData();
};

const YoutubeVideoDownloader = () => {
  const actionData = useActionData();
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-xl font-bold">YouTube video Downloader</h1>
        <Form method="post" className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              YouTube Video Link
            </label>
            <input
              type="text"
              name="url"
              placeholder="Enter video URL"
              className="w-full rounded-md border border-gray-300 px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Format
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="format"
                  value="mp4"
                  defaultChecked
                  className="text-blue-500"
                />
                <span>MP4</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="format"
                  value="mp3"
                  className="text-blue-500"
                />
                <span>MP3</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Download
          </button>
        </Form>
        {actionData?.error && (
          <p className="mt-4 text-red-500">{actionData.error}</p>
        )}
      </div>
    </div>
  );
};

export default YoutubeVideoDownloader;

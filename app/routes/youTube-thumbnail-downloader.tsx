import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {}

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
        {actionData?.tags?.length > 0 && (
          <div>
            <h2>Generated Titles:</h2>
            <ul>
              {actionData?.tags.map((tag, index) => <li key={index}>{tag}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeThumbnailDownloader;

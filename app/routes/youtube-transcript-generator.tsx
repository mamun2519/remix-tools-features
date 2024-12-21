import { MetaFunction } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";
import { google } from "googleapis";
import OpenAI from "openai";

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
              Generate
            </button>
          </Form>
        </div>

        {actionData?.error && (
          <div className="mt-4 text-center text-red-600">
            {actionData.error}
          </div>
        )}
        {actionData?.fullDescription &&
          actionData.fullDescription.length > 0 && (
            <div className="mt-6 rounded-md bg-gray-100 p-4">
              <h2 className="mb-4 text-center text-xl font-semibold">
                Generated Channel Names
              </h2>
              <div className="space-y-2">
                {actionData.fullDescription.map((name, index) => (
                  <div
                    key={index}
                    className="text-left text-lg text-indigo-600"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default YoutubeTranscriptGenerator;

import { Form, json, useActionData } from "@remix-run/react";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const accountType = formData.get("accountType");
  const category = formData.get("category");
  const description = formData.get("description");

  if (!accountType || !category || !description) {
    return json({ error: "All fields are required" }, { status: 400 });
  }
  console.log("accountType", accountType);
  console.log("category", category);
  console.log("description", description);

  return null;
}
const YoutubeNameGenerate = () => {
  const actionData = useActionData();
  return (
    <div className="p-10">
      <div className="mt-10 h-96 rounded border p-6">
        <h3>YouTube Name Generate</h3>

        <div className="mt-2">
          <Form method="post">
            <input
              type="text"
              name="accountType"
              placeholder="Enter Account Type"
              className="h-14 w-96 rounded border px-4 outline-slate-300"
            />
            <input
              type="text"
              name="category"
              placeholder="Enter Account Category"
              className="h-14 w-96 rounded border px-4 outline-slate-300"
            />
            <input
              type="text"
              name="description"
              placeholder="Enter Description"
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

        {actionData && !actionData.error && (
          <div className="rounded bg-white p-4 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">Channel Details</h2>
            <div className="grid grid-cols-2 gap-2">
              <p>
                <strong>Channel Name:</strong> {actionData.channelName}
              </p>
              <p>
                <strong>Monetization Status:</strong>
                {actionData.isMonetized ? "Monetized ✅" : "Not Monetized ❌"}
              </p>
              <p>
                <strong>Total Views:</strong> {actionData.totalViews}
              </p>
              <p>
                <strong>Subscribers:</strong> {actionData.subscribers}
              </p>
              <p>
                <strong>Total Videos:</strong> {actionData.totalVideos}
              </p>
              <p>
                <strong>Channel ID:</strong> {actionData.channelId}
              </p>
              <p>
                <strong>Country:</strong> {actionData.country}
              </p>
              <p>
                <strong>Creation Date:</strong>
                {new Date(actionData.creationDate || "").toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeNameGenerate;

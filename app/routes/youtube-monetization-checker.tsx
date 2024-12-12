import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { google } from "googleapis";

const YOUTUBE_API_KEY = "AIzaSyAzXwAtQP499bdtT6zcPL-vQd72elaJs7Y";
async function findChannelIdByHandle(
  youtube: any,
  handle: string,
): Promise<string | null> {
  try {
    // Remove @ if present
    const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;

    // First, try search API to find the channel
    const searchResponse = await youtube.search.list({
      part: ["id", "snippet"],
      q: cleanHandle,
      type: ["channel"],
      maxResults: 1,
    });

    const searchResults = searchResponse.data.items;
    if (searchResults && searchResults.length > 0) {
      return searchResults[0].snippet.channelId;
    }

    return null;
  } catch (error) {
    console.error("Error finding channel ID:", error);
    return null;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const channelLink = formData.get("youtube-url") as string;

  try {
    // Extract channel ID or username from the link
    const { id, username } = extractChannelId(channelLink);

    // Fetch channel details using YouTube Data API
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    });

    let channelId: string | null = id || null;

    // If no direct ID, try to find channel ID
    if (!channelId && username) {
      channelId = await findChannelIdByHandle(youtube, username);
    }

    if (!channelId) {
      return json({ error: "Could not find channel ID" });
    }

    // Fetch channel details
    const channelResponse = await youtube.channels.list({
      part: ["snippet", "statistics", "status"],
      id: [channelId],
    });

    const channel = channelResponse.data.items?.[0];
    console.log(channel?.snippet?.thumbnails?.default?.url);
    if (!channel) {
      return json({ error: "Channel not found" });
    }

    // Check monetization (Note: This is a simplified check)
    const isMonetized = await checkMonetization(channelId);

    return json({
      isMonetized,
      channelName: channel.snippet?.title,
      totalViews: channel.statistics?.viewCount,
      subscribers: channel.statistics?.subscriberCount,
      totalVideos: channel.statistics?.videoCount,
      channelId: channel.id,
      country: channel.snippet?.country,
      creationDate: channel.snippet?.publishedAt,
      thumbnails: channel?.snippet?.thumbnails?.default?.url,
    });
  } catch (error) {
    console.error("Error fetching channel details:", error);
    return json({
      error: "Failed to fetch channel details",
      errorDetails: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Helper function to extract channel ID
function extractChannelId(link: string): { id?: string; username?: string } {
  // Handle different YouTube channel link formats
  const channelIdPatterns = [
    { regex: /channel\/([^\/]+)/, type: "id" },
    { regex: /c\/([^\/]+)/, type: "username" },
    { regex: /user\/([^\/]+)/, type: "username" },
    { regex: /@([^\/]+)/, type: "username" },
  ];

  for (const pattern of channelIdPatterns) {
    const match = link.match(pattern.regex);
    if (match) {
      return pattern.type === "id" ? { id: match[1] } : { username: match[1] };
    }
  }

  // If no match, try to extract from the last part of the URL
  const urlParts = link.split("/");
  const lastPart = urlParts[urlParts.length - 1];

  // Check if it starts with @ (username)
  if (lastPart.startsWith("@")) {
    return { username: lastPart.slice(1) };
  }

  // Otherwise, assume it might be a channel ID
  return { id: lastPart };
}

// Simplified monetization check (Note: Actual monetization check requires
// more complex verification)
async function checkMonetization(channelId: string): Promise<boolean> {
  try {
    // This is a placeholder. Real monetization check would involve
    // more complex YouTube Partner Program verification
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    });

    // Fetch channel's content details
    const response = await youtube.channels.list({
      part: ["snippet", "statistics", "status"],
      id: [channelId],
    });

    // Basic monetization criteria check
    const channel = response.data.items?.[0];

    return !!(
      channel &&
      parseInt(channel.statistics?.viewCount || "0") > 4000 &&
      parseInt(channel.statistics?.subscriberCount || "0") >= 1000
    );
  } catch (error) {
    console.error("Monetization check error:", error);
    return false;
  }
}

const YoutubeMonetizationChecker = () => {
  const actionData = useActionData<typeof action>();
  return (
    <div className="p-10">
      <div className="mt-10 h-96 rounded border p-6">
        <h3>YouTube Monetization Checker</h3>

        <div className="mt-2">
          <Form method="post">
            <input
              type="text"
              name="youtube-url"
              placeholder="Enter Youtube channel url"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeMonetizationChecker;

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
  try {
    // Extract channel ID or username from the link
    // Check monetization (Note: This is a simplified check)
  } catch (error) {
    console.error("Error fetching channel details:", error);
    return json({
      error: "Failed to fetch channel details",
      errorDetails: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

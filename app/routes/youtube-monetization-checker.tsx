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
  } catch (error) {
    console.error("Error finding channel ID:", error);
    return null;
  }
}

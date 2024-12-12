import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { google } from "googleapis";

const YOUTUBE_API_KEY = "AIzaSyAzXwAtQP499bdtT6zcPL-vQd72elaJs7Y";
async function findChannelIdByHandle(
  youtube: any,
  handle: string,
): Promise<string | null> {
  try {
  } catch (error) {
    console.error("Error finding channel ID:", error);
    return null;
  }
}

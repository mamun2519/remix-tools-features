import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const [items, setItems] = useState([
    { id: 1, name: "Youtube Money Calculator", link: "" },
    {
      id: 2,
      name: "Youtube Monetization Checker",
      link: "youtube-monetization-checker",
    },
    { id: 3, name: "Youtube Name Generator", link: "youtube-name-generator" },
    { id: 4, name: "Youtube Title Generator", link: "youtube-title-generator" },
    { id: 5, name: "Youtube Tags Generator", link: "youtube-tags-generator" },
    {
      id: 5,
      name: "YouTube Thumbnail Downloader",
      link: "youTube-thumbnail-downloader",
    },
  ]);
  return (
    <main className="p-10">
      <div className="h-96 w-full rounded-lg border p-5 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold">Our free tools list</h1>
        {/* <h1 className="mb-4 text-2xl font-bold">Item List</h1> */}
        <div className="grid grid-cols-2">
          <ul className="space-y-4">
            <h1 className="mb-4 text-2xl font-bold">Item List</h1>
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-md bg-white p-4 shadow-md hover:bg-gray-50"
              >
                <span className="text-lg font-medium">{item.name}</span>
                <button
                  onClick={() => alert(`You clicked on ${item.name}`)}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

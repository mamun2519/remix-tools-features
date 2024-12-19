import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, name: "Youtube Money Calculator", link: "", docs: "" },
    {
      id: 2,
      name: "Youtube Monetization Checker",
      link: "youtube-monetization-checker",
      docs: "https://kiwi-parrotfish-5f9.notion.site/Youtube-Monetization-Checker-15f380f1a04580a9b3d1c6052fc02d27?pvs=4",
    },
    {
      id: 3,
      name: "Youtube Name Generator",
      link: "youtube-name-generate",
      docs: "https://kiwi-parrotfish-5f9.notion.site/YouTube-Name-Generator-15f380f1a04580aea0c3e9c158cbee72?pvs=4",
    },
    { id: 4, name: "Youtube Title Generator", link: "youtube-title-generator" },
    { id: 5, name: "Youtube Tags Generator", link: "youtube-tag-generator" },
    {
      id: 6,
      name: "YouTube Thumbnail Downloader",
      link: "youTube-thumbnail-downloader",
    },
    {
      id: 7,
      name: "YouTube Tag Extractor",
      link: "youTube-tag-extractor",
    },
  ]);
  return (
    <main className="p-10">
      <div className="h-full w-full rounded-lg border p-5 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold">Our free tools list</h1>
        {/* <h1 className="mb-4 text-2xl font-bold">Item List</h1> */}
        <div className="grid grid-cols-2">
          <ul className="space-y-4">
            <h1 className="mb-4 text-2xl font-bold">Youtube Tools</h1>
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-md border bg-white p-4 hover:bg-gray-50"
              >
                <span className="text-lg font-medium">{item.name}</span>
                <button
                  onClick={() => navigate(item.link)}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-blue-600"
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

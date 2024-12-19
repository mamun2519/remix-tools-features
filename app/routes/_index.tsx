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
    {
      id: 4,
      name: "Youtube Title Generator",
      link: "youtube-title-generator",
      docs: "https://kiwi-parrotfish-5f9.notion.site/Youtube-Title-Generator-15f380f1a0458090a968e07d896d1f60?pvs=4",
    },
    {
      id: 5,
      name: "Youtube Tags Generator",
      link: "youtube-tag-generator",
      docs: "https://kiwi-parrotfish-5f9.notion.site/Youtube-Tag-Generator-160380f1a0458048a419eacc1c34b054?pvs=4",
    },
    {
      id: 6,
      name: "YouTube Thumbnail Downloader",
      link: "youTube-thumbnail-downloader",
      docs: "https://kiwi-parrotfish-5f9.notion.site/Youtube-Thumbnail-Downloader-161380f1a04580498119ebdc897374b5?pvs=4",
    },
    {
      id: 7,
      name: "YouTube Tag Extractor",
      link: "youTube-tag-extractor",
      docs: "https://kiwi-parrotfish-5f9.notion.site/Youtube-tag-Extractor-161380f1a04580ca8e17dff94c9f9b3a?pvs=4",
    },
    {
      id: 8,
      name: "YouTube Description Generator",
      link: "youTube-description-generator",
      docs: "https://kiwi-parrotfish-5f9.notion.site/YouTube-Description-Generator-161380f1a045805db960f33ab9aec72a?pvs=4",
    },
  ]);
  return (
    <main className="p-10">
      <div className="h-full w-full rounded-lg border p-5 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold uppercase">
          Our free tools list
        </h1>
        {/* <h1 className="mb-4 text-2xl font-bold">Item List</h1> */}
        <div className="grid grid-cols-3">
          <ul className="space-y-4">
            <h1 className="mb-4 text-2xl font-bold">Youtube Tools</h1>
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-md border bg-white p-2 hover:bg-gray-50"
              >
                <span className="font-medium">{item.name}</span>
                <div className="flex gap-5">
                  <a
                    target="_blank"
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    href={item.docs}
                    rel="noreferrer"
                  >
                    Docs
                  </a>
                  <button
                    onClick={() => navigate(item.link)}
                    className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    View
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

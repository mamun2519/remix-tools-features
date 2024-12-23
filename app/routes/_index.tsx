import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const navigate = useNavigate();
  const [youtubeItems, setYoutubeItems] = useState();
  const [tools, setTools] = useState([]);

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
            {youtubeItems.map((item) => (
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

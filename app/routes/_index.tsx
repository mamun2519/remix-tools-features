import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  return (
    <main className="p-10">
      <div className="h-96 w-full rounded-lg border p-5 shadow-sm">
        <h1 className="font-semibold">Our free tools list</h1>
      </div>
    </main>
  );
}

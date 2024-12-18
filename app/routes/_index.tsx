import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  return (
    <main className="p-10">
      <div className="h-96 w-full rounded-lg border"></div>
      <h1 className="text-3xl font-semibold">Bare Metal Remix</h1>
    </main>
  );
}

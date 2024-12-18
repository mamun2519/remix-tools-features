import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  return (
    <main className="">
      <h1 className="text-3xl font-semibold">Bare Metal Remix</h1>
    </main>
  );
}

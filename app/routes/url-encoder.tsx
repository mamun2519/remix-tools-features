/* eslint-disable jsx-a11y/label-has-associated-control */
import { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Url encoded" },
    {
      name: "description",
      content: "url encoded tools",
    },
  ];
};

const UrlEncodedTools = () => {
  return (
    <div className="mx-auto mt-20 max-w-4xl border p-6">
      <h1 className="mb-4 text-2xl font-bold">Base64 Url encoded Tools</h1>
      <Form action="post" className="space-y-4">
        <div>
          <label htmlFor="input" className="mb-1 block font-medium">
            Input text
          </label>
          <textarea
            id="inputText"
            name="inputText"
            rows={4}
            className="w-full rounded border p-2 outline-slate-100"
            defaultValue=""
          ></textarea>
        </div>

        <div>
          <label htmlFor="charset" className="mb-1 block font-medium">
            Character Set
          </label>
          <select
            id="charset"
            name="charset"
            className="w-full rounded border p-2"
            defaultValue="utf-8"
          >
            <option value="utf-8">UTF-8 (Default)</option>
            <option value="ascii">ASCII</option>
            <option value="utf-16">UTF-16</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block font-medium">Operation</label>
          <div>
            <label htmlFor="">
              <input type="text" />
            </label>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UrlEncodedTools;

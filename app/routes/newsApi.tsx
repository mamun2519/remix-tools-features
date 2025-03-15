import { json } from "@remix-run/node";
import React from "react";
const NEWS_API_URL = "https://eventregistry.org/api/v1/article/getArticles";

export const loader = async () => {
  return json({ ok: true });
};
const NewsApi = () => {
  return (
    <div>
      <h3>News APi</h3>
    </div>
  );
};

export default NewsApi;

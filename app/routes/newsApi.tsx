import { json } from "@remix-run/node";
import axios from "axios";
import React from "react";
const NEWS_API_URL = "https://eventregistry.org/api/v1/article/getArticles";
const API_KEY = "e76afccd-a989-4e02-b25e-14fde05cadd2";
export const loader = async () => {
  const fetchBreakingNews = async () => {
    try {
      const response = await axios.get(NEWS_API_URL, {
        params: {
          action: "getArticles",
          keyword: "breaking news",
          lang: "eng",
          articlesCount: 10,
          resultType: "articles",
          apiKey: API_KEY,
        },
      });

      const articles = response.data.articles.results;
      return articles;
    } catch (error) {
      console.error("Error fetching breaking news:", error);
      return [];
    }
  };
  const result = fetchBreakingNews();
  console.log(result);
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

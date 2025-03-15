import { json } from "@remix-run/node";
import axios from "axios";
import React from "react";
const NEWS_API_URL = "https://eventregistry.org/api/v1/article/getArticles";
const API_KEY = "e76afccd-a989-4e02-b25e-14fde05cadd2";
const TRENDING_API_URL =
  "https://eventregistry.org/api/v1/trends/getTrendingTopics";
function displayBreakingNews(articles: any[]) {
  console.log("Breaking News:");
  articles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
    console.log(`   Source: ${article.source.title}`);
    console.log(`   Published: ${article.publishedAt}`);
    console.log(`   URL: ${article.url}`);
    console.log("---");
  });
}

const fetchBreakingNews = async () => {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        action: "getArticles",
        keyword: "breaking news",
        lang: "eng",
        articlesCount: 50,
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

async function fetchTrendingTopics() {
  try {
    const response = await axios.get(TRENDING_API_URL, {
      params: {
        action: "getTrendingTopics",
        lang: "eng", // English topics
        count: 10, // Number of topics to fetch
        apiKey: API_KEY,
      },
    });

    // Check if the response contains data
    if (response.data && response.data.topics) {
      return response.data.topics;
    } else {
      console.error("No trending topics found in the response:", response.data);
      return [];
    }
  } catch (error) {
    console.error(
      "Error fetching trending topics:",
      error.response ? error.response.data : error.message,
    );
    return [];
  }
}

export const loader = async () => {
  // const breakingNews = await fetchBreakingNews();

  // displayBreakingNews(breakingNews);
  // console.log(result);
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

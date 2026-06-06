import ComingSoon from "@/src/ComingSoon";
import React from "react";
import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({
  title: "Real Estate News | AI Bricks Realtors",
  description: "Latest real estate news, market trends, and property insights from AI Bricks Realtors.",
  path: "/news",
});

const PageNews = () => {
  return (
    <div>
      <ComingSoon />
    </div>
  );
};

export default PageNews;

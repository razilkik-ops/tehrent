import { useEffect } from "react";

type PageMetaOptions = {
  title: string;
  description: string;
  canonical?: string;
  robots?: string;
  image?: string;
  type?: string;
  structuredData?: Array<Record<string, unknown>>;
};

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  return element;
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  return element;
}

export function usePageMeta({
  title,
  description,
  canonical,
  robots,
  image,
  type = "website",
  structuredData = []
}: PageMetaOptions) {
  useEffect(() => {
    document.title = title;

    upsertMeta('meta[name="description"]', { name: "description", content: description });

    if (robots) {
      upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
    }

    if (canonical) {
      upsertLink('link[rel="canonical"]', { rel: "canonical", href: canonical });
      upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    }

    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "Arentex.by" });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: "ru_BY" });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });

    if (image) {
      upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
      upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
    }

    document.head.querySelectorAll('script[data-seo-structured-data="true"]').forEach((node) => node.remove());

    structuredData.forEach((entry) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoStructuredData = "true";
      script.text = JSON.stringify(entry);
      document.head.appendChild(script);
    });
  }, [canonical, description, image, robots, structuredData, title, type]);
}

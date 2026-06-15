const SITE_URL = (process.env.SITE_URL || "https://arentex.by").replace(/\/+$/, "");
const BRAND_NAME = "Arentex.by";
const DEFAULT_TITLE = "Аренда спецтехники в Минске с доставкой | Arentex.by";
const DEFAULT_DESCRIPTION =
  "Аренда мини-экскаваторов, мини-погрузчиков, экскаваторов-погрузчиков, самосвалов и другой спецтехники в Минске с доставкой и оператором.";
const DEFAULT_IMAGE = `${SITE_URL}/images/equipment/hero-mini-equipment-desktop.jpg`;
const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const DEFAULT_PHONE = "+375299209582";
const DEFAULT_LOCALE = "ru_BY";

const categoryRentalPrefixes = {
  "Мини-экскаваторы": "Аренда мини-экскаватора",
  "Мини-погрузчики": "Аренда мини-погрузчика",
  "Экскаваторы-погрузчики": "Аренда экскаватора-погрузчика",
  "Фронтальные погрузчики": "Аренда фронтального погрузчика",
  Самосвалы: "Аренда самосвала",
  Автовышки: "Аренда автовышки",
  Катки: "Аренда катка",
  "Навесное оборудование": "Аренда навесного оборудования"
};

const titleCleanupPatterns = {
  "Экскаваторы-погрузчики": /^экскаватор-погрузчик\s+/i,
  "Фронтальные погрузчики": /^фронтальный погрузчик\s+/i,
  Самосвалы: /^самосвалы?\s+/i,
  Автовышки: /^автовышка\s+/i,
  Катки: /^каток\s+/i
};

function formatPrice(value) {
  return `${new Intl.NumberFormat("ru-BY").format(value)} руб`;
}

function normalizePathname(pathname = "/") {
  const [cleanPath] = pathname.split(/[?#]/);
  if (!cleanPath || cleanPath === "/") {
    return "/";
  }

  return cleanPath.replace(/\/+$/, "") || "/";
}

function toAbsoluteUrl(pathname = "/") {
  return `${SITE_URL}${normalizePathname(pathname)}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildImageUrl(imageUrl) {
  if (!imageUrl) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${SITE_URL}${imageUrl}`;
}

function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND_NAME,
    url: SITE_URL,
    image: DEFAULT_IMAGE,
    telephone: DEFAULT_PHONE,
    email: "info@arentex.by",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Минск",
      addressCountry: "BY"
    },
    areaServed: ["Минск", "Минская область", "Беларусь"],
    priceRange: "$$",
    sameAs: [SITE_URL]
  };
}

function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: SITE_URL,
    inLanguage: "ru-BY"
  };
}

function getEquipmentRentalPrefix(item) {
  return categoryRentalPrefixes[item.category] || "Аренда спецтехники";
}

function getEquipmentModelName(item) {
  const pattern = titleCleanupPatterns[item.category];
  return pattern ? item.title.replace(pattern, "").trim() : item.title;
}

function getEquipmentSeoTitle(item) {
  return `${getEquipmentRentalPrefix(item)} ${item.title} в Минске | ${BRAND_NAME}`;
}

function getEquipmentSeoDescription(item) {
  const priceLabel = item.priceLabel || `Цена от ${formatPrice(item.pricePerShift)} за смену.`;
  return `${getEquipmentSeoHeading(item)}. ${item.shortDescription} Доставка по Минску и области, возможна аренда с оператором. ${priceLabel}`;
}

function getEquipmentSeoHeading(item) {
  return `${getEquipmentRentalPrefix(item)} ${getEquipmentModelName(item)}`;
}

function findEquipmentBySlug(pathname, equipment) {
  const normalizedPath = normalizePathname(pathname);
  const match = normalizedPath.match(/^\/equipment\/([^/]+)$/);
  if (!match) return null;

  const slug = decodeURIComponent(match[1]);
  return (
    equipment.find((item) => item.slug === slug || item.legacySlugs?.includes(slug)) || null
  );
}

function isLegacyEquipmentPath(pathname, item) {
  const normalizedPath = normalizePathname(pathname);
  const match = normalizedPath.match(/^\/equipment\/([^/]+)$/);
  if (!match) return false;

  const slug = decodeURIComponent(match[1]);
  return Boolean(item.legacySlugs?.includes(slug));
}

function buildEquipmentSchema(item) {
  const canonicalUrl = toAbsoluteUrl(`/equipment/${item.slug}`);
  const offer = {
    "@type": "Offer",
    priceCurrency: "BYN",
    availability:
      item.availability === "today"
        ? "https://schema.org/InStock"
        : item.availability === "tomorrow"
          ? "https://schema.org/LimitedAvailability"
          : "https://schema.org/PreOrder",
    url: canonicalUrl
  };

  if (!item.priceLabel) {
    offer.price = String(item.pricePerShift);
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: getEquipmentSeoHeading(item),
    brand: {
      "@type": "Brand",
      name: BRAND_NAME
    },
    category: item.category,
    description: getEquipmentSeoDescription(item),
    image: [buildImageUrl(item.imageUrl), buildImageUrl(item.mobileImageUrl)].filter(Boolean),
    offers: offer
  };
}

function buildBreadcrumbSchema(item) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: SITE_URL
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Техника",
        item: SITE_URL
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.category,
        item: SITE_URL
      },
      {
        "@type": "ListItem",
        position: 4,
        name: item.title,
        item: toAbsoluteUrl(`/equipment/${item.slug}`)
      }
    ]
  };
}

function getHomeMeta(equipment = []) {
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonical: toAbsoluteUrl("/"),
    robots: DEFAULT_ROBOTS,
    image: DEFAULT_IMAGE,
    type: "website",
    structuredData: [
      buildOrganizationSchema(),
      buildWebsiteSchema(),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Каталог спецтехники",
        itemListElement: equipment.slice(0, 8).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: toAbsoluteUrl(`/equipment/${item.slug}`),
          name: getEquipmentSeoHeading(item)
        }))
      }
    ]
  };
}

function getEquipmentMeta(item) {
  return {
    title: getEquipmentSeoTitle(item),
    description: getEquipmentSeoDescription(item),
    canonical: toAbsoluteUrl(`/equipment/${item.slug}`),
    robots: DEFAULT_ROBOTS,
    image: buildImageUrl(item.imageUrl || item.mobileImageUrl),
    type: "product",
    structuredData: [buildEquipmentSchema(item), buildBreadcrumbSchema(item)]
  };
}

function getAdminMeta() {
  return {
    title: `Админ-панель | ${BRAND_NAME}`,
    description: "Служебный раздел управления каталогом спецтехники.",
    canonical: toAbsoluteUrl("/admin"),
    robots: "noindex, nofollow",
    image: DEFAULT_IMAGE,
    type: "website",
    structuredData: []
  };
}

function getFallbackMeta() {
  return {
    title: `Страница не найдена | ${BRAND_NAME}`,
    description: "Запрошенная страница не найдена. Вернитесь в каталог спецтехники Arentex.by.",
    canonical: toAbsoluteUrl("/"),
    robots: "noindex, follow",
    image: DEFAULT_IMAGE,
    type: "website",
    structuredData: [buildOrganizationSchema(), buildWebsiteSchema()]
  };
}

function getMetaForPath(pathname, equipment = []) {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath === "/") {
    return getHomeMeta(equipment);
  }

  if (normalizedPath === "/admin") {
    return getAdminMeta();
  }

  const item = findEquipmentBySlug(normalizedPath, equipment);
  if (item) {
    const meta = getEquipmentMeta(item);

    if (isLegacyEquipmentPath(normalizedPath, item)) {
      return {
        ...meta,
        robots: "noindex, follow"
      };
    }

    return meta;
  }

  return getFallbackMeta();
}

function renderMetaTags(meta) {
  const structuredDataScripts = (meta.structuredData || [])
    .map(
      (entry) => `<script type="application/ld+json">${JSON.stringify(entry)}</script>`
    )
    .join("\n    ");

  return `<!-- SEO:BEGIN -->
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <meta name="robots" content="${escapeHtml(meta.robots || DEFAULT_ROBOTS)}" />
    <link rel="canonical" href="${escapeHtml(meta.canonical)}" />
    <meta property="og:locale" content="${DEFAULT_LOCALE}" />
    <meta property="og:type" content="${escapeHtml(meta.type || "website")}" />
    <meta property="og:site_name" content="${BRAND_NAME}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:url" content="${escapeHtml(meta.canonical)}" />
    <meta property="og:image" content="${escapeHtml(meta.image || DEFAULT_IMAGE)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${escapeHtml(meta.image || DEFAULT_IMAGE)}" />
    ${structuredDataScripts}
    <!-- SEO:END -->`;
}

function applySeoToHtml(html, meta) {
  return html.replace(/<!-- SEO:BEGIN -->[\s\S]*?<!-- SEO:END -->/, renderMetaTags(meta));
}

function buildSitemapXml(equipment = []) {
  const urls = [
    { path: "/", priority: "1.0" },
    ...equipment.map((item) => ({
      path: `/equipment/${item.slug}`,
      priority: "0.8"
    }))
  ];

  const body = urls
    .map(
      (entry) => `  <url>
    <loc>${escapeHtml(toAbsoluteUrl(entry.path))}</loc>
    <changefreq>weekly</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export {
  SITE_URL,
  BRAND_NAME,
  DEFAULT_IMAGE,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  DEFAULT_ROBOTS,
  applySeoToHtml,
  buildSitemapXml,
  findEquipmentBySlug,
  getEquipmentMeta,
  getEquipmentSeoDescription,
  getEquipmentSeoHeading,
  getEquipmentSeoTitle,
  getHomeMeta,
  getMetaForPath,
  normalizePathname,
  toAbsoluteUrl
};

const rawBaseUrl = import.meta.env.BASE_URL || "/";

export function normalizeBasePath(basePath = rawBaseUrl) {
  const trimmed = String(basePath).trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

export function getRouterBasename() {
  const normalized = normalizeBasePath();
  return normalized === "/" ? "/" : normalized;
}

export function buildAppPath(pathname = "/") {
  if (/^(?:[a-z]+:)?\/\//i.test(pathname)) {
    return pathname;
  }

  const normalizedBase = normalizeBasePath();
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return normalizedBase === "/" ? normalizedPath : `${normalizedBase}${normalizedPath}`;
}

export function buildAssetUrl(url?: string) {
  if (!url) {
    return url;
  }

  if (/^(?:[a-z]+:)?\/\//i.test(url) || !url.startsWith("/")) {
    return url;
  }

  return buildAppPath(url);
}

export function stripBasePath(pathname = "/") {
  const normalizedBase = normalizeBasePath();
  if (normalizedBase === "/" || pathname === normalizedBase) {
    return pathname === normalizedBase ? "/" : pathname;
  }

  return pathname.startsWith(`${normalizedBase}/`) ? pathname.slice(normalizedBase.length) || "/" : pathname;
}

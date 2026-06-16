import type { Equipment } from "./equipment";

export type GitHubStoredSettings = {
  owner: string;
  repo: string;
  branch: string;
  catalogPath: string;
  publicCatalogPath: string;
  uploadsDir: string;
};

export type GitHubConnectionSettings = GitHubStoredSettings & {
  token: string;
};

type GitHubFileResponse = {
  content: string;
  encoding: string;
  sha: string;
};

type GitHubRepoResponse = {
  default_branch: string;
};

class GitHubApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
}

export const defaultGitHubSettings: GitHubStoredSettings = {
  owner: import.meta.env.VITE_GITHUB_REPO_OWNER?.trim() || "",
  repo: import.meta.env.VITE_GITHUB_REPO_NAME?.trim() || "",
  branch: import.meta.env.VITE_GITHUB_BRANCH?.trim() || "main",
  catalogPath: import.meta.env.VITE_GITHUB_DATA_PATH?.trim() || "data/equipment.json",
  publicCatalogPath: import.meta.env.VITE_GITHUB_PUBLIC_DATA_PATH?.trim() || "public/data/equipment.json",
  uploadsDir: import.meta.env.VITE_GITHUB_UPLOADS_DIR?.trim() || "public/uploads/equipment"
};

function normalizeRepoPath(value: string) {
  return value.trim().replace(/^\/+|\/+$/g, "");
}

function encodeRepoPath(value: string) {
  return normalizeRepoPath(value)
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function decodeBase64Utf8(value: string) {
  const binary = atob(value.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeUtf8Base64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary);
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary);
}

function sanitizeFileNamePart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function imageExtension(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/jpeg") return "jpg";

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "png" || extension === "webp" || extension === "jpg" || extension === "jpeg") {
    return extension === "jpeg" ? "jpg" : extension;
  }

  return "jpg";
}

function publicUrlFromRepoPath(repoPath: string) {
  const normalized = normalizeRepoPath(repoPath).replace(/^public\//, "");
  return `/${normalized}`;
}

async function githubRequest<T>(settings: GitHubConnectionSettings, pathname: string, init?: RequestInit) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${settings.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {})
    }
  });

  const raw = await response.text();
  const data = raw ? (JSON.parse(raw) as T & { message?: string }) : null;

  if (!response.ok) {
    throw new GitHubApiError(data?.message || "GitHub API вернул ошибку", response.status);
  }

  return data as T;
}

async function getRepoFile(settings: GitHubConnectionSettings, repoPath: string) {
  return githubRequest<GitHubFileResponse>(
    settings,
    `/repos/${encodeURIComponent(settings.owner)}/${encodeURIComponent(settings.repo)}/contents/${encodeRepoPath(repoPath)}?ref=${encodeURIComponent(settings.branch)}`
  );
}

async function getRepoFileIfExists(settings: GitHubConnectionSettings, repoPath: string) {
  try {
    return await getRepoFile(settings, repoPath);
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

async function putRepoFile(
  settings: GitHubConnectionSettings,
  repoPath: string,
  content: string,
  message: string,
  sha?: string
) {
  return githubRequest<{ content: { sha: string } }>(
    settings,
    `/repos/${encodeURIComponent(settings.owner)}/${encodeURIComponent(settings.repo)}/contents/${encodeRepoPath(repoPath)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        content,
        branch: settings.branch,
        sha
      })
    }
  );
}

export function buildGitHubConnectionSettings(
  settings: GitHubStoredSettings,
  token: string
): GitHubConnectionSettings {
  return {
    owner: settings.owner.trim(),
    repo: settings.repo.trim(),
    branch: settings.branch.trim() || "main",
    catalogPath: normalizeRepoPath(settings.catalogPath) || defaultGitHubSettings.catalogPath,
    publicCatalogPath: normalizeRepoPath(settings.publicCatalogPath) || defaultGitHubSettings.publicCatalogPath,
    uploadsDir: normalizeRepoPath(settings.uploadsDir) || defaultGitHubSettings.uploadsDir,
    token: token.trim()
  };
}

export async function verifyGitHubConnection(settings: GitHubConnectionSettings) {
  const repo = await githubRequest<GitHubRepoResponse>(
    settings,
    `/repos/${encodeURIComponent(settings.owner)}/${encodeURIComponent(settings.repo)}`
  );

  await githubRequest(
    settings,
    `/repos/${encodeURIComponent(settings.owner)}/${encodeURIComponent(settings.repo)}/branches/${encodeURIComponent(settings.branch || repo.default_branch)}`
  );
}

export async function loadCatalogFromGitHub(settings: GitHubConnectionSettings) {
  const file = await getRepoFile(settings, settings.catalogPath);
  return JSON.parse(decodeBase64Utf8(file.content)) as Equipment[];
}

export async function saveCatalogToGitHub(settings: GitHubConnectionSettings, items: Equipment[]) {
  const payload = encodeUtf8Base64(JSON.stringify(items, null, 2) + "\n");
  const [catalogFile, publicCatalogFile] = await Promise.all([
    getRepoFileIfExists(settings, settings.catalogPath),
    getRepoFileIfExists(settings, settings.publicCatalogPath)
  ]);
  const message = `Update equipment catalog via admin panel`;

  await putRepoFile(settings, settings.catalogPath, payload, message, catalogFile?.sha);
  await putRepoFile(settings, settings.publicCatalogPath, payload, message, publicCatalogFile?.sha);
}

export async function uploadImageToGitHub(
  settings: GitHubConnectionSettings,
  file: File,
  slug: string,
  variant: "desktop" | "mobile"
) {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) && !/\.(png|jpe?g|webp)$/i.test(file.name)) {
    throw new Error("Поддерживаются JPG, PNG и WEBP");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Файл больше 8 МБ");
  }

  const extension = imageExtension(file);
  const safeSlug = sanitizeFileNamePart(slug) || "equipment";
  const repoPath = `${settings.uploadsDir}/${safeSlug}-${variant}-${Date.now()}.${extension}`;
  const content = arrayBufferToBase64(await file.arrayBuffer());

  await putRepoFile(
    settings,
    repoPath,
    content,
    `Upload ${variant} image for ${safeSlug}`
  );

  return publicUrlFromRepoPath(repoPath);
}

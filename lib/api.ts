// import "server-only";

const API_URL: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

/**
 * How long a payload is served out of the cache before Next.js refreshes it in
 * the background. Everything the public site reads is editorial content that a
 * kitchen edits a few times a week, so a five-minute window keeps pages fast
 * for crawlers — the HTML is prerendered, not re-fetched per visitor — while
 * an admin edit still reaches the site on its own.
 */
export const REVALIDATE_SECONDS = 300;

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ApiResponse<T> {
  data: T;
  /** The API sends `null` rather than omitting the key on unpaginated routes. */
  meta?: ApiMeta | null;
  statusCode?: number;
  success?: boolean;
  message?: string | null;
}

export interface GetDataOptions {
  /** Seconds before the entry is refreshed; `false` caches indefinitely. */
  revalidate?: number | false;
  /** Cache tags, so a webhook can drop just this data with `revalidateTag`. */
  tags?: string[];
}

export async function getData<T>(
  queryString: string,
  { revalidate = REVALIDATE_SECONDS, tags }: GetDataOptions = {},
): Promise<ApiResponse<T> | null> {
  try {
    const response = await fetch(`${API_URL}${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // `cache` is deliberately left off — pairing it with `next.revalidate`
      // makes Next.js ignore both.
      next: { revalidate, ...(tags ? { tags } : {}) },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    }

    const data: ApiResponse<T> = await response.json();
    return data;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      error.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.error("Error fetching data:", error);
    return null;
  }
}

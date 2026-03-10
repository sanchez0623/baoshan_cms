async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return null;
}

export async function requestAdmin<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(payload?.error ?? "请求失败，请稍后重试");
  }

  return payload as T;
}

export interface HttpClientOptions {
  baseUrl?: string
  headers?: HeadersInit
}

export class HttpError extends Error {
  constructor(public status: number, public body: unknown, message?: string) {
    super(message ?? `Request failed with status ${status}`)
    this.name = 'HttpError'
  }
}

export class HttpClient {
  private readonly baseUrl: string
  private readonly headers: HeadersInit

  constructor({ baseUrl = '', headers = {} }: HttpClientOptions = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.headers = headers
  }

  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
        ...init?.headers,
      },
    })

    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')
    const body = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      throw new HttpError(response.status, body, isJson && body?.error ? String(body.error) : undefined)
    }

    return body as T
  }

  get<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, { ...init, method: 'GET' })
  }

  post<T>(path: string, body?: unknown, init?: RequestInit) {
    return this.request<T>(path, {
      ...init,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }
}

export const defaultClient = new HttpClient({ baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '' })

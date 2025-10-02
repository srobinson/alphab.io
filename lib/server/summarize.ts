// Server-only summarization via OpenRouter (TypeScript)
// Env:
// - OPENROUTER_API_KEY (required)
// - OPENROUTER_MODEL (optional, default: 'anthropic/claude-3.5-sonnet')

const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet'

type OpenRouterChoiceMessage = {
  content?: string | null
}

type OpenRouterResponse = {
  choices?: Array<{
    message?: OpenRouterChoiceMessage
  }>
}

type SummarizeOptions = {
  model?: string
  maxTokens?: number
  temperature?: number
}

export async function summarize(text: string, opts: SummarizeOptions = {}): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.warn('[summarize] OPENROUTER_API_KEY missing; skipping summarization')
    return null
  }
  const model = opts.model || DEFAULT_MODEL
  const temperature = typeof opts.temperature === 'number' ? opts.temperature : 0.2
  const maxTokens = typeof opts.maxTokens === 'number' ? opts.maxTokens : 240

  const trimmed = text.length > 5000 ? text.slice(0, 5000) : text

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'system',
            content: 'You are a concise editor creating business-focused summaries for AI-curious executives. Limit to 1-2 sentences. No fluff.'
          },
          {
            role: 'user',
            content: `Summarize for a business audience in 1-2 sentences:\n\n${trimmed}`
          }
        ]
      })
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      console.warn('[summarize] OpenRouter non-OK:', res.status, txt)
      return null
    }
    const json = (await res.json()) as OpenRouterResponse
    const content = json.choices?.[0]?.message?.content
    return typeof content === 'string' ? content.trim() : null
  } catch (e: unknown) {
    console.warn('[summarize] error:', e)
    return null
  }
}

export async function summarizeNew(text: string, opts: SummarizeOptions = {}): Promise<string> {
  const model = opts.model || process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet'
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('Missing OPENROUTER_API_KEY')

  const prompt = `Summarize the following content in 1-2 concise, business-focused sentences. Avoid hype, keep it factual and useful.\n\n${text.slice(0, 4000)}`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a concise analyst for business-focused readers.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: opts.maxTokens ?? 200,
    }),
  })
  if (!res.ok) throw new Error(`OpenRouter summarize error: ${res.status}`)
  const data = (await res.json()) as OpenRouterResponse
  const content = data.choices?.[0]?.message?.content ?? ''
  return String(content ?? '').trim()
}

// Strip HTML tags for model input trimming
function stripHtml(input?: string | null): string {
  if (!input) return ''
  return input.replace(/<script[\s\S]*?<\/script>/gi, '')
              .replace(/<style[\s\S]*?<\/style>/gi, '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
}

export type SummarizeInfoInput = {
  url: string
  title: string
  description?: string | null
  contentHtml?: string | null
  model?: string
}

export type SummarizeInfoOutput = {
  summary: string
  tags: string[]
  sourceLabel?: string
}

export async function summarizeInfo(input: SummarizeInfoInput): Promise<SummarizeInfoOutput> {
  const model = input.model || process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet'
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('Missing OPENROUTER_API_KEY')

  const text = [
    `Title: ${input.title}`,
    input.description ? `Description: ${input.description}` : null,
    input.contentHtml ? `Content: ${stripHtml(input.contentHtml).slice(0, 6000)}` : null,
  ].filter(Boolean).join('\n')

  const system = [
    'You produce a compact JSON object for a link aggregator aimed at business/tech readers.',
    'Infer a human-readable source (publisher/site) if possible, else leave it out.',
    'Generate 3-6 concise topical tags in lowercase (words or hyphenated), no hashtags.',
    'The summary must be 1-2 sentences, factual, useful, and non-hype.',
    'Output ONLY valid JSON matching this TypeScript type: {"summary": string, "tags": string[], "sourceLabel"?: string}',
  ].join(' ')

  const user = `URL: ${input.url}\n\n${text}`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
      max_tokens: 400,
    }),
  })
  if (!res.ok) throw new Error(`OpenRouter summarizeInfo error: ${res.status}`)
  const data = (await res.json()) as OpenRouterResponse
  const content = data.choices?.[0]?.message?.content ?? '{}'

  try {
    const parsed = JSON.parse(content) as Partial<SummarizeInfoOutput>
    const summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : ''
    const tags = Array.isArray(parsed.tags)
      ? parsed.tags
          .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
          .map((tag) => tag.trim())
      : []
    const sourceLabel = typeof parsed.sourceLabel === 'string' ? parsed.sourceLabel.trim() : undefined
    return { summary, tags, sourceLabel }
  } catch {
    // Fallback: try to use plain text
    return { summary: String(content).trim(), tags: [], sourceLabel: undefined }
  }
}

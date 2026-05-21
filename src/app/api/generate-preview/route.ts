import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────
// Generate Image via OpenRouter (single call, grid image)
// ─────────────────────────────────────────────────────────────
async function generateOpenRouterImage(
  prompt: string,
  gridImageDataUrl: string,
  apiKey: string,
): Promise<string> {
  const payload = {
    model: 'google/gemini-3.1-flash-image-preview',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: gridImageDataUrl } },
        ],
      },
    ],
    modalities: ['image', 'text'],
  };

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('[OpenRouter Error]', JSON.stringify(data).slice(0, 600));
    throw new Error(data.error?.message || `HTTP ${res.status}`);
  }

  const message = data.choices?.[0]?.message;

  // Log the full message structure so we can debug the exact shape
  console.log('[OpenRouter] message keys:', Object.keys(message ?? {}));
  console.log('[OpenRouter] content type:', typeof message?.content, Array.isArray(message?.content) ? `[${message.content.map((b: any) => b.type).join(', ')}]` : '');

  // ── Try all known response shapes from OpenRouter/Gemini ─────────────────
  let rawUrl: string | undefined;

  // Path 1: message.images[] — OpenRouter SDK documented format
  if (message?.images?.length) {
    rawUrl = message.images[0]?.image_url?.url;
    console.log('[OpenRouter] Path 1 (message.images):', !!rawUrl);
  }

  // Path 2: message.content[] array with type === 'image_url'
  if (!rawUrl && Array.isArray(message?.content)) {
    const block = message.content.find((b: any) => b.type === 'image_url');
    rawUrl = block?.image_url?.url;
    console.log('[OpenRouter] Path 2 (content image_url block):', !!rawUrl);
  }

  // Path 3: message.content[] array with type === 'image' (Gemini native)
  if (!rawUrl && Array.isArray(message?.content)) {
    const block = message.content.find((b: any) => b.type === 'image');
    if (block?.source?.data) {
      rawUrl = `data:${block.source.media_type ?? 'image/jpeg'};base64,${block.source.data}`;
    } else {
      rawUrl = block?.url;
    }
    console.log('[OpenRouter] Path 3 (content image block):', !!rawUrl);
  }

  // Path 4: message.content is a raw base64 or data URI string
  if (!rawUrl && typeof message?.content === 'string' && message.content.length > 200) {
    rawUrl = message.content;
    console.log('[OpenRouter] Path 4 (content string):', !!rawUrl);
  }

  if (!rawUrl) {
    console.error('[OpenRouter] Could not extract image. Full message:', JSON.stringify(message).slice(0, 2000));
    throw new Error('No image returned from OpenRouter. Check server logs for the raw response structure.');
  }

  // Normalise — some variants return raw base64 without the data: prefix
  if (rawUrl.startsWith('data:') || rawUrl.startsWith('http')) return rawUrl;
  return `data:image/jpeg;base64,${rawUrl}`;
}

// ─────────────────────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { prompt, model, gridImage } = await req.json();

    // ── Input validation ───────────────────────────────────────
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'A valid prompt is required.' }, { status: 400 });
    }
    if (!gridImage || typeof gridImage !== 'string') {
      return NextResponse.json({ error: 'A valid gridImage (base64) is required.' }, { status: 400 });
    }
    if (!model || (model !== 'high-top' && model !== 'low-top')) {
      return NextResponse.json({ error: 'A valid model is required.' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server configuration error: missing API key.' }, { status: 500 });
    }

    // ── Generate the image via OpenRouter ─────────────────────
    // TODO: Re-enable auth + credit gate once authentication is set up.
    const modelLabel =
      model === 'high-top' ? 'classic canvas high-top sneaker' : 'trendy low-top sneaker';

    const fullPrompt =
      `${prompt}. ` +
      `The reference image is a 2x2 grid showing 4 angles of a blank ${modelLabel}: ` +
      `top-left is the outer side, top-right is the inner side, bottom-left is the back/angled view, bottom-right is the top-down view. ` +
      `Apply the described design consistently and coherently across ALL 4 panels, ` +
      `maintaining the exact same layout. Photorealistic product photography, ` +
      `white seamless studio background, sharp focus, 8k ultra-detailed. ` +
      `Do NOT alter the sneaker silhouette or structure.`;

    console.log(`[generate-preview] model=${model} | prompt="${prompt.slice(0, 60)}…"`);

    const resultUrl = await generateOpenRouterImage(fullPrompt, gridImage, apiKey);

    console.log(`[generate-preview] ✓ Generation complete.`);

    return NextResponse.json({ imageUrl: resultUrl });

  } catch (err: any) {
    console.error('[generate-preview] Unhandled error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

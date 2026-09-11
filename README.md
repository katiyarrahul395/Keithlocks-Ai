# Keithlocks AI

Clean rebuild of the Keithlocks AI fan project.

## Netlify

- Build command: none
- Publish directory: `.`
- Functions directory: `netlify/functions`
- The site calls `/api/chat` → `/.netlify/functions/chat`.

## AI backend — OpenRouter

The Netlify Function now uses **OpenRouter** instead of Gemini/Groq.

Set this Netlify environment variable:

```text
OPENROUTER_API_KEY=your_openrouter_key
```

The function defaults to:

```text
OPENROUTER_MODEL=openrouter/free
```

You can optionally set `OPENROUTER_MODEL` to another OpenRouter model. With `openrouter/free`, the router selects an available free model; free models can still have rate limits or temporary availability limits.

The API key is server-side only and is never placed in the browser.

## Important

This is an unofficial fan-made AI character. It is not the real Keithlocks and should not be presented as an official account or as a source of private information.

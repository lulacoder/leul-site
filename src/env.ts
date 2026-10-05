import { defineEnvVars } from '@sveltejs/kit/env';

// Keep the key optional so the chat endpoint can return its unavailable response.
export const variables = defineEnvVars({ GEMINI_API_KEY: { schema: (input) => input ?? '' } });

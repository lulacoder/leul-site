import { defineEnvVars } from '@sveltejs/kit/env';

// Keep keys optional so each endpoint can return its unavailable response
export const variables = defineEnvVars({
	GEMINI_API_KEY: { schema: (input) => input ?? '' },
	GITHUB_TOKEN: { schema: (input) => input ?? '' }
});

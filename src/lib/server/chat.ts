import { chatParamsFromRequestBody, type ModelMessage } from '@tanstack/ai';
import { MAX_CHAT_MESSAGES, MAX_INPUT_LENGTH } from '$lib/chat-limits';

const requests = new Map<string, { count: number; resetAt: number }>();

/** Restricts each server instance to fifteen chat requests per address per minute. */
export function allowChatRequest(address: string): boolean {
	const now = Date.now();
	for (const [key, entry] of requests) {
		if (entry.resetAt <= now) requests.delete(key);
	}
	const entry = requests.get(address);
	if (entry) return ++entry.count <= 15;
	// Bound the map even if many different addresses arrive in one minute.
	if (requests.size >= 1000) return false;
	requests.set(address, { count: 1, resetAt: now + 60_000 });
	return true;
}

/** Accepts only bounded, plain-text user and assistant history from the browser. */
export async function parseChatRequest(body: unknown) {
	const params = await chatParamsFromRequestBody(body);
	if (!params.messages.length || params.messages.length > MAX_CHAT_MESSAGES) {
		throw new Error('Invalid conversation length');
	}
	let totalLength = 0;
	const messages: ModelMessage[] = params.messages.map((message) => {
		if (message.role !== 'user' && message.role !== 'assistant') {
			throw new Error('Invalid message role');
		}
		if (!('content' in message) || typeof message.content !== 'string') {
			throw new Error('Only text messages are supported');
		}
		const limit = message.role === 'user' ? MAX_INPUT_LENGTH : 8000;
		if (!message.content.trim() || message.content.length > limit) {
			throw new Error('Invalid message length');
		}
		totalLength += message.content.length;
		return { role: message.role, content: message.content };
	});
	if (totalLength > 24_000 || messages.at(-1)?.role !== 'user') {
		throw new Error('Invalid conversation');
	}
	return { messages, threadId: params.threadId, runId: params.runId };
}

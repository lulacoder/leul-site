<script lang="ts">
	let { text }: { text: string } = $props();

	/** Makes supplied HTTPS and portfolio links clickable while keeping all text escaped. */
	function linkParts(value: string) {
		return value.split(/(https:\/\/[^\s]+|\/projects\/[a-z0-9-]+|\/#(?:contact|projects)|\/resume\.pdf)/g).flatMap((part) => {
			if (!/^(https:\/\/|\/projects\/|\/#(?:contact|projects)|\/resume\.pdf)/.test(part)) return [{ text: part, href: '' }];
			const href = part.replace(/[.,!?;:)]+$/, '');
			return [{ text: href, href }, { text: part.slice(href.length), href: '' }];
		});
	}
</script>

{#each linkParts(text) as part}
	{#if part.href}
		<a href={part.href} target={part.href.startsWith('https://') ? '_blank' : undefined} rel="noopener noreferrer">{part.text}</a>
	{:else}{part.text}{/if}
{/each}

<style>
	a { color: var(--color-accent); text-decoration: underline; text-underline-offset: 3px; overflow-wrap: anywhere; }
</style>

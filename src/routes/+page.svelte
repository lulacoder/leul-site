<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import Education from '$lib/components/Education.svelte';
	import Contact from '$lib/components/Contact.svelte';
</script>

<svelte:head>
	<title>Leul Tesfaye — Software Engineer</title>
	<meta
		name="description"
		content="Leul Tesfaye — software engineering student at Addis Ababa University. I build full-stack products, ship them, and keep learning."
	/>
	<meta property="og:title" content="Leul Tesfaye — Software Engineer" />
	<meta
		property="og:description"
		content="Software engineering student at AAU building full-stack products that ship."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<!-- Single-page scroll: Hero → About → Projects → Skills → Education → Contact -->
<Hero />
<About />
<Projects />
<Skills />
<Education />
<Contact />

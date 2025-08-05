<script lang="ts">
	import '../app.css';
	import FFmpegConsole from '$lib/FFmpegConsole.svelte';
    import { recordAnimation } from '$lib/utils';
    import { timelines } from '$lib/store';

	let { children } = $props();
</script>

{@render children()}

<div class="fixed bottom-4 right-4">
    <button class="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer ml-2" onclick={() => $timelines.forEach(tl => tl.play())}>
        Play
    </button>
    <button class="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer" onclick={recordAnimation}>
        Render
    </button>
</div>

<FFmpegConsole />

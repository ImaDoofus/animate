<script lang="ts">
import { onMount } from 'svelte';
import { createTimeline, stagger } from 'animejs';
import { element, timelines } from '$lib/store';

const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah', 'Irene', 'Jack', 'Kathy', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rita', 'Sam', 'Tina'];
const heads = names.map((name, i) => ({
	id: i,
	x: (i % 8) * 100,
	y: [Math.floor(i / 8) * 200],
	name
}));

onMount(() => {
	const tl = createTimeline({ autoplay: false, frameRate: 60 });
	$timelines = [tl]

	tl
		.add('.small', {
			translateX: (el) => el.dataset.x,
			translateY: () => 1000,
		})
		.add('.small', {
			ease: 'outQuart',
			translateY: (el) => el.dataset.y,
			opacity: { from: 0, to: 1 },
			delay: stagger(100)
		}, '+=500')
		.add('.small', {
			translateY: (el) => el.dataset.y - 50,
			easing: 'easeInOutQuad',
			duration: 1500,
			loop: true,
			alternate: true,
		})
});
</script>

<div class="flex items-center justify-center h-screen bg-transparent" bind:this={$element}>
	<div class="relative w-[800px] h-[800px]">
	{#each heads as { x, y, name }}
		<div class="small absolute z-20 flex flex-col items-center justify-center" data-x={x} data-y={y}>
			<img crossorigin="anonymous" src={`https://mc-heads.net/avatar/${name}`} alt={name} class="w-[80px] h-[80px] rounded-sm" />
			<div class="text-[#ffeaea] text-[20px] font-minecraft rounded-lg p-2">{name}</div>
		</div>
	{/each}
	</div>
</div>
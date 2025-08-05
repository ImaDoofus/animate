<script lang="ts">
import { onMount } from 'svelte';
import { animate, createTimeline, stagger, utils, type DOMTargetSelector } from 'animejs';
import { element, timelines } from '$lib/store';

const grid = [8, 8];
let squares = Array.from({ length: 64 }, (_, i) => ({
	id: i,
	x: (i % grid[0]) * 100,
	y: Math.floor(i / grid[0]) * 100,
}));

onMount(() => {
	const first = squares[0];
	const target = document.querySelector('.small:nth-child(2)') as HTMLElement;
	if (!target) throw new Error('Target element not found');
	target.style.opacity = '0';

	const blink = createTimeline({ autoplay: false }).add(target, {
		opacity: [1, 0.9, 1],
		scale: [1, 1.04, 1],
		easing: 'easeInOutQuad',
		duration: 1000,
		loop: true,
	}, "+=10000");

	const cssVar = (name: string) => ($el: DOMTargetSelector) => utils.get($el, name);

	const tl = createTimeline({ autoplay: false, frameRate: 60, delay: 0 });
	tl
		.add('.small', {
			translateX: (el) => el.dataset.x,
			translateY: (el) => el.dataset.y,
		})
		.add('.big', {
			opacity: [1, 0],
			// color: ['#ffeaeaff', '#dbe5ff00'],
			// color goes from red opaque to blue transparent using variables and mixing
			color: [cssVar('--cube-red-text'), cssVar('--cube-blue-text')],
			backgroundColor: [cssVar('--cube-red-bg'), cssVar('--cube-blue-bg')],
			borderColor: [cssVar('--cube-red-border'), cssVar('--cube-blue-border')],
		}, '+=1500')
		.add('.small', {
			opacity: [0, 1],
			color: [cssVar('--cube-red-text'), cssVar('--cube-blue-text')],
			backgroundColor: [cssVar('--cube-red-bg'), cssVar('--cube-blue-bg')],
			borderColor: [cssVar('--cube-red-border'), cssVar('--cube-blue-border')],
			delay: stagger(100, { grid, from: "first" })
		}, '-=1250')
		.add('.small:nth-child(2)', { opacity: 1 }, '<<+=500')
		.add('.big', {
			ease: 'inOutQuint',
			opacity: [0, 1, 0],
			duration: 2500,
			color: [cssVar('--cube-blue-text'), cssVar('--cube-red-text'), cssVar('--cube-blue-text')],
			backgroundColor: [cssVar('--cube-blue-bg'), cssVar('--cube-red-bg'), cssVar('--cube-blue-bg')],
			borderColor: [cssVar('--cube-blue-border'), cssVar('--cube-red-border'), cssVar('--cube-blue-border')],
		}, '+=800')
		.add('.small', {
			ease: 'inOutQuart',
			opacity: [1, 0, 1],
			duration: 2000,
			color: [cssVar('--cube-blue-text'), cssVar('--cube-red-text'), cssVar('--cube-blue-text')],
			backgroundColor: [cssVar('--cube-blue-bg'), cssVar('--cube-red-bg'), cssVar('--cube-blue-bg')],
			borderColor: [cssVar('--cube-blue-border'), cssVar('--cube-red-border'), cssVar('--cube-blue-border')],
		}, '<<')
		.add('.small', {
			opacity: [1, 0.4 ],
			delay: stagger(100, { grid, from: "first" })
		}, '+=2000')
		.add('.small:nth-child(2)', { opacity: 1 }, '<<')
		.label('dragOver', '<')

  utils.shuffle(squares.slice(1, 64)).slice(0, 10).forEach(({ id }) => {
    tl
			.add(`.small:nth-child(${id + 2})`, {
				translateX: first.x,
				translateY: first.y,
				opacity: [0, 0.8],
				duration: 400,
			}, 'dragOver')
			.label("dragOver");
  });

	tl
		.add('.small', {
			opacity: 0,
			duration: 400,
			easing: 'outQuad',
		}, 'dragOver');

	$timelines.push(tl);
	$timelines.push(blink);
});
</script>

<div class="test flex items-center justify-center h-screen bg-transparent" bind:this={$element}>
	<div class="relative w-[800px] h-[800px]">
    <div class="big absolute inset-0 z-10 flex justify-center items-center text-(--cube-red-text) text-[180px] font-minecraft bg-(--cube-red-bg) border-16 border-(--cube-red-border) rounded-3xl">
			256
		</div>

  {#each squares as { id, x, y }}
    <div class="small absolute top-0 left-0 w-[95px] h-[95px] flex justify-center items-center text-(--cube-blue-text) text-[48px] font-minecraft bg-(--cube-blue-bg) border-8 border-(--cube-blue-border) rounded-2xl opacity-0" data-x={x} data-y={y}>
			<span class="ml-1.5 mb-1.5">32</span>
    </div>
  {/each}
	</div>
</div>

<style>
/* set color variables */
:root {
	--cube-red-bg: #f42929;
	--cube-red-border: #bb0808;
	--cube-red-text: #ffeaea;
	--cube-blue-bg: #2680ff;
	--cube-blue-border: #0546de;
	--cube-blue-text: #dbe5ff;
}
</style>
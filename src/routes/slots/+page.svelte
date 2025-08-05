<script lang="ts">
import { onMount } from 'svelte';
import { createTimeline, stagger } from 'animejs';
import { element, timelines } from '$lib/store';

const offset = [26, -537];
const slots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: (i % 9) * 56 + offset[0],
    y: Math.floor(i / 9) * 57 + offset[1],
}));

onMount(() => {
    const tl = createTimeline({ autoplay: false, frameRate: 60 });
	$timelines = [tl];

    tl
		.add('.small', {
			translateX: (el) => el.dataset.x,
			translateY: (el) => el.dataset.y,
            opacity: 0,
		})
        .add('.small:nth-child(2)', {
            ease: 'outQuart',
            opacity: [0, 1],
        }, '+=200')
        .add('.small:nth-child(3)', {
            ease: 'outQuart',
            opacity: [0, 1],
        }, '+=200')
		.add('.small:not(:nth-child(2)):not(:nth-child(3))', {
			ease: 'outQuart',
            opacity: [0, 1],
			delay: stagger(50)
		}, '+=500')
});
</script>

<div class="flex items-center justify-center h-screen bg-transparent" bind:this={$element}>
    <div class="relative w-[800px] h-[800px]">
        <img src='./assets/images/gui.png' alt='Crafting table gui' class="w-[800px] [image-rendering:pixelated]" />
        {#each slots as { x, y, id }}
            <div class="small absolute z-10 flex flex-col items-center justify-center" data-x={x} data-y={y}>
                <img src='./assets/images/barrier.png' alt='Barrier item' class="w-[48px] h-[48px] [image-rendering:pixelated] drop-shadow-md" width="48" height="48">
            </div>
        {/each}
	</div>
</div>
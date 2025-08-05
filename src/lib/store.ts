import { createTimeline, type Timeline } from "animejs";
import { writable } from "svelte/store"

export const consoleOutput = writable<string[]>([]);
export const element = writable<HTMLElement>(document.createElement('div'));
export const timelines = writable<Timeline[]>([]);
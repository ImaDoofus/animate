<script lang="ts">
  import { consoleOutput } from './store';
  import { onMount } from 'svelte';

  let output: string[] = [];

  const unsubscribe = consoleOutput.subscribe(value => {
    output = value;
  });

  onMount(() => {
    return () => {
      unsubscribe();
    };
  });
</script>

<style>
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: monospace;
    margin: 0;
    padding: 10px;
    background-color: #1e1e1e;
    color: #dcdcdc;
    height: 100%;
    overflow-y: auto;
  }
</style>

<pre>{output.join('\n')}</pre>

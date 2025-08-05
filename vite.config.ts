import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const crossOriginIsolation = () => ({
  name: 'configure-server',

  configureServer(server) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      next();
    });
  }
});

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), crossOriginIsolation()],
	optimizeDeps: {
    	exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
	},
	esbuild: {
		target: 'esnext',
	}
});

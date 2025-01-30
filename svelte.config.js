import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// import adapter from '@sveltejs/adapter-cloudflare';
import adapter from '@sveltejs/adapter-static';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([vitePreprocess({}), preprocessMeltUI()]),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: true,
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		}),
		prerender: {
			entries: ['*']
		 },
		alias: {
			'@/*': './path/to/lib/*',
			$ui: 'src/lib/components/ui',
			$components: 'src/lib/components',
			$store: 'src/lib/store'
		}
	}
};
export default config;

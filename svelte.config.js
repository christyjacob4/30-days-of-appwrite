import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		postcss: true,
	}),

	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'dist',
			assets: 'dist',
			fallback: null,
			precompress: false
		}),
		prerender: {
			default: true
		},
		// trailingSlash: 'always'
	},
};

export default config;

import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
	(warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	(warning.code === 'THIS_IS_UNDEFINED') ||
	onwarn(warning);

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
				'process.env.OCEAN_API_URL': JSON.stringify(process.env.OCEAN_API_URL),
				'process.env.ANONYM_TOKEN': JSON.stringify(process.env.ANONYM_TOKEN),
				'process.env.ANONYM_ALLOWED': JSON.stringify(process.env.ANONYM_ALLOWED)
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: true,
				preprocess: autoPreprocess()
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			typescript({ sourceMap: dev, inlineSources: dev }),

			!dev && terser({
				module: true
			})
		],

		preserveEntrySignatures: false,
		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				generate: 'ssr',
				dev,
				preprocess: autoPreprocess()
			}),
			resolve({
				dedupe: ['svelte']
			}),
			commonjs(),
			typescript({ sourceMap: dev, inlineSources: dev })
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),

		preserveEntrySignatures: 'strict',
		onwarn,
		// onwarn: function (warning) {
		// 	console.warn(warning);
		// }
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			commonjs(),
			typescript({ sourceMap: dev, inlineSources: dev }),
			!dev && terser()
		],

		preserveEntrySignatures: false,
		onwarn,
	}
};

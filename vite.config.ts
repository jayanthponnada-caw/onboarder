import {
	baseFmt,
	baseLint,
	coreFmt,
	coreLint,
	sharedBuildConfig,
	webFmt,
	webLint,
} from "@repo/oxc-config"
import { defineConfig } from "vite-plus"

export default defineConfig({
	build: sharedBuildConfig.build,
	fmt: {
		...baseFmt,
		overrides: [
			{
				files: ["apps/web/**"],
				options: webFmt,
			},
			{
				files: ["apps/core/**"],
				options: coreFmt,
			},
		],
	},
	lint: {
		...baseLint,
		overrides: [
			{
				files: ["apps/web/**", "packages/design-system/**"],
				...webLint,
			},
			{
				files: ["apps/core/**"],
				...coreLint,
			},
		],
	},
	staged: {
		"*.{js,cjs,mjs,jsx,ts,tsx,json,jsonc,css,md}": "vp check --fix",
	},
})

import type { OxfmtConfig } from "vite-plus/fmt"
import type { OxlintConfig } from "vite-plus/lint"
import type { UserConfig } from "vite-plus"

export const ignoredPaths = [
	"**/node_modules/**",
	"**/.agents/**",
	"**/.turbo/**",
	"**/.vinxi/**",
	"**/.wrangler/**",
	"**/.output/**",
	"**/.tanstack/**",
	"**/dist/**",
	"**/build/**",
	"**/coverage/**",
	"**/routeTree.gen.ts",
	"**/*.tsbuildinfo",
	"**/AGENTS.md",
] satisfies string[]

export const baseFmt = {
	ignorePatterns: [...ignoredPaths],
	printWidth: 100,
	semi: false,
	singleQuote: false,
	trailingComma: "all",
	useTabs: true,
} satisfies OxfmtConfig

export const webFmt = {} satisfies OxfmtConfig

export const coreFmt = {} satisfies OxfmtConfig

export const baseLint = {
	ignorePatterns: [...ignoredPaths],
	jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
	options: {
		typeAware: true,
		typeCheck: true,
	},
	rules: {
		curly: "error",
		eqeqeq: "error",
		"import/no-cycle": "error",
		"no-alert": "error",
		"no-console": ["error", { allow: ["error", "warn"] }],
		"no-debugger": "error",
		"no-else-return": "error",
		"no-eval": "error",
		"no-explicit-any": "error",
		"no-implicit-coercion": "error",
		"no-new-func": "error",
		"no-non-null-assertion": "error",
		"no-throw-literal": "error",
		"no-unused-vars": "error",
		"no-var": "error",
		"prefer-const": "error",
		"prefer-template": "error",
		"typescript/consistent-type-imports": "error",
		"typescript/no-floating-promises": "error",
		"typescript/no-non-null-assertion": "error",
		"unicorn/prefer-node-protocol": "error",
		"vite-plus/prefer-vite-plus-imports": "error",
	},
} satisfies OxlintConfig

export const webLint = {
	rules: {
		"react-hooks/exhaustive-deps": "error",
		"react-hooks/rules-of-hooks": "error",
		"react/jsx-key": "error",
		"react/jsx-no-target-blank": "error",
		"react/no-danger": "error",
	},
} satisfies OxlintConfig

export const coreLint = {
	rules: {
		"no-console": ["error", { allow: ["error", "info", "warn"] }],
		"no-restricted-imports": [
			"error",
			{
				patterns: [
					{
						group: ["node:*"],
						message:
							"Core runs as a Cloudflare Worker. Keep Node APIs out of runtime code unless the Worker compatibility layer explicitly supports them.",
					},
				],
			},
		],
	},
} satisfies OxlintConfig

export const sharedBuildConfig: UserConfig = {
	build: {
		cssMinify: "lightningcss",
		minify: "oxc",
		rolldownOptions: {},
	},
}

import babel from "@rolldown/plugin-babel"
import { sharedBuildConfig } from "@repo/oxc-config"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite-plus"

const isVitest = process.env["VITEST"] === "true"

const config = defineConfig({
	...sharedBuildConfig,
	plugins: [
		!isVitest && devtools(),
		!isVitest && nitro({ rolldownConfig: { external: [/^@sentry\//] } }),
		tailwindcss(),
		!isVitest && tanstackStart(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
	resolve: { tsconfigPaths: true },
})

export default config

import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"

const isVitest = process.env["VITEST"] === "true"

const config = defineConfig({
	plugins: [
		!isVitest && devtools(),
		!isVitest && nitro({ rollupConfig: { external: [/^@sentry\//] } }),
		tailwindcss(),
		!isVitest && tanstackStart(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
	resolve: { tsconfigPaths: true },
})

export default config

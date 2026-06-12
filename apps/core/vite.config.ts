import { cloudflare } from "@cloudflare/vite-plugin"
import { sharedBuildConfig } from "@repo/oxc-config"
import { defineConfig } from "vite-plus"

export default defineConfig({
	...sharedBuildConfig,
	plugins: [cloudflare()],
	resolve: { tsconfigPaths: true },
})

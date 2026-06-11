import { config } from "dotenv"

import { ensureEnvFile, fail, loadInfraEnv, log, ok, root, run } from "./utils.ts"

const localDatabaseHosts = new Set(["127.0.0.1", "::1", "db.localtest.me", "localhost", "postgres"])
const localComposeProjectNames = new Set(["onboarder"])

function assertLocalDatabaseUrl(databaseUrl: string) {
	const url = new URL(databaseUrl)

	if (!localDatabaseHosts.has(url.hostname)) {
		fail(`refusing to scrap local infra for non-local DATABASE_URL host: ${url.hostname}`)
	}
}

function assertLocalComposeProjectName(composeProjectName: string) {
	if (!localComposeProjectNames.has(composeProjectName)) {
		fail(`refusing to scrap infra for non-local COMPOSE_PROJECT_NAME: ${composeProjectName}`)
	}
}

async function main() {
	log("scrapping local infrastructure")
	ensureEnvFile()
	config({ path: `${root}/.env`, quiet: true })
	const env = loadInfraEnv()
	const composeProjectName = process.env["COMPOSE_PROJECT_NAME"] ?? "onboarder"

	assertLocalDatabaseUrl(env.DATABASE_URL)
	assertLocalComposeProjectName(composeProjectName)

	await run("docker", [
		"compose",
		"--env-file",
		".env",
		"-f",
		"compose.yaml",
		"down",
		"-v",
		"--remove-orphans",
	])

	ok("local infrastructure containers, network, and volumes scrapped")
}

main().catch((error: unknown) => {
	fail(error instanceof Error ? error.message : String(error))
})

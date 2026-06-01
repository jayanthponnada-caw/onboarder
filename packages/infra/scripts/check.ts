import { fail, loadInfraEnv, log, ok, run } from "./utils.ts"

async function checkHttpEndpoint(name: string, url: string) {
	const response = await fetch(url)

	if (response.status >= 500) {
		fail(`${name} returned HTTP ${response.status}`)
	}

	ok(`${name} responded at ${url} with HTTP ${response.status}`)
}

async function main() {
	log("checking local infrastructure")
	const env = loadInfraEnv()

	await run("docker", ["compose", "--env-file", ".env", "-f", "compose.yaml", "ps"])
	await run("docker", [
		"compose",
		"--env-file",
		".env",
		"-f",
		"compose.yaml",
		"exec",
		"-T",
		"postgres",
		"pg_isready",
		"-U",
		env.POSTGRES_USER,
		"-d",
		env.POSTGRES_DB,
	])
	await checkHttpEndpoint("Inngest UI", `http://localhost:${env.INNGEST_PORT}`)

	ok("infrastructure check complete")
}

main().catch((error: unknown) => {
	fail(error instanceof Error ? error.message : String(error))
})

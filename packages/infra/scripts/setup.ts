import { fail, loadInfraEnv, log, ok, run } from "./utils.ts"

const upOnly = process.argv.includes("--up-only")

async function main() {
	log("starting local infrastructure setup")
	const env = loadInfraEnv()

	await run("docker", ["compose", "--env-file", ".env", "-f", "compose.yaml", "pull"])
	await run("docker", [
		"compose",
		"--env-file",
		".env",
		"-f",
		"compose.yaml",
		"up",
		"-d",
		"--remove-orphans",
	])
	await run("docker", ["compose", "--env-file", ".env", "-f", "compose.yaml", "ps"])

	if (!upOnly) {
		log("validating postgres readiness")
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
	}

	ok(`Postgres is available on localhost:${env.POSTGRES_PORT}`)
	ok(`Neon local proxy is available on localhost:${env.NEON_PROXY_PORT}`)
	ok(`Inngest UI is available on http://localhost:${env.INNGEST_PORT}`)
	ok(`use DATABASE_URL=${env.DATABASE_URL}`)
}

main().catch((error: unknown) => {
	fail(error instanceof Error ? error.message : String(error))
})

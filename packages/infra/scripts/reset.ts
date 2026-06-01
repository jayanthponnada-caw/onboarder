import { ensureEnvFile, fail, log, ok, run } from "./utils.ts"

async function main() {
	log("resetting local infrastructure and deleting volumes")
	ensureEnvFile()

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

	ok("local infrastructure reset complete")
}

main().catch((error: unknown) => {
	fail(error instanceof Error ? error.message : String(error))
})

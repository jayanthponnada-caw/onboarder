import { spawn } from "node:child_process"
import { copyFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { config } from "dotenv"

export const root = resolve(import.meta.dirname, "..")

export type InfraEnv = {
	DATABASE_URL: string
	INNGEST_PORT: string
	NEON_PROXY_PORT: string
	POSTGRES_DB: string
	POSTGRES_PASSWORD: string
	POSTGRES_PORT: string
	POSTGRES_USER: string
}

export function log(message: string) {
	process.stdout.write(`[infra] ${message}\n`)
}

export function ok(message: string) {
	process.stdout.write(`[infra] ok: ${message}\n`)
}

export function warn(message: string) {
	process.stderr.write(`[infra] warn: ${message}\n`)
}

export function fail(message: string): never {
	process.stderr.write(`[infra] error: ${message}\n`)
	process.exit(1)
}

export function ensureEnvFile() {
	const env = resolve(root, ".env")
	const example = resolve(root, ".env.example")

	if (existsSync(env)) {
		ok("packages/infra/.env exists")
		return
	}

	if (!existsSync(example)) {
		fail("missing packages/infra/.env.example")
	}

	copyFileSync(example, env)
	ok("created packages/infra/.env from .env.example")
}

export function loadInfraEnv(): InfraEnv {
	ensureEnvFile()
	config({ path: resolve(root, ".env"), quiet: true })
	const postgresDb = process.env["POSTGRES_DB"] ?? "main"
	const postgresPassword = process.env["POSTGRES_PASSWORD"] ?? "postgres"
	const postgresPort = process.env["POSTGRES_PORT"] ?? "5432"
	const postgresUser = process.env["POSTGRES_USER"] ?? "postgres"

	return {
		DATABASE_URL:
			process.env["DATABASE_URL"] ??
			`postgres://${postgresUser}:${postgresPassword}@db.localtest.me:${postgresPort}/${postgresDb}`,
		INNGEST_PORT: process.env["INNGEST_PORT"] ?? "8288",
		NEON_PROXY_PORT: process.env["NEON_PROXY_PORT"] ?? "4444",
		POSTGRES_DB: postgresDb,
		POSTGRES_PASSWORD: postgresPassword,
		POSTGRES_PORT: postgresPort,
		POSTGRES_USER: postgresUser,
	}
}

export function run(command: string, args: string[], options: { cwd?: string } = {}) {
	log(`running: ${command} ${args.join(" ")}`)

	return new Promise<void>((resolvePromise, reject) => {
		const child = spawn(command, args, {
			cwd: options.cwd ?? root,
			shell: false,
			stdio: "inherit",
		})

		child.on("exit", (code) => {
			if (code === 0) {
				resolvePromise()
				return
			}

			reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`))
		})
	})
}

import { spawn } from "node:child_process"
import { copyFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { config } from "dotenv"

export const root = resolve(import.meta.dirname, "..")
export const repoRoot = resolve(root, "../..")

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

export type EnvFileSpec = {
	envPath: string
	examplePath: string
	label: string
}

const infraEnvFile: EnvFileSpec = {
	envPath: resolve(root, ".env"),
	examplePath: resolve(root, ".env.example"),
	label: "packages/infra/.env",
}

const localEnvFiles: EnvFileSpec[] = [
	{
		envPath: resolve(repoRoot, ".env"),
		examplePath: resolve(repoRoot, ".env.example"),
		label: "root .env",
	},
	infraEnvFile,
	{
		envPath: resolve(repoRoot, "apps/core/.dev.vars"),
		examplePath: resolve(repoRoot, "apps/core/.dev.vars.example"),
		label: "apps/core/.dev.vars",
	},
	{
		envPath: resolve(repoRoot, "apps/web/.env"),
		examplePath: resolve(repoRoot, "apps/web/.env.example"),
		label: "apps/web/.env",
	},
	{
		envPath: resolve(repoRoot, "packages/db/.env"),
		examplePath: resolve(repoRoot, "packages/db/.env.example"),
		label: "packages/db/.env",
	},
]

export function ensureEnvFile(spec: EnvFileSpec = infraEnvFile) {
	const env = spec.envPath
	const example = spec.examplePath

	if (existsSync(env)) {
		ok(`${spec.label} exists`)
		return
	}

	if (!existsSync(example)) {
		fail(`missing ${spec.label} example at ${example}`)
	}

	copyFileSync(example, env)
	ok(`created ${spec.label} from ${example}`)
}

export function ensureLocalEnvFiles() {
	for (const spec of localEnvFiles) {
		ensureEnvFile(spec)
	}
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

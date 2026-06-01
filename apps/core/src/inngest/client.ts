import { Inngest } from "inngest"

export const inngest = new Inngest({
	id: "onboarder-core",
})

export type InngestRuntimeEnv = {
	INNGEST_BASE_URL?: string | undefined
	INNGEST_DEV?: string | undefined
	INNGEST_EVENT_KEY?: string | undefined
	INNGEST_SERVE_ORIGIN?: string | undefined
	INNGEST_SERVE_PATH?: string | undefined
	INNGEST_SIGNING_KEY?: string | undefined
}

export function configureInngestEnv(runtimeEnv: InngestRuntimeEnv) {
	return inngest.setEnvVars({
		INNGEST_BASE_URL: runtimeEnv.INNGEST_BASE_URL,
		INNGEST_DEV: runtimeEnv.INNGEST_DEV,
		INNGEST_EVENT_KEY: runtimeEnv.INNGEST_EVENT_KEY,
		INNGEST_SERVE_ORIGIN: runtimeEnv.INNGEST_SERVE_ORIGIN,
		INNGEST_SERVE_PATH: runtimeEnv.INNGEST_SERVE_PATH,
		INNGEST_SIGNING_KEY: runtimeEnv.INNGEST_SIGNING_KEY,
	})
}

export type OnboarderInngest = typeof inngest

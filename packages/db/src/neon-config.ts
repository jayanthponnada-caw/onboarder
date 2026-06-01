import { neonConfig } from "@neondatabase/serverless"

const localNeonHostname = "db.localtest.me"
const defaultLocalNeonProxyPort = 4444

export type NeonConfigOptions = {
	localNeonProxyPort?: number | string | undefined
}

export function configureNeon(connectionString: string, options: NeonConfigOptions = {}) {
	const url = new URL(connectionString)

	if (url.hostname !== localNeonHostname) {
		return
	}

	const localNeonProxyPort = Number(options.localNeonProxyPort ?? defaultLocalNeonProxyPort)

	neonConfig.fetchEndpoint = (host) => {
		const protocol = host === localNeonHostname ? "http" : "https"
		const port = host === localNeonHostname ? localNeonProxyPort : 443

		return `${protocol}://${host}:${port}/sql`
	}

	neonConfig.useSecureWebSocket = false
	neonConfig.poolQueryViaFetch = true
	neonConfig.wsProxy = (host) => {
		if (host === localNeonHostname) {
			return `${host}:${localNeonProxyPort}/v2`
		}

		return `${host}/v2`
	}
}

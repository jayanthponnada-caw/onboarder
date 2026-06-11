import * as Sentry from "@sentry/tanstackstart-react"

const sentryEnabled =
	(import.meta.env?.VITE_SENTRY_ENABLED ?? process.env.VITE_SENTRY_ENABLED) === "true"
const sentryDsn = import.meta.env?.VITE_SENTRY_DSN ?? process.env.VITE_SENTRY_DSN

if (sentryEnabled && !sentryDsn) {
	console.warn(
		"VITE_SENTRY_ENABLED=true but VITE_SENTRY_DSN is not defined. Sentry is not running.",
	)
} else if (sentryEnabled) {
	Sentry.init({
		dsn: sentryDsn,
		replaysOnErrorSampleRate: 1.0,
		replaysSessionSampleRate: 1.0,
		// Adds request headers and IP for users, for more info visit:
		// https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
		sendDefaultPii: true,
		tracesSampleRate: 1.0,
	})
}

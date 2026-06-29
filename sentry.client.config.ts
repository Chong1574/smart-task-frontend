import * as Sentry from '@sentry/nuxt'

const dsn = import.meta.env.VITE_SENTRY_DSN

if (dsn) {
    Sentry.init({
        dsn,
        environment: import.meta.env.MODE || 'production',
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
    })
}

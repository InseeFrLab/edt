/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_STROMAE_BACK_OFFICE_API_BASE_URL: string
    readonly VITE_EDT_ORGANISATION_API_BASE_URL: string
    readonly VITE_KEYCLOAK_AUTHORITY: string
    readonly VITE_KEYCLOAK_CLIENT_ID: string
    readonly VITE_KEYCLOAK_REDIRECT_URI: string
    readonly VITE_HOUSE_REFERENCE_REGULAR_EXPRESSION: string
    readonly VITE_SEPARATOR_SUGGESTER: string
    readonly VITE_NODE_ENV: string
    readonly VITE_CHROMIUM_PATH: string
    readonly VITE_NUM_ACTIVITY_SURVEYS: string
    readonly VITE_NUM_WORKTIME_SURVEYS: string
    readonly VITE_REVIEWER_ROLE: string
    readonly VITE_SURVEYED_ROLE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

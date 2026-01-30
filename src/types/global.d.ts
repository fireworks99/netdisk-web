interface AppConfig {
  BASE_API: string,
  USE_MOCK: boolean,
  BUCKET: string
}

interface Window {
  APP_CONFIG: AppConfig
}
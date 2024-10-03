export function getSecret(key: string): string | undefined {
  return import.meta.env[key] as string | undefined;
}

export function setSecret(key: string, value: string): void {
  if (import.meta.env.DEV) {
    console.warn('Setting environment variables at runtime is not supported in Vite. Use .env files instead.');
  }
}
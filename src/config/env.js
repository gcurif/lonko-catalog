const env = {
  apiUrl: (import.meta.env.VITE_API_URL || "").trim(),
  mode: import.meta.env.MODE,
};

export function validateEnv() {
  if (!env.apiUrl) {
    console.warn("VITE_API_URL no esta configurado. Configuralo en un archivo .env");
  }
}

export default env;

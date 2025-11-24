# Tauri + React

This template should help get you started developing with Tauri and React in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Frontend envs

- Duplicate `.env.example` as `.env` and set `VITE_API_URL` to your backend base URL.
- Only variables prefixed with `VITE_` are exposed to the React app; `validateEnv` will warn if the API URL is missing.

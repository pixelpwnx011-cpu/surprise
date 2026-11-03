import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Actions sets GITHUB_REPOSITORY to "owner/repository".
// For a project site, Vite needs "/repository/" as its base path.
// For a custom domain or username.github.io repository, set VITE_BASE_PATH="/".
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.VITE_BASE_PATH || (repository ? `/${repository}/` : '/');

export default defineConfig({
  plugins: [react()],
  base,
});
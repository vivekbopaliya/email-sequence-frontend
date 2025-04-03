import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: './src/tests', 
  testMatch: ['**/*.ts'],
  timeout: 30000, 
  retries: 2, 
  use: {
    baseURL: 'http://localhost:5173',
    headless: true, 
    screenshot: 'only-on-failure',
    video: 'retain-on-failure', 
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    
  ],
});
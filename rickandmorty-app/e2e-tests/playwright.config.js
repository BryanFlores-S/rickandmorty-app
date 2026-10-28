// e2e-tests/playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Directorio donde residen los scripts de prueba (.spec.js)
  testDir: './tests',

  // Tiempo máximo de ejecución por cada test (30 segundos)
  timeout: 30000,

  // Tiempo límite para cada afirmación (expect) (5 segundos)
  expect: {
    timeout: 5000
  },

  // Las pruebas se ejecutan de forma secuencial para evaluar correctamente estados de tiempo
  fullyParallel: false,

  // Configuración de reportes: consola + reporte visual HTML
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  use: {
    // URL base de tu aplicación Spring Boot en desarrollo
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',

    // Captura trazas e imágenes en caso de fallos
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },


webServer: {
    command: './mvnw spring-boot:run',
    port: 8080,
    reuseExistingServer: true, // Reuses the server if it's already running, avoiding port conflicts
    timeout: 120000, // Giving enough time for Spring Boot to boot up
  },

  // Definición del navegador objetivo para las pruebas E2E
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
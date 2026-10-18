# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: search-delay.spec.js >> Rick & Morty SPA - Pruebas E2E de Búsqueda y Retardo Simulado >> Debe mostrar de inmediato el título de búsqueda, limpiar la grilla y activar el banner de 4s y GIF
- Location: tests\search-delay.spec.js:9:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.character-card').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.character-card').first() with timeout 15000ms
  - waiting for locator('.character-card').first()

```

```yaml
- banner:
  - text: R&M Rick & Morty 
  - textbox "Buscar personaje (ej. Rick, Morty)...": Rick
  - button ""
- main:
  - 'heading "Resultados para: \"Rick\"" [level=1]'
  - text: 
  - heading "Ocurrió un error" [level=3]
  - paragraph: No pudimos conectar con el servidor. Intenta de nuevo más tarde.
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Rick & Morty SPA - Pruebas E2E de Búsqueda y Retardo Simulado', () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/', { waitUntil: 'networkidle' });
  7  |   });
  8  | 
  9  |   test('Debe mostrar de inmediato el título de búsqueda, limpiar la grilla y activar el banner de 4s y GIF', async ({ page }) => {
  10 |     const searchInput = page.locator('#search-input');
  11 |     const countdownBanner = page.locator('#countdown-banner');
  12 |     const loadingState = page.locator('#loading-state');
  13 |     const sectionTitle = page.locator('#section-title');
  14 |     const cards = page.locator('.character-card');
  15 | 
  16 |     // 1. Escribir "Rick" en el buscador
  17 |     await searchInput.fill('Rick');
  18 | 
  19 |     // 2. Comprobar que el título cambie instantáneamente
  20 |     await expect(sectionTitle).toHaveText('Resultados para: "Rick"');
  21 | 
  22 |     // 3. Confirmar la visibilidad inmediata del banner de cuenta regresiva
  23 |     await expect(countdownBanner).toBeVisible();
  24 | 
  25 |     // 4. Confirmar que el estado de carga (GIF) esté visible
  26 |     await expect(loadingState).toBeVisible();
  27 | 
  28 |     // 5. La grilla debe haberse vaciado de inmediato
  29 |     await expect(cards).toHaveCount(0);
  30 | 
  31 |     // 6. Esperar a que finalicen los 4 segundos del temporizador + respuesta de la API (hasta 15s de margen)
  32 |     await expect(countdownBanner).toBeHidden({ timeout: 15000 });
  33 |     await expect(loadingState).toBeHidden({ timeout: 15000 });
  34 | 
  35 |     // 8. Se deben desplegar los resultados filtrados
> 36 |     await expect(cards.first()).toBeVisible({ timeout: 15000 });
     |                                 ^ Error: expect(locator).toBeVisible() failed
  37 |   });
  38 | 
  39 |   test('Debe limpiar la búsqueda y regresar al catálogo de inicio al hacer clic en el Logo', async ({ page }) => {
  40 |     const searchInput = page.locator('#search-input');
  41 |     const brandLogo = page.locator('#logo-button');
  42 |     const sectionTitle = page.locator('#section-title');
  43 | 
  44 |     await searchInput.fill('Morty');
  45 |     
  46 |     // Esperar a que concluya la búsqueda
  47 |     const countdownBanner = page.locator('#countdown-banner');
  48 |     await expect(countdownBanner).toBeHidden({ timeout: 15000 });
  49 | 
  50 |     await brandLogo.click();
  51 | 
  52 |     await expect(searchInput).toHaveValue('');
  53 |     await expect(sectionTitle).toHaveText('Personajes Populares');
  54 |   });
  55 | 
  56 | });
```
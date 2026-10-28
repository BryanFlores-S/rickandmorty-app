# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: initial-catalog.spec.js >> Rick & Morty SPA - Catálogo Inicial >> Debe verificar que las imágenes de los personajes hayan cargado correctamente
- Location: tests\initial-catalog.spec.js:25:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.character-card') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4] [cursor=pointer]:
        - generic [ref=e5]: R&M
        - generic [ref=e6]: Rick & Morty
      - generic [ref=e8]:
        - generic [ref=e9]: 
        - textbox "Buscar personaje (ej. Rick, Morty)..." [ref=e10]
        - text: 
  - main [ref=e11]:
    - heading "Personajes Populares" [level=1] [ref=e13]
    - generic [ref=e15]:
      - generic [ref=e16]: 
      - heading "Ocurrió un error" [level=3] [ref=e17]
      - paragraph [ref=e18]: No pudimos conectar con el servidor. Intenta de nuevo más tarde.
  - text: 
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Rick & Morty SPA - Catálogo Inicial', () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // Esperar a que la red esté inactiva o la página cargue por completo
  7  |     await page.goto('/', { waitUntil: 'networkidle' });
> 8  |     await page.waitForSelector('.character-card', { timeout: 15000 });
     |                ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
  9  |   });
  10 | 
  11 |   test('Debe cargar el catálogo principal con el título correcto y 20 personajes iniciales', async ({ page }) => {
  12 |     const sectionTitle = page.locator('#section-title');
  13 |     await expect(sectionTitle).toHaveText('Personajes Populares');
  14 | 
  15 |     const resultsCount = page.locator('#results-count');
  16 |     await expect(resultsCount).toContainText('personajes encontrados');
  17 | 
  18 |     const firstCard = page.locator('.character-card').first();
  19 |     await expect(firstCard).toBeVisible({ timeout: 15000 });
  20 | 
  21 |     const characterCards = page.locator('.character-card');
  22 |     await expect(characterCards).toHaveCount(20);
  23 |   });
  24 | 
  25 |   test('Debe verificar que las imágenes de los personajes hayan cargado correctamente', async ({ page }) => {
  26 |     const firstCard = page.locator('.character-card').first();
  27 |     await expect(firstCard).toBeVisible({ timeout: 15000 });
  28 | 
  29 |     const firstImage = page.locator('.character-card img').first();
  30 |     await expect(firstImage).toBeVisible({ timeout: 15000 });
  31 |     
  32 |     const srcValue = await firstImage.getAttribute('src');
  33 |     expect(srcValue).toBeTruthy();
  34 |   });
  35 | 
  36 | });
```
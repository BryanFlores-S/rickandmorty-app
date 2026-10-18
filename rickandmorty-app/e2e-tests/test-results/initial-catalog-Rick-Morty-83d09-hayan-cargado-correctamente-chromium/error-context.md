# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: initial-catalog.spec.js >> Rick & Morty SPA - Catálogo Inicial >> Debe verificar que las imágenes de los personajes hayan cargado correctamente
- Location: tests\initial-catalog.spec.js:24:3

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
  - textbox "Buscar personaje (ej. Rick, Morty)..."
- main:
  - heading "Personajes Populares" [level=1]
  - text: 
  - heading "Ocurrió un error" [level=3]
  - paragraph: No pudimos conectar con el servidor. Intenta de nuevo más tarde.
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
  8  |   });
  9  | 
  10 |   test('Debe cargar el catálogo principal con el título correcto y 20 personajes iniciales', async ({ page }) => {
  11 |     const sectionTitle = page.locator('#section-title');
  12 |     await expect(sectionTitle).toHaveText('Personajes Populares');
  13 | 
  14 |     const resultsCount = page.locator('#results-count');
  15 |     await expect(resultsCount).toContainText('personajes encontrados');
  16 | 
  17 |     const firstCard = page.locator('.character-card').first();
  18 |     await expect(firstCard).toBeVisible({ timeout: 15000 });
  19 | 
  20 |     const characterCards = page.locator('.character-card');
  21 |     await expect(characterCards).toHaveCount(20);
  22 |   });
  23 | 
  24 |   test('Debe verificar que las imágenes de los personajes hayan cargado correctamente', async ({ page }) => {
  25 |     const firstCard = page.locator('.character-card').first();
> 26 |     await expect(firstCard).toBeVisible({ timeout: 15000 });
     |                             ^ Error: expect(locator).toBeVisible() failed
  27 | 
  28 |     const firstImage = page.locator('.character-card img').first();
  29 |     await expect(firstImage).toBeVisible({ timeout: 15000 });
  30 |     
  31 |     const srcValue = await firstImage.getAttribute('src');
  32 |     expect(srcValue).toBeTruthy();
  33 |   });
  34 | 
  35 | });
```
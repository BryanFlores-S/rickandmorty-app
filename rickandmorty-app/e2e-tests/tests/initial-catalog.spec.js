const { test, expect } = require('@playwright/test');

test.describe('Rick & Morty SPA - Catálogo Inicial', () => {

  test.beforeEach(async ({ page }) => {
    // Esperar a que la red esté inactiva o la página cargue por completo
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Debe cargar el catálogo principal con el título correcto y 20 personajes iniciales', async ({ page }) => {
    const sectionTitle = page.locator('#section-title');
    await expect(sectionTitle).toHaveText('Personajes Populares');

    const resultsCount = page.locator('#results-count');
    await expect(resultsCount).toContainText('personajes encontrados');

    const firstCard = page.locator('.character-card').first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    const characterCards = page.locator('.character-card');
    await expect(characterCards).toHaveCount(20);
  });

  test('Debe verificar que las imágenes de los personajes hayan cargado correctamente', async ({ page }) => {
    const firstCard = page.locator('.character-card').first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    const firstImage = page.locator('.character-card img').first();
    await expect(firstImage).toBeVisible({ timeout: 15000 });
    
    const srcValue = await firstImage.getAttribute('src');
    expect(srcValue).toBeTruthy();
  });

});
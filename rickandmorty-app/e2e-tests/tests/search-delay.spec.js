const { test, expect } = require('@playwright/test');

test.describe('Rick & Morty SPA - Pruebas E2E de Búsqueda y Retardo Simulado', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Debe mostrar de inmediato el título de búsqueda, limpiar la grilla y activar el banner de 4s y GIF', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    const countdownBanner = page.locator('#countdown-banner');
    const loadingState = page.locator('#loading-state');
    const sectionTitle = page.locator('#section-title');
    const cards = page.locator('.character-card');

    // 1. Escribir "Rick" en el buscador
    await searchInput.fill('Rick');

    // 2. Comprobar que el título cambie instantáneamente
    await expect(sectionTitle).toHaveText('Resultados para: "Rick"');

    // 3. Confirmar la visibilidad inmediata del banner de cuenta regresiva
    await expect(countdownBanner).toBeVisible();

    // 4. Confirmar que el estado de carga (GIF) esté visible
    await expect(loadingState).toBeVisible();

    // 5. La grilla debe haberse vaciado de inmediato
    await expect(cards).toHaveCount(0);

    // 6. Esperar a que finalicen los 4 segundos del temporizador + respuesta de la API (hasta 15s de margen)
    await expect(countdownBanner).toBeHidden({ timeout: 15000 });
    await expect(loadingState).toBeHidden({ timeout: 15000 });

    // 8. Se deben desplegar los resultados filtrados
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });

  test('Debe limpiar la búsqueda y regresar al catálogo de inicio al hacer clic en el Logo', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    const brandLogo = page.locator('#logo-button');
    const sectionTitle = page.locator('#section-title');

    await searchInput.fill('Morty');
    
    // Esperar a que concluya la búsqueda
    const countdownBanner = page.locator('#countdown-banner');
    await expect(countdownBanner).toBeHidden({ timeout: 15000 });

    await brandLogo.click();

    await expect(searchInput).toHaveValue('');
    await expect(sectionTitle).toHaveText('Personajes Populares');
  });

});
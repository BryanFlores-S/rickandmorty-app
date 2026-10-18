const { test, expect } = require('@playwright/test');

test.describe('Rick & Morty SPA - Modal de Detalle', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Debe abrir el modal con la información del personaje y cerrarlo correctamente', async ({ page }) => {
    const firstCard = page.locator('.character-card').first();
    const detailModal = page.locator('#detail-modal');
    const modalBackBtn = page.locator('#modal-back-btn');

    // 1. Abrir la ventana modal haciendo clic en la primera tarjeta
    await firstCard.click();
    await expect(detailModal).toBeVisible();

    // 2. Verificar que el modal contiene la sección de episodios
    const episodesList = page.locator('#modal-episodes-list');
    await expect(episodesList).toBeVisible();

    // 3. Cerrar el modal mediante el botón de retroceso
    await modalBackBtn.click();
    await expect(detailModal).toBeHidden();
  });

});
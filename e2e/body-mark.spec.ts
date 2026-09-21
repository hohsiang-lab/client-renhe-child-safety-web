import { test, expect } from "@playwright/test";
import { bodyPartsV2 } from "../src/data/bodyPartsV2";

test.describe("身體標記頁 (HO-775)", () => {
  test("loads the customer female PNG and exposes ten logical body parts", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/body-traffic-light/mark?doll=female");

    const image = page.getByTestId("doll-image");
    await expect(image).toHaveAttribute("src", "/images/紅綠燈女.png");
    await expect.poll(() =>
      image.evaluate((element) => {
        const img = element as HTMLImageElement;
        return [img.naturalWidth, img.naturalHeight];
      }),
    ).toEqual([1024, 1705]);

    const logicalPartIds = await page.locator("[data-part-id]").evaluateAll((elements) => [
      ...new Set(elements.map((element) => element.getAttribute("data-part-id"))),
    ]);
    expect(logicalPartIds).toHaveLength(bodyPartsV2.length);

    for (const part of bodyPartsV2) {
      const zones = page.locator(`[data-part-id="${part.id}"]`);
      for (let index = 0; index < await zones.count(); index += 1) {
        const box = await zones.nth(index).boundingBox();
        expect(box?.width, `${part.id}[${index}] width`).toBeGreaterThanOrEqual(48);
        expect(box?.height, `${part.id}[${index}] height`).toBeGreaterThanOrEqual(48);
      }
    }
  });

  test("loads the customer male PNG for the male selection", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=male");
    const image = page.getByTestId("doll-image");
    await expect(image).toHaveAttribute(
      "src",
      "/images/紅綠燈難.png",
    );
    await expect.poll(() =>
      image.evaluate((element) => {
        const img = element as HTMLImageElement;
        return [img.naturalWidth, img.naturalHeight];
      }),
    ).toEqual([1024, 1705]);
  });

  test("all ten logical parts can be marked before continuing", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=female");

    for (const part of bodyPartsV2) {
      await page.locator(`[data-part-id="${part.id}"]`).first().dispatchEvent("click");
      await page.getByRole("button", { name: /綠燈/ }).click();
    }

    await expect(page.getByTestId("complete-btn")).toBeVisible();
    await page.getByTestId("complete-btn").click();
    await expect(page).toHaveURL("/body-traffic-light/touch-test");
  });
});

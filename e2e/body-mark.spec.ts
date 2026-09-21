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

  test("shows outlined callout arrows with an explicit two-step instruction", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=male");

    await expect(page.getByTestId("body-mark-instruction")).toHaveText(
      "先點箭頭，再選燈色",
    );
    const arrows = page.getByTestId("body-part-arrow");
    await expect(arrows).toHaveCount(
      bodyPartsV2.reduce((count, part) => count + part.zones.length, 0),
    );
    await expect(arrows.first()).toHaveAttribute("data-arrow-style", "outlined-callout");
    await expect(arrows.first().locator("svg")).toBeVisible();
  });

  test("uses transparent arrows with varied angles and sizes", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=male");

    const arrows = page.getByTestId("body-part-arrow");
    const specs = await arrows.evaluateAll((elements) =>
      elements.map((element) => ({
        angle: Number(element.getAttribute("data-arrow-angle")),
        fill: element.getAttribute("data-arrow-fill"),
        size: element.getAttribute("data-arrow-size"),
      })),
    );

    expect(specs.every((spec) => spec.fill === "transparent")).toBe(true);
    expect(new Set(specs.map((spec) => spec.size)).size).toBeGreaterThan(1);
    expect(new Set(specs.map((spec) => spec.angle)).size).toBeGreaterThan(3);
    expect(specs.some((spec) => Math.abs(spec.angle) % 90 > 1)).toBe(true);
    await expect(arrows.first().locator("path")).toHaveAttribute("fill", "none");
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

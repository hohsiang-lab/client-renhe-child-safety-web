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
      "先點箭頭指向的部位，再選燈色",
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

  test("keeps visual arrows separate from body hit zones", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=male");

    const arrowLayer = page.getByTestId("body-part-arrow-layer");
    await expect(arrowLayer).toHaveAttribute("aria-hidden", "true");
    await expect(arrowLayer).toHaveCSS("pointer-events", "none");

    const arrowPlacement = await page.getByTestId("body-part-arrow").evaluateAll((elements) => ({
      count: elements.length,
      insideHitButtons: elements.some((element) => element.closest("button") !== null),
      anchored: elements.every(
        (element) =>
          element.getAttribute("data-arrow-anchor-x") !== null &&
          element.getAttribute("data-arrow-anchor-y") !== null,
      ),
    }));
    expect(arrowPlacement.count).toBeGreaterThan(0);
    expect(arrowPlacement.insideHitButtons).toBe(false);
    expect(arrowPlacement.anchored).toBe(true);

    const hitZone = page.locator('[data-part-id="chest"]').first();
    await expect(hitZone).toHaveAttribute("data-hit-zone", "true");
    await expect(hitZone).toHaveCSS("min-width", "48px");
    await expect(hitZone).toHaveCSS("min-height", "48px");
  });

  test("matches the male and female Drive reference arrow placement contract", async ({ page }) => {
    const expected = new Map([
      ["head:0", { x: 34, y: 7, angle: 55, size: "large" }],
      ["face:0", { x: 55, y: 29, angle: 205, size: "small" }],
      ["mouth:0", { x: 63, y: 34, angle: 205, size: "small" }],
      ["ear:0", { x: 16, y: 25, angle: 0, size: "small" }],
      ["ear:1", { x: 84, y: 25, angle: 180, size: "small" }],
      ["shoulder:0", { x: 30, y: 39, angle: -15, size: "small" }],
      ["shoulder:1", { x: 70, y: 39, angle: 135, size: "small" }],
      ["chest:0", { x: 39, y: 47, angle: 0, size: "medium" }],
      ["hand:0", { x: 7, y: 52, angle: 0, size: "medium" }],
      ["hand:1", { x: 93, y: 52, angle: 180, size: "medium" }],
      ["belly:0", { x: 45, y: 54, angle: -20, size: "medium" }],
      ["private:0", { x: 55, y: 60, angle: 110, size: "small" }],
      ["thigh:0", { x: 35, y: 71, angle: 0, size: "medium" }],
      ["thigh:1", { x: 67, y: 71, angle: 180, size: "medium" }],
    ]);

    for (const [doll, asset] of [
      ["male", "紅綠燈難.png"],
      ["female", "紅綠燈女.png"],
    ] as const) {
      const expectedHeadY = doll === "female" ? 4 : 7;
      await page.goto(`/body-traffic-light/mark?doll=${doll}`);
      await expect(page.getByTestId("doll-image")).toHaveAttribute("src", `/images/${asset}`);

      const actual = await page.getByTestId("body-part-arrow").evaluateAll((elements) =>
        elements.map((element) => ({
          key: `${element.getAttribute("data-arrow-part-id")}:${element.getAttribute("data-arrow-zone-index")}`,
          x: Number(element.getAttribute("data-arrow-anchor-x")),
          y: Number(element.getAttribute("data-arrow-anchor-y")),
          angle: Number(element.getAttribute("data-arrow-angle")),
          size: element.getAttribute("data-arrow-size"),
        })),
      );

      expect(actual).toHaveLength(expected.size);
      for (const spec of actual) {
        const target = expected.get(spec.key);
        expect(target, `missing Drive reference spec for ${doll} ${spec.key}`).toBeDefined();
        expect(Math.abs(spec.x - target!.x), `${doll} ${spec.key} x`).toBeLessThanOrEqual(1);
        const expectedY = spec.key === "head:0" ? expectedHeadY : target!.y;
        expect(Math.abs(spec.y - expectedY), `${doll} ${spec.key} y`).toBeLessThanOrEqual(1);
        expect(Math.abs(spec.angle - target!.angle), `${doll} ${spec.key} angle`).toBeLessThanOrEqual(1);
        expect(spec.size, `${doll} ${spec.key} size`).toBe(target!.size);
      }
    }
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

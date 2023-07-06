import { assertEquals } from "https://deno.land/std@0.188.0/testing/asserts.ts";

Deno.test("my test", async (t) => {
  await t.step("step_1", () => {
    assertEquals(1, 1);
  });
});

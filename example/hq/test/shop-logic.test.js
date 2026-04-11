import { afterEach, describe, expect, it, vi } from "vitest";
import {
  executePurchase,
  loadShopData,
  validatePurchase,
} from "../bin/shop-logic";

describe("shop-logic", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads heroes and priced equipment from fetch", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        json: async () => [{ id: 1, classe: "Barbaro" }],
      })
      .mockResolvedValueOnce({
        json: async () => [
          { id: 9, nome: "Sword", prezzo: 100 },
          { id: 10, nome: "Free", prezzo: 0 },
        ],
      });

    const result = await loadShopData();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.heroes).toEqual([
      {
        id: 1,
        classe: "Barbaro",
        attacco: 0,
        difesa: 0,
        movimento: 0,
        mente: 0,
        corpo: 0,
        miniature: "",
        miniatureDeath: "",
        portrait: "",
      },
    ]);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      id: 9,
      nome: "Sword",
      prezzo: 100,
    });
  });

  it("returns empty shop data when fetch fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("boom"));
    const result = await loadShopData();
    expect(result).toEqual({ heroes: [], items: [] });
  });

  it("validates purchase rules concretely", () => {
    expect(validatePurchase(null, null)).toEqual({
      allowed: false,
      reason: "Invalid data",
    });
    expect(
      validatePurchase(
        { gold: 5, equipment: [], heroId: 1 },
        { id: 2, prezzo: 10 },
      ),
    ).toEqual({ allowed: false, reason: "Not enough gold" });
    expect(
      validatePurchase(
        { gold: 50, equipment: [2], heroId: 1 },
        { id: 2, prezzo: 10 },
      ),
    ).toEqual({ allowed: false, reason: "Already owned" });
    expect(
      validatePurchase(
        { gold: 50, equipment: [], heroId: 1 },
        { id: 2, prezzo: 10, nopsg: true, nopsgid: 1 },
      ),
    ).toEqual({ allowed: false, reason: "Forbidden for class" });
    expect(
      validatePurchase(
        { gold: 50, equipment: [], heroId: 1 },
        { id: 2, prezzo: 10, solopsg: true, solopsgid: 2 },
      ),
    ).toEqual({ allowed: false, reason: "Exclusive to other class" });
    expect(
      validatePurchase(
        { gold: 50, equipment: [], heroId: 1 },
        { id: 2, prezzo: 10 },
      ),
    ).toEqual({ allowed: true, reason: "" });
  });

  it("executes a purchase immutably and ignores invalid hero indexes", () => {
    const session = {
      heroes: [{ heroId: 1, gold: 150, equipment: [] }],
    };

    expect(executePurchase(session, -1, { id: 2, prezzo: 10 })).toBe(session);
    const updated = executePurchase(session, 0, { id: 2, prezzo: 10 });
    expect(updated).not.toBe(session);
    expect(updated.heroes[0]).toMatchObject({ gold: 140, equipment: [2] });
    expect(session.heroes[0]).toMatchObject({ gold: 150, equipment: [] });
  });
});

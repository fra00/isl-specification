import { renderHook } from "../bin/node_modules/@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCampaignManager } from "../bin/dungeon-use-campaign-manager";

describe("useCampaignManager", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("saves, loads, detects and resets campaign data", () => {
    const { result } = renderHook(() => useCampaignManager());
    result.current.saveCampaign([{ heroId: 1 }], 2);
    expect(result.current.hasSavedCampaign()).toBe(true);
    expect(result.current.loadCampaign()).toMatchObject({
      heroes: [{ heroId: 1 }],
      nextMissionIndex: 2,
    });
    result.current.resetCampaign();
    expect(result.current.hasSavedCampaign()).toBe(false);
    expect(result.current.loadCampaign()).toBeNull();
  });

  it("handles save and parse failures gracefully", () => {
    const alertSpy = vi.spyOn(globalThis, "alert").mockImplementation(() => {});
    const stringifySpy = vi.spyOn(JSON, "stringify").mockImplementation(() => {
      throw new Error("nope");
    });

    const { result } = renderHook(() => useCampaignManager());
    result.current.saveCampaign([], 0);
    expect(alertSpy).toHaveBeenCalledWith("Could not save progress");

    stringifySpy.mockRestore();
    localStorage.setItem("dg_campaign_data", "{bad json");
    const hook = renderHook(() => useCampaignManager());
    expect(hook.result.current.loadCampaign()).toBeNull();
  });
});

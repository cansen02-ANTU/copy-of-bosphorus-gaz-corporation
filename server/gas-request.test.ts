import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  createGasRequest: vi.fn().mockResolvedValue({ id: 42 }),
  // unused-but-imported helpers in routers.ts
  getNewsArticles: vi.fn().mockResolvedValue([]),
  getNewsArticleById: vi.fn().mockResolvedValue(undefined),
  createNewsArticle: vi.fn().mockResolvedValue({ id: 1 }),
  updateNewsArticle: vi.fn().mockResolvedValue(undefined),
  deleteNewsArticle: vi.fn().mockResolvedValue(undefined),
  getGalleryImages: vi.fn().mockResolvedValue([]),
  createGalleryImage: vi.fn().mockResolvedValue({ id: 1 }),
  updateGalleryImage: vi.fn().mockResolvedValue(undefined),
  deleteGalleryImage: vi.fn().mockResolvedValue(undefined),
  getGalleryAlbumsWithPhotos: vi.fn().mockResolvedValue([]),
  getUserByOpenId: vi.fn(),
  upsertUser: vi.fn(),
  getDb: vi.fn().mockResolvedValue(null),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "k", url: "/u" }),
}));

// Mock owner notification so tests don't hit the network
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import { appRouter } from "./routers";
import { createGasRequest } from "./db";
import { notifyOwner } from "./_core/notification";

// Minimal context for a public procedure (no auth needed)
function makeCaller() {
  const ctx: any = {
    user: null,
    req: { protocol: "https", headers: {} },
    res: { cookie: vi.fn(), clearCookie: vi.fn() },
  };
  return appRouter.createCaller(ctx);
}

const validInput = {
  companyName: "Acme A.Ş.",
  contactPerson: "Ada Lovelace",
  email: "ada@acme.com",
  phone: "+90 212 000 00 00",
  facilityAddress: "Sanayi Mah. No:1",
  facilityProvince: "İstanbul",
  annualConsumption: "1-10",
  usagePurpose: "uretim",
  monthlyUsage: "Ocak: 100, Şubat: 120",
  personnelName: "Grace Hopper",
  personnelPosition: "Müdür",
  notes: "Acil",
};

describe("gasRequest.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persists the request and returns success with id", async () => {
    const caller = makeCaller();
    const result = await caller.gasRequest.submit(validInput);

    expect(result).toEqual({ success: true, id: 42 });
    expect(createGasRequest).toHaveBeenCalledTimes(1);
    const arg = (createGasRequest as any).mock.calls[0][0];
    expect(arg.companyName).toBe("Acme A.Ş.");
    expect(arg.email).toBe("ada@acme.com");
    expect(arg.usagePurpose).toBe("uretim");
  });

  it("notifies the owner with the company name in the title", async () => {
    const caller = makeCaller();
    await caller.gasRequest.submit(validInput);

    expect(notifyOwner).toHaveBeenCalledTimes(1);
    const payload = (notifyOwner as any).mock.calls[0][0];
    expect(payload.title).toContain("Acme A.Ş.");
    expect(payload.content).toContain("information@bosphorusgaz.com");
    expect(payload.content).toContain("ada@acme.com");
  });

  it("maps omitted optional fields to null on persist", async () => {
    const caller = makeCaller();
    await caller.gasRequest.submit({
      companyName: "Beta Ltd",
      contactPerson: "John",
      email: "john@beta.com",
      phone: "123",
      facilityAddress: "Addr",
      facilityProvince: "Ankara",
      annualConsumption: "<1",
    });

    const arg = (createGasRequest as any).mock.calls[0][0];
    expect(arg.usagePurpose).toBeNull();
    expect(arg.monthlyUsage).toBeNull();
    expect(arg.personnelName).toBeNull();
    expect(arg.notes).toBeNull();
  });

  it("still succeeds if owner notification throws", async () => {
    (notifyOwner as any).mockRejectedValueOnce(new Error("upstream down"));
    const caller = makeCaller();
    const result = await caller.gasRequest.submit(validInput);
    expect(result.success).toBe(true);
    expect(createGasRequest).toHaveBeenCalledTimes(1);
  });

  it("rejects an invalid email", async () => {
    const caller = makeCaller();
    await expect(
      caller.gasRequest.submit({ ...validInput, email: "not-an-email" })
    ).rejects.toThrow();
    expect(createGasRequest).not.toHaveBeenCalled();
  });

  it("rejects a missing required field (companyName)", async () => {
    const caller = makeCaller();
    await expect(
      caller.gasRequest.submit({ ...validInput, companyName: "" })
    ).rejects.toThrow();
    expect(createGasRequest).not.toHaveBeenCalled();
  });
});

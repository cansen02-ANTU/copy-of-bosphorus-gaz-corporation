import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimit, type RateLimitConfig } from "./rateLimit";

const testConfig: RateLimitConfig = {
  name: "test-limiter",
  maxAttempts: 3,
  windowMs: 5000, // 5 seconds for fast tests
};

describe("Rate Limiter", () => {
  beforeEach(() => {
    // Reset the test limiter between tests
    resetRateLimit(testConfig.name, "test-ip");
    resetRateLimit(testConfig.name, "other-ip");
  });

  it("allows requests under the limit", () => {
    const r1 = checkRateLimit(testConfig, "test-ip");
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit(testConfig, "test-ip");
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit(testConfig, "test-ip");
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests over the limit", () => {
    checkRateLimit(testConfig, "test-ip");
    checkRateLimit(testConfig, "test-ip");
    checkRateLimit(testConfig, "test-ip");

    const r4 = checkRateLimit(testConfig, "test-ip");
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
    expect(r4.retryAfterMs).toBeGreaterThan(0);
    expect(r4.retryAfterMs).toBeLessThanOrEqual(5000);
  });

  it("tracks different IPs independently", () => {
    checkRateLimit(testConfig, "test-ip");
    checkRateLimit(testConfig, "test-ip");
    checkRateLimit(testConfig, "test-ip");

    // test-ip is blocked
    expect(checkRateLimit(testConfig, "test-ip").allowed).toBe(false);

    // other-ip is still allowed
    expect(checkRateLimit(testConfig, "other-ip").allowed).toBe(true);
  });

  it("resetRateLimit clears the counter for an IP", () => {
    checkRateLimit(testConfig, "test-ip");
    checkRateLimit(testConfig, "test-ip");
    checkRateLimit(testConfig, "test-ip");
    expect(checkRateLimit(testConfig, "test-ip").allowed).toBe(false);

    resetRateLimit(testConfig.name, "test-ip");

    // After reset, should be allowed again
    const result = checkRateLimit(testConfig, "test-ip");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("uses separate stores for different limiter names", () => {
    const otherConfig: RateLimitConfig = {
      name: "other-limiter",
      maxAttempts: 1,
      windowMs: 5000,
    };

    checkRateLimit(otherConfig, "test-ip");
    expect(checkRateLimit(otherConfig, "test-ip").allowed).toBe(false);

    // The test-limiter should still be independent
    expect(checkRateLimit(testConfig, "test-ip").allowed).toBe(true);
  });
});

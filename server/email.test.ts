import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock nodemailer before importing the module
const sendMailMock = vi.fn().mockResolvedValue({ messageId: "test-id" });
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: sendMailMock,
    })),
  },
}));

describe("sendNotificationEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("sends email with correct parameters when SMTP is configured", async () => {
    vi.doMock("./_core/env", () => ({
      ENV: {
        smtpUser: "test@gmail.com",
        smtpPassword: "test-app-password",
        notificationEmail: "info@bosphorusgaz.com",
      },
    }));

    const { sendNotificationEmail } = await import("./email");
    const result = await sendNotificationEmail("Test Subject", "Test body content");

    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledWith({
      from: '"Bosphorus Gaz Web" <test@gmail.com>',
      to: "info@bosphorusgaz.com",
      subject: "Test Subject",
      text: "Test body content",
    });
  });

  it("falls back to smtpUser as recipient when notificationEmail is empty", async () => {
    vi.doMock("./_core/env", () => ({
      ENV: {
        smtpUser: "sender@gmail.com",
        smtpPassword: "password123",
        notificationEmail: "",
      },
    }));

    const { sendNotificationEmail } = await import("./email");
    const result = await sendNotificationEmail("Subject", "Body");

    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: "sender@gmail.com" })
    );
  });

  it("returns false when SMTP credentials are missing", async () => {
    vi.doMock("./_core/env", () => ({
      ENV: {
        smtpUser: "",
        smtpPassword: "",
        notificationEmail: "",
      },
    }));

    const { sendNotificationEmail } = await import("./email");
    const result = await sendNotificationEmail("Test", "Body");
    expect(result).toBe(false);
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("returns false and does not throw when sendMail fails", async () => {
    vi.doMock("./_core/env", () => ({
      ENV: {
        smtpUser: "test@gmail.com",
        smtpPassword: "pass",
        notificationEmail: "info@test.com",
      },
    }));

    sendMailMock.mockRejectedValueOnce(new Error("SMTP connection refused"));

    const { sendNotificationEmail } = await import("./email");
    const result = await sendNotificationEmail("Fail Test", "Body");
    expect(result).toBe(false);
  });
});

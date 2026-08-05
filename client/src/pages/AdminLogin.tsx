import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Loader2, Lock, Shield, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type LoginStep = "credentials" | "setup2fa" | "verify2fa";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<LoginStep>("credentials");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [manualSecret, setManualSecret] = useState<string | null>(null);
  const { t } = useLanguage();

  const loginMutation = trpc.adminAuth.login.useMutation({
    onSuccess: (data) => {
      if (!data.success) {
        setError(data.error ?? t("Giriş başarısız", "Login failed", "Ошибка входа"));
        return;
      }
      if (data.requiresSetup) {
        // First time: show QR code for Google Authenticator setup
        setQrCode((data as any).qrCode ?? null);
        setManualSecret((data as any).secret ?? null);
        setStep("setup2fa");
        setError(null);
      } else if (data.requires2fa) {
        // 2FA already set up: ask for TOTP code
        setStep("verify2fa");
        setError(null);
      } else {
        // Should not happen in normal flow
        window.location.href = "/admin/haberler";
      }
    },
    onError: () => {
      setError(t("Bir hata oluştu. Lütfen tekrar deneyin.", "An error occurred. Please try again.", "Произошла ошибка."));
    },
  });

  const verify2faMutation = trpc.adminAuth.verify2fa.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        window.location.href = "/admin/haberler";
      } else {
        setError(data.error ?? t("Doğrulama başarısız", "Verification failed", "Ошибка проверки"));
      }
    },
    onError: () => {
      setError(t("Bir hata oluştu. Lütfen tekrar deneyin.", "An error occurred. Please try again.", "Произошла ошибка."));
    },
  });

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ username, password });
  };

  const handleVerify2fa = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    verify2faMutation.mutate({ username, password, totpCode });
  };

  // Step 1: Username & Password
  if (step === "credentials") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="h-12 w-12 bg-[#1e3a5f] rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-[#1e3a5f]">{t("Yönetim Paneli", "Admin Panel", "Панель управления")}</h1>
              <p className="text-sm text-slate-500 mt-1">{t("Giriş yaparak devam edin", "Sign in to continue", "Войдите, чтобы продолжить")}</p>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                  {t("Kullanıcı Adı", "Username", "Имя пользователя")}
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("Kullanıcı adınızı girin", "Enter your username", "Введите имя пользователя")}
                  required
                  autoComplete="username"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  {t("Şifre", "Password", "Пароль")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("Şifrenizi girin", "Enter your password", "Введите пароль")}
                  required
                  autoComplete="current-password"
                  className="h-11"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-11 bg-[#1e3a5f] hover:bg-[#2563eb] transition-colors"
              >
                {loginMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {t("Giriş Yap", "Sign In", "Войти")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a href="/" className="text-sm text-slate-500 hover:text-[#1d4ed8] transition-colors">
                &larr; {t("Ana Sayfaya Dön", "Back to Homepage", "Вернуться на главную")}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2A: First-time 2FA Setup (QR Code)
  if (step === "setup2fa") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-[#1e3a5f]">
                {t("2FA Kurulumu", "2FA Setup", "Настройка 2FA")}
              </h1>
              <p className="text-sm text-slate-500 mt-1 text-center">
                {t(
                  "Google Authenticator uygulamasını açın ve aşağıdaki QR kodu tarayın",
                  "Open Google Authenticator and scan the QR code below",
                  "Откройте Google Authenticator и отсканируйте QR-код"
                )}
              </p>
            </div>

            {/* QR Code */}
            {qrCode && (
              <div className="flex justify-center mb-4">
                <img src={qrCode} alt="2FA QR Code" className="w-56 h-56 border border-slate-200 rounded-lg" />
              </div>
            )}

            {/* Manual secret for manual entry */}
            {manualSecret && (
              <div className="mb-6">
                <p className="text-xs text-slate-500 text-center mb-1">
                  {t("Manuel giriş kodu:", "Manual entry key:", "Ключ для ручного ввода:")}
                </p>
                <div className="bg-slate-100 rounded-lg p-2 text-center">
                  <code className="text-sm font-mono text-[#1e3a5f] break-all select-all">{manualSecret}</code>
                </div>
              </div>
            )}

            {/* Verify code after scanning */}
            <form onSubmit={handleVerify2fa} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totp-setup" className="text-sm font-medium text-slate-700">
                  {t("Doğrulama Kodu", "Verification Code", "Код подтверждения")}
                </Label>
                <Input
                  id="totp-setup"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  required
                  autoComplete="one-time-code"
                  className="h-11 text-center text-lg tracking-widest font-mono"
                />
                <p className="text-xs text-slate-400">
                  {t(
                    "QR kodu taradıktan sonra uygulamadaki 6 haneli kodu girin",
                    "After scanning the QR code, enter the 6-digit code from the app",
                    "После сканирования QR-кода введите 6-значный код из приложения"
                  )}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={verify2faMutation.isPending || totpCode.length !== 6}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                {verify2faMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {t("Doğrula ve Giriş Yap", "Verify & Sign In", "Подтвердить и войти")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Step 2B: Verify 2FA (already set up)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 bg-[#1e3a5f] rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#1e3a5f]">
              {t("İki Faktörlü Doğrulama", "Two-Factor Authentication", "Двухфакторная аутентификация")}
            </h1>
            <p className="text-sm text-slate-500 mt-1 text-center">
              {t(
                "Google Authenticator uygulamasındaki 6 haneli kodu girin",
                "Enter the 6-digit code from Google Authenticator",
                "Введите 6-значный код из Google Authenticator"
              )}
            </p>
          </div>

          <form onSubmit={handleVerify2fa} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="totp-verify" className="text-sm font-medium text-slate-700">
                {t("Doğrulama Kodu", "Verification Code", "Код подтверждения")}
              </Label>
              <Input
                id="totp-verify"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                required
                autoFocus
                autoComplete="one-time-code"
                className="h-11 text-center text-lg tracking-widest font-mono"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={verify2faMutation.isPending || totpCode.length !== 6}
              className="w-full h-11 bg-[#1e3a5f] hover:bg-[#2563eb] transition-colors"
            >
              {verify2faMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t("Doğrula", "Verify", "Подтвердить")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setStep("credentials"); setError(null); setTotpCode(""); }}
              className="text-sm text-slate-500 hover:text-[#1d4ed8] transition-colors"
            >
              &larr; {t("Geri Dön", "Go Back", "Назад")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

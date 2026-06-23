import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Loader2, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const loginMutation = trpc.adminAuth.login.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        window.location.href = "/admin/haberler";
      } else {
        setError(data.error ?? t("Giriş başarısız", "Login failed", "Ошибка входа"));
      }
    },
    onError: () => {
      setError(t("Bir hata oluştu. Lütfen tekrar deneyin.", "An error occurred. Please try again.", "Произошла ошибка. Пожалуйста, попробуйте ещё раз."));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 bg-[#1e3a5f] rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#1e3a5f]">{t("Yönetim Paneli", "Admin Panel", "Панель управления")}</h1>
            <p className="text-sm text-slate-500 mt-1">{t("Giriş yaparak devam edin", "Sign in to continue", "Войдите, чтобы продолжить")}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
              {loginMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {t("Giriş Yap", "Sign In", "Войти")}
            </Button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-slate-500 hover:text-[#1d4ed8] transition-colors"
            >
              &larr; {t("Ana Sayfaya Dön", "Back to Homepage", "Вернуться на главную")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

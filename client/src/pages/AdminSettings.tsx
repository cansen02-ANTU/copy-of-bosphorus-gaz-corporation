import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Shield, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminSettings() {
  const { t } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const reset2faMutation = trpc.adminAuth.reset2fa.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setResetSuccess(true);
        setShowConfirm(false);
      }
    },
  });

  const handleReset = () => {
    reset2faMutation.mutate();
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        {t("Ayarlar", "Settings", "Настройки")}
      </h1>

      {/* 2FA Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {t("İki Faktörlü Doğrulama (2FA)", "Two-Factor Authentication (2FA)", "Двухфакторная аутентификация (2FA)")}
            </h2>
            <p className="text-sm text-slate-500">
              {t(
                "Google Authenticator ile güvenli giriş",
                "Secure login with Google Authenticator",
                "Безопасный вход с Google Authenticator"
              )}
            </p>
          </div>
        </div>

        {resetSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">
                {t("2FA başarıyla sıfırlandı", "2FA reset successfully", "2FA успешно сброшена")}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {t(
                  "Bir sonraki girişinizde yeni bir QR kod oluşturulacak.",
                  "A new QR code will be generated on your next login.",
                  "Новый QR-код будет создан при следующем входе."
                )}
              </p>
            </div>
          </div>
        ) : !showConfirm ? (
          <div>
            <p className="text-sm text-slate-600 mb-4">
              {t(
                "Telefonunuza erişiminizi kaybettiyseniz veya Authenticator uygulamanızı değiştirmek istiyorsanız 2FA'yı sıfırlayabilirsiniz. Bir sonraki girişte yeni bir QR kod oluşturulacaktır.",
                "If you lost access to your phone or want to change your Authenticator app, you can reset 2FA. A new QR code will be generated on your next login.",
                "Если вы потеряли доступ к телефону или хотите сменить приложение Authenticator, вы можете сбросить 2FA. Новый QR-код будет создан при следующем входе."
              )}
            </p>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(true)}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Shield className="h-4 w-4 mr-2" />
              {t("2FA'yı Sıfırla", "Reset 2FA", "Сбросить 2FA")}
            </Button>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">
                  {t("Emin misiniz?", "Are you sure?", "Вы уверены?")}
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  {t(
                    "Bu işlem mevcut 2FA yapılandırmanızı silecek. Bir sonraki girişte yeni bir QR kod taramanız gerekecek.",
                    "This will delete your current 2FA configuration. You will need to scan a new QR code on your next login.",
                    "Это удалит текущую конфигурацию 2FA. При следующем входе вам нужно будет отсканировать новый QR-код."
                  )}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleReset}
                    disabled={reset2faMutation.isPending}
                  >
                    {reset2faMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    {t("Evet, Sıfırla", "Yes, Reset", "Да, сбросить")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                  >
                    {t("İptal", "Cancel", "Отмена")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, AlertTriangle, CheckCircle, Clock, Ban, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const EVENT_CONFIG: Record<string, { icon: typeof Shield; color: string; labelTr: string; labelEn: string; labelRu: string }> = {
  login_failed: { icon: AlertTriangle, color: "text-red-500", labelTr: "Başarısız Giriş", labelEn: "Failed Login", labelRu: "Неудачный вход" },
  login_success: { icon: CheckCircle, color: "text-green-500", labelTr: "Başarılı Giriş", labelEn: "Successful Login", labelRu: "Успешный вход" },
  login_rate_limited: { icon: Ban, color: "text-orange-500", labelTr: "Giriş Engellendi", labelEn: "Login Blocked", labelRu: "Вход заблокирован" },
  "2fa_failed": { icon: AlertTriangle, color: "text-red-500", labelTr: "Başarısız 2FA", labelEn: "Failed 2FA", labelRu: "Неудачная 2FA" },
  "2fa_success": { icon: CheckCircle, color: "text-green-500", labelTr: "Başarılı 2FA", labelEn: "Successful 2FA", labelRu: "Успешная 2FA" },
  "2fa_rate_limited": { icon: Ban, color: "text-orange-500", labelTr: "2FA Engellendi", labelEn: "2FA Blocked", labelRu: "2FA заблокирована" },
  "2fa_setup_complete": { icon: Shield, color: "text-blue-500", labelTr: "2FA Kuruldu", labelEn: "2FA Setup", labelRu: "2FA настроена" },
  "2fa_reset": { icon: Shield, color: "text-amber-500", labelTr: "2FA Sıfırlandı", labelEn: "2FA Reset", labelRu: "2FA сброшена" },
};

export default function AdminActivityLog() {
  const { t } = useLanguage();
  const { data: logs, isLoading, refetch } = trpc.adminAuth.activityLog.useQuery({ limit: 100 });

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {t("Aktivite Günlüğü", "Activity Log", "Журнал активности")}
        </h1>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
          {t("Yenile", "Refresh", "Обновить")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : !logs || logs.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">
            {t("Henüz aktivite kaydı yok", "No activity records yet", "Записей активности пока нет")}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    {t("Olay", "Event", "Событие")}
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    {t("IP Adresi", "IP Address", "IP-адрес")}
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    {t("Detay", "Details", "Детали")}
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    {t("Tarih", "Date", "Дата")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                  const config = EVENT_CONFIG[log.event] ?? {
                    icon: Clock,
                    color: "text-slate-400",
                    labelTr: log.event,
                    labelEn: log.event,
                    labelRu: log.event,
                  };
                  const Icon = config.icon;
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${config.color} flex-shrink-0`} />
                          <span className="font-medium text-slate-700">
                            {t(config.labelTr, config.labelEn, config.labelRu)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                        {log.ip || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs max-w-[200px] truncate">
                        {log.details || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

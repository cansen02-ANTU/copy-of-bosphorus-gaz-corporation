import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Mail, Fuel, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "gas" | "contact";

export default function AdminRequests() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("contact");
  const [selectedGas, setSelectedGas] = useState<any>(null);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "contact" | "gas"; id: number; label: string } | null>(null);

  const utils = trpc.useUtils();

  const { data: gasRequests, isLoading: gasLoading } = trpc.requests.gasRequests.useQuery();
  const { data: contactMessages, isLoading: contactLoading } = trpc.requests.contactMessages.useQuery();

  const deleteContactMutation = trpc.requests.deleteContactMessage.useMutation({
    onSuccess: () => {
      toast.success(t("Mesaj silindi.", "Message deleted.", "Сообщение удалено."));
      utils.requests.contactMessages.invalidate();
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error(t("Silme işlemi başarısız.", "Delete failed.", "Ошибка удаления."));
    },
  });

  const deleteGasMutation = trpc.requests.deleteGasRequest.useMutation({
    onSuccess: () => {
      toast.success(t("Talep silindi.", "Request deleted.", "Заявка удалена."));
      utils.requests.gasRequests.invalidate();
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error(t("Silme işlemi başarısız.", "Delete failed.", "Ошибка удаления."));
    },
  });

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "contact") {
      deleteContactMutation.mutate({ id: deleteTarget.id });
    } else {
      deleteGasMutation.mutate({ id: deleteTarget.id });
    }
  };

  const isDeleting = deleteContactMutation.isPending || deleteGasMutation.isPending;

  const formatDate = (d: any) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t("Talepler", "Requests", "Заявки")}</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "contact"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Mail className="w-4 h-4" />
          {t("İletişim Mesajları", "Contact Messages", "Сообщения")}
          {contactMessages && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
              {contactMessages.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("gas")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "gas"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Fuel className="w-4 h-4" />
          {t("Doğal Gaz Talepleri", "Gas Requests", "Заявки на газ")}
          {gasRequests && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
              {gasRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Contact Messages Tab */}
      {activeTab === "contact" && (
        <div>
          {contactLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : !contactMessages || contactMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>{t("Henüz iletişim mesajı yok.", "No contact messages yet.", "Сообщений пока нет.")}</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>{t("Ad Soyad", "Name", "Имя")}</TableHead>
                    <TableHead>{t("E-posta", "Email", "Эл. почта")}</TableHead>
                    <TableHead>{t("Konu", "Subject", "Тема")}</TableHead>
                    <TableHead>{t("Tarih", "Date", "Дата")}</TableHead>
                    <TableHead className="w-24">{t("İşlem", "Actions", "Действия")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactMessages.map((msg: any) => (
                    <TableRow key={msg.id}>
                      <TableCell className="text-slate-400 text-xs">{msg.id}</TableCell>
                      <TableCell className="font-medium">{msg.name}</TableCell>
                      <TableCell className="text-sm text-slate-500">{msg.email}</TableCell>
                      <TableCell className="text-sm">{msg.subject}</TableCell>
                      <TableCell className="text-sm text-slate-400">{formatDate(msg.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedContact(msg)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteTarget({ type: "contact", id: msg.id, label: msg.name })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Gas Requests Tab */}
      {activeTab === "gas" && (
        <div>
          {gasLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : !gasRequests || gasRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Fuel className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>{t("Henüz doğal gaz talebi yok.", "No gas requests yet.", "Заявок на газ пока нет.")}</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>{t("Firma", "Company", "Компания")}</TableHead>
                    <TableHead>{t("İletişim Kişisi", "Contact Person", "Контактное лицо")}</TableHead>
                    <TableHead>{t("E-posta", "Email", "Эл. почта")}</TableHead>
                    <TableHead>{t("Telefon", "Phone", "Телефон")}</TableHead>
                    <TableHead>{t("Tarih", "Date", "Дата")}</TableHead>
                    <TableHead className="w-24">{t("İşlem", "Actions", "Действия")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gasRequests.map((req: any) => (
                    <TableRow key={req.id}>
                      <TableCell className="text-slate-400 text-xs">{req.id}</TableCell>
                      <TableCell className="font-medium">{req.companyName}</TableCell>
                      <TableCell className="text-sm">{req.contactPerson}</TableCell>
                      <TableCell className="text-sm text-slate-500">{req.email}</TableCell>
                      <TableCell className="text-sm text-slate-500">{req.phone}</TableCell>
                      <TableCell className="text-sm text-slate-400">{formatDate(req.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedGas(req)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteTarget({ type: "gas", id: req.id, label: req.companyName })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => !isDeleting && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("Silme Onayı", "Confirm Delete", "Подтверждение удаления")}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            {t(
              `"${deleteTarget?.label}" kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
              `Are you sure you want to delete "${deleteTarget?.label}"? This action cannot be undone.`,
              `Вы уверены, что хотите удалить "${deleteTarget?.label}"? Это действие нельзя отменить.`
            )}
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              {t("İptal", "Cancel", "Отмена")}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {t("Sil", "Delete", "Удалить")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Message Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("İletişim Mesajı", "Contact Message", "Сообщение")}</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("Ad Soyad", "Name", "Имя")}</p>
                  <p className="text-sm font-medium">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("E-posta", "Email", "Эл. почта")}</p>
                  <p className="text-sm font-medium">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("Konu", "Subject", "Тема")}</p>
                  <p className="text-sm font-medium">{selectedContact.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("Tarih", "Date", "Дата")}</p>
                  <p className="text-sm font-medium">{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">{t("Mesaj", "Message", "Сообщение")}</p>
                <div className="bg-slate-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Gas Request Detail Dialog */}
      <Dialog open={!!selectedGas} onOpenChange={() => setSelectedGas(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("Doğal Gaz Talebi", "Gas Request", "Заявка на газ")}</DialogTitle>
          </DialogHeader>
          {selectedGas && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("Firma", "Company", "Компания")}</p>
                  <p className="text-sm font-medium">{selectedGas.companyName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("İletişim Kişisi", "Contact", "Контакт")}</p>
                  <p className="text-sm font-medium">{selectedGas.contactPerson}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("E-posta", "Email", "Эл. почта")}</p>
                  <p className="text-sm font-medium">{selectedGas.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("Telefon", "Phone", "Телефон")}</p>
                  <p className="text-sm font-medium">{selectedGas.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("Tesis İli", "Province", "Провинция")}</p>
                  <p className="text-sm font-medium">{selectedGas.facilityProvince}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("Yıllık Tüketim", "Annual Consumption", "Годовое потребление")}</p>
                  <p className="text-sm font-medium">{selectedGas.annualConsumption}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">{t("Tesis Adresi", "Facility Address", "Адрес объекта")}</p>
                <p className="text-sm">{selectedGas.facilityAddress}</p>
              </div>
              {selectedGas.usagePurpose && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("Kullanım Amacı", "Usage Purpose", "Цель использования")}</p>
                  <p className="text-sm">{selectedGas.usagePurpose}</p>
                </div>
              )}
              {selectedGas.monthlyUsage && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("Aylık Tüketim", "Monthly Usage", "Ежемесячное потребление")}</p>
                  <p className="text-sm">{selectedGas.monthlyUsage}</p>
                </div>
              )}
              {selectedGas.notes && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t("Notlar", "Notes", "Примечания")}</p>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                    {selectedGas.notes}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-400 mb-1">{t("Tarih", "Date", "Дата")}</p>
                <p className="text-sm">{formatDate(selectedGas.createdAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

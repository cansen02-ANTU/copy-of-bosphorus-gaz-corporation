import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, X, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

type TabLang = "tr" | "en" | "ru";

export default function AdminNews() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabLang>("tr");

  // TR fields
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  // EN fields
  const [titleEn, setTitleEn] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [contentEn, setContentEn] = useState("");

  // RU fields
  const [titleRu, setTitleRu] = useState("");
  const [excerptRu, setExcerptRu] = useState("");
  const [contentRu, setContentRu] = useState("");

  // Date
  const [publishedAt, setPublishedAt] = useState<string>("");

  // Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const { t, lang } = useLanguage();
  const utils = trpc.useUtils();
  const { data: articles, isLoading } = trpc.news.list.useQuery();

  const createMutation = trpc.news.create.useMutation({
    onSuccess: () => {
      utils.news.list.invalidate();
      resetForm();
      toast.success(t("Haber başarıyla eklendi", "News article added successfully", "Новость успешно добавлена"));
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.news.update.useMutation({
    onSuccess: () => {
      utils.news.list.invalidate();
      resetForm();
      toast.success(t("Haber başarıyla güncellendi", "News article updated successfully", "Новость успешно обновлена"));
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.news.delete.useMutation({
    onSuccess: () => {
      utils.news.list.invalidate();
      toast.success(t("Haber silindi", "News article deleted", "Новость удалена"));
    },
    onError: (err) => toast.error(err.message),
  });

  function resetForm() {
    setIsDialogOpen(false);
    setEditingId(null);
    setActiveTab("tr");
    setTitle("");
    setExcerpt("");
    setContent("");
    setTitleEn("");
    setExcerptEn("");
    setContentEn("");
    setTitleRu("");
    setExcerptRu("");
    setContentRu("");
    setPublishedAt("");
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
  }

  function toLocalDatetimeString(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function openCreate() {
    resetForm();
    setPublishedAt(toLocalDatetimeString(new Date()));
    setIsDialogOpen(true);
  }

  function openEdit(article: NonNullable<typeof articles>[number]) {
    setEditingId(article.id);
    setActiveTab("tr");
    setTitle(article.title);
    setExcerpt(article.excerpt);
    setContent(article.content ?? "");
    setTitleEn(article.titleEn ?? "");
    setExcerptEn(article.excerptEn ?? "");
    setContentEn(article.contentEn ?? "");
    setTitleRu(article.titleRu ?? "");
    setExcerptRu(article.excerptRu ?? "");
    setContentRu(article.contentRu ?? "");
    const d = new Date(article.publishedAt);
    setPublishedAt(toLocalDatetimeString(d));
    setImagePreview(article.imageUrl ?? null);
    setImageFile(null);
    setRemoveImage(false);
    setIsDialogOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setRemoveImage(false);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  }

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) {
      toast.error(t("Başlık ve özet zorunludur (TR)", "Title and excerpt are required (TR)", "Заголовок и краткое описание обязательны (TR)"));
      return;
    }

    let imageBase64: string | undefined;
    let imageMimeType: string | undefined;

    if (imageFile) {
      imageBase64 = await fileToBase64(imageFile);
      imageMimeType = imageFile.type;
    }

    const dateMs = publishedAt ? new Date(publishedAt).getTime() : Date.now();

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        title,
        excerpt,
        content: content || undefined,
        titleEn: titleEn || undefined,
        excerptEn: excerptEn || undefined,
        contentEn: contentEn || undefined,
        titleRu: titleRu || undefined,
        excerptRu: excerptRu || undefined,
        contentRu: contentRu || undefined,
        publishedAt: dateMs,
        imageBase64,
        imageMimeType,
        removeImage: removeImage || undefined,
      });
    } else {
      createMutation.mutate({
        title,
        excerpt,
        content: content || undefined,
        titleEn: titleEn || undefined,
        excerptEn: excerptEn || undefined,
        contentEn: contentEn || undefined,
        titleRu: titleRu || undefined,
        excerptRu: excerptRu || undefined,
        contentRu: contentRu || undefined,
        publishedAt: dateMs,
        imageBase64,
        imageMimeType,
      });
    }
  }

  const isMutating = createMutation.isPending || updateMutation.isPending;

  function hasTranslation(article: NonNullable<typeof articles>[number], langCode: TabLang) {
    if (langCode === "tr") return true; // TR is always the base
    if (langCode === "en") return !!(article.titleEn && article.excerptEn);
    if (langCode === "ru") return !!(article.titleRu && article.excerptRu);
    return false;
  }

  const tabs: { id: TabLang; label: string }[] = [
    { id: "tr", label: "Türkçe (TR)" },
    { id: "en", label: "English (EN)" },
    { id: "ru", label: "Русский (RU)" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">{t("Haberler", "News", "Новости")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("Basın sayfasındaki haberleri yönetin", "Manage news articles on the press page", "Управление новостями на странице прессы")}
          </p>
        </div>
        <Button onClick={openCreate} className="bg-[#1d4ed8] hover:bg-[#1e40af]">
          <Plus className="h-4 w-4 mr-2" />
          {t("Yeni Haber", "New Article", "Новая новость")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#1d4ed8]" />
        </div>
      ) : !articles?.length ? (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">{t("Henüz haber eklenmemiş", "No news articles added yet", "Новости пока не добавлены")}</p>
          <p className="text-sm mt-1">{t("İlk haberi eklemek için yukarıdaki butonu kullanın", "Use the button above to add the first article", "Используйте кнопку выше, чтобы добавить первую новость")}</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t("Görsel", "Image", "Изображение")}</TableHead>
                <TableHead>{t("Başlık", "Title", "Заголовок")}</TableHead>
                <TableHead className="w-28">{t("Diller", "Languages", "Языки")}</TableHead>
                <TableHead className="w-40">{t("Tarih", "Date", "Дата")}</TableHead>
                <TableHead className="w-24 text-right">{t("İşlemler", "Actions", "Действия")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt=""
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">
                        {t("Yok", "None", "Нет")}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-[#1e3a5f] line-clamp-1">
                      {article.title}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {(["tr", "en", "ru"] as TabLang[]).map((code) => (
                        <span
                          key={code}
                          className={`inline-flex items-center justify-center w-7 h-5 rounded text-[10px] font-bold uppercase ${
                            hasTranslation(article, code)
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {new Date(article.publishedAt).toLocaleDateString(lang === "en" ? "en-US" : lang === "ru" ? "ru-RU" : "tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(article)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm(t("Bu haberi silmek istediğinize emin misiniz?", "Are you sure you want to delete this article?", "Вы уверены, что хотите удалить эту новость?"))) {
                            deleteMutation.mutate({ id: article.id });
                          }
                        }}
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? t("Haberi Düzenle", "Edit Article", "Редактировать новость") : t("Yeni Haber Ekle", "Add New Article", "Добавить новость")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Date picker */}
            <div>
              <label className="text-sm font-medium text-slate-700">{t("Yayın Tarihi *", "Publish Date *", "Дата публикации *")}</label>
              <Input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="mt-1 w-auto"
              />
            </div>

            {/* Language tabs */}
            <div className="border-b border-slate-200">
              <div className="flex gap-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-[#1d4ed8] text-[#1d4ed8]"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                    {tab.id === "tr" && " *"}
                  </button>
                ))}
              </div>
            </div>

            {/* TR fields */}
            {activeTab === "tr" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Başlık *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Haber başlığı"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Özet *</label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Kısa açıklama"
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">İçerik</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Detaylı haber içeriği (opsiyonel)"
                    rows={5}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* EN fields */}
            {activeTab === "en" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Title (EN)</label>
                  <Input
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Article title in English"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Excerpt (EN)</label>
                  <Textarea
                    value={excerptEn}
                    onChange={(e) => setExcerptEn(e.target.value)}
                    placeholder="Short description in English"
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Content (EN)</label>
                  <Textarea
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    placeholder="Detailed article content in English (optional)"
                    rows={5}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* RU fields */}
            {activeTab === "ru" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Заголовок (RU)</label>
                  <Input
                    value={titleRu}
                    onChange={(e) => setTitleRu(e.target.value)}
                    placeholder="Заголовок новости на русском"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Краткое описание (RU)</label>
                  <Textarea
                    value={excerptRu}
                    onChange={(e) => setExcerptRu(e.target.value)}
                    placeholder="Краткое описание на русском"
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Содержание (RU)</label>
                  <Textarea
                    value={contentRu}
                    onChange={(e) => setContentRu(e.target.value)}
                    placeholder="Подробное содержание новости на русском (необязательно)"
                    rows={5}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Image section */}
            <div>
              <label className="text-sm font-medium text-slate-700">{t("Görsel", "Image", "Изображение")}</label>
              {imagePreview && !removeImage ? (
                <div className="mt-2 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 h-8 gap-1"
                  >
                    <ImageOff className="h-3.5 w-3.5" />
                    {t("Görseli Kaldır", "Remove Image", "Удалить изображение")}
                  </Button>
                </div>
              ) : (
                <div className="mt-1">
                  {removeImage && (
                    <p className="text-xs text-amber-600 mb-2">
                      {t("Görsel kaydedildiğinde kaldırılacak", "Image will be removed on save", "Изображение будет удалено при сохранении")}
                    </p>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("İptal", "Cancel", "Отмена")}
              </Button>
              <Button
                type="submit"
                disabled={isMutating}
                className="bg-[#1d4ed8] hover:bg-[#1e40af]"
              >
                {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? t("Güncelle", "Update", "Обновить") : t("Ekle", "Add", "Добавить")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminNews() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { t, lang } = useLanguage();

  const utils = trpc.useUtils();
  const { data: articles, isLoading } = trpc.news.list.useQuery();

  const createMutation = trpc.news.create.useMutation({
    onSuccess: () => {
      utils.news.list.invalidate();
      resetForm();
      toast.success(t("Haber başarıyla eklendi", "News article added successfully"));
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.news.update.useMutation({
    onSuccess: () => {
      utils.news.list.invalidate();
      resetForm();
      toast.success(t("Haber başarıyla güncellendi", "News article updated successfully"));
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.news.delete.useMutation({
    onSuccess: () => {
      utils.news.list.invalidate();
      toast.success(t("Haber silindi", "News article deleted"));
    },
    onError: (err) => toast.error(err.message),
  });

  function resetForm() {
    setIsDialogOpen(false);
    setEditingId(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setImageFile(null);
    setImagePreview(null);
  }

  function openCreate() {
    resetForm();
    setIsDialogOpen(true);
  }

  function openEdit(article: NonNullable<typeof articles>[number]) {
    setEditingId(article.id);
    setTitle(article.title);
    setExcerpt(article.excerpt);
    setContent(article.content ?? "");
    setImagePreview(article.imageUrl ?? null);
    setImageFile(null);
    setIsDialogOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
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
      toast.error(t("Başlık ve özet zorunludur", "Title and excerpt are required"));
      return;
    }

    let imageBase64: string | undefined;
    let imageMimeType: string | undefined;

    if (imageFile) {
      imageBase64 = await fileToBase64(imageFile);
      imageMimeType = imageFile.type;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        title,
        excerpt,
        content: content || undefined,
        imageBase64,
        imageMimeType,
      });
    } else {
      createMutation.mutate({
        title,
        excerpt,
        content: content || undefined,
        imageBase64,
        imageMimeType,
        publishedAt: Date.now(),
      });
    }
  }

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">{t("Haberler", "News")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("Basın sayfasındaki haberleri yönetin", "Manage news articles on the press page")}
          </p>
        </div>
        <Button onClick={openCreate} className="bg-[#1d4ed8] hover:bg-[#1e40af]">
          <Plus className="h-4 w-4 mr-2" />
          {t("Yeni Haber", "New Article")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#1d4ed8]" />
        </div>
      ) : !articles?.length ? (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">{t("Henüz haber eklenmemiş", "No news articles added yet")}</p>
          <p className="text-sm mt-1">{t("İlk haberi eklemek için yukarıdaki butonu kullanın", "Use the button above to add the first article")}</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t("Görsel", "Image")}</TableHead>
                <TableHead>{t("Başlık", "Title")}</TableHead>
                <TableHead className="w-40">{t("Tarih", "Date")}</TableHead>
                <TableHead className="w-24 text-right">{t("İşlemler", "Actions")}</TableHead>
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
                        {t("Yok", "None")}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-[#1e3a5f] line-clamp-1">
                        {article.title}
                      </p>
                      <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
                        {article.excerpt}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {new Date(article.publishedAt).toLocaleDateString(lang === "en" ? "en-US" : "tr-TR", {
                      day: "numeric",
                      month: "long",
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
                          if (confirm(t("Bu haberi silmek istediğinize emin misiniz?", "Are you sure you want to delete this article?"))) {
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? t("Haberi Düzenle", "Edit Article") : t("Yeni Haber Ekle", "Add New Article")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">{t("Başlık *", "Title *")}</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("Haber başlığı", "Article title")}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">{t("Özet *", "Excerpt *")}</label>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder={t("Kısa açıklama", "Short description")}
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">{t("İçerik", "Content")}</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("Detaylı haber içeriği (opsiyonel)", "Detailed article content (optional)")}
                rows={5}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">{t("Görsel", "Image")}</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-full h-32 object-cover rounded"
                />
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("İptal", "Cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isMutating}
                className="bg-[#1d4ed8] hover:bg-[#1e40af]"
              >
                {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? t("Güncelle", "Update") : t("Ekle", "Add")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

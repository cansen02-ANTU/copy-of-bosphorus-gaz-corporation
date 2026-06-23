import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminGallery() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { t } = useLanguage();

  const utils = trpc.useUtils();
  const { data: images, isLoading } = trpc.gallery.list.useQuery();

  const createMutation = trpc.gallery.create.useMutation({
    onSuccess: () => {
      utils.gallery.list.invalidate();
      resetForm();
      toast.success(t("Görsel başarıyla eklendi", "Image added successfully", "Изображение успешно добавлено"));
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      utils.gallery.list.invalidate();
      toast.success(t("Görsel silindi", "Image deleted", "Изображение удалено"));
    },
    onError: (err) => toast.error(err.message),
  });

  function resetForm() {
    setIsDialogOpen(false);
    setCaption("");
    setImageFile(null);
    setImagePreview(null);
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
    if (!caption.trim()) {
      toast.error(t("Açıklama zorunludur", "Caption is required", "Подпись обязательна"));
      return;
    }
    if (!imageFile) {
      toast.error(t("Lütfen bir görsel seçin", "Please select an image", "Пожалуйста, выберите изображение"));
      return;
    }

    const imageBase64 = await fileToBase64(imageFile);
    createMutation.mutate({
      caption,
      imageBase64,
      imageMimeType: imageFile.type,
      sortOrder: (images?.length ?? 0) + 1,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">{t("Galeri", "Gallery", "Галерея")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("Basın sayfasındaki fotoğraf galerisini yönetin", "Manage the photo gallery on the press page", "Управление фотогалереей на странице прессы")}
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#1d4ed8] hover:bg-[#1e40af]"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("Görsel Ekle", "Add Image", "Добавить изображение")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#1d4ed8]" />
        </div>
      ) : !images?.length ? (
        <div className="text-center py-12 text-slate-500">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p className="text-lg">{t("Henüz görsel eklenmemiş", "No images added yet", "Изображения пока не добавлены")}</p>
          <p className="text-sm mt-1">{t("İlk görseli eklemek için yukarıdaki butonu kullanın", "Use the button above to add the first image", "Используйте кнопку выше, чтобы добавить первое изображение")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative rounded-lg overflow-hidden border border-slate-200 bg-white"
            >
              <img
                src={image.imageUrl}
                alt={image.caption}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-end">
                <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  <p className="text-white text-sm font-medium line-clamp-2">
                    {image.caption}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (confirm(t("Bu görseli silmek istediğinize emin misiniz?", "Are you sure you want to delete this image?", "Вы уверены, что хотите удалить это изображение?"))) {
                    deleteMutation.mutate({ id: image.id });
                  }
                }}
                className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-red-50 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Yeni Görsel Ekle", "Add New Image", "Добавить новое изображение")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">{t("Açıklama *", "Caption *", "Подпись *")}</label>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={t("Görsel açıklaması", "Image caption", "Подпись к изображению")}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">{t("Görsel *", "Image *", "Изображение *")}</label>
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
                  className="mt-2 w-full h-48 object-cover rounded"
                />
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("İptal", "Cancel", "Отмена")}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-[#1d4ed8] hover:bg-[#1e40af]"
              >
                {createMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {t("Ekle", "Add", "Добавить")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

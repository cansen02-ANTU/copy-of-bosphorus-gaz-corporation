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
import { Plus, Trash2, Loader2, Image as ImageIcon, ArrowLeft, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

type Album = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  sortOrder: number;
  photos: { id: number; imageUrl: string; caption: string | null }[];
};

export default function AdminGallery() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [isAddAlbumOpen, setIsAddAlbumOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumSlug, setAlbumSlug] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { t } = useLanguage();

  const utils = trpc.useUtils();
  const { data: albums, isLoading } = trpc.gallery.albums.useQuery();

  const deleteAlbumMutation = trpc.gallery.deleteAlbum.useMutation({
    onSuccess: () => {
      utils.gallery.albums.invalidate();
      setSelectedAlbum(null);
      toast.success(t("Albüm silindi", "Album deleted", "Альбом удалён"));
    },
    onError: (err) => toast.error(err.message),
  });

  const addPhotoMutation = trpc.gallery.addPhoto.useMutation({
    onSuccess: () => {
      utils.gallery.albums.invalidate();
      resetPhotoForm();
      toast.success(t("Fotoğraf eklendi", "Photo added", "Фотография добавлена"));
    },
    onError: (err) => toast.error(err.message),
  });

  const deletePhotoMutation = trpc.gallery.deletePhoto.useMutation({
    onSuccess: () => {
      utils.gallery.albums.invalidate();
      toast.success(t("Fotoğraf silindi", "Photo deleted", "Фотография удалена"));
    },
    onError: (err) => toast.error(err.message),
  });

  const createAlbumMutation = trpc.gallery.createAlbum.useMutation({
    onSuccess: () => {
      utils.gallery.albums.invalidate();
      resetAlbumForm();
      toast.success(t("Albüm oluşturuldu", "Album created", "Альбом создан"));
    },
    onError: (err) => toast.error(err.message),
  });

  function resetPhotoForm() {
    setIsAddPhotoOpen(false);
    setCaption("");
    setImageFile(null);
    setImagePreview(null);
  }

  function resetAlbumForm() {
    setIsAddAlbumOpen(false);
    setAlbumTitle("");
    setAlbumSlug("");
    setAlbumDescription("");
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

  async function handleAddPhoto(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile || !selectedAlbum) return;
    const imageBase64 = await fileToBase64(imageFile);
    addPhotoMutation.mutate({
      albumId: selectedAlbum.id,
      imageBase64,
      imageMimeType: imageFile.type,
      caption: caption || undefined,
      sortOrder: (selectedAlbum.photos?.length ?? 0) + 1,
    });
  }

  async function handleCreateAlbum(e: React.FormEvent) {
    e.preventDefault();
    if (!albumTitle.trim() || !albumSlug.trim()) {
      toast.error(t("Başlık ve slug zorunludur", "Title and slug are required", "Название и slug обязательны"));
      return;
    }
    createAlbumMutation.mutate({
      title: albumTitle,
      slug: albumSlug,
      description: albumDescription || undefined,
      sortOrder: (albums?.length ?? 0) + 1,
    });
  }

  // Keep selectedAlbum in sync with latest data
  const currentAlbum = selectedAlbum
    ? albums?.find((a) => a.id === selectedAlbum.id) ?? null
    : null;

  // ─── Album Detail View ────────────────────────────────────────────────────
  if (currentAlbum) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedAlbum(null)}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1e3a5f]">{currentAlbum.title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {currentAlbum.photos.length} {t("fotoğraf", "photos", "фотографий")}
            </p>
          </div>
          <Button
            onClick={() => setIsAddPhotoOpen(true)}
            className="bg-[#1d4ed8] hover:bg-[#1e40af]"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("Fotoğraf Ekle", "Add Photo", "Добавить фото")}
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => {
              if (confirm(t(
                "Bu albümü ve tüm fotoğraflarını silmek istediğinize emin misiniz?",
                "Are you sure you want to delete this album and all its photos?",
                "Вы уверены, что хотите удалить этот альбом и все его фотографии?"
              ))) {
                deleteAlbumMutation.mutate({ id: currentAlbum.id });
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t("Albümü Sil", "Delete Album", "Удалить альбом")}
          </Button>
        </div>

        {currentAlbum.photos.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p className="text-lg">{t("Bu albümde henüz fotoğraf yok", "No photos in this album yet", "В этом альбоме пока нет фотографий")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentAlbum.photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-lg overflow-hidden border border-slate-200 bg-white"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || ""}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-end">
                  {photo.caption && (
                    <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                      <p className="text-white text-sm font-medium line-clamp-2">
                        {photo.caption}
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm(t("Bu fotoğrafı silmek istediğinize emin misiniz?", "Are you sure you want to delete this photo?", "Вы уверены, что хотите удалить эту фотографию?"))) {
                      deletePhotoMutation.mutate({ id: photo.id });
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

        {/* Add Photo Dialog */}
        <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("Fotoğraf Ekle", "Add Photo", "Добавить фото")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">{t("Açıklama", "Caption", "Подпись")}</label>
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={t("İsteğe bağlı açıklama", "Optional caption", "Необязательная подпись")}
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
                <Button type="button" variant="outline" onClick={resetPhotoForm}>
                  {t("İptal", "Cancel", "Отмена")}
                </Button>
                <Button
                  type="submit"
                  disabled={addPhotoMutation.isPending || !imageFile}
                  className="bg-[#1d4ed8] hover:bg-[#1e40af]"
                >
                  {addPhotoMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t("Ekle", "Add", "Добавить")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ─── Albums List View ─────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">{t("Foto Galeri", "Photo Gallery", "Фотогалерея")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("Albümleri ve fotoğrafları yönetin", "Manage albums and photos", "Управление альбомами и фотографиями")}
          </p>
        </div>
        <Button
          onClick={() => setIsAddAlbumOpen(true)}
          className="bg-[#1d4ed8] hover:bg-[#1e40af]"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("Albüm Oluştur", "Create Album", "Создать альбом")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#1d4ed8]" />
        </div>
      ) : !albums?.length ? (
        <div className="text-center py-12 text-slate-500">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p className="text-lg">{t("Henüz albüm oluşturulmamış", "No albums created yet", "Альбомы ещё не созданы")}</p>
          <p className="text-sm mt-1">{t("İlk albümü oluşturmak için yukarıdaki butonu kullanın", "Use the button above to create the first album", "Используйте кнопку выше для создания первого альбома")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => setSelectedAlbum(album as Album)}
              className="cursor-pointer group rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:border-[#1d4ed8]/30 transition-all duration-200"
            >
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : album.photos.length > 0 ? (
                  <img
                    src={album.photos[0].imageUrl}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="h-12 w-12 text-slate-300" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {album.photos.length} {t("fotoğraf", "photos", "фото")}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#1e3a5f] group-hover:text-[#1d4ed8] transition-colors">
                  {album.title}
                </h3>
                {album.description && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{album.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Album Dialog */}
      <Dialog open={isAddAlbumOpen} onOpenChange={setIsAddAlbumOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Yeni Albüm Oluştur", "Create New Album", "Создать новый альбом")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateAlbum} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">{t("Başlık *", "Title *", "Название *")}</label>
              <Input
                value={albumTitle}
                onChange={(e) => {
                  setAlbumTitle(e.target.value);
                  // Auto-generate slug from title
                  setAlbumSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                }}
                placeholder={t("Albüm başlığı", "Album title", "Название альбома")}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Slug *</label>
              <Input
                value={albumSlug}
                onChange={(e) => setAlbumSlug(e.target.value)}
                placeholder="album-slug"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">{t("Açıklama", "Description", "Описание")}</label>
              <Input
                value={albumDescription}
                onChange={(e) => setAlbumDescription(e.target.value)}
                placeholder={t("İsteğe bağlı açıklama", "Optional description", "Необязательное описание")}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetAlbumForm}>
                {t("İptal", "Cancel", "Отмена")}
              </Button>
              <Button
                type="submit"
                disabled={createAlbumMutation.isPending}
                className="bg-[#1d4ed8] hover:bg-[#1e40af]"
              >
                {createAlbumMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t("Oluştur", "Create", "Создать")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

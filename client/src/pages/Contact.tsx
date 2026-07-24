import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Clock, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/* Design: Light theme — White bg, blue accents, navy headings. */

export default function Contact() {
  const { t } = useLanguage();

  useSEO({
    titleTr: "İletişim",
    titleEn: "Contact",
    titleRu: "Контакты",
    descriptionTr: "Bosphorus Gaz Corporation iletişim bilgileri. Adres: Seba Center, Sarıyer, İstanbul. Telefon, e-posta ve iletişim formu ile bize ulaşın.",
    descriptionEn: "Contact Bosphorus Gaz Corporation. Address: Seba Center, Sarıyer, Istanbul. Reach us via phone, email, or contact form.",
    descriptionRu: "Контактная информация Bosphorus Gaz Corporation. Адрес: Seba Center, Сарыер, Стамбул. Свяжитесь с нами по телефону, электронной почте или через контактную форму.",
  });

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.contactForm.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success(t("Mesajınız başarıyla gönderildi!", "Your message has been sent successfully!", "Ваше сообщение успешно отправлено!"));
    },
    onError: () => {
      toast.error(t("Bir hata oluştu. Lütfen tekrar deneyin.", "An error occurred. Please try again.", "Произошла ошибка. Пожалуйста, попробуйте снова."));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject || !message.trim()) return;
    submitMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      subject: subject,
      message: message.trim(),
    });
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2563eb]">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663406413308/YsuVUT62bVL4iGDytG28i2/iletisim-bg-ZfreqiLpYJ9qd8VTa8CZdC.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-3">
              {t("İletişim", "Contact", "Контакты")}
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {t("Bize Ulaşın", "Get in Touch", "Свяжитесь с нами")}
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              {t(
                "Sorularınız, önerileriniz veya iş birliği talepleriniz için bizimle iletişime geçin.",
                "Contact us for your questions, suggestions, or partnership requests.",
                "Свяжитесь с нами по вопросам, предложениям или запросам о сотрудничестве."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20 border-t border-slate-100">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Info */}
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-8">{t("İletişim Bilgileri", "Contact Information", "Контактная информация")}</h2>
              <div className="space-y-6 mb-10">
                {/* Office 1: İstanbul HQ */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#1d4ed8]" />
                  </div>
                  <div>
                    <h3 className="text-[#1e3a5f] font-semibold text-sm">{t("Merkez Ofis – İstanbul", "Head Office – Istanbul", "Главный офис – Стамбул")}</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      İstinye Mah. Darüşşafaka Cad.<br />
                      Seba Center No:45 34460<br />
                      {t("İstinye / İstanbul, Türkiye", "İstinye / Istanbul, Turkey", "Истинье / Стамбул, Турция")}
                    </p>
                    <p className="text-slate-500 text-sm mt-2">
                      {t("Tel", "Phone", "Тел")}: +90 (212) 335 09 00<br />
                      {t("Faks", "Fax", "Факс")}: +90 (212) 335 09 20
                    </p>
                  </div>
                </div>
                {/* Office 2: Ankara */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#1d4ed8]" />
                  </div>
                  <div>
                    <h3 className="text-[#1e3a5f] font-semibold text-sm">{t("Ankara Ofis", "Ankara Office", "Офис в Анкаре")}</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Mustafa Kemal Mah. Dumlupınar Bulvarı<br />
                      No:266 Tepe Prime AVM, C Blok D:38 K:2 06800<br />
                      {t("Çankaya / Ankara, Türkiye", "Çankaya / Ankara, Turkey", "Чанкая / Анкара, Турция")}
                    </p>
                    <p className="text-slate-500 text-sm mt-2">
                      {t("Tel", "Phone", "Тел")}: +90 (312) 287 01 73<br />
                      {t("Faks", "Fax", "Факс")}: +90 (312) 287 01 46
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#1d4ed8]" />
                  </div>
                  <div>
                    <h3 className="text-[#1e3a5f] font-semibold text-sm">{t("E-posta", "Email", "Эл. почта")}</h3>
                    <p className="text-slate-500 text-sm mt-1">info@bosphorusgaz.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#1d4ed8]" />
                  </div>
                  <div>
                    <h3 className="text-[#1e3a5f] font-semibold text-sm">{t("Çalışma Saatleri", "Working Hours", "Часы работы")}</h3>
                    <p className="text-slate-500 text-sm mt-1">{t("Pazartesi – Cuma: 09:00 – 18:00", "Monday – Friday: 09:00 – 18:00", "Понедельник – Пятница: 09:00 – 18:00")}</p>
                    <p className="text-slate-500 text-sm">{t("Cumartesi – Pazar: Kapalı", "Saturday – Sunday: Closed", "Суббота – Воскресенье: Закрыто")}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-8">{t("İletişim Formu", "Contact Form", "Контактная форма")}</h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <h3 className="text-[#1e3a5f] font-semibold mb-2">{t("Mesajınız Gönderildi", "Your Message Has Been Sent", "Ваше сообщение отправлено")}</h3>
                  <p className="text-slate-500 text-sm">{t("En kısa sürede size dönüş yapacağız.", "We will get back to you as soon as possible.", "Мы свяжемся с вами в ближайшее время.")}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1.5">{t("Ad Soyad *", "Full Name *", "Имя и фамилия *")}</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                        placeholder={t("Adınız Soyadınız", "Your Full Name", "Ваше имя и фамилия")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1.5">{t("E-posta *", "Email *", "Эл. почта *")}</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                        placeholder={t("ornek@email.com", "example@email.com", "primer@email.com")}
                      />
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm text-slate-600 mb-1.5">{t("Konu *", "Subject *", "Тема *")}</label>
                    <select
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                    >
                      <option value="">{t("Seçiniz", "Select", "Выберите")}</option>
                      <option value="Doğal Gaz Tedarik">{t("Doğal Gaz Tedarik", "Natural Gas Supply", "Поставка природного газа")}</option>
                      <option value="İş Birliği">{t("İş Birliği", "Partnership", "Сотрудничество")}</option>
                      <option value="Basın & Medya">{t("Basın & Medya", "Press & Media", "Пресса и Медиа")}</option>
                      <option value="Kariyer">{t("Kariyer", "Careers", "Карьера")}</option>
                      <option value="Diğer">{t("Diğer", "Other", "Другое")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">{t("Mesaj *", "Message *", "Сообщение *")}</label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors resize-none"
                      placeholder={t("Mesajınızı yazın...", "Write your message...", "Напишите ваше сообщение...")}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full px-6 py-3 bg-[#1d4ed8] text-white font-semibold rounded-md hover:bg-[#2563eb] transition-all duration-200 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {submitMutation.isPending
                      ? t("Gönderiliyor...", "Sending...", "Отправка...")
                      : t("Gönder", "Send", "Отправить")
                    }
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

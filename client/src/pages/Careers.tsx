import { motion } from "framer-motion";
import { Briefcase, Users, TrendingUp, Heart, Mail } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

/* Design: Light theme — White bg, blue accents, navy headings. */

export default function Careers() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Users,
      titleTr: "Takım Ruhu",
      titleEn: "Teamwork",
      titleRu: "Командный дух",
      descTr: "Birlikte çalışmanın gücüne inanır, ortak hedefler doğrultusunda hareket ederiz.",
      descEn: "We believe in the power of working together and act towards common goals.",
      descRu: "Мы верим в силу совместной работы и действуем ради общих целей."
    },
    {
      icon: TrendingUp,
      titleTr: "Sürekli Gelişim",
      titleEn: "Continuous Growth",
      titleRu: "Непрерывное развитие",
      descTr: "Çalışanlarımızın profesyonel gelişimini destekler, eğitim fırsatları sunarız.",
      descEn: "We support the professional development of our employees and offer training opportunities.",
      descRu: "Мы поддерживаем профессиональное развитие наших сотрудников и предлагаем возможности для обучения."
    },
    {
      icon: Heart,
      titleTr: "İş-Yaşam Dengesi",
      titleEn: "Work-Life Balance",
      titleRu: "Баланс работы и личной жизни",
      descTr: "Çalışanlarımızın mutluluğunu ve sağlığını ön planda tutarız.",
      descEn: "We prioritize the happiness and well-being of our employees.",
      descRu: "Мы ставим на первое место счастье и здоровье наших сотрудников."
    },
    {
      icon: Briefcase,
      titleTr: "Liyakat",
      titleEn: "Meritocracy",
      titleRu: "Меритократия",
      descTr: "Yetkinlik ve performansa dayalı adil bir kariyer yolculuğu sunarız.",
      descEn: "We offer a fair career journey based on competence and performance.",
      descRu: "Мы предлагаем справедливый карьерный путь, основанный на компетентности и результатах."
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2563eb]">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663406413308/YsuVUT62bVL4iGDytG28i2/kariyer-bg-h73rS3wJ3pxVceUysNqVoC.webp"
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
              {t("Kariyer", "Careers", "Карьера")}
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {t("Bizimle Çalışın", "Work With Us", "Работайте с нами")}
            </h1>
            <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
              {t(
                "Türkiye'nin enerji geleceğini şekillendiren ekibimize katılın. Bosphorus Gaz'da her çalışan, şirketin başarısına doğrudan katkıda bulunur.",
                "Join our team shaping Turkey's energy future. At Bosphorus Gaz, every employee directly contributes to the company's success.",
                "Присоединяйтесь к нашей команде, формирующей энергетическое будущее Турции. В Bosphorus Gaz каждый сотрудник напрямую вносит вклад в успех компании."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* HR Policy & Values */}
      <section className="py-20 border-t border-slate-100">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">{t("İnsan Kaynakları Politikamız", "Our Human Resources Policy", "Наша политика управления персоналом")}</h2>
          <p className="text-slate-500 max-w-2xl mb-12 leading-relaxed">
            {t(
              "Bosphorus Gaz olarak, çalışanlarımızı en değerli varlığımız olarak görüyoruz. Yetkinliklere dayalı, adil ve şeffaf bir insan kaynakları yönetimi anlayışıyla, sektörün en nitelikli profesyonellerini bünyemize katmayı hedefliyoruz.",
              "At Bosphorus Gaz, we consider our employees as our most valuable asset. With a competency-based, fair, and transparent human resources management approach, we aim to attract the most qualified professionals in the industry.",
              "В Bosphorus Gaz мы считаем наших сотрудников своим самым ценным активом. Благодаря подходу к управлению персоналом, основанному на компетенциях, справедливости и прозрачности, мы стремимся привлекать самых квалифицированных специалистов отрасли."
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-slate-50 border border-slate-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-sm transition-all duration-300"
              >
                <value.icon className="w-8 h-8 text-[#1d4ed8] mb-4" />
                <h3 className="text-[#1e3a5f] font-semibold mb-2">{t(value.titleTr, value.titleEn, value.titleRu)}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{t(value.descTr, value.descEn, value.descRu)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply for a Job - Simple CTA */}
      <section className="py-24 lg:py-32 border-t border-slate-100 bg-slate-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Mail className="w-7 h-7 text-[#1d4ed8]" />
            </div>
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">
              {t("İş Başvurusu", "Job Application", "Заявка на работу")}
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              {t(
                "Bosphorus Gaz ailesine katılmak ister misiniz? Özgeçmişinizi ve ön yazınızı aşağıdaki e-posta adresine göndererek başvurunuzu yapabilirsiniz.",
                "Would you like to join the Bosphorus Gaz family? You can apply by sending your resume and cover letter to the email address below.",
                "Хотите присоединиться к семье Bosphorus Gaz? Вы можете подать заявку, отправив своё резюме и сопроводительное письмо на указанный ниже адрес электронной почты."
              )}
            </p>
            <button
              onClick={() => {
                window.location.href = `mailto:kariyer@bosphorusgaz.com?subject=${encodeURIComponent(t("İş Başvurusu", "Job Application", "Заявка на работу"))}`;
                toast(t("E-posta istemciniz açılıyor...", "Opening your email client...", "Открывается ваш почтовый клиент..."), { description: "kariyer@bosphorusgaz.com" });
              }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#1d4ed8] text-white font-semibold rounded-lg hover:bg-[#2563eb] transition-all duration-200 active:scale-[0.97] shadow-lg shadow-blue-500/20"
            >
              <Briefcase className="w-5 h-5" />
              {t("İş Başvurusu Yap", "Apply for a Job", "Подать заявку")}
            </button>
            <p className="text-slate-400 text-sm mt-6">
              kariyer@bosphorusgaz.com
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

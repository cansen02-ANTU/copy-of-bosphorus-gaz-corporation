import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

/* Design: Light theme — White bg, blue accents, navy headings. */

const timelineEvents = [
  { date: "07.04.2003", titleTr: "Kuruluş", titleEn: "Establishment", titleRu: "Основание", descTr: "Bosphorus Gaz Corporation A.Ş. kuruldu.", descEn: "Bosphorus Gaz Corporation A.Ş. was founded.", descRu: "Была основана компания Bosphorus Gaz Corporation A.Ş." },
  { date: "16.12.2003", titleTr: "Bursa İhalesi", titleEn: "Bursa Tender", titleRu: "Тендер в Бурсе", descTr: "Bosphorus Gaz Corporation \"Bursa Doğal Gaz Dağıtım\" ihalesine katıldı.", descEn: "Bosphorus Gaz Corporation participated in the \"Bursa Natural Gas Distribution\" tender.", descRu: "Bosphorus Gaz Corporation приняла участие в тендере «Распределение природного газа в Бурсе»." },
  { date: "02.04.2004", titleTr: "Ortaklık Değişikliği", titleEn: "Partnership Change", titleRu: "Изменение партнёрства", descTr: "Zarubezhgaz Management und Beteiligungsgesellschaft mbH (ZMB), Tur Enerji A.Ş.'nin hisselerinin %40'ını almıştır.", descEn: "Zarubezhgaz Management und Beteiligungsgesellschaft mbH (ZMB) acquired 40% of Tur Enerji A.Ş.'s shares.", descRu: "Компания Zarubezhgaz Management und Beteiligungsgesellschaft mbH (ZMB) приобрела 40% акций Tur Enerji A.Ş." },
  { date: "27.01.2005", titleTr: "İzmir İhalesi", titleEn: "Izmir Tender", titleRu: "Тендер в Измире", descTr: "Bosphorus Gaz Corporation \"İzmir Doğal Gaz Dağıtım Lisansı\" ihalesine katıldı.", descEn: "Bosphorus Gaz Corporation participated in the \"Izmir Natural Gas Distribution License\" tender.", descRu: "Bosphorus Gaz Corporation приняла участие в тендере «Лицензия на распределение природного газа в Измире»." },
  { date: "30.11.2005", titleTr: "Devir İhalesi Kazanıldı", titleEn: "Transfer Tender Won", titleRu: "Победа в тендере на передачу", descTr: "BOTAŞ'ın açmış olduğu \"Doğal Gaz Alım Satım Sözleşmeleri (İthalat Sözleşmeleri) Devir İhalesi\" kazanıldı.", descEn: "The \"Natural Gas Purchase and Sale Agreements (Import Contracts) Transfer Tender\" opened by BOTAŞ was won.", descRu: "Был выигран объявленный BOTAŞ «Тендер на передачу договоров купли-продажи природного газа (импортных контрактов)»." },
  { date: "22.05.2007", titleTr: "Üçlü Anlaşma", titleEn: "Trilateral Agreement", titleRu: "Трёхстороннее соглашение", descTr: "BOTAŞ, Gazprom Export ve Bosphorus Gaz arasındaki üçlü anlaşma Ankara'da imzalandı. Bosphorus Gaz ile Gazprom Export arasında 2021 yılı sonuna kadar geçerli yıllık 750 Milyon m³ Doğal Gaza ilişkin Satış Sözleşmesi imzalandı.", descEn: "The trilateral agreement between BOTAŞ, Gazprom Export and Bosphorus Gaz was signed in Ankara. A Sales Agreement for 750 million m³ of natural gas per year, valid until the end of 2021, was signed between Bosphorus Gaz and Gazprom Export.", descRu: "В Анкаре было подписано трёхстороннее соглашение между BOTAŞ, «Газпром экспорт» и Bosphorus Gaz. Между Bosphorus Gaz и «Газпром экспорт» был подписан договор купли-продажи на поставку 750 млн м³ природного газа в год, действующий до конца 2021 года." },
  { date: "11.07.2007", titleTr: "Rekabet Kurumu Onayı", titleEn: "Competition Board Approval", titleRu: "Одобрение Антимонопольного органа", descTr: "Şirketimiz Rekabet Kurumu tarafından onaylanmıştır.", descEn: "Our company was approved by the Competition Board.", descRu: "Наша компания получила одобрение Антимонопольного органа." },
  { date: "18.10.2007", titleTr: "İthalat Lisansı", titleEn: "Import License", titleRu: "Лицензия на импорт", descTr: "Bosphorus Gaz Corporation, EPDK'dan \"İthalat Lisansı\" aldı.", descEn: "Bosphorus Gaz Corporation obtained an \"Import License\" from EMRA.", descRu: "Bosphorus Gaz Corporation получила «Лицензию на импорт» от EPDK (Управления по регулированию энергетического рынка)." },
  { date: "03.01.2009", titleTr: "İthalat Başlangıcı", titleEn: "Import Operations Begin", titleRu: "Начало импортных операций", descTr: "Bosphorus Gaz, Doğal Gaz ithalat ve toptan satış faaliyetine başladı.", descEn: "Bosphorus Gaz commenced natural gas import and wholesale operations.", descRu: "Bosphorus Gaz начала деятельность по импорту и оптовой продаже природного газа." },
  { date: "31.12.2011", titleTr: "Pazar Payı", titleEn: "Market Share", titleRu: "Доля рынка", descTr: "737,3 milyon Sm³ gaz ithalatı ile ülkemiz ithalatında %1.7'lik pay sahibi oldu.", descEn: "Achieved a 1.7% share of Turkey's imports with 737.3 million Sm³ of gas imports.", descRu: "С импортом газа в объёме 737,3 млн нм³ компания заняла 1,7% доли в импорте страны." },
  { date: "23.12.2011", titleTr: "Kazakistan Kontratı", titleEn: "Kazakhstan Contract", titleRu: "Контракт с Казахстаном", descTr: "Kazakistan'dan yıllık 750 milyon metreküp gaz ithalatı yapmak üzere kontrat imzalandı.", descEn: "A contract was signed to import 750 million cubic meters of gas per year from Kazakhstan.", descRu: "Был подписан контракт на импорт 750 млн кубометров газа в год из Казахстана." },
  { date: "05.06.2012", titleTr: "Hisse Devri", titleEn: "Share Transfer", titleRu: "Передача акций", descTr: "TUR Enerji yüzde 20 oranında hisselerini Gazprom Germania'ya devretti.", descEn: "TUR Enerji transferred 20% of its shares to Gazprom Germania.", descRu: "TUR Enerji передала 20% своих акций компании Gazprom Germania." },
  { date: "31.07.2012", titleTr: "Hisse Devri", titleEn: "Share Transfer", titleRu: "Передача акций", descTr: "TUR Enerji yüzde 11 oranında hisselerini Gazprom Germania'ya devretti. Hisse dağılımı %71 Gazprom Germania, %29 Tur Enerji oldu.", descEn: "TUR Enerji transferred 11% of its shares to Gazprom Germania. Share distribution became 71% Gazprom Germania, 29% Tur Enerji.", descRu: "TUR Enerji передала 11% своих акций компании Gazprom Germania. Распределение акций составило 71% Gazprom Germania и 29% Tur Enerji." },
  { date: "09.08.2012", titleTr: "Yeni Kontrat", titleEn: "New Contract", titleRu: "Новый контракт", descTr: "Gazprom Export ile Batı Hattından yılda 1 milyar 750 milyon metreküp doğal gaz ithalatı yapmak üzere anlaşma imzalandı.", descEn: "An agreement was signed with Gazprom Export to import 1.75 billion cubic meters of natural gas per year via the Western Pipeline.", descRu: "С «Газпром экспорт» было подписано соглашение об импорте 1,75 млрд кубометров природного газа в год по Западному коридору." },
  { date: "20.09.2012", titleTr: "Elektrik Lisansı", titleEn: "Electricity License", titleRu: "Лицензия на электроэнергию", descTr: "Elektrik Toptan Satış Lisansı alındı.", descEn: "Electricity Wholesale License was obtained.", descRu: "Была получена лицензия на оптовую продажу электроэнергии." },
  { date: "01.01.2013", titleTr: "İkinci Kontrat Aktif", titleEn: "Second Contract Active", titleRu: "Второй контракт активен", descTr: "1,75 milyar Sm³'lük ikinci ithalat kontratı ile gaz ithalat faaliyetine başlandı. Toplamda 2,5 milyar Sm³ kontrat büyüklüğüne ulaşıldı.", descEn: "Gas import operations began with the second import contract of 1.75 billion Sm³. Total contract volume reached 2.5 billion Sm³.", descRu: "Начались операции по импорту газа в рамках второго импортного контракта на 1,75 млрд нм³. Общий объём контрактов достиг 2,5 млрд нм³." },
  { date: "17.01.2013", titleTr: "Spot LNG Lisansı", titleEn: "Spot LNG License", titleRu: "Лицензия на спотовый СПГ", descTr: "10 yıl süre ile geçerli Spot LNG Lisansı alındı.", descEn: "A Spot LNG License valid for 10 years was obtained.", descRu: "Была получена лицензия на спотовый СПГ сроком на 10 лет." },
  { date: "31.12.2014", titleTr: "Rekor İthalat", titleEn: "Record Imports", titleRu: "Рекордный импорт", descTr: "2.748,13 milyon Sm³ doğalgaz ithalatı ile ülkemiz ithalatında %5,58 pay sahibi oldu.", descEn: "Achieved a 5.58% share of Turkey's imports with 2,748.13 million Sm³ of natural gas imports.", descRu: "С импортом природного газа в объёме 2 748,13 млн нм³ компания заняла 5,58% доли в импорте страны." },
  { date: "01.09.2020", titleTr: "Spot İthalat", titleEn: "Spot Import", titleRu: "Спотовый импорт", descTr: "EPDK tarafından ihaleye açılan spot ithalat kapasitesinden kapasite alarak Türkiye'nin ilk spot ithalat yapan özel tedarikçisi oldu.", descEn: "Became Turkey's first private supplier to conduct spot imports by acquiring capacity from EMRA's spot import tender.", descRu: "Приобретя мощности на тендере по спотовому импорту, объявленном EPDK, компания стала первым в Турции частным поставщиком, осуществляющим спотовый импорт." },
  { date: "18.10.2022", titleTr: "Kontrat Uzatma", titleEn: "Contract Extension", titleRu: "Продление контракта", descTr: "Türkiye'de bir ilk gerçekleştirerek 2021 yılında biten doğalgaz kontratını Gazprom ile 2043 yılına kadar uzattı. Yıllık 2,5 milyar metreküp ile Türkiye'nin en büyük özel doğalgaz ithalatçısı konumuna geldi.", descEn: "Achieving a first in Turkey, extended the natural gas contract that ended in 2021 with Gazprom until 2043. Became Turkey's largest private natural gas importer with 2.5 billion cubic meters per year.", descRu: "Совершив первое в Турции событие подобного рода, компания продлила с «Газпромом» истёкший в 2021 году газовый контракт до 2043 года. С объёмом 2,5 млрд кубометров в год она стала крупнейшим частным импортёром природного газа в Турции." },
  { date: "24.11.2022", titleTr: "Spot İthalat Lisansı", titleEn: "Spot Import License", titleRu: "Лицензия на спотовый импорт", descTr: "Spot LNG Lisansı spot boru gazı ithalatına da izin verecek şekilde Spot İthalat Lisansı olarak güncellendi. Lisans 30 yıl süreyle geçerlidir.", descEn: "The Spot LNG License was updated to a Spot Import License to also allow spot pipeline gas imports. The license is valid for 30 years.", descRu: "Лицензия на спотовый СПГ была обновлена до лицензии на спотовый импорт, разрешающей также спотовый импорт трубопроводного газа. Лицензия действует в течение 30 лет." },
  { date: "07.09.2023", titleTr: "İhracat Lisansı", titleEn: "Export License", titleRu: "Лицензия на экспорт", descTr: "30 yıl süre ile geçerli Doğal Gaz İhracat Lisansı alındı.", descEn: "A Natural Gas Export License valid for 30 years was obtained.", descRu: "Была получена лицензия на экспорт природного газа сроком на 30 лет." },
];

const managementTeam = [
  {
    name: "Ali Şen",
    titleTr: "Onursal Başkan",
    titleEn: "Honorary Chairman",
    titleRu: "Почётный председатель",
    photo: "/manus-storage/ali-sen_b44dfa1c.png",
  },
  {
    name: "Adnan Şen",
    titleTr: "Yönetim Kurulu Başkanı",
    titleEn: "Chairman of the Board",
    titleRu: "Председатель совета директоров",
    photo: "/manus-storage/adnan-sen_d5b83069.png",
  },
  {
    name: "Mert Göksu",
    titleTr: "Yönetim Kurulu Başkan Yardımcısı",
    titleEn: "Vice Chairman of the Board",
    titleRu: "Заместитель председателя совета директоров",
    photo: "/manus-storage/mert-goksu_d4fe1f7a.png",
  },
  {
    name: "Can Şen",
    titleTr: "Yönetim Kurulu Üyesi",
    titleEn: "Board Member",
    titleRu: "Член совета директоров",
    photo: "/manus-storage/can-sen_00b3f64a.png",
  },
  {
    name: "Hakan Tanık",
    titleTr: "Yönetim Kurulu Üyesi",
    titleEn: "Board Member",
    titleRu: "Член совета директоров",
    photo: "/manus-storage/hakan-tanik_401b39d2.png",
  },
  {
    name: "Ufuk Ermiş",
    titleTr: "Yönetim Kurulu Üyesi",
    titleEn: "Board Member",
    titleRu: "Член совета директоров",
    photo: null,
  },
  {
    name: "Bilgehan Üstündağ",
    titleTr: "Genel Müdür",
    titleEn: "General Manager / CEO",
    titleRu: "Генеральный директор",
    photo: "/manus-storage/bilgehan_47d4ebd4.png",
  },
  {
    name: "Yunis Zopun",
    titleTr: "Finans Grubu Başkanı",
    titleEn: "Head of Finance",
    titleRu: "Руководитель финансовой группы",
    photo: "/manus-storage/yunis-zopun_8ecbc201.png",
  },
];

export default function Company() {
  const { t, lang } = useLanguage();

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2563eb]">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663406413308/YsuVUT62bVL4iGDytG28i2/about-corporate-fjzD2yPeTcmgeM3mtopuDP.webp"
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
              {t("Şirketimiz", "Our Company", "О компании")}
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {t("Profil", "Profile", "Профиль")}
            </h1>
            <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
              {t(
                "İstanbul'da 7 Nisan 2003 tarihinde kurulan Bosphorus Gaz Corporation A.Ş., Türkiye doğal gaz piyasasının serbestleşme ve liberalleşme sürecinde güçlü ve güvenilir bir kurumsal yapı olarak sektörde yerini almıştır.",
                "Founded on April 7, 2003 in Istanbul, Bosphorus Gaz Corporation A.Ş. has established itself as a strong and reliable corporate entity during Turkey's natural gas market liberalization process.",
                "Основанная 7 апреля 2003 года в Стамбуле, компания Bosphorus Gaz Corporation A.Ş. заняла своё место в отрасли как сильная и надёжная корпоративная структура в процессе либерализации и открытия рынка природного газа Турции."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 border-t border-slate-100">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">{t("Şirket Profili", "Company Profile", "Профиль компании")}</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  {t(
                    "BOTAŞ'ın alıcı olarak taraf bulunduğu Doğal Gaz Alım ve Satım Sözleşmelerinin üçüncü taraflara devrine ilişkin olarak Kasım 2004'te ilan edilen ihaleye katılınmış ve 2009'da yıllık 750 Milyon metreküp Doğal Gazın ithalat ve toptan satışına başlamıştır.",
                    "The company participated in the tender announced in November 2004 for the transfer of Natural Gas Purchase and Sale Agreements where BOTAŞ was the buyer, and commenced the import and wholesale of 750 million cubic meters of natural gas per year in 2009.",
                    "Компания приняла участие в объявленном в ноябре 2004 года тендере на передачу третьим сторонам договоров купли-продажи природного газа, в которых BOTAŞ выступала покупателем, и в 2009 году начала импорт и оптовую продажу 750 млн кубометров природного газа в год."
                  )}
                </p>
                <p>
                  {t(
                    "Türkiye'deki gaz piyasasının liberalleşmesindeki en önemli adımlardan biri olan kontrat devir ihalesiyle Bosphorus Gaz Corporation Türkiye'ye Doğal Gaz ithal eden ilk özel şirketlerden biri olmuştur.",
                    "Through the contract transfer tender, one of the most important steps in the liberalization of Turkey's gas market, Bosphorus Gaz Corporation became one of the first private companies to import natural gas into Turkey.",
                    "Благодаря тендеру на передачу контрактов — одному из важнейших шагов в либерализации газового рынка Турции — Bosphorus Gaz Corporation стала одной из первых частных компаний, импортирующих природный газ в Турцию."
                  )}
                </p>
                <p>
                  {t(
                    "Bosphorus Gaz 2012 yılında BOTAŞ'ın yıllık 6 milyar m³'lük sözleşmesinin sona ermesini takiben Gazprom Export ile yıllık 1 milyar 750 milyon m³'lük sözleşme imzalamıştır.",
                    "In 2012, following the expiration of BOTAŞ's 6 billion m³/year contract, Bosphorus Gaz signed a 1.75 billion m³/year contract with Gazprom Export.",
                    "В 2012 году, после истечения контракта BOTAŞ на 6 млрд м³ в год, Bosphorus Gaz подписала с «Газпром экспорт» контракт на 1,75 млрд м³ в год."
                  )}
                </p>
                <p>
                  {t(
                    "Böylece 3 yıl gibi kısa bir süre içinde toplamda yıllık 2 milyar 500 milyon m³'lük ithalat miktarı ile ülkemiz ithalatının yaklaşık yüzde 5'ini gerçekleştirir hale gelerek BOTAŞ'tan sonra en yüksek ithalat yapan özel şirket olmuştur.",
                    "Thus, within just 3 years, with a total annual import volume of 2.5 billion m³, accounting for approximately 5% of Turkey's imports, it became the private company with the highest import volume after BOTAŞ.",
                    "Таким образом, всего за 3 года с общим годовым объёмом импорта 2,5 млрд м³, что составляет около 5% импорта страны, она стала частной компанией с наибольшим объёмом импорта после BOTAŞ."
                  )}
                </p>
                <p>
                  {t(
                    "Bosphorus Gaz, Türkiye'de bir ilki daha gerçekleştirerek ülkemizin 2021 yılında biten ilk ve tek doğalgaz kontratını Gazprom ile anlaşarak 2043 yılına kadar uzatmış ve aynı tarihe kadar lisans alma hakkı elde etmiştir.",
                    "Achieving another first in Turkey, Bosphorus Gaz extended the country's first and only natural gas contract that ended in 2021 with Gazprom until 2043, also securing the right to obtain a license until the same date.",
                    "Совершив ещё одно первое в Турции событие, Bosphorus Gaz по соглашению с «Газпромом» продлила первый и единственный газовый контракт страны, истёкший в 2021 году, до 2043 года, а также получила право на получение лицензии до той же даты."
                  )}
                </p>
                <p className="font-medium text-[#1e3a5f]">
                  {t(
                    "Bosphorus Gaz, bu anlaşmayla yıllık 2,5 milyar metreküp ile Türkiye'nin en büyük özel Doğal Gaz ithalatçısı konumundadır.",
                    "With this agreement, Bosphorus Gaz is Turkey's largest private natural gas importer with 2.5 billion cubic meters per year.",
                    "Благодаря этому соглашению Bosphorus Gaz с объёмом 2,5 млрд кубометров в год является крупнейшим частным импортёром природного газа в Турции."
                  )}
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663406413308/YsuVUT62bVL4iGDytG28i2/gas-infrastructure-jDW9xBeX6fE33JibpWNjXK.webp"
                alt={t("Doğal gaz altyapısı", "Natural gas infrastructure", "Инфраструктура природного газа")}
                className="rounded-xl w-full h-auto object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vizyon" className="py-20 border-t border-slate-100 bg-slate-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm"
            >
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">{t("Vizyonumuz", "Our Vision", "Наше видение")}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t(
                  "Türkiye'nin enerji güvenliğine katkıda bulunan, sürdürülebilir ve güvenilir doğal gaz tedarikinde lider özel sektör kuruluşu olmak.",
                  "To be the leading private sector organization in sustainable and reliable natural gas supply, contributing to Turkey's energy security.",
                  "Быть ведущей организацией частного сектора в области устойчивого и надёжного снабжения природным газом, вносящей вклад в энергетическую безопасность Турции."
                )}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm"
            >
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">{t("Misyonumuz", "Our Mission", "Наша миссия")}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t(
                  "Rekabetçi fiyatlarla, kesintisiz ve güvenilir doğal gaz tedariki sağlayarak Türkiye sanayisinin ve ekonomisinin büyümesine destek olmak.",
                  "To support the growth of Turkey's industry and economy by providing uninterrupted and reliable natural gas supply at competitive prices.",
                  "Поддерживать рост промышленности и экономики Турции, обеспечивая бесперебойное и надёжное снабжение природным газом по конкурентным ценам."
                )}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shareholders */}
      <section className="py-20 border-t border-slate-100">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-8">
            {t("Ortaklık Yapısı", "Ownership Structure", "Структура собственности")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <span className="text-[#1d4ed8] font-bold text-lg">AŞ</span>
                </div>
                <div>
                  <h3 className="text-[#1e3a5f] font-semibold text-lg">Adnan Şen</h3>
                  <p className="text-slate-400 text-sm">%90,1*</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <span className="text-[#1d4ed8] font-bold text-lg">MG</span>
                </div>
                <div>
                  <h3 className="text-[#1e3a5f] font-semibold text-lg">Mert Göksu</h3>
                  <p className="text-slate-400 text-sm">%9,9</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-4">
            {t("* Doğrudan ve dolaylı paylar dahil.", "* Including direct and indirect shares.", "* Включая прямые и косвенные доли.")}
          </p>
          <p className="text-slate-500 text-sm mt-4 max-w-2xl leading-relaxed">
            {t(
              "Eylül 2018 itibarıyla Gazprom hisseleri Şen Grup'a devredilmiştir. Bosphorus Gaz'ın Gazprom ile stratejik işbirliği tedarikçi ve güvenilir ortak olarak devam etmektedir.",
              "As of September 2018, Gazprom shares were transferred to Şen Group. Bosphorus Gaz's strategic cooperation with Gazprom continues as a supplier and reliable partner.",
              "По состоянию на сентябрь 2018 года акции Gazprom были переданы группе Şen. Стратегическое сотрудничество Bosphorus Gaz с «Газпромом» продолжается как с поставщиком и надёжным партнёром."
            )}
          </p>
        </div>
      </section>

      {/* Management Team */}
      <section className="py-20 border-t border-slate-100 bg-slate-50">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">
            {t("Yönetim", "Management", "Руководство")}
          </h2>
          <p className="text-slate-500 mb-10 max-w-xl">
            {t("Bosphorus Gaz Corporation yönetim kadrosu.", "Bosphorus Gaz Corporation management team.", "Руководящий состав Bosphorus Gaz Corporation.")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {managementTeam.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white border border-slate-100 rounded-xl p-6 text-center hover:shadow-md hover:border-blue-100 transition-all duration-300"
              >
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-24 h-24 mx-auto mb-4 rounded-full object-cover object-top border-2 border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
                <h4 className="text-[#1e3a5f] font-semibold text-sm mb-1">{member.name}</h4>
                <p className="text-[#1d4ed8] text-xs font-medium">
                  {lang === "en" ? member.titleEn : lang === "ru" ? member.titleRu : member.titleTr}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="tarihce" className="py-20 border-t border-slate-100">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-12">
            {t("Tarihçe", "History", "История")}
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2" />

            <div className="space-y-8">
              {timelineEvents.map((event, i) => (
                <motion.div
                  key={event.date + i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className={`relative flex items-start gap-6 ${
                    i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 lg:left-1/2 w-3 h-3 rounded-full bg-[#1d4ed8] border-2 border-white -translate-x-1/2 mt-1.5 z-10 shadow-sm" />

                  {/* Content */}
                  <div className={`ml-10 lg:ml-0 lg:w-1/2 ${i % 2 === 0 ? "lg:pr-12 lg:text-right" : "lg:pl-12"}`}>
                    <span className="text-[#1d4ed8] font-bold text-sm">{event.date}</span>
                    <h4 className="text-[#1e3a5f] font-semibold mt-1">
                      {lang === "en" ? event.titleEn : lang === "ru" ? event.titleRu : event.titleTr}
                    </h4>
                    <p className="text-slate-500 text-sm mt-1">
                      {lang === "en" ? event.descEn : lang === "ru" ? event.descRu : event.descTr}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Disclosures */}
      <section id="bilgi-toplumu" className="py-16 border-t border-slate-100">
        <div className="container">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">
            {t("Bilgi Toplumu Hizmetleri", "Information Society Services", "Услуги информационного общества")}
          </h2>
          <div className="text-slate-500 text-sm space-y-2 max-w-2xl">
            <p><strong className="text-slate-700">{t("Ticaret Unvanı:", "Trade Name:", "Фирменное наименование:")}</strong> Bosphorus Gaz Corporation A.Ş.</p>
            <p><strong className="text-slate-700">{t("Merkez Adresi:", "Headquarters:", "Юридический адрес:")}</strong> Seba Center, Darüşşafaka Cad. No:45, Sarıyer, İstanbul</p>
            <p><strong className="text-slate-700">{t("Ticaret Sicil No:", "Trade Registry No:", "Номер торгового реестра:")}</strong> {t("İstanbul Ticaret Sicili", "Istanbul Trade Registry", "Стамбульский торговый реестр")}</p>
            <p><strong className="text-slate-700">{t("MERSIS No:", "MERSIS No:", "Номер MERSIS:")}</strong> —</p>
            <p><strong className="text-slate-700">{t("KEP Adresi:", "KEP Address:", "Адрес KEP:")}</strong> bosphorusgaz@hs01.kep.tr</p>
          </div>
        </div>
      </section>
    </div>
  );
}

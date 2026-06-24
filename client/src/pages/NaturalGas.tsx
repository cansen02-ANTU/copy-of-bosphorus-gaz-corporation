import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/* Design: Light theme — White bg, blue accents, clean forms. */

const faqItems = [
  {
    qTr: "Serbest Tüketici miyim?",
    qEn: "Am I an Eligible Consumer?",
    qRu: "Являюсь ли я квалифицированным потребителем?",
    aTr: "Evsel tüketiciler hariç olmak üzere, tüm tüketiciler serbest tüketici statüsündedir. Evsel tüketiciler için serbest tüketici olma sınırı 75.000 m³'tür. Serbest tüketici limiti için tek sayaçtan ölçülen tüketim miktarı dikkate alınır.",
    aEn: "All consumers, except residential consumers, have eligible consumer status. The threshold for residential consumers to become eligible consumers is 75,000 m³. The consumption amount measured from a single meter is considered for the eligible consumer limit.",
    aRu: "Все потребители, кроме бытовых, имеют статус квалифицированного потребителя. Порог для перехода бытовых потребителей в категорию квалифицированных составляет 75 000 м³. Для лимита квалифицированного потребителя учитывается объём потребления, измеренный одним счётчиком."
  },
  {
    qTr: "Serbest Tüketiciyim, Tedarikçimi nasıl seçebilirim?",
    qEn: "I am an Eligible Consumer, how can I choose my supplier?",
    qRu: "Я квалифицированный потребитель, как мне выбрать поставщика?",
    aTr: "Öncelikle bağlı olduğunuz dağıtım şirketine yazılı başvuruda bulunarak, mevcut sayaçların dağıtım şirketinin talebi halinde, yine dağıtım şirketinin belirlediği usul ve esaslar çerçevesinde, bedeli serbest tüketiciye ait olmak üzere, sayaçlarını anlık bilgi akışı sağlayacak şekilde ve dağıtım şirketinin istediği uzaktan okuma sistemine uygun hale getirmesi gerekmektedir. Bununla birlikte 300 mbar ve üzeri doğalgaz kullanan serbest tüketicilerin korrektör tesis etmesi de zorunludur. Bu zorunlulukları yerine getirdikten sonra artık kendi tedarikçinizi kendiniz seçebilirsiniz. Piyasada faaliyet gösteren ithalatçı ve/veya toptan satıcılarla irtibata geçerek kendinize en uygununu seçip, doğalgazınızı bu şirketlerden alabilirsiniz.",
    aEn: "First, you must apply in writing to your distribution company to upgrade your meters to provide real-time data flow and comply with the remote reading system required by the distribution company, at the eligible consumer's expense. Additionally, eligible consumers using natural gas at 300 mbar or above are required to install a corrector. After fulfilling these requirements, you can choose your own supplier. You can contact importers and/or wholesalers operating in the market, select the most suitable one, and purchase your natural gas from these companies.",
    aRu: "Сначала необходимо подать письменное заявление в вашу газораспределительную компанию и, по её требованию и в соответствии с установленными ею правилами, за счёт квалифицированного потребителя привести счётчики в соответствие с системой дистанционного считывания, обеспечивающей передачу данных в реальном времени. Кроме того, квалифицированные потребители, использующие природный газ под давлением 300 мбар и выше, обязаны установить корректор. После выполнения этих требований вы можете самостоятельно выбрать поставщика. Вы можете связаться с импортёрами и/или оптовыми продавцами, работающими на рынке, выбрать наиболее подходящего и приобретать природный газ у этих компаний."
  },
  {
    qTr: "Tedarikçi seçiminin serbest tüketicilere faydaları nelerdir?",
    qEn: "What are the benefits of supplier selection for eligible consumers?",
    qRu: "Каковы преимущества выбора поставщика для квалифицированных потребителей?",
    aTr: "Pazarlık gücünüz olur. Daha esnek fiyatlarla doğalgazını temin etme şansını elde edersiniz. Uzun dönem kontratlar yaparak kendi arz güvenliğinizi garanti altına alırsınız.",
    aEn: "You gain bargaining power. You have the opportunity to procure natural gas at more flexible prices. You can secure your own supply security by entering into long-term contracts.",
    aRu: "Вы получаете переговорную силу. У вас появляется возможность закупать природный газ по более гибким ценам. Заключая долгосрочные контракты, вы гарантируете собственную безопасность поставок."
  },
  {
    qTr: "Serbest tüketici olduktan sonra yerine getirilmesi gerekenler nelerdir?",
    qEn: "What are the requirements after becoming an eligible consumer?",
    qRu: "Какие требования необходимо выполнять после получения статуса квалифицированного потребителя?",
    aTr: "Serbest tüketiciler, 4646 sayılı doğalgaz piyasası kanununa dayanan mevzuat olan, İletim Şebekesi İşleyiş Düzenlemelerine İlişkin Esaslar (ŞİD)'a bağlı olarak, günlük programlarını gün öncesinden doğalgazı tedarik ettiği şirkete bildirmek zorundadır. Bu şartların hepsine uyan serbest tüketiciler müşteri bilgi formunu doldurarak bizimle iletişime geçebilirler.",
    aEn: "Eligible consumers are required to submit their daily programs to their gas supplier one day in advance, in accordance with the Transmission Network Operation Regulations (ŞİD) based on Natural Gas Market Law No. 4646. Eligible consumers who meet all these conditions can contact us by filling out the customer information form.",
    aRu: "Квалифицированные потребители обязаны предоставлять свои суточные графики поставщику газа за день, в соответствии с Правилами эксплуатации передающей сети (ŞİD), основанными на Законе о рынке природного газа № 4646. Квалифицированные потребители, соответствующие всем этим условиям, могут связаться с нами, заполнив форму информации о клиенте."
  }
];

const monthsTr = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthsRu = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

export default function NaturalGas() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { t, lang } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const months = lang === "en" ? monthsEn : lang === "ru" ? monthsRu : monthsTr;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2563eb]">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663406413308/YsuVUT62bVL4iGDytG28i2/energy-abstract-EGyNLHrshnTX2Jre4jsphx.webp"
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
              {t("Doğal Gaz", "Natural Gas", "Природный газ")}
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {t("Faaliyetlerimiz", "Our Activities", "Наша деятельность")}
            </h1>
            <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
              {t(
                "Bosphorus Gaz, uzun dönemli boru hattı ve spot ithalat lisansları ile Türkiye'nin doğal gaz ihtiyacını karşılamaktadır.",
                "Bosphorus Gaz meets Turkey's natural gas needs through long-term pipeline and spot import licenses.",
                "Bosphorus Gaz удовлетворяет потребности Турции в природном газе благодаря долгосрочным трубопроводным и спотовым импортным лицензиям."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Activities Overview */}
      <section className="py-20 border-t border-slate-100">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">{t("İthalat & Toptan Satış", "Import & Wholesale", "Импорт и оптовая продажа")}</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  {t(
                    "Bosphorus Gaz, boru hattı ve Spot LNG ithalat lisansları ile Türkiye'nin doğal gaz ihtiyacını karşılamaktadır.",
                    "Bosphorus Gaz meets Turkey's natural gas needs through pipeline and Spot LNG import licenses.",
                    "Bosphorus Gaz удовлетворяет потребности Турции в природном газе благодаря трубопроводным и спотовым импортным лицензиям на СПГ."
                  )}
                </p>
                <p>
                  {t(
                    "Bosphorus Gaz, sanayi kuruluşları, rafineriler, doğal gazdan elektrik üreten santraller ve diğer yüksek tüketimli sektörler başta olmak üzere serbest tüketici statüsündeki müşterilerine doğal gaz tedarik etmektedir. Güçlü ticaret ve tedarik altyapısı, esnek sözleşme modelleri ve rekabetçi fiyatlandırma yaklaşımıyla müşterilerinin enerji ihtiyaçlarına güvenilir çözümler sunmaktadır.",
                    "Bosphorus Gaz supplies natural gas to its eligible consumer customers, primarily industrial enterprises, refineries, natural gas power plants, and other high-consumption sectors. With its strong trade and supply infrastructure, flexible contract models, and competitive pricing approach, it provides reliable solutions for its customers' energy needs.",
                    "Bosphorus Gaz поставляет природный газ своим клиентам со статусом квалифицированного потребителя, прежде всего промышленным предприятиям, нефтеперерабатывающим заводам, газовым электростанциям и другим отраслям с высоким потреблением. Благодаря мощной торговой и снабженческой инфраструктуре, гибким договорным моделям и конкурентному ценообразованию компания предлагает надёжные решения для энергетических потребностей своих клиентов."
                  )}
                </p>
                <p>
                  {t(
                    "Doğal gaz piyasasındaki uzun yıllara dayanan deneyimi, yıllık 2,5 milyar m³'ü aşan satış hacmi ve güçlü müşteri portföyüyle Bosphorus Gaz, Türkiye enerji sektörünün önemli oyuncularından biridir. Şirket, sahip olduğu doğal gaz ithalat lisansı ve depolama imkânlarıyla arz güvenliğini desteklerken, müşterilerine kesintisiz hizmet anlayışı ve etkin risk yönetimi sunmaktadır. Ayrıca ihracat lisansımız ile birlikte Avrupa piyasalarında ticaret hedeflenmektedir.",
                    "With years of experience in the natural gas market, annual sales volume exceeding 2.5 billion m³, and a strong customer portfolio, Bosphorus Gaz is one of the key players in Turkey's energy sector. The company supports supply security with its natural gas import license and storage facilities, while offering uninterrupted service and effective risk management to its customers. Additionally, with our export license, we target trading in European markets.",
                    "Благодаря многолетнему опыту на рынке природного газа, годовому объёму продаж свыше 2,5 млрд м³ и сильному портфелю клиентов Bosphorus Gaz является одним из ключевых игроков энергетического сектора Турции. Компания поддерживает безопасность поставок благодаря лицензии на импорт природного газа и хранилищам, одновременно предлагая клиентам бесперебойное обслуживание и эффективное управление рисками. Кроме того, благодаря нашей экспортной лицензии мы нацелены на торговлю на европейских рынках."
                  )}
                </p>
                <p>
                  {t(
                    "Türkiye doğal gaz piyasasının liberalleşme sürecinde edindiği bilgi birikimi ve uzmanlığıyla Bosphorus Gaz, müşterileriyle uzun vadeli ve sürdürülebilir iş birlikleri kurarak büyümesini sürdürmektedir.",
                    "With the knowledge and expertise gained during Turkey's natural gas market liberalization process, Bosphorus Gaz continues its growth by establishing long-term and sustainable partnerships with its customers.",
                    "Благодаря знаниям и опыту, накопленным в процессе либерализации рынка природного газа Турции, Bosphorus Gaz продолжает расти, устанавливая долгосрочные и устойчивые партнёрские отношения со своими клиентами."
                  )}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-8">
              <h3 className="text-lg font-semibold text-[#1e3a5f] mb-6">{t("Türkiye Doğal Gaz Tüketimi", "Turkey's Natural Gas Consumption", "Потребление природного газа в Турции")}</h3>
              <div className="space-y-4">
                {[
                  { year: "1990", value: 1, width: "2%" },
                  { year: "2000", value: 15, width: "28%" },
                  { year: "2005", value: 27, width: "50%" },
                  { year: "2010", value: 38, width: "70%" },
                  { year: "2015", value: 48, width: "89%" },
                  { year: "2020", value: 48, width: "89%" },
                  { year: "2024", value: 54, width: "100%" },
                ].map((item) => (
                  <div key={item.year} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-10 shrink-0">{item.year}</span>
                    <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] rounded"
                        initial={{ width: 0 }}
                        whileInView={{ width: item.width }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-14 shrink-0 text-right">{item.value} bcm</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section id="piyasa" className="scroll-mt-24 py-20 border-t border-slate-100 bg-slate-50">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-8">{t("Piyasa Görünümü", "Market Overview", "Обзор рынка")}</h2>
          <div className="max-w-4xl space-y-4 text-slate-600 leading-relaxed">
            <p>
              {t(
                "Temiz, verimli ve ucuz enerji kaynağı olan doğal gaz kullanımı 1987 yılında başlayan ithalat faaliyetleri ile ülkemizde yaygınlaşmıştır. Başlangıçta BOTAŞ tarafından yürütülen ithalat, satış ve taşıma faaliyetleri 2 Mayıs 2001 tarih ve 24390 Sayılı Resmi Gazete'de yayımlanarak yürürlüğe giren Doğal Gaz Piyasası Kanunu ile liberalleşme sürecine girmiştir.",
                "The use of natural gas, a clean, efficient, and affordable energy source, became widespread in Turkey with import activities that began in 1987. Import, sales, and transportation activities initially conducted by BOTAŞ entered the liberalization process with the Natural Gas Market Law published in the Official Gazette No. 24390 dated May 2, 2001.",
                "Использование природного газа — чистого, эффективного и дешёвого источника энергии — получило широкое распространение в Турции благодаря импортной деятельности, начавшейся в 1987 году. Импорт, продажа и транспортировка, первоначально осуществлявшиеся BOTAŞ, вступили в процесс либерализации с принятием Закона о рынке природного газа, опубликованного в Официальной газете № 24390 от 2 мая 2001 года."
              )}
            </p>
            <p>
              {t(
                "Dağıtım kanalında özelleştirme hızla ilerlemiş ayrıca özel sektör eliyle yeni dağıtım bölgeleri oluşturularak ülke nüfusumuzun büyük çoğunluğuna gaz ulaştırılmıştır. Doğal Gaz ithalatının özelleştirilmesine ilişkin ilk adım 2005 yılı sonlarında yapılan ithalat kontratı devri ihalesiyle atılmıştır. İhale sonucunda Batı koridorundan 4 milyar metreküplük ithalat kontratı aralarında Bosphorus Gaz'ın da bulunduğu özel sektör şirketleri tarafından devralınmıştır.",
                "Privatization in the distribution channel progressed rapidly, and new distribution regions were established by the private sector, delivering gas to the majority of the country's population. The first step toward privatization of natural gas imports was taken with the import contract transfer tender at the end of 2005. As a result of the tender, a 4 billion cubic meter import contract from the Western corridor was taken over by private sector companies, including Bosphorus Gaz.",
                "Приватизация в сфере распределения быстро продвигалась, а частным сектором были созданы новые распределительные регионы, что позволило доставлять газ большинству населения страны. Первый шаг к приватизации импорта природного газа был сделан с проведением тендера на передачу импортного контракта в конце 2005 года. По итогам тендера импортный контракт на 4 млрд кубометров из Западного коридора был передан компаниям частного сектора, в том числе Bosphorus Gaz."
              )}
            </p>
            <p>
              {t(
                "2009 yılında etkin olarak piyasaya giren özel sektör ithalatçıları ile birlikte, özel toptan satış şirketleri de piyasada faaliyete başlamış ve 2012 yılında BOTAŞ ile birlikte 20'yi aşkın oyuncu doğal gaz toptan satış piyasasında yer almıştır. 2013 yılında başlamak üzere özel sektör tarafından yenilenen 6 milyar metreküplük kontratlar ile birlikte özel sektörün ülke ithalatındaki payı yüzde 20'nin üzerine çıkmıştır.",
                "With private sector importers actively entering the market in 2009, private wholesale companies also began operations, and by 2012, more than 20 players were present in the natural gas wholesale market alongside BOTAŞ. With 6 billion cubic meters of contracts renewed by the private sector starting in 2013, the private sector's share of the country's imports exceeded 20%.",
                "С активным выходом на рынок импортёров частного сектора в 2009 году свою деятельность начали и частные оптовые компании, и к 2012 году на оптовом рынке природного газа наряду с BOTAŞ присутствовало более 20 игроков. Благодаря контрактам на 6 млрд кубометров, обновлённым частным сектором начиная с 2013 года, доля частного сектора в импорте страны превысила 20%."
              )}
            </p>
            <p className="font-medium text-[#1e3a5f]">
              {t(
                "Bosphorus Gaz, ithalat miktarını yıllık 2,5 milyar metreküpe çıkararak özel sektör içerisindeki liderliğini pekiştirmiştir.",
                "Bosphorus Gaz has reinforced its leadership in the private sector by increasing its import volume to 2.5 billion cubic meters per year.",
                "Bosphorus Gaz укрепила своё лидерство в частном секторе, увеличив объём импорта до 2,5 млрд кубометров в год."
              )}
            </p>
            <p>
              {t(
                "Ayrıca 2009 yılında ilk özel LNG (Sıvılaştırılmış Doğal Gaz) ithalatçısı piyasada faaliyet göstermeye başlamış, LNG terminalleri 2010 yılında yürürlüğe giren KUE (Kullanım Usul ve Esasları) ile üçüncü parti erişimine açılmıştır.",
                "Additionally, the first private LNG (Liquefied Natural Gas) importer began operating in the market in 2009, and LNG terminals were opened to third-party access with the Usage Procedures and Principles (KUE) that came into effect in 2010.",
                "Кроме того, в 2009 году на рынке начал работать первый частный импортёр СПГ (сжиженного природного газа), а терминалы СПГ были открыты для доступа третьих сторон согласно Правилам и принципам использования (KUE), вступившим в силу в 2010 году."
              )}
            </p>
            <p>
              {t(
                "Mevsimsel ve günlük tüketim dengelemesinde önemli role sahip LNG terminallerinin yanında, Silivri, İstanbul'da bulunan TPAO tarafından işletilen Yer Altı Gaz Depolama Tesisi de 2012 yılında yürürlüğe giren KUE ile üçüncü taraf erişimine açılmıştır. 1 Eylül 2018'de Organize Doğal Gaz Toptan Satış Piyasası EPİAŞ bünyesinde faaliyete geçmiştir.",
                "In addition to LNG terminals, which play an important role in seasonal and daily consumption balancing, the Underground Gas Storage Facility operated by TPAO in Silivri, Istanbul was also opened to third-party access with the KUE that came into effect in 2012. On September 1, 2018, the Organized Natural Gas Wholesale Market became operational under EPİAŞ.",
                "Помимо терминалов СПГ, играющих важную роль в сезонном и суточном балансировании потребления, подземное хранилище газа, эксплуатируемое TPAO в Силиври (Стамбул), также было открыто для доступа третьих сторон согласно KUE, вступившим в силу в 2012 году. 1 сентября 2018 года под эгидой EPİAŞ начал работу Организованный оптовый рынок природного газа."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Demand Request Form */}
      <section className="py-20 border-t border-slate-100">
        <div className="container max-w-3xl">
          <h2 id="talep" className="text-2xl font-bold text-[#1e3a5f] mb-3 scroll-mt-28">{t("Doğal Gaz Bilgi Formu", "Natural Gas Information Form", "Форма информации о природном газе")}</h2>
          <p className="text-slate-500 mb-2">
            {t(
              "Bosphorus Gaz, tedarikçilerini seçebilen Serbest Tüketicilere ve Toptan Satış Şirketlerine 2009 yılından beri Doğal Gaz tedariği sağlamaktadır.",
              "Bosphorus Gaz has been supplying natural gas to Eligible Consumers and Wholesale Companies who can choose their suppliers since 2009.",
              "Bosphorus Gaz с 2009 года поставляет природный газ квалифицированным потребителям и оптовым компаниям, которые могут самостоятельно выбирать поставщиков."
            )}
          </p>
          <p className="text-slate-500 mb-8 text-sm">
            {t(
              "Doğal gaz tedarik talepleriniz için aşağıdaki formu doldurun. Ekibimiz en kısa sürede sizinle iletişime geçecektir.",
              "Fill out the form below for your natural gas supply requests. Our team will contact you as soon as possible.",
              "Заполните форму ниже для ваших запросов на поставку природного газа. Наша команда свяжется с вами в ближайшее время."
            )}
          </p>

          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <h3 className="text-[#1e3a5f] font-semibold mb-2">{t("Talebiniz Alındı", "Your Request Has Been Received", "Ваш запрос получен")}</h3>
              <p className="text-slate-500 text-sm">{t("Ekibimiz en kısa sürede sizinle iletişime geçecektir.", "Our team will contact you as soon as possible.", "Наша команда свяжется с вами в ближайшее время.")}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Info */}
              <div>
                <h3 className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">{t("Firma Bilgileri", "Company Information", "Информация о компании")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">{t("Firma Adı *", "Company Name *", "Название компании *")}</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                      placeholder={t("Firma adınız", "Your company name", "Название вашей компании")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">{t("İletişim Kişisi *", "Contact Person *", "Контактное лицо *")}</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                      placeholder={t("Ad Soyad", "Full Name", "Имя и фамилия")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">{t("E-posta *", "Email *", "Эл. почта *")}</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                      placeholder={t("ornek@firma.com", "example@company.com", "primer@company.com")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">{t("Telefon *", "Phone *", "Телефон *")}</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                      placeholder="+90 (5XX) XXX XX XX"
                    />
                  </div>
                </div>
              </div>

              {/* Facility Info */}
              <div>
                <h3 className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">{t("Gaz Talep Edilen Tesise Ait Bilgiler", "Facility Information for Gas Request", "Информация об объекте для запроса газа")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">{t("Tesis Adresi *", "Facility Address *", "Адрес объекта *")}</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                      placeholder={t("Tesis adresi", "Facility address", "Адрес объекта")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">{t("Tesis İli *", "Facility Province *", "Провинция объекта *")}</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                      placeholder={t("İl", "Province", "Провинция")}
                    />
                  </div>
                </div>
              </div>

              {/* Gas Usage */}
              <div>
                <h3 className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">{t("Tesisin Gaz Kullanımı", "Facility Gas Usage", "Потребление газа объектом")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">{t("Yıllık Tüketim *", "Annual Consumption *", "Годовое потребление *")}</label>
                    <select
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                    >
                      <option value="">{t("Seçiniz", "Select", "Выберите")}</option>
                      <option value="<1">&lt;1 Mm³</option>
                      <option value="1-10">1–10 Mm³</option>
                      <option value="10-50">10–50 Mm³</option>
                      <option value="50-100">50–100 Mm³</option>
                      <option value="100-500">100–500 Mm³</option>
                      <option value="500+">500+ Mm³</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">{t("Kullanım Amacı", "Purpose of Use", "Цель использования")}</label>
                    <select
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                    >
                      <option value="">{t("Seçiniz", "Select", "Выберите")}</option>
                      <option value="uretim">{t("Üretim / İmalat", "Production / Manufacturing", "Производство / Изготовление")}</option>
                      <option value="enerji">{t("Enerji Üretimi", "Energy Generation", "Производство энергии")}</option>
                      <option value="isitma">{t("Isıtma", "Heating", "Отопление")}</option>
                      <option value="diger">{t("Diğer", "Other", "Другое")}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Monthly Average Gas Usage */}
              <div>
                <h3 className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">{t("Tesisin Aylık Ortalama Gaz Kullanımı", "Monthly Average Gas Usage", "Среднемесячное потребление газа")}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {months.map((month) => (
                    <div key={month}>
                      <label className="block text-xs text-slate-500 mb-1">{month}</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 text-xs placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                        placeholder="m³"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Personnel Info */}
              <div>
                <h3 className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">{t("İlgili Personel Bilgisi", "Contact Personnel Information", "Информация о контактном сотруднике")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">{t("Ad Soyad", "Full Name", "Имя и фамилия")}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                      placeholder={t("İlgili personel", "Contact person", "Контактный сотрудник")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">{t("Pozisyon", "Position", "Должность")}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                      placeholder={t("Ünvan / Pozisyon", "Title / Position", "Звание / Должность")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1.5">{t("Ek Notlar", "Additional Notes", "Дополнительные примечания")}</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors resize-none"
                  placeholder={t("Ek bilgi veya özel talepleriniz...", "Additional information or special requests...", "Дополнительная информация или особые запросы...")}
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#1d4ed8] text-white font-semibold rounded-md hover:bg-[#2563eb] transition-all duration-200 active:scale-[0.97]"
              >
                {t("Talep Gönder", "Submit Request", "Отправить запрос")}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="sss" className="scroll-mt-24 py-20 border-t border-slate-100 bg-slate-50">
        <div className="container max-w-2xl">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">
            {t("Sıkça Sorulan Sorular", "Frequently Asked Questions", "Часто задаваемые вопросы")}
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            {t(
              "Bosphorus Gaz, tedarikçilerini seçebilen Serbest Tüketicilere ve Toptan Satış Şirketlerine 2009 yılından beri Doğal Gaz tedariği sağlamaktadır.",
              "Bosphorus Gaz has been supplying natural gas to Eligible Consumers and Wholesale Companies who can choose their suppliers since 2009.",
              "Bosphorus Gaz с 2009 года поставляет природный газ квалифицированным потребителям и оптовым компаниям, которые могут самостоятельно выбирать поставщиков."
            )}
          </p>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="border border-slate-100 rounded-xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-[#1e3a5f] font-medium text-sm pr-4">
                    {lang === "en" ? item.qEn : lang === "ru" ? item.qRu : item.qTr}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {lang === "en" ? item.aEn : lang === "ru" ? item.aRu : item.aTr}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

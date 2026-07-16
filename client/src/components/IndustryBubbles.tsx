import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

/* Design: Blue background section with central Bosphorus Gaz bubble connected to industry bubbles via pipelines. */

interface Industry {
  id: string;
  name: string;
  nameEn: string;
  nameRu: string;
  taglineTr: string;
  taglineEn: string;
  taglineRu: string;
  descriptionTr: string;
  descriptionEn: string;
  descriptionRu: string;
  benefitsTr: string[];
  benefitsEn: string[];
  benefitsRu: string[];
  scale: string;
}

const industries: Industry[] = [
  {
    id: "data-centers",
    name: "Veri Merkezleri",
    nameEn: "Data Centers",
    nameRu: "Центры обработки данных",
    taglineTr: "Kesintisiz Enerji, Maksimum Verimlilik",
    taglineEn: "Uninterrupted Energy, Maximum Efficiency",
    taglineRu: "Бесперебойная энергия, максимальная эффективность",
    descriptionTr: "Doğal gaz; yerinde enerji üretimi, kojenerasyon uygulamaları ve alternatif yedek güç çözümleri için güvenilir bir enerji kaynağı sunarken, veri merkezlerinin hizmet sürekliliği, veri güvenliği ve müşteri memnuniyeti konularını yönetmelerine ve operasyonel esneklik kazanmalarına yardımcı olur.",
    descriptionEn: "Natural gas provides a reliable energy source for on-site power generation, cogeneration applications, and alternative backup power solutions, helping data centers manage service continuity, data security, and customer satisfaction while gaining operational flexibility.",
    descriptionRu: "Природный газ является надёжным источником энергии для локальной генерации, когенерации и резервного энергоснабжения, помогая центрам обработки данных обеспечивать непрерывность работы, безопасность данных и удовлетворённость клиентов, получая операционную гибкость.",
    benefitsTr: [
      "Yedek ve kesintisiz güç için doğalgaz jeneratör sistemleri",
      "Kojenerasyon ile elektrik üretimi ve atık ısı geri kazanımı",
      "Rekabetçi fiyatlar ile birlikte esnek tüketim profiline uygun özel tedarik anlaşmaları"
    ],
    benefitsEn: [
      "Natural gas generator systems for backup and uninterrupted power",
      "Electricity generation and waste heat recovery through cogeneration",
      "Custom supply agreements with competitive prices suited to flexible consumption profiles"
    ],
    benefitsRu: [
      "Газовые генераторные системы для резервного и бесперебойного питания",
      "Выработка электроэнергии и рекуперация тепла благодаря когенерации",
      "Индивидуальные договоры поставки с конкурентными ценами, соответствующие гибкому профилю потребления"
    ],
    scale: "5–50 Mm³/yr"
  },
  {
    id: "manufacturing",
    name: "İmalat",
    nameEn: "Manufacturing",
    nameRu: "Производство",
    taglineTr: "Endüstriyel Isı, Esnek Kontratlar",
    taglineEn: "Industrial Heat, Flexible Contracts",
    taglineRu: "Промышленное тепло, гибкие контракты",
    descriptionTr: "Üretim bantlarından proses fırınlarına, buhar sistemlerinden ısıtma altyapısına kadar her ölçekteki sanayi tesisi için doğal gaz, esnekliği ve maliyet etkinliğiyle farklı sektörlerin farklı üretim ihtiyaçlarına kolayca uyum sağlayan en yaygın sanayi yakıtı olma özelliğini korumaktadır.",
    descriptionEn: "From production lines to process furnaces, steam systems to heating infrastructure, natural gas remains the most common industrial fuel for manufacturing facilities of all sizes, easily adapting to different production needs across various sectors with its flexibility and cost-effectiveness.",
    descriptionRu: "От производственных линий до технологических печей, от паровых систем до инфраструктуры отопления природный газ остаётся самым распространённым промышленным топливом для предприятий любого масштаба, легко адаптируясь к различным производственным потребностям благодаря своей гибкости и экономичности.",
    benefitsTr: [
      "Her ölçek ve sektördeki sanayi tesisi için esnek hacim ve sözleşme yapıları",
      "Üretim sürekliliğini destekleyen güçlü arz ve portföy yönetimi",
      "Alternatif yakıtlara kıyasla daha düşük karbon ayak izi ve artan çevre mevzuatına uyum kolaylığı"
    ],
    benefitsEn: [
      "Flexible volume and contract structures for industrial facilities of all sizes and sectors",
      "Strong supply and portfolio management supporting production continuity",
      "Lower carbon footprint compared to alternative fuels and easier compliance with increasing environmental regulations"
    ],
    benefitsRu: [
      "Гибкие объёмы и структуры договоров для предприятий любого масштаба и отрасли",
      "Надёжные поставки и управление портфелем, поддерживающие непрерывность производства",
      "Меньший углеродный след по сравнению с альтернативным топливом и простота соблюдения ужесточающихся экологических норм"
    ],
    scale: "100–300 Mm³/yr"
  },
  {
    id: "power-generation",
    name: "Enerji Üretimi",
    nameEn: "Power Generation",
    nameRu: "Энергогенерация",
    taglineTr: "Yüksek Verimlilik, Hızlı Yanıt",
    taglineEn: "High Efficiency, Rapid Response",
    taglineRu: "Высокая эффективность, быстрый отклик",
    descriptionTr: "Kesintisiz ve yüksek hacimli yakıt tedariki, doğal gaz santrallerinde üretim performansını ve kârlılığı doğrudan etkiler. Esnek teslimat yapıları ve farklı fiyatlama modelleriyle spot piyasa risklerini minimize ederek üreticilerin ihtiyaçlarına uygun çözümler sunuyoruz.",
    descriptionEn: "Uninterrupted and high-volume fuel supply directly affects production performance and profitability in natural gas power plants. We offer solutions tailored to producers' needs by minimizing spot market risks through flexible delivery structures and various pricing models.",
    descriptionRu: "Бесперебойные и крупнообъёмные поставки топлива напрямую влияют на производительность и рентабельность газовых электростанций. Мы предлагаем решения, адаптированные под потребности производителей, минимизируя риски спотового рынка за счёт гибких схем поставок и различных моделей ценообразования.",
    benefitsTr: [
      "Yüksek hacimli ve kesintisiz baz yük tedariki",
      "Spot fiyat dalgalanmalarına karşı uzun vadeli sözleşme güvencesi",
      "Dengeleme piyasasına erişim ile farklı kaynaklardan esnek teslimat garantisi"
    ],
    benefitsEn: [
      "High-volume and uninterrupted base load supply",
      "Long-term contract security against spot price fluctuations",
      "Flexible delivery guarantee from various sources with access to the balancing market"
    ],
    benefitsRu: [
      "Крупнообъёмные и бесперебойные базовые поставки",
      "Гарантии долгосрочных контрактов против колебаний спотовых цен",
      "Гибкая гарантия поставок из различных источников с доступом к балансирующему рынку"
    ],
    scale: "200 Mm³–1,500 Mm³/yr"
  },
  {
    id: "petrochemicals",
    name: "Petrokimya",
    nameEn: "Petrochemicals",
    nameRu: "Нефтехимия",
    taglineTr: "Çift Kullanım: Hammadde + Yakıt",
    taglineEn: "Dual Use: Feedstock + Fuel",
    taglineRu: "Двойное применение: сырьё + топливо",
    descriptionTr: "Doğal gaz; her aşamada hem operasyonel sürekliliği hem de fuel-oil ve kömüre kıyasla daha düşük karbon ayak izini mümkün kılar. Kesintisiz tedarik ve öngörülebilir maliyet yapısıyla operasyonların güvenilir bir şekilde sürdürülebilirliği için kritik öneme sahiptir.",
    descriptionEn: "Natural gas enables both operational continuity and a lower carbon footprint compared to fuel oil and coal at every stage. With uninterrupted supply and predictable cost structures, it is critical for the reliable sustainability of operations.",
    descriptionRu: "Природный газ обеспечивает как операционную непрерывность, так и меньший углеродный след по сравнению с мазутом и углём на каждом этапе. Благодаря бесперебойным поставкам и предсказуемой структуре затрат он имеет критическое значение для надёжной устойчивости операций.",
    benefitsTr: [
      "Yüksek enerji yoğunluklu prosesler için güvenilir doğal gaz arzı",
      "Üretim planlamasını kolaylaştıran öngörülebilir maliyet yapıları",
      "Operasyonel sürekliliği destekleyen uzun vadeli tedarik çözümleri"
    ],
    benefitsEn: [
      "Reliable natural gas supply for high energy-intensive processes",
      "Predictable cost structures that facilitate production planning",
      "Long-term supply solutions supporting operational continuity"
    ],
    benefitsRu: [
      "Надёжные поставки природного газа для энергоёмких процессов",
      "Предсказуемые структуры затрат, облегчающие планирование производства",
      "Долгосрочные решения по поставкам, поддерживающие операционную непрерывность"
    ],
    scale: "100–1,300 Mm³/yr"
  },
  {
    id: "ceramics-glass",
    name: "Seramik & Cam",
    nameEn: "Ceramics & Glass",
    nameRu: "Керамика и стекло",
    taglineTr: "Hassas Sıcaklık Kontrolü",
    taglineEn: "Precise Temperature Control",
    taglineRu: "Точный контроль температуры",
    descriptionTr: "Seramik ve cam üretimi doğal gazın kesintisiz ve hassas biçimde temin edilmesinin en kritik önem taşıdığı endüstriyel prosesler arasında yer alır; seramik tünel fırınlarında 1.200–1.400°C'ye ulaşan sürekli yanma süreçleri en ufak bir tedarik dalgalanmasında bile ürün kalitesini tehlikeye atarken, cam eritme fırınlarında operasyonel süreklilik üretimin temel koşuludur.",
    descriptionEn: "Ceramic and glass production are among the industrial processes where uninterrupted and precise natural gas supply is most critical; continuous combustion processes reaching 1,200–1,400°C in ceramic tunnel kilns can compromise product quality with even the slightest supply fluctuation, while operational continuity in glass melting furnaces is a fundamental condition of production.",
    descriptionRu: "Производство керамики и стекла относится к промышленным процессам, где бесперебойные и точные поставки природного газа наиболее критичны: непрерывные процессы горения, достигающие 1200–1400°C в керамических туннельных печах, могут снизить качество продукции даже при малейших колебаниях поставок, а операционная непрерывность в стекловаренных печах является фундаментальным условием производства.",
    benefitsTr: [
      "Seramik tünel fırınlarında kesintisiz ve hassas sıcaklık kontrolü için sabit basınçlı yakıt tedariki",
      "7/24 kesintisiz arz güvencesi ile birlikte rekabetçi fiyatlar",
      "Yüksek enerji yoğunluklu proseslerde fuel-oil alternatifine kıyasla düşük karbon ayak izi"
    ],
    benefitsEn: [
      "Constant-pressure fuel supply for uninterrupted and precise temperature control in ceramic tunnel kilns",
      "24/7 uninterrupted supply guarantee with competitive prices",
      "Lower carbon footprint compared to fuel oil alternatives in high energy-intensive processes"
    ],
    benefitsRu: [
      "Поставка топлива под постоянным давлением для бесперебойного и точного контроля температуры в керамических туннельных печах",
      "Круглосуточная гарантия бесперебойных поставок с конкурентными ценами",
      "Меньший углеродный след по сравнению с мазутом в энергоёмких процессах"
    ],
    scale: "100–1,200 Mm³/yr"
  },

  {
    id: "textiles",
    name: "Tekstil",
    nameEn: "Textiles",
    nameRu: "Текстиль",
    taglineTr: "Boyama ve Kurutma İçin Hassas Buhar",
    taglineEn: "Precise Steam for Dyeing and Drying",
    taglineRu: "Точный пар для крашения и сушки",
    descriptionTr: "Proseslerde kullanılan doğal gaz, hem rekabetçi maliyet avantajı hem de global markaların tedarikçilerinden giderek daha fazla talep ettiği düşük karbon ayak izi gereksinimleri açısından en uygun yakıt seçeneği olarak öne çıkar.",
    descriptionEn: "Natural gas used in processes stands out as the most suitable fuel option both for competitive cost advantages and the low carbon footprint requirements increasingly demanded by global brands from their suppliers.",
    descriptionRu: "Природный газ, используемый в технологических процессах, выделяется как наиболее подходящий вариант топлива как с точки зрения конкурентных издержек, так и требований к низкому углеродному следу, которые всё чаще выдвигают глобальные бренды к своим поставщикам.",
    benefitsTr: [
      "Boyahane, kurutma ve fikse fırınları için kesintisiz buhar ve ısı enerjisi temini",
      "Global markaların ESG gereksinimlerine uyumda düşük karbon ayak izi avantajı",
      "Üretim planlamasını kolaylaştıran esnek hacim seçenekleri"
    ],
    benefitsEn: [
      "Uninterrupted steam and heat energy supply for dyeing, drying, and fixing ovens",
      "Low carbon footprint advantage for compliance with global brands' ESG requirements",
      "Flexible volume options that facilitate production planning"
    ],
    benefitsRu: [
      "Бесперебойная подача пара и тепловой энергии для красильных, сушильных и фиксационных печей",
      "Преимущество низкого углеродного следа для соответствия ESG-требованиям глобальных брендов",
      "Гибкие варианты объёмов, облегчающие планирование производства"
    ],
    scale: "50–700 Mm³/yr"
  },
  {
    id: "distribution",
    name: "Dağıtım",
    nameEn: "Distribution",
    nameRu: "Распределение",
    taglineTr: "Güvenilir Dağıtım Altyapısı",
    taglineEn: "Reliable Distribution Infrastructure",
    taglineRu: "Надёжная распределительная инфраструктура",
    descriptionTr: "Kış aylarındaki ani talep artışlarından arz kaynaklı dalgalanmalara kadar her koşulda güvenilir bir tedarikçiyle çalışmak, dağıtım şirketlerinin hem operasyonel sürekliliğini hem de abone memnuniyetini doğrudan belirler.",
    descriptionEn: "Working with a reliable supplier in all conditions, from sudden demand increases in winter months to supply-related fluctuations, directly determines both operational continuity and subscriber satisfaction for distribution companies.",
    descriptionRu: "Работа с надёжным поставщиком в любых условиях — от резкого роста спроса в зимние месяцы до колебаний поставок — напрямую определяет как операционную непрерывность, так и удовлетворённость абонентов для распределительных компаний.",
    benefitsTr: [
      "Mevsimsel talep zirvelerinde bile kesintisiz ve güvenilir toptan gaz temini",
      "Kısa ve uzun vadeli sözleşme esnekliğiyle abone talebine duyarlı portföy yönetimi",
      "Güçlü kaynak çeşitliliğiyle desteklenen yüksek arz güvenliği"
    ],
    benefitsEn: [
      "Uninterrupted and reliable wholesale gas supply even during seasonal demand peaks",
      "Portfolio management responsive to subscriber demand with short and long-term contract flexibility",
      "High supply security supported by strong source diversification"
    ],
    benefitsRu: [
      "Бесперебойные и надёжные оптовые поставки газа даже в пики сезонного спроса",
      "Управление портфелем, реагирующее на спрос абонентов, с гибкостью кратко- и долгосрочных контрактов",
      "Высокая безопасность поставок, подкреплённая широкой диверсификацией источников"
    ],
    scale: "500–3,000 Mm³/yr"
  },
  {
    id: "steel",
    name: "Demir-Çelik",
    nameEn: "Steel",
    nameRu: "Чёрная металлургия",
    taglineTr: "Ağır Sanayide Geçiş Yakıtı",
    taglineEn: "Transition Fuel for Heavy Industry",
    taglineRu: "Переходное топливо для тяжёлой промышленности",
    descriptionTr: "Doğal gaz, kömür ve kok gazına kıyasla daha düşük karbon ayak iziyle, tavlama fırınlarından haddehanelere kadar birçok süreçte bu sektörün yüksek sıcaklık gerektiren ağır üretim koşullarını karşılarken CBAM gibi artan çevresel düzenlemelere uyum sürecinde de kritik bir geçiş yakıtı işlevi görür.",
    descriptionEn: "With a lower carbon footprint compared to coal and coke gas, natural gas meets the heavy production conditions requiring high temperatures in this sector from annealing furnaces to rolling mills, while serving as a critical transition fuel in compliance with increasing environmental regulations such as CBAM.",
    descriptionRu: "Благодаря меньшему углеродному следу по сравнению с углём и коксовым газом природный газ обеспечивает тяжёлые производственные условия, требующие высоких температур — от отжигательных печей до прокатных станов, являясь критически важным переходным топливом в соответствии с ужесточающимися экологическими нормами, такими как CBAM.",
    benefitsTr: [
      "Yüksek fırın, haddehane ve döküm prosesleri için kesintisiz yüksek kapasiteli yakıt tedariki",
      "Kömür ve kok gazına kıyasla daha düşük karbon emisyonu ile CBAM uyumunda avantaj",
      "Uzun vadeli sözleşme yapılarıyla üretim maliyetlerinde öngörülebilirlik ve fiyat istikrarı"
    ],
    benefitsEn: [
      "Uninterrupted high-capacity fuel supply for blast furnaces, rolling mills, and casting processes",
      "Advantage in CBAM compliance with lower carbon emissions compared to coal and coke gas",
      "Predictability and price stability in production costs through long-term contract structures"
    ],
    benefitsRu: [
      "Бесперебойная высокомощная подача топлива для доменных печей, прокатных станов и литейных процессов",
      "Преимущество в соответствии CBAM с меньшими выбросами углерода по сравнению с углём и коксовым газом",
      "Предсказуемость и ценовая стабильность производственных затрат благодаря долгосрочным контрактам"
    ],
    scale: "100–400 Mm³/yr"
  },
  {
    id: "wholesale",
    name: "Toptan Satış",
    nameEn: "Wholesale",
    nameRu: "Оптовая торговля",
    taglineTr: "Rekabetçi Tedarik Çözümleri",
    taglineEn: "Competitive Supply Solutions",
    taglineRu: "Конкурентные решения по поставкам",
    descriptionTr: "Sektördeki deneyimimiz, güçlü tedarik ve esnek ticari çözümlerimizle, toptan satış şirketlerinin portföylerini daha etkin yönetmelerine destek oluyoruz.",
    descriptionEn: "With our industry experience, strong supply, and flexible commercial solutions, we support wholesale companies in managing their portfolios more effectively.",
    descriptionRu: "Благодаря нашему отраслевому опыту, надёжным поставкам и гибким коммерческим решениям мы помогаем оптовым компаниям эффективнее управлять своими портфелями.",
    benefitsTr: [
      "Ticari karlılığı doğrudan destekleyen rekabetçi toptan alış fiyatları",
      "Değişken müşteri portföyüne uyum sağlayan esnek hacim ve sözleşme yapıları",
      "Müşterilerine verilen taahhütleri güvence altına alan kesintisiz arz"
    ],
    benefitsEn: [
      "Competitive wholesale purchase prices directly supporting commercial profitability",
      "Flexible volume and contract structures adapting to variable customer portfolios",
      "Uninterrupted supply securing commitments made to customers"
    ],
    benefitsRu: [
      "Конкурентные оптовые закупочные цены, напрямую поддерживающие коммерческую рентабельность",
      "Гибкие объёмы и структуры договоров, адаптирующиеся к изменчивым клиентским портфелям",
      "Бесперебойные поставки, обеспечивающие выполнение обязательств перед клиентами"
    ],
    scale: "50–1,000 Mm³/yr"
  }
];

// Positions for bubbles arranged in a circle around the center
const getCirclePositions = (count: number, radius: number, centerX: number, centerY: number) => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
};

function PipelineSVG({ selected, containerWidth, containerHeight }: { selected: Industry; containerWidth: number; containerHeight: number }) {
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const radius = Math.min(containerWidth, containerHeight) * 0.34 - 20;
  const positions = getCirclePositions(industries.length, radius, centerX, centerY);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {positions.map((pos, i) => {
        const isSelected = industries[i].id === selected.id;
        return (
          <g key={industries[i].id}>
            <line
              x1={centerX}
              y1={centerY}
              x2={pos.x}
              y2={pos.y}
              stroke={isSelected ? "#93c5fd" : "#60a5fa"}
              strokeWidth={isSelected ? 3 : 2}
              strokeDasharray={isSelected ? "none" : "6 4"}
              opacity={isSelected ? 1 : 0.4}
              className="transition-all duration-300"
            />
            <circle cx={centerX} cy={centerY} r={3} fill="#93c5fd" opacity={0.6} />
            {isSelected && (
              <circle r={4} fill="#60a5fa">
                <animateMotion
                  dur="1.5s"
                  repeatCount="indefinite"
                  path={`M${centerX},${centerY} L${pos.x},${pos.y}`}
                />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function IndustryBubbles() {
  const [selected, setSelected] = useState<Industry>(industries[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 500, height: 500 });
  const { t, lang } = useLanguage();
  const [paused, setPaused] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop viewport (lg breakpoint = 1024px)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-rotation: cycle through sectors every 3s on desktop only, pause on hover/click
  useEffect(() => {
    if (paused || !isDesktop) return;
    const interval = setInterval(() => {
      setSelected((prev) => {
        const idx = industries.findIndex((ind) => ind.id === prev.id);
        return industries[(idx + 1) % industries.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [paused, isDesktop]);

  // Cleanup pause timer on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  const handleUserInteraction = (industry: Industry) => {
    setSelected(industry);
    setPaused(true);
    // Resume auto-rotation after 8 seconds of inactivity
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setPaused(false), 8000);
  };

  const handleHoverEnter = () => {
    setPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
  };

  const handleHoverLeave = () => {
    // Resume after a short delay when mouse leaves
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setPaused(false), 3000);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDims({ width, height });
        }
      }
    });
    observer.observe(containerRef.current);
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setDims({ width: rect.width, height: rect.height });
    }
    return () => observer.disconnect();
  }, []);

  const bubbleAreaWidth = dims.width;
  const centerX = bubbleAreaWidth / 2;
  const centerY = dims.height / 2;
  const radius = Math.min(bubbleAreaWidth, dims.height) * 0.34 - 20;
  const positions = getCirclePositions(industries.length, radius, centerX, centerY);

  const getBubbleLabel = (industry: Industry) => lang === "en" ? industry.nameEn : lang === "ru" ? industry.nameRu : industry.name;

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#1e4976] to-[#2563eb]">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="text-blue-300 text-sm font-medium uppercase tracking-wider mb-3">
            {t("Sektörler", "Sectors", "Отрасли")}
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            {t("Hizmet Verdiğimiz Sektörler", "Industries We Serve", "Отрасли, которые мы обслуживаем")}
          </h2>
          <p className="text-blue-200/70 max-w-xl mx-auto text-base">
            {t(
              "Türkiye'nin en büyük özel doğal gaz ithalatçısı olarak, farklı sektörlere özel enerji çözümleri sunuyoruz.",
              "As Turkey's largest private natural gas importer, we offer tailored energy solutions to various industries.",
              "Как крупнейший частный импортёр природного газа в Турции, мы предлагаем индивидуальные энергетические решения для различных отраслей."
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Bubbles Container with Pipeline */}
          <div ref={containerRef} className="relative w-full lg:w-1/2 lg:aspect-square lg:max-h-[550px]">
            {/* Desktop: Circle layout with pipelines */}
            <div className="hidden lg:block relative w-full h-full" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave}>
              <PipelineSVG selected={selected} containerWidth={dims.width} containerHeight={dims.height} />

              {/* Central Company Bubble */}
              <div
                className="absolute z-10 flex items-center justify-center"
                style={{
                  left: `calc(50% - 50px)`,
                  top: `calc(50% - 50px)`,
                  width: 100,
                  height: 100,
                }}
              >
                <div className="w-[100px] h-[100px] rounded-full bg-white/10 border-2 border-white/50 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-[11px] font-bold text-white leading-tight text-center px-2">
                    Bosphorus<br />Gaz
                  </span>
                </div>
              </div>

              {/* Industry Bubbles arranged in circle */}
              {industries.map((industry, i) => {
                const bubbleW = dims.width;
                const cX = bubbleW / 2;
                const cY = dims.height / 2;
                const r = Math.min(bubbleW, dims.height) * 0.34 - 20;
                const angle = (2 * Math.PI * i) / industries.length - Math.PI / 2;
                const x = cX + r * Math.cos(angle);
                const y = cY + r * Math.sin(angle);
                const isSelected = selected.id === industry.id;

                return (
                  <motion.button
                    key={industry.id}
                    onClick={() => handleUserInteraction(industry)}
                    className="absolute flex items-center justify-center z-20"
                    style={{
                      left: x - 40,
                      top: y - 40,
                      width: 80,
                      height: 80,
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div
                      className={`w-[76px] h-[76px] rounded-full flex items-center justify-center text-center transition-all duration-300 ${
                        isSelected
                          ? "bg-white/20 border-2 border-white shadow-lg shadow-blue-400/30"
                          : "bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-blue-300"
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 1.6, opacity: 0 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                        />
                      )}
                      <span className={`text-[10px] font-semibold leading-tight px-1 ${isSelected ? "text-white" : "text-white/70"}`}>
                        {getBubbleLabel(industry)}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Mobile: Circular orbit layout */}
            <div className="lg:hidden relative w-full aspect-square max-w-[340px] sm:max-w-[380px] mx-auto">
              {/* Central Company Bubble */}
              <div className="absolute z-10 flex items-center justify-center" style={{ left: 'calc(50% - 30px)', top: 'calc(50% - 30px)', width: 60, height: 60 }}>
                <div className="w-[60px] h-[60px] rounded-full bg-white/10 border-2 border-white/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white text-center leading-tight">Bosphorus<br/>Gaz</span>
                </div>
              </div>

              {/* SVG Pipelines for mobile */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 340">
                {industries.map((industry, i) => {
                  const cx = 170;
                  const cy = 170;
                  const r = 120;
                  const angle = (2 * Math.PI * i) / industries.length - Math.PI / 2;
                  const x = cx + r * Math.cos(angle);
                  const y = cy + r * Math.sin(angle);
                  const isSelected = selected.id === industry.id;
                  return (
                    <g key={industry.id}>
                      <line x1={cx} y1={cy} x2={x} y2={y} stroke={isSelected ? "#93c5fd" : "#60a5fa"} strokeWidth={isSelected ? 2 : 1.5} strokeDasharray={isSelected ? "none" : "4 3"} opacity={isSelected ? 1 : 0.3} />
                      {isSelected && (
                        <circle r={3} fill="#60a5fa">
                          <animateMotion dur="1.5s" repeatCount="indefinite" path={`M${cx},${cy} L${x},${y}`} />
                        </circle>
                      )}
                    </g>
                  );
                })}
                <circle cx={170} cy={170} r={2.5} fill="#93c5fd" opacity={0.6} />
              </svg>

              {/* Industry Bubbles in circle */}
              {industries.map((industry, i) => {
                const angle = (2 * Math.PI * i) / industries.length - Math.PI / 2;
                const r = 35.3; // percentage from center (120/340 * 100)
                const x = 50 + r * Math.cos(angle);
                const y = 50 + r * Math.sin(angle);
                const isSelected = selected.id === industry.id;
                return (
                  <motion.button
                    key={industry.id}
                    onClick={() => handleUserInteraction(industry)}
                    className="absolute flex items-center justify-center z-20"
                    style={{
                      left: `calc(${x}% - 26px)`,
                      top: `calc(${y}% - 26px)`,
                      width: 52,
                      height: 52,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className={`w-[50px] h-[50px] sm:w-[56px] sm:h-[56px] rounded-full flex items-center justify-center text-center transition-all duration-200 ${
                        isSelected
                          ? "bg-white/20 border-2 border-white shadow-lg shadow-blue-400/30"
                          : "bg-white/5 border border-white/20"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-blue-300"
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 1.6, opacity: 0 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                        />
                      )}
                      <span className={`text-[7px] sm:text-[8px] font-semibold leading-tight px-0.5 ${
                        isSelected ? "text-white" : "text-white/70"
                      }`}>
                        {getBubbleLabel(industry)}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="w-full lg:w-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-1">
                  {lang === "en" ? selected.nameEn : lang === "ru" ? selected.nameRu : selected.name}
                </h3>
                <p className="text-sm text-blue-200/60 mb-4">
                  {lang === "tr" ? selected.nameEn : selected.name}
                </p>
                <p className="text-sm font-medium mb-4 text-blue-300">
                  {lang === "en" ? selected.taglineEn : lang === "ru" ? selected.taglineRu : selected.taglineTr}
                </p>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {lang === "en" ? selected.descriptionEn : lang === "ru" ? selected.descriptionRu : selected.descriptionTr}
                </p>

                <ul className="space-y-2 mb-6">
                  {(lang === "en" ? selected.benefitsEn : lang === "ru" ? selected.benefitsRu : selected.benefitsTr).map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-blue-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">{t("Yıllık Tüketim", "Annual Consumption", "Годовое потребление")}</p>
                    <p className="text-sm font-semibold text-white">{selected.scale}</p>
                  </div>
                  <a
                    href="/dogal-gaz#talep"
                    className="px-4 py-2 bg-white text-[#1e3a5f] text-sm font-semibold rounded-md hover:bg-blue-50 transition-all duration-200 active:scale-[0.97]"
                  >
                    {t("Teklif Al", "Get a Quote", "Запросить КП")} &rarr;
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

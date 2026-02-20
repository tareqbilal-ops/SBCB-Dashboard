// Maps Arabic country names to ISO 3166-1 Alpha-3 codes
export const ARABIC_TO_ISO: Record<string, string> = {
  "تركيا": "TUR",
  "السعودية": "SAU",
  "ألمانيا": "DEU",
  "المملكة المتحدة": "GBR",
  "الولايات المتحدة": "USA",
  "كندا": "CAN",
  "الصين": "CHN",
  "فرنسا": "FRA",
  "هولندا": "NLD",
  "العراق": "IRQ",
  "الكويت": "KWT",
  "الإمارات": "ARE",
  "الأردن": "JOR",
  "مصر": "EGY",
  "إيطاليا": "ITA",
  "ماليزيا": "MYS",
  "إندونيسيا": "IDN",
  "السودان": "SDN",
  "بلجيكا": "BEL",
  "ليبيا": "LBY",
  "السويد": "SWE",
  "قطر": "QAT",
  "إسبانيا": "ESP",
  "اليابان": "JPN",
  "لبنان": "LBN",
  "روسيا": "RUS",
  "كوريا الجنوبية": "KOR",
};

// ISO A3 -> ISO A2 for Natural Earth matching
export const ISO_A3_TO_A2: Record<string, string> = {
  TUR: "TR", SAU: "SA", DEU: "DE", GBR: "GB", USA: "US", CAN: "CA",
  CHN: "CN", FRA: "FR", NLD: "NL", IRQ: "IQ", KWT: "KW", ARE: "AE",
  JOR: "JO", EGY: "EG", ITA: "IT", MYS: "MY", IDN: "ID", SDN: "SD",
  BEL: "BE", LBY: "LY", SWE: "SE", QAT: "QA", ESP: "ES", JPN: "JP",
  LBN: "LB", RUS: "RU", KOR: "KR",
};

// Country centroids for marker placement [latitude, longitude] (Leaflet uses [lat, lng])
export const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
  TUR: [39.0, 35.2],
  SAU: [23.9, 45.1],
  DEU: [51.2, 10.4],
  GBR: [55.4, -3.4],
  USA: [37.1, -95.7],
  CAN: [56.1, -106.3],
  CHN: [35.9, 104.2],
  FRA: [46.6, 2.2],
  NLD: [52.1, 5.3],
  IRQ: [33.2, 43.7],
  KWT: [29.3, 47.5],
  ARE: [23.4, 53.8],
  JOR: [30.6, 36.2],
  EGY: [26.8, 30.8],
  ITA: [41.9, 12.6],
  MYS: [4.2, 101.9],
  IDN: [-0.8, 113.9],
  SDN: [12.9, 30.2],
  BEL: [50.5, 4.5],
  LBY: [26.3, 17.2],
  SWE: [60.1, 18.6],
  QAT: [25.4, 51.2],
  ESP: [40.5, -3.7],
  JPN: [36.2, 138.3],
  LBN: [33.9, 35.9],
  RUS: [61.5, 105.3],
  KOR: [35.9, 128.0],
};

// Stage colors for map rendering
export const STAGE_MAP_COLORS: Record<string, { fill: string; stroke: string; fillOpacity: number; label: string }> = {
  Approved: {
    fill: "#059669",
    stroke: "#047857",
    fillOpacity: 0.55,
    label: "معتمد",
  },
  "Ready for Approval": {
    fill: "#0d9488",
    stroke: "#0f766e",
    fillOpacity: 0.5,
    label: "جاهز للاعتماد",
  },
  Provisional: {
    fill: "#d97706",
    stroke: "#b45309",
    fillOpacity: 0.5,
    label: "مرحلة مؤقتة",
  },
  "Under Assessment": {
    fill: "#ea580c",
    stroke: "#c2410c",
    fillOpacity: 0.45,
    label: "قيد التقييم",
  },
  Candidate: {
    fill: "#64748b",
    stroke: "#475569",
    fillOpacity: 0.4,
    label: "مرشح",
  },
};

// GeoJSON URL for country boundaries (Natural Earth 110m via CDN)
export const GEOJSON_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

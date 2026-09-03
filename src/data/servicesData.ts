import {
  Zap,
  Droplet,
  Tv,
  Paintbrush,
  Sparkles,
  Laptop,
  Sun,
  Trees
} from 'lucide-react';
import { ServiceItem, CategoryItem } from '../types';
import {
  SERVICE_TRANSLATIONS,
  CATEGORY_TRANSLATIONS,
  getLocalizedServiceName,
  getLocalizedServiceDescription,
  getLocalizedCategoryName,
  getLocalizedCategoryDescription
} from './serviceTranslations';

export {
  SERVICE_TRANSLATIONS,
  CATEGORY_TRANSLATIONS,
  getLocalizedServiceName,
  getLocalizedServiceDescription,
  getLocalizedCategoryName,
  getLocalizedCategoryDescription
};

/* =========================================================
   MAIN CATEGORIES
   Used by CategoryGrid / Pills / Navigation
========================================================= */

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'electrical',
    iconName: 'Zap',
    label: 'Electrical',
    labelAm: 'ኤሌክትሪክ',
    labelOm: 'Elektiriikii',
    labelTi: 'ኤሌክትሪክ',
    labelSo: 'Koronto',
    description: 'Wiring, breaker boxes, lighting, generators, power surges',
    descriptionAm: 'የኤሌክትሪክ መስመሮች፣ ሰርኪውት ብሬከር፣ መብራቶች፣ ጄኔሬተር እና የኃይል ሲስተም',
    descriptionOm: 'Sarara elektiriikii, saanduqa breekarii, ifaa, jeneraataroota fi sirna humnaa',
    descriptionTi: 'መስመራት ኤሌክትሪክ፣ ሰርኪውት ብሬከር፣ መብራህቲ፣ ጄኔሬተርን ጸዓትን',
    descriptionSo: 'Xadhkaha korontada, sanduuqa kontoroolka, laydhadhka iyo matoorada'
  },
  {
    id: 'appliances',
    iconName: 'Tv',
    label: 'Appliances',
    labelAm: 'እቃዎች',
    labelOm: 'Meeshaalee',
    labelTi: 'ናውቲ ገዛ',
    labelSo: 'Qalabka',
    description: 'Washing machines, refrigerators, microwaves, ovens',
    descriptionAm: 'ልብስ ማጠቢያ፣ ፍሪጅ፣ ማይክሮዌቭ፣ የኤሌክትሪክ ምድጃ እና የቤት እቃዎች',
    descriptionOm: 'Maashina uffataa, firiijii, maayikirooweevii, oovenii fi meeshaalee manaa',
    descriptionTi: 'ማሽን ሕጽቦ፣ ፍሪጅ፣ ማይክሮዌቭ፣ እቶን ኤሌክትሪክን ናውቲ ገዛን',
    descriptionSo: 'Mashiinnada dharka, talaagadaha, maaykorooweefta iyo foornooyinka'
  },
  {
    id: 'electronics_it',
    iconName: 'Laptop',
    label: 'Electronics',
    labelAm: 'ኤሌክትሮኒክስ',
    labelOm: 'Elektirooniiksii',
    labelTi: 'ኤሌክትሮኒክስ',
    labelSo: 'Elektaroonig',
    description: 'Laptops, PCs, smart TVs, Wi-Fi routers, sound systems',
    descriptionAm: 'ላፕቶፖች፣ ፒሲ፣ ስማርት ቲቪ፣ ዋይፋይ ራውተር፣ ኔትወርክ እና ሲሲቲቪ ካሜራ',
    descriptionOm: 'Laaptooppii, PC, TV smart, raawutara Wi-Fi, neetwoorkii fi CCTV',
    descriptionTi: 'ላፕቶፕ፣ ፒሲ፣ ስማርት ቲቪ፣ ዋይፋይ ራውተር፣ መርበብን ሲሲቲቪን',
    descriptionSo: 'Kumbuyuutarrada, TV-yada casriga ah, Wi-Fi router-yada iyo CCTV'
  },
  {
    id: 'solar',
    iconName: 'Sun',
    label: 'Solar & Inverter',
    labelAm: 'ሶላር እና ኢንቨርተር',
    labelOm: 'Soolaarii & Invertarii',
    labelTi: 'ሶላርን ኢንቨርተርን',
    labelSo: 'Cadceed & Inverter',
    description: 'Solar panels, deep cycle batteries, hybrid inverters, UPS',
    descriptionAm: 'የሶላር ፓነል፣ ዲፕ ሳይክል ባትሪ፣ ሃይብሪድ ኢንቨርተር እና ዩፒኤስ',
    descriptionOm: 'Paanaalota soolaarii, baankii baatirii, invertarii haayibriidii fi UPS',
    descriptionTi: 'ሶላር ፓነላት፣ ባትሪታት፣ ሃይብሪድ ኢንቨርተርን ዩፒኤስን',
    descriptionSo: 'Qalabka tamarta cadceedda, baatariga, hybrid inverter iyo UPS'
  },
  {
    id: 'plumbing',
    iconName: 'Droplet',
    label: 'Plumbing',
    labelAm: 'ቧንቧ',
    labelOm: 'Ujummoo',
    labelTi: 'ቧንቧ',
    labelSo: 'Dhuumaha',
    description: 'Pipes, water pumps, water heaters (boiler), toilets, sinks',
    descriptionAm: 'ቧንቧዎች፣ የውሃ ፓምፖች፣ ቦይለር፣ ሽንት ቤት፣ ገንዳ እና ፍሳሽ መስመር',
    descriptionOm: 'Ujummoolee, paampii bishaanii, boyilarii, mana fincaanii fi dhangala\'aa',
    descriptionTi: 'ቧንቧታት፣ ፓምፕ ማይ፣ ቦይለር፣ ሽንትቤት፣ ገንዳን መስመር ፍሳሽን',
    descriptionSo: 'Dhuumaha biyaha, bamka biyaha, kuleyliyaha, suuliyada iyo biyo-mareenka'
  },
  {
    id: 'painting',
    iconName: 'Paintbrush',
    label: 'Improvement',
    labelAm: 'እድሳት',
    labelOm: 'Haareffama',
    labelTi: 'ምሕዳስ',
    labelSo: 'Dayactir',
    description: 'Interior wall painting, plastering, tile fixing, drywall',
    descriptionAm: 'የግድግዳ ቀለም ቅብ፣ ፕላስተር፣ ሴራሚክ እና ታይልስ፣ ጂፕሰም እና የእንጨት ስራ',
    descriptionOm: 'Halluu girgidaa, pilaastaraa, taayilii, dizaayinii jiipsamii fi hojii mukaa',
    descriptionTi: 'ሕብሪ መንደቕ፣ ፕላስተር፣ ሴራሚክን ታይልስን፣ ጂፕሰምን ስራሕቲ ዕንጨይትን',
    descriptionSo: 'Rinjiga darbiyada, malaaska, dhigista foormikada iyo naqshadaynta gypsum'
  },
  {
    id: 'cleaning',
    iconName: 'Sparkles',
    label: 'Cleaning',
    labelAm: 'ጽዳት',
    labelOm: 'Qulqullina',
    labelTi: 'ጽሬት',
    labelSo: 'Nadiifin',
    description: 'Deep house cleaning, sofas, carpets, post-construction',
    descriptionAm: 'ሙሉ የቤት ጽዳት፣ የሶፋ እና ምንጣፍ እጥበት፣ የቢሮ ጽዳት እና የተባይ ማጥፋት',
    descriptionOm: 'Qulqullina manaa guutuu, dhiqannaa soofaa fi kaarpeetii, qulqullina biiroo',
    descriptionTi: 'ምሉእ ጽሬት ገዛ፣ ምሕጻብ ሶፋን ምንጻፍን፣ ጽሬት ቢሮታትን ምጥፋእ ባልዕን',
    descriptionSo: 'Nadiifinta guud ee guriga, dhaqidda kuraasta iyo roogaga, xafiisyada'
  },
  {
    id: 'outdoor',
    iconName: 'Trees',
    label: 'Outdoor & Compound',
    labelAm: 'ግቢ እና አትክልት',
    labelOm: 'Mooraa & Biqiltoota',
    labelTi: 'ቀጽሪን ተኽልን',
    labelSo: 'Barxad & Beero',
    description: 'Gardening, compound pavers, fence welding, razor wire',
    descriptionAm: 'የአትክልት እና ሳር እንክብካቤ፣ ኮብልስቶን፣ የአጥር ብየዳ እና የካምፓውንድ ስራ',
    descriptionOm: 'Kunuunsa biqiltootaa, dhagaa mooraa, dallaa sibilaa fi eegumsa naannoo',
    descriptionTi: 'ክንክን ኣታኽልቲ፣ ኮብልስቶን ቀጽሪ፣ ሓጹርን ዌልዲንግን',
    descriptionSo: 'Xannaanaynta beeraha, dhagaxa barxadda, dayrka iyo alxanka birta'
  }
];

export const MAIN_CATEGORIES = INITIAL_CATEGORIES.map(c => {
  let iconComp = Zap;
  if (c.iconName === 'Tv') iconComp = Tv;
  else if (c.iconName === 'Laptop') iconComp = Laptop;
  else if (c.iconName === 'Sun') iconComp = Sun;
  else if (c.iconName === 'Droplet') iconComp = Droplet;
  else if (c.iconName === 'Paintbrush') iconComp = Paintbrush;
  else if (c.iconName === 'Sparkles') iconComp = Sparkles;
  else if (c.iconName === 'Trees') iconComp = Trees;
  return {
    ...c,
    icon: iconComp
  };
});

/* =========================================================
   CURATED PRESET IMAGES FOR EASY ADMIN SWAPPING
========================================================= */

export const PRESET_SERVICE_IMAGES = [
  {
    category: 'Electrical & Power',
    title: 'House Wiring & Cables',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Electrical & Power',
    title: 'Breaker Panel & Electric Box',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Electrical & Power',
    title: 'Electrician with Tools',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Electrical & Power',
    title: 'Generator & Backup Engine',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Plumbing & Hydraulic',
    title: 'Pipes & Metal Wrenches',
    url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Plumbing & Hydraulic',
    title: 'Modern Bathroom Sink & Tap',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Plumbing & Hydraulic',
    title: 'Water Heater / Boiler Repair',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Plumbing & Hydraulic',
    title: 'High-Pressure Water Pump',
    url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Appliances & TV',
    title: 'Smart LED TV Repair',
    url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Appliances & TV',
    title: 'Automatic Washing Machine',
    url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Appliances & TV',
    title: 'Refrigerator & Cooling Unit',
    url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Appliances & TV',
    title: 'Microwave & Kitchen Oven',
    url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Solar & Clean Energy',
    title: 'Rooftop Solar PV Panels',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Solar & Clean Energy',
    title: 'Inverter & Battery Bank',
    url: 'https://images.unsplash.com/photo-1548611716-ad07498c4f92?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Electronics & IT',
    title: 'Laptop & Computer Hardware',
    url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Electronics & IT',
    title: 'Circuit Board & Micro soldering',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Home Improvement & Painting',
    title: 'Wall Painting & Roller Finish',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Home Improvement & Painting',
    title: 'Woodwork & Carpentry',
    url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Cleaning & Sanitization',
    title: 'Deep House Cleaning & Polish',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Cleaning & Sanitization',
    title: 'Sofa & Upholstery Steam Wash',
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Outdoor & Compound',
    title: 'Lawn Mowing & Landscape',
    url: 'https://images.unsplash.com/photo-1558904541-efa873a8e60d?auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Security & Smart Tech',
    title: 'CCTV Security Camera Setup',
    url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80'
  }
];

/* =========================================================
   POPULAR SERVICES
   Used by PopularServices section
========================================================= */

const RAW_POPULAR_SERVICES = [
  {
    id: 'wiring',
    name: 'House Wiring',
    nameAm: 'የቤት ኤሌክትሪክ መስመር',
    price: 300,
    priceFormatted: '300 ETB',
    rating: 4.9,
    reviewsCount: 284,
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
    category: 'electrical',
    popular: true,
    description: 'Complete home electrical wiring, short circuit testing, and main breaker box setup.'
  },
  {
    id: 'pipe-repair',
    name: 'Pipe Repair',
    nameAm: 'የቧንቧ እና ፍሳሽ ጥገና',
    price: 250,
    priceFormatted: '250 ETB',
    rating: 4.8,
    reviewsCount: 195,
    image:
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80',
    category: 'plumbing',
    popular: true,
    description: 'PPR and PVC pipe leak repair, joint soldering, tap replacement, and drainage clearing.'
  },
  {
    id: 'tv-mount',
    name: 'TV Repair',
    nameAm: 'ቴሌቪዥን ጥገና',
    price: 400,
    priceFormatted: '400 ETB',
    rating: 4.9,
    reviewsCount: 312,
    image:
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80',
    category: 'appliances',
    popular: true,
    description: 'Smart LED, OLED, backlight strip fixing, mainboard logic testing, and power board diagnosis.'
  },
  {
    id: 'house-painting',
    name: 'Wall Painting',
    nameAm: 'የግድግዳ ቀለም ቅብ',
    price: 1500,
    priceFormatted: '1,500 ETB',
    rating: 4.7,
    reviewsCount: 167,
    image:
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
    category: 'painting',
    popular: true,
    description: 'Interior wall scraping, anti-damp primer coating, and quality emulsion color application.'
  },
  {
    id: 'solar_panel',
    name: 'Solar Panel System',
    nameAm: 'ሶላር ፓነል ተከላ',
    price: 1200,
    priceFormatted: '1,200 ETB',
    rating: 4.95,
    reviewsCount: 220,
    image:
      'https://images.unsplash.com/photo-1509391365360-80a0684f828a?auto=format&fit=crop&w=400&q=80',
    category: 'solar',
    popular: true,
    description: 'Monocrystalline rooftop solar panel mounting, angle calibration, and hybrid inverter hookup.'
  },
  {
    id: 'laptop',
    name: 'Laptop & IT Repair',
    nameAm: 'ላፕቶፕ እና አይቲ ጥገና',
    price: 500,
    priceFormatted: '500 ETB',
    rating: 4.92,
    reviewsCount: 340,
    image:
      'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=400&q=80',
    category: 'electronics_it',
    popular: true,
    description: 'Hardware logic diagnosis, screen and battery replacement, thermal cleaning, and OS recovery.'
  }
];

export const POPULAR_SERVICES = RAW_POPULAR_SERVICES.map((item) => {
  const tr = SERVICE_TRANSLATIONS[item.id];
  return {
    ...item,
    nameAm: tr?.name.am || item.nameAm,
    nameOm: tr?.name.om,
    nameTi: tr?.name.ti,
    nameSo: tr?.name.so,
    descriptionAm: tr?.description.am,
    descriptionOm: tr?.description.om,
    descriptionTi: tr?.description.ti,
    descriptionSo: tr?.description.so
  };
});

/* =========================================================
   ALL CATEGORY GROUPS
   Used by ServiceSection / Search / Filtering
========================================================= */

export const ALL_CATEGORY_GROUPS = [
  {
    id: 'electrical',
    title: '⚡ Electrical Services',
    titleAm: '⚡ የኤሌክትሪክ አገልግሎቶች',
    subtitle: 'Wiring, power systems & installations',
    subtitleAm: 'መስመሮች፣ ኃይል እና ተከላዎች',

    items: [
      {
        id: 'wiring',
        name: 'House Wiring',
        nameAm: 'የቤት ኤሌክትሪክ መስመር',
        image:
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 300,
        priceFormatted: '300 ETB',
        category: 'electrical',
        description: 'Complete home electrical wiring, breaker panel setup, and short-circuit diagnosis.'
      },
      {
        id: 'socket',
        name: 'Socket Install',
        nameAm: 'ሶኬት ተከላ',
        image:
          'https://images.unsplash.com/photo-1558441719-752a21a93edd?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 200,
        priceFormatted: '200 ETB',
        category: 'electrical',
        description: 'Heavy duty 16A wall sockets, switches, surge suppressors, and USB modular points.'
      },
      {
        id: 'lighting',
        name: 'Lighting',
        nameAm: 'የመብራት ተከላ',
        image:
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 250,
        priceFormatted: '250 ETB',
        category: 'electrical',
        description: 'Chandelier mounting, recessed LED ceiling spot fixtures, and ambient strip lights.'
      },
      {
        id: 'breaker',
        name: 'Circuit Breaker',
        nameAm: 'ሰርኪውት ብሬከር',
        image:
          'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        price: 350,
        priceFormatted: '350 ETB',
        category: 'electrical',
        description: 'Main breaker upgrades, overload protection, distribution box troubleshooting, and grounding.'
      },
      {
        id: 'generator',
        name: 'Generator',
        nameAm: 'ጄኔሬተር ጥገና',
        image:
          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 600,
        priceFormatted: '600 ETB',
        category: 'electrical',
        description: 'Diesel and petrol generator tuning, AVR voltage calibration, spark plug and oil change.'
      },
      {
        id: 'pump_elec',
        name: 'Water Pump',
        nameAm: 'የውሃ ፓምፕ ጥገና',
        image:
          'https://images.unsplash.com/photo-1542013936693-843d57274f62?auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        price: 500,
        priceFormatted: '500 ETB',
        category: 'electrical',
        description: 'Electric water pump motor winding, automatic float switch, and pressure tank calibration.'
      }
    ]
  },

  {
    id: 'appliances',
    title: '🏠 Home Appliances',
    titleAm: '🏠 የቤት እቃዎች',
    subtitle: 'Repair TVs, refrigerators and more',
    subtitleAm: 'ቲቪ፣ ፍሪጅ፣ ልብስ ማጠቢያ እና ሌሎችም',

    items: [
      {
        id: 'tv',
        name: 'TV Repair',
        nameAm: 'ቴሌቪዥን ጥገና',
        image:
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 400,
        priceFormatted: '400 ETB',
        category: 'appliances',
        description: 'Smart LED/OLED screen repair, backlight replacement, power board fix, and audio diagnosis.'
      },
      {
        id: 'refrigerator',
        name: 'Refrigerator',
        nameAm: 'ፍሪጅ ጥገና',
        image:
          'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 500,
        priceFormatted: '500 ETB',
        category: 'appliances',
        description: 'Compressor check, refrigerant gas recharge (R134a/R600), thermostat and defrost coil fix.'
      },
      {
        id: 'washer',
        name: 'Washing Machine',
        nameAm: 'ልብስ ማጠቢያ ማሽን',
        image:
          'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 450,
        priceFormatted: '450 ETB',
        category: 'appliances',
        description: 'Drum motor repair, drain pump unblocking, error code clearing, and suspension stabilization.'
      },
      {
        id: 'microwave',
        name: 'Microwave',
        nameAm: 'ማይክሮዌቭ ጥገና',
        image:
          'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=400&q=80',
        rating: 4.6,
        price: 300,
        priceFormatted: '300 ETB',
        category: 'appliances',
        description: 'Magnetron tube replacement, high voltage capacitor check, fuse and turntable repair.'
      },
      {
        id: 'oven',
        name: 'Electric Oven',
        nameAm: 'የኤሌክትሪክ ኦቨን',
        image:
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        price: 350,
        priceFormatted: '350 ETB',
        category: 'appliances',
        description: 'Heating element coil replacement, thermostat regulator tuning, and door seal replacement.'
      },
      {
        id: 'ac',
        name: 'Air Conditioner',
        nameAm: 'ኤርኮንዲሽነር ጥገና',
        image:
          'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 600,
        priceFormatted: '600 ETB',
        category: 'appliances',
        description: 'Split AC filter sanitization, refrigerant top-up, fan motor replacement, and compressor fix.'
      },
      {
        id: 'dispenser',
        name: 'Water Dispenser',
        nameAm: 'የውሃ ማጣሪያ/ማሞቂያ',
        image:
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 250,
        priceFormatted: '250 ETB',
        category: 'appliances',
        description: 'Heating/cooling element replacement, tap leakage fix, and internal tank sanitization.'
      }
    ]
  },

  {
    id: 'electronics_it',
    title: '💻 Electronics & IT',
    titleAm: '💻 ኤሌክትሮኒክስ እና አይቲ',
    subtitle: 'Computers, printers, CCTV & networks',
    subtitleAm: 'ኮምፒውተር፣ ፕሪንተር፣ ሲሲቲቪ እና ኔትወርክ',

    items: [
      {
        id: 'laptop',
        name: 'Laptop Repair',
        nameAm: 'ላፕቶፕ ጥገና',
        image:
          'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 500,
        priceFormatted: '500 ETB',
        category: 'electronics_it',
        description: 'Screen replacement, keyboard fix, SSD upgrade, thermal paste renewal, and OS setup.'
      },
      {
        id: 'desktop',
        name: 'Desktop PC',
        nameAm: 'ዴስክቶፕ ኮምፒውተር',
        image:
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 450,
        priceFormatted: '450 ETB',
        category: 'electronics_it',
        description: 'Power supply unit testing, motherboard troubleshooting, hardware upgrade, and cleaning.'
      },
      {
        id: 'printer',
        name: 'Printer Fix',
        nameAm: 'ፕሪንተር ጥገና',
        image:
          'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=400&q=80',
        rating: 4.6,
        price: 350,
        priceFormatted: '350 ETB',
        category: 'electronics_it',
        description: 'Laser/Inkjet cartridge refilling, paper jam roller repair, scanner alignment, and driver setup.'
      },
      {
        id: 'router',
        name: 'Router Setup',
        nameAm: 'ራውተር ኮንፊገሬሽን',
        image:
          'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        price: 300,
        priceFormatted: '300 ETB',
        category: 'electronics_it',
        description: 'Ethio Telecom fiber router setup, port forwarding, bandwidth management, and WiFi security.'
      },
      {
        id: 'wifi',
        name: 'WiFi Booster',
        nameAm: 'ዋይፋይ ማጠናከሪያ',
        image:
          'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 250,
        priceFormatted: '250 ETB',
        category: 'electronics_it',
        description: 'Mesh WiFi range extenders, Ethernet cable crimping, and dead zone elimination.'
      },
      {
        id: 'cctv',
        name: 'CCTV Security',
        nameAm: 'ሲሲቲቪ ካሜራ ጥገና',
        image:
          'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 700,
        priceFormatted: '700 ETB',
        category: 'electronics_it',
        description: 'IP & analog camera mounting, NVR/DVR setup, mobile app streaming, and night vision calibration.'
      },
      {
        id: 'network',
        name: 'Network Install',
        nameAm: 'የኔትወርክ መስመር ዝርጋታ',
        image:
          'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 800,
        priceFormatted: '800 ETB',
        category: 'electronics_it',
        description: 'CAT6 structured cabling, patch panel punch down, network switch rack setup, and LAN speed test.'
      }
    ]
  },

  {
    id: 'solar',
    title: '☀️ Solar Energy',
    titleAm: '☀️ የሶላር ኃይል',
    subtitle: 'Panels, inverters & battery backup',
    subtitleAm: 'ሶላር ፓነሎች፣ ኢንቨርተሮች እና ባትሪ',

    items: [
      {
        id: 'solar_panel',
        name: 'Solar Panel',
        nameAm: 'ሶላር ፓነል ተከላ',
        image:
          'https://images.unsplash.com/photo-1509391365360-80a0684f828a?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 1200,
        priceFormatted: '1,200 ETB',
        category: 'solar',
        description: 'Monocrystalline/Polycrystalline rooftop panel mounting, angle alignment, and cabling.'
      },
      {
        id: 'inverter',
        name: 'Inverter Unit',
        nameAm: 'ኢንቨርተር ጥገና',
        image:
          'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 900,
        priceFormatted: '900 ETB',
        category: 'solar',
        description: 'Pure sine wave hybrid inverter calibration, MPPT solar charger troubleshooting, and auto-switch.'
      },
      {
        id: 'battery',
        name: 'Solar Battery',
        nameAm: 'ሶላር ባትሪ ባንክ',
        image:
          'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        price: 800,
        priceFormatted: '800 ETB',
        category: 'solar',
        description: 'Lithium / Gel battery health check, terminal desulfation, BMS testing, and cell balancing.'
      },
      {
        id: 'solar_pump',
        name: 'Solar Pump',
        nameAm: 'የሶላር ውሃ ፓምፕ',
        image:
          'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 1000,
        priceFormatted: '1,000 ETB',
        category: 'solar',
        description: 'DC solar deep well pump controller calibration, dry-run protection, and water flow tuning.'
      },
      {
        id: 'solar_maint',
        name: 'Solar Maintenance',
        nameAm: 'የሶላር ሲስተም ፍተሻ',
        image:
          'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 500,
        priceFormatted: '500 ETB',
        category: 'solar',
        description: 'Panel surface cleaning, voltage testing, wire insulation check, and surge protection renewal.'
      }
    ]
  },

  {
    id: 'plumbing',
    title: '🚿 Plumbing',
    titleAm: '🚿 የቧንቧ አገልግሎት',
    subtitle: 'Pipe leaks, tanks, taps & drainage',
    subtitleAm: 'የቧንቧ ፈሳሽ፣ ታንከር፣ ሻወር እና መታጠቢያ',

    items: [
      {
        id: 'pipe',
        name: 'Pipe Repair',
        nameAm: 'የቧንቧ ጥገና',
        image:
          'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 250,
        priceFormatted: '250 ETB',
        category: 'plumbing',
        description: 'High pressure PPR fusion welding, PVC drain joint repair, and concealed pipe leak detection.'
      },
      {
        id: 'tank',
        name: 'Water Tank',
        nameAm: 'የውሃ ታንከር ጥገና',
        image:
          'https://images.unsplash.com/photo-1542013936693-843d57274f62?auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        price: 600,
        priceFormatted: '600 ETB',
        category: 'plumbing',
        description: 'Rooftop water rotomold tank cleaning, float valve replacement, inlet/outlet re-piping.'
      },
      {
        id: 'toilet',
        name: 'Toilet Fix',
        nameAm: 'የመፀዳጃ ቤት ጥገና',
        image:
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
        rating: 4.6,
        price: 350,
        priceFormatted: '350 ETB',
        category: 'plumbing',
        description: 'Flush tank syphon mechanism repair, gasket replacement, bidet hose fixing, and unclogging.'
      },
      {
        id: 'shower',
        name: 'Shower System',
        nameAm: 'የሻወር ሲስተም',
        image:
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 400,
        priceFormatted: '400 ETB',
        category: 'plumbing',
        description: 'Electric instant water heater install, mixer valve adjustment, shower head descaling.'
      },
      {
        id: 'sink',
        name: 'Sink & Faucet',
        nameAm: 'ሲንክ እና ቧንቧ',
        image:
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        price: 300,
        priceFormatted: '300 ETB',
        category: 'plumbing',
        description: 'Kitchen sink basin fixing, modern mixer faucet installation, trap unclogging, and silicone sealing.'
      },
      {
        id: 'drainage',
        name: 'Drainage Clear',
        nameAm: 'የፍሳሽ ማስወገጃ',
        image:
          'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 450,
        priceFormatted: '450 ETB',
        category: 'plumbing',
        description: 'Main drainage snake clearing, grease trap flushing, floor drain deodorization, and manhole fix.'
      }
    ]
  },

  {
    id: 'painting',
    title: '🏡 Home Improvement',
    titleAm: '🏡 የቤት እድሳት',
    subtitle: 'Painting, masonry, gypsum & carpentry',
    subtitleAm: 'ቀለም ቅብ፣ ጂፕሰም፣ አናፂ እና ሰድር',

    items: [
      {
        id: 'painting_wall',
        name: 'Wall Painting',
        nameAm: 'የግድግዳ ቀለም ቅብ',
        image:
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        price: 1500,
        priceFormatted: '1,500 ETB',
        category: 'painting',
        description: 'Surface preparation, crack filling, wall putty application, and luxury emulsion finishing.'
      },
      {
        id: 'gypsum',
        name: 'Gypsum Board',
        nameAm: 'የጂፕሰም ስራ',
        image:
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 1200,
        priceFormatted: '1,200 ETB',
        category: 'painting',
        description: 'False ceiling gypsum design, partition walls, cornices, hidden LED light cove framing.'
      },
      {
        id: 'carpentry_sub',
        name: 'Carpentry',
        nameAm: 'የእንጨት እና አናፂ ስራ',
        image:
          'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 800,
        priceFormatted: '800 ETB',
        category: 'painting',
        description: 'Door hinge alignment, kitchen cabinet hardware fix, wooden frame repair, and custom shelves.'
      },
      {
        id: 'masonry',
        name: 'Masonry Work',
        nameAm: 'የግንበኝነት ስራ',
        image:
          'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80',
        rating: 4.6,
        price: 900,
        priceFormatted: '900 ETB',
        category: 'painting',
        description: 'Concrete plastering, block patching, doorstep casting, and compound stone wall repair.'
      },
      {
        id: 'welding',
        name: 'Metal Welding',
        nameAm: 'የብረታ ብረት ዌልዲንግ',
        image:
          'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 700,
        priceFormatted: '700 ETB',
        category: 'painting',
        description: 'Compound gate hinge welding, window safety grill installation, and metal staircase repair.'
      },
      {
        id: 'tile',
        name: 'Tile Install',
        nameAm: 'የሴራሚክ እና ሰድር ስራ',
        image:
          'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 1000,
        priceFormatted: '1,000 ETB',
        category: 'painting',
        description: 'Porcelain & ceramic tile laying, epoxy tile grouting, bathroom floor re-leveling.'
      },
      {
        id: 'ceiling',
        name: 'Ceiling Repair',
        nameAm: 'የኮርኒስ ጥገና',
        image:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        price: 850,
        priceFormatted: '850 ETB',
        category: 'painting',
        description: 'Water-damaged ceiling replacement, wooden joist reinforcement, and seamless finish.'
      }
    ]
  },

  {
    id: 'cleaning',
    title: '🧹 Cleaning',
    titleAm: '🧹 የጽዳት አገልግሎት',
    subtitle: 'Deep home, office & upholstery washing',
    subtitleAm: 'የቤት፣ የቢሮ፣ ሶፋ እና ምንጣፍ እጥበት',

    items: [
      {
        id: 'home_clean',
        name: 'Home Clean',
        nameAm: 'የቤት ውስጥ ሙሉ ጽዳት',
        image:
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 800,
        priceFormatted: '800 ETB',
        category: 'cleaning',
        description: 'Complete apartment deep cleaning, floor scrubbing, kitchen degreasing, and window washing.'
      },
      {
        id: 'office_clean',
        name: 'Office Clean',
        nameAm: 'የቢሮ ጽዳት',
        image:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 1000,
        priceFormatted: '1,000 ETB',
        category: 'cleaning',
        description: 'Commercial workstation sanitization, glass partitions, server room dust removal, and trash management.'
      },
      {
        id: 'sofa_clean',
        name: 'Sofa Wash',
        nameAm: 'የሶፋ እና መቀመጫ እጥበት',
        image:
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 600,
        priceFormatted: '600 ETB',
        category: 'cleaning',
        description: 'High pressure steam extraction washing, stain removal, fabric refresh, and deodorization.'
      },
      {
        id: 'carpet_clean',
        name: 'Carpet Clean',
        nameAm: 'የምንጣፍ እጥበት',
        image:
          'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        price: 500,
        priceFormatted: '500 ETB',
        category: 'cleaning',
        description: 'Industrial rotary carpet shampooing, deep fiber allergen removal, and rapid drying.'
      },
      {
        id: 'pest_control',
        name: 'Pest Control',
        nameAm: 'የተባይ መከላከያ ርጭት',
        image:
          'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 900,
        priceFormatted: '900 ETB',
        category: 'cleaning',
        description: 'Safe organic spray for cockroaches, termites, bedbugs, and rodent prevention with warranty.'
      }
    ]
  },

  {
    id: 'outdoor',
    title: '🌿 Outdoor & Garden',
    titleAm: '🌿 የግቢ እና አትክልት ስራ',
    subtitle: 'Lawn landscaping & compound fencing',
    subtitleAm: 'የሳር መቁረጥ፣ የግቢ ጌጥ እና አጥር',

    items: [
      {
        id: 'gardening',
        name: 'Gardening',
        nameAm: 'የአትክልት እንክብካቤ',
        image:
          'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        price: 400,
        priceFormatted: '400 ETB',
        category: 'outdoor',
        description: 'Lawn mowing, tree pruning, soil enrichment, hedge trimming, and sprinkler check.'
      },
      {
        id: 'landscaping',
        name: 'Landscaping',
        nameAm: 'የግቢ ዲዛይን እና ላንድስኬፕ',
        image:
          'https://images.unsplash.com/photo-1558904541-efa873a8e60d?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        price: 1500,
        priceFormatted: '1,500 ETB',
        category: 'outdoor',
        description: 'Compound cobblestone leveling, decorative rock placement, flowerbed design, and turf laying.'
      },
      {
        id: 'fence',
        name: 'Fence Repair',
        nameAm: 'የግቢ አጥር ጥገና',
        image:
          'https://images.unsplash.com/photo-1599809275671-b5942cabc3a2?auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        price: 700,
        priceFormatted: '700 ETB',
        category: 'outdoor',
        description: 'Razor wire installation, corrugated sheet fence bracing, mesh wire tensioning, and painting.'
      }
    ]
  }
];

/* =========================================================
   FLAT ALL_SERVICES LIST (Used across Customer, Tech, Admin)
========================================================= */

export const ALL_SERVICES: ServiceItem[] = ALL_CATEGORY_GROUPS.flatMap((group) =>
  group.items.map((item) => {
    const tr = SERVICE_TRANSLATIONS[item.id];
    return {
      id: item.id,
      name: item.name,
      nameAm: tr?.name.am || item.nameAm,
      nameOm: tr?.name.om,
      nameTi: tr?.name.ti,
      nameSo: tr?.name.so,
      category: item.category,
      price: item.price,
      rating: item.rating,
      reviewsCount: Math.floor(item.rating * 45),
      popular: item.id === 'wiring' || item.id === 'pipe-repair' || item.id === 'pipe' || item.id === 'tv' || item.id === 'painting_wall' || item.id === 'solar_panel' || item.id === 'laptop',
      image: item.image,
      description: item.description,
      descriptionAm: tr?.description.am,
      descriptionOm: tr?.description.om,
      descriptionTi: tr?.description.ti,
      descriptionSo: tr?.description.so
    };
  })
);

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

/**
 * Find one service by its ID.
 */
export const getServiceById = (serviceId: string) => {
  for (const group of ALL_CATEGORY_GROUPS) {
    const service = group.items.find((item) => item.id === serviceId);
    if (service) {
      return service;
    }
  }
  return null;
};

/**
 * Find all services belonging to a category.
 */
export const getServicesByCategory = (categoryId: string) => {
  const group = ALL_CATEGORY_GROUPS.find((group) => group.id === categoryId);
  return group ? group.items : [];
};

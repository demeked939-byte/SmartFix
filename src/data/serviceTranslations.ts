import { Language, ServiceItem, CategoryItem, Booking } from '../types';

export interface ServiceLocalizationEntry {
  name: {
    en: string;
    am: string;
    om: string;
    ti: string;
    so: string;
  };
  description: {
    en: string;
    am: string;
    om: string;
    ti: string;
    so: string;
  };
}

export interface CategoryLocalizationEntry {
  label: {
    en: string;
    am: string;
    om: string;
    ti: string;
    so: string;
  };
  description: {
    en: string;
    am: string;
    om: string;
    ti: string;
    so: string;
  };
}

export const CATEGORY_TRANSLATIONS: Record<string, CategoryLocalizationEntry> = {
  all: {
    label: {
      en: 'All Services',
      am: 'ሁሉም አገልግሎቶች',
      om: 'Tajaajiloota Hundaa',
      ti: 'ኩሎም ኣገልግሎታት',
      so: 'Dhammaan Adeegyada'
    },
    description: {
      en: 'Explore all 36+ certified trade services across Addis Ababa',
      am: 'በአዲስ አበባ የሚገኙ ከ36 በላይ የተረጋገጡ የጥገና አገልግሎቶችን ይመልከቱ',
      om: 'Finfinnee keessatti tajaajiloota ogeessotaa 36+ mirkanaa\'an hunda ilaalaa',
      ti: 'ኣብ ኣዲስ ኣበባ ዝርከቡ ልዕሊ 36 ዝተረጋገጹ ናይ ጥገና ኣገልግሎታት ርኣዩ',
      so: 'Ka baadh dhammaan 36+ adeegyo farsamo oo la xaqiijiyay magaalada Addis Ababa'
    }
  },
  electrical: {
    label: {
      en: 'Electrical',
      am: 'ኤሌክትሪክ',
      om: 'Elektiriikii',
      ti: 'ኤሌክትሪክ',
      so: 'Korontada'
    },
    description: {
      en: 'Wiring, breaker boxes, lighting, generators, power surges',
      am: 'የኤሌክትሪክ መስመሮች፣ ሰርኪውት ብሬከር፣ መብራቶች፣ ጄኔሬተር እና የኃይል ሲስተም',
      om: 'Sarara elektiriikii, saanduqa breekarii, ifaa, jeneraataroota fi sirna humnaa',
      ti: 'መስመራት ኤሌክትሪክ፣ ሰርኪውት ብሬከር፣ መብራህቲ፣ ጄኔሬተርን ጸዓትን',
      so: 'Xadhkaha korontada, sanduuqa kontoroolka, laydhadhka iyo matoorada'
    }
  },
  appliances: {
    label: {
      en: 'Appliances',
      am: 'እቃዎች',
      om: 'Meeshaalee',
      ti: 'ናውቲ ገዛ',
      so: 'Qalabka Guriga'
    },
    description: {
      en: 'Washing machines, refrigerators, microwaves, ovens',
      am: 'ልብስ ማጠቢያ፣ ፍሪጅ፣ ማይክሮዌቭ፣ የኤሌክትሪክ ምድጃ እና የቤት እቃዎች',
      om: 'Maashina uffataa, firiijii, maayikirooweevii, oovenii fi meeshaalee manaa',
      ti: 'ማሽን ሕጽቦ፣ ፍሪጅ፣ ማይክሮዌቭ፣ እቶን ኤሌክትሪክን ናውቲ ገዛን',
      so: 'Mashiinnada dharka, talaagadaha, maaykorooweefta iyo foornooyinka'
    }
  },
  electronics_it: {
    label: {
      en: 'Electronics',
      am: 'ኤሌክትሮኒክስ',
      om: 'Elektirooniiksii',
      ti: 'ኤሌክትሮኒክስ',
      so: 'Elektaroonigga'
    },
    description: {
      en: 'Laptops, PCs, smart TVs, Wi-Fi routers, sound systems',
      am: 'ላፕቶፖች፣ ፒሲ፣ ስማርት ቲቪ፣ ዋይፋይ ራውተር፣ ኔትወርክ እና ሲሲቲቪ ካሜራ',
      om: 'Laaptooppii, PC, TV smart, raawutara Wi-Fi, neetwoorkii fi CCTV',
      ti: 'ላፕቶፕ፣ ፒሲ፣ ስማርት ቲቪ፣ ዋይፋይ ራውተር፣ መርበብን ሲሲቲቪን',
      so: 'Kumbuyuutarrada, TV-yada casriga ah, Wi-Fi router-yada iyo CCTV'
    }
  },
  solar: {
    label: {
      en: 'Solar & Inverter',
      am: 'ሶላር እና ኢንቨርተር',
      om: 'Soolaarii & Invertarii',
      ti: 'ሶላርን ኢንቨርተርን',
      so: 'Cadceedda & Inverter'
    },
    description: {
      en: 'Solar panels, deep cycle batteries, hybrid inverters, UPS',
      am: 'የሶላር ፓነል፣ ዲፕ ሳይክል ባትሪ፣ ሃይብሪድ ኢንቨርተር እና ዩፒኤስ',
      om: 'Paanaalota soolaarii, baankii baatirii, invertarii haayibriidii fi UPS',
      ti: 'ሶላር ፓነላት፣ ባትሪታት፣ ሃይብሪድ ኢንቨርተርን ዩፒኤስን',
      so: 'Qalabka tamarta cadceedda, baatariga, hybrid inverter iyo UPS'
    }
  },
  plumbing: {
    label: {
      en: 'Plumbing',
      am: 'ቧንቧ',
      om: 'Ujummoo',
      ti: 'ቧንቧ',
      so: 'Dhuumaha Biyaha'
    },
    description: {
      en: 'Pipes, water pumps, water heaters (boiler), toilets, sinks',
      am: 'ቧንቧዎች፣ የውሃ ፓምፖች፣ ቦይለር፣ ሽንት ቤት፣ ገንዳ እና ፍሳሽ መስመር',
      om: 'Ujummoolee, paampii bishaanii, boyilarii, mana fincaanii fi dhangala\'aa',
      ti: 'ቧንቧታት፣ ፓምፕ ማይ፣ ቦይለር፣ ሽንትቤት፣ ገንዳን መስመር ፍሳሽን',
      so: 'Dhuumaha biyaha, bamka biyaha, kuleyliyaha, suuliyada iyo biyo-mareenka'
    }
  },
  painting: {
    label: {
      en: 'Improvement',
      am: 'እድሳት',
      om: 'Haareffama',
      ti: 'ምሕዳስ',
      so: 'Dayactirka'
    },
    description: {
      en: 'Interior wall painting, plastering, tile fixing, drywall',
      am: 'የግድግዳ ቀለም ቅብ፣ ፕላስተር፣ ሴራሚክ እና ታይልስ፣ ጂፕሰም እና የእንጨት ስራ',
      om: 'Halluu girgidaa, pilaastaraa, taayilii, dizaayinii jiipsamii fi hojii mukaa',
      ti: 'ሕብሪ መንደቕ፣ ፕላስተር፣ ሴራሚክን ታይልስን፣ ጂፕሰምን ስራሕቲ ዕንጨይትን',
      so: 'Rinjiga darbiyada, malaaska, dhigista foormikada iyo naqshadaynta gypsum'
    }
  },
  cleaning: {
    label: {
      en: 'Cleaning',
      am: 'ጽዳት',
      om: 'Qulqullina',
      ti: 'ጽሬት',
      so: 'Nadiifinta'
    },
    description: {
      en: 'Deep house cleaning, sofas, carpets, post-construction',
      am: 'ሙሉ የቤት ጽዳት፣ የሶፋ እና ምንጣፍ እጥበት፣ የቢሮ ጽዳት እና የተባይ ማጥፋት',
      om: 'Qulqullina manaa guutuu, dhiqannaa soofaa fi kaarpeetii, qulqullina biiroo',
      ti: 'ምሉእ ጽሬት ገዛ፣ ምሕጻብ ሶፋን ምንጻፍን፣ ጽሬት ቢሮታትን ምጥፋእ ባልዕን',
      so: 'Nadiifinta guud ee guriga, dhaqidda kuraasta iyo roogaga, xafiisyada'
    }
  },
  outdoor: {
    label: {
      en: 'Outdoor & Compound',
      am: 'ግቢ እና አትክልት',
      om: 'Mooraa & Biqiltoota',
      ti: 'ቀጽሪን ተኽልን',
      so: 'Barxadda & Beeraha'
    },
    description: {
      en: 'Gardening, compound pavers, fence welding, razor wire',
      am: 'የአትክልት እና ሳር እንክብካቤ፣ ኮብልስቶን፣ የአጥር ብየዳ እና የካምፓውንድ ስራ',
      om: 'Kunuunsa biqiltootaa, dhagaa mooraa, dallaa sibilaa fi eegumsa naannoo',
      ti: 'ክንክን ኣታኽልቲ፣ ኮብልስቶን ቀጽሪ፣ ሓጹርን ዌልዲንግን',
      so: 'Xannaanaynta beeraha, dhagaxa barxadda, dayrka iyo alxanka birta'
    }
  }
};

export const SERVICE_TRANSLATIONS: Record<string, ServiceLocalizationEntry> = {
  wiring: {
    name: {
      en: 'House Wiring',
      am: 'የቤት ኤሌክትሪክ መስመር',
      om: 'Toora Elektiriikii Manaa',
      ti: 'መስመር ኤሌክትሪክ ገዛ',
      so: 'Xadhkaha Korontada Guriga'
    },
    description: {
      en: 'Complete home electrical wiring, breaker panel setup, and short-circuit diagnosis.',
      am: 'ሙሉ የቤት ውስጥ ኤሌክትሪክ ዝርጋታ፣ የብሬከር ቦክስ ገጠማ እና የሾርት ሰርኪውት ምርመራ።',
      om: 'Sarara elektiriikii manaa guutuu, qindeessa saanduqa breekarii fi qorannoo shoortii.',
      ti: 'ምሉእ ዝርጋሐ ኤሌክትሪክ ገዛ፣ ምግጣም ሰርኪውት ብሬከርን ምርመራ ሾርት ሰርኪውትን።',
      so: 'Dhigista xadhkaha korontada ee guriga oo buuxa, xallinta wareegga go\'an iyo baarista nidaamka.'
    }
  },
  socket: {
    name: {
      en: 'Socket Install',
      am: 'ሶኬት ተከላ',
      om: 'Dhaabbii Sookeetii',
      ti: 'ምግጣም ሶኬት',
      so: 'Rakibaadda Burooyinka'
    },
    description: {
      en: 'Heavy duty 16A wall sockets, switches, surge suppressors, and USB modular points.',
      am: 'ጠንካራ 16A የግድግዳ ሶኬቶች፣ ማብሪያ ማጥፊያዎች እና ዩኤስቢ ፖርቶች ገጠማ።',
      om: 'Sookeetota girgidaa 16A jabaa, suwiiçota fi pooyintoota USB qindeessuu.',
      ti: 'ጽኑዓት 16A ሶኬታት መንደቕ፣ መብረይን መጥፍእን ምግጣም ዩኤስቢን።',
      so: 'Ku rakibidda burooyinka gidaarka ee 16A, furayaasha korontada iyo meelaha USB-ga.'
    }
  },
  lighting: {
    name: {
      en: 'Lighting',
      am: 'የመብራት ተከላ',
      om: 'Dhaabbii Ifaa',
      ti: 'ምግጣም መብራህቲ',
      so: 'Rakibaadda Laydhadhka'
    },
    description: {
      en: 'Chandelier mounting, recessed LED ceiling spot fixtures, and ambient strip lights.',
      am: 'የሻንደሌየር፣ የጣሪያ ስፖት ሌድ (LED) መብራቶች እና የጌጥ ብርሃናት ገጠማ።',
      om: 'Chaandaleerii, ifaalee LED baaxii manaa fi ifaalee miidhaginaa fannisuu.',
      ti: 'ምስቃል ሻንደሌየር፣ ናይ ኮርኒስ ስፖት LED መብራህቲታትን ጌጺ መብራህቲታትን።',
      so: 'Sudhista laydhadhka chandeliers-ka, laydhadhka casriga ah ee saqafka iyo laydhadhka qurxinta.'
    }
  },
  breaker: {
    name: {
      en: 'Circuit Breaker',
      am: 'ሰርኪውት ብሬከር',
      om: 'Bireekarii Elektiriikii',
      ti: 'ሰርኪውት ብሬከር',
      so: 'Xakamaynta Korontada'
    },
    description: {
      en: 'Main breaker upgrades, overload protection, distribution box troubleshooting, and grounding.',
      am: 'የዋና ብሬከር ቅያሪ፣ የኦቨርሎድ መከላከያ፣ የዲስትሪቢዩሽን ቦክስ ፍተሻ እና ኤርቲንግ።',
      om: 'Guddisa breekarii guddaa, eegumsa humna dabalataa fi qorannoo saanduqa raabsaa.',
      ti: 'ምቕያር ቀንዲ ብሬከር፣ ምክልኻል ጸቕጢ ጸዓት፣ ምፍታሽ ቦክስ ምከፍፋልን ኤርቲንግን።',
      so: 'Casriyaynta xakamaynta guud ee korontada, ka hortagga culayska xad-dhaafka ah iyo baarista sanduuqa.'
    }
  },
  generator: {
    name: {
      en: 'Generator',
      am: 'ጄኔሬተር ጥገና',
      om: 'Suphaa Jeneraataraa',
      ti: 'ጽገና ጄኔሬተር',
      so: 'Dayactirka Matoorka'
    },
    description: {
      en: 'Diesel and petrol generator tuning, AVR voltage calibration, spark plug and oil change.',
      am: 'የናፍጣ እና ቤንዚን ጄኔሬተር ጥገና፣ የኤቪአር ቮልቴጅ ማስተካከያ እና ዘይት ቅያሪ።',
      om: 'Suphaa jeneraatara diizilii fi petiroolii, sirreeffama AVR fi jijjiirraa zayitaa.',
      ti: 'ጽገና ናፍታን ቤንዚንን ጄኔሬተር፣ ምዕራይ ቮልቴጅ AVRን ምቕያር ዘይትን።',
      so: 'Dayactirka matoorada naaftada iyo batroolka, habeynta danabka AVR iyo beddelka saliidda.'
    }
  },
  pump_elec: {
    name: {
      en: 'Water Pump',
      am: 'የውሃ ፓምፕ ጥገና',
      om: 'Suphaa Paampii Bishaanii',
      ti: 'ጽገና ፓምፕ ማይ',
      so: 'Dayactirka Bamka Biyaha'
    },
    description: {
      en: 'Electric water pump motor winding, automatic float switch, and pressure tank calibration.',
      am: 'የኤሌክትሪክ ውሃ ፓምፕ ሞተር ጥገና፣ አውቶማቲክ ባሊስቴራ እና ፕሬሸር ታንክ ፍተሻ።',
      om: 'Suphaa mootora paampii bishaanii elektiriikii, suwiiçii fi taankii dhiibbaa.',
      ti: 'ጽገና ሞተር ፓምፕ ማይ ኤሌክትሪክ፣ ኣውቶማቲክ ባሊስቴራን መቆጻጸሪ ጸቕጢ ታንከርን።',
      so: 'Dayactirka matoorka bamka biyaha, furaha tooska ah ee xakamaynta iyo hubinta cadaadiska.'
    }
  },
  tv: {
    name: {
      en: 'TV Repair',
      am: 'ቴሌቪዥን ጥገና',
      om: 'Suphaa Televiziyoonaa',
      ti: 'ጽገና ቴሌቪዥን',
      so: 'Dayactirka Telefishinka'
    },
    description: {
      en: 'Smart LED, OLED, backlight strip fixing, mainboard logic testing, and power board diagnosis.',
      am: 'የስማርት ኤልኢዲ እና ኦሌድ ቲቪዎች የጀርባ ብርሃን (Backlight)፣ ሜይንቦርድ እና ፓወር ሰፕላይ ጥገና።',
      om: 'Suphaa TV smart LED/OLED, ifaa duubaa (backlight), booddii fi qorannoo humnaa.',
      ti: 'ጽገና ስማርት LED/OLED ቴሌቪዥን፣ ባክላይት (Backlight)፣ ሜይንቦርድን ፓወር ቦርድን።',
      so: 'Dayactirka TV-yada Smart LED/OLED, laydhadhka dambe, looxa guud iyo qeybta awoodda.'
    }
  },
  'tv-mount': {
    name: {
      en: 'TV Repair & Mounting',
      am: 'ቴሌቪዥን ጥገና እና መስቀያ',
      om: 'Suphaa fi Fannisa Televiziyoonaa',
      ti: 'ጽገናን ምስቃልን ቴሌቪዥን',
      so: 'Dayactirka & Sudhista Telefishinka'
    },
    description: {
      en: 'Smart LED, OLED, backlight strip fixing, mainboard logic testing, and heavy-duty wall bracket mounting.',
      am: 'የስማርት ኤልኢዲ ቲቪ ጥገና፣ የጀርባ መብራት ቅያሪ እና አስተማማኝ የግድግዳ መስቀያ ገጠማ።',
      om: 'Suphaa TV Smart LED, jijjiirraa ifaa duubaa fi fannisa girgidaa jabaa.',
      ti: 'ጽገና ስማርት ቲቪ LED፣ ምቕያር ባክላይትን ምግጣም ድልዱል መስቀሊ መንደቕን።',
      so: 'Dayactirka TV Smart LED, beddelka laydhka iyo ku sudhista gidaarka bir adag.'
    }
  },
  refrigerator: {
    name: {
      en: 'Refrigerator',
      am: 'ፍሪጅ ጥገና',
      om: 'Suphaa Firiijii',
      ti: 'ጽገና ፍሪጅ',
      so: 'Dayactirka Talaagadda'
    },
    description: {
      en: 'Compressor replacement, eco gas refill (R600a/R134a), defrost timer, and thermostat tuning.',
      am: 'የኮምፕረሰር ቅያሪ፣ የጋዝ መሙላት (R600a/R134a)፣ ዲፍሮስት ታይመር እና ቴርሞስታት ጥገና።',
      om: 'Jijjiirraa kompreesaraa, gaazii guutuu (R600a/R134a), taayimarii fi teermoostaatii.',
      ti: 'ምቕያር ኮምፕረሰር፣ ምምላእ ጋዝ (R600a/R134a)፣ ዲፍሮስት ታይመርን ቴርሞስታትን።',
      so: 'Beddelka kombaresarada, buuxinta gaaska talaagadda (R600a/R134a) iyo habeynta heerkulka.'
    }
  },
  washer: {
    name: {
      en: 'Washing Machine',
      am: 'ልብስ ማጠቢያ ማሽን',
      om: 'Maashina Uffata Dhiqu',
      ti: 'ማሽን ሕጽቦ ክዳውንቲ',
      so: 'Mashiinka Dharka'
    },
    description: {
      en: 'Front load and top load drum belt fixing, drain pump replacement, and spin cycle troubleshooting.',
      am: 'የፊት እና የላይ በር ልብስ ማጠቢያ ማሽኖች ድራም፣ የፍሳሽ ፓምፕ እና ስፒን ሳይክል ጥገና።',
      om: 'Suphaa maashina uffataa, jijjiirraa paampii dhangala\'aa fi sirreeffama maraa.',
      ti: 'ጽገና ማሽን ሕጽቦ ክዳን፣ ምቕያር ፓምፕ ፍሳሽን ጸገማት ምብራምን።',
      so: 'Dayactirka mashiinnada dharka ee noocyada kala duwan, beddelka bamka biyaha iyo xallinta wareegga.'
    }
  },
  microwave: {
    name: {
      en: 'Microwave',
      am: 'ማይክሮዌቭ ጥገና',
      om: 'Suphaa Maayikirooweevii',
      ti: 'ጽገና ማይክሮዌቭ',
      so: 'Dayactirka Maaykorooweefta'
    },
    description: {
      en: 'Magnetron tube fixing, high voltage capacitor test, fuse, and touch pad panel repair.',
      am: 'የማግኔትሮን፣ የከፍተኛ ቮልቴጅ ካፓሲተር፣ ፊውዝ እና የንክኪ ፓነል ጥገና።',
      om: 'Suphaa maagneetiroonii, kapaasitara humna olaanaa fi paanaalii tuqaa.',
      ti: 'ጽገና ማግኔትሮን፣ ካፓሲተር ላዕለዋይ ቮልቴጅ፣ ፊውዝን ናይ ተንከፍ ፓነልን።',
      so: 'Dayactirka magnetron-ka, hubinta capacitor-ka awoodda sare iyo hagaajinta kabadhka taabashada.'
    }
  },
  oven: {
    name: {
      en: 'Electric Oven',
      am: 'የኤሌክትሪክ ምድጃ',
      om: 'Oovenii Elektiriikii',
      ti: 'እቶን ኤሌክትሪክ',
      so: 'Foornada Korontada'
    },
    description: {
      en: 'Heating coil replacement, selector rotary switch, thermostat calibration, and door hinge repair.',
      am: 'የማሞቂያ ሽቦ (Coil) ቅያሪ፣ የሙቀት መቆጣጠሪያ ስዊች እና የበሩ ማንጠልጠያ ጥገና።',
      om: 'Jijjiirraa kooyilii ho\'aa, suwiiçii teermoostaatii fi suphaa balbala oovenii.',
      ti: 'ምቕያር ኮይል ምውዓይ፣ መቆጻጸሪ ስዊች፣ ቴርሞስታትን መፈተሊ ማዕጾን።',
      so: 'Beddelka siliga kuleyliyaha, xakamaynta heerkulka iyo dayactirka albaabka foornada.'
    }
  },
  ac: {
    name: {
      en: 'Air Conditioner',
      am: 'ኤሲ እና ማቀዝቀዣ',
      om: 'Qilleensa Qabbaneessituu',
      ti: 'መዝሓሊ ኣየር',
      so: 'Qaboojiyaha Hawada'
    },
    description: {
      en: 'Split AC filter deep cleaning, copper pipe flare fixing, refrigerant top up, and PCB board check.',
      am: 'የኤሲ ማጣሪያ ጽዳት፣ የመዳብ ቧንቧ ጥገና፣ ጋዝ መሙላት እና የፒሲቢ ቦርድ ፍተሻ።',
      om: 'Qulqullina fiiltara AC, suphaa ujummoo koopparii, gaazii guutuu fi booddii PCB.',
      ti: 'ምጽራይ ፊልተር AC፣ ጽገና መስመር ነሓስ፣ ምምላእ ጋዝን ምፍታሽ PCB ቦርድን።',
      so: 'Nadiifinta shaandhada AC-ga, dayactirka dhuumaha naxaasta, buuxinta gaaska iyo hubinta looxa.'
    }
  },
  dispenser: {
    name: {
      en: 'Water Dispenser',
      am: 'የውሃ ማጣሪያ እና ማሞቂያ',
      om: 'Qabbaneessituu Bishaanii',
      ti: 'መዘርጊሒ ማይ',
      so: 'Qaboojiyaha Biyaha'
    },
    description: {
      en: 'Hot and cold water dispenser sanitization, heating tank element, and cooling compressor check.',
      am: 'የውሃ ማጣሪያ፣ ማቀዝቀዣ እና ማሞቂያ እቃዎች ማጽዳት፣ ኤለመንት እና ኮምፕረሰር ጥገና።',
      om: 'Qulqulleessuu dispeensara bishaanii, eelemeentii ho\'aa fi kompreesara qabbaneessaa.',
      ti: 'ምጽራይ መዘርጊሒ ማይ፣ ጽገና ኤለመንት ምውዓይን ኮምፕረሰር ምዝሓልን።',
      so: 'Nadiifinta qalabka biyaha qabowga iyo kulaylka, beddelka element-ka iyo hubinta compressor-ka.'
    }
  },
  laptop: {
    name: {
      en: 'Laptop & IT Repair',
      am: 'ላፕቶፕ እና አይቲ ጥገና',
      om: 'Suphaa Laaptooppii & IT',
      ti: 'ጽገና ላፕቶፕን ITን',
      so: 'Dayactirka Laptop-ka & IT'
    },
    description: {
      en: 'Hardware logic diagnosis, screen and battery replacement, thermal cleaning, and OS recovery.',
      am: 'የማዘርቦርድ ጥገና፣ የስክሪን እና የባትሪ ቅያሪ፣ የሙቀት ማጽዳት እና የኦፐሬቲንግ ሲስተም ጭነት።',
      om: 'Qorannoo loojikii, jijjiirraa iskiriinii fi baatirii, qulqulleessuu ho\'aa fi OS fe\'uu.',
      ti: 'ምርመራ ማዘርቦርድ፣ ምቕያር ስክሪንን ባትሪን፣ ምጽራይ ሙቐትን ምጽዓን ሲስተምን።',
      so: 'Dayactirka looxa guud, beddelka shaashadda iyo batteriga, nadiifinta kuleylka iyo dib-u-habeynta OS-ka.'
    }
  },
  desktop: {
    name: {
      en: 'Desktop Computer',
      am: 'ዴስክቶፕ ኮምፒውተር',
      om: 'Kompiitara Teessumaa',
      ti: 'ኮምፒውተር ደስክቶፕ',
      so: 'Kumbuyuutarka Xafiiska'
    },
    description: {
      en: 'SMPS power supply replacement, RAM/SSD upgrades, GPU graphics card testing, and Windows recovery.',
      am: 'የፓወር ሰፕላይ (SMPS) ቅያሪ፣ የራም እና ኤስኤስዲ ማሳደግ፣ የግራፊክስ ካርድ ፍተሻ።',
      om: 'Jijjiirraa humna SMPS, guddisa RAM/SSD, qorannoo kaardii GPU fi suphaa Windows.',
      ti: 'ምቕያር ፓወር ሰፕላይ SMPS፣ ምዕባይ RAM/SSD፣ ምፍታሽ ግራፊክስ ካርድን ጽገና ዊንዶውስን።',
      so: 'Beddelka qeybta awoodda SMPS, kordhinta RAM/SSD, hubinta kaarka garaafikada iyo Windows.'
    }
  },
  printer: {
    name: {
      en: 'Printer & Scanner',
      am: 'ፕሪንተር እና ስካነር',
      om: 'Piriintara & Iskaanara',
      ti: 'ፕሪንተርን ስካነርን',
      so: 'Qalabka Daabacaadda'
    },
    description: {
      en: 'LaserJet and InkTank paper feed roller, toner cartridge drum, head unclogging, and driver setup.',
      am: 'የሌዘር ጄት እና ኢንክ ታንክ ፕሪንተሮች ሮለር፣ ቶነር፣ ሄድ ማጽዳት እና ድራይቨር መጫን።',
      om: 'Piriintaroota LaserJet fi InkTank, roolara waraqaa, qulqulleessuu heeddii fi diraayivarii.',
      ti: 'ጽገና ፕሪንተር ሌዘርን ኢንክን፣ ሮለር ወረቐት፣ ምጽራይ ቶነርን ምጽዓን ድራይቨርን።',
      so: 'Dayactirka daabacadaha LaserJet iyo InkTank, nadiifinta madaxa daabacaadda iyo darawallada.'
    }
  },
  router: {
    name: {
      en: 'Wi-Fi Router',
      am: 'ዋይፋይ ራውተር',
      om: 'Raawutara Wi-Fi',
      ti: 'ዋይፋይ ራውተር',
      so: 'Qalabka Wi-Fi Router'
    },
    description: {
      en: 'Dual-band Wi-Fi configuration, firewall security, password reset, and firmware updates.',
      am: 'የሁለት ባንድ ዋይፋይ ኮንፊገሬሽን፣ የደህንነት ፋየርዎል፣ የይለፍ ቃል መቀየር እና የፍርምዌር ማዘመኛ።',
      om: 'Qindeessa Wi-Fi, eegumsa faayirwooliitiin, jijjiirraa jecha icciitii fi haaromsa.',
      ti: 'ምዕራይ ዱዋል-ባንድ ዋይፋይ፣ ድሕንነት ፋየርዎል፣ ምቕያር መሕለፊ ቃልን ምሕዳስን።',
      so: 'Habeynta Wi-Fi router-ka, amniga xogta, beddelka sirta iyo cusboonaysiinta firmware-ka.'
    }
  },
  wifi: {
    name: {
      en: 'Mesh Wi-Fi Setup',
      am: 'ሜሽ ዋይፋይ ዝርጋታ',
      om: 'Sirna Wi-Fi Manaa',
      ti: 'ዝርጋሐ ሜሽ ዋይፋይ',
      so: 'Xadhkaha Wi-Fi Mesh'
    },
    description: {
      en: 'Whole-villa seamless mesh Wi-Fi nodes, dead zone elimination, and high speed repeaters.',
      am: 'ለመኖሪያ ቪላዎች እና ቢሮዎች ሙሉ የዋይፋይ ሽፋን መስጠት፣ ድክመት ያለባቸውን ቦታዎች ማስተካከል እና ሪፒተር ገጠማ።',
      om: 'Dhaabbii Wi-Fi mooraa guutuu, iddoowwan mallattoon hin jirre dhabamsiisuu fi ripiitara.',
      ti: 'ምሉእ መሸፈኒ ዋይፋይ ንቪላታትን ቢሮታትን፣ ምእላይ ድኹማት ቦታታትን ምግጣም ሪፒተርን።',
      so: 'Dhisidda shabakad Wi-Fi ah oo buuxda guriga oo dhan, tirtiridda meelaha daciifka ah iyo ku xidhida xoojiyeyaal.'
    }
  },
  cctv: {
    name: {
      en: 'CCTV Security',
      am: 'ሲሲቲቪ ካሜራ',
      om: 'Kaameraa Eegumsaa CCTV',
      ti: 'ሲሲቲቪ ካሜራ ምክትታል',
      so: 'Kaamirooyinka CCTV'
    },
    description: {
      en: 'IP and HD-CVI security cameras, night vision infrared, DVR/NVR network configuration, and mobile viewing.',
      am: 'የአይፒ እና ኤችዲ ካሜራዎች ተከላ፣ የሌሊት እይታ፣ ዲቪአር እና በስልክ ላይ የመከታተያ አሰራር ዝርጋታ።',
      om: 'Dhaabbii kaameraa nageenyaa IP fi HD, ifa halkanii, qindeessa DVR/NVR fi bilbilaan hordofuu.',
      ti: 'ምግጣም አይፒን ኤችዲን ካሜራታት ምክትታል፣ ናይ ለይቲ ራእይ፣ ዲቪአርን ብሞባይል ምዕዛብን።',
      so: 'Ku rakibidda kaamirooyinka amniga ee IP iyo HD, aragga habeenkii, habeynta DVR/NVR iyo ku xidhida taleefanka.'
    }
  },
  network: {
    name: {
      en: 'Office Networking',
      am: 'የቢሮ ኔትወርክ ዝርጋታ',
      om: 'Sarara Neetworkii Biiroo',
      ti: 'ዝርጋሐ መርበብ ቢሮ',
      so: 'Xadhkaha Shabakadda Xafiiska'
    },
    description: {
      en: 'Cat6 Ethernet cabling, RJ45 patch panels, managed switches, and enterprise local server setup.',
      am: 'የCat6 ኔትወርክ ኬብል ዝርጋታ፣ ፓች ፓነል፣ ማኔጅድ ስዊች እና የሎካል ሰርቨር ኮንፊገሬሽን።',
      om: 'Sarara keebilii Cat6, paanaalota paachii, suwiiçii fi qindeessa sarvarii naannoo.',
      ti: 'ዝርጋሐ ኬብል Cat6፣ ፓች ፓነል፣ ማኔጅድ ስዊችን ምዕራይ ሰርቨር ትካልን።',
      so: 'Dhigista xadhkaha Cat6, sanduuqyada xidhiidhka shabakadda, switches-ka iyo habeynta server-ka.'
    }
  },
  solar_panel: {
    name: {
      en: 'Solar Panel System',
      am: 'ሶላር ፓነል ተከላ',
      om: 'Dhaabbii Paanaalii Soolaarii',
      ti: 'ምግጣም ሶላር ፓነል',
      so: 'Rakibaadda Qalabka Cadceedda'
    },
    description: {
      en: 'Monocrystalline rooftop solar panel mounting, angle calibration, and hybrid inverter hookup.',
      am: 'የሞኖክሪስታላይን የጣሪያ ሶላር ፓነሎች ተከላ፣ የአቅጣጫ ማስተካከያ እና ከኢንቨርተር ጋር ማገናኘት።',
      om: 'Dhaabbii paanaalota soolaarii baaxii manaa, sirreeffama kallattii fi walqabsiisa invertarii.',
      ti: 'ምግጣም ናይ ጣራ ሞኖክሪስታላይን ሶላር ፓነል፣ ምዕራይ ኣንፈትን ምትእስሳር ምስ ኢንቨርተርን።',
      so: 'Ku rakibidda muraayadaha cadceedda saqafka guriga, habeynta jihada iyo ku xidhida inverter-ka.'
    }
  },
  inverter: {
    name: {
      en: 'Inverter & Battery',
      am: 'ኢንቨርተር እና ባትሪ',
      om: 'Invertarii & Baatirii',
      ti: 'ኢንቨርተርን ባትሪን',
      so: 'Qalabka Inverter & Baatariga'
    },
    description: {
      en: 'Pure sine wave inverter troubleshooting, charging parameters calibration, and battery equalizer balance.',
      am: 'የፒውር ሳይን ዌቭ ኢንቨርተር ጥገና፣ የቻርጂንግ ልክ ማስተካከያ እና የባትሪ ኢኳላይዘር ሚዛን ፍተሻ።',
      om: 'Suphaa invertarii pure sine wave, sirreeffama chaarjii fi madaallii baankii baatirii.',
      ti: 'ጽገና ኢንቨርተር ፒውር ሳይን ዌቭ፣ ምዕራይ መለክዒ ቻርጅን ምዕራይ ሚዛን ባትሪታትን።',
      so: 'Dayactirka pure sine wave inverter, habeynta habka dallacaadda iyo isu-dheellitirka baatariga.'
    }
  },
  battery: {
    name: {
      en: 'Solar Battery Storage',
      am: 'የሶላር ባትሪ ባንክ',
      om: 'Baankii Baatirii Soolaarii',
      ti: 'ባትሪታት ሶላር',
      so: 'Kaydka Baatariga Cadceedda'
    },
    description: {
      en: 'Lithium LiFePO4 and Deep Cycle Gel battery health diagnosis, BMS testing, and rack assembly.',
      am: 'የሊቲየም (LiFePO4) እና የጄል ባትሪዎች ጤንነት ምርመራ፣ ቢኤምኤስ (BMS) ፍተሻ እና የሬክ ገጠማ።',
      om: 'Qorannoo fayyaa baattirii LiFePO4 fi Jeelii, qorannoo BMS fi qindeessa raakii.',
      ti: 'ምርመራ ጥዕና ባትሪታት ሊቲየምን ጄልን፣ ምፍታሽ BMSን ምግጣም ረክን።',
      so: 'Baarista caafimaadka baatariga Lithium LiFePO4 iyo Gel, hubinta nidaamka BMS iyo isu-habeynta.'
    }
  },
  solar_pump: {
    name: {
      en: 'Solar Water Pump',
      am: 'የሶላር ውሃ ፓምፕ',
      om: 'Paampii Bishaan Soolaarii',
      ti: 'ናይ ሶላር ፓምፕ ማይ',
      so: 'Bamka Biyaha Cadceedda'
    },
    description: {
      en: 'DC solar deep submersible and surface water pump setup, MPPT controller, and dry-run safety.',
      am: 'የሶላር የውሃ ውስጥ እና የውጭ ፓምፕ ተከላ፣ የኤምፒፒቲ (MPPT) መቆጣጠሪያ እና ድራይ ራን መከላከያ።',
      om: 'Dhaabbii paampii bishaanii soolaarii gadi fageenyaa, to\'ataa MPPT fi eegumsa goggogaa.',
      ti: 'ምግጣም ናይ ሶላር ማይ ውሽጢን ላዕልን ፓምፕ፣ መቆጻጸሪ MPPTን ምክልኻል ደረቕ ምጉያይን።',
      so: 'Ku rakibidda bamka biyaha ee ku shaqeeya cadceedda, kantaroolaha MPPT iyo ka hortagga qalalka.'
    }
  },
  solar_maint: {
    name: {
      en: 'Solar Maintenance',
      am: 'የሶላር ሲስተም ፍተሻ',
      om: 'Suphaa Sirna Soolaarii',
      ti: 'ክንክን ሶላር ሲስተም',
      so: 'Dayactirka Nidaamka Cadceedda'
    },
    description: {
      en: 'Panel surface dust cleaning, thermal hotspot drone scan, connection torque check, and yield audits.',
      am: 'የፓነሎች አቧራ ማጽዳት፣ የኮኔክሽን ጥብቀት ፍተሻ እና አጠቃላይ የሃይል አመንጪነት ኦዲት።',
      om: 'Qulqulleessuu dhukkee paanaalotaa, qorannoo walqabsiisaa fi odiitii humna maddisiisuu.',
      ti: 'ምጽራይ ሓመድ ሶላር ፓነላት፣ ምፍታሽ ጽንዓት መላገቢታትን ኦዲት ምፍራይ ጸዓትን።',
      so: 'Nadiifinta boodhka muraayadaha cadceedda, hubinta adkaynta xidhiidhada iyo cabbirka tamarta.'
    }
  },
  pipe: {
    name: {
      en: 'Pipe Leak Repair',
      am: 'የቧንቧ እና ፍሳሽ ጥገና',
      om: 'Suphaa Ujummoo Bishaanii',
      ti: 'ጽገና ቧንቧን ፍሳሽን',
      so: 'Dayactirka Dhuumaha & Qulqulka'
    },
    description: {
      en: 'PPR and PVC pipe leak repair, joint soldering, tap replacement, and drainage clearing.',
      am: 'የፒፒአር (PPR) እና ፒቪሲ ቧንቧዎች ፍሳሽ ጥገና፣ የቧንቧ ራስ ቅያሪ እና የፍሳሽ መስመር ማስተካከያ።',
      om: 'Suphaa dhangala\'aa ujummoo PPR fi PVC, jijjiirraa boombii fi qulqulleessuu dhangala\'aa.',
      ti: 'ጽገና ምፍሳስ ቧንቧታት PPRን PVCን፣ ምቕያር ቧንቧን ምጽራይ መስመር ፍሳሽን።',
      so: 'Dayactirka dhuumaha PPR iyo PVC ee biyuhu ka daadanayaan, beddelka qasabadaha iyo furista.'
    }
  },
  'pipe-repair': {
    name: {
      en: 'Pipe Repair',
      am: 'የቧንቧ እና ፍሳሽ ጥገና',
      om: 'Suphaa Ujummoo Bishaanii',
      ti: 'ጽገና ቧንቧን ፍሳሽን',
      so: 'Dayactirka Dhuumaha & Qulqulka'
    },
    description: {
      en: 'PPR and PVC pipe leak repair, joint soldering, tap replacement, and drainage clearing.',
      am: 'የፒፒአር (PPR) እና ፒቪሲ ቧንቧዎች ፍሳሽ ጥገና፣ የቧንቧ ራስ ቅያሪ እና የፍሳሽ መስመር ማስተካከያ።',
      om: 'Suphaa dhangala\'aa ujummoo PPR fi PVC, jijjiirraa boombii fi qulqulleessuu dhangala\'aa.',
      ti: 'ጽገና ምፍሳስ ቧንቧታት PPRን PVCን፣ ምቕያር ቧንቧን ምጽራይ መስመር ፍሳሽን።',
      so: 'Dayactirka dhuumaha PPR iyo PVC ee biyuhu ka daadanayaan, beddelka qasabadaha iyo furista.'
    }
  },
  tank: {
    name: {
      en: 'Water Tank & Float',
      am: 'የውሃ ታንከር እና ባሊስቴራ',
      om: 'Taankii Bishaanii & Vaalvii',
      ti: 'ታንከር ማይን ባሊስቴራን',
      so: 'Taangiga Biyaha & Faleebada'
    },
    description: {
      en: 'Rooftop water tank leak patch, mechanical brass float valve replacement, and overflow pipe setup.',
      am: 'የጣሪያ የውሃ ታንከር ጥገና፣ የናስ ባሊስቴራ (Float Valve) ቅያሪ እና የትርፍ ውሃ መውጫ መስመር ዝርጋታ።',
      om: 'Suphaa taankii bishaanii baaxii, jijjiirraa vaalvii baalisiteeraa fi toora dhangala\'aa.',
      ti: 'ጽገና ታንከር ማይ ጣራ፣ ምቕያር ባሊስቴራ ነሓስን ምዝርጋሕ መውጽኢ ትርፊ ማይን።',
      so: 'Hagaajinta dillaaca taangiga biyaha ee saqafka, beddelka faleebada naxaasta ah iyo dhuumaha buuxdhaafka.'
    }
  },
  toilet: {
    name: {
      en: 'Toilet & Flush',
      am: 'የሽንት ቤት እቃዎች ጥገና',
      om: 'Qulqulleessituu Mana Fincaanii',
      ti: 'ናውቲ ሽንትቤት ጽገና',
      so: 'Dayactirka Suuliga & Fulaashka'
    },
    description: {
      en: 'Dual-flush siphon replacement, toilet base wax ring resealing, fill valve, and bidet spray fixing.',
      am: 'የሽንት ቤት ፍላሽ ማስተካከያ፣ የሲፎን እና የዋክስ ሪንግ ቅያሪ፣ እንዲሁም የቢዴ ሻወር ገጠማ።',
      om: 'Jijjiirraa sifoona fulaashii, cufaa bu\'uura mana fincaanii fi suphaa shawaarii.',
      ti: 'ምቕያር ሲፎን ፍላሽ ሽንትቤት፣ ምሕታም መሰረት ሽንትቤትን ምግጣም ቢዴ ሻወርን።',
      so: 'Beddelka fulaashka suuliga, hagaajinta salka hoose iyo ku rakibidda shaashadda biyaha.'
    }
  },
  shower: {
    name: {
      en: 'Shower & Mixer',
      am: 'የሻወር እና መታጠቢያ እቃዎች',
      om: 'Shawaarii & Makaa Bishaanii',
      ti: 'ሻወርን መሐወሲ ማይን',
      so: 'Qalabka Qubayska & Qasabada'
    },
    description: {
      en: 'Thermostatic shower mixer cartridge, rainfall head unclogging, and flexible hose replacement.',
      am: 'የሙቅ እና ቀዝቃዛ ውሃ መደባለቂያ (Mixer) ጥገና፣ የሻወር ራስ ማጽዳት እና ተጣጣፊ ቱቦ ቅያሪ።',
      om: 'Suphaa makaa bishaanii ho\'aa fi qabbanaa\'aa, qulqulleessuu shawaarii fi tuuboo.',
      ti: 'ጽገና መሐወሲ ውዑይን ዝሑልን ማይ፣ ምጽራይ ሻወርን ምቕያር ተዓጻፊ ቱቦን።',
      so: 'Dayactirka qasabada isku darta biyaha kulul iyo kuwa qabow, nadiifinta madaxa qubayska iyo beddelka tuubada.'
    }
  },
  sink: {
    name: {
      en: 'Kitchen Sink & Basin',
      am: 'የኩሽና እቃ ማጠቢያ',
      om: 'Saankii Kushiinaa',
      ti: 'ሳንክ ከሽነ',
      so: 'Qasabada & Weel-dhaqa Jikada'
    },
    description: {
      en: 'Under-sink P-trap trap cleaning, swan-neck swivel faucet installation, and silicone waterproof sealing.',
      am: 'ከእቃ ማጠቢያ ስር የሚገኝ ፒ-ትራፕ ፍሳሽ ማጽዳት፣ ቧንቧ መግጠም እና የሲሊኮን ውሃ መከላከያ ማድረግ።',
      om: 'Qulqulleessuu ujummoo saankii kushiinaa jala, dhaabbii boombii fi cufaa siilikonii.',
      ti: 'ምጽራይ ትራፕ ትሕቲ ሳንክ፣ ምግጣም ቧንቧን ምግባር ሲሊኮን መከላኸሊ ማይን።',
      so: 'Nadiifinta dhuumaha saxanka jikada hoostiisa, rakibaadda qasabada wareegta iyo marinista silikoonka.'
    }
  },
  drainage: {
    name: {
      en: 'Drainage Clearing',
      am: 'የፍሳሽ መስመር ማጽዳት',
      om: 'Banuu Dhangala\'aa',
      ti: 'ምጽራይ መስመር ፍሳሽ',
      so: 'Furista Dhuumaha Xidhmay'
    },
    description: {
      en: 'Mechanical snake drain auger, fat & grease unclogging, and manhole inspection chamber flushing.',
      am: 'በማሽን የታፈነ ፍሳሽ መስመር መክፈት፣ የስብ ክምችት ማስወገድ እና የፍሳሽ ጉድጓድ (Manhole) ማጽዳት።',
      om: 'Maashiinaan ujummoo cufame banuu, cooma qulqulleessuu fi boolla dhangala\'aa bishaaniin dhiquu.',
      ti: 'ብማሽን ዝተዓጸወ መስመር ፍሳሽ ምኽፋት፣ ምእላይ ስብሒን ምጽራይ ጉድጓድ ማንሆልን።',
      so: 'Furista dhuumaha biyaha wasakhda ah ee xidhmay, nadiifinta dufanka iyo kormeerka godadka.'
    }
  },
  painting_wall: {
    name: {
      en: 'Wall Painting',
      am: 'የግድግዳ ቀለም ቅብ',
      om: 'Halluu Girgidaa',
      ti: 'ሕብሪ መንደቕ',
      so: 'Rinjiyeynta Darbiyada'
    },
    description: {
      en: 'Interior wall scraping, anti-damp primer coating, and quality emulsion color application.',
      am: 'የውስጥ ግድግዳ ማስተካከል፣ የእርጥበት መከላከያ ፕራይመር እና ጥራት ያለው የኢመልሽን ቀለም ቅብ።',
      om: 'Girgidaa qulqulleessuu, kootii jiidha ittisu fi halluu qulqullina qabu dibuu.',
      ti: 'ምድላው መንደቕ ገዛ፣ ምልካይ መከላኸሊ ርጥበትን ምቕባእ ጽሩይ ሕብሪ ኤመልሽንን።',
      so: 'Diyaarinta gidaarka gudaha, marinista rinjiga ka hortagga qoyaanka iyo rinji tayo sare leh.'
    }
  },
  'house-painting': {
    name: {
      en: 'Wall Painting',
      am: 'የግድግዳ ቀለም ቅብ',
      om: 'Halluu Girgidaa',
      ti: 'ሕብሪ መንደቕ',
      so: 'Rinjiyeynta Darbiyada'
    },
    description: {
      en: 'Interior wall scraping, anti-damp primer coating, and quality emulsion color application.',
      am: 'የውስጥ ግድግዳ ማስተካከል፣ የእርጥበት መከላከያ ፕራይመር እና ጥራት ያለው የኢመልሽን ቀለም ቅብ።',
      om: 'Girgidaa qulqulleessuu, kootii jiidha ittisu fi halluu qulqullina qabu dibuu.',
      ti: 'ምድላው መንደቕ ገዛ፣ ምልካይ መከላኸሊ ርጥበትን ምቕባእ ጽሩይ ሕብሪ ኤመልሽንን።',
      so: 'Diyaarinta gidaarka gudaha, marinista rinjiga ka hortagga qoyaanka iyo rinji tayo sare leh.'
    }
  },
  gypsum: {
    name: {
      en: 'Gypsum Board Design',
      am: 'የጂፕሰም ዲዛይን',
      om: 'Dizaayinii Jiipsamii',
      ti: 'ስራሕቲ ጂፕሰም',
      so: 'Naqshadaynta Gypsum-ka'
    },
    description: {
      en: 'Suspended false ceiling framework, corner coving molding, LED profile channels, and smooth skimming.',
      am: 'የኮርኒስ ጂፕሰም ዲዛይን ዝርጋታ፣ የኤልኢዲ መብራት መስመር ቦይ እና ለስላሳ የማጠናቀቂያ ስራ።',
      om: 'Hojii baaxii jiipsamii, qindeessa ifaa LED fi xumura lallaafaa.',
      ti: 'ናይ ኮርኒስ ጂፕሰም ዲዛይን ምስራሕ፣ መስመር መብራህቲ LEDን ስሉጥ ምዝዛምን።',
      so: 'Dhisidda saqafka gypsum-ka casriga ah, meelaha laydhadhka LED-ka iyo dhammeystir fiican.'
    }
  },
  carpentry_sub: {
    name: {
      en: 'Carpentry & Doors',
      am: 'የእንጨት ስራ እና በር',
      om: 'Hojii Mukaa & Balbala',
      ti: 'ስራሕ ጽሕፈትን ማዕጾን',
      so: 'Najaarnimada & Albaabbada'
    },
    description: {
      en: 'Solid wood door alignment, mortise lock and cylinder fixing, kitchen cabinet hinges, and custom shelving.',
      am: 'የበር ገጠማ፣ የቁልፍ እና ሲሊንደር ቅያሪ፣ የኩሽና ካቢኔት ማንጠልጠያ እና የእንጨት መደርደሪያ ስራ።',
      om: 'Balbala mukaa sirreessuu, jijjiirraa kulfii, suphaa saanduqa kushiinaa fi teessuma.',
      ti: 'ምግጣም ማዕጾ ዕንጨይቲ፣ ምቕያር መዕጸዊ ቁልፊ፣ ካቢኔት ከሽነን መደርደሪን።',
      so: 'Toosinta albaabbada alwaaxda, beddelka qufulada, armaajooyinka jikada iyo khaanadaha.'
    }
  },
  masonry: {
    name: {
      en: 'Masonry & Plastering',
      am: 'የግንበኝነት እና ፕላስተር',
      om: 'Hojii Ijaarsaa & Pilaastaraa',
      ti: 'ስራሕቲ ህንጻን ፕላስተርን',
      so: 'Dhismaha & Malaaska'
    },
    description: {
      en: 'Hollow concrete block (HCB) wall repairs, cement mortar plastering, crack injection, and leveling.',
      am: 'የብሎኬት ግድግዳ ጥገና፣ የሲሚንቶ ፕላስተር ቅብ፣ የስንጥቅ መጠገኛ እና የወለል ማስተካከል ስራ።',
      om: 'Suphaa girgidaa bilookeettii, pilaastara simintoo, suphaa dhoqqee fi sirreeffama lafaa.',
      ti: 'ጽገና መንደቕ ብሎኬት፣ ምልካይ ፕላስተር ሲሚንቶ፣ ምዕራይ ስንጣቐን ምትዕርራይ ባይታን።',
      so: 'Hagaajinta darbiyada dhismaha, malaasidda sibidhka, xallinta dildilaaca iyo simida dhulka.'
    }
  },
  welding: {
    name: {
      en: 'Metal & Welding',
      am: 'የብረት እና ዌልዲንግ ስራ',
      om: 'Hojii Sibilaa & Weldiingii',
      ti: 'ስራሕ ሓጺንን ወልዲንግን',
      so: 'Alxanka & Qalabka Birta'
    },
    description: {
      en: 'Gate hinge welding, security window grill fabrication, razor wire bracket anchor, and rust removal.',
      am: 'የበር እና የካምፓውንድ አጥር ዌልዲንግ፣ የመስኮት ግሪል፣ የሬዘር ዋየር ተከላ እና የዝገት ማጽዳት።',
      om: 'Weldiingii balbala mooraa, qindeessa eegumsa foddaa, reezar waayara fi sibila suphuu.',
      ti: 'ወልዲንግ ማዕጾ ቀጽሪ፣ መከላኸሊ መስኮት ግሪል፣ ምግጣም ሬዘር ዋየርን ምእላይ መ মামቕን።',
      so: 'Alxanka irridda guriga, biraha daaqadaha amniga, ku rakibidda xadhkaha birta fiiqan iyo ka hortagga daxalka.'
    }
  },
  tile: {
    name: {
      en: 'Tile Installation',
      am: 'የሴራሚክ እና ታይልስ ስራ',
      om: 'Dhaabbii Taayilii',
      ti: 'ምግጣም ሴራሚክን ታይልስን',
      so: 'Dhigista Foormikada & Faylka'
    },
    description: {
      en: 'Bathroom and kitchen porcelain tile laying, hollow sounding tile replacement, and epoxy grouting.',
      am: 'የመታጠቢያ ቤት እና የኩሽና ሴራሚክ ንጣፍ፣ የተሰበሩ ታይልሶች ቅያሪ እና የኢፖክሲ ግራውት ስራ።',
      om: 'Dhaabbii taayilii mana fincaanii fi kushiinaa, jijjiirraa taayilii cabee fi qulqulleessuu.',
      ti: 'ምንጻፍ ሴራሚክ ሽንትቤትን ከሽነን፣ ምቕያር ዝተሰብሩ ታይልስን ምዕራይ ግራውትን።',
      so: 'Dhigista faylka suuliga iyo jikada, beddelka kuwa jaban iyo buuxinta xubnaha u dhexeeya.'
    }
  },
  ceiling: {
    name: {
      en: 'Ceiling Repair',
      am: 'የኮርኒስ ጥገና',
      om: 'Suphaa Baaxii Manaa',
      ti: 'ጽገና ኮርኒስ ገዛ',
      so: 'Dayactirka Saqafka Sare'
    },
    description: {
      en: 'Water-stained drywall panel replacement, sagging ceiling reinforcement, and paint touch up.',
      am: 'በውሃ የተበላሸ ኮርኒስ ቅያሪ፣ የወረደ ኮርኒስ ማጠናከሪያ እና የቀለም ማስተካከያ።',
      om: 'Jijjiirraa baaxii bishaaniin miidhamee, jabeesa baaxii gadi bu\'ee fi halluu sirreessuu.',
      ti: 'ምቕያር ብማይ ዝተበላሸወ ኮርኒስ፣ ምድልዳል ዝዘመመ ኮርኒስን ምልካይ ሕብርን።',
      so: 'Beddelka qeybaha saqafka ee biyuhu xumeeyeen, adkaynta saqafka soo foorarsaday iyo rinjiyeyn.'
    }
  },
  home_clean: {
    name: {
      en: 'Deep Home Cleaning',
      am: 'ሙሉ የቤት ውስጥ ጽዳት',
      om: 'Qulqullina Manaa Guutuu',
      ti: 'ምሉእ ጽሬት ገዛ',
      so: 'Nadiifinta Guud ee Guriga'
    },
    description: {
      en: 'Kitchen grease degreasing, bathroom descaling, window sill wiping, and complete floor scrubbing.',
      am: 'የኩሽና ስብ ማጽዳት፣ የመታጠቢያ ቤት እጥበት፣ የመስኮት ጽዳት እና የወለል ማሽን እጥበት።',
      om: 'Qulqullina kushiinaa, dhiqannaa mana fincaanii, qulqulleessuu foddaa fi dhiqannaa lafaa.',
      ti: 'ምጽራይ ስብሒ ከሽነ፣ ሕጽቦ ሽንትቤት፣ ምጽራይ መስኮታትን ብማሽን ምሕጻብ ባይታን።',
      so: 'Nadiifinta dufanka jikada, jeermis-dilista suuliga, nadiifinta daaqadaha iyo maydhista dhulka.'
    }
  },
  office_clean: {
    name: {
      en: 'Office Cleaning',
      am: 'የቢሮ እና የድርጅት ጽዳት',
      om: 'Qulqullina Biiroo & Dhaabbilee',
      ti: 'ጽሬት ቢሮታትን ትካላትን',
      so: 'Nadiifinta Xafiisyada'
    },
    description: {
      en: 'Workstation sanitization, carpet vacuuming, trash disposal, glass partition streak-free wipe down.',
      am: 'የቢሮ ጠረጴዛዎች እና ኮምፒውተሮች ማጽዳት፣ የቫኪዩም ጽዳት፣ የቆሻሻ አወጋገድ እና የመስታወት ጽዳት።',
      om: 'Qulqulleessuu teessuma biiroo, vaakiyuumii kaarpeetii, qulqullina fuullee fi kosiidhaa.',
      ti: 'ጽሬት ጠረጴዛታትን ኮምፒውተራትን ቢሮ፣ ብቫክዩም ምጽራይ ምንጻፍን ምጽራይ መስትያትን።',
      so: 'Nadiifinta miisaska xafiiska, vacuum-garaynta roogaga, qaadista qashinka iyo nadiifinta muraayadaha.'
    }
  },
  sofa_clean: {
    name: {
      en: 'Sofa & Carpet Wash',
      am: 'የሶፋ እና ምንጣፍ እጥበት',
      om: 'Dhiqannaa Soofaa & Kaarpeetii',
      ti: 'ምሕጻብ ሶፋን ምንጻፍን',
      so: 'Dhaqidda Kuraasta & Roogaga'
    },
    description: {
      en: 'High-temperature fabric steam extraction, spot stain lifting, odor neutralization, and quick drying.',
      am: 'በእንፋሎት ማሽን የሶፋ እና ምንጣፍ እጥበት፣ የእድፍ ማጥፋት፣ ሽታ ማስወገድ እና ፈጣን ማድረቅ።',
      om: 'Maashiina steam-itiin soofaa fi kaarpeetii dhiquu, dhibee balleessuu fi saffisaan gogsuu.',
      ti: 'ብናይ ሃፋ ማሽን ምሕጻብ ሶፋን ምንጻፍን፣ ምእላይ ርስሓትን ጸገም ጨናን ብቕልጡፍ ምድርራቕን።',
      so: 'Dhaqidda kuraasta iyo roogaga mashiinka uumiga leh, ka saarista wasakhda madax-adayga ah iyo qalajin degdeg ah.'
    }
  },
  carpet_clean: {
    name: {
      en: 'Deep Carpet Steam',
      am: 'የከባድ ምንጣፍ ማሽን እጥበት',
      om: 'Dhiqannaa Kaarpeetii Guddaa',
      ti: 'ብማሽን ምሕጻብ ምንጻፍ',
      so: 'Nadiifinta Qoto Dheer ee Roogaga'
    },
    description: {
      en: 'Heavy rotary brush shampooing, deep pile dirt extraction, anti-allergen treatment, and moisture removal.',
      am: 'በባለ ሮታሪ ብሩሽ ማሽን ጥልቅ ምንጣፍ እጥበት፣ የአቧራ ማጥራት እና ጸረ-አለርጂ ህክምና።',
      om: 'Birooshii maraatiin kaarpeetii guddaa dhiquu, dhukkee bu\'uuraa baasuu fi miidhaa ittisuu.',
      ti: 'ብሮታሪ ብሩሽ ማሽን ጽኑዕ ሕጽቦ ምንጻፍ፣ ምእላይ ዓሚቝ ሓመድን ምክልኻል አለርጂን።',
      so: 'Mashiinka wareega ee lagu dhaqo roogaga waaweyn, ka saarista ciidda hoose iyo ka hortagga xasaasiyadda.'
    }
  },
  pest_control: {
    name: {
      en: 'Pest & Termite Control',
      am: 'የበረሮ እና ተባይ ማጥፋት',
      om: 'Qoricha Titiisaa & Ilbiisotaa',
      ti: 'ምጥፋእ ባልዕን ሓሳኹን',
      so: 'Xakamaynta Cayayaanka'
    },
    description: {
      en: 'Odorless gel baiting for cockroaches, bed bug thermal/spray eradication, and foundation termite barrier.',
      am: 'ሽታ የሌለው የበረሮ ማጥፊያ ጄል፣ የተኋን እና ሌሎች ተባዮች ማጥፋት እንዲሁም የመሰረት ጥበቃ።',
      om: 'Qoricha foolii hin qabneen titiisa, injiraan fi ilbiisota manaa balleessuu fi eeguu.',
      ti: 'ጨና ዘይብሉ ጄል ምጥፋእ በረሮ፣ ምጥፋእ ተዃንን ሓሳኹን ከምኡ ውን ሓለዋ መሰረት ገዛ።',
      so: 'Dawada aan urta lahayn ee lagu buufiyo baranbarada, dabar-goynta kutada iyo ka hortagga cayayaanka guriga.'
    }
  },
  gardening: {
    name: {
      en: 'Garden Care',
      am: 'የአትክልት እና የሳር እንክብካቤ',
      om: 'Kunuunsa Biqiltootaa & Muka',
      ti: 'ክንክን ኣታኽልትን ሳዕርን',
      so: 'Xannaanaynta Beeraha & Cawska'
    },
    description: {
      en: 'Lawn mowing, hedge bush trimming, ornamental tree pruning, weeding, and compost enrichment.',
      am: 'የሳር መቁረጥ፣ የአጥር አትክልቶች ቅርጽ ማውጣት፣ የዛፎች ቅርንጫፍ መከርከም እና የማዳበሪያ ስራ።',
      om: 'Muraa margaa, qindeessa biqiltootaa, kunuunsa muktiilee fi kompoostii gochuu.',
      ti: 'ምቑራጽ ሳዕሪ፣ ምዕራይ ሓጹር ተኽልታት፣ ምኽርካም ኣእዋምን ምግባር ድኹዕን።',
      so: 'Jiritaanka cawska, habeynta dhirta yaryar, goynta laamaha qalalan iyo bacriminta carrada.'
    }
  },
  landscaping: {
    name: {
      en: 'Landscaping & Cobblestone',
      am: 'የግቢ ዲዛይን እና ላንድስኬፕ',
      om: 'Dizaayinii Mooraa & Dhagaa',
      ti: 'ዲዛይን ቀጽሪን ኮብልስቶንን',
      so: 'Qurxinta Barxadda & Dhagaxda'
    },
    description: {
      en: 'Interlocking concrete pavers, decorative gravel paths, outdoor lighting poles, and drainage slopes.',
      am: 'የግቢ ኮብልስቶን ንጣፍ፣ የጠጠር መንገዶች፣ የውጪ ግቢ መብራቶች እና የዝናብ ውሃ ማስወገጃ ዝርጋታ።',
      om: 'Dhagaa mooraa afuullee, toora cirrachaa, ifaa alaa fi bu\'uura dhangala\'aa bishaanii.',
      ti: 'ምንጻፍ ኮብልስቶን ቀጽሪ፣ መገዲ ጠጠር፣ መብራህቲታት ቀጽሪን መስመር ውሒዝ ማይን።',
      so: 'Dhigista dhagaxa barxadda guriga, waddooyinka qurxoon, laydhadhka deyrka iyo biyo-mareennada.'
    }
  },
  fence: {
    name: {
      en: 'Fence Repair',
      am: 'የግቢ አጥር ጥገና',
      om: 'Suphaa Dallaadhaa & Sibilaa',
      ti: 'ጽገና ሓጹር ቀጽሪ',
      so: 'Dayactirka Dayrka Guriga'
    },
    description: {
      en: 'Perimeter corrugated sheet fixing, security razor concertina wire tightening, and gate latch repair.',
      am: 'የግቢ ቆርቆሮ አጥር ማስተካከል፣ የኮንሰርቲና ሬዘር ዋየር ማጥበቅ እና የበር መቆለፊያ ጥገና።',
      om: 'Suphaa dallaa qorqoorroo, jabeessa reezar waayaraa fi suphaa kulfii karra mooraa.',
      ti: 'ጽገና ሓጹር ቆርቆሮ ቀጽሪ፣ ምጽናዕ ሬዘር ዋየርን ጽገና መዕጸዊ ማዕጾ ቀጽሪን።',
      so: 'Dayactirka dayrka jiingadda ah, adkaynta xadhkaha birta fiiqan iyo hagaajinta qufulka irridda.'
    }
  }
};

/**
 * Universal localized name resolver for any service or booking object.
 */
export function getLocalizedServiceName(
  service?: ServiceItem | Booking | { id?: string; name?: string; serviceName?: string; [key: string]: any } | null,
  lang: Language = 'en'
): string {
  if (!service) return '';

  const sid = (service as any).serviceId || (service as any).id;
  if (sid && SERVICE_TRANSLATIONS[sid]) {
    const localized = SERVICE_TRANSLATIONS[sid].name[lang];
    if (localized) return localized;
  }

  // Check direct localized fields on object
  if (lang === 'am' && ((service as any).nameAm || (service as any).serviceNameAm)) {
    return (service as any).nameAm || (service as any).serviceNameAm;
  }
  if (lang === 'om' && ((service as any).nameOm || (service as any).serviceNameOm)) {
    return (service as any).nameOm || (service as any).serviceNameOm;
  }
  if (lang === 'ti' && ((service as any).nameTi || (service as any).serviceNameTi)) {
    return (service as any).nameTi || (service as any).serviceNameTi;
  }
  if (lang === 'so' && ((service as any).nameSo || (service as any).serviceNameSo)) {
    return (service as any).nameSo || (service as any).serviceNameSo;
  }

  // Check matching by English name if sid wasn't matched
  const baseName = (service as any).name || (service as any).serviceName || '';
  if (baseName) {
    const entry = Object.values(SERVICE_TRANSLATIONS).find(
      (e) => e.name.en.toLowerCase() === baseName.toLowerCase()
    );
    if (entry && entry.name[lang]) {
      return entry.name[lang];
    }
  }

  return baseName || '';
}

/**
 * Universal localized description resolver for any service item.
 */
export function getLocalizedServiceDescription(
  service?: ServiceItem | { id?: string; name?: string; description?: string; [key: string]: any } | null,
  lang: Language = 'en'
): string {
  if (!service) return '';

  const sid = (service as any).serviceId || (service as any).id;
  if (sid && SERVICE_TRANSLATIONS[sid]) {
    const localized = SERVICE_TRANSLATIONS[sid].description[lang];
    if (localized) return localized;
  }

  // Check direct localized fields on object
  if (lang === 'am' && (service as any).descriptionAm) return (service as any).descriptionAm;
  if (lang === 'om' && (service as any).descriptionOm) return (service as any).descriptionOm;
  if (lang === 'ti' && (service as any).descriptionTi) return (service as any).descriptionTi;
  if (lang === 'so' && (service as any).descriptionSo) return (service as any).descriptionSo;

  // Check matching by English name
  const baseName = (service as any).name || '';
  if (baseName) {
    const entry = Object.values(SERVICE_TRANSLATIONS).find(
      (e) => e.name.en.toLowerCase() === baseName.toLowerCase()
    );
    if (entry && entry.description[lang]) {
      return entry.description[lang];
    }
  }

  return (service as any).description || '';
}

/**
 * Universal localized label resolver for any category item.
 */
export function getLocalizedCategoryName(
  category?: CategoryItem | { id?: string; label?: string; name?: string; [key: string]: any } | null,
  lang: Language = 'en'
): string {
  if (!category) return '';

  const cid = (category as any).id;
  if (cid && CATEGORY_TRANSLATIONS[cid]) {
    const localized = CATEGORY_TRANSLATIONS[cid].label[lang];
    if (localized) return localized;
  }

  if (lang === 'am' && (category as any).labelAm) return (category as any).labelAm;
  if (lang === 'om' && (category as any).labelOm) return (category as any).labelOm;
  if (lang === 'ti' && (category as any).labelTi) return (category as any).labelTi;
  if (lang === 'so' && (category as any).labelSo) return (category as any).labelSo;

  return (category as any).label || (category as any).name || '';
}

/**
 * Universal localized description resolver for any category item.
 */
export function getLocalizedCategoryDescription(
  category?: CategoryItem | { id?: string; description?: string; [key: string]: any } | null,
  lang: Language = 'en'
): string {
  if (!category) return '';

  const cid = (category as any).id;
  if (cid && CATEGORY_TRANSLATIONS[cid]) {
    const localized = CATEGORY_TRANSLATIONS[cid].description[lang];
    if (localized) return localized;
  }

  if (lang === 'am' && (category as any).descriptionAm) return (category as any).descriptionAm;
  if (lang === 'om' && (category as any).descriptionOm) return (category as any).descriptionOm;
  if (lang === 'ti' && (category as any).descriptionTi) return (category as any).descriptionTi;
  if (lang === 'so' && (category as any).descriptionSo) return (category as any).descriptionSo;

  return (category as any).description || '';
}

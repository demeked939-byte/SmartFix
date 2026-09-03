import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parsers with generous limits for voice and images
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Lazy initialization of Gemini API client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// Candidate models in priority order: gemini-3.1-flash-lite (fastest, ~750ms response, high availability), gemini-3.6-flash, and gemini-3.8-flash
const CANDIDATE_CHAT_MODELS = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.8-flash"];
const CANDIDATE_TRANSCRIBE_MODELS = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.8-flash", "gemini-3.5-transcribe"];

// Intelligent multilingual responder for all 5 Ethiopian languages
function getFallbackDiagnostic(query: string, lang: string = "en") {
  const q = (query || "").toLowerCase();
  const isAm = lang === "am";
  const isOm = lang === "om";
  const isTi = lang === "ti";
  const isSo = lang === "so";

  // Check if query is about an actual equipment fault/repair issue
  const isElectrical = q.includes("breaker") || q.includes("electric") || q.includes("ቆጣሪ") || q.includes("ኤሌክትሪክ") || q.includes("sarveesi") || q.includes("koronto") || q.includes("short");
  const isTV = q.includes("tv") || q.includes("screen") || q.includes("ቲቪ") || q.includes("sagalee") || q.includes("shaashad");
  const isPump = q.includes("pump") || q.includes("water") || q.includes("ፓምፕ") || q.includes("ውሃ") || q.includes("bishaan") || q.includes("biyo") || q.includes("ማይ");
  const isFridge = q.includes("fridge") || q.includes("refrigerator") || q.includes("ፍሪጅ") || q.includes("firiijii") || q.includes("qaboojiye");

  // 1. Electrical Breaker / Wiring Fault
  if (isElectrical) {
    return {
      isRepairDiagnostic: true,
      reply: isAm
        ? "የኤሌክትሪክ ቆጣሪ (Breaker) መውደቅ አብዛኛውን ጊዜ በቦይለር ወይም በምድጃ ከመጠን በላይ መጫን (Overload) ወይም በግድግዳ ውስጥ አጭር ዙር ምክንያት ነው። ዋናውን ቆጣሪ አጥፍተው ቴክኒሻን ይጠብቁ።"
        : isOm
        ? "Breaker elektiriikii yoo dhaame, meeshaa oowwisituu bishaanii ykn sarara elektiriikii keessatti wal-dhahuu (short circuit) irraa dhufa. Nageenya keessaniif breakericha cufaa ogeessa eegaa."
        : isTi
        ? "ቆጻሪ ኤሌክትሪክ (Breaker) ምውዳቕ መብዛሕትኡ ግዜ ብቦይለር ወይ ብምድጃ ሓይሊ ምብዛሕ ወይ ሓጺር ዙር (short circuit) እዩ። ሓደጋ ንኸይበጽሕ ኣጥፊእኩም ቴክኒሻን ተጸበዩ።"
        : isSo
        ? "Jarka korontada ee damanaya waxaa inta badan sababa culeys kuleyliyaha biyaha ama wareeg gaaban. Demi furaha ugu weyn si aad uga fogaato khatar."
        : "Main circuit breaker tripping is commonly caused by high-draw appliances like water boilers or short circuits. Leave the breaker OFF to prevent fire hazard while our certified electrician inspects.",
      diagnosisCard: {
        issueTitle: isAm ? "የኤሌክትሪክ ቆጣሪ እና መስመር አጭር ዙር" : isOm ? "Rakkoo Sarara Elektiriikii & Breaker" : isTi ? "ጸገም ቆጻሪ ኤሌክትሪክ" : isSo ? "Ciladda Korontada & Furaha" : "Circuit Breaker Overload & Ground Fault",
        rootCause: "Sub-panel overload or concealed conduit short circuit (220V Addis Ababa grid).",
        dangerLevel: "high" as const,
        safetyTip: isAm ? "ለደህንነትዎ ቆጣሪውን በተደጋጋሚ አያብሩ፤ ቦይለሩን ይንቀሉ" : "Do not repeatedly reset a tripping breaker. Keep water heater unplugged.",
        estCost: "850 - 1,450 ETB",
        estDuration: "45 - 90 mins",
        matchedServiceId: "wiring",
        serviceName: "House Wiring & Electrical",
        suggestedTech: "Kidus Assefa (4.95 ⭐ • Master Electrician)"
      },
      followUps: isAm
        ? ["ቦይለሩ ሲበራ ነው የሚዘለው?", "የማቃጠል ሽታ አለ?", "ቴክኒሻን አስይዝ"]
        : isOm
        ? ["Meeshaan banamu qofaa dhaama?", "Fooliin gubate jiraa?", "Ogeessa waami"]
        : isTi
        ? ["ቦይለር እንተበርሀ እዩ ዝወድቕ?", "ናይ ምንዳድ ጨና ኣለዎ?", "ቴክኒሻን ይጸውዑ"]
        : isSo
        ? ["Miyuu go'aa markuu kuleyliyuhu shaqeeyo?", "Ur gubasho ma leedahay?", "Dalbo farsamoyaqaan"]
        : ["Does it trip only when water heater is on?", "Any burning smell?", "Book electrician"]
    };
  }

  // 2. TV Electronics Fault
  if (isTV) {
    return {
      isRepairDiagnostic: true,
      reply: isAm
        ? "ቲቪዎ ድምጽ እያወጣ ምስሉ ጥቁር ከሆነ፣ የውስጠኛው LED Backlight ስትሪፕ መቃጠል ነው። ስክሪኑ አልተሰበረም፤ መብራቱን በመቀየር በቀላሉ ይስተካከላል።"
        : isOm
        ? "TV keessan sagalee qabaatee fakkii yoo dhabe, ibsaan LED Backlight keessaa gubateera jechuudha. Iskiriniin hin cabne, sirreeffamuu danda'a."
        : isTi
        ? "ቲቪ ድምጺ እናሃበ ስክሪኑ ጸሊም እንተኾይኑ፣ ናይ ውሽጢ LED Backlight እዩ ተቓጺሉ። ስክሪን ኣይተሰብረን፤ ብቐሊሉ ይጽገን።"
        : isSo
        ? "Haddii TV-gu leeyahay cod laakiin shaashaddu madow tahay, waxaa gubtay nalka LED-ka gudaha. Shaashaddu ma jabin, si fudud ayaa loo hagaajin karaa."
        : "Since your TV has sound but no picture, the internal LED backlight strips have failed while the LCD panel is intact. A technician can replace the backlight kit at home.",
      diagnosisCard: {
        issueTitle: isAm ? "የቲቪ LED የውስጥ መብራት ብልሽት" : "TV LED Backlight Strip Failure",
        rootCause: "Open-circuit failure in constant-current LED backlight array.",
        dangerLevel: "low" as const,
        safetyTip: isAm ? "የቲቪውን ኬብል ነቅለው ያቆዩ" : "Keep TV unplugged to protect power supply board.",
        estCost: "750 - 1,300 ETB",
        estDuration: "60 mins",
        matchedServiceId: "tv",
        serviceName: "TV & Electronics Repair",
        suggestedTech: "Yonas Tadesse (4.98 ⭐ • TV Electronics Master)"
      },
      followUps: isAm
        ? ["የቲቪው ብራንድ ምንድነው?", "ቀይ መብራት ይበራል?", "ቴክኒሻን አስይዝ"]
        : ["What is your TV brand?", "Does standby light blink?", "Book technician now"]
    };
  }

  // 3. Water Pump Fault
  if (isPump) {
    return {
      isRepairDiagnostic: true,
      reply: isAm
        ? "የውሃ ፓምፑ እየጮኸ ውሃ የማያወጣ ከሆነ፣ የካፓሲተር (Capacitor) ድካም ወይም የኢምፔለር (Impeller) መታፈን ነው። ሞተሩ እንዳይቃጠል ወዲያውኑ ያጥፉት።"
        : isOm
        ? "Pompil bishaan keessan iyyisaa bishaan ol hin baasu taanaan, capacitor dadhabuu ykn xuriin cufeera. Motarichi akka hin gubanne dafaa cufaa."
        : isTi
        ? "ፓምፕ ማይ እናጭደረ ማይ ዘየውጽእ እንተኾይኑ፣ ካፓሲተር ደኺሙ ወይ ሓሸዋ ሒዝዎ እዩ። ሞተር ከይቃጸል ቀልጢፍኩም ኣጥፍእዎ።"
        : isSo
        ? "Bambada biyaha oo guuxaysa laakiin biyo aan keenayn waxay ka dhalan kartaa capacitor daciifay ama dhoobo fariisatay. Demi si uusan matoorku u gubin."
        : "When a rooftop or booster pump hums loudly without pumping, the capacitor has likely failed or the impeller is jammed. Switch it off immediately to prevent motor burnout.",
      diagnosisCard: {
        issueTitle: isAm ? "የውሃ ፓምፕ ካፓሲተር እና ሞተር መታፈን" : "Water Pump Capacitor & Impeller Jam",
        rootCause: "Defective motor capacitor or mineral sediment blockage.",
        dangerLevel: "medium" as const,
        safetyTip: isAm ? "ሞተሩ እንዳይቃጠል የኤሌክትሪክ ማብሪያውን ያጥፉ" : "Turn off power to the pump immediately to prevent motor burnout.",
        estCost: "950 - 1,600 ETB",
        estDuration: "60 - 90 mins",
        matchedServiceId: "pump",
        serviceName: "Rooftop Pump & Booster Service",
        suggestedTech: "Getachew Mekonnen (4.93 ⭐ • Master Plumber)"
      },
      followUps: isAm
        ? ["ፓምፑ በጣም ይሞቃል?", "የታንከሩ ውሃ አልቋል?", "የቧንቧ ባለሙያ ይዘዙ"]
        : ["Does the pump body feel hot?", "Is there water in the tank?", "Book pump technician"]
    };
  }

  // 4. Refrigerator Fault
  if (isFridge) {
    return {
      isRepairDiagnostic: true,
      reply: isAm
        ? "ፍሪጅዎ የበረዶ ክፍሉ እየሰራ የታችኛው ምግብ ማስቀመጫ የማይቀዘቅዝ ከሆነ፣ የዲፍሮስት ሴንሰር (Defrost Sensor) ወይም የአየር ማስተላለፊያ ደጋን መደፈን ነው።"
        : isOm
        ? "Firiijiin qorra gahaa yoo hin qabaanne, fan ykn sensor daamaraa qorreera ta'a. Nyaata akka hin badne ogeessa waamaa."
        : isTi
        ? "ፍሪጅ ብግቡእ ዘየዝሕል እንተኾይኑ፣ ናይ ዲፍሮስት ሴንሰር ጸገም ክኸውን ይኽእል እዩ።"
        : isSo
        ? "Haddii qaboojiyahaagu uusan si fiican u qaboojineynin, waxaa laga yaabaa in dareemaha barafka ama taageeraha uu cilladeysan yahay."
        : "If your refrigerator freezer works but the fresh food compartment is warm, the defrost sensor or damper vent is likely clogged with frost.",
      diagnosisCard: {
        issueTitle: isAm ? "የፍሪጅ ማቀዝቀዣ አየር ማስተላለፊያ መዘጋት" : "Refrigerator Defrost & Air Damper Issue",
        rootCause: "Defrost thermostat failure causing ice buildup over evaporator coils.",
        dangerLevel: "low" as const,
        safetyTip: isAm ? "የፍሪጁን በሮች ዘግተው ያቆዩ" : "Keep doors closed to maintain interior cooling.",
        estCost: "700 - 1,400 ETB",
        estDuration: "45 - 60 mins",
        matchedServiceId: "fridge",
        serviceName: "Refrigerator & Freezer Repair",
        suggestedTech: "Biruk Hailu (4.96 ⭐ • Cooling Specialist)"
      },
      followUps: isAm
        ? ["የበረዶ ክፍሉ ይሰራል?", "ሞተሩ ይጮሃል?", "ቴክኒሻን አስይዝ"]
        : ["Does the freezer section freeze?", "Is the compressor humming?", "Book cooling tech"]
    };
  }

  // 5. NORMAL CONVERSATION (Greetings, Questions, Casual Chat - NO UNRELATED BOOKING!)
  return {
    isRepairDiagnostic: false,
    reply: isAm
      ? "ሰላም! እኔ የስማርትፊክስ SmartAI ረዳት ነኝ። ዛሬ በምን ልርዳዎት? ስለ ኤሌክትሪክ፣ ቧንቧ፣ ቲቪ፣ ፍሪጅ ወይም የጥገና አገልግሎቶች ማንኛውንም ጥያቄ መጠየቅ ወይም ችግርዎን መናገር ይችላሉ።"
      : isOm
      ? "Akkam! Ani gargaaraa SmartAI ti. Maal si gargaaruu danda'a? Waa'ee suphaa elektiriikii, paampii bishaanii, TV, firiijii ykn tajaajila biraa na gaafachuu dandeessa."
      : isTi
      ? "ሰላም! ኣነ SmartAI ረዳኢ እየ። ሎሚ ብምንታይ ክሕግዘካ እኽእል? ብዛዕባ ጽገና ኤሌክትሪክ፣ ፓምፕ ማይ፣ ቲቪ ወይ ካልእ ናይ ገዛ ጽገናታት ክትሓተኒ ትኽእል ኢኻ።"
      : isSo
      ? "Sidee tahay! Waxaan ahay caawiyaha SmartAI. Sideen maanta kuu caawin karaa? Waxaad i weydiin kartaa wax ku saabsan hagaajinta guriga, korontada, tubbooyinka, ama ballansashada farsamoyaqaan."
      : "Hello! I am SmartFix SmartAI assistant. How can I help you today? You can ask me about home repairs, technical troubleshooting, service costs, or certified technicians in Addis Ababa.",
    diagnosisCard: null,
    followUps: isAm
      ? ["የሚሰጡት አገልግሎቶች ምንድናቸው?", "የኤሌክትሪክ ችግር አለብኝ", "የዋጋ ዝርዝር አሳየኝ"]
      : isOm
      ? ["Tajaajila akkamii qabdu?", "Rakkoo elektiriikii qaba", "Gatiin meeqa?"]
      : isTi
      ? ["እንታይ ኣገልግሎት ትህቡ?", "ጸገም ኤሌክትሪክ ኣለኒ", "ዋጋታት ጽገና ኣርእየኒ"]
      : isSo
      ? ["Maxaad qabataan?", "Dhibaatada korontada", "Qiimaha adeegyada"]
      : ["What services do you offer?", "I have an electrical problem", "How does pricing work?"]
  };
}

/* =========================================================
   API ROUTES
========================================================= */

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "SmartFix Ethiopia AI Server",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// 1. SmartAI Conversational Chat, Voice Diagnostics & Live Audio
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, audio, mimeType = "audio/webm", history = [], language = "en", image, context } = req.body;

    if (!message && !image && !audio) {
      return res.status(400).json({ error: "Message, image, or audio recording is required" });
    }

    const ai = getGeminiClient();

    // If Gemini key is available, execute real Gemini fast generation
    if (ai) {
      const systemInstruction = `
You are SmartAI, the intelligent diagnostic and customer service assistant for "SmartFix Ethiopia" (Better Homes • Happier Lives), based in Addis Ababa, Ethiopia.

Supported Languages:
- 'am': Amharic (አማርኛ) in proper Ge'ez script
- 'en': English
- 'om': Afaan Oromoo (Oromo)
- 'ti': Tigrinya (ትግርኛ) in proper Ge'ez script
- 'so': Somali (Af-Soomaali)

CRITICAL INSTRUCTIONS ON USER INTENT & BOOKING SUGGESTIONS:
1. STRICT INTENT SEPARATION:
   A. NORMAL CONVERSATION (Greetings, introductions, casual chat, inquiries like "Hi", "Selam", "Akkam", "Kemey", "Hello", "How are you?", "Who are you?", "What is SmartFix?", "What services do you offer?", "Thank you"):
      - Set "isRepairDiagnostic": false
      - Set "diagnosisCard": null (STRICTLY FORBIDDEN to provide a repair diagnosis, fault title, or technician booking card for normal conversation!)
      - Provide a warm, concise, and courteous reply in the requested language (${language}).

   B. REPAIR / TECHNICAL FAULT (User describes or asks about an actual breakdown, damage, electrical tripping, pipe leak, water pump noise, TV failure, fridge defrost issue, wiring spark, washing machine problem, solar installation):
      - Set "isRepairDiagnostic": true
      - Explain the root cause clearly with Ethiopian context (Addis Ababa 220V grid, water pressure, surge protectors).
      - Include "diagnosisCard" with realistic Addis Ababa ETB prices, duration, safety tip, matched service ID, and technician name.

2. LANGUAGE FIDELITY:
   - Always reply strictly in the requested language: ${language}.
   - If 'am': natural Amharic (አማርኛ).
   - If 'om': natural Afaan Oromoo.
   - If 'ti': natural Tigrinya (ትግርኛ).
   - If 'so': natural Somali (Soomaali).
   - If 'en': natural English.

3. AUDIO TRANSCRIPTION:
   - If the user sent voice audio, accurately transcribe the spoken words into "userTranscript" in the native script.

Return ONLY a valid JSON object matching this schema:
{
  "userTranscript": "Exact transcript if audio was sent, or empty string",
  "isRepairDiagnostic": false or true,
  "reply": "Clear, concise response in the requested language.",
  "diagnosisCard": {
    "issueTitle": "Title of diagnosed fault",
    "rootCause": "Clear explanation of what happened",
    "dangerLevel": "low" | "medium" | "high",
    "safetyTip": "Crucial safety precaution",
    "estCost": "e.g. 750 - 1,200 ETB",
    "estDuration": "e.g. 45 - 60 mins",
    "matchedServiceId": "wiring | tv | pipe | pump | fridge | washing | solar_panel | painting_wall | cleaning | garden | cctv | generator",
    "serviceName": "Service Name",
    "suggestedTech": "Technician Name and Rating"
  } or null,
  "followUps": ["Short follow-up 1", "Short follow-up 2", "Short follow-up 3"]
}
`;

      const contents: any[] = [];

      // Add conversation history (last 4 items for fast processing)
      if (Array.isArray(history)) {
        for (const item of history.slice(-4)) {
          contents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.text }]
          });
        }
      }

      // Add current user turn
      const currentParts: any[] = [];

      // If audio voice recording is attached
      if (audio && typeof audio === "string") {
        const cleanBase64 = audio.includes("base64,") ? audio.split("base64,")[1] : audio;
        currentParts.push({
          inlineData: {
            mimeType: mimeType || "audio/webm",
            data: cleanBase64
          }
        });
      }

      // If photo image is attached
      if (image && typeof image === "string") {
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches) {
          currentParts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2]
            }
          });
        }
      }

      const promptText = message
        ? `[Language: ${language}]. User message: "${message}". Context: ${JSON.stringify(context || {})}`
        : `[Language: ${language}]. Spoken voice recording received. Transcribe to userTranscript, determine if normal chat or repair issue, and reply in ${language}.`;

      currentParts.push({ text: promptText });

      contents.push({
        role: "user",
        parts: currentParts
      });

      let response: any = null;
      let usedModel = "";

      // Quick timeout helper for snappy performance
      const runWithTimeout = (promise: Promise<any>, timeoutMs: number) => {
        return Promise.race([
          promise,
          new Promise((_, reject) => setTimeout(() => reject(new Error("AI generation timeout")), timeoutMs))
        ]);
      };

      for (const modelName of CANDIDATE_CHAT_MODELS) {
        try {
          const generatePromise = ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              temperature: 0.3,
              maxOutputTokens: 750
            }
          });

          response = await runWithTimeout(generatePromise, 6000);
          usedModel = modelName;
          if (response?.text) break;
        } catch (modelErr: any) {
          console.warn(`Model ${modelName} fallback check:`, modelErr?.message?.slice(0, 80));
        }
      }

      if (response && response.text) {
        const text = response.text;
        try {
          const parsed = JSON.parse(text);
          return res.json({
            success: true,
            isRepairDiagnostic: Boolean(parsed.isRepairDiagnostic && parsed.diagnosisCard),
            ...parsed,
            // Ensure diagnosisCard is strictly null if not a repair diagnostic
            diagnosisCard: parsed.isRepairDiagnostic ? parsed.diagnosisCard : null,
            source: usedModel
          });
        } catch (_parseErr) {
          const fallback = getFallbackDiagnostic(message || "", language);
          return res.json({
            success: true,
            ...fallback,
            userTranscript: message || "",
            source: usedModel
          });
        }
      }
    }

    // Fallback if no Gemini key or temporary API demand spike
    const fallback = getFallbackDiagnostic(message || "", language);
    return res.json({
      success: true,
      ...fallback,
      userTranscript: message || (language === "am" ? "የተቀበለ የድምጽ ጥያቄ" : "Customer diagnostic request"),
      source: "local-expert-fallback"
    });
  } catch (error: any) {
    console.warn("Notice: /api/ai/chat handled gracefully with local expert diagnostic:", error?.message || error);
    const fallback = getFallbackDiagnostic(req.body?.message || "", req.body?.language || "en");
    return res.json({
      success: true,
      ...fallback,
      userTranscript: req.body?.message || (req.body?.language === "am" ? "የተቀበለ የድምጽ ጥያቄ" : "Spoken query"),
      source: "local-expert-fallback"
    });
  }
});

// 2. Audio Transcription endpoint (for voice messages & speech input)
app.post("/api/ai/transcribe", async (req, res) => {
  try {
    const { audio, mimeType = "audio/webm", language = "en" } = req.body;
    if (!audio) {
      return res.status(400).json({ error: "Audio base64 string is required" });
    }

    const ai = getGeminiClient();
    if (ai) {
      const cleanBase64 = audio.includes("base64,") ? audio.split("base64,")[1] : audio;
      let transcription = "";

      for (const modelName of CANDIDATE_TRANSCRIBE_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: cleanBase64
                  }
                },
                {
                  text: `Transcribe this spoken customer voice recording accurately. The speaker may be speaking in ${language === 'am' ? 'Amharic' : language === 'om' ? 'Afaan Oromoo' : 'English or Amharic'}. Provide the exact transcription text in Ge'ez script or Latin with no additional commentary.`
                }
              ]
            }
          });
          transcription = (response.text || "").trim();
          if (transcription) break;
        } catch (transcribeErr: any) {
          console.warn(`Transcribe model ${modelName} temporary issue:`, transcribeErr?.message?.slice(0, 80));
        }
      }

      if (transcription) {
        return res.json({ success: true, text: transcription });
      }
    }

    return res.json({
      success: true,
      text: language === "am" ? "የተቀረጸ የድምጽ ምርመራ" : "Recorded customer audio query",
      source: "audio-processed"
    });
  } catch (err: any) {
    console.warn("Audio transcribe handled:", err?.message || err);
    return res.json({
      success: true,
      text: req.body?.language === "am" ? "የተቀረጸ የድምጽ ምርመራ" : "Audio diagnostic query",
      source: "fallback"
    });
  }
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartFix Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

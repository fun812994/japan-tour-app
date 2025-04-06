const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Complete station data with comma-separated strings for arrays
const sampleStations = [
  {
    id: "yoyogi-koen",
    google_places_id: "ChIJ501nTLOMGGARiLbhrnLmKok",
    name: "Yoyogi-Koen Station",
    name_ja: "代々木公園駅",
    name_ko: "요요기 공원역",
    latitude: 35.6690987,
    longitude: 139.68996339999998,
    address: "1 Chome-7 Tomigaya, Shibuya, Tokyo 151-0063, Japan",
    prefecture: "Tokyo",
    city: "Shibuya",
    lines: "Tokyo Metro Chiyoda,Tokyo Metro Fukutoshin",
  },
];

// Complete culture data with comma-separated strings for arrays
const sampleCulture = [
  {
    station_id: "yoyogi-koen",
    language: "en",
    short_description:
      "A peaceful station near the beautiful Yoyogi Park, perfect for nature and culture lovers.",
    full_description:
      "Yoyogi-Koen Station provides direct access to one of Tokyo's largest and most popular parks. The station area combines urban convenience with natural beauty, offering visitors easy access to both the tranquil Yoyogi Park and the vibrant Shibuya area.",
    history:
      "The station was established to serve the growing residential area around Yoyogi Park. The park itself has a rich history, originally serving as a military parade ground and later as the Olympic Village for the 1964 Tokyo Olympics.",
    cultural_tips:
      "Visit early morning to see locals practicing tai chi or yoga in the park. The park is especially beautiful during cherry blossom season.",
    recommended_spots: "Yoyogi Park,Meiji Shrine,NHK Studio Park",
  },
  {
    station_id: "yoyogi-koen",
    language: "ko",
    short_description:
      "아름다운 요요기 공원 근처의 평화로운 역으로, 자연과 문화 애호가들에게 완벽한 장소입니다.",
    full_description:
      "요요기 코엔역은 도쿄의 가장 크고 인기 있는 공원 중 하나인 요요기 공원으로 바로 연결됩니다. 역 주변은 도시의 편리함과 자연의 아름다움이 조화를 이루어, 방문객들에게 평화로운 요요기 공원과 활기찬 시부야 지역 모두에 쉽게 접근할 수 있는 기회를 제공합니다.",
    history:
      "이 역은 요요기 공원 주변의 성장하는 주거 지역을 위해 설립되었습니다. 공원 자체는 원래 군사 퍼레이드 장소였고, 후에 1964년 도쿄 올림픽의 올림픽 선수촌으로 사용되었습니다.",
    cultural_tips:
      "이른 아침에 방문하면 공원에서 태극권이나 요가를 연습하는 현지인들을 볼 수 있습니다. 벚꽃 시즌에 공원이 특히 아름답습니다.",
    recommended_spots: "요요기 공원,메이지 신궁,NHK 스튜디오 파크",
  },
];

async function updateStations() {
  try {
    console.log("Updating stations with additional data...");

    // Update stations with additional fields
    const { error: stationsError } = await supabase
      .from("stations")
      .upsert(sampleStations, { onConflict: "id" });

    if (stationsError) {
      console.error("Error updating stations:", stationsError);
      throw stationsError;
    }
    console.log("Stations updated successfully");

    // Update cultural information
    console.log("Updating cultural information...");
    const { error: cultureError } = await supabase
      .from("station_culture")
      .upsert(sampleCulture, { onConflict: "station_id,language" });

    if (cultureError) {
      console.error("Error updating culture:", cultureError);
      throw cultureError;
    }
    console.log("Cultural information updated successfully");
  } catch (error) {
    console.error("Error in database operations:", error);
    // Log more details about the error
    if (error.message) console.error("Error message:", error.message);
    if (error.details) console.error("Error details:", error.details);
    if (error.hint) console.error("Error hint:", error.hint);
  }
}

updateStations();

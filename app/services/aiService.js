import Constants from "expo-constants";

const DEEPSEEK_API_KEY = Constants.expoConfig.extra.deepseekApiKey;
const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

const aiService = {
  async generateResponse(prompt, options = {}) {
    try {
      const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature || 0.7,
          ...options,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to generate response");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  async generateLocationDescription(location, language = "en") {
    const prompt = `Generate a detailed description for a tourist location in Japan:
    Name: ${location.name}
    Category: ${location.category}
    Language: ${language}
    
    Please provide:
    1. A brief historical background
    2. Key attractions and features
    3. Cultural significance
    4. Best time to visit
    5. Any special tips or recommendations
    
    Format the response in ${language} language.`;

    return this.generateResponse(prompt);
  },

  async translateContent(content, targetLanguage) {
    const prompt = `Translate the following content to ${targetLanguage}:
    ${content}
    
    Please maintain the same tone and style while ensuring cultural appropriateness.`;

    return this.generateResponse(prompt);
  },

  async generateCulturalInsights(location) {
    const prompt = `Provide cultural insights and etiquette tips for visiting ${location.name} in Japan:
    
    Please include:
    1. Local customs and traditions
    2. Proper etiquette and manners
    3. Cultural taboos to avoid
    4. Local phrases or greetings
    5. Cultural significance of the location`;

    return this.generateResponse(prompt);
  },
};

export { aiService };
export default aiService;

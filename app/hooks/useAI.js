import { useState } from "react";
import { aiService } from "../services/aiService";

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateLocationDescription = async (locationData) => {
    try {
      setLoading(true);
      setError(null);

      // For now, return a placeholder description
      return `${locationData.name} is a train station located in the heart of Tokyo. 
      It serves as a major transportation hub, connecting multiple train lines and providing 
      easy access to various attractions in the area.`;
    } catch (err) {
      setError(err.message);
      console.error("Error generating location description:", err);
      return "";
    } finally {
      setLoading(false);
    }
  };

  const translateContent = async (content, targetLanguage) => {
    try {
      setLoading(true);
      setError(null);
      const translatedContent = await aiService.translateContent(
        content,
        targetLanguage
      );
      return translatedContent;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateCulturalInsights = async (locationData) => {
    try {
      setLoading(true);
      setError(null);

      // For now, return a placeholder insight
      return `This area is known for its unique blend of modern Japanese culture 
      and traditional elements. Visitors can find various shops, restaurants, and 
      cultural attractions nearby. The station area is particularly lively during 
      rush hours and weekends.`;
    } catch (err) {
      setError(err.message);
      console.error("Error generating cultural insights:", err);
      return "";
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateLocationDescription,
    translateContent,
    generateCulturalInsights,
  };
};

export default useAI;

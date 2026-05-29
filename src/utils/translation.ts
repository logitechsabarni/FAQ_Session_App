// Simple client-side sentiment analysis
// For production, consider using a real NLP library or API

const POSITIVE_WORDS = [
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'helpful',
  'thank', 'thanks', 'awesome', 'perfect', 'love', 'best', 'resolved', 'solved',
  'working', 'success', 'satisfied', 'happy', 'appreciate', 'grateful', 'nice',
  'brilliant', 'outstanding', 'superb', 'recommend', 'easy', 'fast', 'quick'
];

const NEGATIVE_WORDS = [
  'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'problem', 'issue',
  'error', 'fail', 'failed', 'broken', 'bug', 'crash', 'wrong', 'not working',
  'cannot', 'unable', 'frustrating', 'disappointed', 'angry', 'upset', 'slow',
  'difficult', 'confusing', 'unclear', 'unhelpful', 'waste', 'poor', 'useless'
];

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
}

export function analyzeSentiment(text: string): SentimentResult {
  if (!text || text.length < 5) {
    return { sentiment: 'neutral', score: 0.5, confidence: 0 };
  }

  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (POSITIVE_WORDS.some(p => word.includes(p))) {
      positiveCount++;
    }
    if (NEGATIVE_WORDS.some(n => word.includes(n))) {
      negativeCount++;
    }
  });

  const total = positiveCount + negativeCount;
  let score = 0.5;
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let confidence = 0;

  if (total > 0) {
    score = positiveCount / total;
    confidence = Math.min(1, total / words.length * 5);

    if (score > 0.55) {
      sentiment = 'positive';
    } else if (score < 0.45) {
      sentiment = 'negative';
    }
  }

  return { sentiment, score, confidence };
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case 'positive':
      return 'text-green-400 bg-green-400/10 border-green-400/30';
    case 'negative':
      return 'text-red-400 bg-red-400/10 border-red-400/30';
    default:
      return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
  }
}

export function getSentimentIcon(sentiment: string): string {
  switch (sentiment) {
    case 'positive':
      return 'Smile';
    case 'negative':
      return 'Frown';
    default:
      return 'Meh';
  }
}

// Translation support using browser API
export async function translateText(text: string, targetLang: string): Promise<string> {
  // Check if browser supports translation
  if (!('Translator' in window)) {
    // Fallback: just return original text for now
    // In production, you'd use a translation API
    console.warn('Translation not supported, returning original text');
    return text;
  }

  // For now, return original text
  // In production, integrate with translation API
  return text;
}

// Language detection
export function detectLanguage(text: string): string {
  // Simple heuristic-based detection
  const hindiPattern = /[\u0900-\u097F]/;
  const spanishPattern = /[áéíóúñ¿¡]/i;
  const frenchPattern = /[àâäéèêëïîôùûüÿç]/i;
  const germanPattern = /[äöüß]/i;

  if (hindiPattern.test(text)) return 'hi';
  if (spanishPattern.test(text)) return 'es';
  if (frenchPattern.test(text)) return 'fr';
  if (germanPattern.test(text)) return 'de';

  return 'en';
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
];

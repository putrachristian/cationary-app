import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not defined in environment variables");
}

// Initialize GoogleGenAI client
const genAI = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

/**
 * Generate cat breed recommendations using Gemini API
 */
export const generateCatRecommendations = async (
  answers,
  breeds,
  quizQuestions
) => {
  try {
    // Prepare breeds list
    const breedsList = breeds
      .map((breed) => `ID: ${breed.id}, Nama: ${breed.name}`)
      .join("\n");

    // System instruction for the AI
    const systemInstruction = `Kamu adalah ahli kucing yang membantu orang menemukan ras kucing yang cocok.

Daftar ras kucing yang tersedia:
${breedsList}

Tugas kamu:
1. Analisis jawaban pengguna dan cocokkan dengan karakteristik setiap ras kucing
2. Pilih 3 ras kucing yang PALING COCOK berdasarkan preferensi pengguna
3. Hitung persentase kecocokan (0-100%) untuk setiap ras
4. Berikan alasan singkat mengapa ras tersebut cocok

Format output HARUS berupa JSON array dengan struktur berikut (TANPA markdown, TANPA code block, HANYA JSON murni):
[
  {
    "id": "id_ras_kucing",
    "name": "Nama Ras",
    "matchPercentage": 85,
    "reason": "Alasan singkat mengapa cocok"
  },
  {
    "id": "id_ras_kucing",
    "name": "Nama Ras",
    "matchPercentage": 78,
    "reason": "Alasan singkat mengapa cocok"
  },
  {
    "id": "id_ras_kucing",
    "name": "Nama Ras",
    "matchPercentage": 72,
    "reason": "Alasan singkat mengapa cocok"
  }
]

Pastikan:
- Hanya return JSON array, tidak ada teks lain
- ID harus sesuai dengan ID dari daftar ras kucing yang tersedia
- matchPercentage adalah angka 0-100
- reason adalah kalimat singkat dalam Bahasa Indonesia
- Rekomendasi hanya ras yang umum di Indonesia
- Urutkan dari persentase tertinggi ke terendah`;

    // Prepare the prompt with user answers
    const answersText = Object.entries(answers)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([questionId, answer]) => {
        // Find the question that matches this ID
        const question = quizQuestions.find((q) => q.id === questionId);
        if (!question) {
          return `- ${questionId}: ${answer}`;
        }

        return `- ${question.text}: ${answer}`;
      })
      .join("\n");

    // User prompt with specific data (only user answers)
    const prompt = `Jawaban pengguna:
${answersText}`;

    // Generate content using GoogleGenAI with systemInstruction in config
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    
    const text = response.text;

    if (!text) {
      throw new Error("No response text from Gemini API");
    }

    // Clean the text - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    // Try to extract JSON array from the response
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    // Parse JSON with error handling
    let recommendations;
    try {
      recommendations = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini response:", parseError);
      console.error("Response text:", cleanedText);
      throw new Error("Invalid JSON response from Gemini API");
    }

    // Validate and ensure we have exactly 3 recommendations
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error("Invalid response format from Gemini API");
    }

    // Sort by match percentage (highest first) and take top 3
    const sortedRecommendations = recommendations
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 3);

    return sortedRecommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};

/**
 * Generate chat response using Gemini API
 */
export const generateChatResponse = async (message, conversationHistory = []) => {
  try {
    // System instruction for the AI
    const systemInstruction = `Kamu adalah Momochiko, asisten AI yang ramah dan informatif untuk aplikasi Cationary - aplikasi tentang kucing.

PENTING - BATASAN KONTEKS:
1. HANYA jawab pertanyaan tentang KUCING (hewan kucing domestik, kucing peliharaan, kucing liar, dll)
2. JANGAN jawab pertanyaan tentang:
   - Kucing mainan (toy cat, boneka kucing)
   - Kucing dalam game/video game
   - Kucing dalam anime/manga/film fiksi
   - Kucing dalam cerita/dongeng fiksi
   - Kucing sebagai karakter fiksi
   - Kucing dalam konteks lain selain hewan kucing
3. Kalau konteks nya berupa mainan untuk kucing diperbolehkan jawab, asalkan bukan kucing mainan
4. Jika ditanya tentang hal di luar konteks kucing, tolak dengan sopan dan jelaskan bahwa kamu hanya membantu tentang kucing

Tugas kamu:
1. Menjawab pertanyaan tentang KUCING dengan akurat dan ramah
2. Memberikan informasi tentang ras kucing, perawatan, kesehatan, dan perilaku kucing
3. Menggunakan Bahasa Indonesia yang mudah dipahami namun gunakan bahasa santai sehari-hari
4. Menjaga respons singkat dan to the point (maksimal 3-4 kalimat)
5. Jika ditanya tentang ras kucing, berikan rekomendasi yang relevan
6. Jika tidak tahu jawabannya tentang kucing, akui dengan jujur dan sarankan untuk cek halaman Breeds atau Tips di aplikasi
7. Jika pertanyaan di luar konteks kucing, tolak dengan sopan: "Maaf, saya hanya bisa membantu tentang kucing (hewan kucing). Saya tidak bisa menjawab pertanyaan tentang kucing mainan, kucing dalam game, atau hal lain yang bukan kucing."

Jawab dengan ramah, informatif, dan dalam Bahasa Indonesia. SELALU pastikan pertanyaan adalah tentang KUCING sebelum menjawab.`;

    // Build conversation history for context
    const historyContents = conversationHistory.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Build conversation contents (only user and model messages, no system prompt)
    const contents = [
      ...historyContents,
      { role: "user", parts: [{ text: message }] },
    ];

    // Generate content using GoogleGenAI with systemInstruction in config
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response text from Gemini API");
    }

    return text.trim();
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
};

/**
 * Generate quiz questions for cat match using Gemini API
 */
export const generateQuizQuestions = async () => {
  try {
    // System instruction for the AI
    const systemInstruction = `Kamu adalah ahli kucing yang membuat kuis untuk membantu orang menemukan ras kucing yang cocok.

Tugas kamu:
1. Buat 10 pertanyaan yang KRUSIAL dalam memilih kucing
2. Pertanyaan harus mencakup aspek-aspek penting seperti:
   - Lingkungan tempat tinggal (apartemen, rumah, dll)
   - Kepribadian kucing yang diinginkan (mandiri, manja, aktif, tenang)
   - Perawatan yang siap diberikan (bulu panjang/pendek, grooming)
   - Komitmen waktu dan biaya
   - Situasi keluarga (anak kecil, hewan lain)
   - Preferensi fisik (ukuran, bulu, dll)
3. Setiap pertanyaan harus memiliki kategori yang relevan
4. Setiap pertanyaan harus memiliki 2-3 opsi jawaban yang jelas

Format output HARUS berupa JSON array dengan struktur berikut (TANPA markdown, TANPA code block, HANYA JSON murni):
[
  {
    "id": "q01",
    "category": "Lingkungan",
    "text": "Pertanyaan dalam Bahasa Indonesia",
    "options": ["Opsi 1", "Opsi 2", "Opsi 3"]
  },
  {
    "id": "q02",
    "category": "Kepribadian",
    "text": "Pertanyaan dalam Bahasa Indonesia",
    "options": ["Opsi 1", "Opsi 2"]
  }
]

Pastikan:
- Hanya return JSON array dengan tepat 10 pertanyaan
- ID harus unik (q01, q02, q03, ..., q10)
- Category harus relevan (Lingkungan, Kepribadian, Perawatan, Komitmen, Sosial & Keluarga, Preferensi)
- Text adalah pertanyaan dalam Bahasa Indonesia yang jelas dan mudah dipahami
- Options adalah array string dengan 2-3 opsi yang jelas
- Pertanyaan harus krusial dan membantu menentukan ras kucing yang cocok
- Tidak ada teks lain selain JSON array`;

    // Generate content using GoogleGenAI with systemInstruction in config
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: "Generate 10 quiz questions for cat match",
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response text from Gemini API");
    }

    // Clean the text - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    // Try to extract JSON array from the response
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    // Parse JSON with error handling
    let questions;
    try {
      questions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini response:", parseError);
      console.error("Response text:", cleanedText);
      throw new Error("Invalid JSON response from Gemini API");
    }

    // Validate and ensure we have exactly 10 questions
    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error(`Invalid response format from Gemini API. Expected 10 questions, got ${questions.length}`);
    }

    // Validate each question has required fields
    questions.forEach((q, index) => {
      if (!q.id || !q.category || !q.text || !Array.isArray(q.options) || q.options.length < 2) {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });

    return questions;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw error;
  }
};

const GEMINI_API_KEY = "AIzaSyAKK2y1gQK-JTzwDJOkFSAfsBQdQBdgQxg"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

/**
 * Generate cat breed recommendations using Gemini API
 */
export async function generateCatRecommendations(
  answers,
  breeds,
  quizQuestions
) {
  try {
    // Prepare the prompt with user answers
    const answersText = Object.entries(answers)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([questionId, answer]) => {
        // Find the question that matches this ID
        const question = quizQuestions.find((q) => q.id === questionId)
        if (!question) {
          return `- ${questionId}: ${answer}`
        }

        return `- ${question.text}: ${answer}`
      })
      .join("\n")

    const breedsList = breeds
      .map((breed) => `ID: ${breed.id}, Nama: ${breed.name}`)
      .join("\n")

    const prompt = `Kamu adalah ahli kucing yang membantu orang menemukan ras kucing yang cocok.

Jawaban pengguna:
${answersText}

Daftar ras kucing yang tersedia:
${breedsList}

Tugas:
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
- Urutkan dari persentase tertinggi ke terendah`

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Extract text from Gemini response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    if (!text) {
      throw new Error("No response text from Gemini API")
    }

    // Clean the text - remove markdown code blocks if present
    let cleanedText = text.trim()
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "")
    }

    // Try to extract JSON array from the response
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      cleanedText = jsonMatch[0]
    }

    // Parse JSON with error handling
    let recommendations
    try {
      recommendations = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini response:", parseError)
      console.error("Response text:", cleanedText)
      throw new Error("Invalid JSON response from Gemini API")
    }

    // Validate and ensure we have exactly 3 recommendations
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error("Invalid response format from Gemini API")
    }

    // Sort by match percentage (highest first) and take top 3
    const sortedRecommendations = recommendations
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 3)

    return sortedRecommendations
  } catch (error) {
    console.error("Error generating recommendations:", error)
    throw error
  }
}


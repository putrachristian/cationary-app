import { useState } from "react"
import { ArrowLeft, Target, Check, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/badge"
import { ImageWithFallback } from "../components/ui/ImageWithFallback"
import quizQuestionsData from "../data/quiz.json"
import indonesiaCatBreeds from "../data/indonesia_cat_breeds.json"
import { getCatImage } from "../utils/catApi"
import { generateCatRecommendations } from "../utils/geminiApi"

export const CatMatchPage = ({
  onNavigate,
  savedResults = [],
  onSaveResults,
}) => {
  const quizQuestions = quizQuestionsData
  const [stage, setStage] = useState(
    savedResults.length > 0 ? "result" : "intro"
  )
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [matchResults, setMatchResults] = useState(savedResults)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleStartQuiz = () => {
    setStage("quiz")
    setCurrentQuestion(0)
    setAnswers({})
  }

  const handleAnswer = (answer) => {
    if (isTransitioning) return

    setSelectedAnswer(answer)
    setIsTransitioning(true)

    setTimeout(() => {
      const question = quizQuestions[currentQuestion]
      const updatedAnswers = {
        ...answers,
        [question.id]: answer,
      }
      setAnswers(updatedAnswers)

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsTransitioning(false)
      } else {
        setStage("loading")
        processResults(updatedAnswers)
      }
    }, 400)
  }

  const handleBack = () => {
    if (currentQuestion > 0 && !isTransitioning) {
      setCurrentQuestion(currentQuestion - 1)
      const prevQuestion = quizQuestions[currentQuestion - 1]
      const prevAnswer = answers[prevQuestion.id]
      setSelectedAnswer(prevAnswer || null)
    }
  }

  const processResults = async (finalAnswers) => {
    try {
      const breeds = indonesiaCatBreeds

      // Generate recommendations using Gemini API
      // Convert QuizAnswers to Record<string, string> for Gemini API
      const answersForGemini = {}
      Object.entries(finalAnswers).forEach(([key, value]) => {
        if (value !== undefined) {
          answersForGemini[key] = value
        }
      })

      const recommendations = await generateCatRecommendations(
        answersForGemini,
        breeds,
        quizQuestions
      )

      // Map recommendations to breeds and fetch images
      const top3WithImages = await Promise.all(
        recommendations.map(async (rec) => {
          // Find the breed by ID
          const breed = breeds.find((b) => b.id === rec.id)
          if (!breed) {
            throw new Error(`Breed with ID ${rec.id} not found`)
          }

          // Fetch image for the breed
          const image = await getCatImage(breed.id)

          return {
            breed: {
              ...breed,
              image,
            },
            score: rec.matchPercentage,
            reason: rec.reason,
          }
        })
      )

      setMatchResults(top3WithImages)
      if (onSaveResults) {
        onSaveResults(top3WithImages)
      }
      setStage("result")
    } catch (error) {
      console.error("Error processing results:", error)
      // Show error message to user
      alert("Terjadi kesalahan saat memproses hasil. Silakan coba lagi.")
      setStage("intro")
    }
  }

  const handleRetake = () => {
    setStage("intro")
    setCurrentQuestion(0)
    setAnswers({})
    setSelectedAnswer(null)
    setMatchResults([])
  }

  // Intro Screen
  if (stage === "intro") {
    return (
      <div className="pb-20 bg-background min-h-screen flex flex-col">
        <div className="p-6 pb-4 border-b border-border bg-white">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Kembali</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="w-32 h-32 bg-gradient-warm rounded-full flex items-center justify-center mb-4 shadow-soft-lg">
              <Target className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <h1 className="mb-3">Cat Match</h1>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Temukan ras kucing yang cocok dengan gaya hidup dan kepribadian Anda
            melalui kuis singkat.
          </p>

          <div className="bg-muted rounded-xl p-4 mb-8 max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-left">
                {quizQuestions.length} pertanyaan singkat
              </p>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-left">
                Hasil berdasarkan preferensi Anda
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-left">3 rekomendasi ras terbaik</p>
            </div>
          </div>

          <Button
            onClick={handleStartQuiz}
            size="lg"
            className="w-full max-w-sm"
          >
            Mulai Kuis
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Quiz Screen
  if (stage === "quiz") {
    const question = quizQuestions[currentQuestion]
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

    return (
      <div className="pb-20 bg-background min-h-screen">
        <div className="p-6 pb-4 border-b border-border bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Kembali</span>
            </button>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} / {quizQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-6">{question.text}</h2>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={isTransitioning}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedAnswer === option
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border bg-card hover:border-primary/50 hover:shadow-soft"
                    }`}
                  >
                    <p className="font-medium">{option}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Loading Screen
  if (stage === "loading") {
    return (
      <div className="pb-20 bg-background min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mb-6"
        />
        <h2 className="mb-2">Menganalisis preferensi Anda</h2>
        <p className="text-muted-foreground text-center">
          Mohon tunggu sebentar...
        </p>
      </div>
    )
  }

  // Result Screen
  return (
    <div className="pb-20 bg-background min-h-screen">
      <div className="p-6 pb-4 border-b border-border bg-white sticky top-0 z-10">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Kembali</span>
        </button>
        <h2>Hasil Cat Match</h2>
        <p className="text-sm text-muted-foreground">
          Berikut hasil terbaik berdasarkan jawaban Anda
        </p>
      </div>

      <div className="p-6 space-y-4">
        {matchResults.map((result, index) => (
          <motion.div
            key={result.breed.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden">
              <div className="relative h-48">
                {result.breed.image ? (
                  <ImageWithFallback
                    src={result.breed.image}
                    alt={result.breed.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <div className="text-4xl">🐱</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge variant="primary" className="text-xs">
                    #{index + 1} Match
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <p className="text-sm font-semibold text-primary">
                      {result.score}% Cocok
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="mb-2">{result.breed.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {result.reason}
                </p>

                {result.breed.tags && result.breed.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.breed.tags
                      .slice(0, 3)
                      .map((tag, i) => (
                        <Badge key={i} variant="default" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate("breed-detail", result.breed)}
                >
                  Kenali Lebih Dekat
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        <Button variant="ghost" className="w-full" onClick={handleRetake}>
          Ulangi Kuis
        </Button>
      </div>
    </div>
  );
};


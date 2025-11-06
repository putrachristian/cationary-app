import { useState } from "react"
import { motion } from "motion/react"
import { ArrowLeft, BookOpen, Shuffle } from "lucide-react"
import { Button } from "../components/ui/button"
import { CatFactCard } from "../components/CatFactCard"
import catFactsData from "../data/cat_facts.json"
import { toast } from "sonner"

const catFacts = catFactsData

export const FunCatFactsPage = ({ onNavigate }) => {
  const [shuffledFacts, setShuffledFacts] = useState([...catFacts])
  const [loading, setLoading] = useState(false)

  const handleShuffle = () => {
    setLoading(true)
    setTimeout(() => {
      const shuffled = [...catFacts].sort(() => Math.random() - 0.5)
      setShuffledFacts(shuffled)
      setLoading(false)
      toast.success("Fakta baru dimuat!")
    }, 500)
  }

  const handleShare = (fact) => {
    const text = `${fact.emoji} ${fact.title}\n\n${fact.description}\n\n— Cationary App`

    if (navigator.share) {
      navigator
        .share({
          title: fact.title,
          text: text,
        })
        .catch(() => {
          // Fallback jika gagal
          navigator.clipboard.writeText(text)
          toast.success("Fakta disalin ke clipboard!")
        })
    } else {
      navigator.clipboard.writeText(text)
      toast.success("Fakta disalin ke clipboard!")
    }
  }

  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-soft-sm sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => onNavigate("home")}
              className="p-2 rounded-xl bg-muted hover:bg-primary/10 transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 text-primary" />
                <h1 className="text-2xl">Fun Cat Facts</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Fakta menarik tentang kucing setiap harinya
              </p>
            </div>
          </div>

          {/* Shuffle Button */}
          <Button
            onClick={handleShuffle}
            disabled={loading}
            variant="outline"
            className="w-full border-primary/30 hover:bg-primary/5 hover:border-primary"
          >
            <Shuffle className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Mengacak..." : "Acak Fakta"}
          </Button>
        </div>
      </div>

      {/* Facts Grid */}
      <div className="p-6">
        <div className="grid gap-4">
          {shuffledFacts.map((fact, index) => (
            <CatFactCard
              key={fact.id}
              emoji={fact.emoji}
              title={fact.title}
              description={fact.description}
              onShare={() => handleShare(fact)}
              delay={index * 0.05}
            />
          ))}
        </div>

        {/* Fun Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/50 border border-border">
            <span className="text-2xl">🐱</span>
            <p className="text-sm text-muted-foreground">
              Sudah tau semuanya? Acak lagi untuk urutan baru!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


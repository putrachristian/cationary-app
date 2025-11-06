import { useState, useEffect } from "react"
import {
  Search,
  ChevronRight,
  Heart,
  Sparkles,
  TrendingUp,
  Lightbulb,
  MessageCircle,
} from "lucide-react"
import { motion } from "motion/react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { BreedCard } from "../components/BreedCard"
import { ArticleCard } from "../components/ArticleCard"
import articlesData from "../data/article.json"
import indonesiaCatBreeds from "../data/indonesia_cat_breeds.json"
import { getCatImage } from "../utils/catApi"
import momochikoImg from "../assets/images/momochiko.jpeg";

export const HomePage = ({ onNavigate }) => {
  const articles = articlesData
  const [searchQuery, setSearchQuery] = useState("")
  const [breedsWithImages, setBreedsWithImages] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch images for all breeds
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      const breeds = indonesiaCatBreeds

      const breedsWithImagesPromises = breeds.map(async (breed) => {
        const image = await getCatImage(breed.id)
        return { ...breed, image }
      })

      const results = await Promise.all(breedsWithImagesPromises)
      setBreedsWithImages(results)
      setLoading(false)
    }

    fetchImages()
  }, [])

  // Popular breeds for recommendation
  const popularBreeds = breedsWithImages.slice(0, 5)

  // Latest articles
  const latestArticles = articles.slice(0, 3)

  // Get favorites count
  const favoritesCount = JSON.parse(
    localStorage.getItem("cationary-favorites") || "[]"
  ).length

  // Filter breeds and articles based on search
  const filteredBreeds = searchQuery
    ? breedsWithImages.filter(
        (breed) =>
          breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          breed.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          breed.fur_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          breed.size.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const filteredArticles = searchQuery
    ? articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const hasSearchResults =
    searchQuery && (filteredBreeds.length > 0 || filteredArticles.length > 0)
  const showNoResults =
    searchQuery && filteredBreeds.length === 0 && filteredArticles.length === 0

  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-soft-sm sticky top-0 z-40">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl">Cationary</h1>
              <p className="text-sm text-muted-foreground">
                Cat Encyclopedia & Match
              </p>
            </div>
            <button
              onClick={() => onNavigate("favorit")}
              className="relative p-3 rounded-xl bg-muted hover:bg-primary/10 transition-all active:scale-95"
            >
              <Heart className="w-5 h-5 text-primary" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari ras, artikel, atau tips"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Search Results */}
        {showNoResults && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="mb-2">Tidak ditemukan</h3>
            <p className="text-muted-foreground text-sm">
              Coba kata kunci lain untuk menemukan yang Anda cari
            </p>
          </div>
        )}

        {hasSearchResults && (
          <>
            {filteredBreeds.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg">
                    Ras Kucing ({filteredBreeds.length})
                  </h2>
                  {filteredBreeds.length > 4 && (
                    <button
                      onClick={() => {
                        onNavigate("breeds")
                      }}
                      className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Lihat Semua
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {filteredBreeds.slice(0, 4).map((breed, index) => (
                    <motion.div
                      key={breed.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <BreedCard
                        name={breed.name}
                        origin={breed.origin}
                        image={breed.image || undefined}
                        tags={[breed.fur_type, breed.size]}
                        onClick={() => onNavigate("breed-detail", breed)}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {filteredArticles.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg">
                    Artikel & Tips ({filteredArticles.length})
                  </h2>
                  {filteredArticles.length > 3 && (
                    <button
                      onClick={() => onNavigate("tips")}
                      className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Lihat Semua
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {filteredArticles.slice(0, 3).map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onNavigate("article", article)}
                    >
                      <ArticleCard
                        title={article.title}
                        category={article.category}
                        readTime={article.readTime}
                        image={article.image}
                        excerpt={article.excerpt}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Show default content only when not searching */}
        {!searchQuery && (
          <>
            {/* Section 1: Rekomendasi untuk kamu */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-lg">Rekomendasi untuk Anda</h2>
                </div>
                <button
                  onClick={() => onNavigate("breeds")}
                  className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Lihat Semua
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
                {loading ? (
                  <div className="min-w-[280px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🐱</div>
                      <p className="text-sm text-muted-foreground">Memuat...</p>
                    </div>
                  </div>
                ) : (
                  popularBreeds.map((breed, index) => (
                    <motion.div
                      key={breed.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="min-w-[280px]"
                      onClick={() => onNavigate("breed-detail", breed)}
                    >
                      <Card className="cursor-pointer hover:shadow-soft-lg hover:scale-[1.02] transition-all overflow-hidden p-0">
                        <div className="relative h-40">
                          {breed.image ? (
                            <img
                              src={breed.image}
                              alt={breed.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <div className="text-4xl">🐱</div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="text-white mb-1">{breed.name}</h4>
                            <p className="text-xs text-white/80">
                              {breed.origin}
                            </p>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex flex-wrap gap-1.5">
                            <Badge variant="default" className="text-xs">
                              {breed.fur_type}
                            </Badge>
                            <Badge variant="default" className="text-xs">
                              {breed.size}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </section>

            {/* Section 2: Mulai Cat Match */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card
                  className="gradient-warm text-white border-0 shadow-soft-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-all"
                  onClick={() => onNavigate("match")}
                >
                  <div className="p-6 relative">
                    <div className="absolute top-4 right-4 opacity-20">
                      <Sparkles className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg">Mulai Cat Match</h3>
                      </div>
                      <p className="text-white/90 text-sm mb-4 max-w-xs">
                        Temukan ras kucing yang cocok dengan gaya hidup dan
                        kepribadian Anda melalui kuis singkat.
                      </p>
                      <Button
                        variant="secondary"
                        className="bg-white text-primary hover:bg-white/90 shadow-soft"
                      >
                        Mulai Kuis Sekarang
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </section>

            {/* Section 2.5: Fun Cat Facts - NEW */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Card
                  className="gradient-sage text-white border-0 shadow-soft-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-all"
                  onClick={() => onNavigate("fun-facts")}
                >
                  <div className="p-6 relative">
                    <div className="absolute top-4 right-4 opacity-20">
                      <Lightbulb className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-xl">🐱</span>
                        </div>
                        <h3 className="text-lg">Fun Cat Facts</h3>
                      </div>
                      <p className="text-white/90 text-sm mb-4 max-w-xs">
                        Temukan fakta-fakta menarik tentang kucing yang mungkin
                        belum kamu ketahui!
                      </p>
                      <Button
                        variant="secondary"
                        className="bg-white text-secondary hover:bg-white/90 shadow-soft"
                      >
                        Jelajahi Fakta
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </section>

             {/* Section 2.6: Chat with Momochiko - NEW */}
             <section>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 border border-primary/20 shadow-soft-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-all"
                  onClick={() => onNavigate("chat")}
                >
                  <div className="p-6 relative">
                    <div className="absolute top-4 right-4 opacity-10">
                      <MessageCircle className="w-24 h-24 text-primary" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden shadow-soft ring-2 ring-primary/20">
                          <img
                            src={momochikoImg}
                            alt="Momochiko"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-lg text-foreground">Chat dengan Momochiko</h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 max-w-xs">
                        Tanya Momochiko segala hal tentang kucing - dari perawatan hingga perilaku!
                      </p>
                      <Button 
                        variant="default"
                        className="shadow-soft"
                      >
                        Mulai Chat
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </section>

            {/* Section 3: Tips & Artikel Terbaru */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <h2 className="text-lg">Tips & Artikel Terbaru</h2>
                </div>
                <button
                  onClick={() => onNavigate("tips")}
                  className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Lihat Semua
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {latestArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    onClick={() => onNavigate("article", article)}
                  >
                    <ArticleCard
                      title={article.title}
                      category={article.category}
                      readTime={article.readTime}
                      image={article.image}
                      excerpt={article.excerpt}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};


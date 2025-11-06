import { useState, useEffect } from "react"
import { Heart, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "../components/ui/button"
import { BreedCard } from "../components/BreedCard"
import indonesiaCatBreeds from "../data/indonesia_cat_breeds.json"
import { getCatImage } from "../utils/catApi"

export const FavoritPage = ({ onNavigate }) => {
  const [favorites, setFavorites] = useState([])
  const [favoriteBreeds, setFavoriteBreeds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("cationary-favorites")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const fetchFavoriteBreeds = async () => {
      setLoading(true)
      const breeds = indonesiaCatBreeds
      const favoriteBreedIds = favorites
      const filteredBreeds = breeds.filter((breed) =>
        favoriteBreedIds.includes(breed.id)
      )

      // Fetch images for favorite breeds
      const breedsWithImages = await Promise.all(
        filteredBreeds.map(async (breed) => {
          const image = await getCatImage(breed.id)
          return { ...breed, image }
        })
      )

      setFavoriteBreeds(breedsWithImages)
      setLoading(false)
    }

    if (favorites.length > 0) {
      fetchFavoriteBreeds()
    } else {
      setFavoriteBreeds([])
      setLoading(false)
    }
  }, [favorites])

  const handleRemoveFavorite = (breedId) => {
    const updated = favorites.filter((id) => id !== breedId)
    setFavorites(updated)
    localStorage.setItem("cationary-favorites", JSON.stringify(updated))
  }

  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-border bg-white sticky top-0 z-10">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Kembali</span>
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary fill-primary" />
          </div>
          <h2>Favorit Saya</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          {favoriteBreeds.length} ras tersimpan
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="text-4xl mb-2">🐱</div>
              <p className="text-sm text-muted-foreground">Memuat...</p>
            </div>
          </div>
        ) : favoriteBreeds.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="mb-2">Belum ada ras favorit</h3>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Tambahkan ras favorit Anda untuk menyimpan informasi yang Anda
              minati.
            </p>
            <Button onClick={() => onNavigate("breeds")}>
              Jelajahi Ras Kucing
            </Button>
          </motion.div>
        ) : (
          // Favorit Grid
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence>
              {favoriteBreeds.map((breed, index) => (
                <motion.div
                  key={breed.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <div onClick={() => onNavigate("breed-detail", breed)}>
                    <BreedCard
                      breed={breed}
                      name={breed.name}
                      origin={breed.origin}
                      image={breed.image || undefined}
                      tags={breed.tags || [breed.fur_type, breed.size]}
                    />
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFavorite(breed.id)
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white shadow-soft flex items-center justify-center hover:scale-110 transition-transform z-10"
                  >
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};


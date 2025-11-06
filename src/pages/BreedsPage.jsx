import { useState, useEffect } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { motion } from "motion/react"
import { BreedCard } from "../components/BreedCard"
import indonesiaCatBreeds from "../data/indonesia_cat_breeds.json"
import { getCatImage } from "../utils/catApi"

export const BreedsPage = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilter, setShowFilter] = useState(false)
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

  const filteredBreeds = breedsWithImages.filter(
    (breed) =>
      breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breed.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breed.fur_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breed.size.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-soft-sm sticky top-0 z-10">
        <div className="p-6 pb-4">
          <h2 className="mb-4">Jelajahi Ras Kucing</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Temukan informasi lengkap tentang berbagai ras kucing
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau karakteristik"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="px-4 py-3 rounded-xl bg-muted border border-border flex items-center gap-2 hover:border-primary hover:bg-primary/5 transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 bg-muted rounded-xl border border-border"
            >
              <p className="text-sm text-muted-foreground">
                Filter akan segera hadir
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Breeds Grid */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="text-6xl mb-4">🐱</div>
            <h3 className="mb-2">Memuat data...</h3>
            <p className="text-muted-foreground text-sm">
              Sedang mengambil gambar kucing
            </p>
          </div>
        ) : filteredBreeds.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="mb-2">Tidak ditemukan</h3>
            <p className="text-muted-foreground text-sm">
              Coba kata kunci lain untuk menemukan ras yang Anda cari
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredBreeds.map((breed, index) => (
              <motion.div
                key={breed.id + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
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
        )}
      </div>
    </div>
  );
};


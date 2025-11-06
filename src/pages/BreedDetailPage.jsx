import React, { useState, useEffect } from "react"
import { ChevronLeft, Heart, Share2, DollarSign } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ImageWithFallback } from "../components/ui/ImageWithFallback"
import { getCatImage } from "../utils/catApi"
import { toast } from "sonner"
import indonesiaCatBreeds from "../data/indonesia_cat_breeds.json"

export const BreedDetailPage = ({
  breed,
  onNavigate,
  previousPage,
}) => {
  // Early return SEBELUM hooks jika breed tidak tersedia
  // Ini penting untuk memastikan hooks dipanggil dalam urutan yang sama setiap render
  if (!breed || !breed.id || !breed.name) {
    return (
      <div className="pb-20 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐱</div>
          <h3 className="mb-2">Memuat data...</h3>
          <p className="text-muted-foreground text-sm">
            Sedang memuat informasi breed
          </p>
        </div>
      </div>
    )
  }

  // Semua hooks harus dipanggil dalam urutan yang sama setiap render
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [fullBreedData, setFullBreedData] = useState(null)

  // Load full breed data from JSON
  useEffect(() => {
    const breeds = indonesiaCatBreeds
    const foundBreed = breeds.find((b) => b.id === breed.id)

    if (foundBreed) {
      // Merge data dari breed prop dengan data dari JSON (breed prop takes precedence)
      const mergedBreed = {
        ...foundBreed,
        ...breed,
      }
      setFullBreedData(mergedBreed)
    } else {
      // Jika tidak ditemukan di JSON, gunakan data yang ada
      setFullBreedData(breed)
    }
  }, [breed])

  // Use fullBreedData instead of breed for rendering
  const displayBreed = fullBreedData

  useEffect(() => {
    if (!displayBreed) return

    const saved = localStorage.getItem("cationary-favorites")
    const favorites = saved ? JSON.parse(saved) : []
    setIsFavorite(favorites.includes(displayBreed.id))
  }, [displayBreed])

  // Fetch image from API
  useEffect(() => {
    if (!displayBreed) return

    const fetchImage = async () => {
      setImageLoading(true)
      const image = await getCatImage(displayBreed.id)
      setImageUrl(image)
      setImageLoading(false)
    }

    fetchImage()
  }, [displayBreed])

  const handleToggleFavorite = () => {
    const saved = localStorage.getItem("cationary-favorites")
    const favorites = saved ? JSON.parse(saved) : []

    if (!displayBreed) return

    if (isFavorite) {
      const updated = favorites.filter((id) => id !== displayBreed.id)
      localStorage.setItem("cationary-favorites", JSON.stringify(updated))
      setIsFavorite(false)
      toast.success("Dihapus dari favorit")
    } else {
      favorites.push(displayBreed.id)
      localStorage.setItem("cationary-favorites", JSON.stringify(favorites))
      setIsFavorite(true)
      toast.success("Ditambahkan ke favorit")
    }
  }

  const handleBack = () => {
    // If coming from match result, go back to match
    // Otherwise go to breeds list
    const returnPage = previousPage === "match" ? "match" : "breeds"
    onNavigate(returnPage)
  }

  // Conditional rendering di JSX setelah semua hooks dipanggil
  // Jangan gunakan early return setelah hooks - ini melanggar Rules of Hooks
  // Gunakan conditional rendering di JSX saja
  return (
    <div className="pb-20 bg-background min-h-screen">
      {!fullBreedData || !displayBreed ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">🐱</div>
            <h3 className="mb-2">Memuat data...</h3>
            <p className="text-muted-foreground text-sm">
              Sedang memuat informasi breed
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Header Image */}
          <div className="relative">
            <div className="h-80 bg-muted relative">
              {imageLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🐱</div>
                    <p className="text-sm text-muted-foreground">
                      Memuat gambar...
                    </p>
                  </div>
                </div>
              ) : (
                <ImageWithFallback
                  src={imageUrl || undefined}
                  alt={displayBreed.name || "Breed Kucing"}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background" />
            </div>

            <button
              onClick={handleBack}
              className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>

            <motion.button
              onClick={handleToggleFavorite}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-16 w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  isFavorite ? "fill-primary text-primary" : "text-foreground"
                }`}
              />
            </motion.button>

            <button className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 -mt-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-6 shadow-soft border border-border mb-6"
            >
              <h1 className="mb-2">{displayBreed.name || "Breed Kucing"}</h1>
              {displayBreed.origin && (
                <p className="text-muted-foreground mb-4">
                  {displayBreed.origin}
                </p>
              )}

              {displayBreed.tags && displayBreed.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {displayBreed.tags.map((tag, index) => (
                    <Badge key={index} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-muted p-1 rounded-xl">
                <TabsTrigger value="overview" className="rounded-lg">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="health" className="rounded-lg">
                  Kesehatan
                </TabsTrigger>
                <TabsTrigger value="care" className="rounded-lg">
                  Perawatan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 pt-4">
                {displayBreed.description && (
                  <div>
                    <h3 className="mb-3">Deskripsi</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {displayBreed.description}
                    </p>
                  </div>
                )}

                {displayBreed.personality &&
                  displayBreed.personality.length > 0 && (
                    <div>
                      <h3 className="mb-3">Kepribadian</h3>
                      <div className="flex flex-wrap gap-2">
                        {displayBreed.personality.map((trait, index) => (
                          <Badge key={index} variant="accent">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {displayBreed.price_range_IDR && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card p-5 rounded-xl border border-primary/30 shadow-soft"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-primary mb-2">
                          KISARAN HARGA DI INDONESIA
                        </p>
                        <p className="font-semibold text-foreground mb-2">
                          {displayBreed.price_range_IDR}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          *Harga bervariasi tergantung peternak, kualitas, dan
                          lokasi
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {displayBreed.weight && (
                    <div className="bg-muted p-4 rounded-xl border border-border">
                      <p className="text-sm text-muted-foreground mb-1.5">
                        Berat
                      </p>
                      <p className="font-semibold">{displayBreed.weight}</p>
                    </div>
                  )}
                  {displayBreed.lifespan && (
                    <div className="bg-muted p-4 rounded-xl border border-border">
                      <p className="text-sm text-muted-foreground mb-1.5">
                        Usia
                      </p>
                      <p className="font-semibold">{displayBreed.lifespan}</p>
                    </div>
                  )}
                  {displayBreed.activity_level !== undefined && (
                    <div className="bg-muted p-4 rounded-xl border border-border">
                      <p className="text-sm text-muted-foreground mb-1.5">
                        Aktivitas
                      </p>
                      <p className="font-semibold">
                        {displayBreed.activity_level}/10
                      </p>
                    </div>
                  )}
                  {displayBreed.grooming_level && (
                    <div className="bg-muted p-4 rounded-xl border border-border">
                      <p className="text-sm text-muted-foreground mb-1.5">
                        Grooming
                      </p>
                      <p className="font-semibold">
                        {displayBreed.grooming_level}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="health" className="space-y-4 pt-4">
                <div className="bg-card p-5 rounded-xl border border-border shadow-soft">
                  <h4 className="mb-2">Perawatan Kesehatan Umum</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pastikan kucing mendapat vaksinasi rutin dan pemeriksaan
                    kesehatan tahunan untuk menjaga kesehatannya tetap optimal.
                  </p>
                </div>
                <div className="bg-card p-5 rounded-xl border border-border shadow-soft">
                  <h4 className="mb-2">Nutrisi</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Berikan makanan berkualitas tinggi sesuai usia dan kebutuhan
                    aktivitas. Pastikan air minum selalu tersedia.
                  </p>
                </div>

                <div className="bg-accent/10 p-4 rounded-xl border border-accent/30">
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold text-foreground">
                      💡 Tahukah Anda?
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      {displayBreed.name} adalah ras kucing yang berasal dari{" "}
                      {displayBreed.origin || "berbagai negara"} dengan bulu{" "}
                      {(displayBreed.fur_type || "").toLowerCase()} dan ukuran{" "}
                      {(displayBreed.size || "").toLowerCase()}. Pastikan Anda
                      siap memberikan perawatan yang sesuai dengan karakteristik
                      ras ini.
                    </span>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="care" className="space-y-4 pt-4">
                <div className="bg-card p-5 rounded-xl border border-border shadow-soft">
                  <h4 className="mb-2">Grooming</h4>
                  <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    {displayBreed.fur_type && (
                      <p>
                        Jenis bulu:{" "}
                        <span className="font-semibold text-foreground">
                          {displayBreed.fur_type}
                        </span>
                      </p>
                    )}
                    {displayBreed.grooming_level && (
                      <p>
                        Tingkat grooming:{" "}
                        <span className="font-semibold text-foreground">
                          {displayBreed.grooming_level}
                        </span>
                        .{" "}
                        {displayBreed.grooming_level === "Tinggi"
                          ? "Memerlukan perawatan grooming yang intensif dan rutin. Pastikan untuk menyisir bulu secara teratur, minimal 3-4x seminggu, dan melakukan grooming profesional secara berkala."
                          : displayBreed.grooming_level === "Sedang"
                          ? "Memerlukan perawatan grooming yang cukup rutin. Disarankan untuk menyisir bulu 2-3x seminggu untuk menjaga kesehatan dan penampilan bulu."
                          : displayBreed.grooming_level === "Mudah" ||
                            displayBreed.grooming_level === "Rendah"
                          ? "Memerlukan perawatan grooming yang minimal. Cukup disisir 1-2x seminggu untuk menjaga kebersihan dan kesehatan bulu."
                          : "Perawatan grooming disesuaikan dengan jenis bulu dan kebutuhan kucing. Pastikan untuk menyisir bulu secara rutin dan menjaga kebersihan."}
                      </p>
                    )}
                    {!displayBreed.fur_type && !displayBreed.grooming_level && (
                      <p>
                        Perawatan grooming disesuaikan dengan jenis bulu kucing.
                        Pastikan untuk menyisir bulu secara rutin dan menjaga
                        kebersihan.
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-card p-5 rounded-xl border border-border shadow-soft">
                  <h4 className="mb-2">Lingkungan</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {displayBreed.size
                      ? displayBreed.size === "Small" ||
                        displayBreed.size === "Medium"
                        ? "Cocok untuk apartemen atau rumah kecil. Kucing ini dapat beradaptasi dengan baik di berbagai lingkungan."
                        : "Lebih cocok di rumah dengan ruang yang luas untuk bermain dan bereksplorasi karena ukurannya yang lebih besar."
                      : "Kucing ini dapat beradaptasi dengan baik di berbagai lingkungan. Pastikan untuk menyediakan ruang yang cukup untuk aktivitas dan bermain."}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleToggleFavorite}
              className="w-full mt-6 h-12"
              variant={isFavorite ? "outline" : "default"}
            >
              <Heart
                className={`w-4 h-4 mr-2 ${isFavorite ? "fill-primary" : ""}`}
              />
              {isFavorite ? "Hapus dari Favorit" : "Tambahkan ke Favorit"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};


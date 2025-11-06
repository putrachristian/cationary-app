// Utility untuk fetch gambar dari The Cat API
export async function fetchCatImage(breedId) {
  try {
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=1`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch image")
    }

    const data = await response.json()

    if (data && data.length > 0 && data[0].url) {
      return data[0].url
    }

    return null
  } catch (error) {
    console.error("Error fetching cat image:", error)
    return null
  }
}

// Cache untuk menyimpan gambar yang sudah di-fetch
const imageCache = new Map()

export async function getCatImage(breedId) {
  // Khusus untuk id "indo" (Domestic Shorthair / Kucing Kampung)
  // Gunakan gambar khusus dari kumparan
  if (breedId === "indo") {
    const customImageUrl =
      "https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,f_auto,q_auto:best,w_640/v1634025439/01hp6tmj1capg6r36jx2313mcs.jpg"
    imageCache.set(breedId, customImageUrl)
    return customImageUrl
  }

  // Cek cache dulu
  if (imageCache.has(breedId)) {
    return imageCache.get(breedId) || null
  }

  // Fetch dari API
  const imageUrl = await fetchCatImage(breedId)

  // Simpan ke cache
  imageCache.set(breedId, imageUrl)

  return imageUrl
}


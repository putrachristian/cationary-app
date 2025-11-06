import { useState } from "react"
import { BookOpen } from "lucide-react"
import { motion } from "motion/react"
import { ArticleCard } from "../components/ArticleCard"
import articlesData from "../data/article.json"

export const TipsPage = ({ onNavigate }) => {
  const articles = articlesData
  const [activeTab, setActiveTab] = useState("semua")

  // Get unique categories from articles
  const allCategories = [
    "Semua",
    ...Array.from(new Set(articles.map((a) => a.category))),
  ]
  const categories = allCategories

  const filteredArticles =
    activeTab === "semua"
      ? articles
      : articles.filter(
          (a) => a.category.toLowerCase() === activeTab.toLowerCase()
        )

  return (
    <div className="pb-20 bg-background min-h-screen">
      <div className="bg-white border-b border-border shadow-soft-sm sticky top-0 z-10">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <h2>Tips & Panduan</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Pelajari cara merawat kucing dengan baik
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveTab(cat.toLowerCase())}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all font-medium ${
                  activeTab === cat.toLowerCase()
                    ? "bg-primary text-white shadow-soft"
                    : "bg-muted text-foreground border border-border hover:border-primary"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filteredArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ArticleCard
              title={article.title}
              category={article.category}
              readTime={article.readTime}
              image={article.image}
              excerpt={article.excerpt}
              onClick={() => onNavigate("article", article)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};


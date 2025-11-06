import { ChevronLeft, Clock, Share2 } from "lucide-react"
import { Badge } from "../components/ui/badge"
import { ImageWithFallback } from "../components/ui/ImageWithFallback"

export const ArticleDetailPage = ({
  article,
  onNavigate,
}) => {
  return (
    <div className="pb-20 bg-background min-h-screen">
      <div className="relative">
        <div className="h-64 bg-muted relative">
          <ImageWithFallback
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <button
          onClick={() => onNavigate("tips")}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card shadow-lg flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card shadow-lg flex items-center justify-center">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 -mt-4">
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{article.category}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{article.readTime}</span>
            </div>
          </div>

          <h1 className="mb-4">{article.title}</h1>

          <div
            className="prose prose-sm max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </div>
  );
};


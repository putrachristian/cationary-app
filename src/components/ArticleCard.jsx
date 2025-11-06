import { ImageWithFallback } from "./ui/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Clock, ChevronRight } from "lucide-react";

export const ArticleCard = ({ title, category, readTime, image, excerpt, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-card rounded-xl overflow-hidden shadow-soft border border-border cursor-pointer transition-all hover:shadow-soft-lg hover:border-primary/30 active:scale-[0.99] flex gap-3 p-3"
    >
      <div className="w-24 h-24 flex-shrink-0 relative bg-muted rounded-lg overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="default" className="text-xs">
            {category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{readTime}</span>
          </div>
        </div>
        <h4 className="text-sm mb-1 line-clamp-2 leading-snug">{title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{excerpt}</p>
      </div>
      <div className="flex items-center">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
};


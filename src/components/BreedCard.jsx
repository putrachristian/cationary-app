import { motion } from "motion/react";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { Badge } from "./ui/badge";
import { MapPin } from "lucide-react";

export const BreedCard = ({ breed, name, origin, image, tags, onClick }) => {
  const breedName = breed?.name || name;
  const breedOrigin = breed?.origin || origin;
  const breedImage = breed?.image || image;
  const breedTags = breed?.tags || tags;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border cursor-pointer transition-all hover:shadow-soft-lg hover:border-primary/30"
    >
      <div className="aspect-square relative bg-muted overflow-hidden">
        <ImageWithFallback
          src={breedImage}
          alt={breedName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="mb-1.5 text-base">{breedName}</h3>
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {breedOrigin}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {breedTags?.slice(0, 2).map((tag, i) => (
            <Badge key={i} variant="default" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
};


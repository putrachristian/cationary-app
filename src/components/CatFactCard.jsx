import { Share2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "motion/react";

export const CatFactCard = ({ emoji, title, description, onShare, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-5 shadow-soft border border-border hover:shadow-soft-lg hover:border-primary/30 transition-all">
        {/* Emoji Badge */}
        <div className="flex items-start gap-4 mb-3">
          <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-warm flex items-center justify-center text-2xl shadow-soft">
            {emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Share Button */}
        {onShare && (
          <div className="flex justify-end pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              className="text-primary hover:bg-primary/10"
            >
              <Share2 className="w-4 h-4" />
              Bagikan
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};


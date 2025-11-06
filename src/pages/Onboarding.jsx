import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";

const slides = [
  {
    title: "Selamat Datang di Cationary",
    description: "Temukan informasi lengkap tentang berbagai ras kucing dan temukan ras yang cocok untuk Anda.",
    emoji: "🐱",
    color: "#F4A261"
  },
  {
    title: "Jelajahi Ras Kucing",
    description: "Pelajari karakteristik, kepribadian, dan kebutuhan perawatan dari puluhan ras kucing populer.",
    emoji: "📚",
    color: "#A3B18A"
  },
  {
    title: "Cat Match Quiz",
    description: "Ikuti kuis singkat untuk menemukan ras kucing yang paling sesuai dengan gaya hidup Anda.",
    emoji: "✨",
    color: "#E9C46A"
  }
];

export const Onboarding = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div 
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-soft-lg mb-6"
                style={{ backgroundColor: slide.color }}
              >
                <span className="text-7xl">{slide.emoji}</span>
              </div>
            </motion.div>

            <h1 className="mb-4 text-2xl">{slide.title}</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {slide.description}
            </p>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? "w-8 bg-primary" 
                      : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 space-y-3">
        <Button 
          onClick={handleNext} 
          size="lg" 
          className="w-full"
        >
          {currentSlide === slides.length - 1 ? "Mulai" : "Lanjut"}
          <ChevronRight className="w-5 h-5" />
        </Button>
        {currentSlide < slides.length - 1 && (
          <Button 
            onClick={handleSkip} 
            variant="ghost" 
            size="lg"
            className="w-full"
          >
            Lewati
          </Button>
        )}
      </div>
    </div>
  );
};


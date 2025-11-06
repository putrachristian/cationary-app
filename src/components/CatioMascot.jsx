import { motion } from "motion/react";

export const CatioMascot = ({ 
  variant = "wave", 
  size = "md",
  className = "" 
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  const animations = {
    wave: {
      initial: { rotate: 0 },
      animate: { 
        rotate: [0, -10, 10, -10, 0],
        transition: { 
          duration: 2, 
          repeat: Infinity,
          repeatDelay: 3 
        }
      }
    },
    magnifier: {
      initial: { scale: 1 },
      animate: { 
        scale: [1, 1.1, 1],
        transition: { 
          duration: 2, 
          repeat: Infinity 
        }
      }
    },
    happy: {
      initial: { y: 0 },
      animate: { 
        y: [0, -10, 0],
        transition: { 
          duration: 0.6, 
          repeat: Infinity,
          repeatDelay: 1 
        }
      }
    },
    sleep: {
      initial: { opacity: 1 },
      animate: { 
        opacity: [1, 0.7, 1],
        transition: { 
          duration: 2, 
          repeat: Infinity 
        }
      }
    },
    heart: {
      initial: { scale: 1 },
      animate: { 
        scale: [1, 1.2, 1],
        transition: { 
          duration: 1, 
          repeat: Infinity 
        }
      }
    },
    thinking: {
      initial: { rotate: 0 },
      animate: { 
        rotate: [0, 5, -5, 0],
        transition: { 
          duration: 3, 
          repeat: Infinity 
        }
      }
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} flex items-center justify-center`}
      {...animations[variant]}
    >
      {/* Placeholder untuk Lottie Animation - Menggunakan SVG sederhana untuk sementara */}
      <div className="relative w-full h-full flex items-center justify-center">
        {variant === "wave" && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Cat body */}
            <ellipse cx="50" cy="60" rx="30" ry="25" fill="#FFB6C1" />
            {/* Cat head */}
            <circle cx="50" cy="35" r="20" fill="#FFB6C1" />
            {/* Left ear */}
            <path d="M 35 25 L 30 10 L 40 20 Z" fill="#FFB6C1" />
            {/* Right ear */}
            <path d="M 65 25 L 70 10 L 60 20 Z" fill="#FFB6C1" />
            {/* Eyes */}
            <circle cx="43" cy="33" r="3" fill="#3F3A39" />
            <circle cx="57" cy="33" r="3" fill="#3F3A39" />
            {/* Nose */}
            <circle cx="50" cy="40" r="2" fill="#FF9EAA" />
            {/* Mouth */}
            <path d="M 50 40 Q 45 45 43 43 M 50 40 Q 55 45 57 43" stroke="#3F3A39" strokeWidth="1.5" fill="none" />
            {/* Whiskers */}
            <line x1="30" y1="38" x2="40" y2="37" stroke="#3F3A39" strokeWidth="1" />
            <line x1="30" y1="42" x2="40" y2="42" stroke="#3F3A39" strokeWidth="1" />
            <line x1="70" y1="38" x2="60" y2="37" stroke="#3F3A39" strokeWidth="1" />
            <line x1="70" y1="42" x2="60" y2="42" stroke="#3F3A39" strokeWidth="1" />
            {/* Paw (waving) */}
            <circle cx="75" cy="50" r="5" fill="#FFB6C1" />
          </svg>
        )}

        {variant === "magnifier" && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="60" rx="30" ry="25" fill="#FFD6A5" />
            <circle cx="50" cy="35" r="20" fill="#FFD6A5" />
            <path d="M 35 25 L 30 10 L 40 20 Z" fill="#FFD6A5" />
            <path d="M 65 25 L 70 10 L 60 20 Z" fill="#FFD6A5" />
            <circle cx="43" cy="33" r="3" fill="#3F3A39" />
            <circle cx="57" cy="33" r="3" fill="#3F3A39" />
            <circle cx="50" cy="40" r="2" fill="#FF9EAA" />
            <path d="M 50 40 Q 45 45 43 43 M 50 40 Q 55 45 57 43" stroke="#3F3A39" strokeWidth="1.5" fill="none" />
            {/* Magnifying glass */}
            <circle cx="70" cy="65" r="10" fill="none" stroke="#3F3A39" strokeWidth="2" />
            <line x1="77" y1="72" x2="85" y2="80" stroke="#3F3A39" strokeWidth="3" />
          </svg>
        )}

        {variant === "happy" && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="60" rx="30" ry="25" fill="#C3F0CA" />
            <circle cx="50" cy="35" r="20" fill="#C3F0CA" />
            <path d="M 35 25 L 30 10 L 40 20 Z" fill="#C3F0CA" />
            <path d="M 65 25 L 70 10 L 60 20 Z" fill="#C3F0CA" />
            <circle cx="43" cy="33" r="3" fill="#3F3A39" />
            <circle cx="57" cy="33" r="3" fill="#3F3A39" />
            <circle cx="50" cy="40" r="2" fill="#FF9EAA" />
            {/* Big smile */}
            <path d="M 40 42 Q 50 50 60 42" stroke="#3F3A39" strokeWidth="2" fill="none" />
            {/* Hearts */}
            <text x="20" y="30" fontSize="12" fill="#FFB6C1">💕</text>
            <text x="75" y="35" fontSize="10" fill="#FFB6C1">✨</text>
          </svg>
        )}

        {variant === "sleep" && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="65" rx="30" ry="20" fill="#E8C5E5" />
            <circle cx="50" cy="40" r="18" fill="#E8C5E5" />
            <path d="M 35 30 L 32 18 L 40 25 Z" fill="#E8C5E5" />
            <path d="M 65 30 L 68 18 L 60 25 Z" fill="#E8C5E5" />
            {/* Closed eyes */}
            <line x1="40" y1="38" x2="46" y2="38" stroke="#3F3A39" strokeWidth="2" />
            <line x1="54" y1="38" x2="60" y2="38" stroke="#3F3A39" strokeWidth="2" />
            <circle cx="50" cy="45" r="2" fill="#FF9EAA" />
            {/* Zzz */}
            <text x="65" y="25" fontSize="10" fill="#9A8C8C">Z</text>
            <text x="72" y="18" fontSize="8" fill="#9A8C8C">z</text>
            <text x="78" y="13" fontSize="6" fill="#9A8C8C">z</text>
          </svg>
        )}

        {variant === "heart" && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="60" rx="30" ry="25" fill="#FFB6C1" />
            <circle cx="50" cy="35" r="20" fill="#FFB6C1" />
            <path d="M 35 25 L 30 10 L 40 20 Z" fill="#FFB6C1" />
            <path d="M 65 25 L 70 10 L 60 20 Z" fill="#FFB6C1" />
            <circle cx="43" cy="33" r="3" fill="#3F3A39" />
            <circle cx="57" cy="33" r="3" fill="#3F3A39" />
            <circle cx="50" cy="40" r="2" fill="#FF9EAA" />
            <path d="M 50 40 Q 45 45 43 43 M 50 40 Q 55 45 57 43" stroke="#3F3A39" strokeWidth="1.5" fill="none" />
            {/* Big heart */}
            <text x="40" y="30" fontSize="20" fill="#FF5A7A">❤️</text>
          </svg>
        )}

        {variant === "thinking" && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="60" rx="30" ry="25" fill="#B4D7F1" />
            <circle cx="50" cy="35" r="20" fill="#B4D7F1" />
            <path d="M 35 25 L 30 10 L 40 20 Z" fill="#B4D7F1" />
            <path d="M 65 25 L 70 10 L 60 20 Z" fill="#B4D7F1" />
            <circle cx="43" cy="35" r="2" fill="#3F3A39" />
            <circle cx="57" cy="35" r="2" fill="#3F3A39" />
            <circle cx="50" cy="42" r="2" fill="#FF9EAA" />
            <path d="M 45 45 Q 50 47 55 45" stroke="#3F3A39" strokeWidth="1.5" fill="none" />
            {/* Thought bubbles */}
            <circle cx="70" cy="20" r="8" fill="white" stroke="#9A8C8C" strokeWidth="1" />
            <circle cx="78" cy="15" r="4" fill="white" stroke="#9A8C8C" strokeWidth="1" />
            <circle cx="83" cy="12" r="2" fill="white" stroke="#9A8C8C" strokeWidth="1" />
            <text x="65" y="25" fontSize="10">🐾</text>
          </svg>
        )}
      </div>
    </motion.div>
  );
};


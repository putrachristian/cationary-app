import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "./ui/button"
import { toast } from "sonner"

export const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true

    if (isInstalled) {
      console.log("InstallPrompt: Already installed, skipping")
      return
    }

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem("cationary-install-dismissed")
    const dismissedTime = dismissed ? parseInt(dismissed) : 0
    const oneDayInMs = 24 * 60 * 60 * 1000

    // Don't show if dismissed within last day
    if (dismissedTime && Date.now() - dismissedTime < oneDayInMs) {
      console.log("InstallPrompt: Dismissed recently, skipping")
      return
    }

    // Detect iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(iOS)

    // For iOS, show prompt after a delay
    if (iOS) {
      console.log("InstallPrompt: iOS detected, showing after delay")
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 5000)
      return () => clearTimeout(timer)
    }

    // For Android/Desktop - listen for beforeinstallprompt
    let fallbackTimer = null
    let hasShownPrompt = false

    const handleBeforeInstall = (e) => {
      console.log("InstallPrompt: beforeinstallprompt event fired")
      e.preventDefault()
      setDeferredPrompt(e)

      // Clear fallback timer since we got the event
      if (fallbackTimer) {
        clearTimeout(fallbackTimer)
        fallbackTimer = null
      }

      // Show prompt after a delay
      setTimeout(() => {
        if (!hasShownPrompt) {
          hasShownPrompt = true
          setShowPrompt(true)
        }
      }, 5000)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)

    // Fallback: If beforeinstallprompt doesn't fire within 10 seconds,
    // show prompt anyway (for testing or if browser doesn't fire event)
    fallbackTimer = setTimeout(() => {
      console.log("InstallPrompt: Fallback - showing prompt after timeout")
      if (!hasShownPrompt && !deferredPrompt) {
        // Check if we can still show (maybe browser just didn't fire event)
        setShowPrompt(true)
      }
    }, 10000)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
      if (fallbackTimer) {
        clearTimeout(fallbackTimer)
      }
    }
  }, [])

  const handleInstall = async () => {
    // If we have the native prompt, use it
    if (deferredPrompt) {
      try {
        console.log("InstallPrompt: Using native install prompt")
        // Show the install prompt
        await deferredPrompt.prompt()

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === "accepted") {
          console.log("User accepted the install prompt")
          setShowPrompt(false)
        } else {
          console.log("User dismissed the install prompt")
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null)
      } catch (error) {
        console.error("InstallPrompt: Error showing native prompt", error)
        // Fall through to manual instructions
      }
    } else {
      // Fallback: Show manual instructions
      console.log(
        "InstallPrompt: No native prompt available, showing instructions"
      )

      // Detect if Android
      const isAndroid = /Android/.test(navigator.userAgent)

      if (isAndroid) {
        // For Android, show instructions via toast
        toast.info("Cara Install Aplikasi", {
          description:
            "1. Tap menu (3 titik) di pojok kanan atas\n2. Pilih 'Install app' atau 'Add to Home screen'\n3. Tap 'Install' untuk konfirmasi",
          duration: 8000,
        })
      } else {
        // For desktop, show instructions
        toast.info("Cara Install Aplikasi", {
          description:
            "1. Klik ikon install (+) di address bar, atau\n2. Menu (3 titik) → 'Install Cationary'",
          duration: 8000,
        })
      }

      // Dismiss the prompt after showing instructions
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("cationary-install-dismissed", Date.now().toString())
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-16 left-0 right-0 z-40 px-3 pb-2"
        >
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-border p-3 flex items-center gap-3">
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-all flex-shrink-0"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 shadow-soft">
              <span className="text-xl">🐱</span>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-tight">
                {isIOS
                  ? "Install Cationary untuk akses cepat"
                  : "Install aplikasi, akses offline & lebih cepat!"}
              </p>
            </div>

            {/* Install Button */}
            <Button
              onClick={isIOS ? handleDismiss : handleInstall}
              size="sm"
              className="h-9 px-5 flex-shrink-0"
            >
              {isIOS ? "OK" : "Install"}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


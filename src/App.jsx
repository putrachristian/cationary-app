import { useState, useEffect, useRef } from "react"
import { Toaster } from "./components/ui/sonner"
import { BottomNav } from "./components/BottomNav"
import { InstallPrompt } from "./components/InstallPropmt"
import { Onboarding } from "./pages/Onboarding"
import { HomePage } from "./pages/HomePage"
import { BreedsPage } from "./pages/BreedsPage"
import { BreedDetailPage } from "./pages/BreedDetailPage"
import { CatMatchPage } from "./pages/CatMatchPage"
import { TipsPage } from "./pages/TipsPage"
import { ArticleDetailPage } from "./pages/ArticleDetailPage"
import { FavoritPage } from "./pages/FavoritPage"
import { FunCatFactsPage } from "./pages/FunCatFactsPage"
import { ChatPage } from "./pages/ChatPage"

const ONBOARDING_KEY = "cationary_onboarding_completed"

const App = () => {
  const [currentPage, setCurrentPage] = useState("onboarding")
  const [pageData, setPageData] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [previousPage, setPreviousPage] = useState(null)
  const [matchResults, setMatchResults] = useState([])
  const isNavigatingRef = useRef(false)

  // Check if onboarding has been completed on mount
  useEffect(() => {
    const hasCompletedOnboarding =
      localStorage.getItem(ONBOARDING_KEY) === "true"

    if (hasCompletedOnboarding) {
      // Skip onboarding if already completed
      setShowOnboarding(false)
      setCurrentPage("home")

      // Set initial history state to home
      const initialState = {
        page: "home",
        pageData: null,
        previousPage: null,
      }
      window.history.replaceState(initialState, "", window.location.href)
    } else {
      // Set initial history state to onboarding
      const initialState = {
        page: "onboarding",
        pageData: null,
        previousPage: null,
      }
      window.history.replaceState(initialState, "", window.location.href)
    }

    // Handle browser back/forward buttons
    const handlePopState = (event) => {
      if (event.state) {
        isNavigatingRef.current = true
        const state = event.state
        setCurrentPage(state.page)
        setPageData(state.pageData)
        setPreviousPage(state.previousPage)

        // Only show onboarding if it hasn't been completed
        const hasCompletedOnboarding =
          localStorage.getItem(ONBOARDING_KEY) === "true"
        if (state.page === "onboarding" && !hasCompletedOnboarding) {
          setShowOnboarding(true)
        } else if (state.page === "onboarding" && hasCompletedOnboarding) {
          // If trying to go back to onboarding but already completed, redirect to home
          setCurrentPage("home")
          const homeState = {
            page: "home",
            pageData: null,
            previousPage: state.previousPage,
          }
          window.history.replaceState(homeState, "", window.location.href)
        }
      }
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  const navigate = (page, data) => {
    // Don't add history entry if we're navigating from browser back/forward
    if (!isNavigatingRef.current) {
      const newState = {
        page,
        pageData: data || null,
        previousPage: currentPage,
      }

      // Push new state to browser history
      window.history.pushState(newState, "", window.location.href)
    } else {
      isNavigatingRef.current = false
    }

    setPreviousPage(currentPage)
    setCurrentPage(page)
    setPageData(data || null)
  }

  const handleOnboardingComplete = () => {
    // Save onboarding completion status to localStorage
    localStorage.setItem(ONBOARDING_KEY, "true")
    setShowOnboarding(false)
    const newState = {
      page: "home",
      pageData: null,
      previousPage: "onboarding",
    }
    window.history.pushState(newState, "", window.location.href)
    setCurrentPage("home")
  }

  // Show bottom nav for main 4 pages
  const showBottomNav = ["home", "breeds", "match", "tips", "chat"].includes(
    currentPage
  )

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative">
      {/* Pages */}
      {currentPage === "onboarding" && showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {currentPage === "home" && <HomePage onNavigate={navigate} />}

      {currentPage === "breeds" && <BreedsPage onNavigate={navigate} />}

      {currentPage === "breed-detail" && pageData && (
        <BreedDetailPage
          breed={pageData}
          onNavigate={navigate}
          previousPage={previousPage}
        />
      )}

      {currentPage === "match" && (
        <CatMatchPage
          onNavigate={navigate}
          savedResults={matchResults}
          onSaveResults={setMatchResults}
        />
      )}

      {currentPage === "tips" && <TipsPage onNavigate={navigate} />}

      {currentPage === "article" && pageData && (
        <ArticleDetailPage article={pageData} onNavigate={navigate} />
      )}

      {currentPage === "favorit" && <FavoritPage onNavigate={navigate} />}

      {currentPage === "fun-facts" && <FunCatFactsPage onNavigate={navigate} />}

      {currentPage === "chat" && <ChatPage onNavigate={navigate} />}

      {/* Bottom Navigation - Only for main 4 tabs */}
      {showBottomNav && (
        <BottomNav active={currentPage} onNavigate={navigate} />
      )}

      {/* Install Prompt */}
      <InstallPrompt />

      {/* Toast Notifications */}
      <Toaster position="top-center" />
    </div>
  );
};

export default App;


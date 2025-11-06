import { Home, Compass, Target, BookOpen } from "lucide-react";

export const BottomNav = ({ active, onNavigate }) => {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "breeds", icon: Compass, label: "Breeds" },
    { id: "match", icon: Target, label: "Match" },
    { id: "tips", icon: BookOpen, label: "Tips" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border shadow-soft-lg z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 relative ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 inset-x-0 h-0.5 bg-primary rounded-full" />
              )}
              <Icon 
                className={`w-6 h-6 transition-all duration-300 ${
                  isActive ? "" : "group-hover:scale-110"
                }`} 
              />
              <span className={`text-xs ${
                isActive ? "font-semibold" : "font-normal"
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


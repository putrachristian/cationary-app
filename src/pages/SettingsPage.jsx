import { useState } from "react";
import { ChevronLeft, Moon, Bell, Info, MessageSquare } from "lucide-react";
import { Switch } from "../components/ui/switch";

export const SettingsPage = ({ onNavigate }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="pb-20 bg-background min-h-screen">
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate("profile")}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2>Pengaturan</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Preferences */}
        <div>
          <h3 className="mb-3">Preferensi</h3>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p>Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Aktifkan tema gelap</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p>Notifikasi</p>
                  <p className="text-sm text-muted-foreground">Terima pembaruan artikel</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="mb-3">Lainnya</h3>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left flex-1">
                <p>Tentang Cationary</p>
                <p className="text-sm text-muted-foreground">Versi 1.0.0</p>
              </div>
            </button>

            <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left flex-1">
                <p>Feedback & Saran</p>
                <p className="text-sm text-muted-foreground">Bantu kami berkembang</p>
              </div>
            </button>
          </div>
        </div>

        <div className="text-center pt-6">
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for cat lovers
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2025 Cationary. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};


import { useState } from "react";
import { Plus, Settings, Edit, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

export const ProfilePage = ({ onNavigate }) => {
  const [myCats, setMyCats] = useState([
    {
      id: "1",
      name: "Mochi",
      breed: "Ragdoll",
      age: "2 tahun",
      weight: "5.5 kg",
      image: "https://images.unsplash.com/photo-1620933288385-b2f6f1931d9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWdkb2xsJTIwY2F0fGVufDF8fHx8MTc2MjI3ODI3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCat, setNewCat] = useState({
    name: "",
    breed: "",
    age: "",
    weight: ""
  });

  const handleAddCat = () => {
    if (newCat.name && newCat.breed) {
      const cat = {
        id: Date.now().toString(),
        ...newCat,
        image: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0fGVufDF8fHx8MTc2MjI0ODY3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
      };
      setMyCats([...myCats, cat]);
      setNewCat({ name: "", breed: "", age: "", weight: "" });
      setIsDialogOpen(false);
      toast.success("Kucing berhasil ditambahkan!");
    }
  };

  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-accent p-6 pb-12 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-card">Profil Saya</h2>
          <button 
            onClick={() => onNavigate("settings")}
            className="w-10 h-10 rounded-full bg-card/20 flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-card" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-4 border-card">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-card mb-1">John Doe</h3>
            <p className="text-card/80 text-sm">Cat Lover 🐱</p>
          </div>
          <button className="ml-auto w-10 h-10 rounded-full bg-card/20 flex items-center justify-center">
            <Edit className="w-5 h-5 text-card" />
          </button>
        </div>
      </div>

      <div className="px-6 -mt-6">
        {/* Stats */}
        <div className="bg-card rounded-2xl p-4 shadow-lg border border-border mb-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl text-primary mb-1">{myCats.length}</p>
            <p className="text-xs text-muted-foreground">Kucing</p>
          </div>
          <div className="text-center border-l border-r border-border">
            <p className="text-2xl text-primary mb-1">12</p>
            <p className="text-xs text-muted-foreground">Artikel Favorit</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-primary mb-1">5</p>
            <p className="text-xs text-muted-foreground">Ras Favorit</p>
          </div>
        </div>

        {/* My Cats Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Kucing-ku</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Tambah Kucing Baru</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="name">Nama</Label>
                    <Input
                      id="name"
                      value={newCat.name}
                      onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                      placeholder="Nama kucing"
                    />
                  </div>
                  <div>
                    <Label htmlFor="breed">Ras</Label>
                    <Input
                      id="breed"
                      value={newCat.breed}
                      onChange={(e) => setNewCat({ ...newCat, breed: e.target.value })}
                      placeholder="Contoh: Persian"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Umur</Label>
                    <Input
                      id="age"
                      value={newCat.age}
                      onChange={(e) => setNewCat({ ...newCat, age: e.target.value })}
                      placeholder="Contoh: 2 tahun"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Berat</Label>
                    <Input
                      id="weight"
                      value={newCat.weight}
                      onChange={(e) => setNewCat({ ...newCat, weight: e.target.value })}
                      placeholder="Contoh: 4.5 kg"
                    />
                  </div>
                  <Button 
                    onClick={handleAddCat}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Simpan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {myCats.map((cat) => (
              <div
                key={cat.id}
                className="bg-card p-4 rounded-xl border border-border flex gap-4"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1">{cat.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{cat.breed}</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {cat.age}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {cat.weight}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button className="w-full bg-card p-4 rounded-xl border border-border flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <span>Ras Favorit Saya</span>
          </button>

          <button className="w-full bg-card p-4 rounded-xl border border-border flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-accent" />
            </div>
            <span>Pengaturan</span>
          </button>
        </div>
      </div>
    </div>
  );
};


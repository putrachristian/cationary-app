import { useState } from "react";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const glossaryTerms = [
  {
    letter: "A",
    terms: [
      {
        term: "Alergi Kucing",
        definition: "Reaksi sistem kekebalan tubuh terhadap protein yang ditemukan dalam air liur, urin, atau bulu kucing. Gejalanya termasuk bersin, mata gatal, dan hidung tersumbat."
      },
      {
        term: "Adopsi",
        definition: "Proses mengambil kucing dari shelter, rescue group, atau pemilik sebelumnya untuk dipelihara secara permanen."
      }
    ]
  },
  {
    letter: "B",
    terms: [
      {
        term: "Bulu Panjang (Longhair)",
        definition: "Kucing dengan bulu yang lebih panjang dari rata-rata, memerlukan grooming lebih intensif. Contoh: Persian, Maine Coon."
      },
      {
        term: "Bulu Pendek (Shorthair)",
        definition: "Kucing dengan bulu pendek yang lebih mudah dirawat. Contoh: British Shorthair, American Shorthair."
      }
    ]
  },
  {
    letter: "G",
    terms: [
      {
        term: "Grooming",
        definition: "Perawatan bulu dan kebersihan kucing, termasuk menyisir, memandikan, memotong kuku, dan membersihkan telinga."
      }
    ]
  },
  {
    letter: "H",
    terms: [
      {
        term: "Hypoallergenic",
        definition: "Kucing yang menghasilkan lebih sedikit alergen. Contoh: Sphynx, Russian Blue, Balinese."
      }
    ]
  },
  {
    letter: "K",
    terms: [
      {
        term: "Kuku (Declawing)",
        definition: "Proses bedah untuk menghilangkan cakar kucing. Tidak direkomendasikan karena menyakitkan dan dapat menyebabkan masalah perilaku."
      },
      {
        term: "Kastrasi/Sterilisasi",
        definition: "Prosedur bedah untuk mencegah kucing berkembang biak. Memiliki banyak manfaat kesehatan dan perilaku."
      }
    ]
  },
  {
    letter: "L",
    terms: [
      {
        term: "Litter Box",
        definition: "Kotak pasir tempat kucing buang air. Harus dibersihkan secara rutin dan ditempatkan di lokasi yang tenang."
      }
    ]
  },
  {
    letter: "S",
    terms: [
      {
        term: "Scratching Post",
        definition: "Tiang atau papan yang disediakan untuk kucing mencakar, membantu menjaga kesehatan kuku dan mencegah kerusakan furnitur."
      },
      {
        term: "Spaying/Neutering",
        definition: "Sterilisasi betina (spaying) atau jantan (neutering) untuk mencegah reproduksi."
      }
    ]
  },
  {
    letter: "V",
    terms: [
      {
        term: "Vaksinasi",
        definition: "Pemberian vaksin untuk mencegah penyakit serius seperti rabies, panleukopenia, dan calicivirus. Harus dilakukan secara rutin."
      }
    ]
  }
];

export const CatpediaPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = searchQuery
    ? glossaryTerms.map(group => ({
        ...group,
        terms: group.terms.filter(
          t =>
            t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.definition.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(group => group.terms.length > 0)
    : glossaryTerms;

  return (
    <div className="pb-20 bg-background min-h-screen">
      <div className="bg-card border-b border-border p-4">
        <h2 className="mb-4">Catpedia</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari istilah kucing..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-0 outline-none"
          />
        </div>
      </div>

      <div className="p-4">
        {filteredTerms.map((group) => (
          <div key={group.letter} className="mb-6">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3">
              <span className="text-xl">{group.letter}</span>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {group.terms.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`${group.letter}-${index}`}
                  className="bg-card border border-border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline">
                    {item.term}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.definition}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};


export interface Product {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: number;
  originalPrice?: number;
  isCombo?: boolean;
  image: string;
}

export const categories = [
  "Todos",
  "UniTv",
  "YouCine",
  "CineDuo",
  "OnPix Tv",
  "LuaTv",
];

export const products: Product[] = [
  // YouCine
  {
    id: "youcine-30d",
    name: "Recarga YouCine 30D",
    category: "YouCine",
    duration: "30 Dias",
    price: 9.99,
    originalPrice: 14.99,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop",
  },
  {
    id: "youcine-365d",
    name: "Recarga YouCine 365D",
    category: "YouCine",
    duration: "365 Dias",
    price: 90.0,
    originalPrice: 139.99,
    isCombo: true,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop",
  },
  // UniTv
  {
    id: "unitv-30d",
    name: "Recarga UniTv 30D",
    category: "UniTv",
    duration: "30 Dias",
    price: 15.0,
    originalPrice: 19.99,
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop",
  },
  {
    id: "unitv-90d",
    name: "Recarga UniTv 90D",
    category: "UniTv",
    duration: "90 Dias",
    price: 40.0,
    originalPrice: 54.99,
    isCombo: true,
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop",
  },
  {
    id: "unitv-180d",
    name: "Recarga UniTv 180D",
    category: "UniTv",
    duration: "180 Dias",
    price: 80.0,
    originalPrice: 109.99,
    isCombo: true,
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop",
  },
  {
    id: "unitv-365d",
    name: "Recarga UniTv 365D",
    category: "UniTv",
    duration: "365 Dias",
    price: 100.0,
    originalPrice: 159.99,
    isCombo: true,
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop",
  },
  // CineDuo
  {
    id: "cineduo-365d",
    name: "Recarga CineDuo 365D",
    category: "CineDuo",
    duration: "365 Dias",
    price: 99.99,
    originalPrice: 149.99,
    isCombo: true,
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8d6f2b?w=400&h=300&fit=crop",
  },
  // OnPix Tv
  {
    id: "onpix-30d",
    name: "Recarga OnPix Tv 30D",
    category: "OnPix Tv",
    duration: "30 Dias",
    price: 10.0,
    originalPrice: 14.99,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop",
  },
  {
    id: "onpix-365d",
    name: "Recarga OnPix Tv 365D",
    category: "OnPix Tv",
    duration: "365 Dias",
    price: 99.99,
    originalPrice: 149.99,
    isCombo: true,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop",
  },
  // LuaTv
  {
    id: "luatv-90d",
    name: "Recarga LuaTv 90D",
    category: "LuaTv",
    duration: "90 Dias",
    price: 51.99,
    originalPrice: 74.99,
    isCombo: true,
    image: "https://images.unsplash.com/photo-1586899028174-e7098604235b?w=400&h=300&fit=crop",
  },
];

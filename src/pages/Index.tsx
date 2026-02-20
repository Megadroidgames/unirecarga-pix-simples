import { useState, useMemo } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import CheckoutModal from "@/components/CheckoutModal";
import Footer from "@/components/Footer";
import { products, Product } from "@/data/products";

const Index = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === "Todos" || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header search={search} onSearchChange={setSearch} />

      <main className="container mx-auto flex-1 px-4 py-6 sm:py-8">
        <section className="mb-6 text-center sm:mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Recarregue suas <span className="text-primary">assinaturas</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Escolha seu plano, pague via PIX e receba seu código na hora.
          </p>
        </section>

        <div className="mb-6 sm:mb-8">
          <CategoryFilter selected={category} onSelect={setCategory} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuy={setSelectedProduct}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            Nenhum produto encontrado.
          </p>
        )}
      </main>

      <Footer />

      <CheckoutModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Index;

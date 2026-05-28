'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '@/components/Interactions/MagneticButton';
import { useCartStore } from '@/store/cart';
import type { Product } from '@/lib/supabase';
import { useUIStore } from '@/store/ui';

// =============================================
// Props — receives live data from Server Component
// =============================================
interface ProductGridProps {
  products: Product[];
}

// =============================================
// Price formatter (PKR)
// =============================================
function formatPrice(amount: number): string {
  return `Rs ${amount.toLocaleString('en-PK')}`;
}

// =============================================
// Dynamic Hover-Fade Product Card Component
// =============================================
interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

function ProductCard({ product, onClick }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Fallback to a single-item array if products.images isn't set yet
  const images = product.images && product.images.length > 0
    ? product.images
    : (product.image_url ? [product.image_url] : []);

  useEffect(() => {
    if (!hovered || images.length <= 1) {
      setCurrentIdx(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 500);

    return () => clearInterval(interval);
  }, [hovered, images]);

  return (
    <motion.div
      layoutId={`card-${product.id}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="view"
      className="group relative flex flex-col gap-4 cursor-none"
    >
      <motion.div
        layoutId={`image-container-${product.id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#111136] rounded-xl ring-1 ring-indigo-900/30"
      >
        <AnimatePresence mode="popLayout">
          <motion.img
            key={`${product.id}-${currentIdx}`}
            src={images[currentIdx]}
            alt={product.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-75 group-hover:scale-105"
          />
        </AnimatePresence>

        {/* POD Badge */}
        {product.is_pod && (
          <span className="absolute top-3 left-3 bg-indigo-500 text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full z-10">
            Custom
          </span>
        )}
      </motion.div>

      <motion.div
        layoutId={`info-${product.id}`}
        className="flex justify-between items-start px-1"
      >
        <div className="flex flex-col gap-0.5">
          <motion.span
            layoutId={`category-${product.id}`}
            className="text-xs uppercase tracking-widest text-zinc-500"
          >
            {product.category || 'Sneaker'}
          </motion.span>
          <motion.h3
            layoutId={`title-${product.id}`}
            className="text-lg font-medium text-zinc-100"
          >
            {product.title}
          </motion.h3>
        </div>
        <motion.span
          layoutId={`price-${product.id}`}
          className="text-sm font-light text-zinc-400 mt-0.5 shrink-0"
        >
          {formatPrice(product.base_price)}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

// =============================================
// Main Product Grid & Overlay Modal
// =============================================
export default function ProductGrid({ products }: ProductGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const { addItem, openCart } = useCartStore();
  const { selectedCategory } = useUIStore();

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase())
    : products;

  const selectedProduct = products.find((p) => p.id === selectedId) ?? null;

  // Sync selected index back to 0 on detail close/switch
  useEffect(() => {
    setSelectedImageIdx(0);
  }, [selectedId]);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      productTitle: product.title,
      productImage: product.image_url,
      variantId: `${product.id}_default`,
      variant: {
        size: null,
        color: null,
        color_hex: null,
        sku: null,
        price_delta: 0,
      },
      basePrice: product.base_price,
      quantity: 1,
      isPod: product.is_pod,
      podCustomizations: null,
    });
    setSelectedId(null);   // Close overlay
    openCart();            // Slide the drawer open
  };

  // Extract selected product's image collection
  const selectedImages = selectedProduct
    ? (selectedProduct.images && selectedProduct.images.length > 0
        ? selectedProduct.images
        : (selectedProduct.image_url ? [selectedProduct.image_url] : []))
    : [];

  return (
    <section className="relative w-full px-4 py-24 md:px-12 lg:px-24" style={{ background: 'transparent' }}>

      {/* Section heading */}
      <div className="mb-16 max-w-7xl mx-auto flex items-end justify-between">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_25px_rgba(99,102,241,0.4)]">
          {selectedCategory ? `The Drop — ${selectedCategory}` : 'The Drop'}
        </h2>
        <span className="text-zinc-500 text-sm tracking-widest uppercase hidden md:block">
          {filteredProducts.length} pieces
        </span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mx-auto max-w-7xl">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedId(product.id)}
          />
        ))}
      </div>

      {/* ==============================
          Expanded Product Overlay
      ============================== */}
      <AnimatePresence>
        {selectedId && selectedProduct && (
          <motion.div
            key="overlay-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[990] flex items-center justify-center p-4 md:p-12 lg:p-24 bg-[#07071a]/90 backdrop-blur-md"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              layoutId={`card-${selectedProduct.id}`}
              className="relative w-full max-w-5xl h-full md:h-[80vh] flex flex-col md:flex-row bg-[#0d0d2b] overflow-hidden rounded-2xl shadow-2xl shadow-indigo-950/50 ring-1 ring-indigo-900/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-5 right-5 z-50 p-2 rounded-full bg-indigo-950/60 text-zinc-400 hover:text-white hover:bg-indigo-900 transition-all"
                data-cursor="close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image Panel & Thumbnail Strip */}
              <div className="relative w-full md:w-1/2 h-[45vw] md:h-full bg-[#111136] shrink-0 flex flex-col justify-between">
                <div className="relative flex-1 w-full overflow-hidden">
                  <motion.img
                    layoutId={`image-${selectedProduct.id}`}
                    src={selectedImages[selectedImageIdx] || selectedProduct.image_url || ''}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                  {selectedProduct.is_pod && (
                    <span className="absolute top-4 left-4 bg-indigo-500 text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full z-10">
                      Print-on-Demand
                    </span>
                  )}
                </div>

                {/* Bottom Gallery Thumbnail strip */}
                {selectedImages.length > 1 && (
                  <div className="flex gap-2 p-3 bg-zinc-950/80 backdrop-blur-md overflow-x-auto border-t border-zinc-900 shrink-0 select-none">
                    {selectedImages.map((img, idx) => (
                      <button
                        key={img}
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                          selectedImageIdx === idx ? 'border-indigo-500 scale-95 shadow' : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Panel */}
              <motion.div
                layoutId={`info-${selectedProduct.id}`}
                className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 overflow-y-auto"
              >
                <motion.span
                  layoutId={`category-${selectedProduct.id}`}
                  className="text-sm uppercase tracking-widest text-indigo-400 mb-3 inline-block"
                >
                  {selectedProduct.category || 'Sneaker'}
                </motion.span>

                <motion.h3
                  layoutId={`title-${selectedProduct.id}`}
                  className="text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-tight leading-tight"
                >
                  {selectedProduct.title}
                </motion.h3>

                <motion.span
                  layoutId={`price-${selectedProduct.id}`}
                  className="text-xl font-light text-zinc-300 mb-6 block"
                >
                  {formatPrice(selectedProduct.base_price)}
                </motion.span>

                {selectedProduct.description && (
                  <p className="text-zinc-400 font-light text-base mb-8 leading-relaxed max-w-md">
                    {selectedProduct.description}
                  </p>
                )}

                {/* POD Customisation Placeholder Notice */}
                {selectedProduct.is_pod && (
                  <div className="mb-8 p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10">
                    <p className="text-indigo-300 text-sm font-medium tracking-wide">
                      🎨 This is a Print-on-Demand item.
                    </p>
                    <p className="text-indigo-300/60 text-xs mt-1">
                      Customisation options (name, upload, etc.) will appear here in Phase 5.
                    </p>
                  </div>
                )}

                {/* Add to Cart — Magnetic Pull */}
                <MagneticButton className="self-start mt-auto">
                  <button
                    data-cursor="add"
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="px-10 py-4 bg-white text-black font-semibold uppercase tracking-wider rounded-full hover:bg-zinc-200 active:scale-95 transition-all"
                  >
                    Add to Cart
                  </button>
                </MagneticButton>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

'use client';

import { useCartStore } from '@/store/cart';
import type { Product } from '@/lib/supabase';

interface AddToCartButtonProps {
  product: Product;
  finalPrice: number;
}

export default function AddToCartButton({ product, finalPrice }: AddToCartButtonProps) {
  const { addItem, openCart } = useCartStore();

  const handleAdd = () => {
    addItem({
      productId: product.id,
      productTitle: product.title,
      productImage: product.image_url,
      variantId: `${product.id}_default`,
      variant: {
        size: null,
        color: null,
        color_hex: null,
        sku: product.sku || null,
        price_delta: 0,
      },
      basePrice: finalPrice,
      quantity: 1,
      isPod: product.is_pod,
      podCustomizations: null,
    });
    openCart();
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all shadow-xl active:scale-98"
    >
      Add to Cart
    </button>
  );
}

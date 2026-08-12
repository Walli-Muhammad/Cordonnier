import { getProductById, formatCurrency } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { product } = await getProductById(params.id);
  if (!product) return { title: 'Product Not Found | WALIM LTD' };
  return {
    title: `${product.title} | WALIM LTD Store`,
    description: product.description || `Buy ${product.title} online at WALIM LTD.`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { product } = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : (product.image_url ? [product.image_url] : []);

  const isOnSale = product.sale_price !== null && product.sale_price !== undefined && product.sale_price < product.base_price;
  const finalPrice = isOnSale ? (product.sale_price || product.base_price) : product.base_price;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-zinc-300 font-semibold">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative">
              {images.length > 0 ? (
                <img
                  src={images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-mono text-zinc-600">
                  No Image
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">
                {product.brand || 'WALIM LTD'} &middot; {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {isOnSale ? (
                  <>
                    <span className="text-3xl font-black text-white font-mono">
                      {formatCurrency(product.sale_price || 0, product.currency)}
                    </span>
                    <span className="text-base line-through text-zinc-500 font-mono">
                      {formatCurrency(product.base_price, product.currency)}
                    </span>
                    <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Sale
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-white font-mono">
                    {formatCurrency(product.base_price, product.currency)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t border-b border-zinc-900 py-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Description</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Specifications Box */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-3 text-xs">
              <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                <span className="text-zinc-500 font-semibold uppercase">SKU</span>
                <span className="text-zinc-200 font-mono">{product.sku || 'WLM-STD-001'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                <span className="text-zinc-500 font-semibold uppercase">Stock Availability</span>
                <span className="text-emerald-400 font-semibold">In Stock ({product.stock_count} units)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                <span className="text-zinc-500 font-semibold uppercase">Currency</span>
                <span className="text-zinc-200 font-mono">{product.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-semibold uppercase">Shipping</span>
                <span className="text-zinc-300">Standard UK Delivery (2-3 Business Days)</span>
              </div>
            </div>

            {/* Client Add to Cart Action */}
            <AddToCartButton product={product} finalPrice={finalPrice} />

          </div>

        </div>

      </div>
    </div>
  );
}

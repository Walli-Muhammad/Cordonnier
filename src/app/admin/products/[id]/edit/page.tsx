import { getProductById } from '@/lib/supabase';
import EditProductForm from './EditProductForm';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { product } = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  // Ensure that the product has the fields we need, and default them to prevent crashes
  const parsedProduct = {
    ...product,
    images: product.images || (product.image_url ? [product.image_url] : []),
  };

  return <EditProductForm product={parsedProduct} />;
}

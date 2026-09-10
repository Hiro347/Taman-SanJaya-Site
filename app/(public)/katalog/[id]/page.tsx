import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductById, getOtherProducts, getSiteSettings, getProducts } from '@/lib/data';
import ProductDetailView from '@/components/ProductDetailView';

export const revalidate = 60;

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.slug || product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductById(params.id);
  if (!product) {
    return {
      title: 'Tanaman Tidak Ditemukan - Taman San Jaya',
    };
  }

  return {
    title: `${product.name} | Katalog Taman San Jaya`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Taman San Jaya Nursery`,
      description: product.description,
      images: [
        {
          url: product.image_url,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const [product, otherProducts, settings] = await Promise.all([
    getProductById(params.id),
    getOtherProducts(params.id, 4),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailView
      product={product}
      otherProducts={otherProducts}
      settings={settings}
    />
  );
}

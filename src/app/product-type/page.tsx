'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { ProductType } from '@/types'
import { Check } from 'lucide-react'

function ProductTypeSelection() {
  const router = useRouter()
  const { state, dispatch } = useApp()

  useEffect(() => {
    if (!state.category) {
      router.push('/')
    }
  }, [state.category, router])

  if (!state.category) return null

  // Using high-quality placeholder images of specific garment types
  const products = [
    { 
      id: 'T-Shirt' as ProductType, 
      label: 'Classic T-Shirt', 
      description: '100% combed ringspun cotton',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
    },
    { 
      id: 'Hoodie' as ProductType, 
      label: 'Premium Hoodie', 
      description: 'Heavyweight fleece blend',
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'
    },
    { 
      id: 'LongSleeve' as ProductType, 
      label: 'Long Sleeve Tee', 
      description: 'Breathable mid-weight cotton',
      imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800'
    },
  ]

  const handleProductSelect = (productType: ProductType) => {
    dispatch({ type: 'SET_PRODUCT_TYPE', payload: productType })
    router.push('/design')
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 selection:bg-black selection:text-white">
      
      {/* Minimalist Top Nav */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter">MB<span className="text-gray-400">prints</span></div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => router.push('/')}
                className="text-sm text-gray-500 hover:text-black transition-colors"
             >
                Back
             </button>
             <div className="text-xs font-semibold uppercase tracking-widest text-gray-400">Step 02 / 04</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Select Garment
          </h1>
          <p className="text-lg text-gray-500">
            Choose the specific apparel style you want to customize for the {state.category === 'male' ? "Men's" : state.category === 'female' ? "Women's" : "Youth"} department.
          </p>
        </div>

        {/* Visual Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id}
              onClick={() => handleProductSelect(product.id)}
              className="group cursor-pointer flex flex-col gap-4"
            >
              {/* Image Container with Hover Zoom */}
              <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-sm border border-gray-200">
                <img 
                  src={product.imageUrl} 
                  alt={product.label}
                  className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>
              
              {/* Product Text */}
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-black transition-colors">
                  {product.label}
                </h3>
                <p className="text-sm text-gray-500">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

export default function ProductTypePage() {
  return <ProductTypeSelection />
}

'use client'

import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Category } from '@/types'
import { Check } from 'lucide-react'

function CategorySelection() {
  const router = useRouter()
  const { dispatch } = useApp()

  // Using high-quality placeholder images of blank apparel
  const categories = [
    { 
      id: 'male' as Category, 
      label: "Men's Apparel", 
      description: 'Standard & relaxed fit silhouettes',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
    },
    { 
      id: 'female' as Category, 
      label: "Women's Apparel", 
      description: 'Fitted & cropped silhouettes',
      imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800'
    },
    { 
      id: 'kid' as Category, 
      label: "Youth & Kids", 
      description: 'Durable basics for children',
      imageUrl: 'https://images.unsplash.com/photo-1519238263530-99eaa114fc5d?auto=format&fit=crop&q=80&w=800'
    },
  ]

  const handleCategorySelect = (category: Category) => {
    dispatch({ type: 'SET_CATEGORY', payload: category })
    router.push('/product-type')
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 selection:bg-black selection:text-white">
      
      {/* Minimalist Top Nav */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter">MB<span className="text-gray-400">prints</span></div>
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400">Step 01 / 04</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Design Custom Apparel
          </h1>
          <p className="text-lg text-gray-500">
            Select a category to start designing. Upload your logo or use our AI to generate stunning artwork in seconds.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Check size={16} className="text-black" /> No minimums
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Check size={16} className="text-black" /> Free digital proofs
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Check size={16} className="text-black" /> Fast Japanese shipping
            </div>
          </div>
        </div>

        {/* Visual Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div 
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="group cursor-pointer flex flex-col gap-4"
            >
              {/* Image Container with Hover Zoom */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-sm border border-gray-200">
                <img 
                  src={category.imageUrl} 
                  alt={category.label}
                  className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>
              
              {/* Category Text */}
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-black transition-colors">
                  {category.label}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

export default function Home() {
  return <CategorySelection />
}

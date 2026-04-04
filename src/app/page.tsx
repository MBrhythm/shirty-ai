'use client'

import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Category } from '@/types'
import { ArrowRight, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

function CategorySelection() {
  const router = useRouter()
  const { dispatch } = useApp()

  const categories = [
    { 
      id: 'male' as Category, 
      label: 'Men', 
      description: 'Standard & relaxed fit silhouettes',
    },
    { 
      id: 'female' as Category, 
      label: 'Women', 
      description: 'Fitted & cropped silhouettes',
    },
    { 
      id: 'kid' as Category, 
      label: 'Youth', 
      description: 'Durable basics for children',
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
      <main className="max-w-5xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Copywriting */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Premium custom <br/>apparel, simplified.
              </h1>
              <p className="text-lg text-gray-500 max-w-md leading-relaxed">
                Upload your artwork or generate designs with AI. We provide high-fidelity printing with fast turnaround across Japan.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 max-w-sm">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check size={16} className="text-black" /> Free digital mockups
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check size={16} className="text-black" /> Bulk pricing available
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check size={16} className="text-black" /> AI generation tools included
              </div>
            </div>
          </div>

          {/* Right Side: Selection Cards */}
          <div className="space-y-6">
            <div className="pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">Select Department</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="group relative w-full flex items-center justify-between p-6 bg-white border border-gray-200 hover:border-black transition-colors rounded-sm text-left shadow-sm hover:shadow-md"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-black">
                      {category.label}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors border border-gray-100">
                    <ArrowRight size={18} />
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default function Home() {
  return <CategorySelection />
}

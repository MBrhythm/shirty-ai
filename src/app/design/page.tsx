'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { TshirtColor } from '@/types'
import { Loader2, Upload, Sparkles, Check, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { NavigationHeader } from '@/components/navigation-header'

function DesignSelection() {
  const router = useRouter()
  const { state, dispatch } = useApp()
  
  // State for Tabs and File Upload
  const [activeMode, setActiveMode] = useState<'upload' | 'ai'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // AI Generator State
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedColor, setSelectedColor] = useState<TshirtColor>('white')
  const [isGenerating, setIsGenerating] = useState(false)

  const colors: { id: TshirtColor; name: string; hex: string; textClass: string; border?: string }[] = [
    { id: 'white', name: 'White', hex: '#FFFFFF', textClass: 'text-gray-900', border: 'border-gray-200' },
    { id: 'black', name: 'Black', hex: '#1A1A1A', textClass: 'text-white' },
    { id: 'navy', name: 'Navy', hex: '#1E293B', textClass: 'text-white' },
    { id: 'gray', name: 'Gray', hex: '#6B7280', textClass: 'text-white' },
    { id: 'red', name: 'Red', hex: '#EF4444', textClass: 'text-white' },
    { id: 'blue', name: 'Blue', hex: '#3B82F6', textClass: 'text-white' },
    { id: 'green', name: 'Green', hex: '#10B981', textClass: 'text-white' },
  ]

  const styles = [
    { id: 'realistic', label: 'Photorealistic' },
    { id: 'minimalist', label: 'Minimalist Line Art' },
    { id: 'vintage', label: 'Vintage & Retro' },
    { id: 'streetwear', label: 'Urban Streetwear' },
    { id: 'anime', label: 'Anime / Manga' },
    { id: 'pop', label: 'Bold Pop Art' },
  ]

  const promptSuggestions = [
    "A majestic dragon breathing colorful flames",
    "Minimalist mountain landscape silhouette",
    "Vintage bicycle with flowers",
    "Streetwear style typography design",
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      
      const design = {
        id: Date.now().toString(),
        prompt: 'Custom Client Upload',
        style: 'Custom',
        imageUrl: imageUrl
      }

      dispatch({ type: 'SET_DESIGN_WITH_COLOR', payload: { design, color: selectedColor } })
      router.push('/preview')
    }
    reader.readAsDataURL(file)
  }

  const handleGenerateDesign = async () => {
    if (!prompt || !selectedStyle) return

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          color: selectedColor,
          productType: state.productType,
          category: state.category
        })
      })

      const result = await response.json()

      if (result.success) {
        const design = {
          id: Date.now().toString(),
          prompt,
          style: selectedStyle,
          imageUrl: result.imageUrl
        }

        dispatch({ type: 'SET_DESIGN_WITH_COLOR', payload: { design, color: selectedColor } })
        router.push('/preview')
      } else {
        alert('Failed to generate image: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error generating design:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (!state.category || !state.productType) {
      router.push('/')
    }
  }, [state.category, state.productType, router])

  if (!state.category || !state.productType) return null

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900">
      <NavigationHeader 
        title="Configure Product"
        subtitle="Select options and provide your artwork"
        currentStep={3}
        totalSteps={4}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 space-y-12">
          
          {/* Section 1: Garment Color */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">1. Garment Color</h2>
              <p className="text-sm text-gray-500">Select the base color for your {state.productType.toLowerCase()}.</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    selectedColor === color.id ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105'
                  } ${color.border || ''}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor === color.id && (
                    <Check size={16} className={color.id === 'white' ? 'text-black' : 'text-white'} />
                  )}
                </button>
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Section 2: Artwork Source */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">2. Artwork Source</h2>
              <p className="text-sm text-gray-500">How would you like to provide the design?</p>
            </div>

            <div className="flex gap-4 p-1 bg-gray-50 border border-gray-200 rounded-sm w-full md:w-fit">
              <button 
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-sm transition-colors ${activeMode === 'upload' ? 'bg-white shadow-sm border border-gray-200 text-black' : 'text-gray-500 hover:text-gray-900'}`}
                onClick={() => setActiveMode('upload')}
              >
                <Upload size={16} />
                Upload Existing File
              </button>
              <button 
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-sm transition-colors ${activeMode === 'ai' ? 'bg-white shadow-sm border border-gray-200 text-black' : 'text-gray-500 hover:text-gray-900'}`}
                onClick={() => setActiveMode('ai')}
              >
                <Sparkles size={16} />
                Generate with AI
              </button>
            </div>

            {/* Content Based on Selection */}
            <div className="pt-4">
              {activeMode === 'upload' ? (
                <div className="border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors p-12 flex flex-col items-center justify-center rounded-sm text-center">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                    <Upload size={20} className="text-gray-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Upload High-Resolution Artwork</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-6 max-w-sm">We recommend transparent PNG files (300 DPI) for the best print quality.</p>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png, image/jpeg"
                    className="hidden"
                  />
                  <Button 
                    variant="outline"
                    className="rounded-none border-gray-300 hover:bg-gray-100 px-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select File
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Design Description</label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the image you want to create..."
                      className="min-h-[120px] resize-none rounded-sm border-gray-300 focus-visible:ring-black"
                    />
                    <div className="flex flex-wrap gap-2 pt-2">
                      {promptSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setPrompt(suggestion)}
                          className="text-[11px] font-medium px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-sm transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Artistic Style</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {styles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`text-sm py-3 px-4 rounded-sm border text-left transition-all ${
                            selectedStyle === style.id 
                              ? 'border-black bg-black text-white' 
                              : 'border-gray-200 text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateDesign}
                    disabled={!prompt || !selectedStyle || isGenerating}
                    className="w-full sm:w-auto h-12 px-8 rounded-none bg-black hover:bg-gray-800 text-white"
                  >
                    {isGenerating ? (
                      <><Loader2 className="mr-2 animate-spin" size={18} /> Processing...</>
                    ) : (
                      <>Generate Image <ChevronRight className="ml-2" size={18} /></>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default function DesignPage() {
  return <DesignSelection />
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { TshirtColor } from '@/types'
import { Wand2, Loader2, Lightbulb, Image as ImageIcon, Palette, Sparkles, Check, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { NavigationHeader } from '@/components/navigation-header'
import { Separator } from '@/components/ui/separator'

function DesignSelection() {
  const router = useRouter()
  const { state, dispatch } = useApp()
  
  // NEW: State for Tabs and File Upload
  const [activeMode, setActiveMode] = useState<'upload' | 'ai'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // AI Generator State
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedColor, setSelectedColor] = useState<TshirtColor>('white')
  const [isGenerating, setIsGenerating] = useState(false)

  const colors: { id: TshirtColor; name: string; bgClass: string; textClass: string; popular?: boolean }[] = [
    { id: 'white', name: 'White', bgClass: 'bg-white', textClass: 'text-gray-900', popular: true },
    { id: 'black', name: 'Black', bgClass: 'bg-black', textClass: 'text-white', popular: true },
    { id: 'navy', name: 'Navy', bgClass: 'bg-blue-900', textClass: 'text-white' },
    { id: 'gray', name: 'Gray', bgClass: 'bg-gray-500', textClass: 'text-white', popular: true },
    { id: 'red', name: 'Red', bgClass: 'bg-red-500', textClass: 'text-white' },
    { id: 'blue', name: 'Blue', bgClass: 'bg-blue-500', textClass: 'text-white' },
    { id: 'green', name: 'Green', bgClass: 'bg-green-500', textClass: 'text-white' },
    { id: 'purple', name: 'Purple', bgClass: 'bg-purple-500', textClass: 'text-white' },
    { id: 'yellow', name: 'Yellow', bgClass: 'bg-yellow-400', textClass: 'text-gray-900' },
    { id: 'orange', name: 'Orange', bgClass: 'bg-orange-500', textClass: 'text-white' },
    { id: 'pink', name: 'Pink', bgClass: 'bg-pink-500', textClass: 'text-white' },
    { id: 'brown', name: 'Brown', bgClass: 'bg-amber-800', textClass: 'text-white' },
    { id: 'maroon', name: 'Maroon', bgClass: 'bg-red-800', textClass: 'text-white' },
    { id: 'forest', name: 'Forest', bgClass: 'bg-green-800', textClass: 'text-white' },
    { id: 'teal', name: 'Teal', bgClass: 'bg-teal-500', textClass: 'text-white' },
  ]

  const styles = [
    { id: 'cartoon', label: 'Cartoon', description: 'Fun and playful cartoon style', emoji: '🎭', color: 'from-yellow-400 to-orange-500', popular: true },
    { id: 'realistic', label: 'Realistic', description: 'Photorealistic detailed art', emoji: '📸', color: 'from-gray-500 to-slate-600', popular: false },
    { id: 'abstract', label: 'Abstract', description: 'Modern abstract art style', emoji: '🎨', color: 'from-purple-500 to-pink-500', popular: false },
    { id: 'vintage', label: 'Vintage', description: 'Retro and classic designs', emoji: '📻', color: 'from-amber-600 to-orange-700', popular: true },
    { id: 'minimalist', label: 'Minimalist', description: 'Clean and simple designs', emoji: '⚪', color: 'from-slate-400 to-gray-500', popular: false },
    { id: 'graffiti', label: 'Graffiti', description: 'Street art inspired designs', emoji: '🏙️', color: 'from-red-500 to-pink-600', popular: true },
    { id: 'anime', label: 'Anime', description: 'Japanese anime art style', emoji: '🐈‍⬛', color: 'from-blue-400 to-cyan-500', popular: true },
    { id: 'watercolor', label: 'Watercolor', description: 'Soft watercolor painting style', emoji: '🌊', color: 'from-blue-300 to-purple-400', popular: false },
    { id: 'pixel', label: 'Pixel Art', description: '8-bit retro pixel art style', emoji: '🗺️', color: 'from-green-400 to-blue-500', popular: false },
    { id: 'neon', label: 'Neon', description: 'Glowing neon cyberpunk style', emoji: '🌆', color: 'from-pink-400 to-purple-600', popular: true },
    { id: 'sketch', label: 'Sketch', description: 'Hand-drawn pencil sketch style', emoji: '✏️', color: 'from-gray-400 to-gray-600', popular: false },
    { id: 'pop', label: 'Pop Art', description: 'Bold pop art comic style', emoji: '💥', color: 'from-red-400 to-yellow-500', popular: true },
  ]

  const promptSuggestions = [
    "A majestic dragon breathing colorful flames",
    "Cute cartoon cats playing with yarn balls",
    "Abstract geometric patterns in vibrant colors",
    "Vintage bicycle with flowers in the basket",
    "Minimalist mountain landscape silhouette",
    "Graffiti-style text with your favorite quote",
  ]

  // NEW: Handle Client File Upload
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

  // EXISTING: Handle AI Generation
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <NavigationHeader 
        title="MBprints Designer"
        subtitle={`Design a custom ${state.productType} for ${state.category}`}
        currentStep={3}
        totalSteps={4}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Color Selection (Moved to top so it works for both Upload and AI) */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>
                  1. Choose Product Color
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
                  {colors.map((color) => (
                    <div key={color.id} className="flex flex-col items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedColor(color.id)}
                        className={`aspect-square p-0 w-full ${color.bgClass} border-4 ${
                          selectedColor === color.id ? 'border-primary scale-110 shadow-lg' : 'border-border'
                        } transition-all flex items-center justify-center`}
                      >
                        {selectedColor === color.id && <Check size={16} className={color.id === 'white' ? 'text-black' : 'text-white'} />}
                      </Button>
                      <p className="text-xs font-medium truncate w-full text-center">{color.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mode Selection Tabs */}
            <div className="flex bg-white rounded-lg p-1 border shadow-sm">
              <Button 
                variant={activeMode === 'upload' ? 'default' : 'ghost'} 
                className="flex-1 text-base h-12"
                onClick={() => setActiveMode('upload')}
              >
                <Upload className="mr-2" size={18} />
                Upload Your Art
              </Button>
              <Button 
                variant={activeMode === 'ai' ? 'default' : 'ghost'} 
                className="flex-1 text-base h-12"
                onClick={() => setActiveMode('ai')}
              >
                <Sparkles className="mr-2" size={18} />
                Use AI Generator
              </Button>
            </div>

            {/* --- UPLOAD MODE --- */}
            {activeMode === 'upload' && (
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                <CardContent className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="p-4 bg-white rounded-full shadow-sm">
                    <Upload size={40} className="text-gray-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">Upload your design</h3>
                    <p className="text-gray-500 mt-1">PNG or JPG files are best</p>
                  </div>
                  
                  {/* Hidden file input */}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png, image/jpeg"
                    className="hidden"
                  />
                  
                  <Button 
                    size="lg" 
                    className="mt-4 px-8 text-lg"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* --- AI GENERATOR MODE --- */}
            {activeMode === 'ai' && (
              <>
                {/* Prompt Section */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Describe Your Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your design in detail (e.g., 'A happy shiba inu wearing sunglasses')..."
                      className="h-32 resize-none text-base"
                    />
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Need inspiration? Try these:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {promptSuggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            onClick={() => setPrompt(suggestion)}
                            className="h-auto p-3 text-left text-xs border border-dashed hover:border-solid hover:bg-accent/50 cursor-pointer"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Style Selection */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-purple-500" />
                      Choose Art Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {styles.map((style) => (
                        <div key={style.id} className="relative">
                          <Button
                            variant={selectedStyle === style.id ? "default" : "outline"}
                            onClick={() => setSelectedStyle(style.id)}
                            className={`w-full h-auto p-4 flex-col space-y-3 ${selectedStyle === style.id ? 'ring-2 ring-primary/20' : ''}`}
                          >
                            <div className={`text-2xl p-3 rounded-lg bg-gradient-to-br ${style.color} text-white`}>
                              {style.emoji}
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-sm">{style.label}</div>
                            </div>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateDesign}
                  disabled={!prompt || !selectedStyle || isGenerating}
                  size="lg"
                  className="w-full text-lg h-16 bg-primary hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <><Loader2 className="mr-3 animate-spin" size={24} /> Creating your MBprints design...</>
                  ) : (
                    <><Wand2 className="mr-3" size={24} /> Generate AI Design</>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Right Column - Preview Area */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-green-500" /> Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square bg-muted rounded-xl flex items-center justify-center border-2 border-dashed">
                  {activeMode === 'upload' ? (
                    <div className="text-center p-6 text-muted-foreground">
                      <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">Upload your art to see it on the shirt</p>
                    </div>
                  ) : prompt && selectedStyle ? (
                    <div className="text-center p-6">
                      <div className="text-5xl mb-4">{styles.find(s => s.id === selectedStyle)?.emoji}</div>
                      <p className="text-sm font-medium">Ready to generate your {selectedStyle} art</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Select style and describe design to preview</p>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500" /> Design Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Use high-quality PNGs with transparent backgrounds for best results</li>
                    <li>• Keep your design simple for better printing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DesignPage() {
  return <DesignSelection />
}

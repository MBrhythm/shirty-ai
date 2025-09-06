'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { TshirtColor } from '@/types'
import { Wand2, Loader2, Lightbulb, Image, Palette, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { NavigationHeader } from '@/components/navigation-header'
import { Separator } from '@/components/ui/separator'

function DesignSelection() {
  const router = useRouter()
  const { state, dispatch } = useApp()
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedColor, setSelectedColor] = useState<TshirtColor>('white')
  const [apiKey, setApiKey] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  // Save API key to localStorage when it changes
  const handleApiKeyChange = (value: string) => {
    setApiKey(value)
    if (value.trim()) {
      localStorage.setItem('gemini-api-key', value.trim())
    } else {
      localStorage.removeItem('gemini-api-key')
    }
  }

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
    { 
      id: 'cartoon', 
      label: 'Cartoon', 
      description: 'Fun and playful cartoon style',
      emoji: '🎭',
      color: 'from-yellow-400 to-orange-500',
      popular: true
    },
    { 
      id: 'realistic', 
      label: 'Realistic', 
      description: 'Photorealistic detailed art',
      emoji: '📸',
      color: 'from-gray-500 to-slate-600',
      popular: false
    },
    { 
      id: 'abstract', 
      label: 'Abstract', 
      description: 'Modern abstract art style',
      emoji: '🎨',
      color: 'from-purple-500 to-pink-500',
      popular: false
    },
    { 
      id: 'vintage', 
      label: 'Vintage', 
      description: 'Retro and classic designs',
      emoji: '📻',
      color: 'from-amber-600 to-orange-700',
      popular: true
    },
    { 
      id: 'minimalist', 
      label: 'Minimalist', 
      description: 'Clean and simple designs',
      emoji: '⚪',
      color: 'from-slate-400 to-gray-500',
      popular: false
    },
    { 
      id: 'graffiti', 
      label: 'Graffiti', 
      description: 'Street art inspired designs',
      emoji: '🏙️',
      color: 'from-red-500 to-pink-600',
      popular: true
    },
    { 
      id: 'anime', 
      label: 'Anime', 
      description: 'Japanese anime art style',
      emoji: '🐈‍⬛',
      color: 'from-blue-400 to-cyan-500',
      popular: true
    },
    { 
      id: 'watercolor', 
      label: 'Watercolor', 
      description: 'Soft watercolor painting style',
      emoji: '🌊',
      color: 'from-blue-300 to-purple-400',
      popular: false
    },
    { 
      id: 'pixel', 
      label: 'Pixel Art', 
      description: '8-bit retro pixel art style',
      emoji: '🗺️',
      color: 'from-green-400 to-blue-500',
      popular: false
    },
    { 
      id: 'neon', 
      label: 'Neon', 
      description: 'Glowing neon cyberpunk style',
      emoji: '🌆',
      color: 'from-pink-400 to-purple-600',
      popular: true
    },
    { 
      id: 'sketch', 
      label: 'Sketch', 
      description: 'Hand-drawn pencil sketch style',
      emoji: '✏️',
      color: 'from-gray-400 to-gray-600',
      popular: false
    },
    { 
      id: 'pop', 
      label: 'Pop Art', 
      description: 'Bold pop art comic style',
      emoji: '💥',
      color: 'from-red-400 to-yellow-500',
      popular: true
    },
  ]

  const promptSuggestions = [
    "A majestic dragon breathing colorful flames",
    "Cute cartoon cats playing with yarn balls",
    "Abstract geometric patterns in vibrant colors",
    "Vintage bicycle with flowers in the basket",
    "Minimalist mountain landscape silhouette",
    "Graffiti-style text with your favorite quote",
    "Anime character with glowing eyes",
    "Watercolor sunset over ocean waves",
    "Pixel art spaceship in retro style",
    "Neon cityscape with purple lights",
    "Hand-drawn sketch of a wise owl",
    "Pop art style superhero logo"
  ]

  const handleGenerateDesign = async () => {
    if (!prompt || !selectedStyle) return

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          color: selectedColor,
          apiKey: apiKey,
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

        // Show message if available (e.g., using placeholder vs AI generation)
        if (result.message) {
          console.log('Generation info:', result.message)
        }

        dispatch({ type: 'SET_DESIGN_WITH_COLOR', payload: { design, color: selectedColor } })
        router.push('/preview')
      } else {
        console.error('Failed to generate image:', result.error)
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

  if (!state.category || !state.productType) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <NavigationHeader 
        title="Create Your Design"
        subtitle={`Design a custom ${state.productType === 'tshirt' ? 't-shirt' : state.productType === 'hoodie' ? 'hoodie' : 'sweatshirt'} for ${state.category}`}
        currentStep={3}
        totalSteps={4}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Design Tools */}
          <div className="lg:col-span-2 space-y-6">
            {/* API Key Section */}
            <Card className="border-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Google Gemini AI Key
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="Enter your Google Gemini API key for real AI generation..."
                    className="text-base"
                  />
                  
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-400">
                    <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-blue-800 dark:text-blue-200">
                        Need an API Key? Get one for free!
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        1. Visit{' '}
                        <a 
                          href="https://aistudio.google.com/app/apikey" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="underline font-medium hover:text-blue-900 dark:hover:text-blue-100"
                        >
                          Google AI Studio
                        </a>
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        2. Click "Create API Key" → Copy the key
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        3. Paste it above for real AI image generation!
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        💡 Without API key: Uses placeholder images for demo
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        🔒 Your API key is saved locally and never shared
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  placeholder="Describe your design in detail... The more specific you are, the better the AI can create your vision!"
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

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lightbulb className="w-3 h-3" />
                  <span>Pro tip: Include colors, emotions, and specific details for best results</span>
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
                        className={`w-full h-auto p-4 flex-col space-y-3 relative overflow-hidden ${
                          selectedStyle === style.id ? 'ring-2 ring-primary/20' : ''
                        }`}
                      >
                        {style.popular && (
                          <Badge 
                            variant="secondary" 
                            className="absolute top-2 right-2 text-xs px-2 py-0"
                          >
                            Popular
                          </Badge>
                        )}
                        
                        <div className={`text-2xl p-3 rounded-lg bg-gradient-to-br ${style.color} text-white`}>
                          {style.emoji}
                        </div>
                        <div className="text-center">
                          <div className="font-poppins font-semibold text-sm">{style.label}</div>
                          <div className="text-xs opacity-70 mt-1">{style.description}</div>
                        </div>
                      </Button>
                    </div>
                  ))}
                </div>

                {selectedStyle && (
                  <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Selected:</span>
                      <Badge variant="secondary">
                        {styles.find(s => s.id === selectedStyle)?.label}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Color Selection */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>
                  Choose Product Color
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Select the base color for your {state.productType}</span>
                    <Badge variant="outline">{colors.length} colors available</Badge>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-3">
                    {colors.map((color) => (
                      <div key={color.id} className="relative">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedColor(color.id)}
                          className={`aspect-square p-0 ${color.bgClass} border-4 ${
                            selectedColor === color.id
                              ? 'border-primary scale-110 shadow-lg'
                              : 'border-border hover:border-muted-foreground hover:scale-105'
                          } transition-all flex items-center justify-center relative overflow-hidden`}
                        >
                          {selectedColor === color.id && (
                            <Check 
                              size={16} 
                              className={color.id === 'white' ? 'text-foreground drop-shadow-lg' : 'text-background drop-shadow-lg'} 
                            />
                          )}
                          {color.popular && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                          )}
                        </Button>
                        <p className="text-xs text-center mt-2 font-medium">{color.name}</p>
                      </div>
                    ))}
                  </div>

                  {selectedColor && (
                    <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Selected color:</span>
                        <Badge variant="secondary" className="capitalize">
                          {colors.find(c => c.id === selectedColor)?.name}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <Button
                  onClick={handleGenerateDesign}
                  disabled={!prompt || !selectedStyle || isGenerating}
                  size="lg"
                  className="w-full text-lg h-14"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-3 animate-spin" size={24} />
                      Creating your design...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-3" size={24} />
                      Generate AI Design
                    </>
                  )}
                </Button>
                
                {(!prompt || !selectedStyle) && (
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    {!prompt ? 'Please describe your design' : 'Please select an art style'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-green-500" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Product Info */}
                  <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                    <div className="text-sm">
                      <div className="font-medium capitalize">{state.productType}</div>
                      <div className="text-muted-foreground capitalize">{state.category}</div>
                    </div>
                    <div className="text-2xl">
                      {state.productType === 'tshirt' ? '👕' : state.productType === 'hoodie' ? '🧥' : '🥻'}
                    </div>
                  </div>

                  {/* Preview Area */}
                  <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted rounded-xl flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                    {prompt && selectedStyle ? (
                      <div className="text-center p-6 space-y-4">
                        <div className="text-5xl">
                          {styles.find(s => s.id === selectedStyle)?.emoji || '🎨'}
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">
                            Your {selectedStyle} design
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 italic line-clamp-3">
                            "{prompt}"
                          </p>
                        </div>
                        <Badge variant="outline" className="animate-pulse">
                          Ready to generate
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-center p-6 space-y-4">
                        <div className="text-4xl opacity-50">✨</div>
                        <div>
                          <p className="text-muted-foreground">
                            Your design preview
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            Fill in the details to see your creation
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Tips */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      Design Tips
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Be specific about colors and details</li>
                      <li>• Mention the mood or feeling you want</li>
                      <li>• Include objects, characters, or text</li>
                      <li>• Consider the target audience</li>
                    </ul>
                  </div>
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
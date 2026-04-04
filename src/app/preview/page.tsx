'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Send, CheckCircle2, RefreshCw, Palette, User, Mail, Hash, Move, Maximize, Zap, Award, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

function PreviewPage() {
  const router = useRouter()
  const { state, dispatch } = useApp()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)
  
  // Lead Capture State
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [quantity, setQuantity] = useState('1')

  // Canvas State (Position & Scale)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(100) 

  const getColorData = () => {
    const colors = [
      { id: 'white', name: 'White', hex: '#FFFFFF' },
      { id: 'black', name: 'Black', hex: '#333333' }, // Softened black for fabric texture
      { id: 'navy', name: 'Navy', hex: '#1E293B' },
      { id: 'gray', name: 'Gray', hex: '#9CA3AF' },
      { id: 'red', name: 'Red', hex: '#EF4444' },
      { id: 'blue', name: 'Blue', hex: '#3B82F6' },
      { id: 'green', name: 'Green', hex: '#10B981' },
    ]
    return colors.find(c => c.id === state.color) || colors[0]
  }

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }
  const handleMouseUp = () => setIsDragging(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y })
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    if (e.cancelable) e.preventDefault() 
    setPosition({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y })
  }

  const handleRequestQuote = async () => {
    if (!customerName || !customerEmail) {
      alert("Please enter your name and email so we can send your quote.")
      return
    }
    setIsSubmitting(true)
    
    console.log("New MBprints Quote Request:", {
      customer: customerName,
      email: customerEmail,
      qty: quantity,
      design: state.design?.imageUrl,
      specs: `${state.color} ${state.productType}`,
      canvasData: { position, scale }
    })

    setTimeout(() => {
      setShowSuccessScreen(true)
      setIsSubmitting(false)
    }, 1500)
  }

  const handleNewDesign = () => {
    dispatch({ type: 'RESET' })
    router.push('/')
  }

  useEffect(() => {
    if (!state.category || !state.productType || !state.design || !state.color) {
      router.push('/')
    }
  }, [state.category, state.productType, state.design, state.color, router])

  if (!state.category || !state.productType || !state.design || !state.color) {
    return null
  }

  const selectedColorData = getColorData()

  // Sleek Success Screen
  const SuccessScreen = () => (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-sans">
      <div className="max-w-md mx-auto text-center space-y-8 p-8 bg-white border border-gray-200 shadow-sm rounded-sm">
        <div className="space-y-6">
          <CheckCircle2 className="w-16 h-16 text-black mx-auto" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Request Received</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Thank you, {customerName}. We are reviewing your design specifications and will send a formal quote to <strong>{customerEmail}</strong> shortly.
            </p>
          </div>
          <div className="bg-gray-50 rounded-sm p-6 border text-left space-y-3">
            <h4 className="font-semibold text-xs tracking-wider uppercase text-gray-500">Order Specification</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-900"><span className="text-gray-500">Product:</span> {state.productType}</p>
              <p className="text-sm text-gray-900"><span className="text-gray-500">Color:</span> {selectedColorData?.name}</p>
              <p className="text-sm text-gray-900"><span className="text-gray-500">Volume:</span> {quantity} units</p>
            </div>
          </div>
          <Button onClick={handleNewDesign} size="lg" className="w-full h-12 rounded-none bg-black hover:bg-gray-800 text-white transition-colors">
            Start New Project
          </Button>
        </div>
      </div>
    </div>
  )

  if (showSuccessScreen) return <SuccessScreen />

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 selection:bg-black selection:text-white">
      
      {/* Minimalist Top Nav */}
      <header className="w-full border-b border-gray-200 bg-white relative z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter">MB<span className="text-gray-400">prints</span></div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => router.push('/design')}
                className="text-sm text-gray-500 hover:text-black transition-colors"
             >
                Back
             </button>
             <div className="text-xs font-semibold uppercase tracking-widest text-gray-400">Step 04 / 04</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column - The Canvas Workspace */}
          <div className="lg:col-span-7 space-y-4 relative z-10">
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
              {/* Toolbar */}
              <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Move size={16} className="text-gray-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Position Artwork</span>
                </div>
                
                {/* Scale Slider */}
                <div className="flex items-center gap-3 bg-white px-3 py-2 border border-gray-200 rounded-sm">
                  <Maximize size={14} className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-600 w-16">Size: {scale}%</span>
                  <input 
                    type="range" 
                    min="20" 
                    max="200" 
                    value={scale} 
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>
              </div>

              {/* The Mockup Area */}
              <div className="relative aspect-[4/5] bg-[#F5F5F5] flex items-center justify-center overflow-hidden touch-none"
                   onMouseMove={handleMouseMove}
                   onMouseUp={handleMouseUp}
                   onMouseLeave={handleMouseUp}
                   onTouchMove={handleTouchMove}
                   onTouchEnd={handleMouseUp}
              >
                {/* Background Color Layer (Drives the shirt tint) */}
                <div 
                  className="absolute inset-0 transition-colors duration-300"
                  style={{ backgroundColor: selectedColorData.hex }}
                />

                {/* High-Res Unsplash Shirt Photo with Multiply Blend Mode */}
                <img 
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000" 
                  alt="Realistic Shirt Mockup"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-multiply opacity-90"
                />

                {/* The Draggable Logo Layer */}
                {state.design.imageUrl && (
                  <div 
                    className="absolute cursor-move z-20" 
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px)`,
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                  >
                    <div 
                      className={`relative border transition-colors ${isDragging ? 'border-gray-900 border-dashed bg-white/20' : 'border-transparent hover:border-dashed hover:border-gray-400 hover:bg-white/10'}`}
                      style={{ padding: '8px' }}
                    >
                      <img 
                        src={state.design.imageUrl} 
                        alt="Custom Design"
                        draggable="false" 
                        style={{
                          width: `${(scale / 100) * 180}px`, // Base width
                          height: 'auto',
                        }}
                        className="object-contain drop-shadow-sm pointer-events-none"
                      />
                    </div>
                  </div>
                )}
                
                <Badge className="absolute top-6 left-6 bg-white text-black border-gray-200 shadow-sm rounded-sm font-medium tracking-wide z-30">
                  {state.productType}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Column - Formal Quote Request */}
          <div className="lg:col-span-5 space-y-6 relative z-10">
            <Card className="border border-gray-200 shadow-sm rounded-sm">
              <CardHeader className="bg-white border-b border-gray-100 pb-6">
                <CardTitle className="text-xl font-bold tracking-tight">Request Formal Quote</CardTitle>
                <p className="text-sm text-gray-500 mt-2">Submit your artwork specifications. Our printing team will respond within 24 hours.</p>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 bg-white">
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 flex items-center gap-2">
                      <User size={14} /> Full Name
                    </label>
                    <Input 
                      placeholder="e.g. Taro Yamada" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="rounded-sm border-gray-300 focus-visible:ring-black h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 flex items-center gap-2">
                      <Mail size={14} /> Email Address
                    </label>
                    <Input 
                        type="email" 
                        placeholder="contact@company.com" 
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="rounded-sm border-gray-300 focus-visible:ring-black h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 flex items-center gap-2">
                      <Hash size={14} /> Unit Quantity
                    </label>
                    <Input 
                      type="number" 
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="rounded-sm border-gray-300 focus-visible:ring-black h-11"
                    />
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                <div className="space-y-3">
                  <Button
                    onClick={handleRequestQuote}
                    disabled={isSubmitting || !customerName || !customerEmail}
                    className="w-full h-14 text-base font-medium rounded-none bg-black hover:bg-gray-800 text-white transition-all shadow-md"
                  >
                    {isSubmitting ? (
                      "Processing..."
                    ) : (
                      <><Send className="mr-2" size={18} /> Submit Request</>
                    )}
                  </Button>

                  <div className="flex gap-3">
                    <Button onClick={() => router.push('/design')} variant="outline" className="flex-1 rounded-sm h-11 border-gray-200 hover:bg-gray-50 text-gray-700">
                      <Palette className="mr-2" size={16} /> Edit Art
                    </Button>
                    <Button onClick={handleNewDesign} variant="ghost" className="flex-1 rounded-sm h-11 hover:bg-gray-50 text-gray-600">
                      <RefreshCw className="mr-2" size={16} /> Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Trust Indicators */}
            <div className="grid grid-cols-3 gap-2 pt-2">
               <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-sm">
                 <Zap className="w-5 h-5 text-gray-900 mb-2" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Fast Turnaround</span>
               </div>
               <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-sm">
                 <Award className="w-5 h-5 text-gray-900 mb-2" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Premium Quality</span>
               </div>
               <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-sm">
                 <Globe className="w-5 h-5 text-gray-900 mb-2" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Nationwide</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Preview() {
  return <PreviewPage />
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Send, Check, RefreshCw, Palette, User, Mail, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { NavigationHeader } from '@/components/navigation-header'
import { Separator } from '@/components/ui/separator'
import Confetti from 'react-confetti'

function PreviewPage() {
  const router = useRouter()
  const { state, dispatch } = useApp()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)
  
  // Lead Capture State
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [quantity, setQuantity] = useState('1')

  const getColorData = () => {
    const colors = [
      { id: 'white', name: 'White', hex: '#FFFFFF', textClass: 'text-gray-900' },
      { id: 'black', name: 'Black', hex: '#1A1A1A', textClass: 'text-white' },
      { id: 'navy', name: 'Navy', hex: '#1E293B', textClass: 'text-white' },
      { id: 'gray', name: 'Gray', hex: '#6B7280', textClass: 'text-white' },
      { id: 'red', name: 'Red', hex: '#EF4444', textClass: 'text-white' },
      { id: 'blue', name: 'Blue', hex: '#3B82F6', textClass: 'text-white' },
      { id: 'green', name: 'Green', hex: '#10B981', textClass: 'text-white' },
      { id: 'purple', name: 'Purple', hex: '#8B5CF6', textClass: 'text-white' },
      { id: 'yellow', name: 'Yellow', hex: '#FBBF24', textClass: 'text-gray-900' },
      { id: 'orange', name: 'Orange', hex: '#F97316', textClass: 'text-white' },
      { id: 'pink', name: 'Pink', hex: '#EC4899', textClass: 'text-white' },
      { id: 'brown', name: 'Brown', hex: '#78350F', textClass: 'text-white' },
      { id: 'maroon', name: 'Maroon', hex: '#7F1D1D', textClass: 'text-white' },
      { id: 'forest', name: 'Forest', hex: '#064E3B', textClass: 'text-white' },
      { id: 'teal', name: 'Teal', hex: '#14B8A6', textClass: 'text-white' },
    ]
    return colors.find(c => c.id === state.color) || colors[0]
  }

  const handleRequestQuote = async () => {
    if (!customerName || !customerEmail) {
      alert("Please enter your name and email so we can send your quote!")
      return
    }
    
    setIsSubmitting(true)
    
    console.log("New MBprints Quote Request:", {
      customer: customerName,
      email: customerEmail,
      qty: quantity,
      design: state.design?.imageUrl,
      specs: `${state.color} ${state.productType}`
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

  // Success Screen Component
  const SuccessScreen = () => (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
      
      <div className="max-w-lg mx-auto text-center space-y-8 p-8 relative z-10">
        <div className="space-y-6">
          <div className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">Quote Request Sent!</h1>
            <p className="text-gray-600">
              Thanks, {customerName}! MBprints has received your design. We'll review the details and email a quote to <strong>{customerEmail}</strong> shortly.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border text-left space-y-2">
            <h4 className="font-bold text-sm uppercase text-gray-400">Order Summary</h4>
            <p className="text-sm"><strong>Product:</strong> {state.productType} ({state.category})</p>
            <p className="text-sm"><strong>Color:</strong> {selectedColorData?.name}</p>
            <p className="text-sm"><strong>Quantity:</strong> {quantity} units</p>
          </div>

          <Button onClick={handleNewDesign} size="lg" className="w-full h-14 text-lg bg-black hover:bg-gray-800">
            Create Another Design
          </Button>
        </div>
      </div>
    </div>
  )

  if (showSuccessScreen) return <SuccessScreen />

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader 
        title="Finalize Your MBprints Design"
        subtitle="Review your creation and request a printing quote"
        currentStep={4}
        totalSteps={4}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Product Preview */}
          <div className="space-y-6">
            <Card className="border-2 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative shadow-inner p-8">
                
                {/* 1. The Base Product Image (Colorized via CSS) */}
                <div 
                  className="absolute inset-0 m-8 opacity-90 transition-colors duration-300"
                  style={{
                    backgroundColor: selectedColorData.hex,
                    maskImage: `url('https://cdn-icons-png.flaticon.com/512/863/863684.png')`,
                    WebkitMaskImage: `url('https://cdn-icons-png.flaticon.com/512/863/863684.png')`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                  }}
                />

                {/* 2. The Uploaded Logo/Design Layered on Top */}
                {state.design.imageUrl && (
                  <div className="relative z-10 w-1/3 h-1/3 flex items-center justify-center mt-12">
                    <img 
                      src={state.design.imageUrl} 
                      alt="MBprints Custom Design"
                      className="max-w-full max-h-full object-contain drop-shadow-md"
                    />
                  </div>
                )}
                
                <Badge className="absolute top-4 left-4 bg-white/90 text-black border shadow-sm z-20">
                  {state.productType}
                </Badge>
              </div>
              <CardContent className="p-6 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl capitalize">MBprints Custom {state.productType}</h3>
                    <p className="text-sm text-gray-500">{selectedColorData?.name} • {state.design.style} Style</p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">High Definition Print</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Lead Capture Form */}
          <div className="space-y-6">
            <Card className="border-2 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Get a Printing Quote</CardTitle>
                <p className="text-sm text-gray-500">Enter your details and we will send you a custom quote for this design.</p>
              </CardHeader>
              <CardContent className="space-y-5">
                
                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <User size={14} /> Full Name
                    </label>
                    <Input 
                      placeholder="Your Name" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <Mail size={14} /> Email Address
                    </label>
                    <Input 
                      type="email" 
                      placeholder="name@email.com" 
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <Hash size={14} /> Quantity Needed
                    </label>
                    <Input 
                      type="number" 
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Submit Button */}
                <Button
                  onClick={handleRequestQuote}
                  disabled={isSubmitting || !customerName || !customerEmail}
                  size="lg"
                  className="w-full h-16 text-xl bg-black hover:bg-gray-800 text-white shadow-xl transform transition hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    "Sending to MBprints..."
                  ) : (
                    <><Send className="mr-3" size={20} /> Submit Quote Request</>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => router.push('/design')} variant="outline" className="h-12">
                    <Palette className="mr-2" size={16} /> Edit Design
                  </Button>
                  <Button onClick={handleNewDesign} variant="ghost" className="h-12">
                    <RefreshCw className="mr-2" size={16} /> Start Over
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* MBprints Trust Info */}
            <div className="grid grid-cols-3 gap-4">
               <div className

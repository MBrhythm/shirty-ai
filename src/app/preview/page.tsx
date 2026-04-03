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
      { id: 'white', name: 'White', bgClass: 'bg-white', textClass: 'text-gray-900' },
      { id: 'black', name: 'Black', bgClass: 'bg-black', textClass: 'text-white' },
      { id: 'navy', name: 'Navy', bgClass: 'bg-blue-900', textClass: 'text-white' },
      { id: 'gray', name: 'Gray', bgClass: 'bg-gray-500', textClass: 'text-white' },
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
    return colors.find(c => c.id === state.color) || colors[0]
  }

  const handleRequestQuote = async () => {
    if (!customerName || !customerEmail) {
      alert("Please enter your name and email so we can send your quote!")
      return
    }
    
    setIsSubmitting(true)
    
    // Logic: Here we would typically send an email via an API route.
    // For now, we simulate the business process.
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
              <div 
                className={`aspect-square ${selectedColorData?.bgClass} flex items-center justify-center relative shadow-inner`}
              >
                {state.design.imageUrl && (
                  <img 
                    src={state.design.imageUrl} 
                    alt="MBprints Custom Design"
                    className="w-4/5 h-4/5 object-contain drop-shadow-2xl"
                  />
                )}
                <Badge className="absolute top-4 left-4 bg-white/90 text-black border shadow-sm">
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
               <div className="text-center p-3">
                 <div className="text-xl mb-1">⚡</div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase">Fast Quote</div>
               </div>
               <div className="text-center p-3">
                 <div className="text-xl mb-1">💎</div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase">Premium Print</div>
               </div>
               <div className="text-center p-3">
                 <div className="text-xl mb-1">📦</div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase">Worldwide</div>
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

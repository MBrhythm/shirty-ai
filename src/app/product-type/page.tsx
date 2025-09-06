'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { ProductType } from '@/types'
import { Star, Truck, Shield, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NavigationHeader } from '@/components/navigation-header'

function ProductTypeSelection() {
  const router = useRouter()
  const { state, dispatch } = useApp()

  const productTypes = [
    {
      id: 'tshirt' as ProductType,
      label: 'Classic T-Shirt',
      description: 'Premium cotton blend, perfect for everyday wear',
      image: '👕',
      features: ['100% Cotton', 'Machine Washable', 'Pre-shrunk'],
      popular: true,
      rating: 4.8,
      reviews: 1247,
      colors: ['White', 'Black', 'Navy', 'Gray']
    },
    {
      id: 'hoodie' as ProductType,
      label: 'Premium Hoodie',
      description: 'Cozy pullover with front pocket and soft interior',
      image: '🧥',
      features: ['Fleece Lined', 'Drawstring Hood', 'Kangaroo Pocket'],
      popular: false,
      rating: 4.9,
      reviews: 892,
      colors: ['Black', 'Gray', 'Navy', 'Burgundy']
    },
    {
      id: 'sweatshirt' as ProductType,
      label: 'Cozy Sweatshirt',
      description: 'Comfortable crew neck sweatshirt for casual wear',
      image: '🥼',
      features: ['Soft Cotton Blend', 'Ribbed Cuffs', 'Classic Fit'],
      popular: false,
      rating: 4.7,
      reviews: 634,
      colors: ['White', 'Gray', 'Black', 'Navy']
    }
  ]

  const benefits = [
    { icon: Star, text: 'Premium Quality Materials', color: 'text-yellow-500' },
    { icon: Truck, text: 'Free Shipping Worldwide', color: 'text-blue-500' },
    { icon: Shield, text: '30-Day Money Back Guarantee', color: 'text-green-500' }
  ]

  const handleProductTypeSelect = (productType: ProductType) => {
    dispatch({ type: 'SET_PRODUCT_TYPE', payload: productType })
    router.push('/design')
  }

  useEffect(() => {
    if (!state.category) {
      router.push('/')
    }
  }, [state.category, router])

  if (!state.category) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <NavigationHeader 
        title="Choose Your Product"
        subtitle={`Perfect ${state.category}'s apparel for your custom design`}
        currentStep={2}
        totalSteps={4}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Benefits Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card border">
              <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
              <span className="text-sm font-medium text-foreground">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {productTypes.map((product, index) => (
            <Card 
              key={product.id}
              className={`group cursor-pointer border-2 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden ${
                product.popular ? 'ring-2 ring-primary/20' : ''
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {product.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-primary text-primary-foreground">
                    <Heart className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardContent className="p-8 cursor-pointer" onClick={() => handleProductTypeSelect(product.id)}>
                <div className="space-y-6">
                  {/* Product Image & Basic Info */}
                  <div className="text-center space-y-4">
                    <div className="text-6xl mx-auto w-fit p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/20 group-hover:scale-110 transition-transform duration-300">
                      {product.image}
                    </div>
                    <div>
                      <h3 className="font-poppins font-bold text-foreground group-hover:text-primary transition-colors">
                        {product.label}
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Rating & Reviews */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Available Colors */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Available in:</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.colors.join(', ')} + more colors
                    </p>
                  </div>


                  {/* CTA Button */}
                  <Button 
                    className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 cursor-pointer"
                    size="lg"
                  >
                    Select {product.label}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-16 space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              🌟 4.9/5 Customer Rating
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              🚚 Free Shipping on All Orders
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              🔄 Easy Returns & Exchanges
            </Badge>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default function ProductTypePage() {
  return <ProductTypeSelection />
}
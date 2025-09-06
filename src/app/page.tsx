'use client'

import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Category } from '@/types'
import { Sparkles, Palette, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

function CategorySelection() {
  const router = useRouter()
  const { dispatch } = useApp()

  const categories = [
    { 
      id: 'male' as Category, 
      label: 'Men', 
      emoji: '🧑‍💼', 
      description: 'Stylish designs for modern men',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/20'
    },
    { 
      id: 'female' as Category, 
      label: 'Women', 
      emoji: '👩‍💼', 
      description: 'Elegant designs for women',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'hover:bg-pink-50 dark:hover:bg-pink-950/20'
    },
    { 
      id: 'kid' as Category, 
      label: 'Kids', 
      emoji: '🧒', 
      description: 'Fun designs for little ones',
      color: 'from-green-500 to-green-600',
      bgColor: 'hover:bg-green-50 dark:hover:bg-green-950/20'
    },
  ]

  const features = [
    { icon: Sparkles, text: 'AI-Powered Design Generation' },
    { icon: Palette, text: 'Multiple Art Styles' },
    { icon: Zap, text: 'Instant Customization' }
  ]

  const handleCategorySelect = (category: Category) => {
    dispatch({ type: 'SET_CATEGORY', payload: category })
    router.push('/product-type')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center pt-16 pb-8 px-4">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Logo & Title */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <Palette className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h1 className="heading-hero heading-brand">
                  Shirty AI
                </h1>
                <p className="text-sm text-muted-foreground font-medium">Dream It, Wear It! ✨</p>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Turn your wildest ideas into stunning wearable art with the magic of AI
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4">
            {features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
                <feature.icon className="w-4 h-4 mr-2" />
                {feature.text}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Separator className="max-w-4xl mx-auto" />

      {/* Category Selection */}
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12 space-y-4">
            <h2 className="heading-gradient">
              Choose Your Style
            </h2>
            <p className="text-lg text-muted-foreground">
              Select who you're designing for to get personalized recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              return (
                <Card 
                  key={category.id} 
                  className={`group cursor-pointer border-2 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 ${category.bgColor}`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <CardContent className="p-8">
                    <div
                      onClick={() => handleCategorySelect(category.id)}
                      className="flex flex-col items-center space-y-6 text-center cursor-pointer"
                    >
                      {/* Emoji */}
                      <div className={`p-6 rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 text-4xl flex items-center justify-center`}>
                        {category.emoji}
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="font-poppins font-bold text-foreground group-hover:text-primary transition-colors">
                          {category.label}
                        </h3>
                        <p className="text-muted-foreground">
                          {category.description}
                        </p>
                      </div>

                      {/* CTA */}
                      <Button 
                        className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 cursor-pointer"
                        variant="outline"
                        size="lg"
                      >
                        Start Designing
                        <Sparkles className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 space-y-4">
            <p className="text-muted-foreground">
              Join thousands of creators making unique designs
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline">🎨 50+ Art Styles</Badge>
              <Badge variant="outline">⚡ Instant Generation</Badge>
              <Badge variant="outline">👕 Premium Quality</Badge>
            </div>
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

export default function Home() {
  return <CategorySelection />
}

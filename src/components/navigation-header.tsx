'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingCart, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'

interface NavigationHeaderProps {
  title: string
  subtitle?: string
  currentStep: number
  totalSteps: number
  showBackButton?: boolean
  showCart?: boolean
}

export function NavigationHeader({ 
  title, 
  subtitle, 
  currentStep, 
  totalSteps, 
  showBackButton = true,
  showCart = false 
}: NavigationHeaderProps) {
  const router = useRouter()
  const { state } = useApp()
  
  const progress = (currentStep / totalSteps) * 100

  const steps = [
    { label: 'Category', icon: '👥' },
    { label: 'Product', icon: '👕' },
    { label: 'Design', icon: '🎨' },
    { label: 'Preview', icon: '👀' }
  ]

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Main Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-accent"
              >
                <ArrowLeft size={20} />
              </Button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-poppins font-bold text-foreground">Shirty AI</h1>
                <p className="text-xs text-muted-foreground font-medium">Dream It, Wear It! ✨</p>
              </div>
            </div>
          </div>

          {showCart && (
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart size={16} className="mr-2" />
              Cart
              {state.cart.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {state.cart.length}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {/* Page Title */}
        <div className="mb-4">
          <h2 className="font-poppins font-bold text-foreground mb-1">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
            <p className="text-sm font-medium text-primary">
              {Math.round(progress)}% Complete
            </p>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div 
                key={step.label}
                className={`flex flex-col items-center gap-1 ${
                  index + 1 <= currentStep 
                    ? 'text-primary' 
                    : index + 1 === currentStep + 1 
                      ? 'text-muted-foreground' 
                      : 'text-muted-foreground/50'
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${
                    index + 1 <= currentStep
                      ? 'bg-primary border-primary text-primary-foreground'
                      : index + 1 === currentStep + 1
                        ? 'border-primary bg-primary/10'
                        : 'border-muted bg-muted'
                  }`}
                >
                  {index + 1 <= currentStep ? '✓' : step.icon}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import * as fs from 'node:fs'
import * as path from 'node:path'
import mime from 'mime'

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, color, apiKey: userApiKey, productType, category } = await request.json()

    if (!prompt || !style) {
      return NextResponse.json(
        { success: false, error: 'Prompt and style are required' },
        { status: 400 }
      )
    }

    // Check if we have the API key (prioritize user-provided key, then environment)
    const apiKey = userApiKey || process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.warn('Google Gemini API key not found, using placeholder image')
      // Fallback to placeholder for demo
      const imageId = Math.floor(Math.random() * 1000) + 1
      const imageUrl = `https://picsum.photos/400/400?random=${imageId}&blur=0`
      
      return NextResponse.json({
        success: true,
        imageUrl,
        prompt: `${style} style: ${prompt}${color ? ` on ${color} t-shirt` : ''}`,
        style,
        message: userApiKey ? 'Invalid API key provided - Using placeholder image' : 'Using placeholder image - Add your Google Gemini API key for real AI generation'
      })
    }

    try {
      // Initialize Google GenAI
      const ai = new GoogleGenAI({
        apiKey: apiKey
      })

      // Enhanced style prompts for better AI generation
      const productName = productType === 'tshirt' ? 't-shirt' : productType === 'hoodie' ? 'hoodie' : 'sweatshirt'
      const genderInfo = category === 'male' ? 'for men' : category === 'female' ? 'for women' : 'for kids'
      const colorInfo = color ? ` The ${productName} base color is ${color}, so design accordingly for good contrast and visibility.` : ''
      
      const stylePrompts = {
        cartoon: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use fun, playful cartoon art with bright vibrant colors, simple shapes, and a cheerful aesthetic suitable for ${productName} printing. Consider the target audience: ${category}.${colorInfo}`,
        realistic: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use photorealistic, highly detailed art with professional quality, sharp details, and realistic textures suitable for ${productName} printing. Consider the target audience: ${category}.${colorInfo}`,
        abstract: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use modern abstract art with geometric shapes, flowing forms, and contemporary design elements suitable for ${productName} printing. Consider the target audience: ${category}.${colorInfo}`,
        vintage: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use retro vintage aesthetic with classic colors, nostalgic elements, and timeless design suitable for ${productName} printing. Consider the target audience: ${category}.${colorInfo}`,
        minimalist: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use clean minimalist design with simple lines, negative space, and elegant simplicity suitable for ${productName} printing. Consider the target audience: ${category}.${colorInfo}`,
        graffiti: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use street art graffiti style with bold colors, urban aesthetic, and dynamic lettering suitable for ${productName} printing. Consider the target audience: ${category}.${colorInfo}`,
        anime: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use Japanese anime art style with expressive characters, dynamic poses, and vibrant anime aesthetics suitable for ${productName} printing. Consider the target audience: ${category}.${colorInfo}`,
        watercolor: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use soft watercolor painting technique with flowing colors, artistic brushstrokes, and gentle gradients suitable for ${productName} printing. Consider the target audience: ${category}.${colorInfo}`,
        pixel: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use 8-bit pixel art style with retro gaming aesthetics, blocky graphics, and nostalgic digital art suitable for ${productName} printing. Consider the target audience: ${category}.${colorInfo}`,
        neon: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use glowing neon cyberpunk style with bright electric colors, futuristic elements, and luminous effects suitable for ${productName} printing. Consider the target audience: ${category}.${colorInfo}`,
        sketch: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use hand-drawn pencil sketch style with artistic line work, sketchy textures, and artistic illustration suitable for ${productName} printing. Consider the target audience: ${category}.${colorInfo}`,
        pop: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use bold pop art style with bright colors, comic book aesthetics, and graphic design elements suitable for ${productName} printing. Consider the target audience: ${category}.${colorInfo}`
      }

      const enhancedPrompt = stylePrompts[style as keyof typeof stylePrompts] || `Create a t-shirt design: ${prompt} in ${style} style, suitable for apparel printing with good contrast and clear details.${colorInfo}`

      console.log('Generating image with Google Gemini AI...')

      // Set up the configuration
      const config = {
        responseModalities: ['IMAGE', 'TEXT']
      }

      const model = 'gemini-2.0-flash-preview-image-generation'
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: enhancedPrompt
            }
          ]
        }
      ]

      // Generate the image using streaming
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents
      })

      // Process the streaming response
      let savedImageUrl = null
      let fileIndex = 0

      for await (const chunk of response) {
        if (!chunk.candidates || !chunk.candidates[0]?.content?.parts) {
          continue
        }

        for (const part of chunk.candidates[0].content.parts) {
          if (part.inlineData) {
            const inlineData = part.inlineData
            const mimeType = inlineData.mimeType || 'image/png'
            const fileExtension = mime.getExtension(mimeType) || 'png'
            const buffer = Buffer.from(inlineData.data || '', 'base64')
            
            // Create public/generated directory if it doesn't exist
            const generatedDir = path.join(process.cwd(), 'public', 'generated')
            if (!fs.existsSync(generatedDir)) {
              fs.mkdirSync(generatedDir, { recursive: true })
            }

            // Save the image with a unique filename
            const filename = `design-${Date.now()}-${fileIndex++}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`
            const filepath = path.join(generatedDir, filename)
            
            fs.writeFileSync(filepath, buffer)
            
            // Set the URL for the first (main) image
            if (!savedImageUrl) {
              savedImageUrl = `/generated/${filename}`
            }
            
            console.log(`Image saved: ${filename}`)
          }
        }
      }

      // Return success if we saved an image
      if (savedImageUrl) {
        return NextResponse.json({
          success: true,
          imageUrl: savedImageUrl,
          prompt: enhancedPrompt,
          style,
          message: 'Image generated successfully with Google Gemini AI'
        })
      }

      // If no image data was found, fallback to placeholder
      throw new Error('No image data found in AI response')

    } catch (aiError) {
      console.error('AI generation failed, using placeholder:', aiError)
      
      // Fallback to placeholder image
      const imageId = Math.floor(Math.random() * 1000) + 1
      const imageUrl = `https://picsum.photos/400/400?random=${imageId}&blur=0`
      
      return NextResponse.json({
        success: true,
        imageUrl,
        prompt: `${style} style: ${prompt}`,
        style,
        message: `AI generation failed, using placeholder. Error: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`
      })
    }

  } catch (error) {
    console.error('Error in image generation endpoint:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    )
  }
}
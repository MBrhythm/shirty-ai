import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

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
      const imageId = Math.floor(Math.random() * 1000) + 1
      const imageUrl = `https://picsum.photos/400/400?random=${imageId}&blur=0`
      
      return NextResponse.json({
        success: true,
        imageUrl,
        prompt: `${style} style: ${prompt}${color ? ` on ${color} t-shirt` : ''}`,
        style,
        message: 'Using placeholder image - Add your Google Gemini API key for real AI generation'
      })
    }

    try {
      // Initialize Google GenAI
      const ai = new GoogleGenAI({
        apiKey: apiKey
      })

      const productName = productType === 'tshirt' ? 't-shirt' : productType === 'hoodie' ? 'hoodie' : 'sweatshirt'
      const genderInfo = category === 'male' ? 'for men' : category === 'female' ? 'for women' : 'for kids'
      const colorInfo = color ? ` The ${productName} base color is ${color}, so design accordingly for good contrast and visibility.` : ''
      
      const stylePrompts = {
        cartoon: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use fun, playful cartoon art with bright vibrant colors, simple shapes, and a cheerful aesthetic. Suitable for apparel printing.${colorInfo}`,
        realistic: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use photorealistic, highly detailed art with professional quality and sharp details. Suitable for apparel printing.${colorInfo}`,
        abstract: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use modern abstract art with geometric shapes and flowing forms.${colorInfo}`,
        vintage: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use retro vintage aesthetic with classic colors.${colorInfo}`,
        minimalist: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use clean minimalist design with simple lines.${colorInfo}`,
        graffiti: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use street art graffiti style with bold colors.${colorInfo}`,
        anime: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use Japanese anime art style.${colorInfo}`,
        watercolor: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use soft watercolor painting technique.${colorInfo}`,
        pixel: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use 8-bit pixel art style.${colorInfo}`,
        neon: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use glowing neon cyberpunk style.${colorInfo}`,
        sketch: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use hand-drawn pencil sketch style.${colorInfo}`,
        pop: `Create a ${style} style ${productName} design ${genderInfo}: ${prompt}. Use bold pop art style with comic book aesthetics.${colorInfo}`
      }

      const enhancedPrompt = stylePrompts[style as keyof typeof stylePrompts] || `Create a t-shirt design: ${prompt} in ${style} style.${colorInfo}`

      console.log('Generating image with Google Gemini AI...')

      const config = {
        responseModalities: ['IMAGE', 'TEXT']
      }

      const model = 'gemini-3.1-flash-image-preview'
      const contents = [{
        role: 'user',
        parts: [{ text: enhancedPrompt }]
      }]

      // Generate the image
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents
      })

      let base64Image = ''
      
      // Process the stream and find the image data
      for await (const chunk of response) {
        if (chunk.candidates?.[0]?.content?.parts) {
          for (const part of chunk.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              base64Image = part.inlineData.data
              break
            }
          }
        }
        if (base64Image) break
      }

      if (base64Image) {
        // Return the Base64 image directly to the browser
        return NextResponse.json({
          success: true,
          imageUrl: `data:image/png;base64,${base64Image}`,
          prompt: enhancedPrompt,
          style,
          message: 'Image generated successfully'
        })
      }

      throw new Error('No image data found in AI response')

    } catch (aiError: any) {
      console.error('AI generation failed:', aiError)
      
      // Fallback for demo
      const imageId = Math.floor(Math.random() * 1000) + 1
      const imageUrl = `https://picsum.photos/400/400?random=${imageId}&blur=0`
      
      return NextResponse.json({
        success: true,
        imageUrl,
        prompt: `${style} style: ${prompt}`,
        style,
        message: `Generation error: ${aiError.message || 'Check billing/quota'}`
      })
    }

  } catch (error: any) {
    console.error('Error in endpoint:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

# Shirty AI 🎨

**Turn your wildest ideas into stunning wearable art with the magic of AI**

Shirty AI is a modern web application that leverages AI to create custom t-shirt designs, hoodies, and sweatshirts. Simply describe your vision, choose your preferred art style, and let AI bring your creativity to life!

## ✨ Features

### 🎨 AI-Powered Design Generation
- **Multiple Art Styles**: Choose from 12+ artistic styles including Cartoon, Realistic, Abstract, Vintage, Minimalist, Graffiti, Anime, Watercolor, Pixel Art, Neon, Sketch, and Pop Art
- **Smart Prompts**: Enhanced prompts optimized for apparel design with audience-specific considerations

### 👕 Product Customization
- **Product Types**: T-shirts, hoodies, and sweatshirts
- **Target Audiences**: Men, women, and kids designs
- **Color Options**: 16+ base colors for optimal design contrast
- **Live Preview**: Real-time design preview before generation

### 🚀 User Experience
- **Intuitive Workflow**: 4-step design process (Category → Product → Design → Preview)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme detection with manual override
- **Prompt Suggestions**: Built-in inspiration for design ideas

### 🔧 Technical Features
- **Fallback System**: Graceful degradation to placeholder images when API is unavailable
- **Local API Key Storage**: Secure client-side storage (never transmitted)
- **Streaming Generation**: Real-time image generation with progress feedback
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **AI Service**: Google Gemini AI (@google/genai)
- **Image Processing**: Built-in file system operations
- **API**: RESTful endpoints with Next.js API routes

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Turbopack

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- pnpm package manager
- Google Gemini API key (optional for demo mode)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/srikanta30/shirty-ai.git
   cd shirty-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables** (Optional)
   ```bash
   # Create .env.local file
   echo "GEMINI_API_KEY=your_api_key_here" > .env.local
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage Guide

### For Users

1. **Choose Your Category**
   - Select whether you're designing for Men, Women, or Kids
   - Each category optimizes AI prompts for the target audience

2. **Pick Your Product**
   - Choose between T-shirt, Hoodie, or Sweatshirt
   - Different products may have different design considerations

3. **Design Your Creation**
   - **Get API Key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to get your free Gemini API key
   - **Describe Your Vision**: Write a detailed prompt (more specific = better results!)
   - **Choose Art Style**: Select from 12+ artistic styles
   - **Pick Base Color**: Choose the product base color for optimal contrast

4. **Generate & Preview**
   - Click "Generate AI Design" to create your artwork
   - Preview your design on the selected product
   - Download or share your creation

### For Developers

#### Environment Variables

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

## 📁 Project Structure

```
shirty-ai/
├── src/
│   ├── app/
│   │   ├── api/generate-image/     # AI image generation endpoint
│   │   ├── design/                 # Design creation page
│   │   ├── preview/                # Design preview page
│   │   ├── product-type/           # Product selection page
│   │   └── layout.tsx              # Root layout
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   └── navigation-header.tsx   # Navigation component
│   ├── context/                    # React Context for state management
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Utility functions
│   └── types/                      # TypeScript type definitions
├── public/
│   ├── generated/                  # AI-generated images storage
│   └── [static assets]             # Static files
└── [config files]                  # Next.js, TypeScript, Tailwind config
```

## 🎨 Design System

### Color Palette
- **Primary**: Gradient from primary to primary/80
- **Accent**: Subtle background gradients
- **Neutral**: Muted colors for text and borders

### Typography
- **Headings**: Poppins font family
- **Body**: System font stack
- **Sizes**: Responsive scaling from mobile to desktop

### Components
- **Cards**: Bordered containers with subtle shadows
- **Buttons**: Variant-based styling with hover effects
- **Forms**: Consistent input styling with validation states

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-enhancement
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing enhancement'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-enhancement
   ```
7. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow the existing TypeScript and React patterns
- **Commits**: Use conventional commit format
- **Testing**: Test on multiple devices and browsers
- **Documentation**: Update README for new features

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini AI**: For providing powerful AI image generation capabilities
- **Radix UI**: For accessible and customizable UI components
- **Tailwind CSS**: For utility-first CSS framework
- **Lucide**: For beautiful and consistent icons

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/srikanta30/shirty-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/srikanta30/shirty-ai/discussions)

---

**Made with ❤️ and AI magic** ✨

*Dream It, Wear It!* 🧙‍♂️

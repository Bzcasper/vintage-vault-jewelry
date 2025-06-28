# VintageVault - AI-Powered Jewelry E-Commerce Platform

A cutting-edge pre-owned jewelry marketplace featuring advanced AI analysis, automated listing generation, and professional e-commerce functionality.

## 🚀 Features

### Core E-Commerce
- **Modern Design**: Elegant, responsive design with custom VintageVault branding
- **User Authentication**: Secure login/registration with Supabase
- **Product Catalog**: Advanced filtering, search, and collection browsing
- **Shopping Cart**: Full cart functionality with Stripe payment integration
- **Mobile Responsive**: Optimized for all device sizes

### Advanced AI Pipeline
- **YOLO Object Detection**: Precise jewelry identification and localization
- **CLIP Vision-Language**: Sophisticated style and material analysis
- **SAM Segmentation**: Advanced image segmentation for background removal
- **Weaviate Vector Database**: Intelligent similarity search and classification
- **Jina AI Embeddings**: Multi-modal embeddings for enhanced search
- **LangChain Reasoning**: Contextual analysis with memory management
- **CrewAI Multi-Agent**: Collaborative AI agents for comprehensive analysis

### Automated Listing Generation
- **Image Processing**: Professional image optimization and enhancement
- **Metadata Extraction**: Comprehensive jewelry metadata extraction
- **Market Analysis**: Real-time pricing and market intelligence
- **SEO Optimization**: Auto-generated titles, descriptions, and keywords
- **Quality Assessment**: AI-powered condition and authenticity verification

### Technical Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase, Edge Functions, PostgreSQL
- **AI/ML**: Modal Labs GPU, HuggingFace, OpenAI, Jina AI, Weaviate
- **Payments**: Stripe integration with secure checkout
- **Storage**: Supabase Storage with CDN
- **Deployment**: Vercel with automatic CI/CD

## 🛠 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup
1. Clone the repository:
```bash
git clone https://github.com/bzcasper/vintage-vault-jewelry.git
cd vintage-vault-jewelry
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# AI Services
MODAL_TOKEN_ID=your_modal_token_id
MODAL_TOKEN_SECRET=your_modal_token_secret
MODAL_ENDPOINT=your_modal_endpoint
JINA_API_KEY=your_jina_api_key
WEAVIATE_ENDPOINT=your_weaviate_endpoint
WEAVIATE_API_KEY=your_weaviate_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Additional Services
RESEND_API_KEY=your_resend_api_key
VERCEL_TOKEN=your_vercel_token
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Architecture

### AI Processing Pipeline
```
Image Upload → YOLO Detection → CLIP Analysis → SAM Segmentation
     ↓
Jina Embeddings → Weaviate Storage → LangChain Reasoning → CrewAI Analysis
     ↓
Automated Listing → Metadata Extraction → SEO Optimization → Publication
```

### Database Schema
- **Users**: Authentication and profile management
- **Products**: Jewelry items with comprehensive metadata
- **Orders**: Purchase history and transaction records
- **AI Analyses**: Stored AI processing results
- **Listings**: Auto-generated product listings

### API Endpoints
- `/api/upload/advanced` - Advanced AI image processing
- `/api/products` - Product CRUD operations
- `/api/auth` - Authentication endpoints
- `/api/payments` - Stripe payment processing
- `/api/search` - Advanced search with AI embeddings

## 🎯 Usage

### For Sellers
1. **Upload Images**: Drag and drop jewelry photos
2. **AI Analysis**: Automatic processing with YOLO + CLIP + SAM
3. **Review Results**: AI-generated titles, descriptions, and pricing
4. **Publish Listings**: One-click publication to marketplace

### For Buyers
1. **Browse Collections**: Filter by category, price, era, materials
2. **Advanced Search**: AI-powered similarity search
3. **Product Details**: Comprehensive information and high-quality images
4. **Secure Checkout**: Stripe-powered payment processing

### For Administrators
1. **Analytics Dashboard**: Sales, user, and AI performance metrics
2. **Content Management**: Moderate listings and user content
3. **AI Model Management**: Monitor and update AI models
4. **Financial Reports**: Revenue, commissions, and cost analysis

## 🔧 Configuration

### AI Model Configuration
The platform uses multiple AI models that can be configured:

- **YOLO**: Object detection for jewelry identification
- **CLIP**: Vision-language understanding for style analysis
- **SAM**: Segmentation for background removal
- **LangChain**: Reasoning and context management
- **CrewAI**: Multi-agent collaboration

### Performance Optimization
- **Image Optimization**: Automatic resizing and format conversion
- **Caching**: Redis caching for frequently accessed data
- **CDN**: Global content delivery for fast image loading
- **Database Optimization**: Indexed queries and connection pooling

## 📊 Monitoring

### AI Performance Metrics
- Processing time per image
- Model accuracy scores
- Resource utilization
- Cost per analysis

### Business Metrics
- Conversion rates
- Average order value
- User engagement
- Revenue analytics

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

### Docker Deployment
```bash
docker build -t vintage-vault .
docker run -p 3000:3000 vintage-vault
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Modal Labs** for GPU-powered AI processing
- **Supabase** for backend infrastructure
- **Vercel** for deployment platform
- **Stripe** for payment processing
- **HuggingFace** for AI model hosting
- **Jina AI** for embedding services
- **Weaviate** for vector database

## 📞 Support

For support, email bobby@aitoolpool.com or join our Discord community.

## 🔗 Links

- [Live Demo](https://vintage-vault-jewelry.vercel.app)
- [Documentation](https://docs.vintage-vault.com)
- [API Reference](https://api.vintage-vault.com/docs)
- [Discord Community](https://discord.gg/vintage-vault)

---

Built with ❤️ by the VintageVault team


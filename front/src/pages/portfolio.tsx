import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import { Portfolio } from '@/types/portfolio'
import Loading from '@/components/ui/Loading'
import portfolioData from '@/data/portfolio.json'

// Dynamic imports for performance optimization
const PortfolioCard = dynamic(() => import('@/components/react-bits/PortfolioCard'), {
  loading: () => <div className="bg-gray-800/30 rounded-xl p-6 animate-pulse h-96" />,
  ssr: true
})

const PortfolioFilter = dynamic(() => import('@/components/react-bits/PortfolioFilter'), {
  loading: () => <div className="flex justify-center gap-4 py-8">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="px-8 py-3 bg-gray-800/50 rounded-lg animate-pulse w-24 h-12" />
    ))}
  </div>,
  ssr: true
})

const FadeInText = dynamic(() => import('@/components/react-bits/FadeInText'), {
  loading: () => <div className="animate-pulse bg-gray-800/30 rounded h-8 w-64 mx-auto" />,
  ssr: true
})

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects')
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Extract unique categories from portfolio data
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(portfolioData.map(item => item.category)))
    return ['All Projects', ...uniqueCategories]
  }, [])

  // Filter portfolio items based on selected category
  const filteredPortfolio = useMemo(() => {
    if (selectedCategory === 'All Projects') {
      return portfolioData
    }
    return portfolioData.filter(item => item.category === selectedCategory)
  }, [selectedCategory])

  // Handle category change with smooth transition
  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return
    
    setIsTransitioning(true)
    
    // Add slight delay for smoother transition
    setTimeout(() => {
      setSelectedCategory(category)
      setIsTransitioning(false)
    }, 150)
  }

  return (
    <>
      <Head>
        <title>Portfolio - Creative Web Agency</title>
        <meta name="description" content="Explore our stunning portfolio of web applications, dashboards, and creative projects built with cutting-edge technologies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Skip Navigation */}
      <a 
        href="#portfolio-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                   px-4 py-2 bg-blue-600 text-white rounded-lg z-50
                   transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <main 
        className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
        role="main"
        aria-label="Portfolio showcase"
      >
        {/* Header Section with Animated Text */}
        <section 
          className="relative py-20 px-4 sm:px-6 lg:px-8"
          aria-labelledby="portfolio-heading"
        >
          <div className="max-w-7xl mx-auto text-center">
            <FadeInText
              text=""
              delay={200}
              duration={800}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              <h1 id="portfolio-heading">
                Our <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Portfolio
                </span>
              </h1>
            </FadeInText>
            
            <FadeInText
              text="Discover our collection of stunning web applications, interactive dashboards, and creative digital experiences built with cutting-edge technologies."
              delay={600}
              duration={1000}
              splitByWords={true}
              staggerDelay={50}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            />
          </div>
        </section>

        {/* Enhanced Filter Section */}
        <PortfolioFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Portfolio Grid with Animated Cards and Filtering Transitions */}
        <section 
          id="portfolio-content" 
          className="relative py-12 px-4 sm:px-6 lg:px-8"
          aria-label="Portfolio projects grid"
        >
          <div className="max-w-7xl mx-auto">
            <div className={`
              grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
              transition-all duration-300 ease-out
              ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
            `}>
              {filteredPortfolio.map((portfolio, index) => (
                <PortfolioCard
                  key={`${selectedCategory}-${portfolio.id}`} // Force re-render on category change
                  portfolio={portfolio}
                  delay={isTransitioning ? 0 : index * 100} // Staggered entrance animations
                  onHover={(portfolio) => {
                    // Optional: Add analytics tracking or other hover effects here
                  }}
                />
              ))}
            </div>

            {/* Empty state with animation */}
            {filteredPortfolio.length === 0 && !isTransitioning && (
              <FadeInText
                text=""
                delay={200}
                duration={600}
                className="text-center py-20"
              >
                <div className="text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No Projects Found</h3>
                  <p>No projects match the selected category. Try a different filter.</p>
                </div>
              </FadeInText>
            )}
          </div>
        </section>

        {/* Footer Spacer */}
        <div className="h-20"></div>
      </main>
    </>
  )
}
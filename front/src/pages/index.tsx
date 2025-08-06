import Head from 'next/head'
import dynamic from 'next/dynamic'
import Loading from '@/components/ui/Loading'

// Dynamic import for performance optimization (Task 6)
const HeroSection = dynamic(() => import('@/components/react-bits/HeroSection'), {
  ssr: true,
  loading: () => <Loading text="Loading Hero Section..." variant="dots" />
})

// Additional dynamic imports for future sections
const ParticleSystem = dynamic(() => import('@/components/react-bits/ParticleSystem'), {
  ssr: false, // Particles don't need SSR
  loading: () => null
})

export default function Home() {
  return (
    <>
      <Head>
        <title>Creative Web Agency - React Bits Portfolio</title>
        <meta name="description" content="A stunning web agency portfolio showcasing creative capabilities and technical expertise" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HeroSection />
        {/* Additional sections will be added in future stories */}
      </main>
    </>
  )
}
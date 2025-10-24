
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Banner } from '@/components/layout/Banner'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Banner />
      </main>
      
      <Footer />
    </div>
  )
}


import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Banner } from '@/components/layout/Banner'
import { AboutSection} from '@/components/layout/AboutSection'
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Banner />
        <AboutSection />
      </main>
      
      <Footer />
    </div>
  )
}

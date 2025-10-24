
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Banner } from '@/components/layout/Banner'
import { AboutSection} from '@/components/layout/AboutSection'
import { ClinicSection } from '@/components/layout/ClinicSection'
import { DoctorList } from '@/components/layout/DoctorList'
import { Specialty } from '@/components/layout/Specialty'
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Banner />
      <Specialty />
        
        <DoctorList />
       <ClinicSection />
           <AboutSection />
      </main>
      
      <Footer />
    </div>
  )
}

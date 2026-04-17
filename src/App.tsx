import { useState, useEffect } from 'react'
import { 
  Phone, 
  MapPin, 
  Mail, 
  Clock, 
  ChevronRight, 
  Star, 
  Heart, 
  BookOpen, 
  Palette, 
  Menu,
  X,
  MessageCircle,
  Instagram,
  Facebook,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import './App.css'

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Anasayfa', href: '#hero' },
    { name: 'Hakkımızda', href: '#about' },
    { name: 'Programlar', href: '#programs' },
    { name: 'Galeri', href: '#gallery' },
    { name: 'İletişim', href: '#contact' },
  ]

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-soft py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full section-padding">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-yellow rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className={`font-fredoka text-xl font-semibold transition-colors ${
              isScrolled ? 'text-gray-800' : 'text-gray-800'
            }`}>
              Minik Yürekler
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-medium text-sm hover:text-yellow transition-colors relative group ${
                  isScrolled ? 'text-gray-700' : 'text-gray-700'
                }`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="tel:02124345050"
              className="flex items-center gap-2 px-4 py-2 bg-yellow/10 text-yellow-dark rounded-full font-medium text-sm hover:bg-yellow hover:text-white transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Ara</span>
            </a>
            <a 
              href="https://wa.me/905533231987"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green text-white rounded-full font-medium text-sm hover:bg-green-dark transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 animate-slide-up">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 font-medium py-2 hover:text-yellow transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex gap-3 mt-3">
                <a 
                  href="tel:02124345050"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow text-white rounded-xl font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>Ara</span>
                </a>
                <a 
                  href="https://wa.me/905533231987"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green text-white rounded-xl font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue/15 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-green/15 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="w-full section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow/10 rounded-full mb-6 animate-slide-up">
              <Star className="w-4 h-4 text-yellow fill-yellow" />
              <span className="text-sm font-medium text-yellow-dark">Güngören'in En Sevilen Anaokulu</span>
            </div>
            
            <h1 className="font-fredoka text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Minik Yürekler{' '}
              <span className="text-yellow">Akademi</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Çocukların hayal gücünün ve öğrenme tutkusunun filizlendiği, 
              sevgi dolu bir eğitim ortamı.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <a 
                href="#programs"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow text-white rounded-2xl font-semibold text-lg hover:bg-yellow-dark hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Programları Keşfet
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold text-lg hover:border-yellow hover:text-yellow transition-all"
              >
                <MapPin className="w-5 h-5" />
                Ziyaret Et
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div>
                <div className="font-fredoka text-3xl font-bold text-yellow">15+</div>
                <div className="text-sm text-gray-500">Yıllık Deneyim</div>
              </div>
              <div>
                <div className="font-fredoka text-3xl font-bold text-blue">500+</div>
                <div className="text-sm text-gray-500">Mutlu Aile</div>
              </div>
              <div>
                <div className="font-fredoka text-3xl font-bold text-green">20+</div>
                <div className="text-sm text-gray-500">Uzman Eğitmen</div>
              </div>
            </div>
          </div>

          {/* Right Images */}
          <div className="relative hidden lg:block">
            <div className="relative h-[600px]">
              {/* Main Image */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-96 rounded-3xl overflow-hidden shadow-card animate-pulse-soft z-20">
                <img 
                  src="/images/hero-2.jpg" 
                  alt="Children learning" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Side Images */}
              <div className="absolute top-10 left-0 w-56 h-72 rounded-3xl overflow-hidden shadow-soft animate-float z-10">
                <img 
                  src="/images/hero-1.jpg" 
                  alt="Art activity" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute bottom-10 right-0 w-56 h-72 rounded-3xl overflow-hidden shadow-soft animate-float-slow z-10">
                <img 
                  src="/images/hero-3.jpg" 
                  alt="Creative play" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute top-20 right-10 bg-white rounded-2xl p-4 shadow-card animate-bounce-soft z-30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green/10 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-green" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Sevgi Dolu</div>
                    <div className="text-xs text-gray-500">Ortam</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-32 left-10 bg-white rounded-2xl p-4 shadow-card animate-bounce-soft z-30" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Güvenli</div>
                    <div className="text-xs text-gray-500">Alan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// About Section
function AboutSection() {
  const features = [
    { icon: Shield, title: 'Güvenli Ortam', desc: '7/24 güvenlik ve hijyen standartları', color: 'blue' },
    { icon: GraduationCap, title: 'Uzman Eğitmenler', desc: 'Deneyimli ve sertifikalı kadro', color: 'yellow' },
    { icon: Palette, title: 'Yaratıcı Programlar', desc: 'Oyun tabanlı eğitim yaklaşımı', color: 'green' },
  ]

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="w-full section-padding">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-soft h-64 animate-slide-in-left">
                  <img 
                    src="/images/about-1.jpg" 
                    alt="Happy child" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-soft h-48 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                  <img 
                    src="/images/about-2.jpg" 
                    alt="Child playing" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="pt-8">
                <div className="rounded-3xl overflow-hidden shadow-soft h-80 animate-slide-in-right">
                  <img 
                    src="/images/about-3.jpg" 
                    alt="Child reading" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Experience Badge */}
            <div className="absolute -bottom-6 -right-6 bg-yellow rounded-3xl p-6 shadow-card animate-float">
              <div className="font-fredoka text-4xl font-bold text-white">15+</div>
              <div className="text-white/80 text-sm">Yıllık<br/>Deneyim</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue/10 rounded-full mb-6">
              <Heart className="w-4 h-4 text-blue" />
              <span className="text-sm font-medium text-blue">Hakkımızda</span>
            </div>
            
            <h2 className="font-fredoka text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Çocukların Mutluluğu{' '}
              <span className="text-blue">Önceliğimiz</span>
            </h2>
            
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Minik Yürekler Akademi olarak, her çocuğun benzersiz olduğuna inanıyoruz. 
              2009'dan beri Güngören'de hizmet veren okulumuzda, çocukların güvenli, 
              sevgi dolu ve öğrenmeyi teşvik eden bir ortamda büyümesini sağlıyoruz.
            </p>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Uzman eğitmen kadromuz ve modern eğitim yaklaşımımızla, çocukların 
              bilişsel, sosyal, duygusal ve fiziksel gelişimlerini destekliyoruz. 
              Oyun temelli öğrenme ile çocukların doğal merakını ve öğrenme isteğini 
              koruyarak, onları hayata hazırlıyoruz.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-soft transition-all group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 bg-${feature.color}/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-fredoka text-lg font-semibold text-gray-800 mb-1">{feature.title}</h3>
                    <p className="text-gray-500 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Programs Section
function ProgramsSection() {
  const programs = [
    {
      title: 'Anaokulu',
      age: '3-6 Yaş',
      image: '/images/program-1.jpg',
      color: 'yellow',
      features: ['Okul Öncesi Eğitim', 'Sosyal Gelişim', 'Yaratıcı Aktiviteler'],
      description: 'Okul öncesi dönemde çocukların bilişsel, sosyal ve duygusal gelişimlerini destekleyen kapsamlı program.'
    },
    {
      title: 'Kreş',
      age: '2-3 Yaş',
      image: '/images/program-2.jpg',
      color: 'blue',
      features: ['Günlük Bakım', 'Oyun Aktiviteleri', 'Erken Gelişim'],
      description: 'Minikler için güvenli, sevgi dolu ve gelişimlerini destekleyen özel bakım programı.'
    },
    {
      title: 'Yaz Okulu',
      age: '3-10 Yaş',
      image: '/images/program-3.jpg',
      color: 'green',
      features: ['Eğlenceli Aktiviteler', 'Spor', 'Sanat Atölyeleri'],
      description: 'Yaz tatilinde çocukların eğlenirken öğrenmesini sağlayan dolu dolu bir program.'
    },
    {
      title: 'Özel Dersler',
      age: '4+ Yaş',
      image: '/images/program-4.jpg',
      color: 'orange',
      features: ['İngilizce', 'Müzik', 'Satranç'],
      description: 'Çocukların ilgi alanlarına göre uzman eğitmenlerle bireysel gelişim desteği.'
    },
  ]

  return (
    <section id="programs" className="py-24 bg-white relative">
      <div className="w-full section-padding">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green/10 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-green" />
            <span className="text-sm font-medium text-green">Programlarımız</span>
          </div>
          <h2 className="font-fredoka text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Her Yaşa Özel{' '}
            <span className="text-green">Programlar</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Çocuğunuzun yaşına ve gelişim düzeyine uygun, uzmanlar tarafından 
            hazırlanmış eğitim programları.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <div 
              key={program.title}
              className="group bg-cream rounded-3xl overflow-hidden hover:shadow-hover transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={program.image} 
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute top-4 left-4 px-3 py-1 bg-${program.color} text-white text-sm font-medium rounded-full`}>
                  {program.age}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="font-fredoka text-xl font-bold text-gray-800 mb-2">{program.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className={`w-4 h-4 text-${program.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <button className={`w-full py-3 rounded-xl font-medium text-sm bg-${program.color}/10 text-${program.color} hover:bg-${program.color} hover:text-white transition-all`}>
                      Detaylı Bilgi
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="font-fredoka text-2xl">{program.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <img 
                        src={program.image} 
                        alt={program.title}
                        className="w-full h-48 object-cover rounded-2xl"
                      />
                      <p className="text-gray-600">{program.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {program.features.map((feature) => (
                          <span 
                            key={feature}
                            className={`px-3 py-1 bg-${program.color}/10 text-${program.color} text-sm rounded-full`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <a 
                        href="#contact"
                        className={`block w-full py-3 text-center bg-${program.color} text-white rounded-xl font-medium hover:opacity-90 transition-opacity`}
                      >
                        Bilgi Al
                      </a>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Gallery Section
function GallerySection() {
  const images = [
    '/images/gallery-1.jpg',
    '/images/gallery-2.jpg',
    '/images/gallery-3.jpg',
    '/images/gallery-4.jpg',
    '/images/gallery-5.jpg',
    '/images/gallery-6.jpg',
    '/images/gallery-8.jpg',
    '/images/gallery-9.jpg',
    '/images/gallery-10.jpg',
    '/images/gallery-11.jpg',
    '/images/gallery-12.jpg',
  ]

  return (
    <section id="gallery" className="py-24 relative overflow-hidden">
      <div className="w-full section-padding">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange/10 rounded-full mb-6">
            <Palette className="w-4 h-4 text-orange" />
            <span className="text-sm font-medium text-orange">Galeri</span>
          </div>
          <h2 className="font-fredoka text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Mutlu Anlarımızdan{' '}
            <span className="text-orange">Kesitler</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Okulumuzdan renkli kareler ve çocuklarımızın neşe dolu anları.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div 
                  className={`relative group overflow-hidden rounded-2xl cursor-pointer ${
                    index === 0 || index === 5 ? 'sm:col-span-2 sm:row-span-2' : ''
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    aspectRatio: index === 0 || index === 5 ? '1/1' : '1/1'
                  }}
                >
                  <img 
                    src={image} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-orange" />
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
                <img 
                  src={image} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Ayşe Yılmaz',
      role: 'Anne',
      image: '/images/testimonial-1.jpg',
      content: 'Kızım 2 yıldır bu okula gidiyor ve her gün okula gitmek için sabırsızlanıyor. Öğretmenler çok ilgili ve profesyonel. Çok teşekkürler Minik Yürekler ailesi!',
      rating: 5
    },
    {
      name: 'Mehmet Kaya',
      role: 'Baba',
      image: '/images/testimonial-2.jpg',
      content: 'Oğlumun gelişimindeki değişimi görmek beni çok mutlu ediyor. Sadece akademik değil, sosyal becerileri de çok gelişti. Kesinlikle tavsiye ederim.',
      rating: 5
    },
    {
      name: 'Zeynep Aydın',
      role: 'Anneanne',
      image: '/images/testimonial-3.jpg',
      content: 'Torunum burada çok mutlu. Hijyen ve güvenlik konusunda çok titizler. Her sabah güleryüzle karşılanıyoruz. Harika bir okul!',
      rating: 5
    },
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cream to-white" />
      </div>

      <div className="w-full section-padding relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red/10 rounded-full mb-6">
            <Star className="w-4 h-4 text-red fill-red" />
            <span className="text-sm font-medium text-red">Veli Yorumları</span>
          </div>
          <h2 className="font-fredoka text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Ailelerimiz Ne{' '}
            <span className="text-red">Diyor?</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Mutlu ailelerimizin okulumuz hakkındaki değerli yorumları.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow fill-yellow" />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <div className="font-fredoka font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.')
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  const contactInfo = [
    { icon: Phone, label: 'Telefon', value: '0 (212) 434 50 50', href: 'tel:02124345050', color: 'yellow' },
    { icon: MessageCircle, label: 'WhatsApp', value: '0 (553) 323 19 87', href: 'https://wa.me/905533231987', color: 'green' },
    { icon: MapPin, label: 'Adres', value: 'Güneştepe, Soğanlı Cd. No:121, Güngören/İstanbul', href: 'https://maps.google.com/?q=Güneştepe,+Soğanlı+Cd.+No:121,+Güngören/İstanbul', color: 'red' },
    { icon: Clock, label: 'Çalışma Saatleri', value: 'Hafta İçi: 07:00 - 19:00', href: null, color: 'blue' },
  ]

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full section-padding relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue/10 rounded-full mb-6">
            <Mail className="w-4 h-4 text-blue" />
            <span className="text-sm font-medium text-blue">İletişim</span>
          </div>
          <h2 className="font-fredoka text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Bizimle{' '}
            <span className="text-blue">İletişime Geçin</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Sorularınız için bize ulaşın, en kısa sürede size dönüş yapacağız.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-soft">
            <h3 className="font-fredoka text-2xl font-bold text-gray-800 mb-6">
              Bize Yazın
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adınız Soyadınız</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Adınız Soyadınız"
                  className="h-12 rounded-xl border-gray-200 focus:border-yellow focus:ring-yellow"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="ornek@email.com"
                    className="h-12 rounded-xl border-gray-200 focus:border-yellow focus:ring-yellow"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <Input 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="05XX XXX XX XX"
                    className="h-12 rounded-xl border-gray-200 focus:border-yellow focus:ring-yellow"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mesajınız</label>
                <Textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Mesajınızı yazın..."
                  rows={4}
                  className="rounded-xl border-gray-200 focus:border-yellow focus:ring-yellow resize-none"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full h-12 bg-yellow hover:bg-yellow-dark text-white font-semibold rounded-xl transition-all"
              >
                Gönder
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.href || '#'}
                target={info.href?.startsWith('http') ? '_blank' : undefined}
                rel={info.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-soft hover:shadow-card transition-all group"
              >
                <div className={`w-12 h-12 bg-${info.color}/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <info.icon className={`w-6 h-6 text-${info.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">{info.label}</div>
                  <div className="font-semibold text-gray-800">{info.value}</div>
                </div>
                {info.href && <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow transition-colors" />}
              </a>
            ))}

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="text-sm text-gray-500 mb-4">Sosyal Medya</div>
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center hover:bg-pink-500 hover:text-white text-pink-500 transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white text-blue-600 transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://wa.me/905533231987"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green/10 rounded-xl flex items-center justify-center hover:bg-green hover:text-white text-green transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="w-full section-padding">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-yellow rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-fredoka text-xl font-semibold">Minik Yürekler</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              2009'dan beri Güngören'de çocukların hayal gücünü ve öğrenme tutkusunu 
              destekleyen sevgi dolu bir eğitim ortamı.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-yellow transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-yellow transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/905533231987"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-green transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-fredoka font-semibold text-lg mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-3">
              {['Anasayfa', 'Hakkımızda', 'Programlar', 'Galeri', 'İletişim'].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase().replace('ı', 'i')}`}
                    className="text-gray-400 hover:text-yellow transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-fredoka font-semibold text-lg mb-4">Programlarımız</h4>
            <ul className="space-y-3">
              {['Anaokulu (3-6 Yaş)', 'Kreş (2-3 Yaş)', 'Yaz Okulu', 'Özel Dersler'].map((program) => (
                <li key={program}>
                  <a 
                    href="#programs"
                    className="text-gray-400 hover:text-yellow transition-colors text-sm"
                  >
                    {program}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-fredoka font-semibold text-lg mb-4">İletişim</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="tel:02124345050"
                  className="text-gray-400 hover:text-yellow transition-colors text-sm flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  0 (212) 434 50 50
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/905533231987"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green transition-colors text-sm flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  0 (553) 323 19 87
                </a>
              </li>
              <li className="text-gray-400 text-sm flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Güneştepe, Soğanlı Cd. No:121, Güngören/İstanbul
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Minik Yürekler Akademi. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Gizlilik Politikası
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Kullanım Koşulları
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Floating Contact Buttons
function FloatingContactButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a 
        href="tel:02124345050"
        className="w-14 h-14 bg-yellow rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        title="Hemen Ara"
      >
        <Phone className="w-6 h-6 text-white" />
      </a>
      <a 
        href="https://wa.me/905533231987"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        title="WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  )
}

// Main App
function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <GallerySection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingContactButtons />
    </div>
  )
}

export default App

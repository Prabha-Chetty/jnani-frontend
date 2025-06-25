'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Users, Award, Phone, Mail, MapPin, ArrowRight, Star, Calendar, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaOptionsType } from 'embla-carousel'
import PublicNavbar from '@/components/PublicNavbar'

// Types for fetched data
interface CarouselItem {
  id: string
  title: string
  description: string
  image_url: string
}

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  image_url: string
  video_url?: string
}

interface ContentData {
  about_us: string
  mission: string
  vision: string
  values: string[]
  contact_us: {
    phone: string
    address: string
  }
  map_link: string
  social_media: {
    facebook: string
    youtube: string
    instagram: string
    twitter: string
    linkedin: string
    whatsapp: string
  }
}

interface Class {
  id: string
  name: string
  description: string
}

export default function Home() {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [contentData, setContentData] = useState<ContentData | null>(null)
  const [classes, setClasses] = useState<Class[]>([])

  const options: EmblaOptionsType = { loop: true }
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  // Function to convert Google Maps share link to embed URL
  const getEmbedUrl = (mapLink: string) => {
    if (!mapLink) return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124454.84980182622!2d77.4193186972656!3d12.89395300000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15f65ea10787%3A0x3467947a61ee7db4!2sJnani%20Study%20Centre!5e0!3m2!1sen!2sin!4v1750699889005!5m2!1sen!2sin"
    
    // If it's already an embed URL, return as is
    if (mapLink.includes('maps/embed')) return mapLink
    
    // For share links or other formats, return the default embed URL
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124454.84980182622!2d77.4193186972656!3d12.89395300000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15f65ea10787%3A0x3467947a61ee7db4!2sJnani%20Study%20Centre!5e0!3m2!1sen!2sin!4v1750699889005!5m2!1sen!2sin"
  }

  useEffect(() => {
    // Fetch all data
    const fetchData = async () => {
      try {
        const [
          carouselRes,
          eventsRes,
          contentRes,
          classesRes
        ] = await Promise.all([
          fetch('http://localhost:8000/events/carousel'),
          fetch('http://localhost:8000/events/section'),
          fetch('http://localhost:8000/content/'),
          fetch('http://localhost:8000/classes')
        ])

        if (carouselRes.ok) setCarouselItems(await carouselRes.json())
        if (eventsRes.ok) setEvents(await eventsRes.json())
        if (contentRes.ok) setContentData(await contentRes.json())
        if (classesRes.ok) setClasses(await classesRes.json())

      } catch (error) {
        console.error("Failed to fetch page data", error)
      }
    }
    fetchData()
  }, [])

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, href: contentData?.social_media.facebook },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, href: contentData?.social_media.instagram },
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, href: contentData?.social_media.twitter },
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, href: contentData?.social_media.linkedin },
    { name: 'YouTube', icon: <Youtube className="w-5 h-5" />, href: contentData?.social_media.youtube },
    { name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, href: contentData?.social_media.whatsapp },
  ].filter(link => link.href)

  const courses = [
    { name: 'Pre-KG', description: 'Early childhood development and foundational learning', level: 'Beginner' },
    { name: 'KG', description: 'Kindergarten preparation and basic skills', level: 'Beginner' },
    { name: 'LKG', description: 'Lower Kindergarten with structured learning', level: 'Beginner' },
    { name: 'UKG', description: 'Upper Kindergarten preparing for primary school', level: 'Beginner' },
    { name: 'Class 1-5', description: 'Primary education with comprehensive curriculum', level: 'Intermediate' },
    { name: 'Class 6-8', description: 'Middle school with advanced subjects', level: 'Intermediate' },
    { name: 'Class 9-10', description: 'Secondary education with board preparation', level: 'Advanced' },
    { name: '1st PUC', description: 'Pre-University Course first year', level: 'Advanced' },
    { name: '2nd PUC', description: 'Pre-University Course second year', level: 'Advanced' },
  ]

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Expert Teachers',
      description: 'Qualified and experienced educators dedicated to student success'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Small Class Sizes',
      description: 'Personalized attention with limited students per class'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Proven Results',
      description: 'Consistent academic improvement and excellent board results'
    }
  ]

  const stats = [
    { number: '500+', label: 'Students Enrolled' },
    { number: '95%', label: 'Success Rate' },
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Expert Teachers' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-900">
      {/* Navigation */}
      <PublicNavbar />

      {/* Hero Section with Slider */}
      <section id="home" className="relative py-20 md:py-24 overflow-hidden">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex flex-row overflow-hidden">
            {carouselItems.length > 0 ? carouselItems.map(item => (
              <div key={item.id} className="embla__slide flex-shrink-0 w-full relative">
                <div className="absolute inset-0">
                  <Image
                    src={item.image_url || '/assets/jnani-logo.jpeg'}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center h-[50vh]">
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                    <span className="text-gradient-primary">{item.title}</span>
                  </h1>
                  <p className="mt-6 max-w-2xl mx-auto text-lg text-dark-200">
                    {item.description}
                  </p>
                  <div className="mt-8">
                    <Link href="#contact" className="btn-primary inline-flex items-center text-lg">
                      Enroll Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="embla__slide flex-shrink-0 w-full relative">
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center h-[50vh]">
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                    <span className="text-gradient-primary">Empowering Students</span> for a Brighter Future
                  </h1>
                  <p className="mt-6 max-w-2xl mx-auto text-lg text-dark-300">
                    Expert coaching for classes 6 to 12 and PUC. We provide personalized attention and a result-oriented approach to help students achieve their academic goals.
                  </p>
                   <div className="mt-8">
                    <Link href="#contact" className="btn-primary inline-flex items-center text-lg">
                      Enroll Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <button className="embla__prev absolute top-1/2 left-4 z-30 -translate-y-1/2 btn-ghost p-2 rounded-full" onClick={scrollPrev}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="embla__next absolute top-1/2 right-4 z-30 -translate-y-1/2 btn-ghost p-2 rounded-full" onClick={scrollNext}>
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {contentData?.values && contentData.values.length > 0 ? (
            contentData.values.map((value, index) => (
              <div key={index} className="text-center card p-6 hover-lift">
                <div className="text-3xl font-bold text-secondary-400 mb-2">{value}</div>
                <div className="text-dark-300 text-sm">Achievement</div>
              </div>
            ))
          ) : (
            stats.map((stat, index) => (
              <div key={index} className="text-center card p-6 hover-lift">
                <div className="text-3xl font-bold text-secondary-400 mb-2">{stat.number}</div>
                <div className="text-dark-300 text-sm">{stat.label}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-50 mb-4">Why Choose Jnani?</h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              We provide comprehensive education with a focus on individual growth and academic excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center hover-lift group">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-dark-100 mb-4">{feature.title}</h3>
                <p className="text-dark-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Our Courses</h2>
            <p className="text-dark-300 mt-2">Tailored programs to meet the needs of every student.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((course) => (
              <div key={course.id} className="card p-8 text-center hover-lift">
                <div className="inline-block p-4 bg-dark-800 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-secondary-400" />
                </div>
                <h3 className="text-xl font-semibold text-dark-100 mb-2">{course.name}</h3>
                <p className="text-dark-300">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Our Events</h2>
            <p className="text-dark-300 mt-2">Stay updated with our latest events and activities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="card bg-dark-800 border-dark-700 hover-lift">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark-100 mb-4">{event.title}</h3>
                  {event.video_url ? (
                    <div className="mt-4">
                      <video
                        controls
                        className="w-full rounded-lg"
                      >
                        <source src={event.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-dark-400">No video available for this event</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">About Jnani Study Center</h2>
              <p className="text-dark-300 mt-4">
                {contentData?.about_us || 'We are dedicated to providing quality education and fostering a love for learning. Our experienced faculty and supportive environment ensure that every student gets the guidance they need to succeed.'}
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-secondary-500/20 rounded-full">
                    <Users className="w-6 h-6 text-secondary-400" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-dark-100">Our Mission</h4>
                    <p className="text-dark-300 mt-1">{contentData?.mission || 'To provide a nurturing environment that encourages academic excellence and personal growth.'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-secondary-500/20 rounded-full">
                    <Calendar className="w-6 h-6 text-secondary-400" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-dark-100">Our Vision</h4>
                    <p className="text-dark-300 mt-1">{contentData?.vision || 'To be a leading study center known for its commitment to student success and innovative teaching methods.'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <Image
                src="/assets/jnani-logo.jpeg"
                alt="About Us"
                width={500}
                height={500}
                className="rounded-2xl shadow-2xl mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Contact Us</h2>
            <p className="text-dark-300 mt-2">Get in touch with us for admissions and inquiries.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-dark-200">
              <h3 className="text-xl font-semibold mb-4">Our Location</h3>
              <p className="flex items-center mb-2">
                <MapPin className="w-5 h-5 mr-3 text-secondary-400" />
                <span>{contentData?.contact_us.address || '123 Jnani Street, Education Hub, Bangalore, 560001'}</span>
              </p>
              <p className="flex items-center mb-2">
                <Phone className="w-5 h-5 mr-3 text-secondary-400" />
                <span>{contentData?.contact_us.phone || '+91 98765 43210'}</span>
              </p>
              <div className="w-full h-64 bg-dark-800 rounded-lg shadow-inner overflow-hidden">
                <iframe
                  src={getEmbedUrl(contentData?.map_link || "")}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            <div className="bg-dark-800 p-8 rounded-lg shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-6">Send us a Message</h3>
              <form action="#" method="POST" className="space-y-6">
                <div>
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <input type="text" name="name" id="name" placeholder="Full Name" className="input-field w-full" />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input type="email" name="email" id="email" placeholder="Email Address" className="input-field w-full" />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">Phone Number</label>
                  <input type="tel" name="phone" id="phone" placeholder="Phone Number" className="input-field w-full" />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea name="message" id="message" rows={4} placeholder="Your Message" className="input-field w-full resize-none"></textarea>
                </div>
                <div>
                  <button type="submit" className="btn-primary w-full">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-dark-400">
          <div className="flex justify-center space-x-6 mb-4">
            {socialLinks.map((link) => (
              <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-secondary-400 transition-colors duration-200">
                {link.icon}
              </a>
            ))}
          </div>
          <p>&copy; {new Date().getFullYear()} Jnani Study Center. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
} 
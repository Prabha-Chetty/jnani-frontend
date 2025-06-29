'use client'

import { useState } from 'react'
import { Send, Loader2, Check, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

interface ContactFormProps {
  className?: string
}

export default function ContactForm({ className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name')
      return false
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number')
      return false
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message')
      return false
    }
    if (formData.message.trim().length < 10) {
      toast.error('Message must be at least 10 characters long')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact-enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Message sent successfully! We will get back to you soon.')
        setIsSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        })
      } else {
        const error = await response.text()
        toast.error('Failed to send message. Please try again.')
        console.error('Contact form error:', error)
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      toast.error('Failed to send message. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className={`bg-dark-800 p-8 rounded-lg shadow-2xl ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
          <p className="text-dark-300 mb-6">
            Thank you for contacting us. We will get back to you as soon as possible.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="btn-secondary"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-dark-800 p-8 rounded-lg shadow-2xl ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-6">Send us a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-dark-200 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="input-field w-full"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dark-200 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className="input-field w-full"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-dark-200 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            className="input-field w-full"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-dark-200 mb-2">
            Message *
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell us about your inquiry..."
            className="input-field w-full resize-none"
            disabled={isSubmitting}
            required
          />
          <p className="text-xs text-dark-400 mt-1">
            Minimum 10 characters required
          </p>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 
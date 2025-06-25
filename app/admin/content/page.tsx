'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  MessageCircle,
  Save,
  Loader2,
  Plus,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AboutContent {
  title: string
  description: string
  mission: string
  vision: string
  values: string[]
}

interface ContactContent {
  phone: string
  email: string
  address: string
  map_link: string
  working_hours: string
}

interface SocialMediaContent {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  youtube?: string
  whatsapp?: string
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState('about')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // About content state
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: '',
    description: '',
    mission: '',
    vision: '',
    values: []
  })
  
  // Contact content state
  const [contactContent, setContactContent] = useState<ContactContent>({
    phone: '',
    email: '',
    address: '',
    map_link: '',
    working_hours: ''
  })
  
  // Social media content state
  const [socialMediaContent, setSocialMediaContent] = useState<SocialMediaContent>({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    whatsapp: ''
  })

  // Load content on component mount
  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    setLoading(true)
    try {
      // Load about content
      const aboutResponse = await fetch('http://localhost:8000/admin/content/about')
      if (aboutResponse.ok) {
        const aboutData = await aboutResponse.json()
        setAboutContent(aboutData)
      }

      // Load contact content
      const contactResponse = await fetch('http://localhost:8000/admin/content/contact')
      if (contactResponse.ok) {
        const contactData = await contactResponse.json()
        setContactContent(contactData)
      }

      // Load social media content
      const socialResponse = await fetch('http://localhost:8000/admin/content/social_media')
      if (socialResponse.ok) {
        const socialData = await socialResponse.json()
        setSocialMediaContent(socialData)
      }
    } catch (error) {
      console.error('Error loading content:', error)
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleAboutSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('http://localhost:8000/admin/content/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminAuthToken')}`
        },
        body: JSON.stringify(aboutContent)
      })

      if (response.ok) {
        toast.success('About content saved successfully!')
      } else {
        toast.error('Failed to save about content')
      }
    } catch (error) {
      console.error('Error saving about content:', error)
      toast.error('Failed to save about content')
    } finally {
      setSaving(false)
    }
  }

  const handleContactSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('http://localhost:8000/admin/content/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminAuthToken')}`
        },
        body: JSON.stringify(contactContent)
      })

      if (response.ok) {
        toast.success('Contact content saved successfully!')
      } else {
        toast.error('Failed to save contact content')
      }
    } catch (error) {
      console.error('Error saving contact content:', error)
      toast.error('Failed to save contact content')
    } finally {
      setSaving(false)
    }
  }

  const handleSocialMediaSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('http://localhost:8000/admin/content/social_media', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminAuthToken')}`
        },
        body: JSON.stringify(socialMediaContent)
      })

      if (response.ok) {
        toast.success('Social media content saved successfully!')
      } else {
        toast.error('Failed to save social media content')
      }
    } catch (error) {
      console.error('Error saving social media content:', error)
      toast.error('Failed to save social media content')
    } finally {
      setSaving(false)
    }
  }

  const addValue = () => {
    setAboutContent(prev => ({
      ...prev,
      values: [...prev.values, '']
    }))
  }

  const updateValue = (index: number, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      values: prev.values.map((v, i) => i === index ? value : v)
    }))
  }

  const removeValue = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-secondary-500" />
          <span className="text-dark-200">Loading content...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-50 mb-2">Content Management</h1>
          <p className="text-dark-300">Manage your website content including about, contact, and social media information.</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-dark-800 border border-dark-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'about'
                  ? 'bg-secondary-500 text-white'
                  : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              About Content
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'contact'
                  ? 'bg-secondary-500 text-white'
                  : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Contact Details
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'social'
                  ? 'bg-secondary-500 text-white'
                  : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              <Globe className="w-4 h-4 mr-2" />
              Social Media
            </button>
          </div>
        </div>

        {/* About Content Tab */}
        {activeTab === 'about' && (
          <div className="card bg-dark-800 border-dark-700">
            <div className="p-6 border-b border-dark-700">
              <h2 className="text-xl font-semibold text-dark-50">About Section Content</h2>
              <p className="text-dark-300 mt-1">Update the about section content that appears on your website</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">Title</label>
                  <input
                    type="text"
                    value={aboutContent.title}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field w-full"
                    placeholder="About Jnani Study Center"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-dark-200">Description</label>
                <textarea
                  value={aboutContent.description}
                  onChange={(e) => setAboutContent(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field w-full min-h-[100px] resize-none"
                  placeholder="Enter a comprehensive description about your study center..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">Mission</label>
                  <textarea
                    value={aboutContent.mission}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, mission: e.target.value }))}
                    className="input-field w-full min-h-[100px] resize-none"
                    placeholder="Enter your mission statement..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">Vision</label>
                  <textarea
                    value={aboutContent.vision}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, vision: e.target.value }))}
                    className="input-field w-full min-h-[100px] resize-none"
                    placeholder="Enter your vision statement..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-dark-200">Core Values</label>
                  <button
                    type="button"
                    onClick={addValue}
                    className="btn-outline flex items-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Value
                  </button>
                </div>
                <div className="space-y-3">
                  {aboutContent.values.map((value, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateValue(index, e.target.value)}
                        className="input-field flex-1"
                        placeholder={`Value ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeValue(index)}
                        className="btn-outline text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAboutSave}
                disabled={saving}
                className="btn-primary w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save About Content
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Contact Content Tab */}
        {activeTab === 'contact' && (
          <div className="card bg-dark-800 border-dark-700">
            <div className="p-6 border-b border-dark-700">
              <h2 className="text-xl font-semibold text-dark-50">Contact Information</h2>
              <p className="text-dark-300 mt-1">Update contact details and location information</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-dark-400" />
                    <input
                      type="text"
                      value={contactContent.phone}
                      onChange={(e) => setContactContent(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field w-full pl-10"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-dark-400" />
                    <input
                      type="email"
                      value={contactContent.email}
                      onChange={(e) => setContactContent(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field w-full pl-10"
                      placeholder="info@jnanistudycenter.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-dark-200">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-dark-400" />
                  <textarea
                    value={contactContent.address}
                    onChange={(e) => setContactContent(prev => ({ ...prev, address: e.target.value }))}
                    className="input-field w-full pl-10 min-h-[80px] resize-none"
                    placeholder="Enter your complete address..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">Google Maps Link</label>
                  <input
                    type="url"
                    value={contactContent.map_link}
                    onChange={(e) => setContactContent(prev => ({ ...prev, map_link: e.target.value }))}
                    className="input-field w-full"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">Working Hours</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-dark-400" />
                    <input
                      type="text"
                      value={contactContent.working_hours}
                      onChange={(e) => setContactContent(prev => ({ ...prev, working_hours: e.target.value }))}
                      className="input-field w-full pl-10"
                      placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleContactSave}
                disabled={saving}
                className="btn-primary w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Contact Information
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="card bg-dark-800 border-dark-700">
            <div className="p-6 border-b border-dark-700">
              <h2 className="text-xl font-semibold text-dark-50">Social Media Links</h2>
              <p className="text-dark-300 mt-1">Add your social media profile links to connect with students and parents</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">Facebook</label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-3 w-4 h-4 text-blue-500" />
                    <input
                      type="url"
                      value={socialMediaContent.facebook || ''}
                      onChange={(e) => setSocialMediaContent(prev => ({ ...prev, facebook: e.target.value }))}
                      className="input-field w-full pl-10"
                      placeholder="https://facebook.com/jnanistudycenter"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">Instagram</label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-3 w-4 h-4 text-pink-500" />
                    <input
                      type="url"
                      value={socialMediaContent.instagram || ''}
                      onChange={(e) => setSocialMediaContent(prev => ({ ...prev, instagram: e.target.value }))}
                      className="input-field w-full pl-10"
                      placeholder="https://instagram.com/jnanistudycenter"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">Twitter</label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-3 w-4 h-4 text-blue-400" />
                    <input
                      type="url"
                      value={socialMediaContent.twitter || ''}
                      onChange={(e) => setSocialMediaContent(prev => ({ ...prev, twitter: e.target.value }))}
                      className="input-field w-full pl-10"
                      placeholder="https://twitter.com/jnanistudycenter"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">LinkedIn</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 w-4 h-4 text-blue-600" />
                    <input
                      type="url"
                      value={socialMediaContent.linkedin || ''}
                      onChange={(e) => setSocialMediaContent(prev => ({ ...prev, linkedin: e.target.value }))}
                      className="input-field w-full pl-10"
                      placeholder="https://linkedin.com/company/jnanistudycenter"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">YouTube</label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-3 w-4 h-4 text-red-500" />
                    <input
                      type="url"
                      value={socialMediaContent.youtube || ''}
                      onChange={(e) => setSocialMediaContent(prev => ({ ...prev, youtube: e.target.value }))}
                      className="input-field w-full pl-10"
                      placeholder="https://youtube.com/@jnanistudycenter"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-200">WhatsApp</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-3 w-4 h-4 text-green-500" />
                    <input
                      type="text"
                      value={socialMediaContent.whatsapp || ''}
                      onChange={(e) => setSocialMediaContent(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="input-field w-full pl-10"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSocialMediaSave}
                disabled={saving}
                className="btn-primary w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Social Media Links
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Heart, ChatCircle, User, List, X, CaretRight } from "@phosphor-icons/react"
import { Messages } from "@/components/Messages"

// Import assets
import MainLogo from '@/assets/images/Main_Logo.png'
import MarketplaceLogo from '@/assets/images/Marketplace.png'
import SellerLogo from '@/assets/images/Seller.png'
import BuyerLogo from '@/assets/images/Buyer.png'
import HelpLogo from '@/assets/images/Help.png'
import TicketLogo from '@/assets/images/Ticket.png'
import ClapperboardLogo from '@/assets/images/Clapperboard.png'
import PaintLogo from '@/assets/images/Paint.png'
import LaptopLogo from '@/assets/images/Laptop.png'
import RobloxLogo from '@/assets/images/Roblox.png'
import MusicLogo from '@/assets/images/Music.png'

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<"home" | "messages">("home")

  const categories = [
    { id: "programming", name: "Programming & Tech", icon: LaptopLogo, count: 15420 },
    { id: "graphics", name: "Graphics & Design", icon: PaintLogo, count: 12850 },
    { id: "video", name: "Video Editing", icon: ClapperboardLogo, count: 8650 },
    { id: "music", name: "Music & Audio", icon: MusicLogo, count: 5430 },
    { id: "roblox", name: "Roblox Development", icon: RobloxLogo, count: 3210 }
  ]

  const featuredServices = [
    {
      id: 1,
      title: "I will create a professional website with React and TypeScript",
      seller: "WebDev_Pro",
      rating: 4.9,
      reviews: 127,
      price: 250,
      category: "programming",
      image: "/api/placeholder/300/200",
      tags: ["React", "TypeScript", "Responsive"],
      level: "Level 2 Seller"
    },
    {
      id: 2,
      title: "I will design a stunning logo and brand identity",
      seller: "DesignMaster",
      rating: 5.0,
      reviews: 89,
      price: 150,
      category: "graphics",
      image: "/api/placeholder/300/200",
      tags: ["Logo Design", "Branding", "Vector"],
      level: "Top Rated Seller"
    },
    {
      id: 3,
      title: "I will edit your YouTube videos professionally",
      seller: "VideoEditor_X",
      rating: 4.8,
      reviews: 203,
      price: 75,
      category: "video",
      image: "/api/placeholder/300/200",
      tags: ["YouTube", "Editing", "Motion Graphics"],
      level: "Level 1 Seller"
    },
    {
      id: 4,
      title: "I will compose original music for your project",
      seller: "MusicComposer",
      rating: 4.9,
      reviews: 156,
      price: 200,
      category: "music",
      image: "/api/placeholder/300/200",
      tags: ["Original Music", "Soundtrack", "Mixing"],
      level: "Level 2 Seller"
    },
    {
      id: 5,
      title: "I will create custom Roblox games and scripts",
      seller: "RobloxDev",
      rating: 4.7,
      reviews: 94,
      price: 100,
      category: "roblox",
      image: "/api/placeholder/300/200",
      tags: ["Lua Scripting", "Game Design", "UI/UX"],
      level: "Level 1 Seller"
    },
    {
      id: 6,
      title: "I will develop a mobile app with Flutter",
      seller: "MobileDev_Expert",
      rating: 4.8,
      reviews: 78,
      price: 400,
      category: "programming",
      image: "/api/placeholder/300/200",
      tags: ["Flutter", "Mobile", "Cross-platform"],
      level: "Top Rated Seller"
    }
  ]

  const filteredServices = featuredServices.filter(service => 
    (activeCategory === "all" || service.category === activeCategory) &&
    (searchQuery === "" || service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  )

  // Early return for Messages page
  if (currentPage === "messages") {
    return <Messages onBack={() => setCurrentPage("home")} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src={MainLogo} alt="Seller Services" className="h-10 w-auto" />
              <span className="ml-3 text-xl font-semibold text-gray-900">Seller Services</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50">
                <img src={MarketplaceLogo} alt="Marketplace" className="h-5 w-5" />
                <span>Browse</span>
              </Button>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50">
                <img src={SellerLogo} alt="Seller" className="h-5 w-5" />
                <span>Become a Seller</span>
              </Button>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50">
                <img src={HelpLogo} alt="Help" className="h-5 w-5" />
                <span>Help & Support</span>
              </Button>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="What service are you looking for today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex items-center space-x-1 hover:bg-gray-50"
                onClick={() => setCurrentPage("messages")}
              >
                <ChatCircle className="h-4 w-4" />
                <span>Messages</span>
              </Button>
              <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-1 hover:bg-gray-50">
                <img src={TicketLogo} alt="Orders" className="h-4 w-4" />
                <span>Orders</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-gray-50">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Profile</span>
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-2 space-y-2">
              <Button variant="ghost" className="w-full justify-start space-x-2">
                <img src={MarketplaceLogo} alt="Marketplace" className="h-5 w-5" />
                <span>Browse</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start space-x-2">
                <img src={SellerLogo} alt="Seller" className="h-5 w-5" />
                <span>Become a Seller</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Messages</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start space-x-2">
                <img src={TicketLogo} alt="Orders" className="h-5 w-5" />
                <span>Orders</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start space-x-2">
                <img src={HelpLogo} alt="Help" className="h-5 w-5" />
                <span>Help & Support</span>
              </Button>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find the perfect
              <span className="text-blue-600"> freelance services</span> for your business
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Millions of people use Seller Services to turn their ideas into reality.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <Input
                  type="text"
                  placeholder="Try 'logo design', 'website development', or 'video editing'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 py-4 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full"
                />
                <Button className="absolute right-2 top-2 px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Browse by category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
                onClick={() => setActiveCategory(category.id)}
              >
                <Card className={`p-6 text-center border-2 transition-all duration-300 hover:shadow-lg ${
                  activeCategory === category.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <img src={category.icon} alt={category.name} className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count.toLocaleString()} services</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Services */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {activeCategory === "all" ? "Featured services" : `${categories.find(c => c.id === activeCategory)?.name} services`}
              </h2>
              <p className="text-gray-600">Hand-picked by our team for exceptional quality</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setActiveCategory("all")}
              className={activeCategory === "all" ? "bg-blue-50 border-blue-500" : ""}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
              >
                <Card className="overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <div className="text-center">
                        <img 
                          src={categories.find(c => c.id === service.category)?.icon} 
                          alt={service.category} 
                          className="h-20 w-20 mx-auto mb-4 opacity-60" 
                        />
                        <p className="text-gray-600 font-medium">Service Preview</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{service.seller}</p>
                        <Badge variant="secondary" className="text-xs">{service.level}</Badge>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{service.title}</h3>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-900">{service.rating}</span>
                        <span className="ml-1 text-sm text-gray-600">({service.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {service.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        From ${service.price}
                      </span>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setActiveCategory("all")
                  setSearchQuery("")
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="py-16 bg-blue-600"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of businesses that use Seller Services to turn their ideas into reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
              <img src={BuyerLogo} alt="Buyer" className="h-5 w-5 mr-2" />
              Join as a Buyer
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8">
              <img src={SellerLogo} alt="Seller" className="h-5 w-5 mr-2" />
              Become a Seller
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={MainLogo} alt="Seller Services" className="h-8 w-auto filter brightness-0 invert" />
                <span className="ml-2 text-lg font-semibold">Seller Services</span>
              </div>
              <p className="text-gray-400">
                The global marketplace for creative and professional services.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Programming & Tech</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Graphics & Design</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Video Editing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Music & Audio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roblox Development</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help & Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trust & Safety</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Seller Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
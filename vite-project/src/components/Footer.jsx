import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Youtube, Plane } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Plane className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">TravelTech</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted partner for flight, hotel, and bus bookings. Making travel accessible and affordable for
              everyone.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/flights" className="hover:text-foreground transition-colors">
                  Flight Booking
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-foreground transition-colors">
                  Hotel Booking
                </Link>
              </li>
              <li>
                <Link to="/buses" className="hover:text-foreground transition-colors">
                  Bus Booking
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-foreground transition-colors">
                  Deals & Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-3 mb-4">
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Email: support@traveltech.com
              <br />
              Phone: 1-800-TRAVEL
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TravelTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

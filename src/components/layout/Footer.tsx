import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Instagram, Twitter, Facebook, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contact" className="bg-card pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
          
          {/* Contact Form */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-headline font-bold">Get In <span className="text-primary">Touch</span></h3>
              <p className="text-muted-foreground">Have questions about our memberships or classes? Send us a message.</p>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Full Name" className="bg-background border-white/10 focus:border-primary" />
                <Input placeholder="Email Address" className="bg-background border-white/10 focus:border-primary" />
              </div>
              <Input placeholder="Subject" className="bg-background border-white/10 focus:border-primary" />
              <Textarea placeholder="Your Message" className="bg-background border-white/10 focus:border-primary min-h-[120px]" />
              <Button className="w-full bg-primary text-background font-bold h-12">Send Message</Button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <h3 className="text-2xl font-headline font-bold">Find <span className="text-secondary">Us</span></h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Location</h4>
                  <p className="text-sm text-muted-foreground">123 Fitness Ave, Luxury District<br />Metropolis, NY 10001</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Clock className="text-secondary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Working Hours</h4>
                  <p className="text-sm text-muted-foreground">Mon - Fri: 5:00 AM - 11:00 PM<br />Sat - Sun: 7:00 AM - 9:00 PM</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Contact</h4>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567<br />hello@zenithfit.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Socials & Branding */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center font-bold text-background">Z</div>
              <span className="text-2xl font-headline font-bold tracking-tighter uppercase neon-glow-blue">ZenithFit</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              ZenithFit is more than just a gym. We are a high-performance community committed to pushing the boundaries of human potential.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <Link key={i} href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all border border-white/10">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-widest">
          <p>© 2024 ZenithFit Premium Fitness Club. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
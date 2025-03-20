import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

function  Footer() {
  const footerStyle = {
    backgroundColor: '#1a202c',
    color: '#e2e8f0'
  };

  const linkStyle = {
    color: '#a0aec0',
    transition: 'color 0.2s'
  };

  return (
    <footer style={footerStyle} className='w-full'>
      <div style={{
        maxWidth: '72rem',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem'
        }}>
          {/* About & Social */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
              Rural TeleMed
            </h3>
            <p style={{ color: '#a0aec0', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Quality healthcare for rural communities.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a0aec0'}>
                <Facebook size={18} />
              </a>
              <a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a0aec0'}>
                <Twitter size={18} />
              </a>
              <a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a0aec0'}>
                <Instagram size={18} />
              </a>
              <a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a0aec0'}>
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
              Quick Links
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}>
              <a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a0aec0'}>Home</a>
              <a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a0aec0'}>Services</a>
              <a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a0aec0'}>Doctors</a>
              <a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a0aec0'}>Book Now</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
              Contact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#a0aec0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} />
                <span>1-800-123-4567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} />
                <a href="mailto:contact@ruraltelemed.com" style={linkStyle} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a0aec0'}>
                  contact@ruraltelemed.com
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} />
                <span>123 Rural Health Way, ST 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #2d3748',
          marginTop: '1.5rem',
          paddingTop: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.875rem',
            color: '#a0aec0'
          }}>
            <p>© {new Date().getFullYear()} Rural TeleMed</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a0aec0'}>Privacy</a>
              <a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a0aec0'}>Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
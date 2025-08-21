import React from 'react'
import { Container, Breadcrumbs, Link, Typography} from '@mui/material';
import { Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '../components/ContactUs';

const Contact = () => {
  return (
    <div className='min-h-screen font-outfit'>

       <header className="bg-[#f5f5f5] py-6">
        <Container maxWidth="lg">
          <h1 className="text-3xl font-medium text-center pb-5 font-outfit">Contact Us</h1>
          <Breadcrumbs aria-label="breadcrumb" className="mt-4 flex justify-center">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Typography color="text.primary">Contact Us</Typography>
          </Breadcrumbs>
        </Container>
      </header>


      <div className="flex items-center justify-center">
          <div className="flex flex-col w-full max-w-6xl">
            {/* Main Content */}
            <div className="flex-1 p-4 sm:p-6">
              <div className="container mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* Left Sidebar - Card Style */}
                <div className="w-full lg:w-1/3 p-4 sm:p-6 flex flex-col gap-4 border border-gray-200 rounded bg-white shadow">
                  {/* Email Section */}
                  <div className="flex items-center gap-4 p-4 border border-gray-300 rounded">
                    <Mail strokeWidth={1} absoluteStrokeWidth className="w-8 h-8" />
                    <div>
                      <h3 className="font-medium font-outfit text-base sm:text-lg text-gray-600">Email Address</h3>
                      <p className="text-gray-600 font-light text-sm sm:text-base">prinox@gmail.com</p>
                      <p className="text-gray-600 font-light text-sm sm:text-base">+99875748492</p>
                    </div>
                  </div>

                  {/* Office Address Section */}
                  <div className="flex items-center gap-4 p-4 border border-gray-300 rounded">
                    <MapPin strokeWidth={1} absoluteStrokeWidth className="w-8 h-8" />
                    <div>
                      <h3 className="font-medium font-outfit text-base sm:text-lg text-gray-600">Office Address</h3>
                      <p className="text-gray-600 font-light text-sm sm:text-base">Digital Agency Network 2021</p>
                      <p className="text-gray-600 font-light text-sm sm:text-base">Eastbourne Terrace</p>
                    </div>
                  </div>

                  {/* Phone Number Section */}
                  <div className="flex items-center gap-4 p-4 border border-gray-300 rounded">
                    <Phone strokeWidth={1} absoluteStrokeWidth className="w-8 h-8" />
                    <div>
                      <h3 className="font-medium font-outfit text-base sm:text-lg text-gray-600">Phone Number</h3>
                      <p className="text-gray-600 font-light text-sm sm:text-base">+91 99512 09812</p>
                      <p className="text-gray-600 font-light text-sm sm:text-base">+91 99512 09812</p>
                    </div>
                  </div>
                </div>

                {/* Right Map Section */}
                <div className="w-full lg:w-2/3 p-4 flex flex-col border border-gray-200 rounded bg-white shadow">
                  <div className="h-[300px] sm:h-[390px] overflow-hidden">
                    <iframe
                      title="Google Map Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15612.787341360043!2d79.8356354!3d11.9608698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a53630de5d4a89f%3A0xf3801a094b2f8cc3!2sBM%20TECHX%20-%20Digital%20Marketing%2C%20Web%20Design%2C%20and%20IT%20Solutions!5e0!3m2!1sen!2sin!4v1747202450246!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       <div>
         <ContactForm/>
       </div>
       
    </div>
  )
}

export default Contact

import React from 'react';
import { Container, Breadcrumbs, Link, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Sofa, Lamp, Check } from 'lucide-react';
import Aboutimage from '../assets/aboutimage.jpg';
import Service1 from '../assets/service-1.png';
import Service2 from '../assets/service-2.png';
import TestimonialSlider from './Reviews';

const AboutUs = () => {
  const features = [
    {
      title: "Free Shipping",
      description: "We build and activate brands through cultural vision, and the power of emotion across every",
      imageUrl: Service1,
      altText: "Delivery truck for free shipping"
    },
    {
      title: "24/7 Quality Support",
      description: "We build and activate brands through cultural vision, and the power of emotion across every",
      imageUrl: Service2,
      altText: "Customer support team"
    },
    {
      title: "Easy Return Policy",
      description: "We build and activate brands through cultural vision, and the power of emotion across every",
      imageUrl: Service1,
      altText: "Person returning a package"
    },
  ];


  return (
    <div className="min-h-screen font-outfit">
      {/* Header */}
      <header className="bg-[#f5f5f5] py-6">
        <Container maxWidth="lg">
          <h1 className="text-3xl font-medium text-center pb-5 font-outfit">About Us</h1>
          <Breadcrumbs aria-label="breadcrumb" className="mt-4 flex justify-center">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Typography color="text.primary">About Us</Typography>
          </Breadcrumbs>
        </Container>
      </header>

      <main className="py-12 bg-white">
        <Container maxWidth="lg" className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 relative">
            <img
              src={Aboutimage}
              alt="Modern living room with sofa and decor"
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 left-4 bg-white text-black px-4 py-2 font-mulish rounded">
          25+ Years of Experience
        </div>
          </div>

          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl font-medium mb-4 font-outfit">
              Quality Wood Furniture for Your Unique Space
            </h2>
            <strong className="text-lg font-light text-gray-400 mb-6 font-outfit">
              Timeless furniture crafted with culture, vision, and heart.
            </strong>
            <List>
              <ListItem>
                <ListItemIcon>
                  <div className="flex items-center gap-2">
                    <Sofa className="w-6 h-6 text-gray-700" /> {/* Lucide Sofa icon for Furniture Design */}
                  </div>
                </ListItemIcon>
                <ListItemText primary="Furniture Design" secondary="Mix and match colors, sizes, and designs" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <div className="flex items-center gap-2">
                    <Lamp className="w-6 h-6 text-gray-700" /> {/* Lucide Lamp icon for Home Decoration */}
                  </div>
                </ListItemIcon>
                <ListItemText primary="Home Decoration" secondary="Top quality prints using the latest technology" />
              </ListItem>
            </List>
            <Divider />
            <p className="mt-6 text-gray-600">
              <strong className="text-gray-600 font-light">Foqrul Saheb — Senior Artist Developer</strong>
            </p>
          </div>
        </Container>
      </main>

      <section className="py-12 bg-white">
        <Container maxWidth="lg">
          <div className="max-w-4xl ">
            <div className="mb-6">
              <span className="inline-block bg-gray-100 text-gray-700 text-sm font-medium py-2 px-4 rounded-full border border-gray-300">
                100% Quality Wood
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-light mb-8 leading-tight font-outfit">
              Elevate Your Brand
            </h1>

            <p className="text-gray-500 font-light mb-8 leading-relaxed text-justify" style={{fontSize:'16px'}}>
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or random words look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t anything embarrassing hidden in the middle of text. Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from characteristic words etc.
            </p>

            <p className="text-gray-800 font-light mb-6">
              World best education site – (Computer engineering)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-gray-800 mt-1" />
                <span className="text-gray-500  font-light">Preaching Worship An Online Family</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-gray-800 mt-1" />
                <span className="text-gray-500  font-light">Preaching Worship An Online Family</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-gray-800 mt-1" />
                <span className="text-gray-500  font-light">Preaching Worship An Online Family</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-gray-800 mt-1" />
                <span className="text-gray-500  font-light">Preaching Worship An Online Family</span>
              </div>
            </div>
          </div>
        </Container>       
      </section>

      <section>
      <div className="bg-[#f7f7f7] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#f7f7f7] rounded-lg transition-all duration-300 overflow-hidden flex flex-col items-center hover:bg-white"
            >
              <div className="h-48 w-full flex items-center justify-center p-4">
                <div className="w-36 h-36 overflow-hidden">
                  <img
                    src={feature.imageUrl}
                    alt={feature.altText}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="p-6 text-center w-full">
                <h3 className="text-xl font-medium font-outfit text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-400 font-light font-outfit">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <TestimonialSlider/>
    </div>
  );
};

export default AboutUs;
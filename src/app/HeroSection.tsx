"use client"; // Required for client-side interactivity

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client"; // Import Sanity client
import imageUrlBuilder from "@sanity/image-url"; // Import imageUrlBuilder
import { useEffect, useState } from "react";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13+

// Initialize the image URL builder
const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export default function ModernFurniture() {
  const [heroBanner, setHeroBanner] = useState({
    title: "",
    subtitle: "",
    description: "",
    contactNumber: "",
    websiteUrl: "",
    image: "",
    discount: "",
  });

  const router = useRouter(); // Initialize the router

  // Fetch hero banner data from Sanity
  useEffect(() => {
    const fetchHeroBanner = async () => {
      const query = `*[_type == "heroBanner"][0]{
        title,
        subtitle,
        description,
        contactNumber,
        websiteUrl,
        "image": image.asset->url,
        discount
      }`;
      const data = await client.fetch(query);
      setHeroBanner(data);
    };

    fetchHeroBanner();
  }, []);

  const handleAllProducts = () => {
    try {
      router.push("/all-products"); // Correct usage of router.push
    } catch (error) {
      console.error("Failed to redirect to /all-products:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Main Content */}
            <div className="space-y-4 max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold">
                {heroBanner.title}{" "}
                <span className="text-[#d4bc8b] block">
                  {heroBanner.subtitle}
                </span>
              </h1>

              <div className="space-y-6">
                <h2 className="font-semibold">About Product</h2>
                <p className="text-gray-600 leading-relaxed">
                  {heroBanner.description ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing est et dolor. Curabitur ac consequat enim. Duis non tellus sem. Sed vitae dolor a augue volutpat ultricies non in est."}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`tel:${heroBanner.contactNumber || "+1234567890"}`}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <span className="mr-2">☎</span>
                    CONTACT {heroBanner.contactNumber || "555 6666"}
                  </Link>
                  <Button
                    className="bg-black text-white hover:bg-gray-800"
                    aria-label="Buy Now"
                    onClick={handleAllProducts}
                  >
                    ORDER NOW
                  </Button>
                </div>

                {/* Website URL */}
                
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] w-full">
              {heroBanner.image && (
                <Image
                  src={urlFor(heroBanner.image).url()} // Use urlFor to generate the image URL
                  alt="Modern dining set with geometric wall pattern"
                  fill
                  className="object-cover rounded-md"
                />
              )}
              {/* Sale Badge */}
              <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-sm">
                <span className="text-xl font-bold">
                  {heroBanner.discount || "50%"}
                </span>
                <span className="block text-sm">OFF</span>
              </div>
            </div>

            {/* Social Icons */}
            
          </div>
        </div>
      </div>
    </div>
  );
}
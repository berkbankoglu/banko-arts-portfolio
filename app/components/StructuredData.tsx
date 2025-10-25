export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Banko Arts",
    "url": "https://bankoarts.com",
    "logo": "https://bankoarts.com/hero-image.jpg",
    "description": "Professional 3D architectural visualization and rendering services with 824+ completed projects and 10 years of experience.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90-539-269-8915",
      "contactType": "customer service",
      "availableLanguage": ["en", "tr"]
    },
    "sameAs": [
      "https://www.instagram.com/bankoarts",
      "https://www.linkedin.com/company/bankoarts",
      "https://twitter.com/bankoarts"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR"
    }
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Banko Arts - 3D Architectural Visualization Services",
    "image": "https://bankoarts.com/hero-image.jpg",
    "url": "https://bankoarts.com",
    "telephone": "+90-539-269-8915",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.0082,
      "longitude": 28.9784
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "824",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "3D Architectural Visualization",
    "provider": {
      "@type": "Organization",
      "name": "Banko Arts"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "3D Visualization Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Exterior 3D Rendering"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Interior 3D Rendering"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "3D Animation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Architectural Visualization"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}

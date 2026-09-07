/**
 * Centralized Site & Business Configuration for Akshay Garments
 * Update any company detail, phone number, address, or social link here
 */

export const siteConfig = {
  companyName: "Akshay Garments",
  tagline: "School Uniforms & Institutional Apparel Crafted with Precision",
  shortDesc: "Trusted manufacturer and bulk supplier of premium school/College uniforms, certified durable fabrics, and custom embroidery for premier schools across India.",
  establishedYear: 2011,

  contact: {
    phone: "+91 6301050642",
    phoneDisplay: "+91 6301050642",
    phoneSecondary: "+91 6301050642",
    whatsapp: "+916301050642",
    email: "akshaydonthula283@gmail.com",
    salesEmail: "akshaydonthula283@gmail.com",
    address: {
      line1: "Plot No. 1-4-2/B, GeethaNagar",
      line2: "Backside of LIC office",
      city: "Jangaon",
      state: "Telangana",
      postalCode: "506167",
      country: "India"
    },
    businessHours: "Monday – Saturday: 9:00 AM – 7:30 PM (IST)",
    sundayHours: "Sunday: By Appointment for School Management Committees"
  },

  socialLinks: {
    instagram: "https://instagram.com/akshaygarments_uniforms",
    whatsappDirect: "https://wa.me/916301050642"
  },

  stats: [
    { value: "20+", label: "Years of Craftsmanship", suffix: "" },
    { value: "85+", label: "Happy Institutes & Schools", suffix: "" },
    { value: "10,000", label: "Students Clothed Annually", suffix: "" },
  ],

  whatsappTemplates: {
    general: "Hello Akshay Garments! I am interested in exploring your school uniforms and catalogs. Could you share more details?",
    bulkSchool: "Hello! I represent a school/educational institution and would like to request a bulk uniform quotation and fabric swatch kit.",
    fabricSample: (fabricName) => `Hello! I would like to request fabric swatches and technical specs for "${fabricName}".`,
    productEnquiry: (productName, category) => `Hello Akshay Garments! I would like to enquire about "${productName}" (${category}) for our school uniforms.`,
    fitKit: "Hello! We would like to schedule a Sizing Fit Kit trial for our school students."
  }
};

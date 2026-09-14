export type DeviceCategory = "Laptop" | "Tablet";

export type VendorDevice = {
  id: string;
  name: string;
  model: string;
  image: string;
  imageAlt: string;
  price: number | null;
  currency: string;
  ram: string;
  storage: string;
  processor: string;
  condition: string;
  availability: string;
  workDeviceStatus: string;
  description: string;
  features: string[];
  category: DeviceCategory;
};

export const trustedVendorEmail = "support@yourdomain.com";

export const vendorDevices: VendorDevice[] = [
  {
    id: "macbook-air-13-m2-wfh",
    name: "MacBook Air 13-inch Remote Work Edition",
    model: "Apple M2 · 13.6-inch Liquid Retina",
    image: "https://cdn.builder.io/api/v1/image/assets%2F3c6d62f043f54b038c0855c36ba11da4%2F939428ec47fa483488bea7cdb56d4d5c?format=webp&width=800&height=1200",
    imageAlt: "Silver MacBook Air open on a home workspace",
    price: 1500,
    currency: "USD",
    ram: "16GB unified memory",
    storage: "512GB SSD",
    processor: "Apple M2 chip",
    condition: "Excellent",
    availability: "Available",
    workDeviceStatus: "Amazon Work Device",
    description: "A lightweight MacBook Air built for comfortable everyday productivity at home. Its responsive performance keeps documents, browser-based tools, and video calls moving smoothly while the long-lasting battery supports a flexible workspace.",
    features: ["All-day battery for untethered home-office work", "Clear 1080p video conferencing and professional communication", "Quiet multitasking across documents, email, and browser tools"],
    category: "Laptop",
  },
  {
    id: "macbook-air-15-m3-wfh",
    name: "MacBook Air 15-inch Collaboration Edition",
    model: "Apple M3 · 15.3-inch Liquid Retina",
    image: "https://cdn.builder.io/api/v1/image/assets%2F3c6d62f043f54b038c0855c36ba11da4%2F1ea2930b6637439cab756aa28f71f63a?format=webp&width=800&height=1200",
    imageAlt: "Gold MacBook Air closed on its original box",
    price: 2800,
    currency: "USD",
    ram: "24GB unified memory",
    storage: "1TB SSD",
    processor: "Apple M3 chip",
    condition: "Excellent",
    availability: "Available",
    workDeviceStatus: "Amazon Work Device",
    description: "This spacious 15-inch MacBook Air provides a polished home-office setup for remote collaboration. The larger display gives documents, meeting windows, and communications room to breathe, with reliable performance for demanding daily multitasking.",
    features: ["Expansive display for document creation and side-by-side multitasking", "Dependable performance for remote meetings and shared workspaces", "Slim portable design that transitions easily between home and travel"],
    category: "Laptop",
  },
  {
    id: "macbook-pro-14-m3-pro-wfh",
    name: "MacBook Pro 14-inch Productivity Edition",
    model: "Apple M3 Pro · 14.2-inch Liquid Retina XDR",
    image: "https://cdn.builder.io/api/v1/image/assets%2F3c6d62f043f54b038c0855c36ba11da4%2F1b278ca607ad4a54a17684c711ada685?format=webp&width=800&height=1200",
    imageAlt: "Silver MacBook Air open and starting on a home desk",
    price: 3000,
    currency: "USD",
    ram: "36GB unified memory",
    storage: "1TB SSD",
    processor: "Apple M3 Pro chip",
    condition: "Excellent",
    availability: "Available",
    workDeviceStatus: "Amazon Work Device",
    description: "A high-capacity MacBook Pro for professionals who balance intensive projects with continuous communication. It delivers the reliable power to run multiple work applications, create polished documents, and stay present in video conferences throughout the day.",
    features: ["Professional-grade power for complex multitasking and creative work", "High-fidelity camera, microphones, and speakers for confident video calls", "Long battery life and a portable footprint for productive work anywhere"],
    category: "Laptop",
  },
];

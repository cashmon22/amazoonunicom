import { BarChart3, Eye, FileCheck2, FileSearch, MessageSquare, Search } from "lucide-react";

export const assignmentCategories = [
  {
    title: "Product Research",
    difficulty: "Beginner–Intermediate",
    time: "30–90 Minutes",
    reward: "$20–$100",
    description: "Research products, features, competitors, market trends, and customer insights.",
    icon: FileSearch,
  },
  {
    title: "Marketplace Evaluation",
    difficulty: "Intermediate",
    time: "1–3 Hours",
    reward: "$30–$150",
    description: "Analyze listings, identify content issues, evaluate marketplace quality, and provide structured recommendations.",
    icon: BarChart3,
  },
  {
    title: "Product Feedback",
    difficulty: "Beginner",
    time: "20–60 Minutes",
    reward: "$15–$75",
    description: "Provide detailed feedback on products, features, packaging, usability, and customer experience.",
    icon: MessageSquare,
  },
  {
    title: "Content Quality Assessment",
    difficulty: "Intermediate–Advanced",
    time: "1–4 Hours",
    reward: "$25–$125",
    description: "Review product information, images, descriptions, specifications, and content quality standards.",
    icon: FileCheck2,
  },
  {
    title: "Customer Experience Testing",
    difficulty: "Advanced",
    time: "2–6 Hours",
    reward: "$50–$250",
    description: "Perform end-to-end shopping experience evaluations, identify friction points, test workflows, and provide detailed reports.",
    icon: Eye,
  },
  {
    title: "Premium Research Projects",
    difficulty: "Expert",
    time: "4–12 Hours",
    reward: "$100–$500+",
    description: "Advanced marketplace studies, product intelligence projects, category research, and strategic evaluation assignments.",
    icon: Search,
  },
];

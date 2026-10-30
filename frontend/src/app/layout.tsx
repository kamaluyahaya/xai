import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XAI Banking System | Explainable AI for Decision Making",
  description: "Design and implementation of an Explainable Artificial Intelligence system for transparent and fair decision making in banking — featuring SHAP analysis, LIME explanations, and real-time risk assessment.",
  keywords: "XAI, Explainable AI, Banking, SHAP, LIME, Credit Risk, Loan Approval, Transparent AI, Machine Learning",
  authors: [{ name: "XAI Banking Research Team" }],
  openGraph: {
    title: "XAI Banking System",
    description: "Explainable AI Decision Making for Modern Banking",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="gradient-bg grid-overlay min-h-screen">
        {children}
      </body>
    </html>
  );
}

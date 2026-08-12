import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Navbar from '@/components/Navbar/Navbar';
import CartDrawer from '@/components/Cart/CartDrawer';
import CheckoutModal from '@/components/Checkout/CheckoutModal';
import SearchModal from '@/components/Search/SearchModal';
import Footer from '@/components/Footer/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'WALIM LTD | Online Retail & Digital Commerce',
  description: 'WALIM LTD (UK Company No. 17383282) is a UK-registered e-commerce company operating digital retail channels and supplier partnership networks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-slate-50 text-slate-900 antialiased selection:bg-indigo-600 selection:text-white`}>
        <Navbar />
        <CartDrawer />
        <CheckoutModal />
        <SearchModal />

        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Footer />
      </body>
    </html>
  );
}

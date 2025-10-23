import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ApolloWrapper } from '@/components/apollo-wrapper';
import { DesktopNav } from '@/components/layout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BuildPass - Site Diary',
  description: 'Construction site diary management for field teams',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BuildPass',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
  userScalable: true,
  viewportFit: 'cover', // For notched devices
};

const RootLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloWrapper>
          {/* Sticky Navigation - Shows on all screen sizes */}
          <DesktopNav />

          {/* Main Content Area */}
          <main className="min-h-screen">{children}</main>
        </ApolloWrapper>
      </body>
    </html>
  );
};

export default RootLayout;

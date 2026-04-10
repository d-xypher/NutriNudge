import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import Analytics from '@/components/Analytics';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NutriNudge — AI-Powered Eating Habit Coach',
  description:
    'NutriNudge predicts your friction points and optimizes your next meal before you eat it. Log meals, get behavioral nudges, and build healthier eating habits.',
  keywords: ['nutrition', 'health', 'AI', 'meal tracking', 'behavioral coaching'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Analytics />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

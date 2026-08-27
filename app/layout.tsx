import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'SilverScreens — We Make Celebrities',
    template: '%s | SilverScreens',
  },
  description:
    'AI-powered international Media Talent Marketplace connecting creative talent with industry professionals and brands.',
  keywords: ['casting calls', 'talent marketplace', 'actors', 'models', 'production house', 'auditions'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'SilverScreens',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
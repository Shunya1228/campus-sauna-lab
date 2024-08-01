import "./globals.css";
import Footer from "./Footer";
import SupabaseListener from '../components/supabase-listener'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Campus Sauna Lab",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}
) {
  return (
    <html lang="jp">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
      </head>
      <body className="flex flex-col min-h-screen bg-background text-foreground">
      <SupabaseListener />
          <main className="flex-grow">
            {children}
            <Footer />
          </main>
        </body>
    </html>
  );
}

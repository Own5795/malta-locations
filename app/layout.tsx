import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });
const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const SITE = "https://malta-locations.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Malta Locations — Film & Photography Location Directory",
    template: "%s | Malta Locations",
  },
  description:
    "An open, searchable index of film, video and photography locations across Malta, Gozo and Comino. Search by visual brief, not place name.",
  openGraph: {
    type: "website",
    siteName: "Malta Locations",
    title: "Malta Locations — Film & Photography Location Directory",
    description:
      "Search coastlines, historic streets, forts, quarries, salt pans and windmills across Malta, Gozo and Comino.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-[900] border-b border-line bg-paper/85 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
            <Link href="/" className="group flex items-baseline gap-2">
              <span className="font-display text-[22px] leading-none tracking-tight">
                Malta Locations
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-muted sm:inline">
                Film &amp; Photo Index
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-[13px]">
              <Link
                href="/brief"
                className="rounded-full px-3 py-1.5 text-ink-2 transition-colors hover:bg-paper-2"
              >
                Send a brief
              </Link>
              <Link
                href="/submit-a-location"
                className="hidden rounded-full px-3 py-1.5 text-ink-2 transition-colors hover:bg-paper-2 sm:block"
              >
                Add a location
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-20 border-t border-line">
          <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-md">
                <p className="font-display text-xl">Malta Locations</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  An open index of shoot locations across Malta, Gozo and Comino.
                  Built because sourcing a location here still means knowing the
                  right person. Early version — the index is being expanded against
                  what people actually search for.
                </p>
              </div>
              <div className="flex gap-12 text-[13px]">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                    Browse
                  </span>
                  <Link href="/" className="text-ink-2 hover:text-accent">All locations</Link>
                  <Link href="/?view=map" className="text-ink-2 hover:text-accent">Map</Link>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                    Contribute
                  </span>
                  <Link href="/brief" className="text-ink-2 hover:text-accent">Send a brief</Link>
                  <Link href="/submit-a-location" className="text-ink-2 hover:text-accent">Add a location</Link>
                </div>
              </div>
            </div>
            <p className="mt-10 border-t border-line pt-6 text-[11px] leading-relaxed text-muted">
              Location listings are for discovery only and do not confirm that
              filming is permitted. Commercial filming, drone use, larger crews or
              exclusive use may require permission from the relevant owner or
              authority. Imagery via Wikimedia Commons under the licences credited
              on each listing.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

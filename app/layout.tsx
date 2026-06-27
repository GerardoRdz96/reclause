import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans-var", display: "swap" });
const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif-var",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500"],
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-var", display: "swap" });

const REPO = "https://github.com/GerardoRdz96/reclause";

export const metadata: Metadata = {
  metadataBase: new URL("https://reclause.penguinalley.com"),
  title: {
    default: "Reclause — check your subscription flows against US auto-renewal law",
    template: "%s · Reclause",
  },
  description:
    "Reclause is a free, educational tool that checks your subscription signup and cancellation flows against each US state's auto-renewal (negative-option) law, with the exact statute behind every flag. Not legal advice. By Penguin Alley.",
  keywords: [
    "auto-renewal law",
    "negative option",
    "click to cancel",
    "subscription compliance",
    "California auto-renewal law",
    "ROSCA",
    "subscription cancellation law",
  ],
  openGraph: {
    title: "Reclause — check your subscription flows against US auto-renewal law",
    description:
      "Free and cited. See where your signup and cancellation flows may miss a state's auto-renewal rules, with the statute behind every flag. Not legal advice.",
    type: "website",
    siteName: "Reclause",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Reclause — check your subscription flows against US auto-renewal law" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reclause — check your subscription flows against US auto-renewal law",
    description: "Free and cited. See where your subscription flows may miss a state's auto-renewal rules. Not legal advice.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <header className="site-header">
          <div className="wrap header-inner">
            <Link href="/" className="brand" aria-label="Reclause home">
              <span className="brand__chip" aria-hidden="true">
                <img src="/brand/pa-icon-white.png" alt="" />
              </span>
              <span className="brand__name">Reclause</span>
            </Link>
            <nav className="site-nav">
              <Link href="/states">States</Link>
              <Link href="/about" className="nav-hide">
                Methodology
              </Link>
              <a href={REPO} target="_blank" rel="noopener noreferrer" className="nav-hide">
                GitHub
              </a>
              <Link href="/scan" className="btn btn-primary nav-cta">
                Run the scan
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="wrap">
            <div className="footer-grid">
              <div className="footer-col">
                <h4>Reclause</h4>
                <p className="small muted" style={{ maxWidth: "28ch" }}>
                  A free, cited map of US subscription auto-renewal law. Fair sign-ups, easy
                  cancellations, in every state.
                </p>
                <div className="footer-built">
                  <span>Built by</span>
                  <a href="https://penguinalley.com" aria-label="Penguin Alley">
                    <img src="/brand/pa-lockup-blue.png" alt="Penguin Alley" />
                  </a>
                </div>
              </div>
              <div className="footer-col">
                <h4>Product</h4>
                <Link href="/scan">Run the free scan</Link>
                <Link href="/states">Browse state laws</Link>
                <Link href="/about">How it works</Link>
                <Link href="/disclaimer">Disclaimer</Link>
              </div>
              <div className="footer-col">
                <h4>Open</h4>
                <a href={REPO} target="_blank" rel="noopener noreferrer">
                  View the data on GitHub
                </a>
                <a href={`${REPO}/issues/new`} target="_blank" rel="noopener noreferrer">
                  Suggest a correction
                </a>
                <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer">
                  MIT licensed
                </a>
                <span className="small muted" style={{ display: "block", paddingTop: 3 }}>
                  Data last reviewed June 2026
                </span>
              </div>
            </div>
            <p className="footer-disclaimer">
              <strong>Not legal advice.</strong> Reclause is an educational tool. It compares the
              flow you describe against published state statutes to surface areas worth a closer
              look. It never determines your legal compliance, and laws change and apply to facts a
              questionnaire cannot capture. For decisions, talk to a qualified attorney.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://arl-radar.penguinalley.com"),
  title: {
    default: "ARL Radar — free subscription auto-renewal law checker (US)",
    template: "%s · ARL Radar",
  },
  description:
    "A free, educational scanner that shows which US state subscription auto-renewal (ARL / negative-option) laws may apply to your business and where your flow may have gaps. Not legal advice. By Penguin Alley.",
  keywords: [
    "auto-renewal law",
    "ARL compliance",
    "negative option",
    "click to cancel",
    "subscription compliance",
    "California ARL",
    "ROSCA",
  ],
  openGraph: {
    title: "ARL Radar — free subscription auto-renewal law checker",
    description:
      "Find out which US state auto-renewal laws may apply to your subscription business, and where your signup and cancellation flow may have gaps. Free, educational, not legal advice.",
    type: "website",
    siteName: "ARL Radar",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="wrap header-inner">
            <Link href="/" className="brand" aria-label="ARL Radar home">
              <span className="brand-mark" aria-hidden="true" />
              <span className="brand-name">
                ARL<span className="brand-accent">Radar</span>
              </span>
            </Link>
            <nav className="site-nav">
              <Link href="/states">States</Link>
              <Link href="/about">How it works</Link>
              <Link href="/scan" className="nav-cta">
                Free scan
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <p className="footer-disclaimer">
              <strong>Not legal advice.</strong> ARL Radar is an automated educational tool. It
              describes what publicly available state auto-renewal statutes address, based only on
              the answers you provide, and it is not a determination of your legal compliance. Laws
              change and apply to facts a questionnaire cannot capture. Consult a qualified attorney
              before relying on any of it.
            </p>
            <p className="footer-meta">
              A <a href="https://penguinalley.com">Penguin Alley</a> project · The underlying
              requirements dataset is open and cited. ·{" "}
              <Link href="/about">How this works</Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lawyer Agent Assistant',
  description: 'Conversational assistant familiar with legal terminology and obscure laws. Not legal advice.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>Lawyer Agent Assistant</h1>
            <p className="tagline">Educational legal assistant. Not legal advice.</p>
          </header>
          <main>{children}</main>
          <footer className="footer">
            <span>? {new Date().getFullYear()} Legal Assistant (Educational Use Only)</span>
          </footer>
        </div>
      </body>
    </html>
  );
}

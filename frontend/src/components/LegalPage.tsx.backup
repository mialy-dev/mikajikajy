
import React from "react";

export interface LegalPageProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function LegalPage({
  title,
  subtitle,
  children,
}: LegalPageProps) {
  return (
    <main className="legal-page">
      <div className="legal-page__container">
        <header className="legal-page__header">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </header>

        <section className="legal-page__content">
          {children}
        </section>
      </div>
    </main>
  );
}

export default LegalPage;

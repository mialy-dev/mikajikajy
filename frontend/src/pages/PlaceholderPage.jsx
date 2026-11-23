import { Link } from "react-router-dom";

export default function PlaceholderPage({ title }) {
  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#18304F]">{title}</h1>
        <p className="mt-4 text-[#64748B]">Page à brancher sur ta vraie page E-KAJY.</p>
        <Link to="/" className="mt-8 inline-block rounded-xl bg-[#DC2626] px-6 py-3 font-semibold text-white hover:bg-[#b91c1c]">
          Retour à l'accueil
        </Link>
      </main>
    </>
  );
}

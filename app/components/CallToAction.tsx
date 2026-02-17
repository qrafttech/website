import SectionTitle from "./SectionTitle";

export default function CallToAction() {
  return (
    <div className="flex flex-col items-center gap-8 py-20 text-center">
      <SectionTitle className="from-white to-white/70">
        On en discute ?
      </SectionTitle>
      <p className="max-w-lg text-lg text-white/80">
        Reservez un creneau de 30 minutes pour parler de votre projet.
      </p>
      <a
        href="https://cal.com/nicolasrouanne/30min"
        target="_blank"
        rel="noreferrer"
      >
        <button
          type="button"
          className="rounded-2xl border border-white bg-transparent px-8 py-3 font-medium text-white hover:bg-white/20"
        >
          Prendre rendez-vous
        </button>
      </a>
    </div>
  );
}

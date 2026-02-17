import clsx from "clsx";

type ContactUsProps = Partial<Pick<HTMLDivElement, "className">>;

export default function ContactUs({ className }: ContactUsProps) {
  return (
    <a
      href="https://cal.com/nicolasrouanne/30min"
      target="_blank"
      rel="noreferrer"
    >
      <button
        type="button"
        className={clsx(
          "rounded-2xl border border-white bg-transparent font-medium text-white hover:bg-white/20",
          className
        )}
      >
        Nous contacter
      </button>
    </a>
  );
}

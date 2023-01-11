import clsx from "clsx";

type ContactUsProps = Partial<Pick<HTMLDivElement, "className">>;

export default function ContactUs({ className }: ContactUsProps) {
  return (
    <button
      type="button"
      className={clsx(
        "rounded-2xl border border-white bg-transparent font-medium text-white hover:bg-white/20",
        className
      )}
    >
      Nous contacter
    </button>
  );
}

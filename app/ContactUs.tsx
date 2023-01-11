import clsx from "clsx";

type ContactUsProps = Partial<Pick<HTMLDivElement, "className">>;

export default function ContactUs({ className }: ContactUsProps) {
  const email = "hello@qraft.tech";
  const subject = "Hello Qraft - Un petit mail après être allé sur votre site";

  return (
    <a href={`mailto:${email}?subject=${subject}`}>
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

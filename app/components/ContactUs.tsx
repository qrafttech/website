import clsx from "clsx";

interface ContactUsProps {
  className?: string;
  variant?: "dark" | "light";
}

export default function ContactUs({
  className,
  variant = "dark",
}: ContactUsProps) {
  const isLight = variant === "light";

  return (
    <a
      href="https://cal.com/nicolasrouanne/30min"
      target="_blank"
      rel="noreferrer"
    >
      <button
        type="button"
        className={clsx(
          "rounded-2xl border bg-transparent font-medium",
          isLight
            ? "border-black text-black hover:bg-black/10"
            : "border-white text-white hover:bg-white/20",
          className
        )}
      >
        Nous contacter
      </button>
    </a>
  );
}

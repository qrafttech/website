import { ReactNode } from "react";
import clsx from "clsx";

interface SectionTitleProps extends Partial<Pick<HTMLDivElement, "className">> {
  children: ReactNode;
}

export default function SectionTitle({
  children,
  className,
}: SectionTitleProps) {
  return (
    <h2
      className={clsx(
        "bg-gradient-to-r bg-clip-text font-serif text-4xl font-bold text-transparent lg:text-5xl",
        className
      )}
    >
      {children}
    </h2>
  );
}

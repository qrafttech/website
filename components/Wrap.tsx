import { ReactNode } from "react";
import clsx from "clsx";

interface WrapProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

/** The proto's `.wrap`: 1200px max, 24px gutters. */
export default function Wrap({ id, className, children }: WrapProps) {
  return (
    <div id={id} className={clsx("mx-auto max-w-[1200px] px-6", className)}>
      {children}
    </div>
  );
}

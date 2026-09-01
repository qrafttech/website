import { ReactNode } from "react";
import clsx from "clsx";

interface WrapProps {
  className?: string;
  children: ReactNode;
}

export default function Wrap({ className, children }: WrapProps) {
  return (
    <div className={clsx("mx-auto max-w-[75rem] px-6", className)}>
      {children}
    </div>
  );
}

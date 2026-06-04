import { ReactNode } from "react";
import clsx from "clsx";

import { SITE_CONTAINER } from "../lib/site";

type FluidContainerProps = Partial<Pick<HTMLDivElement, "className" | "id">> & {
  children: ReactNode;
};

export default function FluidContainer({
  id,
  className,
  children,
}: FluidContainerProps) {
  return (
    <div id={id} className={clsx("flex justify-center", className)}>
      <div className={clsx("w-full pt-6", SITE_CONTAINER)}>{children}</div>
    </div>
  );
}

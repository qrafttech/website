import { ReactNode } from "react";

interface StackGroupProps {
  title: string;
  children: ReactNode;
}

export default function StackGroup({ title, children }: StackGroupProps) {
  return (
    <div className="flex flex-col pb-8">
      <h4 className="pb-4 font-serif text-sm font-bold uppercase text-violet-300">
        {title}
      </h4>
      <div className="flex space-x-6">{children}</div>
    </div>
  );
}

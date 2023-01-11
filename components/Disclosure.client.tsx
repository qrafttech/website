"use client";

import { ComponentType, ReactNode } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

type ExtractProps<T> = T extends ComponentType<infer P> ? P : T;

interface CustomDisclosureProps extends ExtractProps<typeof Disclosure> {
  title: string;
  content: ReactNode;
}

export default function CustomDisclosure({
  title,
  content,
  ...props
}: CustomDisclosureProps) {
  return (
    <Disclosure {...props}>
      {({ open }) => (
        <div className="mb-6 rounded-md border-[1px] border-black text-zinc-900">
          <Disclosure.Button className="flex w-full justify-between rounded-md px-4 py-2 text-2xl font-bold">
            <span>{title}</span>
            <ChevronUpIcon
              className={`${open ? "" : "rotate-180 transform"} h-8 w-8`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
            {content}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

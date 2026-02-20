import { ReactNode } from "react";

import Menu from "../components/Menu.client";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Menu variant="light" />
      {children}
    </>
  );
}

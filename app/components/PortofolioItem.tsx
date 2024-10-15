import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";

interface PortfolioItemProps {
  image: ReactNode;
  title: string;
  description: ReactNode;
  detailsUrl: string;
  company: { name: string; url: string };
  stack: string;
  integrations: string;
}

export default function PortfolioItem({
  image,
  title,
  description,
  stack,
  detailsUrl,
  company,
  integrations,
}: PortfolioItemProps) {
  return (
    <div>
      <a href={detailsUrl}>
        <div className="pb-4">{image}</div>
        <div className="flex items-center gap-4">
          <h3 className="pb-2 font-serif text-2xl font-bold">{title}</h3>
          <a
            className="flex gap-2 text-sm underline"
            target="_blank"
            rel="noopener noreferrer"
            href={company.url}
          >
            {company.name} <ArrowTopRightOnSquareIcon width={12} />
          </a>
        </div>
      </a>
      <p className="pb-2">{description}</p>
      <ul>
        <li>
          <em>
            <strong>Stack&nbsp;: </strong>
            {stack}
          </em>
        </li>
        <li>
          <em>
            <strong>Intégrations&nbsp;: </strong>
            {integrations}
          </em>
        </li>
      </ul>
    </div>
  );
}

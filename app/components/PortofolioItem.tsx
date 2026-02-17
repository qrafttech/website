import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";

interface PortfolioItemProps {
  image: ReactNode;
  title: string;
  description: ReactNode;
  detailsUrl: string;
  companyUrl: string;
  stack: string;
  integrations?: string;
}

export default function PortfolioItem({
  image,
  title,
  description,
  stack,
  detailsUrl,
  companyUrl,
  integrations,
}: PortfolioItemProps) {
  return (
    <div>
      <a href={detailsUrl}>
        <div className="pb-4">{image}</div>
      </a>
      <div className="flex items-center gap-4">
        <h3 className="pb-2 font-serif text-2xl font-bold">
          <a href={detailsUrl}>{title}</a>
        </h3>
        <a
          className="flex gap-2 text-sm underline"
          target="_blank"
          rel="noopener noreferrer"
          href={companyUrl}
        >
          {companyUrl.replace(/^https?:\/\//, "")}{" "}
          <ArrowTopRightOnSquareIcon width={12} />
        </a>
      </div>
      <p className="pb-2">{description}</p>
      <ul>
        <li>
          <em>
            <strong>Stack&nbsp;: </strong>
            {stack}
          </em>
        </li>
        {integrations && (
          <li>
            <em>
              <strong>Intégrations&nbsp;: </strong>
              {integrations}
            </em>
          </li>
        )}
      </ul>
    </div>
  );
}

import { Link } from 'react-router';

interface BreadcrumbSegment {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
}

export function Breadcrumb({ segments }: BreadcrumbProps) {
  return (
    <nav aria-label="Navegação" className="flex items-center gap-2 text-sm text-zinc-400">
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-2">
          {i < segments.length - 1 ? (
            <>
              {seg.to ? (
                <Link to={seg.to} className="hover:text-white transition-colors">
                  {seg.label}
                </Link>
              ) : (
                <span>{seg.label}</span>
              )}
              <span aria-hidden="true">/</span>
            </>
          ) : (
            <span className="text-white">{seg.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

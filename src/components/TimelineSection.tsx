/**
 * Timeline de experiencia / trayectoria.
 */
export interface TimelineItem {
  year: string;
  title: string;
  subtitle?: string;
  description: string;
}

interface TimelineSectionProps {
  items: TimelineItem[];
}

export default function TimelineSection({ items }: TimelineSectionProps) {
  return (
    <ol className="relative space-y-0 border-l border-red-500/30 pl-0">
      {items.map((item, index) => (
        <li key={`${item.year}-${index}`} className="relative pb-10 pl-8 last:pb-0">
          {/* Punto */}
          <span
            className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-red-400 bg-slate-950"
            aria-hidden="true"
          />
          <time className="text-xs font-medium uppercase tracking-wider text-red-400">
            {item.year}
          </time>
          <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
          {item.subtitle && (
            <p className="text-sm text-rose-300/80">{item.subtitle}</p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-gray-400">
            {item.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
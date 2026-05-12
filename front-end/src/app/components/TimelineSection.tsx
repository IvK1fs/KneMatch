import { Calendar } from 'lucide-react';

interface TimelineItem {
  date: string;
  title: string;
  type: 'movie' | 'series';
  image: string;
}

interface TimelineSectionProps {
  month: string;
  items: TimelineItem[];
}

export function TimelineSection({ month, items }: TimelineSectionProps) {
  const formatDay = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      weekday: 'short'
    });
  };

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-blue-400" />
        <h3 className="text-2xl text-white">{month}</h3>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div 
            key={index}
            className="flex gap-4 p-4 bg-gray-900/50 rounded-lg border border-white/10 hover:border-white/30 hover:bg-gray-900 transition-all cursor-pointer group"
          >
            <div className="flex flex-col items-center justify-center min-w-[70px] bg-blue-600/20 rounded-lg px-3 py-2 border border-blue-600/50">
              <span className="text-sm text-blue-400 uppercase">{formatDay(item.date).split(' ')[0]}</span>
              <span className="text-2xl text-white">{formatDay(item.date).split(' ')[1]}</span>
            </div>

            <div className="w-20 h-28 rounded overflow-hidden flex-shrink-0">
              <img 
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h4 className="text-white text-lg group-hover:text-blue-400 transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-gray-400">
                {item.type === 'movie' ? 'Filme' : 'Série'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

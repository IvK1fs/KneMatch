import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPersonalRecommendations } from '../../services/api';
import { ContentRow } from './ContentRow';

type CardItem = {
  id: number;
  title: string;
  image: string;
  rating: number;
  year: string;
  genre: string;
  type: 'movie' | 'tv';
};

export function RecommendedRow() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CardItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    getPersonalRecommendations().then(data => {
      if (!data.results.length) return;

      const mapped: CardItem[] = data.results.map((item: any) => ({
        id: item.id,
        title: item.title ?? item.name ?? 'Sem título',
        image: item.poster_path
          ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
          : '',
        rating: Math.round(item.vote_average * 10) / 10,
        year: (item.release_date ?? item.first_air_date ?? '').slice(0, 4),
        genre: '',
        type: item.media_type === 'tv' ? 'tv' : 'movie',
      }));

      setItems(mapped);
    });
  }, [isAuthenticated]);

  if (!isAuthenticated || items.length === 0) return null;

  return <ContentRow title="Recomendado Para Você" items={items} />;
}
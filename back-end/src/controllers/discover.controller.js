const { fetchFromTMDB } = require('./base.controller');

async function resolvePersonId(name) {
  if (!name || !name.trim()) return null;
  const data = await fetchFromTMDB(
    `/search/person?query=${encodeURIComponent(name.trim())}&page=1`,
    null
  );
  return data?.results?.[0]?.id ?? null;
}

const discover = async (req, res) => {
  const { q, type, genre, sort_by, year, year_to, page, with_cast, with_crew } = req.query;
  const minRating = req.query['vote_average.gte'];
  const mediaType = type === 'tv' ? 'tv' : 'movie';

  const [castId, crewId] = await Promise.all([
    resolvePersonId(with_cast),
    resolvePersonId(with_crew),
  ]);

  const usesPersonFilter = !!(castId || crewId);

  let url;
  if (q && q.trim() && !usesPersonFilter) {
    const params = new URLSearchParams({ query: q, page: page || '1' });
    url = `/search/${mediaType}?${params.toString()}`;
  } else {
    const dateGteField = mediaType === 'tv' ? 'first_air_date.gte' : 'primary_release_date.gte';
    const dateLteField = mediaType === 'tv' ? 'first_air_date.lte' : 'primary_release_date.lte';

    const params = new URLSearchParams({
      sort_by: sort_by || 'popularity.desc',
      page: page || '1',
    });
    if (genre) params.append('with_genres', genre);
    if (year) params.append(dateGteField, `${year}-01-01`);
    if (year_to) params.append(dateLteField, `${year_to}-12-31`);
    if (minRating && parseFloat(minRating) > 0) params.append('vote_average.gte', minRating);
    if (castId) params.append('with_cast', String(castId));
    if (crewId) params.append('with_crew', String(crewId));
    url = `/discover/${mediaType}?${params.toString()}`;
  }

  const data = await fetchFromTMDB(url, res);
  if (data) res.json(data);
};

module.exports = { discover };

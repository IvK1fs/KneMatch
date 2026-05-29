import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Favorite {
  id: number;
  title: string;
  image: string;
  rating: number;
  type: 'movie' | 'series';
}

interface List {
  id: string;
  name: string;
  description: string;
  items: Favorite[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  favorites: Favorite[];
  lists: List[];
  addFavorite: (item: Favorite) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  createList: (name: string, description: string) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  addToList: (listId: string, item: Favorite) => Promise<void>;
  removeFromList: (listId: string, itemId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [lists, setLists] = useState<List[]>(() => {
    const saved = localStorage.getItem('lists');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('lists', JSON.stringify(lists));
  }, [lists]);

  // Carrega favoritos e listas do banco quando o usuário loga
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/api/users/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        const mapped: Favorite[] = (d.favorites ?? []).map((f: {
          tmdb_id: string; titulo: string; poster_url: string; nota: number; tipo: string;
        }) => ({
          id: Number(f.tmdb_id),
          title: f.titulo,
          image: f.poster_url,
          rating: f.nota,
          type: f.tipo === 'filme' ? 'movie' : 'series',
        }));
        setFavorites(mapped);
      })
      .catch(() => {});

    fetch(`${API_URL}/api/users/lists`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setLists(d.lists ?? []))
      .catch(() => {});
  }, [user]);

  const API_URL = (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_URL ?? '';

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: password }),
    });
    if (!res.ok) throw new Error('Credenciais inválidas');
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setUser({
      id: String(data.usuario.id),
      name: data.usuario.nome,
      email: data.usuario.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.usuario.nome)}&size=200&background=e50914&color=fff`,
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: name, email, senha: password }),
    });
    if (!res.ok) throw new Error('Erro ao criar conta');
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setUser({
      id: String(data.usuario.id),
      name: data.usuario.nome,
      email: data.usuario.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.usuario.nome)}&size=200&background=e50914&color=fff`,
    });
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // silently ignore logout errors
      }
    }
    localStorage.removeItem('token');
    setUser(null);
    setFavorites([]);
    setLists([]);
  };

  // RF — Favoritos conectados ao backend
  const addFavorite = async (item: Favorite) => {
    if (favorites.find(f => f.id === item.id)) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/users/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        tmdb_id: String(item.id),
        tipo: item.type === 'movie' ? 'filme' : 'serie',
        titulo: item.title,
        poster_url: item.image,
        nota: item.rating,
      }),
    });
    setFavorites(prev => [...prev, item]);
  };

  const removeFavorite = async (id: number) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/users/favorites/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  // RF — Listas conectadas ao backend
  const createList = async (name: string, description: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/users/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome: name, descricao: description }),
    });
    const data = await res.json();
    const newList: List = {
      id: String(data.id ?? Date.now()),
      name,
      description,
      items: [],
    };
    setLists(prev => [...prev, newList]);
  };

  const deleteList = async (listId: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/users/lists/${listId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setLists(prev => prev.filter(l => l.id !== listId));
  };

  const addToList = async (listId: string, item: Favorite) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/users/lists/${listId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        tmdb_id: String(item.id),
        tipo: item.type === 'movie' ? 'filme' : 'serie',
        titulo: item.title,
        poster_url: item.image,
        nota: item.rating,
      }),
    });
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        if (list.items.find(i => i.id === item.id)) return list;
        return { ...list, items: [...list.items, item] };
      }
      return list;
    }));
  };

  const removeFromList = async (listId: string, itemId: number) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/users/lists/${listId}/items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        return { ...list, items: list.items.filter(i => i.id !== itemId) };
      }
      return list;
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        favorites,
        lists,
        addFavorite,
        removeFavorite,
        createList,
        deleteList,
        addToList,
        removeFromList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

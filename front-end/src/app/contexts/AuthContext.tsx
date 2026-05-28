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
  addFavorite: (item: Favorite) => void;
  removeFavorite: (id: number) => void;
  createList: (name: string, description: string) => void;
  deleteList: (listId: string) => void;
  addToList: (listId: string, item: Favorite) => void;
  removeFromList: (listId: string, itemId: number) => void;
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

  const addFavorite = (item: Favorite) => {
    setFavorites(prev => {
      if (prev.find(f => f.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const createList = (name: string, description: string) => {
    const newList: List = {
      id: Date.now().toString(),
      name,
      description,
      items: []
    };
    setLists(prev => [...prev, newList]);
  };

  const deleteList = (listId: string) => {
    setLists(prev => prev.filter(l => l.id !== listId));
  };

  const addToList = (listId: string, item: Favorite) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        if (list.items.find(i => i.id === item.id)) {
          return list;
        }
        return {
          ...list,
          items: [...list.items, item]
        };
      }
      return list;
    }));
  };

  const removeFromList = (listId: string, itemId: number) => {
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

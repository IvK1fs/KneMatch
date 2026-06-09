import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
  LogOut, Moon, Sun, Star, List, Plus, X, Heart,
  Film, Tv, Settings, ChevronRight, Trash2,
  ArrowLeft, GripVertical, FolderOpen, Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { motion } from 'motion/react';

type Tab = 'favorites' | 'lists' | 'settings';

interface Favorite {
  id: number;
  title: string;
  image: string;
  rating: number;
  type: 'movie' | 'series';
}

function PosterGrid({ images }: { images: string[] }) {
  const slots = [...images, ...Array(4).fill('')].slice(0, 4);
  return (
    <div className="grid grid-cols-2 gap-0.5 w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
      {slots.map((src, i) => (
        <div key={i} className="bg-white/5 overflow-hidden">
          {src ? (
            <img src={src} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <Film className="w-3 h-3 text-white/20" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TypeBadge({ type }: { type: 'movie' | 'series' }) {
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide ${
      type === 'movie' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
    }`}>
      {type === 'movie' ? 'Filme' : 'Série'}
    </span>
  );
}

export function ProfilePage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, favorites, lists, removeFavorite, createList, deleteList, removeFromList } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<Tab>('favorites');
  const [profileParams] = useSearchParams();

  useEffect(() => {
    const tab = profileParams.get('tab') as Tab | null;
    if (tab && ['favorites', 'lists', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [openListId, setOpenListId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series'>('all');

  // drag-and-drop state
  const [listItems, setListItems] = useState<Record<string, Favorite[]>>({});
  const dragIndex = useRef<number | null>(null);

  // sincroniza listItems com o contexto quando a lista abre
  useEffect(() => {
    if (!openListId) return;
    const found = lists.find(l => l.id === openListId);
    if (found) setListItems(prev => ({ ...prev, [openListId]: [...found.items] }));
  }, [openListId, lists]);

  function handleDragStart(idx: number) {
    dragIndex.current = idx;
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === idx || !openListId) return;
    setListItems(prev => {
      const items = [...(prev[openListId] ?? [])];
      const [moved] = items.splice(dragIndex.current!, 1);
      items.splice(idx, 0, moved);
      dragIndex.current = idx;
      return { ...prev, [openListId]: items };
    });
  }

  function handleDragEnd() {
    dragIndex.current = null;
  }

  function navigateToDetails(item: Favorite) {
    const type = item.type === 'movie' ? 'movie' : 'tv';
    window.location.href = `/details/${item.id}?type=${type}`;
  }

  const demoUser = user ?? {
    id: 'demo',
    name: 'Usuário Demo',
    email: 'demo@cinematch.com',
    avatar: 'https://ui-avatars.com/api/?name=Usuario+Demo&size=200&background=e50914&color=fff',
  };

  const handleLogout = () => {
    if (user) logout();
    navigate('/');
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName, newListDesc);
      setNewListName('');
      setNewListDesc('');
      setIsCreateListOpen(false);
    }
  };

  const filteredFavorites = filterType === 'all'
    ? favorites
    : favorites.filter(f => f.type === filterType);

  const openList = lists.find(l => l.id === openListId);
  const currentItems = openListId ? (listItems[openListId] ?? openList?.items ?? []) : [];

  const movieCount = favorites.filter(f => f.type === 'movie').length;
  const seriesCount = favorites.filter(f => f.type === 'series').length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'favorites', label: 'Favoritos', icon: <Heart className="w-4 h-4" /> },
    { id: 'lists', label: 'Minhas Listas', icon: <List className="w-4 h-4" /> },
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16">
      {/* Hero Banner */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-[#1a0a1a] via-[#0f0f2a] to-[#0a1a1a] overflow-hidden">
          <div className="absolute inset-0 flex gap-1 opacity-15 overflow-hidden">
            {favorites.map((f, i) => (
              <div key={i} className="flex-shrink-0 w-16 h-full">
                <img src={f.image} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/60 to-[#0a0a0f]" />
        </div>

        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative -mt-16 pb-6 flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-[#0a0a0f] shadow-2xl">
                <img src={demoUser.avatar} alt={demoUser.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full ring-2 ring-[#0a0a0f]" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white">{demoUser.name}</h1>
              <p className="text-white/50 text-sm">{demoUser.email}</p>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-semibold">{favorites.length}</span>
                  <span className="text-white/40 text-sm">favoritos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-semibold">{lists.length}</span>
                  <span className="text-white/40 text-sm">listas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-white/40 text-sm">{movieCount} filmes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-white/40 text-sm">{seriesCount} séries</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex gap-1 border-b border-white/10 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e50914] rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab: Favoritos */}
        {activeTab === 'favorites' && (
          <div className="pb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {filteredFavorites.length} {filteredFavorites.length === 1 ? 'favorito' : 'favoritos'}
              </h2>
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                {(['all', 'movie', 'series'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterType(f)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      filterType === f ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {f === 'all' ? 'Tudo' : f === 'movie' ? 'Filmes' : 'Séries'}
                  </button>
                ))}
              </div>
            </div>

            {filteredFavorites.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <p className="text-white/30">Nenhum favorito ainda</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {filteredFavorites.map(item => (
                  <div key={item.id} className="group relative">
                    <div
                      className="relative rounded-xl overflow-hidden aspect-[2/3] bg-white/5 cursor-pointer"
                      onClick={() => navigateToDetails(item)}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFavorite(item.id); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                          title="Remover dos favoritos"
                        >
                          <X className="w-3.5 h-3.5 text-white" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 p-2.5">
                          <TypeBadge type={item.type} />
                          <h3 className="text-white font-medium text-xs mt-1 line-clamp-2">{item.title}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                            <span className="text-yellow-400 text-xs font-semibold">
                              {item.rating != null ? item.rating.toFixed(1) : '—'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`absolute top-2 left-2 w-2 h-2 rounded-full opacity-80 ${
                      item.type === 'movie' ? 'bg-blue-400' : 'bg-purple-400'
                    }`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Minhas Listas */}
        {activeTab === 'lists' && (
          <div className="pb-16">
            <div>
              {openList ? (
                <motion.div
                  key="list-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setOpenListId(null)}
                      className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Voltar
                    </button>
                    <span className="text-white/20">/</span>
                    <span className="text-white font-semibold">{openList.name}</span>
                  </div>

                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">{openList.name}</h2>
                      {openList.description && (
                        <p className="text-white/40 text-sm mt-1">{openList.description}</p>
                      )}
                      <p className="text-white/30 text-sm mt-2">{currentItems.length} itens</p>
                    </div>
                    <button
                      onClick={() => { deleteList(openList.id); setOpenListId(null); }}
                      className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Excluir lista
                    </button>
                  </div>

                  {currentItems.length === 0 ? (
                    <div className="text-center py-20">
                      <FolderOpen className="w-16 h-16 text-white/10 mx-auto mb-4" />
                      <p className="text-white/30 text-sm">Lista vazia</p>
                      <p className="text-white/20 text-xs mt-1">Adicione filmes e séries à esta lista</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentItems.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          draggable
                          onDragStart={() => handleDragStart(idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDragEnd={handleDragEnd}
                          className="group flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 hover:border-white/10 transition-all"
                        >
                          <span className="text-white/20 text-sm font-mono w-5 text-center flex-shrink-0">{idx + 1}</span>
                          <GripVertical className="w-4 h-4 text-white/30 flex-shrink-0 cursor-grab active:cursor-grabbing" />
                          {/* poster clicável */}
                          <div
                            className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                            onClick={() => navigateToDetails(item)}
                            title="Ver detalhes"
                          >
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                          </div>
                          {/* info clicável */}
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => navigateToDetails(item)}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <TypeBadge type={item.type} />
                            </div>
                            <h3 className="text-white font-medium text-sm line-clamp-1 group-hover:text-white/80 transition-colors">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                              <span className="text-yellow-400 text-xs">
                                {item.rating != null ? item.rating.toFixed(1) : '—'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromList(openList.id, item.id)}
                            className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all flex-shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="lists-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">{lists.length} {lists.length === 1 ? 'lista' : 'listas'}</h2>
                    <Dialog open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2 bg-[#e50914] hover:bg-[#c40812] text-white border-0">
                          <Plus className="w-4 h-4" />
                          Nova Lista
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-[#111118] border-white/10 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-white">Criar nova lista</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <Label htmlFor="list-name" className="text-white/70">Nome da lista</Label>
                            <Input
                              id="list-name"
                              placeholder="Ex: Filmes de Ação Favoritos"
                              value={newListName}
                              onChange={e => setNewListName(e.target.value)}
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#e50914]/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="list-description" className="text-white/70">Descrição (opcional)</Label>
                            <Textarea
                              id="list-description"
                              placeholder="Descreva sua lista..."
                              value={newListDesc}
                              onChange={e => setNewListDesc(e.target.value)}
                              rows={3}
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#e50914]/50 resize-none"
                            />
                          </div>
                          <Button
                            onClick={handleCreateList}
                            disabled={!newListName.trim()}
                            className="w-full bg-[#e50914] hover:bg-[#c40812] text-white border-0"
                          >
                            Criar lista
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {lists.length === 0 ? (
                    <div className="text-center py-20">
                      <List className="w-16 h-16 text-white/10 mx-auto mb-4" />
                      <p className="text-white/30 mb-4">Nenhuma lista criada</p>
                      <Button
                        onClick={() => setIsCreateListOpen(true)}
                        className="gap-2 bg-[#e50914] hover:bg-[#c40812] text-white border-0"
                      >
                        <Plus className="w-4 h-4" />
                        Criar primeira lista
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {lists.map((list, idx) => (
                        <motion.button
                          key={list.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.07 }}
                          onClick={() => setOpenListId(list.id)}
                          className="group flex items-center gap-4 p-4 rounded-2xl bg-white/3 hover:bg-white/6 border border-white/5 hover:border-white/15 transition-all text-left w-full"
                        >
                          <PosterGrid images={list.items.map(i => i.image)} />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-base line-clamp-1 group-hover:text-white transition-colors">
                              {list.name}
                            </h3>
                            {list.description && (
                              <p className="text-white/40 text-sm line-clamp-2 mt-1">{list.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-3">
                              <div className="flex items-center gap-1.5">
                                <Film className="w-3.5 h-3.5 text-blue-400" />
                                <span className="text-white/40 text-xs">
                                  {list.items.filter(i => i.type === 'movie').length} filmes
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Tv className="w-3.5 h-3.5 text-purple-400" />
                                <span className="text-white/40 text-xs">
                                  {list.items.filter(i => i.type === 'series').length} séries
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 flex-shrink-0 transition-colors" />
                        </motion.button>
                      ))}

                      <button
                        onClick={() => setIsCreateListOpen(true)}
                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-dashed border-white/10 hover:border-[#e50914]/40 hover:bg-[#e50914]/5 transition-all text-white/30 hover:text-white/60"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-sm">Nova lista</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Configurações */}
        {activeTab === 'settings' && (
          <div className="pb-16 max-w-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/3 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-white/60" /> : <Sun className="w-4 h-4 text-yellow-400" />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Tema</p>
                    <p className="text-white/40 text-xs">{theme === 'dark' ? 'Modo escuro' : 'Modo claro'}</p>
                  </div>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
              </div>

              <div className="p-4 rounded-2xl bg-white/3 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white/60" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Idioma</p>
                    <p className="text-white/40 text-xs">Selecione o idioma da interface</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['pt', 'en'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => i18n.changeLanguage(lang)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        i18n.language === lang
                          ? 'bg-[#e50914] border-[#e50914] text-white'
                          : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {lang === 'pt' ? '🇧🇷 Português' : '🇺🇸 English'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/3 border border-white/5">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-medium">Conta</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Nome</span>
                    <span className="text-white text-sm font-medium">{demoUser.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">E-mail</span>
                    <span className="text-white text-sm">{demoUser.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Membro desde</span>
                    <span className="text-white text-sm">{new Date().getFullYear()}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/15">
                <p className="text-red-400/70 text-xs uppercase tracking-widest mb-3 font-medium">Zona de perigo</p>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 h-10"
                >
                  <LogOut className="w-4 h-4" />
                  Encerrar sessão
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
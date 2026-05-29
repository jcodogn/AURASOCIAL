import React, { useState } from "react";
import { Post } from "../types";
import { Search, Sparkles, TrendingUp, Compass, Grid, Laptop, Flame, Award } from "lucide-react";

interface ExploreProps {
  posts: Post[];
  onSelectHashtag: (tag: string) => void;
}

export default function Explore({ posts, onSelectHashtag }: ExploreProps) {
  const [query, setQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    return (
      post.caption.toLowerCase().includes(query.toLowerCase()) ||
      post.username.toLowerCase().includes(query.toLowerCase()) ||
      post.hashtags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );
  });

  const popularTrends = [
    { tag: "minimalismo", count: "142 mil posts", icon: Compass },
    { tag: "webgl", count: "89 mil posts", icon: Laptop },
    { tag: "coding", count: "215 mil posts", icon: Flame },
    { tag: "design", count: "432 mil posts", icon: Award }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 text-left font-sans" id="explore-component">
      {/* Search Input elements */}
      <div className="relative bg-white dark:bg-zinc-950 p-4 border border-zinc-100 dark:border-zinc-900 rounded-3xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Pesquisar usuários, hashtags virais ou temas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 bg-zinc-50 dark:bg-zinc-90 w-full rounded-2xl pl-12 pr-4 text-xs font-semibold border border-zinc-200/60 dark:border-zinc-800 focus:border-violet-500 outline-none transition"
            id="input-search-explore"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 block layouts: search results or visual feed grids */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block">Resultados em Destaque</span>
            {query && (
              <span className="text-xs text-zinc-550 dark:text-zinc-400 font-medium">
                Encontrados {filteredPosts.length} itens correspondentes
              </span>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl p-6">
              <Search className="w-10 h-10 text-zinc-400 mx-auto mb-2 stroke-1" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">Nenhuma correspondência</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Tente usar outros termos como "design" ou "TS".</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 group border border-zinc-805 cursor-pointer"
                  onClick={() => onSelectHashtag(post.hashtags[0] || "")}
                  title="Clique para filtrar hashtag correspondente!"
                >
                  <img
                    src={post.media[0]}
                    alt={post.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Subtle info label on hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end text-white text-left">
                    <span className="text-[10px] font-bold">@{post.username}</span>
                    <span className="text-[9px] text-zinc-300 truncate mt-0.5">{post.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 layout side block: trending hashtags widgets */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <TrendingUp className="w-4 h-4 text-violet-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Assuntos do Momento</span>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl divide-y divide-zinc-50 dark:divide-zinc-900 overflow-hidden shadow-sm">
            {popularTrends.map((trend) => {
              const IconTag = trend.icon;
              return (
                <button
                  key={trend.tag}
                  onClick={() => {
                    setQuery(trend.tag);
                    onSelectHashtag(trend.tag);
                  }}
                  className="w-full p-4 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors text-left"
                  id={`btn-trend-${trend.tag}`}
                >
                  <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-850">
                    <IconTag className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-zinc-900 dark:text-white block font-mono">
                      #{trend.tag}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-semibold mt-0.5 block">
                      {trend.count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Prompt card promotion */}
          <div className="bg-gradient-to-tr from-violet-650/10 via-violet-950/20 to-zinc-950 border border-violet-500/10 p-5 rounded-3xl relative overflow-hidden">
            <div className="relative z-10 space-y-1.5">
              <span className="text-[9px] uppercase tracking-wider bg-violet-600/25 border border-violet-500/20 px-2 py-0.5 rounded text-violet-300 font-bold font-mono inline-block">
                Aura Ads
              </span>
              <h5 className="text-xs font-bold text-white">Anuncie seu Preset Cyberpunk</h5>
              <p className="text-[10.5px] text-zinc-400 leading-snug">
                Patrocine tags virais e apareça no topo das buscas inteligentes por apenas R$ 5,00 diários.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

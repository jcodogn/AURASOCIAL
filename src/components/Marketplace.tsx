import React, { useState } from "react";
import { MarketItem, User } from "../types";
import { ShoppingBag, Coins, Trash2, CheckCircle2, Ticket } from "lucide-react";
import { MARKET_ITEMS } from "../data";

interface MarketplaceProps {
  currentUser: User;
  onBuyItem: (price: number, itemName: string, seller: string) => void;
  onAddMarketItem: (item: MarketItem) => void;
}

export default function Marketplace({ currentUser, onBuyItem, onAddMarketItem }: MarketplaceProps) {
  const [items, setItems] = useState<MarketItem[]>(MARKET_ITEMS);
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);
  
  // Custom creator shop submission states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleBuy = (item: MarketItem) => {
    if (currentUser.walletBalance < item.price) {
      alert(`⚠️ Saldo de carteira insuficiente! Seu saldo atual é R$ ${currentUser.walletBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`);
      return;
    }

    onBuyItem(item.price, item.title, item.sellerUsername);
    setPurchaseStatus(`🎉 Compra concluída! "${item.title}" foi enviado para o seu e-mail registrado.`);
    setTimeout(() => {
      setPurchaseStatus(null);
    }, 4000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    if (!title.trim() || isNaN(parsedPrice) || parsedPrice <= 0) return;

    const newItem: MarketItem = {
      id: Math.random().toString(),
      title,
      price: parsedPrice,
      description,
      image: image || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=300&h=200&q=80",
      sellerUsername: currentUser.username,
      createdAt: new Date().toLocaleDateString()
    };

    onAddMarketItem(newItem);
    setItems([newItem, ...items]);
    
    // clean form
    setTitle("");
    setPrice("");
    setDescription("");
    setImage("");
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 text-left font-sans" id="marketplace-component">
      {/* Head banner */}
      <div className="p-6 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-550 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-violet-200 font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-violet-200 shrink-0" />
            Marketplace Integrado
          </span>
          <h2 className="text-xl font-black">Shopping dos Criadores de Elite</h2>
          <p className="text-xs text-zinc-100 max-w-sm">
            Adquira recursos digitais premium, presets de Lightroom, presets de figma ou agende mentorias com influenciadores.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="py-2.5 px-4 bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold rounded-xl transition whitespace-nowrap self-start md:self-center cursor-pointer shadow-lg"
          id="btn-add-product-toggle"
        >
          {isAdding ? "Fechar Cadastro" : "Criar Meu Produto"}
        </button>
      </div>

      {purchaseStatus && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs rounded-2xl text-center flex items-center justify-center gap-2 animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{purchaseStatus}</span>
        </div>
      )}

      {/* Adding item form */}
      {isAdding && (
        <form
          onSubmit={handleCreateProduct}
          className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4 text-left"
          id="add-product-form"
        >
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-mono">Cadastrar Recurso Digital</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Título do Produto</label>
              <input
                type="text"
                placeholder="Ex: Lightroom Pro Preset Cyberpunk"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-805 outline-none required"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Preço Cobrado (R$)</label>
              <input
                type="number"
                placeholder="Ex: 49.90"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-805 outline-none required"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">URL da Imagem do Anúncio</label>
              <input
                type="text"
                placeholder="Cole link do Unsplash..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-805 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Pequena descrição</label>
              <input
                type="text"
                placeholder="Explique o que seu produto premium desbloqueia"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-805 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl"
            id="btn-submit-created-product"
          >
            Cadastrar no Shopping Aura
          </button>
        </form>
      )}

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            id={`market-card-${item.id}`}
          >
            <div className="space-y-4">
              {/* Product Cover view */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden relative bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 bg-zinc-950/85 backdrop-blur px-3 py-1 text-xs font-mono font-bold text-white rounded-lg border border-white/10">
                  R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* info */}
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-violet-500 font-mono block">
                  Vendedor: @{item.sellerUsername}
                </span>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1 leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            {/* CTA action purchases button */}
            <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-90s flex items-center justify-between gap-4">
              <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-violet-400" />
                Entrega por Email
              </span>
              <button
                type="button"
                onClick={() => handleBuy(item)}
                className="py-2 px-4 bg-violet-605/10 hover:bg-violet-600 text-violet-600 dark:text-violet-400 dark:hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                id={`btn-buy-market-${item.id}`}
              >
                Comprar Produto
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { User, Post } from "../types";
import { 
  Grid, Bookmark, Coins, BadgeCheck, FileText, Globe, LogOut, ArrowRight, Wallet, Check, 
  Settings, Shield, Camera, ArrowUpRight, HelpCircle, Sparkles, Trash2, ExternalLink, 
  Lock, AlertCircle, RefreshCw, CheckCircle2, PiggyBank, CreditCard
} from "lucide-react";

interface ProfileProps {
  user: User;
  onLogout: () => void;
  savedPosts: Post[];
  userPosts: Post[];
  onUpdateBio: (bio: string, website: string, displayName: string) => void;
  onAddFunds: (amount: number) => void;
  onBuyVerification: () => void;
  onUpdateAvatar: (avatarBase64: string) => void;
  onWithdrawFunds: (amount: number, bankAccount: string, stripeAccountId?: string) => Promise<any>;
  onConnectStripeAccount?: () => Promise<any>;
  onDisconnectStripeAccount?: () => void;
}

export default function Profile({
  user,
  onLogout,
  savedPosts,
  userPosts,
  onUpdateBio,
  onAddFunds,
  onBuyVerification,
  onUpdateAvatar,
  onWithdrawFunds,
  onConnectStripeAccount,
  onDisconnectStripeAccount
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(user.bio);
  const [editWebsite, setEditWebsite] = useState(user.website);
  const [editDisplayName, setEditDisplayName] = useState(user.displayName);
  const [fundsAmount, setFundsAmount] = useState("50.00");
  const [fundsSuccess, setFundsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  // Stripe withdrawal state managers
  const [walletMode, setWalletMode] = useState<"deposit" | "withdraw">("deposit");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDestination, setWithdrawDestination] = useState("");
  const [stripeAccountId, setStripeAccountId] = useState(user.stripeAccountId || "");
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user.stripeAccountId) {
      setStripeAccountId(user.stripeAccountId);
    }
  }, [user.stripeAccountId]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBio(editBio, editWebsite, editDisplayName);
    setIsEditing(false);
  };

  const handleDepositFunds = () => {
    const floatAmount = parseFloat(fundsAmount);
    if (isNaN(floatAmount) || floatAmount <= 0) return;

    onAddFunds(floatAmount);
    setFundsSuccess(true);
    setTimeout(() => {
      setFundsSuccess(false);
    }, 2500);
  };

  const handleExecuteWithdrawal = async () => {
    const floatAmount = parseFloat(withdrawAmount);
    if (isNaN(floatAmount) || floatAmount <= 0) {
      alert("⚠️ Digite um valor válido para sacar.");
      return;
    }
    if (floatAmount > user.walletBalance) {
      alert(`⚠️ Saldo insuficiente! Seu saldo é de R$ ${user.walletBalance.toFixed(2)}.`);
      return;
    }
    if (!withdrawDestination.trim()) {
      alert("⚠️ Informe a Chave PIX ou dados bancários para o depósito.");
      return;
    }

    setIsProcessing(true);
    try {
      const data = await onWithdrawFunds(floatAmount, withdrawDestination, stripeAccountId || undefined);
      if (data) {
        setWithdrawSuccess(`✅ Saque de R$ ${floatAmount.toFixed(2)} processado! ${data.message || ""}`);
        setWithdrawAmount("");
        setWithdrawDestination("");
        setTimeout(() => {
          setWithdrawSuccess(null);
        }, 6000);
      }
    } catch (err) {
      alert("⚠️ Falha ao processar saque.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onUpdateAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24" id="profile-component">
      {/* Top Banner and Header Grid */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-6 shadow-sm text-left">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Circular avatar box outline with verified indicator ring with clickable camera hover */}
          <div className="relative shrink-0 group">
            <label htmlFor="avatar-file-input" className="cursor-pointer block relative">
              <div className="p-1 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 hover:scale-105 transition-transform duration-200">
                <div className="p-1 bg-white dark:bg-zinc-950 rounded-full relative overflow-hidden">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  {/* Photo Edit Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white font-bold select-none">
                    <Camera className="w-5 h-5 mb-1 text-white animate-pulse" />
                    <span>Upload Foto</span>
                  </div>
                </div>
              </div>
              <input
                type="file"
                id="avatar-file-input"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
            {user.isVerified && (
              <span className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white dark:border-zinc-950 pointer-events-none" title="Verificado Oficial">
                <BadgeCheck className="w-5 h-5 fill-white/20" />
              </span>
            )}
          </div>

          {/* User info, name badges, bio stats */}
          <div className="flex-1 w-full text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center justify-center md:justify-start gap-1">
                {user.displayName}
              </h2>
              <span className="text-zinc-400 text-xs font-mono font-bold py-1 px-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg max-w-max mx-auto md:mx-0">
                @{user.username}
              </span>

              {user.isCreator && (
                <span className="text-[10px] text-violet-500 font-extrabold uppercase bg-violet-600/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full inline-block max-w-max mx-auto md:mx-0 tracking-wider">
                  Criador de Elite
                </span>
              )}
            </div>

            {/* Followers numbers row view and grid */}
            <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
              <div>
                <span className="font-extrabold text-zinc-900 dark:text-white">{(userPosts.length + 2).toLocaleString()}</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium ml-1">publicações</span>
              </div>
              <div>
                <span className="font-extrabold text-zinc-900 dark:text-white">{user.followersCount.toLocaleString()}</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium ml-1">seguidores</span>
              </div>
              <div>
                <span className="font-extrabold text-zinc-900 dark:text-white">{user.followingCount.toLocaleString()}</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium ml-1">seguindo</span>
              </div>
            </div>

            {/* User description Bio, and Link website */}
            <div className="space-y-1.5 text-zinc-700 dark:text-zinc-300">
              <p className="text-xs leading-relaxed max-w-xl font-medium">
                {user.bio || "Escreva uma bio incrível para o seu perfil Aura!"}
              </p>
              {user.website && (
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-violet-500 inline-flex items-center gap-1 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {user.website}
                </a>
              )}
            </div>

            {/* Action controls button menu strip */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="py-2 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 transition"
                id="btn-edit-profile-toggle"
              >
                {isEditing ? "Cancelar Mudanças" : "Editar Meu Perfil"}
              </button>

              <button
                onClick={onLogout}
                className="py-2 px-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                id="btn-logout-profile"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair da Conta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Inline Panel Form */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800 p-6 rounded-3xl space-y-4 text-left"
          id="profile-edit-form"
        >
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-mono">Atualizar Dados Cadastrais</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Nome de Exibição</label>
              <input
                type="text"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 outline-none focus:border-violet-500"
                required
                id="edit-profile-displayname"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Link do Website</label>
              <input
                type="text"
                value={editWebsite}
                onChange={(e) => setEditWebsite(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 outline-none focus:border-violet-500"
                placeholder="aura.social/seu_link"
                id="edit-profile-website"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Minha Biografia</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 outline-none focus:border-violet-500 min-h-[80px]"
              required
              id="edit-profile-bio"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl"
            id="btn-save-profile-changes"
          >
            Salvar Dados
          </button>
        </form>
      )}

      {/* High-quality Monetization: Creative Wallet Balance and Verification Badge Shop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* Wallet Display card */}
        <div className="bg-gradient-to-tr from-violet-950/60 to-zinc-950 border border-violet-500/20 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          {/* Radial ambient background highlight */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-3xl pointer-events-none" />

          <div>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] text-violet-400 font-mono uppercase tracking-widest font-extrabold flex items-center gap-1">
                  <Wallet className="w-3 h-3 shrink-0" />
                  Carteira Aura Digital / Stripe
                </span>
                <h3 className="text-2xl font-black text-white font-mono">
                  R$ {user.walletBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="flex bg-zinc-900/80 p-0.5 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setWalletMode("deposit")}
                  className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${
                    walletMode === "deposit" ? "bg-violet-600 text-white" : "text-zinc-400"
                  }`}
                >
                  Depositar
                </button>
                <button
                  type="button"
                  onClick={() => setWalletMode("withdraw")}
                  className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${
                    walletMode === "withdraw" ? "bg-violet-600 text-white" : "text-zinc-400"
                  }`}
                >
                  Sacar
                </button>
              </div>
            </div>

            {walletMode === "deposit" ? (
              <p className="text-[10px] text-zinc-400 leading-normal mt-3">
                Adicione fundos instantâneos via infraestrutura Stripe Checkout ou PIX para monetizar e impulsionar perfis.
              </p>
            ) : (
              <p className="text-[10px] text-zinc-400 leading-normal mt-3">
                Solicite saques diretos do seu saldo de criador para sua conta bancária via gateway Stripe Connect de pagamento.
              </p>
            )}
          </div>

          <div className="mt-5 border-t border-zinc-800/80 pt-4">
            {withdrawSuccess && (
              <div className="text-center py-2 px-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-400 font-bold text-[10px] whitespace-normal leading-normal">
                {withdrawSuccess}
              </div>
            )}

            {!withdrawSuccess && walletMode === "deposit" && (
              fundsSuccess ? (
                <div className="text-center py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center gap-1">
                  <Check className="w-4 h-4 shrink-0" />
                  Depósito Enviado!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-black/60 p-1.5 rounded-xl border border-zinc-850 max-w-[110px]">
                    <span className="text-zinc-500 font-mono text-[9px] ml-1">R$</span>
                    <input
                      type="number"
                      value={fundsAmount}
                      onChange={(e) => setFundsAmount(e.target.value)}
                      className="w-14 bg-transparent text-xs font-bold text-white outline-none font-mono"
                      step="20"
                      id="input-funds-add"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleDepositFunds}
                    className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition hover:brightness-110 active:scale-[0.98]"
                    id="btn-deposit-wallet"
                  >
                    Depositar Stripe
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            )}

            {!withdrawSuccess && walletMode === "withdraw" && (
              <div className="space-y-3">
                {!user.stripeAccountId ? (
                  <div className="space-y-4">
                    {/* Visual Step Stepper */}
                    <div className="bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-850">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-black uppercase tracking-wider font-mono text-zinc-400">Progresso de Configuração</span>
                        <span className="text-[9px] font-mono font-bold text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full animate-pulse">Aguardando Conect</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1.5 relative">
                        {/* Step 1 */}
                        <div className="flex flex-col text-left space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-violet-600 text-white rounded-full flex items-center justify-center text-[9px] font-black font-mono shrink-0">1</span>
                            <span className="text-[9px] font-black text-zinc-200">Criar Link</span>
                          </div>
                          <span className="text-[8px] text-zinc-400 leading-normal">Solicitar cadastro seguro Express.</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col text-left space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center text-[9px] font-black font-mono shrink-0">2</span>
                            <span className="text-[9px] font-black text-zinc-300">Onboarding</span>
                          </div>
                          <span className="text-[8px] text-zinc-500 leading-normal">Dados bancários e fiscais na Stripe.</span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col text-left space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center text-[9px] font-black font-mono shrink-0">3</span>
                            <span className="text-[9px] font-black text-zinc-300">Liberado</span>
                          </div>
                          <span className="text-[8px] text-zinc-500 leading-normal">Ativação instantânea para saques.</span>
                        </div>
                      </div>
                    </div>

                    {/* Rich Guide Box */}
                    <div className="bg-zinc-950/80 p-4 border border-zinc-900 rounded-2xl space-y-3.5 text-left">
                      <div className="flex gap-2.5 items-start">
                        <div className="bg-violet-600/15 p-2 rounded-xl text-violet-400 shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-[10px] font-black text-zinc-150 uppercase tracking-widest font-mono">Como funciona?</h5>
                          <p className="text-[9px] text-zinc-400 mt-0.5 leading-relaxed">
                            Ao configurar sua Stripe Connect, você cria um canal seguro onde todas as gorjetas e doações recebidas de seus fãs podem ser sacadas diretamente para sua conta bancária favorita.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[8px] font-mono text-zinc-400 border-t border-zinc-900/60 pt-2.5">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-violet-500 shrink-0" />
                          <span>100% Criptografado</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3 h-3 text-violet-500 shrink-0" />
                          <span>TED/PIX Instantâneo</span>
                        </div>
                      </div>

                      <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-[8px] text-amber-300 leading-normal flex gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Aviso de Modo de Teste Sandbox</span>
                          Se o servidor estiver sem chaves de API secretas reais, você será colocado em simulação imediata de cadastro, conectando instantaneamente para fins de validação visual e técnica.
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onConnectStripeAccount}
                      className="w-full py-3 bg-gradient-to-r from-violet-600 via-indigo-650 to-indigo-700 hover:brightness-110 active:scale-[0.98] text-white font-black text-[11px] rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-violet-950/20"
                      id="btn-connect-stripe-onboard"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Prosseguir para Configuração Stripe
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    {/* Status Box */}
                    <div className="bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-2xl flex items-center justify-between transition">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest font-mono block">Stripe Connect Ativo</span>
                          <span className="text-[9px] text-zinc-400 font-mono select-all shrink-0 mt-0.5 block">{user.stripeAccountId}</span>
                        </div>
                      </div>
                      
                      {onDisconnectStripeAccount && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Deseja realmente desconectar sua conta Stripe do canal de saques?")) {
                              onDisconnectStripeAccount();
                            }
                          }}
                          className="p-1 px-2.5 rounded-lg border border-zinc-800 hover:border-red-500/30 text-[9px] text-zinc-400 hover:text-red-400 font-bold transition flex items-center gap-1.5 cursor-pointer hover:bg-red-500/5 active:scale-[0.96]"
                          id="btn-disconnect-stripe"
                          title="Desconectar conta Stripe"
                        >
                          <Trash2 className="w-3 h-3 shrink-0" />
                          Desvincular
                        </button>
                      )}
                    </div>

                    <p className="text-[9px] text-zinc-400 leading-normal">
                      Sua carteira está habilitada para saques. Digite o valor que deseja debitar e envie em segundos.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1 bg-black/65 p-2 rounded-xl border border-zinc-800 focus-within:border-zinc-700 transition">
                        <span className="text-zinc-500 font-mono text-[10px] ml-1">R$</span>
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="Valor do Saque"
                          className="w-full bg-transparent text-xs font-bold text-white outline-none font-mono"
                          id="input-withdraw-amount"
                        />
                      </div>
                      <div className="flex items-center bg-zinc-900/40 p-2 px-2.5 rounded-xl border border-zinc-850/60 text-zinc-500 text-[10px] font-mono">
                        <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0 mr-1.5" />
                        Stripe Link Ativo
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={withdrawDestination}
                        onChange={(e) => setWithdrawDestination(e.target.value)}
                        placeholder="Chave PIX ou Conta Bancária para Receber"
                        className="flex-1 bg-black/65 p-2 px-3 rounded-xl border border-zinc-800 focus-within:border-zinc-700 transition text-[10px] text-white outline-none"
                        id="input-withdraw-bank"
                      />
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={handleExecuteWithdrawal}
                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer transition active:scale-[0.98] disabled:opacity-50"
                        id="btn-execute-withdrawal"
                      >
                        {isProcessing ? "Executando..." : "Sacar"}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Verification badge upgrade store */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-6 rounded-3xl flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-widest font-extrabold flex items-center gap-1">
              <Settings className="w-3 h-3 shrink-0" />
              Selo de Verificação
            </span>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <span>Comprar Verificado Oficial</span>
              <span className="text-[9px] bg-blue-500 text-white py-0.5 px-2 rounded-full font-bold uppercase tracking-wider">Aura Pro</span>
            </h4>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-normal">
              Mostre autenticidade com o desejado selo de verificação azul. Apenas R$ 19,90 debitado do saldo da carteira.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between gap-4 mt-4">
            <div className="space-y-0.5">
              <span className="text-[11px] text-zinc-400">Total</span>
              <p className="text-xs font-black text-zinc-900 dark:text-white font-mono">R$ 19,90</p>
            </div>
            {user.isVerified ? (
              <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold rounded-xl flex items-center gap-1">
                <Check className="w-4 h-4 shrink-0" />
                Já Verificado!
              </span>
            ) : (
              <button
                type="button"
                onClick={onBuyVerification}
                className="py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shrink-0"
                id="btn-buy-verification"
              >
                Comprar Selo Azul
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs navigation: My Posts vs Bookmarked/Saved posts */}
      <div className="space-y-4">
        <div className="flex border-b border-zinc-100 dark:border-zinc-900">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 pb-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider ${
              activeTab === "posts"
                ? "border-b-2 border-violet-500 text-zinc-900 dark:text-white"
                : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
            id="tab-profile-posts"
          >
            <Grid className="w-4 h-4" />
            Minhas Postagens ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 pb-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider ${
              activeTab === "saved"
                ? "border-b-2 border-violet-500 text-zinc-900 dark:text-white"
                : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
            id="tab-profile-saved"
          >
            <Bookmark className="w-4 h-4" />
            Marcados / Salvos ({savedPosts.length})
          </button>
        </div>

        {/* Visual Content Display list standard grids */}
        {activeTab === "posts" ? (
          userPosts.length === 0 ? (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-6">
              <FileText className="w-10 h-10 text-zinc-400 mx-auto mb-2 stroke-1" />
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nenhum post publicado</p>
              <p className="text-[11px] text-zinc-400 mt-1">Publique fotos ou vídeos reels no menu publicações.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square rounded-xl overflow-hidden group bg-zinc-900 border border-zinc-800"
                  id={`profile-post-card-${post.id}`}
                >
                  <img
                    src={post.media[0]}
                    alt="My Post asset"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-xs font-bold text-white">
                    <span>❤️ {post.likesCount}</span>
                    <span>💬 {post.comments.length}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : savedPosts.length === 0 ? (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-6">
            <Bookmark className="w-10 h-10 text-zinc-400 mx-auto mb-2 stroke-1" />
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nenhum post marcado</p>
            <p className="text-[11px] text-zinc-400 mt-1">Marque fotos de outros criadores com o ícone de marcador!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-3">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="relative aspect-square rounded-xl overflow-hidden group bg-zinc-900 border border-zinc-800"
                id={`profile-saved-card-${post.id}`}
              >
                <img
                  src={post.media[0]}
                  alt="Saved post cover"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-xs font-bold">
                  <span>❤️ {post.likesCount}</span>
                  <span>💬 {post.comments.length}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { User, AuditLog, Post } from "../types";
import { ShieldCheck, Users, Ban, AlertOctagon, Eye, Terminal, Clock, Settings, Code, RefreshCw, BadgeCheck } from "lucide-react";

interface AdminProps {
  currentUser: User;
  usersCount: number;
  postsCount: number;
  auditLogs: AuditLog[];
  onAddAuditLog: (action: string, target: string) => void;
  onClearLogs: () => void;
  reels: Post[];
  registeredUsers: User[];
  onToggleUserVerification: (userId: string) => void;
  onUpdateUserFollowers: (userId: string, followersCount: number) => void;
}

export default function Admin({
  currentUser,
  usersCount,
  postsCount,
  auditLogs,
  onAddAuditLog,
  onClearLogs,
  reels,
  registeredUsers,
  onToggleUserVerification,
  onUpdateUserFollowers
}: AdminProps) {
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  const [banInput, setBanInput] = useState("");
  const [systemAlert, setSystemAlert] = useState("Status do Servidor: Operando nominalmente 🟢");
  const [followersInputs, setFollowersInputs] = useState<Record<string, string>>({});

  const handleBanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banInput.trim()) return;

    const targetUser = banInput.trim().toLowerCase().replace("@", "");
    if (!bannedUsers.includes(targetUser)) {
      setBannedUsers([...bannedUsers, targetUser]);
      onAddAuditLog("BAN_USER", `@${targetUser}`);
    }
    setBanInput("");
  };

  const handleUnban = (user: string) => {
    setBannedUsers(bannedUsers.filter(u => u !== user));
    onAddAuditLog("UNBAN_USER", `@${user}`);
  };

  const handleToggleFirewall = () => {
    const alerts = [
      "Status do Servidor: Firewall reforçado com mitigação DDoS Cloudflare ativa 🛡️",
      "Status do Servidor: Algoritmo Inteligente Aura AI reordenando posts com Flash ⚡",
      "Status do Servidor: Cache Redis limpo (0ms de latência simulado) 💎",
      "Status do Servidor: Operando nominalmente 🟢"
    ];
    const pick = alerts[Math.floor(Math.random() * alerts.length)];
    setSystemAlert(pick);
    onAddAuditLog("TOGGLE_SECURITY_FIREWALL", "Redirecionando logs de auditoria.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 text-left font-sans" id="admin-panel-component">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-white gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-violet-400 font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            Zeladoria & Moderação Segura
          </span>
          <h2 className="text-xl font-black">Aura Control Center</h2>
          <p className="text-xs text-zinc-400 leading-normal">
            Painel Administrativo para controle de conteúdo contra assédio, bots e spam operado por @{currentUser.username}.
          </p>
        </div>

        <button
          onClick={handleToggleFirewall}
          className="py-2.5 px-4 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/60 text-xs font-bold rounded-xl flex items-center gap-1.5 transition whitespace-nowrap self-start md:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Alternar Ajustes de Rede
        </button>
      </div>

      {/* Grid numbers charts counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-4.5 rounded-3xl text-left">
          <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block">Usuários Ativos</span>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{usersCount + 4}</p>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">✦ Crescimento viral de 24h</span>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-4.5 rounded-3xl text-left">
          <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block">Postagens</span>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{postsCount + reels.length}</p>
          <span className="text-[10px] text-zinc-400 mt-1 block">Fotos e Vídeos Curtos</span>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-4.5 rounded-3xl text-left">
          <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block">Contas Banidas</span>
          <p className="text-2xl font-black text-rose-500 mt-1">{bannedUsers.length}</p>
          <span className="text-[10px] text-zinc-400 mt-1 block">Proteção Anti-fraude</span>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-4.5 rounded-3xl text-left">
          <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block">Limiar de IA</span>
          <p className="text-2xl font-black text-violet-500 mt-1">98.5%</p>
          <span className="text-[10px] text-violet-400 font-bold block mt-1">Moderador flash ativo</span>
        </div>
      </div>

      <div className="p-3 bg-violet-950/20 text-violet-400 font-semibold text-xs rounded-xl border border-violet-500/20 text-center animate-pulse">
        {systemAlert}
      </div>

      {/* User Verification choosing list - Admin exclusive */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-1.5 text-blue-500">
          <ShieldCheck className="w-5 h-5 text-blue-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Gerenciador de Verificações Oficiais</h3>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
          Selecione quem recebe ou perde o selo de verificação azul. As alterações surtem efeito imediato em todo o ecossistema Aura Social em tempo real.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {registeredUsers.map((userItem) => (
            <div
              key={userItem.id}
              className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-900 rounded-2xl flex flex-col justify-between"
              id={`admin-user-verify-${userItem.id}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={userItem.avatar}
                  alt={userItem.username}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
                />
                <div className="text-left min-w-0">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate flex items-center gap-1">
                    {userItem.displayName}
                    {userItem.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/20 shrink-0 inline" />
                    )}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">@{userItem.username}</span>
                </div>
              </div>

              <div className="mt-3.5 space-y-2 border-t border-dashed border-zinc-100 dark:border-zinc-800/80 pt-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Seguidores</span>
                  <span className="font-mono font-bold text-violet-500 bg-violet-500/10 px-1.5 py-0.5 rounded text-[9px]">
                    {userItem.followersCount} seg.
                  </span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="number"
                    min="0"
                    placeholder={`${userItem.followersCount}`}
                    value={followersInputs[userItem.id] !== undefined ? followersInputs[userItem.id] : ""}
                    onChange={(e) => setFollowersInputs({ ...followersInputs, [userItem.id]: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-black py-1 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-900 dark:text-zinc-100 font-mono outline-none focus:border-violet-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const inputVal = followersInputs[userItem.id];
                      if (inputVal === undefined || inputVal.trim() === "") {
                        alert("Por favor, digite um número de seguidores.");
                        return;
                      }
                      const count = parseInt(inputVal);
                      if (isNaN(count) || count < 0) {
                        alert("Digite um número inteiro válido.");
                        return;
                      }
                      onUpdateUserFollowers(userItem.id, count);
                      alert(`✓ Seguidores de @${userItem.username} atualizados para ${count}!`);
                      setFollowersInputs((prev) => {
                        const updated = { ...prev };
                        delete updated[userItem.id];
                        return updated;
                      });
                    }}
                    className="py-1 px-2 bg-violet-600 hover:bg-violet-500 text-white font-black text-[9px] rounded-lg uppercase tracking-wider transition active:scale-[0.96] shrink-0 cursor-pointer"
                    id={`btn-save-followers-${userItem.username}`}
                  >
                    Gravar
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-400">
                  {userItem.isVerified ? "🔒 Verificado" : "❌ S/ Selo"}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleUserVerification(userItem.id)}
                  className={`py-1 px-2.5 rounded-lg text-[9px] font-bold tracking-wide uppercase transition ${
                    userItem.isVerified
                      ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                      : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/25"
                  }`}
                  id={`btn-toggle-verify-${userItem.username}`}
                >
                  {userItem.isVerified ? "Remover" : "Verificar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Anti-spam Ban controller box */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-1.5 text-rose-500">
            <Ban className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Controle de Banimento</h3>
          </div>

          <p className="text-xs text-zinc-450 dark:text-zinc-500 leading-normal">
            Bane instantaneamente qualquer perfil do feed que poste material ofensivo ou viole termos comunitários.
          </p>

          <form onSubmit={handleBanSubmit} className="flex gap-2 bg-zinc-50 dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <input
              type="text"
              placeholder="Ex: spammer_bot_99"
              value={banInput}
              onChange={(e) => setBanInput(e.target.value)}
              className="flex-1 bg-transparent text-xs text-zinc-800 dark:text-zinc-200 outline-none pl-2"
              id="input-ban-username"
            />
            <button
              type="submit"
              className="py-1.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg whitespace-nowrap"
              id="btn-ban-user"
            >
              Banir Perfil
            </button>
          </form>

          {/* List of active blocks */}
          <div className="space-y-2 pt-2 text-xs">
            <span className="font-bold text-zinc-500 block uppercase tracking-wider text-[10px]">Perfis Banidos ({bannedUsers.length})</span>
            {bannedUsers.length === 0 ? (
              <p className="text-zinc-400 italic">Nenhum perfil banido na sessão.</p>
            ) : (
              bannedUsers.map((u) => (
                <div key={u} className="flex items-center justify-between p-2.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/60 rounded-xl text-rose-600 dark:text-rose-400">
                  <span className="font-mono font-bold">@{u}</span>
                  <button
                    onClick={() => handleUnban(u)}
                    className="text-[10px] uppercase font-black tracking-widest text-zinc-500 hover:text-rose-600"
                  >
                    Desbanir
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live system terminal audit logger section */}
        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-6 flex flex-col justify-between aspect-square md:aspect-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Terminal className="w-5 h-5 animate-pulse" />
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Terminal de Auditoria LGPD</h3>
              </div>
              <button
                onClick={onClearLogs}
                className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest py-1 px-2.5 hover:bg-zinc-900 rounded-lg transition"
              >
                Limpar Logs
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 leading-normal font-sans">
              Cada moderação, transação de carteira digital e criação de conta gera uma assinatura criptográfica auditável.
            </p>
          </div>

          <div className="bg-black/80 rounded-2xl border border-zinc-805/80 p-4.5 font-mono text-[10.5px] text-emerald-400 h-44 overflow-y-auto space-y-2.5 no-scrollbar mt-4">
            {auditLogs.length === 0 ? (
              <p className="text-zinc-650 italic">Nenhum log gerado ainda.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="border-b border-zinc-900 pb-1.5 leading-relaxed">
                  <div className="flex items-center justify-between text-zinc-500 font-bold mb-0.5 text-[9.5px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </span>
                    <span className="uppercase text-violet-400 text-[8.5px] bg-violet-950/40 px-1 border border-violet-900/40 rounded">
                      CMD
                    </span>
                  </div>
                  <p>
                    <span className="text-zinc-400">[{log.action}]</span> {log.target} por <span className="text-zinc-300">{log.user}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

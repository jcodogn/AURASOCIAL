import React from "react";
import { Notification } from "../types";
import { Heart, MessageSquare, Coins, UserPlus, Check, AlertTriangle, HelpCircle } from "lucide-react";

interface NotificationsProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
}

export default function Notifications({ notifications, onMarkAllRead }: NotificationsProps) {
  return (
    <div className="max-w-xl mx-auto space-y-6 pb-24 text-left font-sans" id="notifications-component">
      {/* Feed headers with clearing ticks */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-zinc-900">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-widest uppercase">Atividades</span>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Novidades recentes</span>
        </div>
        <button
          onClick={onMarkAllRead}
          className="text-xs font-bold text-violet-500 hover:text-violet-400 py-1.5 px-3 rounded-xl hover:bg-violet-600/10 transition-all cursor-pointer"
          id="btn-mark-all-read"
        >
          Marcar tudo como visto
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl divide-y divide-zinc-100 dark:divide-zinc-900 overflow-hidden shadow-sm">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-zinc-400">
            <p className="text-xs font-medium">Nenhuma atividade recente encontrada</p>
          </div>
        ) : (
          notifications.map((notif) => {
            // Pick corresponding type icons
            let iconBox = <HelpCircle className="w-4 h-4 text-zinc-400" />;
            let iconWrapperStyle = "bg-zinc-100 dark:bg-zinc-900 text-zinc-500";

            if (notif.type === "like") {
              iconBox = <Heart className="w-4 h-4 fill-red-500 text-red-500" />;
              iconWrapperStyle = "bg-rose-50 dark:bg-rose-950/20";
            } else if (notif.type === "comment") {
              iconBox = <MessageSquare className="w-4 h-4 text-violet-500" />;
              iconWrapperStyle = "bg-violet-50 dark:bg-violet-950/20";
            } else if (notif.type === "follow") {
              iconBox = <UserPlus className="w-4 h-4 text-emerald-500" />;
              iconWrapperStyle = "bg-emerald-50 dark:bg-emerald-950/20";
            } else if (notif.type === "tip") {
              iconBox = <Coins className="w-4 h-4 text-amber-500" />;
              iconWrapperStyle = "bg-amber-50 dark:bg-amber-950/20";
            }

            return (
              <div
                key={notif.id}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                  notif.isRead ? "bg-transparent opacity-85" : "bg-violet-600/[0.02]"
                }`}
                id={`notif-${notif.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icon Pedestal */}
                  <div className="relative shrink-0">
                    <img
                      src={notif.userAvatar}
                      alt={notif.username}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-905"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-950 ${iconWrapperStyle}`}>
                      {iconBox}
                    </div>
                  </div>

                  {/* text bodies */}
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                      <span className="font-extrabold mr-1 text-zinc-900 dark:text-white">
                        {notif.username}
                      </span>
                      {notif.text}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-semibold font-mono block mt-1">
                      {notif.createdAt}
                    </span>
                  </div>
                </div>

                {/* Right block: Thumbnail for post tag actions or tip stamp indicators */}
                {notif.postMedia ? (
                  <img
                    src={notif.postMedia}
                    alt="Post source"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover shrink-0 border border-zinc-100 dark:border-zinc-900"
                  />
                ) : notif.type === "tip" ? (
                  <div className="py-1 px-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[9px] font-mono font-bold text-emerald-500 shrink-0 uppercase tracking-widest">
                    PIX OK
                  </div>
                ) : (
                  <button className="py-1.5 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 rounded-xl text-[10px] font-bold text-zinc-700 dark:text-zinc-300 transition-colors shrink-0">
                    Seguir
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Trust & GDPR/LGPD transparency card */}
      <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-850 rounded-2xl p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-zinc-400 uppercase font-mono block">Segurança Aura Social</span>
          <p className="text-[10.5px] text-zinc-500 leading-normal">
            Aura Social é totalmente compatível com a LGPD. Todas as gorjetas, mensagens diretas de chat e logs de transação são criptografados com hashing hashes simétricos avançados.
          </p>
        </div>
      </div>
    </div>
  );
}

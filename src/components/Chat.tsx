import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, PhoneCall, Video, Image, Mic, ChevronLeft, Check, CheckCheck, Compass, Search } from "lucide-react";
import { ChatChannel, Message, User } from "../types";
import { searchRealUsers, RealUser } from "../lib/supabase";

interface ChatProps {
  channels: ChatChannel[];
  currentUser: User;
  onSendMessage: (channelId: string, text: string) => void;
  onAddChannel: (usernameOrUser: any) => void;
  registeredUsers: User[];
}

export default function Chat({ channels, currentUser, onSendMessage, onAddChannel, registeredUsers }: ChatProps) {
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isTypingSimulated, setIsTypingSimulated] = useState(false);
  const [searchNewContact, setSearchNewContact] = useState("");
  const [searchResults, setSearchResults] = useState<RealUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchNewContact.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const fallbackList: RealUser[] = registeredUsers
          .filter(u => u.username !== currentUser.username)
          .map(u => ({
            id: u.id,
            username: u.username,
            displayName: u.displayName || u.username,
            avatar: u.avatar,
            isOnline: true,
            bio: u.bio,
            isVerified: u.isVerified
          }));

        const results = await searchRealUsers(searchNewContact, fallbackList);
        setSearchResults(results);
      } catch (err) {
        console.error("Erro consultando Supabase:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchNewContact, registeredUsers, currentUser.username]);

  const handleSend = (e: React.FormEvent, channelId: string) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(channelId, inputText);
    setInputText("");

    // Setup an automated response simulation using nice heuristics
    setIsTypingSimulated(true);
    setTimeout(() => {
      setIsTypingSimulated(false);
      const responses = [
        "Incrível! Vamos amadurecer essa ideia sobre a Aura.",
        "Com certeza, adorei o rumo desse projeto de monetização.",
        "Essa rede ficou rápida demais com os WebSockets, né?",
        "Sim! Estarei livre às 18h de hoje para chamarmos.",
        "Obrigado pelo feedback, me manda o link!"
      ];
      const randomMsg = responses[Math.floor(Math.random() * responses.length)];
      
      const activeChan = channels.find(c => c.id === channelId);
      if (activeChan) {
        activeChan.messages.push({
          id: Math.random().toString(),
          senderId: activeChan.partner.id,
          text: randomMsg,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        });
        activeChan.unreadCount += 1;
      }
    }, 2000);
  };

  const activeChannel = channels.find((c) => c.id === activeChannelId);

  const handleSelectContact = (user: RealUser) => {
    // Add real database user
    onAddChannel(user);
    setSearchNewContact("");
    setSearchResults([]);
    
    // Switch active channel view
    setTimeout(() => {
      const created = channels.find(c => c.partner.username === user.username);
      if (created) {
        setActiveChannelId(created.id);
      } else {
        // Fallback guess
        setActiveChannelId(`chat_${user.id}`);
      }
    }, 150);
  };

  return (
    <div className="flex bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden min-h-[70vh] shadow-lg max-w-4xl mx-auto" id="chat-component">
      {/* Sidebar: Channel List */}
      <div className={`w-full md:w-80 border-r border-zinc-100 dark:border-zinc-900 flex flex-col ${
        activeChannelId ? "hidden md:flex" : "flex"
      }`}>
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 text-left">
          <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-widest block mb-1">Aura Messenger</span>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">Conversas</h2>

          {/* Quick new chat creation input */}
          <div className="relative mt-3 z-30">
            <div className="flex gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200/40 items-center">
              <Search className="w-4 h-4 text-zinc-400 shrink-0 ml-1" />
              <input
                type="text"
                placeholder="Pesquisar usuários no Supabase..."
                value={searchNewContact}
                onChange={(e) => setSearchNewContact(e.target.value)}
                className="flex-1 bg-transparent text-xs text-zinc-800 dark:text-zinc-200 outline-none pl-0.5 font-medium placeholder:text-zinc-400"
                id="input-create-chat"
              />
              {searchNewContact && (
                <button
                  type="button"
                  onClick={() => setSearchNewContact("")}
                  className="text-[10px] text-zinc-450 hover:text-zinc-900 dark:hover:text-white mr-1"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Supabase realtime results drop panel */}
            <AnimatePresence>
              {searchNewContact.trim() !== "" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-805 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto z-50 text-left"
                >
                  <div className="px-3.5 py-1.5 bg-violet-600/10 dark:bg-violet-500/5 border-b border-zinc-100 dark:border-zinc-800 text-[9px] font-bold text-violet-600 dark:text-violet-400 font-mono flex items-center justify-between tracking-wide uppercase">
                    <span>Aura Supabase Link</span>
                    <span className="animate-pulse text-emerald-500">● Conectado</span>
                  </div>

                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-zinc-400 font-medium flex items-center justify-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-violet-500 font-bold" />
                      Consultando banco de dados...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-400 font-medium">
                      Nenhum perfil real localizado
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-50 dark:divide-zinc-850">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleSelectContact(user)}
                          className="w-full px-3.5 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 flex items-center gap-3 transition text-left cursor-pointer active:bg-zinc-100"
                        >
                          <img
                            src={user.avatar}
                            alt={user.displayName}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-zinc-100 dark:border-zinc-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                {user.displayName}
                              </span>
                              {user.isVerified && (
                                <span className="w-3 h-3 bg-blue-500 text-white rounded-full flex items-center justify-center text-[7px] font-extrabold shrink-0">
                                  ✓
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-zinc-500 font-mono block">
                              @{user.username}
                            </span>
                          </div>
                          <div className="text-[9px] text-violet-500 font-extrabold bg-violet-500/10 px-2 py-1 rounded-lg shrink-0">
                            Chat
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-900/50 no-scrollbar text-left">
          {channels.length === 0 ? (
            <div className="p-6 text-center text-zinc-400">
              <p className="text-xs">Nenhuma conversa ativa</p>
            </div>
          ) : (
            channels.map((channel) => {
              const lastMsg = channel.messages[channel.messages.length - 1];
              return (
                <button
                  key={channel.id}
                  onClick={() => {
                    setActiveChannelId(channel.id);
                    channel.unreadCount = 0;
                  }}
                  className={`w-full p-4 flex items-center justify-between transition-colors text-left ${
                    channel.id === activeChannelId
                      ? "bg-violet-600/10 dark:bg-violet-500/5"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900/20"
                  }`}
                  id={`chat-channel-btn-${channel.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={channel.partner.avatar}
                        alt={channel.partner.displayName}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover"
                      />
                      {channel.partner.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {channel.partner.displayName}
                      </h4>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5 font-medium">
                        {lastMsg ? lastMsg.text : "Inicie um novo assunto..."}
                      </p>
                    </div>
                  </div>

                  {channel.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ml-2">
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Thread panel */}
      {activeChannelId && activeChannel ? (
        <div className="flex-1 flex flex-col bg-zinc-50/50 dark:bg-zinc-950/20">
          {/* Top Thread Header */}
          <div className="p-4 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveChannelId(null)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition md:hidden text-zinc-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <img
                src={activeChannel.partner.avatar}
                alt={activeChannel.partner.displayName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                  {activeChannel.partner.displayName}
                </h4>
                <p className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeChannel.partner.isOnline ? "bg-emerald-500" : "bg-zinc-400"}`} />
                  {activeChannel.partner.isOnline ? "Online agora" : "Offline"}
                </p>
              </div>
            </div>

            {/* Quick action simulation icons */}
            <div className="flex items-center gap-1">
              <button onClick={() => alert("📞 Chamada de Voz de alta qualidade indisponível em ambiente de sandbox.")} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition text-zinc-600 dark:text-zinc-400">
                <PhoneCall className="w-4 h-4" />
              </button>
              <button onClick={() => alert("📹 Chamada de Vídeo de baixa latência em sandbox indisponível.")} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition text-zinc-600 dark:text-zinc-400">
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Thread list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 pr-2 no-scrollbar">
            {activeChannel.messages.map((message) => {
              const isMe = message.senderId === currentUser.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} text-left`}
                >
                  <div
                    className={`max-w-[70%] p-3.5 rounded-2xl text-xs font-medium ${
                      isMe
                        ? "bg-violet-600 text-white rounded-br-none shadow-md shadow-violet-500/10"
                        : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-bl-none border border-zinc-100 dark:border-zinc-850"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <div className={`text-[9px] mt-1.5 flex items-center justify-end gap-1 ${
                      isMe ? "text-violet-200" : "text-zinc-450 dark:text-zinc-500"
                    }`}>
                      <span>{message.createdAt}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-zinc-300 fill-zinc-300/10" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTypingSimulated && (
              <div className="flex justify-start text-left">
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl rounded-bl-none border border-zinc-100 dark:border-zinc-850 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Message input bar */}
          <form
            onSubmit={(e) => handleSend(e, activeChannel.id)}
            className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 flex items-center gap-3 shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setInputText("🎨 Olhei seu preset cyberpunk e adorei!")}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition text-zinc-500"
                title="Mensagem Rápida"
              >
                <Compass className="w-4 h-4 text-violet-500" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Sua mensagem direta..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-11 bg-zinc-100 dark:bg-zinc-900 rounded-2xl px-4 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none placeholder:text-zinc-400"
              id="input-direct-message"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-11 h-11 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-250 dark:disabled:bg-zinc-800 rounded-2xl flex items-center justify-center transition border border-transparent shadow shadow-violet-500/20"
              id="btn-send-dm"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      ) : (
        /* Empty chat preview state */
        <div className="flex-1 hidden md:flex flex-col items-center justify-center p-6 text-center text-zinc-400 dark:text-zinc-650 bg-zinc-50/50 dark:bg-zinc-950/20">
          <CompState />
        </div>
      )}
    </div>
  );
}

function CompState() {
  return (
    <div className="space-y-4">
      <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-violet-500 border border-zinc-200/50 dark:border-zinc-800/80">
        <Send className="w-7 h-7 stroke-1" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Suas Mensagens Diretas</h4>
        <p className="text-xs text-zinc-500 max-w-[280px] mx-auto mt-1 leading-normal">
          Envie fotos premium, áudio ou inicie um chat seguro criptografado com criadores e amigos na Aura.
        </p>
      </div>
    </div>
  );
}

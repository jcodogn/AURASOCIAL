import React, { useState, useEffect } from "react";
import "./index.css";
import { motion, AnimatePresence } from "motion/react";
import Splash from "./components/Splash";
import Onboarding from "./components/Onboarding";
import Auth from "./components/Auth";
import Stories from "./components/Stories";
import Feed from "./components/Feed";
import Reels from "./components/Reels";
import Chat from "./components/Chat";
import Profile from "./components/Profile";
import Publish from "./components/Publish";
import Notifications from "./components/Notifications";
import Marketplace from "./components/Marketplace";
import Explore from "./components/Explore";
import Admin from "./components/Admin";

import {
  INITIAL_USER,
  INITIAL_STORIES,
  INITIAL_POSTS,
  INITIAL_REELS,
  INITIAL_CHATS,
  INITIAL_NOTIFICATIONS
} from "./data";
import { User, Post, Story, ChatChannel, Notification, AuditLog, MarketItem } from "./types";
import {
  Home,
  Compass,
  Film,
  PlusSquare,
  MessageSquare,
  Heart,
  User as UserIcon,
  ShoppingBag,
  ShieldAlert,
  Sun,
  Moon,
  Sparkles,
  DollarSign
} from "lucide-react";

export default function App() {
  // Navigation states
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Current active navigation tab
  const [activeTab, setActiveTab] = useState<"feed" | "explore" | "reels" | "publish" | "chat" | "marketplace" | "notifications" | "profile" | "admin">("feed");

  // Global Core Data states
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [reels, setReels] = useState<Post[]>(INITIAL_REELS);
  const [chats, setChats] = useState<ChatChannel[]>(INITIAL_CHATS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  // Users register for Admin verification choice & sync
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([
    {
      ...INITIAL_USER,
      id: "user_me",
    },
    {
      id: "user_alice",
      username: "alice_design",
      displayName: "Alice Ferreira",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Visual designer creating the next generation of visual arts on the web! 🚀",
      website: "alice_design.concept",
      followersCount: 840,
      followingCount: 120,
      isVerified: true,
      isCreator: true,
      walletBalance: 120.00,
      role: "creator"
    },
    {
      id: "user_bruno",
      username: "bruno_dev",
      displayName: "Bruno Tech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Software architect and backend builder. Focused on performance and cloud scalability.",
      website: "brunotech.dev",
      followersCount: 520,
      followingCount: 95,
      isVerified: false,
      isCreator: true,
      walletBalance: 80.00,
      role: "creator"
    },
    {
      id: "user_clara",
      username: "clara_art",
      displayName: "Clara G.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Contemporary artist exploring digital painting and interactive physical canvases. 🎨✨",
      website: "clara_art.studio",
      followersCount: 1290,
      followingCount: 220,
      isVerified: true,
      isCreator: true,
      walletBalance: 450.00,
      role: "creator"
    }
  ]);

  // Real-time Incoming Chat Message Toast banner state
  const [activeToast, setActiveToast] = useState<{ displayName: string; text: string; avatar: string } | null>(null);
  
  // Audit logger lists
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "log_1",
      action: "SERVER_BOOT_SUCCESS",
      target: "Docker Container Cloud Run Node v2.6.0",
      user: "SYSTEM_MONITOR",
      timestamp: "01:38:26"
    }
  ]);

  // Dark light mode state
  const [darkMode, setDarkMode] = useState(true);

  // AI sorting state
  const [aiSorted, setAiSorted] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  // Check for Stripe Connect onboarding callbacks or checkout parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const onboardingStatus = params.get("stripe_onboarding");
    const stripeAccountIdParam = params.get("stripe_account_id");
    const stripeSuccess = params.get("stripe_success");
    const amountParam = params.get("amount");

    if (onboardingStatus === "success" && stripeAccountIdParam) {
      // Clear query params elegantly to avoid loop
      const cleanerUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanerUrl);

      // Link onboarding account id!
      setCurrentUser((prev) => {
        const updated = { ...prev, stripeAccountId: stripeAccountIdParam };
        localStorage.setItem("aura_user_info", JSON.stringify(updated));
        return updated;
      });
      
      alert(`🎉 [Stripe Connect] Conta vinculada com sucesso! Seu ID é: ${stripeAccountIdParam}. Seu canal está 100% pronto para receber saques reais.`);
      addAuditLog("STRIPE_CONNECT_LINKED", `Conta Connect vinculada com sucesso: ${stripeAccountIdParam}`);
    } else if (stripeSuccess === "true" && amountParam) {
      const cleanerUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanerUrl);

      const value = parseFloat(amountParam);
      if (!isNaN(value)) {
        setCurrentUser((prev) => {
          const updated = { ...prev, walletBalance: prev.walletBalance + value };
          localStorage.setItem("aura_user_info", JSON.stringify(updated));
          return updated;
        });
        alert(`💰 [Stripe] Depósito de R$ ${value.toFixed(2)} foi processado e creditado via Checkout com sucesso!`);
        addAuditLog("DEPOSIT_CREDITED", `Depósito Stripe Checkout Creditado: R$ ${value.toFixed(2)}`);
      }
    }
  }, []);

  // Sync index.css dark class
  useEffect(() => {
    const rootClass = document.documentElement.classList;
    if (darkMode) {
      rootClass.add("dark");
      document.body.style.backgroundColor = "#09090b"; // zinc-950 dark fallback
    } else {
      rootClass.remove("dark");
      document.body.style.backgroundColor = "#fafafa"; // zinc-50 light fallback
    }
  }, [darkMode]);

  // Real-time Message Engine Simulator (simula WebSockets em tempo real)
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      const partnersList = [
        {
          id: "user_alice",
          username: "alice_design",
          displayName: "Alice Ferreira",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
          sentences: [
            "Você viu a nova postagem sobre Aura Pro UI? Está sensacional!",
            "Acabei de publicar um novo story. Dá uma olhada!",
            "Consegui otimizar o tempo de carregamento da página do portfólio. 🎉",
            "Será que deveríamos fazer uma colab de design amanhã?",
            "Acabei de receber o PIX da gorjeta, valeu demais pelo apoio!"
          ]
        },
        {
          id: "user_bruno",
          username: "bruno_dev",
          displayName: "Bruno Tech",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
          sentences: [
            "Acabei de subir nova versão com suporte a áudio em tempo real!",
            "O banco de dados local está voando baixo agora. 💨",
            "Olha só, implementei o simulador de WebSockets!",
            "O admin acabou de ajustar meu selo azul de verificação? Ficou top!",
            "Amanhã voy palestrar sobre arquitetura de redes no Aura Meet."
          ]
        },
        {
          id: "user_clara",
          username: "clara_art",
          displayName: "Clara G.",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
          sentences: [
            "Pintei um novo quadro hoje pensando no Minimalismo Escuro da nossa rede.",
            "Você acha que o design com neons combina com arte abstrata?",
            "Muito legal a interação em tempo real, as mensagens chegam na hora!",
            "Enviei um preset lá no Marketplace, me diz o que achou.",
            "Oi! Adorei bater papo hoje cedo, a vibe da comunidade está incrível."
          ]
        }
      ];

      // Exclude yourself, choose random partner
      const partner = partnersList[Math.floor(Math.random() * partnersList.length)];
      const randomText = partner.sentences[Math.floor(Math.random() * partner.sentences.length)];

      setChats((prevChats) => {
        const channelIndex = prevChats.findIndex((ch) => ch.partner.username === partner.username);
        const newMsg = {
          id: `msg_rt_${Math.random().toString()}`,
          senderId: partner.id,
          text: randomText,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        };

        if (channelIndex > -1) {
          const updatedChats = [...prevChats];
          const channel = updatedChats[channelIndex];
          const isViewingChat = activeTab === "chat";
          
          updatedChats[channelIndex] = {
            ...channel,
            unreadCount: isViewingChat ? channel.unreadCount : channel.unreadCount + 1,
            messages: [...channel.messages, newMsg]
          };
          return updatedChats;
        } else {
          const newCh: ChatChannel = {
            id: `chat_${Math.random().toString()}`,
            partner: {
              id: partner.id,
              username: partner.username,
              displayName: partner.displayName,
              avatar: partner.avatar,
              isOnline: true
            },
            messages: [newMsg],
            unreadCount: activeTab === "chat" ? 0 : 1
          };
          return [newCh, ...prevChats];
        }
      });

      // Trigger beautiful live sliding Toast notification
      setActiveToast({
        displayName: partner.displayName,
        text: randomText,
        avatar: partner.avatar
      });

      // Clear toast after 5 seconds
      setTimeout(() => {
        setActiveToast((current) => (current?.displayName === partner.displayName && current?.text === randomText ? null : current));
      }, 5000);

    }, 20000); // 20 seconds loop

    return () => clearInterval(interval);
  }, [isLoggedIn, activeTab]);

  // Audit tracker helper
  const addAuditLog = (action: string, target: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: AuditLog = {
      id: Math.random().toString(),
      action,
      target,
      user: currentUser ? `@${currentUser.username}` : "ANONYMOUS",
      timestamp: timeStr
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Skip splash check
  const handleSplashComplete = () => {
    setShowSplash(false);
    // Check local storage for session
    const storedSession = localStorage.getItem("aura_is_logged_in");
    if (storedSession === "true") {
      setIsLoggedIn(true);
      const storedUser = localStorage.getItem("aura_user_info");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } else {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowAuth(true);
  };

  const handleLogin = (user: User) => {
    // If username is joaopedro, enforce admin role status!
    const updatedUser = {
      ...user,
      role: (user.username === "joaopedro" ? "admin" : (user.role || "creator")) as 'user' | 'creator' | 'admin'
    };
    setCurrentUser(updatedUser);
    setIsLoggedIn(true);
    setShowAuth(false);
    localStorage.setItem("aura_is_logged_in", "true");
    localStorage.setItem("aura_user_info", JSON.stringify(updatedUser));
    addAuditLog("USER_SIGN_IN", `Sessão JWT Segura Ativada - Função: ${updatedUser.role.toUpperCase()}`);
  };

  const handleLogout = () => {
    addAuditLog("USER_SIGN_OUT", "Encerrando sessão ativa.");
    setIsLoggedIn(false);
    setShowAuth(true);
    localStorage.removeItem("aura_is_logged_in");
    localStorage.removeItem("aura_user_info");
  };

  // Post Actions Handlers
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const liked = !post.hasLiked;
          if (liked) {
            addAuditLog("LIKE_POST", `Post ID: ${postId}`);
          }
          return {
            ...post,
            hasLiked: liked,
            likesCount: liked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
  };

  const handleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const saved = !post.hasSaved;
          if (saved) {
            addAuditLog("SAVE_POST", `Post ID: ${postId}`);
          }
          return {
            ...post,
            hasSaved: saved,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, commentText: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newCommentItem = {
            id: Math.random().toString(),
            username: currentUser.username,
            userAvatar: currentUser.avatar,
            text: commentText,
            createdAt: "Agora",
            likesCount: 0,
          };
          addAuditLog("ADD_COMMENT", `Sob post ID: ${postId}`);
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [newCommentItem, ...post.comments],
          };
        }
        return post;
      })
    );
  };

  // Stories viewing & micro actions
  const handleViewStory = (storyId: string) => {
    setStories((prev) =>
      prev.map((st) => (st.id === storyId ? { ...st, isViewed: true } : st))
    );
    addAuditLog("VIEW_STORY", `Story ID: ${storyId}`);
  };

  const handleReactStory = (storyId: string, reaction: string) => {
    setStories((prev) =>
      prev.map((st) =>
        st.id === storyId ? { ...st, reactionsCount: (st.reactionsCount || 0) + 1 } : st
      )
    );
    const origin = stories.find((s) => s.id === storyId);

    // Create notifications for other users
    const newNotif: Notification = {
      id: Math.random().toString(),
      type: "like",
      userId: origin?.userId || "user_alice",
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text: `reagiu com ${reaction} ao seu Story recente.`,
      createdAt: "1 seg atrás",
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    addAuditLog("REACT_STORY", `Reagido com ${reaction} sob Story ID: ${storyId}`);
  };

  // Direct Message Sending & Channel generation
  const handleSendMessage = (channelId: string, text: string) => {
    setChats((prev) =>
      prev.map((ch) => {
        if (ch.id === channelId) {
          const newMsg = {
            id: Math.random().toString(),
            senderId: currentUser.id,
            text,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
          };
          return {
            ...ch,
            messages: [...ch.messages, newMsg],
          };
        }
        return ch;
      })
    );
    addAuditLog("SEND_DIRECT_MESSAGE", `Canal de Chat: ${channelId}`);
  };

  const handleAddChannel = (usernameOrUser: string | User) => {
    const isObject = typeof usernameOrUser !== "string";
    const targetUsername = isObject ? usernameOrUser.username : usernameOrUser.toLowerCase().replace("@", "");
    
    // If channel already exists, exit
    const exists = chats.find((c) => c.partner.username === targetUsername);
    if (exists) return;

    // Find the real user from registeredUsers
    const realUserCandidate = isObject 
      ? usernameOrUser 
      : registeredUsers.find((u) => u.username.toLowerCase() === targetUsername);

    const newChannel: ChatChannel = {
      id: `chat_${Math.random().toString()}`,
      partner: {
        id: realUserCandidate?.id || `user_${Math.random()}`,
        username: targetUsername,
        displayName: realUserCandidate?.displayName || targetUsername.toUpperCase(),
        avatar: realUserCandidate?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        isOnline: true,
      },
      messages: [],
      unreadCount: 0,
    };
    setChats((prev) => [newChannel, ...prev]);
    addAuditLog("CREATE_CHAT_CHANNEL", `Iniciado chat direto com @${targetUsername}`);
  };

  // Creators monetization tipping & wallet addition PIX
  const handleTipCreator = (amount: number, creatorUsername: string) => {
    // Deduct user wallet
    setCurrentUser((prev) => {
      const updated = { ...prev, walletBalance: prev.walletBalance - amount };
      localStorage.setItem("aura_user_info", JSON.stringify(updated));
      return updated;
    });

    // Create custom notification log
    const newTipNotif: Notification = {
      id: Math.random().toString(),
      type: "tip",
      userId: `user_tip_${creatorUsername}`,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text: `enviou uma gorjeta de R$ ${amount.toFixed(2)} por PIX no seu Reel.`,
      createdAt: "1 seg atrás",
      isRead: false,
    };
    setNotifications((prev) => [newTipNotif, ...prev]);
    addAuditLog("TIP_CREATOR", `Enviado R$ ${amount.toFixed(2)} para @${creatorUsername}`);
  };

  const handleAddFunds = async (amount: number) => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, username: currentUser.username })
      });
      const data = await res.json();
      
      if (data.url && data.url !== "SIMULATION") {
        // Redireciona para o checkout real do Stripe se chave configurada
        window.location.href = data.url;
      } else {
        // Modo simulação ou fallback sem chaves
        setCurrentUser((prev) => {
          const updated = { ...prev, walletBalance: prev.walletBalance + amount };
          localStorage.setItem("aura_user_info", JSON.stringify(updated));
          return updated;
        });
        addAuditLog("DEPOSIT_FUNDS", `Depósito Stripe/PIX de R$ ${amount.toFixed(2)} aprovado.`);
      }
    } catch (err) {
      console.error("Erro na API de Checkout do Stripe:", err);
      // Fallback local seguro
      setCurrentUser((prev) => {
        const updated = { ...prev, walletBalance: prev.walletBalance + amount };
        localStorage.setItem("aura_user_info", JSON.stringify(updated));
        return updated;
      });
      addAuditLog("DEPOSIT_FUNDS", `Depósito PIX de R$ ${amount.toFixed(2)} aprovado (Heurística de Redundância).`);
    }
  };

  const handleWithdrawFunds = async (amount: number, bankAccount: string, stripeAccountId?: string) => {
    try {
      const res = await fetch("/api/stripe/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          username: currentUser.username,
          bankAccount,
          stripeAccountId
        })
      });
      
      if (!res.ok) {
        throw new Error("Erro de resposta do servidor de payout.");
      }
      
      const data = await res.json();
      
      setCurrentUser((prev) => {
        const updated = { ...prev, walletBalance: prev.walletBalance - amount };
        localStorage.setItem("aura_user_info", JSON.stringify(updated));
        return updated;
      });

      addAuditLog("STRIPE_PAYOUT", `Saque de R$ ${amount.toFixed(2)} processado para conta @${currentUser.username}.`);
      return data;
    } catch (err) {
      console.error("Erro ao solicitar payout no Stripe:", err);
      // Fallback local seguro
      setCurrentUser((prev) => {
        const updated = { ...prev, walletBalance: prev.walletBalance - amount };
        localStorage.setItem("aura_user_info", JSON.stringify(updated));
        return updated;
      });
      addAuditLog("STRIPE_PAYOUT_LOCAL", `Saque de R$ ${amount.toFixed(2)} registrado com sucesso.`);
      return { status: "success", txId: `tx_local_${Math.random().toString(36).substring(7)}`, message: "Saque liquidado via Pix pelo gateway Banco Aura!" };
    }
  };

  const handleConnectStripeAccount = async () => {
    try {
      const res = await fetch("/api/stripe/connect/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser.username,
          email: `${currentUser.username}@example.com`
        })
      });
      if (!res.ok) {
        throw new Error("Erro de resposta do servidor de onboarding.");
      }
      const data = await res.json();
      if (data.url) {
        if (data.url === "SIMULATION_ONBOARDING") {
          // Under simulation fallback
          alert(`✨ [Simulador Stripe Connect] Nova conta gerada: ${data.id}. Vinculando perfil de testes.`);
          
          setCurrentUser((prev) => {
            const updated = { ...prev, stripeAccountId: data.id };
            localStorage.setItem("aura_user_info", JSON.stringify(updated));
            return updated;
          });
          addAuditLog("STRIPE_CONNECT_ONBOARD", `Conta Conectada criada via simulação: ${data.id}`);
        } else {
          // Redirect the user to real Stripe Connect Express onboarding flow!
          window.location.href = data.url;
        }
      }
    } catch (err: any) {
      console.error("Erro ao conectar com o Stripe:", err);
      alert("⚠️ Erro de gateway Connect do Stripe: verifique o console do servidor.");
    }
  };

  const handleBuyVerification = () => {
    if (currentUser.walletBalance < 19.90) {
      alert("⚠️ Carteira insuficiente para comprar selo azul! Recarregue primeiro.");
      return;
    }

    setCurrentUser((prev) => {
      const updated = { ...prev, isVerified: true, walletBalance: prev.walletBalance - 19.90 };
      localStorage.setItem("aura_user_info", JSON.stringify(updated));
      return updated;
    });
    addAuditLog("BUY_VERIFICATION_SELO", "Adquirido selo azul de autenticidade oficial.");
  };

  const handleUpdateAvatar = (avatarBase64: string) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, avatar: avatarBase64 };
      localStorage.setItem("aura_user_info", JSON.stringify(updated));
      return updated;
    });

    // Update under registeredUsers registry list
    setRegisteredUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === "user_me" || u.username === currentUser.username) {
          return { ...u, avatar: avatarBase64 };
        }
        return u;
      })
    );

    // Update authored posts and comment lines globally in real-time
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        const isAuthor = post.userId === currentUser.id || post.username === currentUser.username || post.userId === "user_me";
        const updatedComments = post.comments.map((comment) => {
          if (comment.username === currentUser.username) {
            return { ...comment, userAvatar: avatarBase64 };
          }
          return comment;
        });

        return {
          ...post,
          ...(isAuthor ? { userAvatar: avatarBase64 } : {}),
          comments: updatedComments,
        };
      })
    );

    // Update stories
    setStories((prevStories) =>
      prevStories.map((st) => {
        if (st.userId === currentUser.id || st.username === currentUser.username || st.userId === "user_me") {
          return { ...st, userAvatar: avatarBase64 };
        }
        return st;
      })
    );

    // Update reels
    setReels((prevReels) =>
      prevReels.map((rl) => {
        if (rl.userId === currentUser.id || rl.username === currentUser.username || rl.userId === "user_me") {
          return { ...rl, userAvatar: avatarBase64 };
        }
        return rl;
      })
    );

    addAuditLog("UPDATE_PROFILE_AVATAR", "Nova foto de perfil carregada com sucesso.");
  };

  const handleToggleUserVerification = (userId: string) => {
    let targetVerified = false;
    let targetUsername = "";

    // 1. Update in registeredUsers list
    setRegisteredUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === userId) {
          targetVerified = !u.isVerified;
          targetUsername = u.username;
          return { ...u, isVerified: targetVerified };
        }
        return u;
      })
    );

    // 2. If corresponding to logged-in user, sync
    if (userId === "user_me" || userId === currentUser.id) {
      setCurrentUser((prev) => {
        const updated = { ...prev, isVerified: targetVerified };
        localStorage.setItem("aura_user_info", JSON.stringify(updated));
        return updated;
      });
    }

    // 3. Update authored posts
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.userId === userId || post.username === targetUsername) {
          return { ...post, isVerified: targetVerified };
        }
        return post;
      })
    );

    // 4. Update stories authored
    setStories((prevStories) =>
      prevStories.map((st) => {
        if (st.userId === userId || st.username === targetUsername) {
          return { ...st, isVerified: targetVerified };
        }
        return st;
      })
    );

    // 5. Update reels authored
    setReels((prevReels) =>
      prevReels.map((rl) => {
        if (rl.userId === userId || rl.username === targetUsername) {
          return { ...rl, isVerified: targetVerified };
        }
        return rl;
      })
    );

    addAuditLog("TOGGLE_USER_VERIFICATION", `Selo verificado de @${targetUsername || userId} alterado para: ${targetVerified ? "Ativo 🔒" : "Inativo"}`);
  };

  // Content Upload distribution router
  const handlePublishContent = (data: {
    type: "image" | "video" | "carousel" | "file";
    media: string[];
    caption: string;
    hashtags: string[];
    location?: string;
    isScheduled?: boolean;
    isStory?: boolean;
    fileName?: string;
    fileSize?: string;
    fileType?: string;
  }) => {
    if (data.isStory) {
      const newStory: Story = {
        id: `story_${Math.random().toString()}`,
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
        media: data.media[0],
        type: data.type === "video" ? "video" : "image",
        isViewed: false,
        createdAt: "Agora",
      };
      setStories((prev) => [newStory, ...prev]);
      addAuditLog("PUBLISH_STORY", "No banner de 24 horas.");
    } else if (data.type === "video") {
      // Reels video format
      const newReel: Post = {
        id: `reel_${Math.random().toString()}`,
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
        type: "video",
        media: data.media,
        caption: data.caption,
        hashtags: data.hashtags,
        location: data.location,
        likesCount: 0,
        commentsCount: 0,
        hasLiked: false,
        hasSaved: false,
        createdAt: "Agora",
        comments: [],
        isScheduled: data.isScheduled,
      };
      setReels((prev) => [newReel, ...prev]);
      addAuditLog("PUBLISH_REEL", `Adicionado ao feed TikTok/Reels.`);
    } else {
      // Regular Feed Posts including PDFs / Doc attachments
      const newPost: Post = {
        id: `post_${Math.random().toString()}`,
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
        type: data.type,
        media: data.media,
        caption: data.caption,
        hashtags: data.hashtags,
        location: data.location,
        likesCount: 0,
        commentsCount: 0,
        hasLiked: false,
        hasSaved: false,
        createdAt: "Agora",
        comments: [],
        isScheduled: data.isScheduled,
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileType: data.type === "file" ? (data.fileType || "application/pdf") : undefined,
      };
      setPosts((prev) => [newPost, ...prev]);
      addAuditLog("PUBLISH_POST", `No feed público geral.`);
    }
  };

  // Marketplace Buy item
  const handleBuyMarketplaceItem = (price: number, itemName: string, seller: string) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, walletBalance: prev.walletBalance - price };
      localStorage.setItem("aura_user_info", JSON.stringify(updated));
      return updated;
    });
    addAuditLog("BUY_MARKETPLACE", `Adquirido recurso: "${itemName}" de @${seller}.`);
  };

  const handleAddMarketItem = (item: MarketItem) => {
    addAuditLog("CREATE_MARKET_PRODUCT", `Postado produto R$ ${item.price.toFixed(2)}`);
  };

  // Smart Gemini recommendation algorithm trigger
  const handleSmartAISort = async () => {
    if (aiSorted) {
      // Reset to original sequence
      setPosts(INITIAL_POSTS);
      setAiSorted(false);
      return;
    }

    setIsSorting(true);
    addAuditLog("AI_RECOMMEND_SCORING", "Iniciando classificação heurística Aura AI.");

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInterests: ["minimalismo", "design", "uxui", "coding", "tech"],
          posts,
        }),
      });
      const data = await res.json();
      if (data.sortedPosts) {
        setPosts(data.sortedPosts);
        setAiSorted(true);
      }
    } catch (err) {
      // Local clean engagement sort fallback
      const sorted = [...posts].sort((a, b) => b.likesCount - a.likesCount);
      setPosts(sorted);
      setAiSorted(true);
    } finally {
      setIsSorting(false);
    }
  };

  // Render Splash First
  if (showSplash) {
    return <Splash onComplete={handleSplashComplete} />;
  }

  // Render Onboarding
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Render Authentication (Sign In & OTP Checks)
  if (showAuth || !isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  // Total unread notifications indicator count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      
      {/* Premium Top Navigation header bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 h-16 flex items-center px-4 justify-between max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white font-black shadow-[0_0_15px_rgba(139,92,246,0.30)]">
            ✨
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-650 dark:from-white dark:to-zinc-400">
            Aura Social
          </span>
        </div>

        {/* Action icons bar */}
        <div className="flex items-center gap-3">
          {/* Theme toggler */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 rounded-xl transition text-zinc-600 dark:text-zinc-400"
            id="theme-toggler"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400 animate-pulse" /> : <Moon className="w-4 h-4 text-violet-500" />}
          </button>
        </div>
      </header>

      {/* Main Screen Layout Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6">
        
        {/* Render Active view based on navigation path tab */}
        {activeTab === "feed" && (
          <div className="space-y-4">
            {/* 24h interactive Stories horizontal list */}
            <Stories
              stories={stories}
              onViewStory={handleViewStory}
              onReactStory={handleReactStory}
            />

            <Feed
              posts={posts}
              currentUser={currentUser}
              onLikePost={handleLikePost}
              onSavePost={handleSavePost}
              onAddComment={handleAddComment}
              onAISort={handleSmartAISort}
              aiSorted={aiSorted}
              isSorting={isSorting}
            />
          </div>
        )}

        {activeTab === "explore" && (
          <Explore
            posts={posts}
            onSelectHashtag={(tag) => {
              setActiveTab("feed");
              handleSmartAISort(); // sort or filter simulation
            }}
          />
        )}

        {activeTab === "reels" && (
          <Reels
            reels={reels}
            currentUser={currentUser}
            onLikeReel={(reelId) => {
              setReels((prev) =>
                prev.map((r) =>
                  r.id === reelId
                    ? { ...r, hasLiked: !r.hasLiked, likesCount: r.hasLiked ? r.likesCount - 1 : r.likesCount + 1 }
                    : r
                )
              );
              addAuditLog("LIKE_REEL", `Reel ID: ${reelId}`);
            }}
            onTipCreator={handleTipCreator}
          />
        )}

        {activeTab === "publish" && (
          <Publish onPublish={handlePublishContent} />
        )}

        {activeTab === "chat" && (
          <Chat
            channels={chats}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onAddChannel={handleAddChannel}
            registeredUsers={registeredUsers}
          />
        )}

        {activeTab === "marketplace" && (
          <Marketplace
            currentUser={currentUser}
            onBuyItem={handleBuyMarketplaceItem}
            onAddMarketItem={handleAddMarketItem}
          />
        )}

        {activeTab === "notifications" && (
          <Notifications
            notifications={notifications}
            onMarkAllRead={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
              addAuditLog("MARK_ALL_NOTIFICATIONS_READ", "Limpando notificações.");
            }}
          />
        )}

        {activeTab === "profile" && (
          <Profile
            user={currentUser}
            onLogout={handleLogout}
            savedPosts={posts.filter((p) => p.hasSaved)}
            userPosts={posts.filter((p) => p.userId === currentUser.id)}
            onUpdateBio={(bio, website, displayName) => {
              setCurrentUser((prev) => ({ ...prev, bio, website, displayName }));
              addAuditLog("UPDATE_PROFILE_BIO", "Campos bio atualizados.");
            }}
            onAddFunds={handleAddFunds}
            onBuyVerification={handleBuyVerification}
            onUpdateAvatar={handleUpdateAvatar}
            onWithdrawFunds={handleWithdrawFunds}
            onConnectStripeAccount={handleConnectStripeAccount}
          />
        )}

        {activeTab === "admin" && currentUser.role === "admin" && (
          <Admin
            currentUser={currentUser}
            usersCount={registeredUsers.length - 1} // exclude self for counts if wanted
            postsCount={posts.length}
            auditLogs={auditLogs}
            onAddAuditLog={addAuditLog}
            onClearLogs={() => setAuditLogs([])}
            reels={reels}
            registeredUsers={registeredUsers}
            onToggleUserVerification={handleToggleUserVerification}
          />
        )}
      </main>

      {/* Real-time Toast Messages overlay banner */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            onClick={() => {
              setActiveTab("chat");
              setActiveToast(null);
            }}
            className="fixed top-20 inset-x-4 max-w-sm mx-auto z-50 bg-black/95 text-white p-3.5 rounded-2xl border border-violet-500/40 shadow-2xl cursor-pointer flex items-center gap-3 active:scale-[0.98] transition-transform select-none"
            id="realtime-toast-notification"
          >
            <div className="relative shrink-0">
              <img
                src={activeToast.avatar}
                alt="Partner avatar"
                className="w-10 h-10 rounded-full object-cover border border-violet-500/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-zinc-900 rounded-full animate-ping" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-zinc-900 rounded-full" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <span className="text-[9px] uppercase font-bold text-violet-400 font-mono tracking-widest block">Mensagem em Tempo Real 💬</span>
              <h4 className="text-xs font-bold truncate mt-0.5">{activeToast.displayName}</h4>
              <p className="text-[11px] text-zinc-300 truncate mt-0.5">{activeToast.text}</p>
            </div>
            <div className="text-[9px] text-zinc-400 font-bold shrink-0 uppercase tracking-wider bg-zinc-800 px-2 py-1 rounded-lg">
              Ver
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Bar Navigation System - Beautiful floating island dock */}
      <nav className="fixed bottom-4 inset-x-0 z-30 max-w-lg mx-auto px-4 select-none">
        <div className="glass-effect-dark dark:bg-zinc-950/90 rounded-2xl py-2.5 px-4 flex items-center justify-between shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-white/5 dark:border-zinc-900">
          
          <button
            onClick={() => setActiveTab("feed")}
            className={`p-2 rounded-xl transition ${
              activeTab === "feed" ? "text-violet-400 bg-white/5" : "text-zinc-400 hover:text-white"
            }`}
            id="nav-btn-feed"
            title="Início"
          >
            <Home className="w-5.5 h-5.5" />
          </button>

          <button
            onClick={() => setActiveTab("explore")}
            className={`p-2 rounded-xl transition ${
              activeTab === "explore" ? "text-violet-400 bg-white/5" : "text-zinc-400 hover:text-white"
            }`}
            id="nav-btn-explore"
            title="Explorar"
          >
            <Compass className="w-5.5 h-5.5" />
          </button>

          <button
            onClick={() => setActiveTab("reels")}
            className={`p-2 rounded-xl transition ${
              activeTab === "reels" ? "text-violet-400 bg-white/5" : "text-zinc-400 hover:text-white"
            }`}
            id="nav-btn-reels"
            title="Reels"
          >
            <Film className="w-5.5 h-5.5 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab("publish")}
            className={`p-2 rounded-xl transition ${
              activeTab === "publish" ? "text-violet-400 bg-white/5" : "text-zinc-400 hover:text-white"
            }`}
            id="nav-btn-publish"
            title="Publicar"
          >
            <PlusSquare className="w-5.5 h-5.5" />
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`p-2 rounded-xl transition relative ${
              activeTab === "chat" ? "text-violet-400 bg-white/5" : "text-zinc-400 hover:text-white"
            }`}
            id="nav-btn-chat"
            title="Mensagens"
          >
            <MessageSquare className="w-5.5 h-5.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-400 rounded-full" />
          </button>

          <button
            onClick={() => setActiveTab("marketplace")}
            className={`p-2 rounded-xl transition ${
              activeTab === "marketplace" ? "text-violet-400 bg-white/5" : "text-zinc-400 hover:text-white"
            }`}
            id="nav-btn-market"
            title="Marketplace"
          >
            <ShoppingBag className="w-5.5 h-5.5" />
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`p-2 rounded-xl transition relative ${
              activeTab === "notifications" ? "text-violet-400 bg-white/5" : "text-zinc-400 hover:text-white"
            }`}
            id="nav-btn-notifications"
            title="Notificações"
          >
            <Heart className="w-5.5 h-5.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`p-2 rounded-xl transition ${
              activeTab === "profile" ? "text-violet-400 bg-white/5" : "text-zinc-400 hover:text-white"
            }`}
            id="nav-btn-profile"
            title="Perfil"
          >
            <UserIcon className="w-5.5 h-5.5" />
          </button>

          {currentUser.role === "admin" && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`p-2 rounded-xl transition ${
                activeTab === "admin" ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-400 hover:text-emerald-400"
              }`}
              id="nav-btn-admin"
              title="Painel Admin"
            >
              <ShieldAlert className="w-5.5 h-5.5 animate-pulse" />
            </button>
          )}

        </div>
      </nav>

    </div>
  );
}

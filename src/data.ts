import { Post, Story, ChatChannel, Notification, User, MarketItem } from "./types";

export const INITIAL_USER: User = {
  id: "user_me",
  username: "joaopedro",
  displayName: "João Pedro",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  bio: "Conectando arte, tecnologia e inteligência em uma nova era social. ✨ Prototipando o futuro.",
  website: "aura.social/joaopedro",
  followersCount: 1420,
  followingCount: 382,
  isVerified: true,
  isCreator: true,
  walletBalance: 245.50,
  role: "creator"
};

export const SEED_USERS = [
  {
    id: "user_alice",
    username: "alice_design",
    displayName: "Alice Ferreira",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    isVerified: true,
  },
  {
    id: "user_bruno",
    username: "bruno_dev",
    displayName: "Bruno Tech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    isVerified: false,
  },
  {
    id: "user_clara",
    username: "clara_art",
    displayName: "Clara G.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    isVerified: true,
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: "story_1",
    userId: "user_alice",
    username: "alice_design",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    isVerified: true,
    media: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&h=1000&q=80", // Retro Computer Setup / Neon
    type: "image",
    isViewed: false,
    createdAt: "2h atrás",
    reactionsCount: 12
  },
  {
    id: "story_2",
    userId: "user_clara",
    username: "clara_art",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    isVerified: true,
    media: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&h=1000&q=80", // Design agency layout
    type: "image",
    isViewed: false,
    createdAt: "4h atrás",
    reactionsCount: 8
  },
  {
    id: "story_3",
    userId: "user_bruno",
    username: "bruno_dev",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    isVerified: false,
    media: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&h=1000&q=80", // Code editing editor
    type: "image",
    isViewed: false,
    createdAt: "6h atrás",
    reactionsCount: 22
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "post_1",
    userId: "user_alice",
    username: "alice_design",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    isVerified: true,
    type: "image",
    media: ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&h=600&q=80"],
    caption: "Explorando os limites do design minimalista no desenvolvimento de produtos web e mobile. O foco absoluto na tipografia e no contraste faz toda a diferença.",
    hashtags: ["minimalismo", "design", "uxui", "threads", "aura"],
    location: "São Paulo, Brasil",
    likesCount: 154,
    commentsCount: 3,
    hasLiked: false,
    hasSaved: false,
    createdAt: "1 dia atrás",
    comments: [
      {
        id: "c1_1",
        username: "bruno_dev",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
        text: "Incrível! Esse contraste de fontes é exatamente o que eu busco nos meus projetos.",
        createdAt: "18h atrás",
        likesCount: 5
      },
      {
        id: "c1_2",
        username: "clara_art",
        userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
        text: "Uma verdadeira obra de arte digital! 🎨",
        createdAt: "12h atrás",
        likesCount: 2
      }
    ]
  },
  {
    id: "post_2",
    userId: "user_bruno",
    username: "bruno_dev",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    isVerified: false,
    type: "carousel",
    media: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&h=600&q=80", // IDE VS Code Code
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&h=600&q=80"  // Multi Monitor Terminal Setup
    ],
    caption: "Minha nova stack favorita para 2026: TypeScript, NestJS e WebSockets de ultrabaixa latência. A fluidez que o usuário percebe é incomparável.",
    hashtags: ["backend", "developers", "coding", "nextjs", "tech"],
    location: "Florianópolis, Brasil",
    likesCount: 89,
    commentsCount: 1,
    hasLiked: false,
    hasSaved: false,
    createdAt: "2 dias atrás",
    comments: [
      {
        id: "c2_1",
        username: "alice_design",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
        text: "Código limpo e organização fantástica. Parabéns pela escolha!",
        createdAt: "1 dia atrás",
        likesCount: 4
      }
    ]
  }
];

export const INITIAL_REELS: Post[] = [
  {
    id: "reel_1",
    userId: "user_clara",
    username: "clara_art",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    isVerified: true,
    type: "video",
    media: ["https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=600&h=1000&q=80"], // Hand painting canvas
    caption: "Pintando sentimentos em alta velocidade. O processo criativo sempre me liberta. Música: Ambient Deep Aura Live 🎵 #artistsoftiktok #timelapse #pintura #art #criativo",
    hashtags: ["art", "criativo", "timelapse", "reels"],
    likesCount: 2310,
    commentsCount: 147,
    hasLiked: false,
    hasSaved: false,
    createdAt: "3h atrás",
    comments: []
  },
  {
    id: "reel_2",
    userId: "user_bruno",
    username: "bruno_dev",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    isVerified: false,
    type: "video",
    media: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&h=1000&q=80"], // Abstract wave design animation frame
    caption: "Renderizando fractais no novo motor WebGL no navegador. 60 FPS garantidos de beleza matemática! 💻🌀 #mathematics #webgl #codinglife #techreels",
    hashtags: ["webgl", "codinglife", "techreels", "programming"],
    likesCount: 1740,
    commentsCount: 89,
    hasLiked: false,
    hasSaved: false,
    createdAt: "1 dia atrás",
    comments: []
  }
];

export const INITIAL_CHATS: ChatChannel[] = [
  {
    id: "chat_1",
    partner: {
      id: "user_alice",
      username: "alice_design",
      displayName: "Alice Ferreira",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      isOnline: true
    },
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        senderId: "user_alice",
        text: "Oi! Vi seu último post e adorei o design da Aura. Você fez com Framer Motion?",
        createdAt: "10:15",
        isRead: false
      },
      {
        id: "m2",
        senderId: "user_alice",
        text: "Estou super interessada em colaborar num projeto de NFT minimalista.",
        createdAt: "10:16",
        isRead: false
      }
    ]
  },
  {
    id: "chat_2",
    partner: {
      id: "user_bruno",
      username: "bruno_dev",
      displayName: "Bruno Tech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      isOnline: false
    },
    unreadCount: 0,
    messages: [
      {
        id: "m3",
        senderId: "user_me",
        text: "E aí Bruno, rodou os testes de latência?",
        createdAt: "Ontem, 22:40",
        isRead: true
      },
      {
        id: "m4",
        senderId: "user_bruno",
        text: "Sim! Latência caiu de 120ms para incríveis 18ms usando Cloudflare e Redis cache local. Muito redondo!",
        createdAt: "Ontem, 22:45",
        isRead: true
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n_1",
    type: "like",
    userId: "user_alice",
    username: "alice_design",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    text: "curtiu sua publicação de design inteligente.",
    postMedia: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=80&h=80&q=80",
    createdAt: "2 min atrás",
    isRead: false
  },
  {
    id: "n_2",
    type: "comment",
    userId: "user_bruno",
    username: "bruno_dev",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    text: "comentou: 'Código limpo demais! 🔥'",
    postMedia: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=80&h=80&q=80",
    createdAt: "15 min atrás",
    isRead: false
  },
  {
    id: "n_3",
    type: "tip",
    userId: "user_clara",
    username: "clara_art",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    text: "enviou uma gorjeta de R$ 50,00 pelo PIX.",
    createdAt: "1h atrás",
    isRead: true
  }
];

export const MARKET_ITEMS: MarketItem[] = [
  {
    id: "m_item_1",
    title: "Preset Fotográfico Light Cyberpunk",
    description: "Pack com 12 presets luxuosos para Lightroom Mobile/Desktop, ideais para fotos noturnas com luzes LED neon e estilo urbano cibernético.",
    price: 39.90,
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=300&h=200&q=80",
    sellerUsername: "alice_design",
    createdAt: "2026-05-28"
  },
  {
    id: "m_item_2",
    title: "Template Aura UI Figma Pro",
    description: "Um kit de design de interface moderno em Figma contendo 80+ telas responsivas para aplicativos e sites com tema escuro elegante.",
    price: 89.00,
    image: "https://images.unsplash.com/photo-1541462608141-27b2c7453166?auto=format&fit=crop&w=300&h=200&q=80",
    sellerUsername: "clara_art",
    createdAt: "2026-05-27"
  }
];

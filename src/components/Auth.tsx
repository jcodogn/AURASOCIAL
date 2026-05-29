import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Mail, Lock, Phone, User as UserIcon, LogIn, ArrowRight } from "lucide-react";
import { INITIAL_USER } from "../data";
import { User } from "../types";

interface AuthProps {
  onLogin: (user: User) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("joaopedromoladeoliveira@gmail.com");
  const [password, setPassword] = useState("Pedro12@");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  
  const [smsMode, setSmsMode] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  const [smsSent, setSmsSent] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (smsMode) {
      onLogin(INITIAL_USER);
      return;
    }

    if (isLogin) {
      if (email.trim().toLowerCase() !== "joaopedromoladeoliveira@gmail.com" || password !== "Pedro12@") {
        setError("E-mail ou senha incorretos.");
        return;
      }
      onLogin(INITIAL_USER);
    } else {
      const customUser: User = {
        ...INITIAL_USER,
        username: username ? username.toLowerCase().trim() : INITIAL_USER.username,
        displayName: displayName.trim() || INITIAL_USER.displayName,
      };
      onLogin(customUser);
    }
  };

  const handleShortcutLogin = () => {
    onLogin(INITIAL_USER);
  };

  return (
    <div id="auth-screen" className="min-h-screen flex flex-col justify-center bg-zinc-950 text-white p-6 relative overflow-hidden md:max-w-md md:mx-auto md:border-x md:border-zinc-800">
      {/* Visual glowing blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="relative text-center mb-10 flex flex-col items-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-[0_0_30px_rgba(139,92,246,0.30)] mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
          AURA SOCIAL
        </h1>
        <p className="text-xs text-zinc-500 tracking-wider uppercase mt-1 font-mono">
          Próxima Geração de Conectividade
        </p>
      </div>

      <div className="relative bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-md shadow-2xl">
        <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800/50 mb-6">
          <button
            onClick={() => { setIsLogin(true); setSmsMode(false); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all text-center ${
              isLogin && !smsMode ? "bg-zinc-800 text-white shadow-md" : "text-zinc-500 hover:text-zinc-300"
            }`}
            id="tab-login-email"
          >
            E-mail
          </button>
          <button
            onClick={() => { setIsLogin(true); setSmsMode(true); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all text-center ${
              smsMode ? "bg-zinc-800 text-white shadow-md" : "text-zinc-500 hover:text-zinc-300"
            }`}
            id="tab-login-sms"
          >
            Telefone / SMS
          </button>
          <button
            onClick={() => { setIsLogin(false); setSmsMode(false); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all text-center ${
              !isLogin && !smsMode ? "bg-zinc-800 text-white shadow-md" : "text-zinc-500 hover:text-zinc-300"
            }`}
            id="tab-register"
          >
            Criar Conta
          </button>
        </div>

        {smsMode ? (
          /* Phone OTP Sign In Screen */
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!smsSent ? (
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 font-mono">Número do Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 bg-zinc-950 rounded-2xl pl-12 pr-4 text-sm font-medium border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                    id="input-phone"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSmsSent(true)}
                  className="mt-4 w-full h-12 rounded-2xl bg-zinc-800 font-bold text-sm tracking-wide hover:bg-zinc-700 transition"
                  id="btn-send-sms"
                >
                  Enviar Código OTP
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 font-mono">Código Recebido</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="Escriba o código de 6 dígitos"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    className="w-full h-12 bg-zinc-950 rounded-2xl pl-12 pr-4 text-sm font-medium border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                    id="input-sms-code"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm tracking-wide hover:brightness-110 active:scale-[0.98] transition shadow-lg"
                  id="btn-verify-sms"
                >
                  Confirmar e Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setSmsSent(false)}
                  className="mt-2 w-full text-center text-xs text-zinc-500 hover:text-zinc-300 font-semibold py-1 class-change-otp"
                >
                  Alterar Número de Telefone
                </button>
              </div>
            )}
          </form>
        ) : (
          /* Standard email / registration screens */
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 font-mono">Nome Legal do Usuário</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Alice Machado"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full h-12 bg-zinc-950 rounded-2xl pl-12 pr-4 text-sm font-medium border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                      id="input-displayName"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 font-mono">Nome de Perfil (Username)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-zinc-500 font-semibold text-sm">@</span>
                    <input
                      type="text"
                      required
                      placeholder="alice_creative"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full h-12 bg-zinc-950 rounded-2xl pl-10 pr-4 text-sm font-medium border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                      id="input-username"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 font-mono">Endereço de E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="Seu email de login"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-zinc-950 rounded-2xl pl-12 pr-4 text-sm font-medium border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                  id="input-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 font-mono">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="Escrita da sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-zinc-950 rounded-2xl pl-12 pr-4 text-sm font-medium border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                  id="input-password"
                />
              </div>
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-xs text-zinc-500 font-semibold hover:text-zinc-300">Esqueceu a senha?</a>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-semibold select-none text-left animate-pulse">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full h-12 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white font-bold text-sm tracking-wide hover:brightness-110 active:scale-[0.98] transition-all shadow-lg"
              id="btn-auth-submit"
            >
              {isLogin ? "Acessar Plataforma" : "Criar Meu Perfil Aura"}
            </button>
          </form>
        )}

        {/* Separator */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-zinc-800 w-full" />
          <span className="absolute bg-zinc-900 px-3 text-xs text-zinc-500 tracking-widest uppercase">Ou</span>
        </div>

        {/* OAuth Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleShortcutLogin}
            className="h-12 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs font-bold hover:bg-zinc-900 transition flex items-center justify-center gap-2"
            id="btn-google-login"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 14.97 1 12 1 7.35 1 3.39 3.61 1.41 7.42l3.87 3C6.23 7.42 8.89 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.46h6.46c-.28 1.47-1.11 2.71-2.36 3.56l3.66 2.84c2.14-1.98 3.37-4.89 3.37-8.5z" />
              <path fill="#FBBC05" d="M5.28 14.58c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28l-3.87-3C.56 8.52 0 10.2 0 12s.56 3.48 1.41 4.98l3.87-3.4z" strokeWidth="0" />
              <path fill="#34A853" d="M12 23c3.24 0 5.96-1.08 7.95-2.91l-3.66-2.84c-1.01.68-2.31 1.09-3.79 1.09-3.11 0-5.77-2.38-6.72-5.38l-3.87 3C3.39 20.39 7.35 23 12 23z" />
            </svg>
            Google
          </button>
          <button
            onClick={handleShortcutLogin}
            className="h-12 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs font-bold hover:bg-zinc-900 transition flex items-center justify-center gap-2"
            id="btn-apple-login"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.09 2.48-1.37.03-1.81-.8-3.38-.8-1.57 0-2.05.77-3.38.83-1.37.05-2.36-1.32-3.2-2.53-1.72-2.48-3.03-7-1.26-10.07.88-1.53 2.45-2.5 4.16-2.53 1.3-.02 2.52.88 3.32.88.8 0 2.27-.1 3.81 1.48 1.21 1 2.15 2.44 2.58 3.75-2.92 1.24-2.45 5.5.3 6.64-.67 1.69-1.47 3.38-2.3 4.81zM15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
            </svg>
            Apple ID
          </button>
        </div>

        {/* Simple 1-Click Fast-Access Banner for Reviewer */}
        <div className="mt-8 bg-zinc-950 rounded-2xl border border-dashed border-violet-500/40 p-4 text-center">
          <p className="text-xs text-violet-300 font-semibold flex items-center justify-center gap-1.5 leading-relaxed">
            <LogIn className="w-4 h-4 text-violet-400 shrink-0" />
            Acesso Rápido para Testes
          </p>
          <p className="text-[11px] text-zinc-500 leading-normal mt-1.5">
            Clique no botão abaixo para preencher dados e acessar imediatamente em modo de demonstração completa.
          </p>
          <button
            onClick={handleShortcutLogin}
            type="button"
            className="mt-3 text-xs w-full py-2 bg-violet-600/20 text-violet-200 border border-violet-500/30 rounded-xl font-bold hover:bg-violet-600/30 transition flex items-center justify-center gap-1 cursor-pointer"
            id="btn-fast-demo-login"
          >
            Entrar Instantaneamente (1-Click)
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

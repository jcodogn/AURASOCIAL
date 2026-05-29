import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Film, Coins, Check } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Vibrante & Fluido",
    description: "Navegue em um feed moderno com fotos incríveis, stories dinâmicos e reels viciantes em alta velocidade.",
    icon: Film,
    color: "from-violet-600 to-indigo-600",
    gradientColor: "text-violet-400"
  },
  {
    "title": "Aura AI Integrada",
    "description": "Gere legendas surpreendentes com inteligência artificial e mantenha sua comunidade segura com nossa barreira antitoxina instantânea.",
    "icon": Sparkles,
    "color": "from-fuchsia-600 to-pink-600",
    "gradientColor": "text-fuchsia-400"
  },
  {
    "title": "Sua Economia Criativa",
    "description": "Monetize de verdade! Ganhe gorjetas via PIX ou Stripe, gerencie sua carteira digital e venda assinaturas premium de criador.",
    "icon": Coins,
    "color": "from-amber-500 to-orange-600",
    "gradientColor": "text-wrap text-amber-400"
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const stepInfo = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const IconComponent = stepInfo.icon;

  return (
    <div id="onboarding-screen" className="fixed inset-0 z-40 flex flex-col justify-between bg-zinc-950 text-white p-6 select-none md:max-w-md md:mx-auto md:border-x md:border-zinc-800">
      {/* Background visual detail */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-zinc-950 to-zinc-950 pointer-events-none" />

      {/* Skip button header */}
      <div className="relative z-10 flex justify-end">
        <button
          onClick={onComplete}
          className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors py-1 px-3 rounded-full hover:bg-zinc-900"
          id="btn-skip-onboarding"
        >
          Pular
        </button>
      </div>

      {/* Card Carousel */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center max-w-sm px-4"
          >
            {/* Hologram icon pedestal */}
            <div className={`flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr ${stepInfo.color} p-[1px] shadow-2xl shadow-violet-500/20 mb-8`}>
              <div className="flex items-center justify-center w-full h-full bg-zinc-900 rounded-full">
                <IconComponent className={`w-10 h-10 ${stepInfo.gradientColor}`} />
              </div>
            </div>

            {/* Slide Title */}
            <h2 className="text-3xl font-extrabold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-300">
              {stepInfo.title}
            </h2>

            {/* Slide Description */}
            <p className="mt-4 text-zinc-400 text-base leading-relaxed">
              {stepInfo.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom control bar */}
      <div className="relative z-10 flex flex-col gap-6 mb-8">
        {/* Step dots INDICATOR */}
        <div className="flex justify-center gap-2">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? "w-6 bg-violet-500" : "w-2 bg-zinc-800"
              }`}
            />
          ))}
        </div>

        {/* Dynamic primary button */}
        <button
          onClick={handleNext}
          className="w-full h-14 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(139,92,246,0.30)] cursor-pointer"
          id="btn-next-onboarding"
        >
          {currentStep === STEPS.length - 1 ? (
            <>
              Começar Agora
              <Check className="w-5 h-5" />
            </>
          ) : (
            <>
              Próximo
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

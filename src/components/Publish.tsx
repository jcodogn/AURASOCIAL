import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Sparkles, AlertCircle, RefreshCw, Send, CheckCircle2, Film, Image as ImageIcon, Video, Layers, FileText } from "lucide-react";

interface PublishProps {
  onPublish: (postData: {
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
  }) => void;
}

export default function Publish({ onPublish }: PublishProps) {
  const [publishType, setPublishType] = useState<"image" | "video" | "story" | "file">("image");
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  
  // File metadata for high-scale media
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileType, setFileType] = useState("");

  // Gemini smart caption helper states
  const [aiKeyword, setAiKeyword] = useState("");
  const [aiTone, setAiTone] = useState("criativo e engajador");
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [aiResponseStatus, setAiResponseStatus] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // File drop and raw conversion helpers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type);
      
      const sizeMB = file.size / (1024 * 1024);
      setFileSize(sizeMB < 1 ? `${(file.size / 1024).toFixed(1)} KB` : `${sizeMB.toFixed(1)} MB`);
      
      // Auto-switch tabs based on type
      if (file.type.startsWith("video/")) {
        setPublishType("video");
      } else if (file.type === "application/pdf" || (!file.type.startsWith("image/") && !file.type.startsWith("video/"))) {
        setPublishType("file");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type);
      
      const sizeMB = file.size / (1024 * 1024);
      setFileSize(sizeMB < 1 ? `${(file.size / 1024).toFixed(1)} KB` : `${sizeMB.toFixed(1)} MB`);

      if (file.type.startsWith("video/")) {
        setPublishType("video");
      } else if (file.type === "application/pdf" || (!file.type.startsWith("image/") && !file.type.startsWith("video/"))) {
        setPublishType("file");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Triggers the real backend API call with Gemini model parameter
  const handleAIGenerateCaption = async () => {
    if (!aiKeyword.trim()) {
      setAiResponseStatus("⚠️ Digite palavras-chave ou tema primeiro.");
      return;
    }

    setIsGeneratingCaption(true);
    setAiResponseStatus("Aura AI está analisando...");

    try {
      const res = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiKeyword, tone: aiTone }),
      });
      const data = await res.json();

      if (data.caption) {
        setCaption(data.caption);
        setAiResponseStatus(data.isFallback ? "✨ Legenda sugerida por heurística" : "✨ Legenda gerada com sucesso!");
      } else {
        setAiResponseStatus("⚠️ Falha ao obter retorno da Aura AI.");
      }
    } catch (err) {
      setAiResponseStatus("⚠️ Erro de conexão com o painel AI.");
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fallback image if no file was uploaded
    const finalMedia = mediaFile || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=600&q=80";

    // Split caption hashtags
    const parsedHashtags: string[] = [];
    const hashtagRegex = /#(\w+)/g;
    let match;
    while ((match = hashtagRegex.exec(caption)) !== null) {
      parsedHashtags.push(match[1]);
    }

    onPublish({
      type: publishType === "story" ? "image" : publishType,
      media: [finalMedia],
      caption: caption,
      hashtags: parsedHashtags.length > 0 ? parsedHashtags : ["auravibe", "creators"],
      location: location || undefined,
      isScheduled,
      isStory: publishType === "story",
      fileName: fileName || undefined,
      fileSize: fileSize || undefined,
      fileType: fileType || undefined,
    });

    setPublishSuccess(true);
    // clean up form
    setTimeout(() => {
      setPublishSuccess(false);
      setMediaFile(null);
      setCaption("");
      setLocation("");
      setIsScheduled(false);
      setAiKeyword("");
      setFileName("");
      setFileSize("");
      setFileType("");
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 text-left" id="publish-component">
      {/* Tab Navigation header */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-widest uppercase">Criar Nova Publicação</span>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Escolha o formato ideal</span>
        </div>

        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setPublishType("image")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              publishType === "image" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500"
            }`}
            id="tab-publish-post"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Post
          </button>
          <button
            type="button"
            onClick={() => setPublishType("video")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              publishType === "video" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500"
            }`}
            id="tab-publish-reel"
          >
            <Film className="w-3.5 h-3.5" />
            Reel
          </button>
          <button
            type="button"
            onClick={() => setPublishType("story")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              publishType === "story" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500"
            }`}
            id="tab-publish-story"
          >
            <Layers className="w-3.5 h-3.5" />
            Story
          </button>
          <button
            type="button"
            onClick={() => setPublishType("file")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              publishType === "file" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500"
            }`}
            id="tab-publish-file"
          >
            <FileText className="w-3.5 h-3.5" />
            Arquivo
          </button>
        </div>
      </div>

      {publishSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center space-y-3"
          id="publish-success-banner"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
          <h3 className="text-base font-bold text-emerald-400">Publicado com Sucesso!</h3>
          <p className="text-xs text-zinc-400">Conteúdo distribuído instantaneamente em todos os nós CDN do Aura Social.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Grid upload file pane */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Drag Drop Box area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="bg-white dark:bg-zinc-950 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative aspect-square group overflow-hidden"
            >
              {mediaFile ? (
                <>
                  {publishType === "file" ? (
                    <div className="flex flex-col items-center justify-center p-4">
                      <FileText className="w-16 h-16 text-rose-500 mb-2 stroke-1 animate-bounce" />
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block truncate max-w-[200px]">
                        {fileName || "documento_anexo.pdf"}
                      </span>
                      <span className="text-[10px] text-zinc-500 block font-mono mt-2">
                        {fileSize || "Ilimitado"} | {fileType || "application/pdf"}
                      </span>
                    </div>
                  ) : publishType === "video" ? (
                    <div className="w-full h-full relative">
                      <video
                        src={mediaFile}
                        controls
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </div>
                  ) : (
                    <img
                      src={mediaFile}
                      alt="Uploaded preview item"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMediaFile(null);
                      setFileName("");
                      setFileSize("");
                      setFileType("");
                    }}
                    className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold text-white hover:bg-black transition-all cursor-pointer z-10"
                    id="btn-remove-preview"
                  >
                    Remover
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 mx-auto border border-zinc-100 dark:border-zinc-800/80">
                    <Upload className="w-7 h-7 stroke-1" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200 block">Arraste seus arquivos aqui</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block">Fotos, Vídeos HD, PDFs, arquivos Zip, etc.</span>
                  </div>
                  <label className="cursor-pointer inline-block py-2 px-4 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-lg transition duration-200">
                    Selecionar Qualquer Arquivo
                    <input
                      type="file"
                      accept="*/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="input-real-upload-file"
                    />
                  </label>
                  <p className="text-[9px] text-emerald-500 dark:text-emerald-400 max-w-[200px] mx-auto leading-normal font-mono font-bold">
                    ⚡ Sem limites de tamanho ou MB (Configurações CDN otimizadas no Aura Social)
                  </p>
                </div>
              )}
            </div>

            {/* AI Assistant Side box */}
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800/80 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-violet-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">Assistente Aura AI</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Ideia do Post / Palavras-chave</label>
                  <input
                    type="text"
                    placeholder="Ex: cafeteria aconchegante, domingo cinza focado em programar"
                    value={aiKeyword}
                    onChange={(e) => setAiKeyword(e.target.value)}
                    className="w-full bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none focus:border-violet-500"
                    id="input-ai-keywords"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Tom de Voz</label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-xs text-white outline-none focus:border-violet-500"
                    id="select-ai-tone"
                  >
                    <option value="jovial, empolgado e com emojis">Jovial e Moderno</option>
                    <option value="minimalista, poetico e sutil">Minimalista e Poético</option>
                    <option value="profissional, focado em tech, linkedin">Técnico e Corporativo</option>
                    <option value="engajador, focado em virar trend">Viralizador Reels</option>
                  </select>
                </div>

                {aiResponseStatus && (
                  <p className="text-[11px] text-violet-300 font-semibold bg-violet-950/40 p-2 rounded-xl border border-violet-500/10">
                    {aiResponseStatus}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleAIGenerateCaption}
                disabled={isGeneratingCaption}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition mt-4"
                id="btn-ai-generate-caption"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingCaption ? "animate-spin" : ""}`} />
                Escrever Legenda com Aura AI
              </button>
            </div>
          </div>

          {/* Caption and location text fields card */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-6 rounded-3xl space-y-4">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-mono">Meta Informações</h4>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Legenda Final</label>
              <textarea
                placeholder="Escreva algo inspirador ou use a sugestão inteligente da nossa Aura AI..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-805 text-xs font-medium text-zinc-800 dark:text-zinc-200 outline-none focus:border-violet-500 min-h-[100px]"
                required
                id="input-create-caption"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Geolocalização</label>
                <input
                  type="text"
                  placeholder="Ex: Rio de Janeiro, Brasil"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-805 text-xs font-medium text-zinc-800 dark:text-zinc-200 outline-none focus:border-violet-500"
                  id="input-create-location"
                />
              </div>

              {/* Scheduling simulation checkbox */}
              <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-805">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded border-zinc-300 focus:ring-violet-500"
                  id="checkbox-schedule"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200 block">Agendar Post</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">Publicação agendada baseada na UTC local</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(139,92,246,0.30)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
            id="btn-submit-publish"
          >
            Começar Distribuição Social
            <Send className="w-4 h-4 whitespace-nowrap" />
          </button>
        </form>
      )}
    </div>
  );
}

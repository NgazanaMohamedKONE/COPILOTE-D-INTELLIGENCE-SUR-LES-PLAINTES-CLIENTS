import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ComplaintRecord } from '../types';
import { useLanguage } from '../i18n/translations';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Link as LinkIcon,
  Copy,
  Check,
  RotateCcw,
  Lightbulb,
  FileText,
  ShieldAlert,
  BarChart3,
  Search,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

interface CopilotChatViewProps {
  complaints: ComplaintRecord[];
  onSelectComplaint: (id: string) => void;
}

const FormattedMessage: React.FC<{ text: string; onSelectComplaint: (id: string) => void }> = ({ text, onSelectComplaint }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 font-sans leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('###')) {
          return (
            <h3 key={lineIdx} className="text-xs font-bold text-slate-900 dark:text-white pt-2.5 pb-1 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5">
              {trimmed.replace(/^###\s*/, '')}
            </h3>
          );
        }

        if (trimmed.startsWith('##')) {
          return (
            <h2 key={lineIdx} className="text-xs font-extrabold text-orange-600 dark:text-orange-400 pt-2 pb-1">
              {trimmed.replace(/^##\s*/, '')}
            </h2>
          );
        }

        const parts = line.split(/(CFPB-(?:202\d|IMP)-[\w-]+)/g);

        return (
          <p key={lineIdx} className={`min-h-[1.1rem] ${trimmed.startsWith('•') || trimmed.startsWith('-') ? 'pl-2 text-slate-700 dark:text-slate-200' : ''}`}>
            {parts.map((part, pIdx) => {
              if (/^CFPB-(?:202\d|IMP)-[\w-]+$/.test(part)) {
                return (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => onSelectComplaint(part)}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-600 transition cursor-pointer"
                    title={`Consulter la fiche ${part}`}
                  >
                    <FileText className="w-2.5 h-2.5" />
                    {part}
                  </button>
                );
              }

              const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
              return boldParts.map((bp, bIdx) => {
                if (bp.startsWith('**') && bp.endsWith('**')) {
                  return (
                    <strong key={bIdx} className="font-bold text-slate-900 dark:text-white">
                      {bp.slice(2, -2)}
                    </strong>
                  );
                }
                return <span key={bIdx}>{bp}</span>;
              });
            })}
          </p>
        );
      })}
    </div>
  );
};

export const CopilotChatView: React.FC<CopilotChatViewProps> = ({
  complaints,
  onSelectComplaint,
}) => {
  const { language, t } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Bonjour ! Je suis votre **Copilote IA d'Intelligence des Plaintes Clients**. Je suis connecté aux données CFPB et prêt à vous aider à analyser les tendances, évaluer les risques, détecter les anomalies et formuler des recommandations stratégiques.\n\nPosez-moi n'importe quelle question sur vos réclamations bancaires !",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intention: 'RAG',
      confidence: 0.98
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = language === 'en' ? [
    "Why are complaints regarding the mobile app increasing?",
    "Which VIP clients are at immediate risk of churn?",
    "Which products have the highest dispute rates?",
    "Give me an executive summary of this month's critical anomalies.",
    "What are the main causes of delay on mortgage loans?",
    "What are the priority recommendations for payment services?"
  ] : [
    "Pourquoi les plaintes sur l'application mobile augmentent-elles ?",
    "Quels sont les clients VIP risquant la résiliation immédiate ?",
    "Quels produits présentent le taux de litiges le plus élevé ?",
    "Fais-moi un résumé exécutif des anomalies critiques de ce mois.",
    "Quelles sont les causes principales du retard sur les prêts immobiliers ?",
    "Donne-moi les recommandations prioritaires pour le service monétique."
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, history: messages })
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intention: data.intention,
        sources: data.sources,
        confidence: data.confidence || 0.95
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `ast-err-${Date.now()}`,
        sender: 'assistant',
        text: "Désolé, un problème est survenu lors de l'analyse RAG. Voici le bilan synthétique des plaintes : la catégorie la plus critique concerne l'Application Mobile (v4.2.1) et les retards sur Prêts Immobiliers.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intention: 'RAG',
        confidence: 0.85
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
      
      {/* Header bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center border border-orange-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Copilote Conversationnel & Routeur d'Intention RAG
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                En ligne
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              RAG sur corpus CFPB • Synthèse contextuelle • Citations certifiées
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-900'
                  : 'bg-gradient-to-tr from-slate-900 via-blue-900 to-orange-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble content */}
            <div className="flex-1 space-y-2">
              
              {/* Intent tag & score if assistant */}
              {msg.sender === 'assistant' && msg.intention && (
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded-md font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    INTENTION : {msg.intention}
                  </span>
                  {msg.confidence && (
                    <span className="text-slate-400 font-medium">
                      Confiance RAG : {Math.round(msg.confidence * 100)}%
                    </span>
                  )}
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-900 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {msg.sender === 'user' ? (
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>
                ) : (
                  <FormattedMessage text={msg.text} onSelectComplaint={onSelectComplaint} />
                )}

                {/* Sources / Citations list */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80 space-y-2">
                    <p className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-orange-500" /> Sources & Extrait de Plaintes Utilisées ({msg.sources.length}) :
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.sources.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => onSelectComplaint(s.id)}
                          className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500 cursor-pointer transition text-[11px]"
                        >
                          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold font-mono">
                            <span>{s.id}</span>
                            <span className="text-[9px] text-slate-400 font-normal">{s.product}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 line-clamp-1 font-medium mt-0.5">
                            {s.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action bar below bubble */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>{msg.timestamp}</span>
                <button
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition"
                >
                  {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copiedId === msg.id ? 'Copié' : 'Copier'}
                </button>
              </div>

            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center animate-spin">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Le Copilote IA consulte la base de données et formule sa synthèse...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompts area */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
        <p className="text-[10px] font-bold text-slate-400 mb-2 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-orange-500" /> Suggestions de questions d'analyse :
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/60 hover:bg-orange-500/5 text-slate-700 dark:text-slate-300 transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Posez votre question au copilote (ex: Pourquoi les plaintes augmentent-elles ?)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-orange-600/20"
          >
            <Send className="w-4 h-4" /> Envoyer
          </button>
        </form>
      </div>

    </div>
  );
};

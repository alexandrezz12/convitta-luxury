import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Sparkles, ChevronRight, Play, 
  Eye, Laptop, Gift, Calendar, Mail, ArrowRight
} from 'lucide-react';
import { Template } from '../types';
import { templates } from '../data';

interface LandingPageProps {
  onSelectTemplate: (template: Template) => void;
  onOpenDashboardDemo: () => void;
  onPreviewTemplate: (template: Template) => void;
  onOpenLogin: () => void;
}

export default function LandingPage({ onSelectTemplate, onOpenDashboardDemo, onPreviewTemplate, onOpenLogin }: LandingPageProps) {
  const [styleFilter, setStyleFilter] = useState<'all' | 'Classic' | 'Modern' | 'Minimalist'>('all');

  const filteredTemplates = styleFilter === 'all' 
    ? templates 
    : templates.filter(t => t.styleCategory === styleFilter);

  const stats = [
    { value: '+12.000', label: 'Casamentos Realizados' },
    { value: 'R$ 0', label: 'Comissão sobre Presentes' },
    { value: '100%', label: 'Confirmação RSVP Instantânea' },
    { value: '4.9/5', label: 'Avaliação dos Clientes' }
  ];

  const faqs = [
    {
      q: 'Como recebo o valor dos presentes da lista?',
      a: 'Você cadastra a sua própria chave Pix no painel. Quando o convidado escolhe um presente, nós geramos um Pix Copia e Cola e QR Code apontando diretamente para a sua conta. Não cobramos comissão e o dinheiro cai na hora!'
    },
    {
      q: 'Posso alterar as informações do convite depois de comprar?',
      a: 'Sim! Com o seu acesso ao painel de controle, você pode editar qualquer informação (horário, local, fotos, história, trajes, presentes) a qualquer momento e quantas vezes quiser.'
    },
    {
      q: 'Consigo testar e pré-visualizar os templates antes de pagar?',
      a: 'Sim! Basta clicar no botão "Pré-visualizar" em qualquer template do nosso catálogo abaixo. Você verá o convite completo, simulando exatamente como ele aparecerá no celular ou computador dos seus convidados.'
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
      
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100 py-4 px-6 md:px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-700 to-amber-900 flex items-center justify-center text-white shadow-md">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="text-xl font-wedding-serif tracking-widest text-stone-900 font-bold">
            CONVITTA
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={onOpenLogin}
            className="text-xs font-bold text-stone-850 hover:text-amber-800 transition-colors py-2 px-3 cursor-pointer"
          >
            Acessar Meu Painel
          </button>
          <button 
            onClick={onOpenDashboardDemo}
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors py-2 px-3 cursor-pointer"
          >
            <Laptop className="w-3.5 h-3.5" /> Ver Demonstração do Painel
          </button>
          <a 
            href="#catalogo"
            className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs py-2 px-4 sm:px-5 rounded-full shadow-md transition-all cursor-pointer"
          >
            Criar Convite
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-6 md:px-12 lg:py-24 flex flex-col items-center text-center max-w-5xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/50 text-amber-850 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-pulse" />
          <span>Convites Digitais Interativos Premium</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-wedding-serif text-stone-900 tracking-tight leading-tight max-w-4xl font-bold"
        >
          Encante seus convidados com um <span className="font-wedding-cursive italic text-amber-800 text-5xl sm:text-6xl md:text-7xl">convite digital único</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-stone-600 text-base sm:text-lg max-w-2xl font-light"
        >
          Uma experiência imersiva com envelope 3D animado, confirmação de presença (RSVP) em tempo real e lista de presentes em dinheiro via Pix sem taxas.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2"
        >
          <a 
            href="#catalogo"
            className="w-full sm:w-auto bg-amber-850 hover:bg-amber-950 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
          >
            Ver Catálogo de Templates <ArrowRight className="w-4 h-4" />
          </a>
          <button 
            onClick={onOpenDashboardDemo}
            className="w-full sm:w-auto border border-stone-300 hover:bg-white text-stone-700 font-bold px-8 py-3.5 rounded-full transition-all text-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Laptop className="w-4 h-4 text-stone-500" /> Testar Painel de Controle
          </button>
        </motion.div>

        {/* Dynamic device layout preview */}
        <div className="relative w-full max-w-3xl aspect-[16/10] bg-stone-900 rounded-2xl shadow-2xl p-2 border border-stone-800 mt-12 overflow-hidden group">
          <div className="absolute inset-0 bg-stone-950">
            <img 
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop" 
              alt="Convitta Dashboard Preview" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
          </div>
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between text-left gap-4">
            <div className="space-y-1">
              <span className="bg-amber-500 text-stone-950 font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-widest">Tecnologia & Sofisticação</span>
              <h3 className="text-white text-lg sm:text-xl font-bold font-wedding-serif">Envelope Realista e Confirmação Via WhatsApp</h3>
              <p className="text-stone-300 text-xs font-light">Seus convidados recebem um link elegante e abrem um lindo envelope virtual.</p>
            </div>
            <a 
              href="#catalogo"
              className="bg-white hover:bg-amber-50 text-stone-900 font-bold text-xs py-2.5 px-5 rounded-full transition-colors shrink-0 text-center flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-700" /> Experimentar agora
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-stone-900 text-white py-12 px-6 border-y border-stone-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-amber-400 font-mono">{s.value}</div>
              <div className="text-xs text-stone-400 uppercase tracking-wider font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Catalog */}
      <section id="catalogo" className="py-20 px-6 md:px-12 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-amber-800">Nosso Catálogo</span>
          <h2 className="text-3xl sm:text-4xl font-wedding-serif text-stone-900 font-bold">Escolha o seu design perfeito</h2>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            Todos os templates são 100% editáveis: altere textos, adicione suas fotos, mude músicas de fundo e personalize as cores.
          </p>

          {/* Style Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4">
            {(['all', 'Classic', 'Modern', 'Minimalist'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setStyleFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  styleFilter === cat 
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
                    : 'bg-white hover:bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                {cat === 'all' ? 'Todos os Estilos' : cat === 'Classic' ? 'Clássico' : cat === 'Modern' ? 'Moderno' : 'Minimalista'}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" id="template-catalog-grid">
          {filteredTemplates.map((template) => (
            <motion.div 
              key={template.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-stone-200/40 flex flex-col group hover:shadow-xl transition-all hover:scale-101"
            >
              {/* Cover Image Wrapper */}
              <div 
                onClick={() => onPreviewTemplate(template)} 
                className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer"
                title="Clique para ver a prévia deste convite"
              >
                <img 
                  src={template.coverImage} 
                  alt={template.nome} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-stone-900 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded shadow-sm border border-stone-200/30">
                  {template.styleCategory === 'Classic' ? 'Clássico' : template.styleCategory === 'Rustic' ? 'Rústico' : template.styleCategory === 'Modern' ? 'Moderno' : template.styleCategory === 'Minimalist' ? 'Minimalista' : 'Romântico'}
                </span>
                
                {/* Visual price tag */}
                <div className="absolute bottom-3 right-3 bg-stone-900/90 backdrop-blur-md text-white font-mono px-3 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-md">
                  <span className="text-stone-400 font-sans font-light text-[10px]">Taxa única</span>
                  <span className="text-amber-400">R$ {template.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Description Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div 
                  onClick={() => onPreviewTemplate(template)} 
                  className="space-y-1.5 cursor-pointer"
                  title="Clique para ver a prévia deste convite"
                >
                  <h3 className="text-lg font-wedding-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {template.nome}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-light">
                    {template.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100/80 flex flex-col gap-2">
                  <div className="flex gap-2">
                    {/* NEW Preview Template Button! */}
                    <button 
                      onClick={() => onPreviewTemplate(template)}
                      className="flex-1 border border-stone-300 hover:bg-stone-50 hover:border-stone-400 text-stone-800 text-center py-2.5 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 text-stone-600 fill-stone-600/10" /> Testar Prévia
                    </button>
                    
                    <button 
                      onClick={() => onSelectTemplate(template)}
                      className="flex-1 bg-amber-800 hover:bg-amber-900 text-white text-center py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Comprar
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-stone-400">
                    Acesso imediato após aprovação do pagamento
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Us / Key Features */}
      <section className="bg-stone-100 py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-amber-800">Diferenciais</span>
            <h2 className="text-3xl sm:text-4xl font-wedding-serif text-stone-900 font-bold">Por que escolher a Convitta?</h2>
            <p className="text-stone-500 text-sm max-w-md mx-auto">
              Desenvolvemos a ferramenta mais completa do mercado brasileiro de casamentos para que vocês economizem tempo e dinheiro.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/50 space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-800 w-11 h-11 flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Presentes em Dinheiro Direto no Pix</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                Esqueça sites de casamento que retêm seu dinheiro por semanas ou cobram tarifas abusivas de 4% a 8% sobre os presentes recebidos. Na Convitta, os convidados pagam e o valor cai direto na sua conta do banco no mesmo minuto, sem intermediários.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/50 space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-800 w-11 h-11 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Painel RSVP em Tempo Real</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                Controle quem vai comparecer, quantidade de acompanhantes, restrições alimentares (vegetarianos, celíacos) e receba lindas mensagens de carinho dos convidados direto no painel com gráficos estatísticos de consumo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/50 space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-800 w-11 h-11 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Envelope Animado Exclusivo</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                Uma linda animação de envelope de papel com selo de cera que se abre magicamente ao toque na tela, revelando o convite físico-digital. Funciona de forma leve e rápida em qualquer celular e tablet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 px-6 md:px-12 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-amber-800">Dúvidas Comuns</span>
          <h2 className="text-2xl sm:text-3xl font-wedding-serif text-stone-900 font-bold">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="bg-white border border-stone-200 rounded-xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 flex justify-between items-center font-semibold text-stone-800 text-sm sm:text-base cursor-pointer hover:bg-stone-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-amber-850 text-xl font-bold font-mono shrink-0 ml-2">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-500 border-t border-stone-100/50 leading-relaxed font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-gradient-to-tr from-stone-900 via-amber-950 to-stone-900 py-16 px-6 text-center text-white border-t border-stone-800">
        <div className="max-w-3xl mx-auto space-y-6">
          <Heart className="w-10 h-10 text-amber-500 fill-amber-500 mx-auto animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-wedding-serif font-bold">Comece a planejar o seu dia hoje</h2>
          <p className="text-stone-300 text-sm sm:text-base font-light max-w-lg mx-auto">
            Crie um convite incrível em menos de 10 minutos e envie o link para seus convidados começarem a confirmar presença.
          </p>
          <div className="pt-2">
            <a 
              href="#catalogo"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition-all text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              Escolher um Template <ChevronRight className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-8 px-6 text-center text-xs border-t border-stone-900 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-amber-700 fill-amber-700" />
          <span className="font-wedding-serif text-white tracking-widest uppercase font-semibold">Convitta</span>
        </div>
        <p className="max-w-md mx-auto leading-relaxed">
          Convitta Tecnologia SaaS de Casamentos Ltda. CNPJ: 42.115.932/0001-92. Porto Alegre - RS.
        </p>
        <div className="text-[10px] text-stone-600">
          © 2026 Convitta. Todos os direitos reservados. Feito com amor por noivos brasileiros.
        </div>
      </footer>
    </div>
  );
}

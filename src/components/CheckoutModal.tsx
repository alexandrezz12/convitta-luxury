import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RefreshCw, Sparkles, Heart, MessageSquare } from 'lucide-react';
import { Template } from '../types';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (email: string) => void;
}

export default function CheckoutModal({ template, isOpen, onClose, onPaymentSuccess }: CheckoutModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !template) return null;

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Por favor, insira o seu e-mail para receber o acesso.');
      return;
    }
    if (!name) {
      alert('Por favor, insira o seu nome.');
      return;
    }
    if (!phone) {
      alert('Por favor, insira o seu WhatsApp.');
      return;
    }

    setIsProcessing(true);

    // Format the custom WhatsApp message
    const messageText = `Olá, Alexandre! Gostaria de encomendar o convite digital da Convitta no modelo *${template.nome}* (R$ ${template.price.toFixed(2)}).

*Meus dados de acesso:*
- *Nome:* ${name}
- *E-mail:* ${email}
- *WhatsApp:* ${phone}

Estou criando meu convite no painel agora mesmo! Aguardo as instruções para ativação definitiva.`;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5562982055212&text=${encodedMessage}`;

    setTimeout(() => {
      setIsProcessing(false);
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      // Confetti celebration!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      
      // Complete checkout and proceed to onboarding instantly
      onPaymentSuccess(email);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 border border-stone-100 grid md:grid-cols-12"
          id="checkout-modal"
        >
          {/* Order Summary Left Column */}
          <div className="md:col-span-5 bg-stone-900 text-stone-200 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-800">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Heart className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-sm tracking-widest text-amber-500 uppercase">Convitta</span>
              </div>
              
              <p className="text-stone-400 text-xs uppercase tracking-wider mb-1">Você escolheu</p>
              <h3 className="text-xl font-wedding-serif text-white mb-3">{template.nome}</h3>
              
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4 border border-stone-800">
                <img 
                  src={template.coverImage} 
                  alt={template.nome} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[10px] uppercase font-bold text-amber-400 px-2 py-0.5 rounded">
                  {template.styleCategory}
                </span>
              </div>
              
              <ul className="space-y-2 text-xs text-stone-300">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> RSVP Online Ilimitado
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Lista de Presentes via Pix
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Link Personalizado Grátis
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Edições Ilimitadas no Painel
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-800">
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-stone-400">Acesso Vitalício</span>
                <span className="text-[11px] text-stone-500 line-through">R$ {(template.price * 1.8).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white">Valor:</span>
                <span className="text-2xl font-bold text-amber-400 font-mono">R$ {template.price.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-pulse" /> Suporte VIP incluso
              </p>
            </div>
          </div>

          {/* Checkout Form Right Column */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-stone-50/50">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer rounded-full p-1 bg-stone-100 hover:bg-stone-200"
              id="close-checkout"
            >
              <X className="w-4 h-4" />
            </button>

            <form onSubmit={handleWhatsAppOrder} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  Solicitar via WhatsApp
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Preencha seus dados. Ao clicar no botão, você será direcionado para o WhatsApp para realizar o pagamento e ativar seu painel instantaneamente.
                </p>
              </div>

              {/* Personal Information */}
              <div className="grid gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">
                    Seu Nome Completo
                  </label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="ex: Amanda Siqueira"
                    className="w-full px-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">
                    E-mail de Cadastro
                  </label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ex: amanda@gmail.com"
                    className="w-full px-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">
                    Celular (WhatsApp)
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="ex: (62) 98205-5212"
                    className="w-full px-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Info Alert Box */}
              <div className="bg-amber-50/70 border border-amber-200/50 rounded-xl p-3">
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  💡 <strong>Como funciona?</strong> Enviaremos o pedido detalhado para o nosso WhatsApp para que você receba o suporte humano. Ao mesmo tempo, <strong>o painel de edição será liberado imediatamente</strong> na sua tela para você já ir montando o seu convite dos sonhos!
                </p>
              </div>

              {/* Submit / WhatsApp Redirect Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isProcessing 
                    ? 'bg-emerald-800/80 cursor-wait' 
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 hover:shadow-lg'
                }`}
                id="submit-payment-button"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    Abrindo WhatsApp...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 text-white fill-white/10" />
                    Enviar Pedido no WhatsApp & Começar
                  </>
                )}
              </button>
            </form>

            <p className="text-[10px] text-stone-400 text-center mt-4">
              💬 Atendimento e Ativação via WhatsApp Oficial • Alexandre Alves
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

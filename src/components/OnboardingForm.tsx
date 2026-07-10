import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Heart, MapPin, CheckCircle, ChevronRight, Wallet, PartyPopper } from 'lucide-react';
import { WeddingInvitation } from '../types';

interface OnboardingFormProps {
  onComplete: (data: Partial<WeddingInvitation>) => void;
  clientEmail: string;
}

export default function OnboardingForm({ onComplete, clientEmail }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [name1, setName1] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [name2, setName2] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [date, setDate] = useState('2026-11-21');
  const [time, setTime] = useState('17:00');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [pixHolder, setPixHolder] = useState('');

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Assemble initial wedding data
    const partialData: Partial<WeddingInvitation> = {
      clientEmail,
      isPaid: true,
      coupleName1: name1 || 'Noivo 1',
      coupleLastName1: lastName1 || '',
      coupleName2: name2 || 'Noiva 2',
      coupleLastName2: lastName2 || '',
      date,
      time,
      locationName: locationName || 'Local a Definir',
      locationAddress: locationAddress || 'Endereço a Definir',
      pixKey: pixKey || 'chavepix@email.com',
      pixHolder: pixHolder || `${name1} & ${name2}`,
      rsvps: [], // Starts with empty list
      gifts: []  // Starts with default gifts
    };

    onComplete(partialData);
  };

  const stepsInfo = [
    { num: 1, title: 'Nomes' },
    { num: 2, title: 'Evento' },
    { num: 3, title: 'Gifts via Pix' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-stone-200/50 p-6 sm:p-10 space-y-8"
        id="onboarding-card"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-amber-50 rounded-full text-amber-800 border border-amber-200 shadow-sm animate-bounce">
            <Heart className="w-6 h-6 fill-amber-500 text-amber-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-wedding-serif text-stone-900 font-bold">
            Bem-vindos à Convitta!
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Seu pagamento foi confirmado! Vamos criar o rascunho do seu convite em apenas 3 passos rápidos.
          </p>
        </div>

        {/* Steps Progress Tracker */}
        <div className="flex items-center justify-between max-w-xs mx-auto pt-2">
          {stepsInfo.map((s, index) => (
            <React.Fragment key={s.num}>
              {index > 0 && (
                <div className={`h-[2px] flex-1 mx-2 transition-colors duration-300 ${step >= s.num ? 'bg-amber-600' : 'bg-stone-200'}`} />
              )}
              <div className="flex flex-col items-center gap-1">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                    step === s.num 
                      ? 'bg-amber-800 text-white border-amber-800 ring-4 ring-amber-500/10' 
                      : step > s.num 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'bg-white text-stone-400 border-stone-200'
                  }`}
                >
                  {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">{s.title}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Wizard Form */}
        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs uppercase tracking-widest font-bold text-stone-500">Passo 1: Quem vai casar?</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">Nome (Cônjuge 1)</label>
                    <input 
                      type="text" 
                      required
                      value={name1}
                      onChange={e => setName1(e.target.value)}
                      placeholder="ex: Gabriela"
                      className="w-full px-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">Sobrenome 1</label>
                    <input 
                      type="text"
                      value={lastName1}
                      onChange={e => setLastName1(e.target.value)}
                      placeholder="ex: Vasconcellos"
                      className="w-full px-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">Nome (Cônjuge 2)</label>
                    <input 
                      type="text" 
                      required
                      value={name2}
                      onChange={e => setName2(e.target.value)}
                      placeholder="ex: Felipe"
                      className="w-full px-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">Sobrenome 2</label>
                    <input 
                      type="text"
                      value={lastName2}
                      onChange={e => setLastName2(e.target.value)}
                      placeholder="ex: Almeida"
                      className="w-full px-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2 mb-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span className="text-xs uppercase tracking-widest font-bold text-stone-500">Passo 2: Quando e Onde?</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">Data do Casamento</label>
                    <input 
                      type="date" 
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">Horário de Início</label>
                    <input 
                      type="time" 
                      required
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">Nome do Local</label>
                  <input 
                    type="text" 
                    required
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    placeholder="ex: Espaço Província di Toscana"
                    className="w-full px-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">Endereço Completo</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input 
                      type="text" 
                      required
                      value={locationAddress}
                      onChange={e => setLocationAddress(e.target.value)}
                      placeholder="Rua, Número, Bairro, Cidade - Estado"
                      className="w-full pl-9 pr-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2 mb-2">
                  <Wallet className="w-4 h-4 text-amber-500" />
                  <span className="text-xs uppercase tracking-widest font-bold text-stone-500">Passo 3: Receber Presentes via Pix</span>
                </div>

                <div className="bg-amber-50 border border-amber-200/50 p-3 rounded-lg text-xs text-amber-850 space-y-1">
                  <p className="font-semibold flex items-center gap-1">
                    💡 Como funciona a Lista de Presentes?
                  </p>
                  <p className="text-amber-800">
                    Os convidados escolhem itens simbólicos e pagam via Pix direto para você. Não cobramos nenhuma comissão! Todo o dinheiro cai direto na sua conta bancária.
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">Chave Pix dos Noivos (E-mail, CPF, Celular ou Aleatória)</label>
                  <input 
                    type="text" 
                    required
                    value={pixKey}
                    onChange={e => setPixKey(e.target.value)}
                    placeholder="Sua chave Pix para receber os presentes"
                    className="w-full px-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">Nome do Titular da Conta Pix</label>
                  <input 
                    type="text" 
                    required
                    value={pixHolder}
                    onChange={e => setPixHolder(e.target.value)}
                    placeholder="Nome completo do recebedor"
                    className="w-full px-3 py-2 bg-white text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-stone-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                Voltar
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="bg-amber-800 hover:bg-amber-900 text-white font-bold py-2.5 px-6 rounded-lg text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-lg"
            >
              {step < 3 ? (
                <>
                  Próximo Passo <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Concluir e Ver Painel <PartyPopper className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

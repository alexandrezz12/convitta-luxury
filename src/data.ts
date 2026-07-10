import { Template, WeddingInvitation, GiftItem } from './types';

export const templates: Template[] = [
  {
    id: 'template-6',
    nome: 'Modelo 6 - Webgency Luxury (Areia)',
    description: 'Inspirado no consagrado modelo premium da Webgency. Estética Minimalista "Sand & Olive" com tipografia clássica, fotos verticais e paleta de cores recomendadas (Dress Code).',
    price: 147.00,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
    styleCategory: 'Minimalist',
    themeColors: {
      primary: 'rgb(140, 115, 85)', // rich sand/bronze
      secondary: 'rgb(245, 242, 235)', // elegant alabaster
      bg: 'rgb(249, 247, 243)', // warm luxurious off-white
      text: 'rgb(56, 48, 40)', // rich charcoal espresso
      muted: 'rgb(135, 120, 105)', // sand warm gray
      cardBg: 'rgb(255, 255, 255)',
      accent: 'rgb(105, 80, 50)' // deep rich gold-brown
    },
    fontDisplay: 'font-editorial-serif tracking-widest text-4xl sm:text-5xl uppercase font-semibold text-stone-800',
    fontSans: 'font-editorial-serif'
  },
  {
    id: 'template-5',
    nome: 'Modelo 5 - Viktor & Paula (Imperial Burgundy)',
    description: 'Replica fidedigna do elegante modelo Tilda "Viktor and Paula". Fundo Marsala/Bordô Imperial (#66021F), tipografia clássica Ovo, vídeo de fundo de terraço ao pôr do sol ornamentado com pedras de rubi.',
    price: 147.00,
    coverImage: 'https://static.tildacdn.net/tild3338-6332-4463-b639-623665353237/300592484d1f31590325.png',
    styleCategory: 'Classic',
    themeColors: {
      primary: 'rgb(102, 2, 31)', // rich burgundy imperial #66021f
      secondary: 'rgb(255, 250, 248)', // soft cream off-white #fffaf8
      bg: 'rgb(102, 2, 31)', // imperial marsala
      text: 'rgb(255, 250, 248)', // cream
      muted: 'rgb(223, 196, 142)', // gold muted #dfc48e
      cardBg: 'rgb(255, 250, 248)',
      accent: 'rgb(223, 196, 142)' // imperial gold
    },
    fontDisplay: 'font-serif tracking-normal text-4xl sm:text-5xl font-bold text-[#dfc48e]',
    fontSans: 'font-serif'
  },
  {
    id: 'template-7',
    nome: 'Modelo 7 - Laura & Stephan (Midnight Stars & Gold)',
    description: 'Design luxuoso de alta fidelidade inspirado no modelo Tilda. Fundo Midnight Blue (#1B232D) com detalhes dourados elegantes, preloader imersivo, cortinas douradas que se abrem majestosamente ao carregar, contagem regressiva serifada e fotos de romance.',
    price: 147.00,
    coverImage: 'https://static.tildacdn.net/tild3163-6362-4237-b033-376135303061/f1bedaf8-974d-44fd-9.png',
    styleCategory: 'Classic',
    themeColors: {
      primary: '#e2cd96', // royal light gold
      secondary: '#292f38', // elegant slate blue-grey
      bg: '#1b232d', // deep midnight dark blue-grey
      text: '#f9f1ed', // elegant soft off-white cream
      muted: '#a5b39e', // soft sage / olive branch accent
      cardBg: '#1b232d',
      accent: '#e2cd96' // royal gold highlight
    },
    fontDisplay: 'font-serif text-5xl tracking-wide text-[#e2cd96] font-light',
    fontSans: 'font-serif'
  },
  {
    id: 'template-8',
    nome: 'Modelo 8 - The Sacred Garden (Swans & Gold)',
    description: 'Design de altíssima fidelidade inspirado no luxuoso modelo "The Sacred Garden". Possui abertura cinematográfica com envelope lacrado, animação imersiva de vídeo dos cisnes dourados, contagem regressiva serifada ouro, cronograma animado com rosas flutuantes e confirmação através do clássico lacre de cera real.',
    price: 147.00,
    coverImage: 'https://static.tildacdn.net/tild3532-3566-4962-b739-616664393337/Screenshot_2026-06-2.png',
    styleCategory: 'Classic',
    themeColors: {
      primary: '#B48C3D', // warm gold
      secondary: '#5A0F1B', // royal deep burgundy wine #5a0f1b
      bg: '#f9f0e0', // sacred cream ivory
      text: '#6c513f', // dark cocoa charcoal
      muted: '#9c8575', // soft warm taupe
      cardBg: '#fffaf8',
      accent: '#B48C3D'
    },
    fontDisplay: 'font-wedding-serif text-4xl sm:text-5xl tracking-widest text-[#B48C3D] uppercase font-light',
    fontSans: 'font-wedding-serif'
  }
];

export const initialGiftList: GiftItem[] = [
  {
    id: 'gift-1',
    name: 'Cota de Lua de Mel em Gramado - Fondue Romântico',
    price: 150.00,
    description: 'Ajude os noivos a aproveitarem uma noite quentinha com muito chocolate e queijo nas montanhas.',
    category: 'Lua de Mel',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=200&auto=format&fit=crop',
    totalContributions: 0,
    bought: false
  },
  {
    id: 'gift-2',
    name: 'Microondas para esquentar a janta atrasada',
    price: 450.00,
    description: 'Essencial para os dias de correria quando ninguém quer cozinhar.',
    category: 'Eletrodomésticos',
    imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=200&auto=format&fit=crop',
    totalContributions: 0,
    bought: false
  },
  {
    id: 'gift-3',
    name: 'Cafeteira Expressa para aguentar as DRs',
    price: 250.00,
    description: 'Muita cafeína para aquelas madrugadas conversando sobre onde colocar a poltrona nova.',
    category: 'Cozinha',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=200&auto=format&fit=crop',
    totalContributions: 0,
    bought: false
  },
  {
    id: 'gift-4',
    name: 'Cota de Lua de Mel - Passagem de Avião',
    price: 500.00,
    description: 'Contribuição para tirar os noivos do chão! Literalmente.',
    category: 'Lua de Mel',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=200&auto=format&fit=crop',
    totalContributions: 0,
    bought: false
  },
  {
    id: 'gift-5',
    name: 'Abatedor de DR (Jogo de Panelas Antiaderente)',
    price: 320.00,
    description: 'Para cozinhar sem que nada grude, inclusive o mau humor!',
    category: 'Cozinha',
    imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=200&auto=format&fit=crop',
    totalContributions: 0,
    bought: false
  },
  {
    id: 'gift-6',
    name: 'Cota "Primeiro mercado depois de casados"',
    price: 100.00,
    description: 'Garantia de miojo, brigadeiro e amaciante de roupas para as primeiras semanas.',
    category: 'Diversos',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop',
    totalContributions: 0,
    bought: false
  }
];

export const defaultInvitation: WeddingInvitation = {
  id: 'invite-demo-id',
  slug: 'felipe-e-gabriela',
  templateId: 'template-5',
  clientEmail: 'noivos@convitta.com.br',
  isPaid: true,
  
  coupleName1: 'Felipe',
  coupleName2: 'Gabriela',
  coupleLastName1: 'Almeida',
  coupleLastName2: 'Vasconcellos',
  welcomeMessage: 'É com imensa alegria que convidamos você e sua família para celebrar o nosso amor, a união de nossas vidas e o início de uma linda nova jornada juntos.',
  
  date: '2026-11-21',
  time: '16:30',
  locationName: 'Espaço Província di Toscana',
  locationAddress: 'Alameda das Rosas, 2150 - Pampulha, Belo Horizonte - MG, 31270-200',
  locationMapUrl: 'https://maps.google.com/?q=Espaço+Província+di+Toscana+Pampulha',
  dressCode: 'Esporte Fino / Traje Passeio. Evitar tons de branco e off-white.',
  
  historyTitle: 'Nossa História de Amor',
  historyText: 'Nos conhecemos na biblioteca da faculdade em 2019. O Felipe derrubou os livros, a Gabriela ajudou a recolher, e em meio a sorrisos e conversas sussurradas, descobrimos que compartilhávamos o amor pela literatura e por café. Seis anos se passaram cheios de viagens, conquistas, risadas e crescimento mútuo. Agora, diante de Deus e dos nossos amigos mais queridos, daremos o passo mais importante de nossas vidas.',
  historyImageUrl: '',
  
  pixKey: 'pix@convitta.com.br',
  pixHolder: 'Gabriela V. e Felipe A.',
  pixQrCodeValue: '00020101021126580014br.gov.bcb.pix0114pix@convitta.com.br520400005303986540510.005802BR5925Gabriela V e Felipe A6009SAO PAULO62070503***63041A2D',
  giftsEnabled: true,
  
  rsvpDeadline: '2026-10-30',
  rsvpEnabled: true,
  
  rsvps: [
    {
      id: 'r1',
      name: 'Carlos Alberto Vasconcellos',
      isAttending: true,
      totalCompanions: 1,
      companionsNames: 'Maria de Lourdes Vasconcellos',
      contactPhone: '(31) 98888-1111',
      rsvpDate: '2026-06-20',
      foodRestriction: 'Pai da noiva. Sem restrições.',
      message: 'Muito orgulho de vocês, meus filhos! Que Deus abençoe imensamente essa união!'
    },
    {
      id: 'r2',
      name: 'Beatriz Almeida',
      isAttending: true,
      totalCompanions: 0,
      contactPhone: '(31) 97777-2222',
      rsvpDate: '2026-06-21',
      foodRestriction: 'Vegetariana',
      message: 'Não vejo a hora de ver minha amiga de noiva! Vai ser o casamento do ano!'
    },
    {
      id: 'r3',
      name: 'Ricardo Oliveira',
      isAttending: false,
      totalCompanions: 0,
      contactPhone: '(11) 96666-3333',
      rsvpDate: '2026-06-22',
      message: 'Infelizmente estarei em viagem de trabalho fora do país. Desejo toda a felicidade do mundo!'
    }
  ],
  gifts: [
    {
      id: 'gift-1',
      name: 'Cota de Lua de Mel em Gramado - Fondue Romântico',
      price: 150.00,
      description: 'Ajude os noivos a aproveitarem uma noite quentinha com muito chocolate e queijo nas montanhas.',
      category: 'Lua de Mel',
      imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=200&auto=format&fit=crop',
      totalContributions: 150.00,
      bought: true,
      boughtBy: 'Rodrigo & Letícia (Padrinhos)'
    },
    {
      id: 'gift-2',
      name: 'Microondas para esquentar a janta atrasada',
      price: 450.00,
      description: 'Essencial para os dias de correria quando ninguém quer cozinhar.',
      category: 'Eletrodomésticos',
      imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=200&auto=format&fit=crop',
      totalContributions: 0,
      bought: false
    },
    {
      id: 'gift-3',
      name: 'Cafeteira Expressa para aguentar as DRs',
      price: 250.00,
      description: 'Muita cafeína para aquelas madrugadas conversando sobre onde colocar a poltrona nova.',
      category: 'Cozinha',
      imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=200&auto=format&fit=crop',
      totalContributions: 250.00,
      bought: true,
      boughtBy: 'Tia Carmen'
    },
    {
      id: 'gift-4',
      name: 'Cota de Lua de Mel - Passagem de Avião',
      price: 500.00,
      description: 'Contribuição para tirar os noivos do chão! Literalmente.',
      category: 'Lua de Mel',
      imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=200&auto=format&fit=crop',
      totalContributions: 200.00, // Crowdfunding parcial
      bought: false
    },
    {
      id: 'gift-5',
      name: 'Abatedor de DR (Jogo de Panelas Antiaderente)',
      price: 320.00,
      description: 'Para cozinhar sem que nada grude, inclusive o mau humor!',
      category: 'Cozinha',
      imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=200&auto=format&fit=crop',
      totalContributions: 0,
      bought: false
    },
    {
      id: 'gift-6',
      name: 'Cota "Primeiro mercado depois de casados"',
      price: 100.00,
      description: 'Garantia de miojo, brigadeiro e amaciante de roupas para as primeiras semanas.',
      category: 'Diversos',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop',
      totalContributions: 100.00,
      bought: true,
      boughtBy: 'Marcos Paulo (Amigo do Futebol)'
    }
  ]
};

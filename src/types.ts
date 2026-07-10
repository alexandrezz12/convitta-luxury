export type StyleCategory = 'Classic' | 'Rustic' | 'Modern' | 'Minimalist' | 'Romantic';

export interface Template {
  id: string;
  nome: string;
  description: string;
  price: number;
  coverImage: string;
  styleCategory: StyleCategory;
  themeColors: {
    primary: string;       // main accent color
    secondary: string;     // lighter accent / border
    bg: string;            // background color
    text: string;          // default text color
    muted: string;         // small text, labels
    cardBg: string;        // container backgrounds
    accent: string;        // interactive elements/gold/etc
  };
  fontDisplay: string;     // CSS Class or style name e.g. font-wedding-serif
  fontSans: string;        // e.g. font-sans
}

export interface RSVPResponse {
  id: string;
  name: string;
  isAttending: boolean;
  totalCompanions: number;
  companionsNames?: string;
  contactPhone: string;
  rsvpDate: string;
  foodRestriction?: string;
  message?: string;
}

export interface GiftItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  totalContributions: number; // For crowdfunding gifts
  bought: boolean;
  boughtBy?: string;
}

export interface WeddingInvitation {
  id: string;
  slug: string;
  templateId: string;
  clientEmail: string;
  isPaid: boolean;
  
  // Couple Information
  coupleName1: string;
  coupleName2: string;
  coupleLastName1?: string;
  coupleLastName2?: string;
  welcomeMessage?: string;
  
  // Date & Place
  date: string;
  time: string;
  locationName: string;
  locationAddress: string;
  locationMapUrl?: string;
  dressCode?: string;
  
  // Story Section
  historyTitle?: string;
  historyText?: string;
  historyImageUrl?: string;
  
  // Cash gifts/Pix settings
  pixKey: string;
  pixHolder: string;
  pixQrCodeValue?: string;
  giftsEnabled: boolean;
  
  // RSVP settings
  rsvpDeadline: string;
  rsvpEnabled: boolean;
  
  // Guest submissions (stored here for demonstration simulation)
  rsvps: RSVPResponse[];
  gifts: GiftItem[];
}

export type ViewState = 'landing' | 'onboarding' | 'dashboard' | 'invite' | 'super-admin';

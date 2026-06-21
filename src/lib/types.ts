export interface Person {
  name: string;
  shortName: string;
  fullName: string;
  parents: string;
  instagram: string;
  photo: string;
}

export interface Quote {
  ref: string;
  arabic: string;
  translation: string;
}

export interface StoryMilestone {
  title: string;
  date: string;
  story: string;
  photo: string;
}

export interface EventInfo {
  title: string;
  date: string;
  dateLabel: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
  mapsEmbed: string;
}

export interface GalleryItem {
  src: string;
  caption: string;
  span: "tall" | "wide" | "square";
}

export interface BankAccount {
  bank: string;
  number: string;
  holder: string;
}

export interface WeddingConfig {
  couple: {
    groom: Person;
    bride: Person;
  };
  hero: {
    tagline: string;
    dateLabel: string;
  };
  quote: Quote;
  loveStory: StoryMilestone[];
  event: {
    akad: EventInfo;
    resepsi: EventInfo;
  };
  countdownTarget: string;
  gallery: GalleryItem[];
  gift: {
    note: string;
    banks: BankAccount[];
    qris: string;
  };
  closing: {
    message: string;
    gratitude: string;
  };
  music: string;
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  attendance: "hadir" | "tidak_hadir" | "ragu";
  createdAt: string;
}

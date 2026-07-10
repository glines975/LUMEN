export type PageType = 'home' | 'about' | 'works' | 'services' | 'contact';

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  link?: string;
  year: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Design' | 'Development' | 'Concept';
}

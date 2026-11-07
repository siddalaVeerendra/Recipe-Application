export interface RecipeIngredient {
  name: string;
  measure: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  area: string;
  description: string;
  instructions: string;
  imageUrl: string;
  cookingTime: number; // in minutes
  servings: number;
  ingredients: RecipeIngredient[];
  isCustom?: boolean;
  youtubeUrl?: string | null;
  tags?: string[];
  createdAt?: number;
}

export interface CategoryInfo {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

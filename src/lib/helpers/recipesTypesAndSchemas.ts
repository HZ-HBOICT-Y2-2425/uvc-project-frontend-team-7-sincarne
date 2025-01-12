import z from 'zod'

export interface InewIngredient {
	ingredient_name: string;
	ingredient_code: number;
	amount: number;
}

export interface IFood {
	ingredient: InewIngredient | null;
	emission: number;
	macro: IMacros[];
}

export interface IMacros {
	name: string;
	nutrient_value: number;
	unit_name: string;
}

export interface IRecipe {
	id: number;
	name: string;
	image_path: string | null;
	total_calories: number;
	total_fats: number;
	total_carbs: number;
	total_protein: number;
	ingredients: IIngredient[];
}

export interface IIngredient {
	name: string;
	amount: number;
	is_meat?: string;
	ingredient_code?: string;
	emission: number;
}

//   Schemas
// -----||-------
export const recipeSchema = z.object({
	id: z.number(),
	name: z.string(),
	image_path: z.string().nullable(),
	total_calories: z.number(),
	total_fats: z.number(),
	total_carbs: z.number(),
	total_protein: z.number(),
	ingredients: z.array(
		z.object({
			name: z.string(),
			amount: z.number(),
			is_meat: z.string().optional(),
			ingredient_code: z.string().optional(),
			emission: z.number()
		})
	)
});
export const singleRecipeSchema = z.object({
	id: z.number(),
	name: z.string(),
	image_path: z.string().nullable(),
	total_calories: z.number(),
	total_fats: z.number(),
	total_carbs: z.number(),
	total_protein: z.number(),
})

export const isMeatSchema = z.object({
	is_meat: z.string(),
	ingredient_code: z.string()
});

export const macroSchema = z.array(
	z.object({
		name: z.string(),
		nutrient_value: z.number(),
		unit_name: z.string()
	})
);
export const co2schema = z.object({
	amount: z.number()
});
<script lang="ts">
	import { onMount } from 'svelte';
	import '../../../app.css';
	import axios from 'axios';
	import { z } from 'zod';
	import { page } from '$app/state';
	import type { IIngredient } from '$lib/helpers/caclucateMarcosRecipe';
	import { calculateMarcosForARecipe, marcosSchema } from '$lib/helpers/caclucateMarcosRecipe';
	import ComfirmDeletionModal from '$lib/componenets/ComfirmDeletionModal.svelte';

	interface IMacros {
		name: string;
		nutrient_value: number;
		unit_name: string;
	}

	// 	  States
	// -----||-------
	let recipe: {
		id: number;
		name: string;
		image_path: string | null;
		total_calories: number;
		total_fats: number;
		total_carbs: number;
		total_protein: number;
		ingredients: IIngredient[];
	} | null = $state(null);

	let newIngredient: { ingredient_name: string; amount: number } = $state({
		ingredient_name: '',
		amount: 0
	});

	let tempIngredient: string = $state('');

	let ingredientsSuggestions: {
		ingredient_code: number;
		ingredient_description: string;
	}[] = $state([]);

	let selectedIngredient: {
		ingredient_code: string;
		name: string;
		macros: IMacros[];
		is_meat: boolean;
		ratio: number;
	} | null = $state(null);

	let meatfreeSuggestions: {
		ingredient_code: number;
		ingredient_description: string;
		nutrient_value: number;
	}[] = $state([]);

	let totalMarcos: {
		total_calories: number;
		total_protein: number;
		total_carbs: number;
		total_fats: number;
	} = $state({
		total_calories: 0,
		total_protein: 0,
		total_carbs: 0,
		total_fats: 0
	});

	let calculatingMarcos = $state(true);

	let deletionModal: {
		text: string;
		deletionFunc: () => void;
	} = $state({
		text: '',
		deletionFunc: () => {}
	});

	// -----||-------

	//   Schemas
	// -----||-------
	const recipeSchema = z.object({
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
				ingredient_code: z.string().optional()
			})
		)
	});

	const suggestionSchema = z.array(
		z.object({
			ingredient_code: z.number(),
			ingredient_description: z.string()
		})
	);

	const isMeatSchema = z.object({
		is_meat: z.string(),
		ingredient_code: z.string()
	});

	const meatfreeSuggestionsSchema = z.array(
		z.object({
			ingredient_code: z.number(),
			ingredient_description: z.string(),
			nutrient_value: z.number()
		})
	);
	// -----||-------

	// retreive the slug value
	const recipe_id = page.params.slug;

	// get the recipe
	async function getRecipe() {
		await axios.get('/user/getRecipe/' + recipe_id).then((response) => {
			const parsed = recipeSchema.safeParse(response.data);
			if (!parsed.success) {
				// todo error handling mostly icorrect id
				console.log(parsed.error);
				return;
			}
			// Asign fetch data to the recipe
			recipe = parsed.data;
		});
		// if there was an error getting the recipe we can end the execution earlier
		if (!recipe) {
			return;
		}
		// Temporary array to replace ingredients later
		const tempArray = recipe.ingredients;
		// For each ingredient we will fetch for extra information
		let index = 0;
		for (const ingredient of recipe.ingredients) {
			await axios.get('/nutri/isMeat/' + ingredient.name).then((response) => {
				const parsed = isMeatSchema.safeParse(response.data);
				if (!parsed.success) {
					console.log(parsed.error);
					return;
				}
				// asign values to temp array to avoid uncessary rerenders
				tempArray[index].is_meat = parsed.data.is_meat;
				tempArray[index].ingredient_code = parsed.data.ingredient_code;
			});
			index++;
		}
		// asign modified temp array in place of the original one causing only one rerender
		recipe.ingredients = tempArray;
		calculatingMarcos = true;
		totalMarcos = await calculateMarcosForARecipe(tempArray);
		calculatingMarcos = false;

		// Calculate total macros for the recipes
	}

	async function addIngredient() {
		// If neither of them isn't set user isn't allowed to make the request
		// todo: make this visual on the page itself
		if (!newIngredient.ingredient_name || !newIngredient.amount) {
			return;
		}
		/*
		// for calculating total macros inside of the database

		let macros: IMacros[];
		// Fetch the ingredient macros 
		await axios.get('/nutri/getNutritions/ByName/' + newIngredient.ingredient_name).then((response) => {
			const parsed = marcosSchema.safeParse(response.data);
			if (!parsed.success) {
				console.log(parsed.error);
				return;
			}
			//macros = parsed.data;
			}
		)
		*/
		// Add new ingredient
		await axios
			.post('/user/recipes/' + recipe_id + '/addIngredient', newIngredient)
			.then((response) => {
				console.log(response);
			});

		/*
		// for calculating total macros inside of the database

		// Create data to update recipe
		const data = macros.map(()=>{

		})
		
		// Update Recipe's total macros 
		await axios.post('/user/recipes/updateRecipe',{
		}).then((response)=>{


		})
		*/

		// Reset the values
		tempIngredient = '';
		newIngredient.ingredient_name = '';
		newIngredient.amount = 0;
		// todo: if time permites instead of refetching the recipe we could simply return the new ingredient
		// from the previous request and add its value to the recipe state
		await getRecipe();
	}
	async function search() {
		// If the searching value is empty return
		if (!tempIngredient) return;
		// If user has changed the igredient they cannot submit till they choose again
		newIngredient.ingredient_name = '';
		// Search for possible options and add them to suggestions
		axios.get('/nutri/search/' + tempIngredient).then((response) => {
			const parsed = suggestionSchema.safeParse(response.data);
			if (!parsed.success) {
				console.log(parsed.error);
				return;
			}
			ingredientsSuggestions = parsed.data;
		});
	}

	async function selectSuggestion(ingredient_description: string) {
		// Set a name of the new igredient of that of the suggestion
		newIngredient.ingredient_name = ingredient_description;
		// Visualize that change in the value binded to the input element
		tempIngredient = ingredient_description;
		// Clear the rest of the suggestions
		ingredientsSuggestions = [];
	}

	async function selectIngredient(ingredient: IIngredient) {
		await axios
			.get('/nutri/getNutritions/ByCode/' + ingredient.ingredient_code)
			.then((response) => {
				const parsed = marcosSchema.safeParse(response.data);
				if (!parsed.success) {
					console.log(parsed.error);
					return;
				}
				// Calculate the amount macros per the amount of ingredient not 100g

				selectedIngredient = {
					ingredient_code: ingredient.ingredient_code ?? '',
					name: ingredient.name,
					macros: parsed.data,
					is_meat: ingredient.is_meat === 'True',
					ratio: ingredient.amount / 100
				};
			});
	}
	async function suggest(macro: string, ingredient_code: string) {
		axios.get('/nutri/getSuggestions/' + macro + '/' + ingredient_code).then((response) => {
			const parsed = meatfreeSuggestionsSchema.safeParse(response.data);
			if (!parsed.success) {
				console.log(parsed.error);
				return;
			}
			meatfreeSuggestions = parsed.data;
		});
	}
	async function updateIngredient(ingredient: IIngredient, deletion: boolean = false) {
		ingredient.amount =
			ingredient.amount === null || ingredient.amount <= 0 ? 0 : ingredient.amount;
		await axios.post('/user/recipes/' + recipe?.id + '/updateIngredient/', {
			amount: ingredient.amount,
			ingredient_name: ingredient.name
		});
		await getRecipe();
		if (deletion) selectedIngredient = null;
		else {
			selectIngredient(ingredient);
		}
	}
	async function deleteRecipe() {
		await axios.delete('/user/deleteRecipe/' + recipe_id);
		location.href = '/recipes';
	}
	$effect(()=>{
		if(deletionModal.text){
			console.log(deletionModal.text)
		}
	})

	onMount(async () => {
		await getRecipe();
	});
</script>

{#if recipe !== null}
	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if deletionModal.text.length > 0}
			<ComfirmDeletionModal text={deletionModal.text} deletionFunc={deletionModal.deletionFunc} />
		{/if}
		<section class="flex flex-col bg-zinc-900 bg-opacity-90 shadow-lg rounded-lg text-white">
			<div class="flex flex-row">
				<div
					class="w-[50%] bg-auto bg-no-repeat bg-center"
					style="background-image: url('{recipe.image_path ?? './recipe1.jpg'}')"
				></div>
				<div class="flex flex-col w-[50%]">
					<h1>{recipe.name}</h1>
					<div>
						{#if !calculatingMarcos}
							<p>
								{totalMarcos.total_calories}
							</p>
							<p>
								{totalMarcos.total_protein}
							</p>
							<p>
								{totalMarcos.total_carbs}
							</p>
							<p>
								{totalMarcos.total_fats}
							</p>
						{:else}
							<p>Calculating marcos ...</p>
						{/if}
					</div>
				</div>
			</div>
			<section class="flex flex-row">
				<section class="flex flex-col w-[50%]">
					{#each recipe.ingredients as ingredient}
						<button
							class="flex flex-row"
							onclick={() => {
								selectIngredient({
									name: ingredient.name,
									ingredient_code: ingredient.ingredient_code,
									amount: ingredient.amount,
									is_meat: ingredient.is_meat
								});
							}}
						>
							<p class="mr-5">
								<input
									type="number"
									name="weight"
									class="text-black"
									bind:value={ingredient.amount}
									onchange={async () => {
										updateIngredient(ingredient);
									}}
								/><strong>g</strong>
							</p>
							<p class="mr-2">{ingredient.name}</p>
							<p>{ingredient.is_meat}</p>
						</button>
					{/each}
					<label for="ingredient">Add new ingredient</label>
					<input
						type="text"
						name="ingredient"
						class="text-black"
						bind:value={tempIngredient}
						oninput={search}
					/>
					<p>
						<input
							type="number"
							name="weight"
							class="text-black"
							bind:value={newIngredient.amount}
						/><strong>g</strong>
					</p>
					<button type="submit" onclick={addIngredient}>Add</button>
					<div class="flex flex-col">
						{#each ingredientsSuggestions as suggestion}
							<button
								onclick={() => {
									selectSuggestion(suggestion.ingredient_description);
								}}>{suggestion.ingredient_description}</button
							>
						{/each}
					</div>
				</section>
				<section class="w-[50%] flex flex-col">
					{#if selectedIngredient !== null}
						<h1>{selectedIngredient.name}</h1>
						{#each selectedIngredient.macros as macro}
							<h3>{macro.name}</h3>
							<p>
								{macro.nutrient_value * selectedIngredient.ratio}<strong>{macro.unit_name}</strong>
							</p>
						{/each}
						<hr />
						{#if selectedIngredient.is_meat}
							Suggest plan based alternative
							<div>
								<button
									onclick={() => {
										//@ts-ignore
										// Ignoreing selectedIngredient can be null since this part wouldn't be visible if it was
										suggest('protein', selectedIngredient?.ingredient_code);
									}}>Protein</button
								>
								<button
									onclick={() => {
										//@ts-ignore
										// Ignoreing selectedIngredient can be null since this part wouldn't be visible if it was
										suggest('calories', selectedIngredient?.ingredient_code);
									}}>Calories</button
								>
							</div>
						{/if}
						<button
							onclick={async () => {
								deletionModal = {
									deletionFunc: () => {
										updateIngredient(
											{
												ingredient_code: selectedIngredient?.ingredient_code ?? '',
												name: selectedIngredient?.name ?? '',
												amount: 0
											},
											true
										);
									},
									text: 'Are you sure you want to delete this ingredient?'
								};
								console.log(deletionModal);
								/*
								await updateIngredient(
									{
										ingredient_code: selectedIngredient?.ingredient_code ?? '',
										name: selectedIngredient?.name ?? '',
										amount: 0
									},
									true
								);
								*/
							}}>delete</button
						>
						{#each meatfreeSuggestions as suggestion}
							<button onclick={() => {}}>{suggestion.ingredient_description}</button>
							<strong>{suggestion.nutrient_value * selectedIngredient.ratio}</strong>
						{/each}
					{/if}
				</section>
			</section>
			<button onclick={ () => {
				deletionModal = {
					deletionFunc: deleteRecipe,
					text: "Are you sure, you wish to delete this recipe ?"
				}
			}
			}>DELETE THIS RECIPE</button>
		</section>
	</section>
{/if}

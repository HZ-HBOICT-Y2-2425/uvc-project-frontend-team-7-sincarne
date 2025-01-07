<script lang="ts">
	import { onMount } from 'svelte';
	import '../../../app.css';
	import axios from 'axios';
	import { z } from 'zod';
	import { page } from '$app/state';
	import { calculateMarcosForARecipe } from '$lib/helpers/caclucateMarcosRecipe';
	import ComfirmDeletionModal from '$lib/componenets/ComfirmDeletionModal.svelte';
	import SearchIngrecient from '$lib/componenets/SearchIngrecient.svelte';
	import {
		type InewIngredient,
		type IIngredient,
		type IMacros,
		type IRecipe,
		co2schema
	} from '$lib/helpers/recipesTypesAndSchemas';
	import { macroSchema, recipeSchema, isMeatSchema } from '$lib/helpers/recipesTypesAndSchemas';
	import LoadingPlaceholder from '$lib/componenets/LoadingPlaceholder.svelte';

	// 	  States
	// -----||-------
	let recipe: IRecipe | null = $state(null);
	let CO2total = $derived.by(()=>{
		let sum = 0;
		if(recipe){
			recipe.ingredients.forEach((ing)=>{
				sum+= ing.emission * ing.amount / 100;
			})
		}
		return sum;
	})

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
			await axios.get('/nutri/isMeat/' + encodeURIComponent(ingredient.name)).then((response) => {
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

	async function addIngredient(newIngredient: InewIngredient) {
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

		// todo: if time permites instead of refetching the recipe we could simply return the new ingredient
		// from the previous request and add its value to the recipe state
		await getRecipe();
	}

	async function selectIngredient(ingredient: IIngredient) {
		await axios
			.get('/nutri/getNutritions/ByCode/' + ingredient.ingredient_code)
			.then((response) => {
				const parsed = macroSchema.safeParse(response.data);
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
				meatfreeSuggestions = [];
			});
	}
	async function substituteIngredient(ingredient_code: number, ingredient_des: string) {
		let emissionDiff = 0;
		// get emission of the substitueing igredient
		await axios.get('/nutri/getEmission/' + ingredient_code.toString()).then((response) => {
			const parsed = co2schema.safeParse(response.data);
			if (!parsed.success) {
				console.log(parsed.error);
				return;
			}
			emissionDiff -= parsed.data.amount;
		});
		// get emission of selected meat ingredient
		await axios
			.get('/nutri/getEmission/' + selectedIngredient?.ingredient_code.toString())
			.then((response) => {
				const parsed = co2schema.safeParse(response.data);
				if (!parsed.success) {
					console.log(parsed.error);
					return;
				}
				emissionDiff += parsed.data.amount;
			});

		// add the subsitutited ingredient to the recipe
		await axios.post('/user/recipes/' + recipe?.id + '/addIngredient', {
			ingredient_name: ingredient_des,
			amount: (selectedIngredient?.ratio ?? 0) * 100,
			emission: emissionDiff
		});

		// Delete selected ingrediented
		updateIngredient(
			{
				ingredient_code: selectedIngredient?.ingredient_code ?? '',
				name: selectedIngredient?.name ?? '',
				amount: 0,
				emission: 0
			},
			true
		);
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
		location.href = '/diary';
	}
	$effect(() => {
		if (deletionModal.text) {
			console.log(deletionModal.text);
		}
	});

	onMount(async () => {
		await getRecipe();
	});
</script>

	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<a href="/diary/" class="text-lg text-white font-semibold">Back</a>
		<ComfirmDeletionModal text={deletionModal.text} deletionFunc={deletionModal.deletionFunc} />

		<section class="flex flex-col bg-zinc-900 bg-opacity-90 shadow-lg rounded-lg text-white p-6">
			<!-- Recipe Header -->
			<div class="flex flex-row border-b border-gray-700 pb-4 mb-4">
				<div class="flex flex-col w-1/2">
					{#if recipe}
					<h1 class="text-2xl font-bold capitalize mb-2">{recipe.name}</h1>
					{:else}
					<LoadingPlaceholder width="1/2" height="2rem"/>
					{/if}
					<div>
						{#if !calculatingMarcos}
							<p>CO2 prevented: <strong>{CO2total}</strong></p>
							<p>Calories: <strong>{totalMarcos.total_calories}</strong></p>
							<p>Protein: <strong>{totalMarcos.total_protein}</strong></p>
							<p>Carbs: <strong>{totalMarcos.total_carbs}</strong></p>
							<p>Fats: <strong>{totalMarcos.total_fats}</strong></p>
						{:else}
							<p>Calculating macros...</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Content Sections -->
			<section class="flex flex-row gap-8">
				<!-- Ingredients Section -->
				<section class="flex flex-col w-1/2 space-y-4">
					<div
						class="flex items-center p-2 bg-gray-800 rounded-lg hover:bg-gray-700 justify-between font-semibold"
					>
						<p class="mr-8">Amount:</p>
						<p>Name:</p>
						<p>C02 Prevented: </p>
					</div>
					{#if recipe}
					{#each recipe.ingredients as ingredient}
						<button
							class="flex items-center p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition border-2 {ingredient.is_meat ===
							'True'
								? 'border-red-500'
								: 'border-green-500'}"
							onclick={() => {
								selectIngredient({
									name: ingredient.name,
									ingredient_code: ingredient.ingredient_code,
									amount: ingredient.amount,
									is_meat: ingredient.is_meat,
									emission: ingredient.emission
								});
							}}
						>
							<p class="mr-5 flex items-center">
								<input
									type="number"
									name="weight"
									class="w-16 px-2 py-1 text-white rounded-lg focus:outline-none bg-gray-900 appearance-none font-semibold"
									style="-moz-appearance: textfield;"
									bind:value={ingredient.amount}
									onchange={async () => {
										updateIngredient(ingredient);
									}}
								/>
								<strong class="ml-1">g</strong>
							</p>
							<p class="{ingredient.emission ? 'mr-4' : 'mr-20'} flex-grow text-center">
								{ingredient.name}
							</p>
							{#if ingredient.emission}

								<p class="font-semibold text-green-500 ml-auto mr-2">
									
									{(ingredient.emission * ingredient.amount) / 100}
								</p>
							{/if}
						</button>
					{/each}
					{:else}
						{#each {length: 3}}
							<LoadingPlaceholder width="full" height="50px"/>
						{/each}
					{/if}
					<SearchIngrecient
						callback={{ func: addIngredient, params: [] }}
						comfirmation={true}
					/>
				</section>

				<!-- Selected Ingredient Details Section -->
				<section class="w-1/2 flex flex-col space-y-4">
					{#if selectedIngredient !== null}
						<h2 class="text-xl font-semibold capitalize">{selectedIngredient.name}</h2>
						<div class="space-y-2">
							{#each selectedIngredient.macros as macro}
								<div>
									<h3 class="font-semibold">{macro.name}</h3>
									<p>
										{macro.nutrient_value * selectedIngredient.ratio}
										<strong>{macro.unit_name}</strong>
									</p>
								</div>
							{/each}
						</div>
						<hr class="border-gray-700 my-4" />
						{#if selectedIngredient.is_meat}
							<p class="text-sm italic">Suggested plant-based alternatives:</p>
							<div class="flex space-x-2">
								<button
									class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
									onclick={() => {
										suggest('protein', selectedIngredient?.ingredient_code ?? '');
									}}
								>
									Protein
								</button>
								<button
									class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
									onclick={() => {
										suggest('calories', selectedIngredient?.ingredient_code ?? '');
									}}
								>
									Calories
								</button>
							</div>
						{/if}
						{#each meatfreeSuggestions as suggestion}
							<div class="flex items-center justify-between">
								<button
									onclick={() => {
										substituteIngredient(
											suggestion.ingredient_code,
											suggestion.ingredient_description
										);
									}}
									class="text-sm bg-gray-800 p-2 rounded hover:bg-gray-700 transition"
								>
									{suggestion.ingredient_description}
								</button>
								<strong>{suggestion.nutrient_value * selectedIngredient.ratio}</strong>
							</div>
						{/each}
						<button
							class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
							onclick={async () => {
								deletionModal = {
									deletionFunc: () => {
										updateIngredient(
											{
												ingredient_code: selectedIngredient?.ingredient_code ?? '',
												name: selectedIngredient?.name ?? '',
												amount: 0,
												emission: 0
											},
											true
										);
									},
									text: 'Are you sure you want to delete this ingredient?'
								};
							}}
						>
							Delete
						</button>
					{/if}
				</section>
			</section>

			<!-- Delete Recipe Button -->
			{#if recipe}
			<button
				class="mt-6 bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition"
				onclick={() => {
					deletionModal = {
						deletionFunc: deleteRecipe,
						text: 'Are you sure you wish to delete this recipe?'
					};
				}}
			>
			Delete recipe
			</button>
			{/if}
		</section>
	</section>

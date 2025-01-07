<script lang="ts">
	import SearchIngrecient from '$lib/componenets/SearchIngrecient.svelte';
	import axios from 'axios';
	import { onMount, tick } from 'svelte';
	import { z } from 'zod';
	import { calculateMarcosForARecipe } from '$lib/helpers/caclucateMarcosRecipe';
	import type { IRecipe, IFood, InewIngredient } from '$lib/helpers/recipesTypesAndSchemas';
	import {
		recipeSchema,
		isMeatSchema,
		macroSchema,
		singleRecipeSchema,
		co2schema
	} from '$lib/helpers/recipesTypesAndSchemas';
	import LoadingPlaceholder from '$lib/componenets/LoadingPlaceholder.svelte';
	let currentDate: Date = $state.raw(new Date());

	let newRecipeName: string = $state('');

	let diaryValues: {
		total_calories: number;
		total_protein: number;
		total_carbs: number;
		total_fats: number;
		emission: number;
	} = $state({
		total_calories: 0,
		total_protein: 0,
		total_carbs: 0,
		total_fats: 0,
		emission: 0
	});

	let recipes: (IRecipe & { is_meat?: string; CO2prevented: number })[] = $state([]);

	let openMenuId: number | null = $state(null);

	let creationModalOpen: boolean = $state(false);

	let meatSearch: boolean = $state(false);
	let showMeatReplacements: boolean = $state(false);
	let selectedMeat: IFood = $state({
		ingredient: null,
		emission: 0,
		macro: []
	});
	let loadingAmountRecipes: number = $state(1);
	let diaryloading: boolean = $state(true);

	let selectedFood: IFood = $state({
		ingredient: null,
		emission: 0,
		macro: []
	});

	let canSumbit = $derived(
		selectedFood.ingredient !== null && selectedFood.emission != 0 && selectedFood.macro.length > 0
	);

	let diarySchema = z.object({
		total_calories: z.number(),
		total_fats: z.number(),
		total_carbs: z.number(),
		total_protein: z.number(),
		emission: z.number()
	});

	// Update the current date with set amount of dates
	function updateDays(days: number) {
		let date = new Date(currentDate);
		date.setDate(date.getDate() + days);
		currentDate = date;
		getDiaryEntry();
	}
	async function createRecipe() {
		await axios.post('/user/createRecipe/', { name: newRecipeName }).then(() => {
			newRecipeName = '';
			getRecipes();
		});
	}

	async function selectFood(ingredient: InewIngredient) {
		await getCO2Emission(ingredient).then((emission) => (selectedFood.emission = emission));
		selectedFood.ingredient = ingredient;
		await axios
			.get('/nutri/getNutritions/ByCode/' + ingredient.ingredient_code)
			.then((response) => {
				const parsed = macroSchema.safeParse(response.data);
				if (!parsed.success) {
					console.log(parsed.error);
					return;
				}
				selectedFood.macro = parsed.data;
			});
	}

	async function createEntry() {
		const data = {
			total_calories: selectedFood.macro.find((macro) => macro.name === 'Energy')?.nutrient_value,
			total_protein: selectedFood.macro.find((macro) => macro.name === 'Protein')?.nutrient_value,
			total_carbs: selectedFood.macro.find((macro) => macro.name === 'Carbohydrate, by difference')
				?.nutrient_value,
			total_fats: selectedFood.macro.find((macro) => macro.name === 'Total lipid (fat)')
				?.nutrient_value,
			emission: selectedMeat.emission
				? (selectedMeat.emission * (selectedMeat.ingredient?.amount ?? 0)) / 100 -
					(selectedFood.emission * (selectedFood.ingredient?.amount ?? 0)) / 100
				: 0,
			date: currentDate.toDateString()
		};

		await axios.post('/user/updateDiary/', data).then((response) => {});

		closeModal();
		await getDiaryEntry();
	}

	async function getCO2Emission(ingredient: InewIngredient): Promise<number> {
		let output: number = 0;
		await axios
			.get('/nutri/getEmission/' + ingredient.ingredient_code.toString())
			.then((response) => {
				const parsed = co2schema.safeParse(response.data);
				if (!parsed.success) {
					console.log(parsed.error);
					return;
				}
				output = parsed.data.amount;
			});
		return output;
	}

	async function getDiaryEntry() {
		await axios.get('/user/getDiary/' + currentDate.toDateString()).then((response) => {
			const parsed = diarySchema.safeParse(response.data);
			console.log(response.data);
			if (!parsed.success) {
				console.log(parsed.error);
				return;
			}
			diaryValues = parsed.data;
		});
		diaryloading = false;
	}
	function closeModal() {
		// clear all the states related to the modal
		creationModalOpen = false;
		meatSearch = false;
		showMeatReplacements = false;
		selectedMeat = {
			ingredient: null,
			emission: 0,
			macro: []
		};
		selectedFood = {
			ingredient: null,
			emission: 0,
			macro: []
		};
	}

	export async function createEntryFromRecipe(
		recipe: IRecipe & { CO2prevented: number },
		portionSize: number
	) {
		await axios.post('/user/updateDiary/', {
			date: currentDate.toDateString(),
			total_calories: recipe.total_calories * portionSize,
			total_protein: recipe.total_protein * portionSize,
			total_carbs: recipe.total_carbs * portionSize,
			total_fats: recipe.total_fats * portionSize,
			emission: recipe.CO2prevented
		});
		openMenuId = null;
		await getDiaryEntry();
	}

	async function getRecipes() {
		await axios.get('/user/getRecipes').then(async (response) => {
			const parsed = z.array(singleRecipeSchema).safeParse(response.data);
			if (!parsed.success) {
				console.log(parsed.error);
				return;
			}
			loadingAmountRecipes = parsed.data.length;
			// Explicitly type the map array
			const map = parsed.data.map((recipe) => {
				return axios.get<number>(`/user/getRecipe/${recipe.id}`);
			});
			let tempRecipes: (IRecipe & { is_meat?: string; CO2prevented: number })[] = [];
			await Promise.all(map).then(async (data) => {
				for (const response of data) {
					const parsedRecipe = recipeSchema.safeParse(response.data);
					if (!parsedRecipe.success) {
						console.log(parsedRecipe.error);
						return;
					}
					let sum = 0;
					parsedRecipe.data.ingredients.forEach((ing) => {
						sum += (ing.emission * ing.amount) / 100;
					});
					const length = tempRecipes.push({
						...parsedRecipe.data,
						is_meat: 'False',
						CO2prevented: sum
					});
					const isMeat = parsedRecipe.data.ingredients.map((rep) => {
						return axios.get('/nutri/isMeat/' + encodeURIComponent(rep.name));
					});
					await Promise.all(isMeat).then((isMeatdata) => {
						for (const response of isMeatdata) {
							const parsed = isMeatSchema.safeParse(response.data);
							if (!parsed.success) {
								console.log(parsed.error);
								return;
							}
							if (parsed.data.is_meat === 'True') {
								tempRecipes[length - 1].is_meat = parsed.data.is_meat;
								return;
							}
						}
					});
				}
				console.log('tempRecipes:', tempRecipes);
				const calcMacro = tempRecipes.map((rep) => {
					return calculateMarcosForARecipe(rep.ingredients);
				});
				await Promise.all(calcMacro).then((macroData) => {
					let index = 0;
					for (const response of macroData) {
						console.log(response);
						tempRecipes[index].total_calories = response.total_calories;
						tempRecipes[index].total_protein = response.total_protein;
						tempRecipes[index].total_carbs = response.total_carbs;
						tempRecipes[index].total_fats = response.total_fats;
						index++;
					}
				});
				recipes = tempRecipes;
				loadingAmountRecipes = 0;
			});
		});
	}

	onMount(async () => {
		await getDiaryEntry();
		await getRecipes();
	});
</script>

<section class="mt-4 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100">
	<!-- Modal for adding new entry -->
	{#if creationModalOpen}
		<section
			class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-90 text-white z-50"
		>
			<!-- Background overlay -->
			<button aria-label="Close" class="absolute inset-0 cursor-pointer" onclick={closeModal}
			></button>

			<!-- Modal content -->
			<div
				class="bg-zinc-900 p-6 rounded-lg shadow-lg flex flex-col items-center gap-6 z-10 max-w-[450px] w-full"
			>
				<!-- Heading -->
				<h1 class="text-center text-xl font-semibold">
					Add new entry for <strong class="text-green-500">{currentDate.toDateString()}</strong>!
				</h1>

				<!-- Enable meat toggle -->
				<section class="flex items-center gap-2">
					<label for="meatfree" class="text-sm font-medium">Enable meat?</label>
					<input type="checkbox" name="meatfree" bind:checked={meatSearch} class="h-4 w-4" />
				</section>

				<!-- Search bar for adding ingredient -->
				<SearchIngrecient
					callback={{
						func: selectFood,
						params: []
					}}
					vege={meatSearch ? null : true}
					comfirmation={false}
				/>

				<!-- Info about selected ingredient -->
				<section
					class="flex flex-col gap-4 text-sm h-auto overflow-hidden transition-[max-height] duration-300 ease-in-out"
					style="max-height: {selectedFood.ingredient && (selectedFood.ingredient?.amount ?? 0) > 0
						? '300px'
						: '0'};"
				>
					{#if selectedFood.ingredient && (selectedFood.ingredient?.amount ?? 0) > 0}
						<p class="text-lg font-semibold {selectedFood.emission > 20 ? "text-red-500" : "text-green-500"}">
							<strong class="text-white">CO2 Emission:</strong>
							{(selectedFood.emission * selectedFood.ingredient.amount) / 100} KG
						</p>
						<hr>
						{#each selectedFood.macro as macro}
							<p class="flex justify-between text-lg">
								<strong>{macro.name}: </strong>
								<span class="font-semibold ml-5"
									>{(macro.nutrient_value * selectedFood.ingredient.amount) / 100}
									{macro.unit_name}</span
								>
							</p>
						{/each}
					{/if}
				</section>

				<!-- Meat replacement -->
				<section
					class="flex flex-col gap-4 h-auto overflow-hidden transition-[max-height] duration-300 ease-in-out"
					style="max-height: {!meatSearch ? '600px' : '0'};"
				>
					{#if !meatSearch}
						<!-- Input opener -->
						<div>
							<label for="replacement" class="block text-sm font-medium text-gray-200">
								Have you chosen this product instead of a meat product?
							</label>
							<button
								name="replacement"
								class="text-sm font-medium text-blue-500 hover:underline"
								onclick={() => {
									showMeatReplacements = !showMeatReplacements;
								}}
							>
								Open meat Substitutions <strong>{!showMeatReplacements ? '▽' : '-'}</strong>
							</button>
						</div>

						<!-- Input -->
						<section
							class="flex flex-col gap-4"
							style="display: {showMeatReplacements ? 'flex' : 'none'};"
						>
							<SearchIngrecient
								callback={{
									func: async (newIngredient: InewIngredient) => {
										await getCO2Emission(newIngredient).then((emission) => {
											selectedMeat.emission = emission;
										});
										selectedMeat.ingredient = newIngredient;
									},
									params: []
								}}
								comfirmation={false}
								vege={false}
							/>
							<button
								class="text-red-500 hover:underline text-sm"
								onclick={() => {
									selectedMeat.ingredient = null;
									selectedMeat.emission = 0;
									showMeatReplacements = false;
								}}
							>
								Cancel
							</button>
						</section>

						<!-- Info about selected meat -->
						{#if selectedMeat.ingredient && selectedMeat.ingredient.amount > 0}
							<p class="text-sm text-gray-200 max-w-full">
								Production of {selectedMeat.ingredient.amount}g of "{selectedMeat.ingredient
									.ingredient_name}" you chose
								<strong>WOULD HAVE</strong> emitted
								<strong class="text-red-500">
									{selectedMeat.emission * (selectedMeat.ingredient.amount / 100)} KG
								</strong>
								of CO2
							</p>
						{/if}
					{/if}
				</section>

				<!-- Action buttons -->
				<div class="flex gap-4">
					<button
						type="submit"
						onclick={createEntry}
						class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
						disabled={!(selectedFood.ingredient && selectedFood.ingredient.amount > 0 && canSumbit)}
					>
						Create entry
					</button>
					<button
						type="button"
						class="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
						onclick={closeModal}
					>
						CANCEL
					</button>
				</div>
			</div>
		</section>
	{/if}

	<!-- Main content -->
	<section class="bg-zinc-900 bg-opacity-90 rounded-lg shadow-lg text-white p-4">
		<!-- Top blocks: Diary and Leaderboards -->
		<section class="grid grid-cols-2">
			<!-- Diary counter -->
			<section class="flex flex-col gap-4 p-6 border-r border-grey-100">
				<!-- Time control -->
				<section class="flex justify-center items-center gap-4">
					<button
						class="px-2 py-1 bg-gray-700 rounded-md hover:bg-gray-600"
						onclick={() => updateDays(-1)}
					>
						-
					</button>
					<strong class="text-lg">{currentDate.toDateString()}</strong>
					<button
						class="px-2 py-1 bg-gray-700 rounded-md hover:bg-gray-600"
						onclick={() => updateDays(1)}
					>
						+
					</button>
				</section>

				<!-- Data for selected day -->
				<section class="text-sm">
					{#if !diaryloading}
						<h2 class="text-3xl m-2 font-semibold">
							CO2 prevented: <strong class="font-semibold tracking-wide text-green-500"
								>{Math.round(diaryValues.emission)}</strong
							>
						</h2>
					{:else}
						<LoadingPlaceholder width="full" height="2.25rem" />
					{/if}
					<hr />
					<div class="grid grid-cols-2 gap-1 p-2 text-lg">
						{#if !diaryloading}
							<p class="">Calories: <strong>{Math.round(diaryValues.total_calories)}</strong></p>
							<p class="">Protein: <strong>{Math.round(diaryValues.total_protein)}</strong></p>
							<p class="">Carbs: <strong>{Math.round(diaryValues.total_carbs)}</strong></p>
							<p class="">Fats: <strong>{Math.round(diaryValues.total_fats)}</strong></p>
						{:else}
							{#each { length: 4 }}
								<LoadingPlaceholder width="full" height="1.75rem" />
							{/each}
						{/if}
					</div>
				</section>

				<!-- Add entry button -->
				<button
					class="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
					onclick={() => (creationModalOpen = true)}
				>
					Add new entry
				</button>
			</section>
			<!-- Leaderboards -->
			<section class="p-6">
				<nav class="flex gap-4 mb-2">
					<button class="text-sm font-medium text-gray-300 hover:text-white">Global</button>
					<button class="text-sm font-medium text-gray-300 hover:text-white">FriendGroup 1</button>
				</nav>
				<ul class="text-sm">
					<li>Be: 100</li>
					<li>Me: 200</li>
				</ul>
			</section>
			<!-- Recipes -->
			<ul class="list-disc p-6 col-span-2 w-full border-t border-grey-100">
				<h1 class="text-2xl text-center font-bold mb-3 tracking-wide">Your Recipes</h1>
				{#each { length: loadingAmountRecipes }}
					<LoadingPlaceholder width={'full'} height={'50px'}></LoadingPlaceholder>
				{/each}
				{#each recipes as recipe}
					<li
						class="text-sm flex w-full flex-row m-2 p-3 bg-gray-700 mb-4 rounded-lg items-center border-2 {recipe.is_meat ===
						'True'
							? 'border-red-500'
							: 'border-green-500'}"
					>
						<a href="/recipes/{recipe.id}" class="flex-grow">
							<h1 class="cursor-pointer"><strong class="capitalize">{recipe.name}</strong></h1>
						</a>
						<div class="align-end flex flex-row gap-2 items-center">
							{#if recipe.id !== openMenuId}
								<p class="">CO2prevented: <strong>{Math.round(recipe.CO2prevented)}</strong></p>
								<p class="">Calories: <strong>{Math.round(recipe.total_calories)}</strong></p>
								<p class="">Protein: <strong>{Math.round(recipe.total_protein)}</strong></p>
								<p class="">Carbs: <strong>{Math.round(recipe.total_carbs)}</strong></p>
								<p class="mr-2">Fats: <strong>{Math.round(recipe.total_fats)}</strong></p>
								<button
									onclick={() => {
										openMenuId = recipe.id;
									}}
									class=" bg-green-500 w-[2rem] h-[2rem] text-center rounded-3xl"
									><strong class="text-lg">+</strong></button
								>
							{:else}
								<p class="text-lg font-semibold">Choose portion size:</p>
								<button
									onclick={() => {
										createEntryFromRecipe(recipe, 1);
									}}
									class=" bg-green-500 w-[2rem] h-[2rem] text-center rounded-3xl"
									><strong class="text-lg">1</strong></button
								>
								<button
									onclick={() => {
										createEntryFromRecipe(recipe, 1 / 2);
									}}
									class=" bg-green-500 w-[2rem] h-[2rem] text-center rounded-3xl"
									><strong class="text-lg">½</strong></button
								>
								<button
									onclick={() => {
										createEntryFromRecipe(recipe, 1 / 3);
									}}
									class=" bg-green-500 w-[2rem] h-[2rem] text-center rounded-3xl"
									><strong class="text-lg">⅓</strong></button
								>
								<button
									onclick={() => {
										createEntryFromRecipe(recipe, 1 / 4);
									}}
									class=" bg-green-500 w-[2rem] h-[2rem] text-center rounded-3xl"
									><strong class="text-lg">¼</strong></button
								>
								<button
									onclick={() => {
										createEntryFromRecipe(recipe, 1 / 6);
									}}
									class=" bg-green-500 w-[2rem] h-[2rem] text-center rounded-3xl"
									><strong class="text-lg">⅙</strong></button
								>
								<button
									onclick={() => {
										openMenuId = null;
									}}
									class=" bg-red-500 w-[2rem] h-[2rem] text-center rounded-3xl"
									><strong class="text-lg">-</strong></button
								>
							{/if}
						</div>
					</li>
				{/each}
				<li class="text-sm flex w-full flex-row m-2 p-3 bg-gray-700 mb-4 rounded-lg items-center">
					<input
						type="text"
						class="bg-transparent font-semibold w-full appearance-none"
						placeholder="Input new recipe name"
						bind:value={newRecipeName}
						onkeydown={(e) => {
							console.log('event', e.key);
							if (e.key === 'Enter') {
								createRecipe();
							}
						}}
					/>
					<button
						onclick={createRecipe}
						class=" bg-green-500 w-[2rem] h-[2rem] text-center rounded-3xl"
						><strong class="text-lg">+</strong></button
					>
				</li>
			</ul>
		</section>
	</section>
</section>

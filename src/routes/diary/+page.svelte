<script lang="ts">
	import SearchIngrecient from '$lib/componenets/SearchIngrecient.svelte';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { z } from 'zod';
	import type { InewIngredient } from '$lib/componenets/SearchIngrecient.svelte';

	interface IFood {
		ingredient: InewIngredient | null;
		emission: number;
		macro: IMacros[];
	}

	interface IMacros {
		name: string;
		nutrient_value: number;
		unit_name: string;
	}

	let currentDate: Date = $state.raw(new Date());

	let diaryValues: {
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

	let recipes: {
		id: number;
		name: string;
		image_path: string | null;
		total_calories: number;
		total_fats: number;
		total_carbs: number;
		total_protein: number;
	}[] = $state([]);

	let creationModalOpen: boolean = $state(false);

	let meatSearch: boolean = $state(false);
	let showMeatReplacements: boolean = $state(false);
	let selectedMeat: IFood = $state({
		ingredient: null,
		emission: 0,
		macro: []
	});
	let selectedFood: IFood = $state({
		ingredient: null,
		emission: 0,
		macro: []
	});

	let diarySchema = z.object({
		total_calories: z.number(),
		total_fats: z.number(),
		total_carbs: z.number(),
		total_protein: z.number()
	});

	let macroSchema = z.object({
		name: z.string(),
		nutrient_value: z.number(),
		unit_name: z.string()
	});

	let co2schema = z.object({
		amount: z.number()
	});

	const recipeSchema = z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			image_path: z.string().nullable(),
			total_calories: z.number(),
			total_fats: z.number(),
			total_carbs: z.number(),
			total_protein: z.number()
		})
	);

	// Update the current date with set amount of dates
	function updateDays(days: number) {
		let date = new Date(currentDate);
		date.setDate(date.getDate() + days);
		currentDate = date;
		getDiaryEntry();
	}
	async function selectFood(ingredient: InewIngredient) {
		await getCO2Emission(ingredient).then((emission) => (selectedFood.emission = emission));
		selectedFood.ingredient = ingredient;
		await axios
			.get('/nutri/getNutritions/ByCode/' + ingredient.ingredient_code)
			.then((response) => {
				const parsed = z.array(macroSchema).safeParse(response.data);
				if (!parsed.success) {
					console.log(parsed.error);
					return;
				}
				selectedFood.macro = parsed.data;
			});
	}

	async function createEntry() {
		const emission = selectedMeat.emission - selectedFood.emission;
		const total_calories = selectedFood.macro.find((macro) => {
			macro.name === 'Calories';
		});
		//const total_protein =
		//const total_carbs =
		//const total_fats =
		await axios.post('/user/updateDiary/', {
			emission: emission
		});
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
		axios.get('/user/getDiary/' + currentDate.toDateString()).then((response) => {
			const parsed = diarySchema.safeParse(response.data);
			if (!parsed.success) {
				console.log(parsed.error);
				return;
			}
			diaryValues = parsed.data;
		});
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

	async function getRecipes() {
		await axios.get('/user/getRecipes').then((response) => {
			const parsed = recipeSchema.safeParse(response.data);
			if (!parsed.success) {
				console.log(parsed.error);
				return;
			}
			recipes = parsed.data;
		});
	}
	onMount(async () => {
		await getDiaryEntry();
		await getRecipes();
	});
</script>

<section class="mt-4 text-slate-100 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
	<!-- Modal for adding new entry  -->
	{#if creationModalOpen}
		<section class="absolute top-0 left-0 h-full w-full flex justify-center text-white">
			<!-- Black background  -->
			<!-- todo: clean states of modal on close -->
			<button
				aria-label="Close"
				class="absolute bg-black bg-opacity-90 cursor-pointer h-full w-full"
				onclick={closeModal}
			></button>
			<!-- Content   -->
			<div class="absolute z-10 self-center bg-zinc-900 p-6 flex flex-col items-center gap-4">
				<!-- Heading -->
				<h1>
					Add new entry for <strong class="text-green-500">{currentDate.toDateString()}</strong>!
				</h1>
				<!-- Enable meat search -->
				<section class="flex flex-row">
					<label for="meatfree">Enable meat?</label>
					<input type="checkbox" name="meatfree" bind:checked={meatSearch} />
				</section>
				<!-- Search bar for adding ingredient -->
				<SearchIngrecient
					labelText="Select new entry product"
					callback={{
						func: selectFood,
						params: []
					}}
					vege={meatSearch ? null : true}
					comfirmation={false}
				/>
				<!-- Info about selected ingredient-->
				{#if selectedFood.ingredient}
					<section class="flex flex-col">
						{#each selectedFood.macro as macro}
							<p>
								<strong>{macro.name}: </strong>{(macro.nutrient_value *
									selectedFood.ingredient.amount) /
									100}
								{macro.unit_name}
							</p>
						{/each}
						<p>
							<strong>CO2: </strong>{(selectedFood.emission * selectedFood.ingredient.amount) / 100}
							KG
						</p>
					</section>
				{/if}
				<!-- Selecting omitted meat -->
				{#if !meatSearch}
					<!-- Input opener -->
					<section>
						<label for="replacement">Have you chosen this product instead of a meat product?</label>
						<button
							name="replacement"
							onclick={() => {
								showMeatReplacements = !showMeatReplacements;
							}}
							>Open meat Sumbsititions <strong>{!showMeatReplacements ? '▽' : '-'} </strong></button
						>
					</section>
					<!-- Input -->
					<sectoin class="{showMeatReplacements ? '' : 'hidden'} flex flex-col justify-center">
						<SearchIngrecient
							labelText="Select the meat product you chose to omit: "
							callback={{
								func: async (newIngredient: InewIngredient) => {
									//copy values of the given ingredient
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
							onclick={() => {
								selectedMeat.ingredient = null;
								selectedMeat.emission = 0;
								showMeatReplacements = false;
							}}>Cancel</button
						>
					</sectoin>
					<!-- Info about selected meat -->
					{#if selectedMeat.ingredient}
						<p>
							Production of {selectedMeat.ingredient.amount}g of "{selectedMeat.ingredient
								.ingredient_name}" you choose <strong>WOULD HAVE</strong> emitted
							<strong class="text-red-500"
								>{selectedMeat.emission * (selectedMeat.ingredient.amount / 100)}</strong
							> KG of CO2
						</p>
					{/if}
				{/if}
				<button type="submit" onclick={closeModal}>CANCEL</button>
			</div>
		</section>
	{/if}

	<section class="flex flex-col w-full bg-zinc-900 bg-opacity-90 shadow-lg rounded-lg text-white">
		<!-- Top two blocks: Diary and Leaderboards  -->
		<section class="grid grid-cols-[repeat(2,1fr)] w-full p-4">
			<!--Recipes -->
			<section class="row-span-2">
				<ul>
					{#each recipes as recipe}
						<li>{recipe.name}</li>
					{/each}
				</ul>
			</section>
			<!--Diary Counter  -->
			<section class="w-full flex flex-col">
				<!-- Time control -->
				<section class="flex flex-row self-center">
					<button
						class="pr-2 pl-2"
						onclick={() => {
							updateDays(-1);
						}}>-</button
					>
					<strong>{currentDate.toDateString()}</strong>
					<button
						class="pr-2 pl-2"
						onclick={() => {
							updateDays(1);
						}}>+</button
					>
				</section>
				<!-- Data for selected day -->
				<section>
					<p>Calories: {diaryValues.total_calories}</p>
					<p>Protein: {diaryValues.total_protein}</p>
					<p>Carbs: {diaryValues.total_carbs}</p>
					<p>Fats: {diaryValues.total_fats}</p>
					<strong>CO2 prevented: 0</strong>
				</section>
				<!-- Adding single ingredient -->
				<section>
					<!-- Make this a big plus button -->
					<button
						onclick={() => {
							creationModalOpen = true;
						}}>Add new entry</button
					>
				</section>
			</section>
			<!--Leaderboards  -->
			<section class="min-w-[50%]">
				<!-- Navigation between different groups -->
				<nav>
					<button>Global</button>
					<button>FriendGroup 1</button>
				</nav>
				<!-- Leaderboard entries  -->
				<ul>
					<li>Be: 100</li>
					<li>me: 200</li>
				</ul>
			</section>
		</section>
	</section>
</section>
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
			<div class="bg-zinc-900 p-6 rounded-lg shadow-lg flex flex-col items-center gap-6 z-10">
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
					labelText="Select new entry product"
					callback={{
						func: selectFood,
						params: []
					}}
					vege={meatSearch ? null : true}
					comfirmation={false}
				/>

				<!-- Info about selected ingredient -->
				{#if selectedFood.ingredient}
					<section class="flex flex-col gap-2 text-sm">
						{#each selectedFood.macro as macro}
							<p>
								<strong>{macro.name}: </strong>
								{(macro.nutrient_value * selectedFood.ingredient.amount) / 100}
								{macro.unit_name}
							</p>
						{/each}
						<p>
							<strong>CO2: </strong>
							{(selectedFood.emission * selectedFood.ingredient.amount) / 100} KG
						</p>
					</section>
				{/if}

				<!-- Meat replacement -->
				{#if !meatSearch}
					<section class="w-full flex flex-col gap-4">
						<!-- Input opener -->
						<div>
							<label for="replacement" class="block text-sm font-medium text-gray-200"
								>Have you chosen this product instead of a meat product?</label
							>
							<button
								name="replacement"
								class="text-sm font-medium text-blue-500 hover:underline"
								onclick={() => {
									showMeatReplacements = !showMeatReplacements;
								}}
							>
								Open meat Substitutions
								<strong>{!showMeatReplacements ? '▽' : '-'}</strong>
							</button>
						</div>

						<!-- Input -->
						<section class="{showMeatReplacements ? '' : 'hidden'} flex flex-col gap-4">
							<SearchIngrecient
								labelText="Select the meat product you chose to omit: "
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
						{#if selectedMeat.ingredient}
							<p class="text-sm text-gray-200">
								Production of {selectedMeat.ingredient.amount}g of "{selectedMeat.ingredient
									.ingredient_name}" you chose
								<strong>WOULD HAVE</strong> emitted
								<strong class="text-red-500">
									{selectedMeat.emission * (selectedMeat.ingredient.amount / 100)} KG
								</strong>
								of CO2
							</p>
						{/if}
					</section>
				{/if}

				<!-- Cancel button -->
				<button
					type="submit"
					class="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
					onclick={closeModal}
				>
					CANCEL
				</button>
			</div>
		</section>
	{/if}

	<!-- Main content -->
	<section class="bg-zinc-900 bg-opacity-90 rounded-lg shadow-lg text-white p-4">
		<!-- Top blocks: Diary and Leaderboards -->
		<section class="grid grid-cols-2 gap-4">
			<!-- Recipes -->
			<section>
				<ul class="list-disc pl-5">
					{#each recipes as recipe}
						<li class="text-sm">{recipe.name}</li>
					{/each}
				</ul>
			</section>

			<!-- Diary counter -->
			<section class="flex flex-col gap-4">
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
					<p>Calories: {diaryValues.total_calories}</p>
					<p>Protein: {diaryValues.total_protein}</p>
					<p>Carbs: {diaryValues.total_carbs}</p>
					<p>Fats: {diaryValues.total_fats}</p>
					<strong>CO2 prevented: 0</strong>
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
			<section>
				<nav class="flex gap-4 mb-2">
					<button class="text-sm font-medium text-gray-300 hover:text-white">Global</button>
					<button class="text-sm font-medium text-gray-300 hover:text-white">FriendGroup 1</button>
				</nav>
				<ul class="text-sm">
					<li>Be: 100</li>
					<li>Me: 200</li>
				</ul>
			</section>
		</section>
	</section>
</section>

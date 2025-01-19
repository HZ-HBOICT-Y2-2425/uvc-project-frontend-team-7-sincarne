<script lang="ts">
	import { z } from 'zod';
	import axios from 'axios';
	import type { Snippet } from 'svelte';
	import type { InewIngredient } from '$lib/helpers/recipesTypesAndSchemas';

	interface Iprops {
		callback: { func: (newIngredient: InewIngredient, ...args: any[]) => void; params: any[] };
		comfirmation: boolean;
		vege?: boolean | null;
		children?: Snippet;
	}

	let tempIngredient: string = $state('');

	let newIngredient: InewIngredient = $state({
		ingredient_code: 0,
		ingredient_name: '',
		amount: 0
	});

	let ingredientsSuggestions: {
		ingredient_code: number;
		ingredient_description: string;
	}[] = $state([]);

	const suggestionSchema = z.array(
		z.object({
			ingredient_code: z.number(),
			ingredient_description: z.string()
		})
	);

	const { callback, children, vege, comfirmation }: Iprops = $props();

	async function selectSuggestion(ingredient_description: string, ingredient_code: number) {
		// Set a name of the new igredient of that of the suggestion
		newIngredient.ingredient_name = ingredient_description;
		// Set the code of the new igredient of that of the suggestion
		newIngredient.ingredient_code = ingredient_code;
		// Visualize that change in the value binded to the input element
		tempIngredient = ingredient_description;
		// Clear the rest of the suggestions
		ingredientsSuggestions = [];
		// If comfimation is not need call the callback function right here
		if (!comfirmation) {
			callback.func(newIngredient, ...callback.params);
		}
	}
	async function search() {
		// If the searching value is empty return
		if (!tempIngredient) return;
		// If user has changed the igredient they cannot submit till they choose again
		newIngredient.ingredient_name = '';
		// Change search option based on provided prop
		const addition = vege !== undefined && vege !== null ? (vege ? 'vege' : 'carni') : '';
		// Search for possible options and add them to suggestions
		axios.get('/nutri/search' + addition + '/' + tempIngredient).then((response) => {
			const parsed = suggestionSchema.safeParse(response.data);
			if (!parsed.success) {
				console.log(parsed.error);
				return;
			}
			ingredientsSuggestions = parsed.data;
		});
	}
</script>

<div class="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
	<input
		type="number"
		name="weight"
		class="w-16 px-2 py-1 text-white rounded-lg focus:outline-none bg-gray-900 appearance-none font-semibold "
		style="-moz-appearance: textfield;"
		bind:value={newIngredient.amount}
	/><strong class="mr-6">g</strong>
	<input
		type="text"
		name="ingredient"
		class="flex-grow px-2 py-1 text-white rounded-lg focus:outline-none bg-transparent appearance-none font-semibold"
		placeholder="Input ingredient name..."
		bind:value={tempIngredient}
		oninput={search}
	/>
	{#if children}
		{@render children()}
	{/if}
	{#if comfirmation}
		<button
			type="submit"
			class="bg-green-500 w-[2rem] h-[2rem] text-center rounded-3xl font-semibold"
			onclick={() => {
				callback.func(newIngredient, ...callback.params);
				// Reset the values
				tempIngredient = '';
				newIngredient.ingredient_name = '';
				newIngredient.amount = 0;
			}}>+</button
		>
	{/if}
</div>
{#if ingredientsSuggestions.length > 0}
<div class="flex flex-col gap-1 mt-2">
	{#each ingredientsSuggestions as suggestion}
		<button
			class="flex items-center px-2 py-1 bg-gray-800 rounded-lg hover:bg-gray-700 transition font-semibold"
			onclick={() => {
				selectSuggestion(suggestion.ingredient_description, suggestion.ingredient_code);
			}}>{suggestion.ingredient_description}</button
		>
	{/each}
</div>
{/if}
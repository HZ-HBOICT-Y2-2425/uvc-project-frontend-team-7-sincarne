<script lang="ts">
	import { z } from 'zod';
	import axios from 'axios';

	export interface InewIngredient {
		ingredient_name: string;
		amount: number;
	}

	interface Iprops {
		labelText: string;
		addFunction: (newIngredient: InewIngredient, ...args: any[]) => void;
		params?: any[];
	}

	let tempIngredient: string = $state('');

	let newIngredient: InewIngredient = $state({
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

	const { labelText, addFunction, params = [] }: Iprops = $props();

	async function selectSuggestion(ingredient_description: string) {
		// Set a name of the new igredient of that of the suggestion
		newIngredient.ingredient_name = ingredient_description;
		// Visualize that change in the value binded to the input element
		tempIngredient = ingredient_description;
		// Clear the rest of the suggestions
		ingredientsSuggestions = [];
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
</script>

<label for="ingredient">{labelText}</label>
<input
	type="text"
	name="ingredient"
	class="text-black"
	bind:value={tempIngredient}
	oninput={search}
/>
<p>
	<input type="number" name="weight" class="text-black" bind:value={newIngredient.amount} /><strong
		>g</strong
	>
</p>
<button
	type="submit"
	onclick={() => {
		addFunction(newIngredient, ...params);
		// Reset the values
		tempIngredient = '';
		newIngredient.ingredient_name = '';
		newIngredient.amount = 0;
	}}>Add</button
>
<div class="flex flex-col">
	{#each ingredientsSuggestions as suggestion}
		<button
			onclick={() => {
				selectSuggestion(suggestion.ingredient_description);
			}}>{suggestion.ingredient_description}</button
		>
	{/each}
</div>

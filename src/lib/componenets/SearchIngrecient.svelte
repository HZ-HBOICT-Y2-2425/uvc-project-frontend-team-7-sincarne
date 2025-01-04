
<script lang="ts">
	import { z } from 'zod';
	import axios from 'axios';
	import type { Snippet } from 'svelte';

	export interface InewIngredient {
		ingredient_name: string;
		ingredient_code: number;
		amount: number;
	}


	interface Iprops {
		labelText: string;
		ComfirmationText?: string,
		callback: {func : (newIngredient: InewIngredient, ...args: any[]) => void, params:any[]};
		comfirmation: boolean;
		vege?: boolean | null;
		children?:  Snippet ;
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

	const { labelText, ComfirmationText="add", callback, children, vege, comfirmation }: Iprops = $props();

	async function selectSuggestion(ingredient_description: string,ingredient_code: number) {
		// Set a name of the new igredient of that of the suggestion
		newIngredient.ingredient_name = ingredient_description;
		// Set the code of the new igredient of that of the suggestion
		newIngredient.ingredient_code = ingredient_code;
		// Visualize that change in the value binded to the input element
		tempIngredient = ingredient_description;
		// Clear the rest of the suggestions
		ingredientsSuggestions = [];
		// If comfimation is not need call the callback function right here
		if(!comfirmation){
			callback.func(newIngredient,...callback.params);
		}
	}
	async function search() {


		// If the searching value is empty return
		if (!tempIngredient) return;
		// If user has changed the igredient they cannot submit till they choose again
		newIngredient.ingredient_name = '';
		// Change search option based on provided prop
		const addition = (vege !== undefined && vege !== null) ? (vege ? "vege" : "carni") :  ""
		// Search for possible options and add them to suggestions
		axios.get('/nutri/search'+addition+'/'+ tempIngredient).then((response) => {
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
<div class="flex flex-col">
	{#each ingredientsSuggestions as suggestion}
		<button
			onclick={() => {
				selectSuggestion(suggestion.ingredient_description,suggestion.ingredient_code);
			}}>{suggestion.ingredient_description}</button
		>
	{/each}
</div>
{#if children }
	{@render children()}
{/if }
{#if comfirmation}
<button
	type="submit"
	onclick={() => {
		callback.func(newIngredient, ...callback.params);
		// Reset the values
		tempIngredient = '';
		newIngredient.ingredient_name = '';
		newIngredient.amount = 0;
	}}>{ComfirmationText}</button
>
{/if}
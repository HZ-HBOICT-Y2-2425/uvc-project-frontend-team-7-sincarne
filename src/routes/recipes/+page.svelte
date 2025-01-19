<script lang="ts">
	import CreateRecipeModal from '$lib/componenets/CreateRecipeModal.svelte';
	import { onMount } from 'svelte';
	import '../../app.css';
	import axios from 'axios';
	import {z} from "zod"

	let isModalOpen = $state(false);

	let recipes: {
		id: number,
		name: string,
		image_path: string | null,
		total_calories: number,
		total_fats: number,
		total_carbs: number,
		total_protein: number
	}[] = $state([]);

	const recipeSchema =  z.array(z.object({
		id: z.number(),
		name: z.string(),
		image_path: z.string().nullable(),
		total_calories: z.number(),
		total_fats: z.number(),
		total_carbs: z.number(),
		total_protein: z.number()
	}));

	//todo: set up sth during loading state 
	let loading = true;

	function handleClick() {
		isModalOpen = true;
	}

	// If modal was closed preemtivily fetch for recipes again 
	$effect(()=>{
		if(!isModalOpen){
			getRecipes();
		}
	})	

	async function getRecipes() {
		await axios.get('/user/getRecipes').then(
			response => {
				const parsed = recipeSchema.safeParse(response.data)
				if(!parsed.success){
					console.log(parsed.error)
					return
				}
				recipes = parsed.data;
				loading = false;
			}
		)
	}
	onMount(async () => {
		await getRecipes()
	})



</script>

<section
	class="mt-4 text-slate-100 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
>
	{#each recipes as recipe}
		<a href = "recipes/{recipe.id}"   class="relative group rounded-lg overflow-hidden shadow-lg">
			<div
				class="w-full aspect-w-4 aspect-h-3 bg-cover bg-center"
				style="background-image: url('{recipe.image_path ?? './recipe1.jpg'}')"
			>
				<div
					class="absolute top-0 left-0 w-full h-16 bg-zinc-900 bg-opacity-80 text-center py-2 sm:py-3 lg:py-4 text-sm sm:text-base md:text-lg lg:text-xl font-bold group-hover:opacity-100 group-hover:bg-slate-100 group-hover:text-black transition-all"
				>
					{recipe.name}
				</div>
				<div
					class=" absolute bottom-0 top-[unset] left-0 w-full h-16 bg-zinc-900 bg-opacity-95 text-center py-2 sm:py-3 lg:py-4 text-sm sm:text-base md:text-lg lg:text-xl font-bold group-hover:opacity-100 group-hover:bg-slate-100 group-hover:text-black transition-all
                    grid grid-cols-2
                    "
				>
					<p>Kcal: {recipe.total_calories}</p>
					<p>Protein: {recipe.total_protein}</p>
					<p>Fats: {recipe.total_fats}</p>
					<p>Carbs: {recipe.total_carbs}</p>
				</div>
			</div>
		</a>
	{/each}
	<section>
		<button onclick={handleClick}> add new recipe </button>
	</section>
	{#if isModalOpen}
		<CreateRecipeModal bind:isModalOpen />
	{/if}
</section>

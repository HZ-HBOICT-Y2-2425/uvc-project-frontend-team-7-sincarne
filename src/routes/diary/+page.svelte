<script lang="ts">
	import SearchIngrecient from '$lib/componenets/SearchIngrecient.svelte';
import axios from 'axios';
	import { onMount } from 'svelte';
	import { z } from 'zod';

	let currentDate: Date = $state.raw(new Date());

	let diaryValues: {
		total_calories: number;
		total_fats: number;
		total_carbs: number;
		total_protein: number;
	} = $state({
		total_calories: 0,
		total_protein: 0,
		total_carbs: 0,
		total_fats: 0
	});
	let creationModalOpen: boolean = $state(false);

	let diarySchema = z.object({
		total_calories: z.number(),
		total_fats: z.number(),
		total_carbs: z.number(),
		total_protein: z.number()
	});

	// Update the current date with set amount of dates
	function updateDays(days: number) {
		let date = new Date(currentDate);
		date.setDate(date.getDate() + days);
		currentDate = date;
		getDiaryEntry();
	}

	function createEntry() {}

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
	onMount(async () => {
		await getDiaryEntry();
	});
</script>

<section
	class="mt-4 text-slate-100 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
>
	{#if creationModalOpen}
		<section class="absolute top-0 left-0 h-full w-full flex justify-center text-white">
			<button
				aria-label="Close"
				class="absolute bg-black bg-opacity-90 cursor-pointer h-full w-full"
				onclick={() => {
					creationModalOpen = false;
				}}
			></button>
			<div class="absolute z-10 self-center bg-zinc-900 p-6 flex flex-col items-center gap-4">
				<h1>Add new entry for <strong class="text-green-500">{currentDate.toDateString()}</strong>!</h1>
				<SearchIngrecient labelText="Select new entry product" addFunction={createEntry} />
				<button
					type="submit"
					onclick={() => {
						creationModalOpen = false;
					}}>CANCEL</button
				>
			</div>
		</section>
	{/if}
	<section class="flex flex-col bg-zinc-900 bg-opacity-90 shadow-lg rounded-lg text-white">
		<!--Diary Counter  -->
		<section>
			<!-- Time control -->
			<section class="flex flex-row">
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
				<p>{diaryValues.total_calories}</p>
				<p>{diaryValues.total_protein}</p>
				<p>{diaryValues.total_carbs}</p>
				<p>{diaryValues.total_fats}</p>
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
		<section></section>
		<!--Recipes -->
		<section></section>
	</section>
</section>

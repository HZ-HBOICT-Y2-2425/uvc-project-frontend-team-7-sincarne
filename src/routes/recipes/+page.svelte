<script>
	// @ts-nocheck
	import '../../app.css';
</script>

<section
	class="mt-4 text-slate-100 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
>
	{#each [{ title: 'Recipe 1', img: '/recipe1.jpg' }, { title: 'Recipe 2', img: '/recipe2.jpg' }, { title: 'Recipe 3', img: '/recipe3.jpg' }] as recipe}
		<section class="relative group rounded-lg overflow-hidden shadow-lg">
			<div
				class="w-full aspect-w-4 aspect-h-3 bg-cover bg-center"
				style="background-image: url('{recipe.img}')"
			>
				<div
					class="absolute top-0 left-0 w-full h-16 bg-zinc-900 bg-opacity-80 text-center py-2 sm:py-3 lg:py-4 text-sm sm:text-base md:text-lg lg:text-xl font-bold group-hover:opacity-100 group-hover:bg-slate-100 group-hover:text-black transition-all"
				>
					{recipe.title}
				</div>
				<div
					class=" absolute bottom-0 top-[unset] left-0 w-full h-16 bg-zinc-900 bg-opacity-95 text-center py-2 sm:py-3 lg:py-4 text-sm sm:text-base md:text-lg lg:text-xl font-bold group-hover:opacity-100 group-hover:bg-slate-100 group-hover:text-black transition-all
                    grid grid-cols-2
                    "
				>
					<p>Kcal: 100</p>
					<p>Protein: 100</p>
					<p>Fats: 100</p>
					<p>Carbs: 100</p>
				</div>
			</div>
		</section>
	{/each}
    <section class>


    </section>

</section>

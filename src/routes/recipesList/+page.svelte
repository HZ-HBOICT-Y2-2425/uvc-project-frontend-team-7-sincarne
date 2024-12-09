<script>
    // @ts-nocheck
    import "../../app.css";
</script>

<section>
    <section>
            
        <h1 class="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl flex items-center justify-center">
        
            <b class="ml-2 text-slate-100">RECIPES</b>
        </h1>
    </section>

    <section class="relative mt-4 text-slate-100 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:w-10/12">
        
        {#each [{ title: "Recipe 1", img: "/recipe1.jpg" , calories: 1000 , proteins: 75}, { title: "Recipe 2", img: "/recipe2.jpg" , calories: 1000 , proteins: 75}, { title: "Recipe 3", img: "/recipe3.jpg" , calories: 1000  , proteins: 75}] as recipe}
            <section class="relative group rounded-lg overflow-hidden shadow-lg">
                <a href="/recipeExample">
                

                <div
                class=" w-full h-20 sm:h-20 md:h-24 lg:h-28 bg-black bg-opacity-70 text-center py-2 sm:py-3 lg:py-4 text-sm sm:text-base md:text-lg lg:text-xl font-bold group-hover:opacity-100 group-hover:bg-slate-100 group-hover:text-black transition-all"
            >
                <div class="w-full">
                    {recipe.title}
                </div>
                <div class="text-left pl-4">
                    Calories: {recipe.calories}
                </div>
                <div class="text-left pl-4">
                    Proteins: {recipe.proteins}
                </div>

            </div>


                <div
                    class="w-full aspect-w-4 aspect-h-3 bg-cover bg-center"
                    style="background-image: url('{recipe.img}')"
                >
                    

                
                </div>
            </a>    
            </section>
        {/each}

        


    </section>
</section>
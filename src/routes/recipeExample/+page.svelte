<script>
    // @ts-nocheck
    import "../../app.css";
</script>


<section class="relative mt-4 text-slate-100 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6">

    
    <section class="relative h-full w-full flex flex-col p-6 bg-zinc-900 bg-opacity-90 rounded-xl shadow-lg hover:shadow-xl   transition-all mx-auto items-center justify-center space-y-6 overflow-hidden">
        
      
        <div
            class="w-full aspect-w-4 aspect-h-3 bg-cover bg-center rounded-xl"
            style="background-image: url('/recipe2.jpg');">
        </div>

      
        <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center">
            Normal Recipe 
        </h1>

     

            
            <section class="p-4  bg-opacity-90 rounded-lg shadow-md text-white text-sm md:text-base lg:text-lg space-y-4">
                
                <h2 class="text-center font-bold text-xl md:text-2xl">Already Added Ingredient:</h2>



                    <!-- ALREDY MADE INGREDIENTS -->

                    <section class="space-y-2 bg-green-500 rounded-lg">
                        <p class="text-center text-xl"><span class="font-semibold">Lettuce</span>: 100g</p>
                        <hr>
                        <section class="flex justify-center text-center space-x-4">
                            <div>
                                <p class="font-bold">Calories</p>
                                <p>1 kcal</p>
                            </div>
                            <div>
                                <p class="font-bold">Carbs</p>
                                <p>1g</p>
                            </div>
                            <div>
                                <p class="font-bold">Proteins</p>
                                <p>1g</p>
                            </div>
                
                            </section>
                    </section>

                    <section class="bg-red-500  bg-opacity-100 !important space-y-2 rounded-lg">
                        <p class="text-center text-xl"><span class="font-semibold">Beef</span>: 100g</p>
                        <hr>
                        <section class="flex justify-center text-center space-x-4">
                            <div>
                                <p class="font-bold">Calories</p>
                                <p>1 kcal</p>
                            </div>
                            <div>
                                <p class="font-bold">Carbs</p>
                                <p>1g</p>
                            </div>
                            <div>
                                <p class="font-bold">Proteins</p>
                                <p>1g</p>
                            </div>
                
                            </section>
                    </section>

                    
            

            <!-- ADD NEW INGREDIENTS-->
            <form class="space-y-4 mx-4 sm:mx-6 md:mx-8 lg:mx-10">
            
                <div>
                    <label for="ingredientName" class="block text-sm font-medium text-slate-300">Enter ingredient name</label>
                    <input 
                        type="text" 
                        id="ingredientName" 
                        class="mt-1 block w-full rounded-md border-slate-300 bg-slate-800 text-slate-100 focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                        placeholder="Spinach"
                    />
                </div>

                <div>
                    <label for="amount" class="block text-sm font-medium text-slate-300">Enter its amount in grams</label>
                    <input 
                        type="number" 
                        id="amount" 
                        class="mt-1 block w-full rounded-md border-slate-300 bg-slate-800 text-slate-100 focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                        placeholder="100"
                    />
                </div>
    
                <button 
                    type="submit" 
                    class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-all"
                >
                    Add Ingredient
                </button>
            </form>

        </section>
    </section>

    <!-- Center Arrow -->
    <section class="relative h-full w-full flex items-center justify-center">
        <div
            class="w-full aspect-w-4 aspect-h-3 bg-cover bg-center rounded-xl rotate-90 sm:rotate-90 md:rotate-0"
            style="background-image: url('/arrow.png');">
        </div>
    </section>


    <!-- Right Recipe Card -->
    <section class="relative h-full w-full flex flex-col p-6 bg-zinc-900 text-white bg-opacity-90 rounded-xl shadow-lg hover:shadow-xl   transition-all mx-auto items-center justify-center space-y-6 overflow-hidden">
        
      
        <div
            class="w-full aspect-w-4 aspect-h-3 bg-cover bg-center rounded-xl"
            style="background-image: url('/recipe2.jpg');">
        </div>

      
        <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center">
           Witch's Brew
        </h1>
                     
            <section class="p-4  bg-opacity-90 rounded-lg shadow-md  text-sm md:text-base lg:text-lg space-y-4">
                
                <h2 class="text-center font-bold text-xl md:text-2xl">Already Added Ingredient:</h2>



                   

                    <section class="space-y-2 bg-green-500 rounded-lg">
                        <p class="text-center text-xl"><span class="font-semibold">Lettuce</span>: 100g</p>
                        <hr>
                        <section class="flex justify-center text-center space-x-4">
                            <div>
                                <p class="font-bold">Calories</p>
                                <p>1 kcal</p>
                            </div>
                            <div>
                                <p class="font-bold">Carbs</p>
                                <p>1g</p>
                            </div>
                            <div>
                                <p class="font-bold">Proteins</p>
                                <p>1g</p>
                            </div>
                
                            </section>
                    </section>

                    <section class="bg-amber-500  bg-opacity-100 !important space-y-2 rounded-lg">
                        <p class="text-center text-xl"><span class="font-semibold">Whatever</span>: 100g</p>
                        <hr>
                        <section class="flex justify-center text-center space-x-4">
                            <div>
                                <p class="font-bold">Calories</p>
                                <p>1 kcal</p>
                            </div>
                            <div>
                                <p class="font-bold">Carbs</p>
                                <p>1g</p>
                            </div>
                            <div>
                                <p class="font-bold">Proteins</p>
                                <p>1g</p>
                            </div>
                
                            </section>
                    </section>

                        <section  class="text-md sm:text-md md:text-lg lg:text-xl font-bold text-center">
                            Total:
                            <hr>
                            <section class="flex-col justify-center text-center space-x-4">
                                <div class="flex flex-row space-x-4 justify-center text-center">
                                    <p class="font-bold">Mass: </p>
                                    <p>200g</p>
                                </div>
                                <div  class="flex flex-row space-x-4 justify-center text-center">
                                    <p class="font-bold">Calories:</p>
                                    <p>2 kcal</p>
                                </div>
                                <div  class="flex flex-row space-x-4 justify-center text-center">
                                    <p class="font-bold">Carbs: </p>
                                    <p>2g</p>
                                </div>
                                <div  class="flex flex-row space-x-4 justify-center text-center">
                                    <p class="font-bold">Proteins: </p>
                                    <p>2g</p>
                                </div>
                                
                            </section>
                        
                        </section>


            </section>
                    
            

           
    </section>

</section>

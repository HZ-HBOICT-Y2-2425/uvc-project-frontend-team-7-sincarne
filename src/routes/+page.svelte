<script>
// @ts-nocheck

    import "../app.css";

    /**
	 * @param {string} route
	 */
    function changePage(route){
        location.href = route;
    }
</script>

<section class="mx-4 text-slate-100 flex flex-col items-center justify-center space-y-4 sm:space-y-8 md:space-y-12 lg:space-y-14">
    
    <section>
        <h1 class="text-slate-50 font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl flex items-center justify-center">
            CHOOSE
        </h1>
    
        <h1 class="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl flex items-center justify-center">
            <b class="mr-2">THE</b>
            <b class="text-green-500 mx-0.5 sm:mx-0.5 lg:mx-1">GREEN</b>
            <b class="ml-2">OPTION</b>
         </h1>
    </section>
    
    <article class="text-slate-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl text-center">
        SinCarne is a recipe conversion application designed to help 
        users replace meat with plant-based substitutes in their favorite 
        dishes. Whether you're focused on matching taste, cutting calories, 
        or balancing macros, SinCarne provides tailored recommendations to meet 
        your dietary and culinary preferences.
    </article>

    <button class="hover:text-gray-400 hover:border-gray-400 
        border-slate-100  p-4 sm:px-12 md:px-16 lg:px-32
        text-md sm:text-lg md:text-xl lg:text-2xl 
        border-2 sm:border-2 lg:border-4 rounded-sm transition-all"
        on:click={changePage("/registration")} >
        
            REGISTER NOW
       
    </button>

    <section class="flex flex-row">
        <p  class="mr-2">Already have an account?</p>
        <button class=" hover:underline mx-0.5 sm:mx-0.5 lg:mx-1 text-sky-400 "><a href="/logIn"> Log in </a></button>
    </section>



</section>
<script>
    import "../../app.css";
</script>

<section class="mx-4 text-slate-100 flex flex-col items-center justify-center space-y-4 sm:space-y-8 md:space-y-12 lg:space-y-14">
    <div 
        class="border-4 border-slate-100 bg-center bg-no-repeat pb-8 rounded-sm shadow-lg text-slate-100 max-w-md w-full h-auto"
        style="
            background-image: url('/SinCarneLoginBg.png');
            background-size: contain;
        "
    >
        <h1 class="bg-black bg-opacity-70 py-6 text-2xl sm:text-3xl md:text-3xl font-bold text-center mb-6">
            SIGN UP 
        </h1>

        <form class="space-y-8 mx-4 sm:mx-6 md:mx-8 lg:mx-10">
            
            <div>
                <label for="email" class="block text-sm font-medium text-slate-300 ">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    class="mt-1 block w-full rounded-md border-slate-300 bg-slate-800 bg-opacity-50 text-slate-100 focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                    placeholder="Enter your email"
                />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-slate-300">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    class="mt-1 block w-full rounded-md border-slate-300 bg-slate-800 bg-opacity-50 text-slate-100 focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                    placeholder="Enter your password"
                />
            </div>

          
            <button 
                type="submit" 
                class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-all"
            >
                SIGN UP
            </button>
        </form>

        <p class="text-center text-sm text-slate-300 mt-16">
            Already have an account? 
            <a href="/" class="text-sky-400 hover:underline">Log in</a>
        </p>
    </div>
</section>


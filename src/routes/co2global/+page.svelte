<script lang="ts">

    let totalCO2Saved = 0;

    export let data;
	if (data.redirect) {
        location.href = data.redirect; // Perform the redirect to the backend route
    } else {
        totalCO2Saved = data.totalCO2Saved;
    }

    function formatCO2Saved(co2: number): string {
        return co2.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }
</script>
    

<section class="flex flex-col items-center justify-center h-screen text-slate-100">
    <h1 class="text-5xl font-bold mb-8">CO2 Savings by Everyone</h1>
    <a href="/co2personal" class="hover:underline hover:text-green-400 transition-colors duration-1000">
        <h2 class="font-bold mb-8">View your own contribution</h2>
    </a>

    <div class="flex flex-col items-center bg-zinc-900 p-8 rounded-lg shadow-lg">
        <p class="text-xl mb-2">Together, we've saved:</p>
        <p class="text-6xl font-extrabold text-green-400">{formatCO2Saved(totalCO2Saved)} kg</p>
        <p class="text-sm mt-4 text-gray-400">Equivalent to planting {Math.round(totalCO2Saved / 22)} trees*</p>
    </div>

    <footer class="mt-12 text-center text-gray-400">
        <p class="text-sm">*An average tree absorbs 22 kg of CO2 per year.</p>
        <p class="text-sm mt-2">Thank you for making a difference!</p>
    </footer>
</section>

<style>
    section {
        font-family: 'Inter', sans-serif;
    }

    div {
        animation: fadeIn 1s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>

<script lang="ts">
    let teamName = "Albanian Activists";
    let teamGoal = 500; 
    let currentSavings = 200; 
    let teamMembers = ["Zana", "Alban", "Donat"];
</script>

<section class="flex flex-col items-center justify-center h-screen text-slate-100">
    <h1 class="text-4xl font-bold mb-6">{teamName}</h1>
    <div class="bg-zinc-900 bg-opacity-90 rounded-lg p-8 shadow-lg w-full max-w-3xl">
        <p class="text-lg mb-4">Team Goal: <span class="text-green-400">{teamGoal} kg</span></p>
        <p class="text-lg mb-8">Current Savings: <span class="text-green-400">{currentSavings} kg</span></p>

        <div class="mt-8">
            <h2 class="text-2xl font-semibold mb-4">Team Members</h2>
            <ul>
                {#each teamMembers as member}
                    <li class="bg-gray-800 p-4 mb-4 rounded shadow-md">{member}</li>
                {/each}
            </ul>
        </div>

        <div class="mt-6 text-center">
            <a href="/teams_admin" class="hover:underline">View as Admin</a>
        </div>
    </div>
</section>

<style>
    section {
        font-family: 'Inter', sans-serif;
        padding: 2rem;
		border-radius: 8px;
    }
</style>

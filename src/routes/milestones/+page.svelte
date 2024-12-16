<script lang="ts">
    let milestones = [
        { id: 1, name: "Complete 10 Plant-Based Meals", description: "Cook 10 meals using plant-based ingredients.", goal: 10, progress: 10, completed: false },
        { id: 2, name: "Meat-Free Week", description: "Go one week without consuming any meat.", goal: 7, progress: 7, completed: false },
        { id: 3, name: "100% Vegan for a Month", description: "Follow a strict vegan diet for a whole month.", goal: 30, progress: 20, completed: false },
        { id: 4, name: "Zero Waste Day", description: "Spend a full day with zero food waste.", goal: 1, progress: 1, completed: true },
        { id: 5, name: "5 Meat-Free Weeks", description: "Complete 5 consecutive weeks without meat.", goal: 5, progress: 3, completed: false },
        { id: 6, name: "Vegan Cooking Class", description: "Attend a vegan cooking workshop or class.", goal: 1, progress: 1, completed: true },
        { id: 7, name: "Complete 50 Plant-Based Meals", description: "Cook 50 plant-based meals.", goal: 50, progress: 25, completed: false },
        { id: 8, name: "Meat-Free 30 Days", description: "Go 30 consecutive days without eating meat.", goal: 30, progress: 30, completed: true },
        { id: 9, name: "Try 5 New Vegan Recipes", description: "Cook 5 new vegan recipes.", goal: 5, progress: 2, completed: false },
        { id: 10, name: "Sustainable Shopping", description: "Complete a sustainable shopping challenge.", goal: 1, progress: 1, completed: true },
        { id: 11, name: "100% Plant-Based Week", description: "Go one week eating only plant-based meals.", goal: 7, progress: 4, completed: false },
        { id: 12, name: "30 Meat-Free Days", description: "Go 30 days without consuming meat.", goal: 30, progress: 10, completed: false },
        { id: 13, name: "Vegan for 100 Days", description: "Follow a vegan diet for 100 days.", goal: 100, progress: 60, completed: false },
        { id: 14, name: "Support Local Farmers", description: "Buy ingredients from local farmers for a week.", goal: 7, progress: 7, completed: true },
        { id: 15, name: "Complete 100 Plant-Based Meals", description: "Cook 100 plant-based meals.", goal: 100, progress: 40, completed: false },
        { id: 16, name: "Complete Meat-Free Month", description: "Go an entire month without eating meat.", goal: 30, progress: 15, completed: false },
        { id: 17, name: "Complete 120 Plant-Based Meals", description: "Start sharing your plant-based recipes online.", goal: 120, progress: 0, completed: false },
        { id: 18, name: "Join a Meat-Free Challenge", description: "Join a global meat-free challenge.", goal: 1, progress: 1, completed: true },
        { id: 19, name: "Zero Waste Grocery Store Visit", description: "Visit a zero-waste grocery store.", goal: 1, progress: 1, completed: true },
        { id: 20, name: "Host a Plant-Based Dinner Party", description: "Host a plant-based dinner for friends.", goal: 1, progress: 0, completed: false },
    ];

  
    function unlockMilestone(id: number) {
        const milestone = milestones.find(m => m.id === id);
        if (milestone && milestone.progress >= milestone.goal) {
            milestone.completed = true;
        }
    }
</script>

<section class="mx-4 text-slate-100 flex flex-col items-center justify-center space-y-4 sm:space-y-8 md:space-y-12 lg:space-y-14 relative">
    <div class="border-4 border-slate-100 bg-slate-800 bg-opacity-50 pb-8 rounded-sm shadow-lg text-slate-100 max-w-3xl w-full h-auto relative"> <!-- Updated max-w-xl to max-w-3xl -->

        <h1 class="bg-black bg-opacity-70 py-6 text-2xl sm:text-3xl md:text-3xl font-bold text-center mb-6">
            Milestones
        </h1>

        <div class="space-y-4 px-6"> 
            {#each milestones as milestone}
                <div class="bg-slate-700 p-4 rounded-lg">
                    <h3 class="text-xl font-semibold text-white">{milestone.name}</h3>
                    <p class="text-sm text-slate-300">{milestone.description}</p>
                    <p class="text-sm text-slate-300">Progress: {milestone.progress} / {milestone.goal}</p>

                    {#if milestone.completed}
                        <button class="mt-4 bg-green-500 text-white py-2 px-4 rounded-md disabled opacity-50 cursor-not-allowed">
                            Unlocked
                        </button>
                    {:else}
                        <button 
                            on:click={() => unlockMilestone(milestone.id)} 
                            class="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all 
                            {milestone.progress >= milestone.goal ? 'bg-green-500 cursor-not-allowed' : ''}">
                            Unlock
                        </button>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>


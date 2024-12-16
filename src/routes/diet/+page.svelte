<script lang="ts">
    let foodAllergies = [
        "Dairy", "Gluten", "Peanuts", "Shellfish", "Eggs",
        "Soy", "Tree Nuts", "Wheat", "Sesame", "Mustard"
    ];
    
    let foodPreferences = [
        "Vegan", "Vegetarian", "Pescatarian", "Halal", "Kosher",
        "Low Carb", "High Protein", "Low Fat", "Organic", "Local"
    ];

    let dietTips = [
        "Try to incorporate more plant-based meals into your week to reduce your carbon footprint.",
        "Choosing organic ingredients helps reduce the use of harmful pesticides and supports healthier farming.",
        "Drink plenty of water throughout the day to stay hydrated and support digestion.",
        "Consider growing your own herbs at home to reduce food miles and ensure freshness.",
        "Swap processed snacks with whole foods like fruits, nuts, and seeds for better nutrition."
    ];

    let randomDietTip = dietTips[Math.floor(Math.random() * dietTips.length)];

    function changeTip() {
        randomDietTip = dietTips[Math.floor(Math.random() * dietTips.length)];
    }
</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h2 class="text-4xl font-bold text-slate-100 text-center mb-8">Diet Preferences</h2>
    <section class="bg-zinc-900 bg-opacity-90 rounded-lg p-8 shadow-lg mb-8">
        <h3 class="text-2xl font-semibold text-slate-100 mb-4">Food Allergies</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {#each foodAllergies as allergy}
                <label class="flex items-center text-slate-100">
                    <input type="checkbox" class="mr-2 accent-green-500" /> {allergy}
                </label>
            {/each}
        </div>
    </section>

    <section class="bg-zinc-900 bg-opacity-90 rounded-lg p-8 shadow-lg mb-8">
        <h3 class="text-2xl font-semibold text-slate-100 mb-4">Food Preferences</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {#each foodPreferences as preference}
                <label class="flex items-center text-slate-100">
                    <input type="checkbox" class="mr-2 accent-green-500" /> {preference}
                </label>
            {/each}
        </div>
    </section>

    <section class="bg-zinc-900 bg-opacity-90 rounded-lg p-8 shadow-lg mb-8">
        <h3 class="text-2xl font-semibold text-slate-100 mb-4">Why Replacing Meat in Recipes is Good For You</h3>
        <p class="text-slate-300">
            Replacing meat in your recipes with plant-based alternatives can have a significant positive impact on your health and the environment. Plant-based diets are rich in nutrients and lower in saturated fats, which can help reduce the risk of heart disease, diabetes, and other chronic conditions. Additionally, producing plant-based foods generally requires fewer resources and generates less pollution than raising livestock. By choosing plant-based options, you contribute to a sustainable food system, reduce your carbon footprint, and support animal welfare. It’s a simple yet effective way to make a big difference for your health and the planet.
        </p>
    </section>

    <section class="bg-zinc-900 bg-opacity-90 rounded-lg p-8 shadow-lg">
        <h3 class="text-2xl font-semibold text-slate-100 mb-4">Green Diet Tip</h3>
        <p class="text-slate-300">{randomDietTip}</p>
        <button on:click={changeTip} class="mt-4 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded transition-all">
            Get Another Tip
        </button>
    </section>
</section>

<style>
    section {
        font-family: 'Inter', sans-serif;
    }

    h2, h3 {
        font-family: 'Inter', sans-serif;
    }

    label {
        display: flex;
        align-items: center;
        font-size: 1rem;
        padding: 0.5rem;
    }

    input[type="checkbox"] {
        accent-color: #48bb78;
        width: 20px;
        height: 20px;
    }
</style>

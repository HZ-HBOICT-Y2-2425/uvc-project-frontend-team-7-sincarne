<script lang="ts">
    import { onMount } from "svelte";

    let foodAllergies = [
        "Dairy", "Gluten", "Peanuts", "Shellfish", "Eggs",
        "Soy", "Tree Nuts", "Wheat", "Sesame", "Mustard"
    ];

    let foodPreferences = [
        "Vegan", "Vegetarian", "Pescatarian", "Halal", "Kosher",
        "Low Carb", "High Protein", "Low Fat", "Organic", "Local"
    ];

    let userAllergies: Record<string, boolean> = {};
    let userPreferences: Record<string, boolean> = {};

    async function toggleAllergy(allergy: string, value: boolean) {
        try {
            const response = await fetch("http://localhost:3000/update-allergy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ allergy, value }),
            });
            if (!response.ok) {
                console.error("Failed to update allergy:", await response.text());
            }
        } catch (err) {
            console.error("Error updating allergy:", err);
        }
    }

    async function togglePreference(preference: string, value: boolean) {
        try {
            const response = await fetch("http://localhost:3000/update-preference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ preference, value }),
            });
            if (!response.ok) {
                console.error("Failed to update preference:", await response.text());
            }
        } catch (err) {
            console.error("Error updating preference:", err);
        }
    }

    onMount(() => {
        //todo
    });
</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h2 class="text-4xl font-bold text-slate-100 text-center mb-8">Diet Preferences</h2>

    <section class="bg-zinc-900 bg-opacity-90 rounded-lg p-8 shadow-lg mb-8">
        <h3 class="text-2xl font-semibold text-slate-100 mb-4">Food Allergies</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {#each foodAllergies as allergy}
                <label class="flex items-center text-slate-100">
                    <input
                        type="checkbox"
                        class="mr-2 accent-green-500"
                        bind:checked={userAllergies[allergy]}
                        on:change={() => toggleAllergy(allergy, userAllergies[allergy])}
                    />
                    {allergy}
                </label>
            {/each}
        </div>
    </section>

    <section class="bg-zinc-900 bg-opacity-90 rounded-lg p-8 shadow-lg mb-8">
        <h3 class="text-2xl font-semibold text-slate-100 mb-4">Food Preferences</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {#each foodPreferences as preference}
                <label class="flex items-center text-slate-100">
                    <input
                        type="checkbox"
                        class="mr-2 accent-green-500"
                        bind:checked={userPreferences[preference]}
                        on:change={() => togglePreference(preference, userPreferences[preference])}
                    />
                    {preference}
                </label>
            {/each}
        </div>
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

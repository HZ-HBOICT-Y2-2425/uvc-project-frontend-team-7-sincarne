<script lang="ts">
    let teamName = "Albanian Activists";
    let teamGoal = 500;
    let currentSavings = 200; 
    let teamMembers = [
        { name: "Alban", role: "Admin" },
        { name: "Zana", role: "Member" },
        { name: "Donat", role: "Member" }
    ];

    let newMemberName = ""; 

    function addMember(name: string) {
        if (name.trim()) {
            teamMembers.push({ name, role: "Member" });
            newMemberName = ""; 
        }
    }

    function removeMember(index: number) {
        teamMembers.splice(index, 1);
    }

    function promoteToAdmin(index: number) {
        teamMembers[index].role = "Admin";
    }

    function updateGoal(newGoal: number) {
        teamGoal = newGoal;
    }
</script>

<section class="flex flex-col items-center justify-center h-screen text-slate-100 py-8">
    <h1 class="text-4xl font-bold mb-6">{teamName}</h1>
    <div class="bg-zinc-900 bg-opacity-90 rounded-lg p-8 shadow-lg w-full max-w-3xl">
        <div class="text-center mb-8">
            <p class="text-lg mb-4">Team Goal: <span class="text-green-400">{teamGoal} kg</span></p>
            <p class="text-lg">Current Savings: <span class="text-green-400">{currentSavings} kg</span></p>
        </div>

        <div class="mt-6">
            <label for="goalInput" class="block mb-2 text-center">Update Team Goal (kg):</label>
            <div class="flex justify-center">
                <input id="goalInput" type="number" bind:value={teamGoal} class="p-2 rounded bg-gray-800 text-slate-100 w-1/2">
                <button on:click={() => updateGoal(teamGoal)} class="ml-2 bg-green-500 text-white px-4 py-2 rounded">Update</button>
            </div>
        </div>

        <div class="mt-8">
            <h2 class="text-2xl font-semibold mb-4">Team Members</h2>
            <ul>
                {#each teamMembers as member, index}
                    <li class="flex justify-between items-center bg-gray-800 p-4 mb-4 rounded shadow-md">
                        <span>{member.name} ({member.role})</span>
                        <div class="flex space-x-2">
                            {#if member.role !== "Admin"}
                                <button on:click={() => promoteToAdmin(index)} class="bg-blue-500 px-2 py-1 rounded text-white">Promote</button>
                            {/if}
                            <button on:click={() => removeMember(index)} class="bg-red-500 px-2 py-1 rounded text-white">Remove</button>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="mt-6">
            <label for="newMember" class="block mb-2 text-center">Add New Member:</label>
            <div class="flex justify-center">
                <input id="newMember" type="text" bind:value={newMemberName} class="p-2 rounded bg-gray-800 text-slate-100 w-1/2">
                <button on:click={() => addMember(newMemberName)} class="ml-2 bg-green-500 text-white px-4 py-2 rounded">Add</button>
            </div>
        </div>
    </div>
</section>

<style>
    section {
        font-family: 'Inter', sans-serif;
        padding: 2rem;
        /* Tofix */
        margin-top: 2rem;
		border-radius: 8px;
}
</style>

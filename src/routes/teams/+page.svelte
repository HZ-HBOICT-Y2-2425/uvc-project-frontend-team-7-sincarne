<script>
    // Static list of groups for now
    let groups = [
      { id: 1, name: 'Group A' },
      { id: 2, name: 'Group B' },
      { id: 3, name: 'Group C' }
    ];
  
    let newGroupName = '';
  </script>
  
  <div class="max-w-lg mx-auto p-4">
    <h1 class="text-2xl text-white font-bold mb-4">Teams</h1>
  
    <!-- Add Group Form -->
    <div class="mb-4">
      <input
        type="text"
        bind:value={newGroupName}
        placeholder="Enter group name"
        class="p-2 rounded bg-gray-800 text-slate-100 w-1/2"
      />
      <button
        on:click={() => {
          if (newGroupName) {
            groups = [...groups, { id: groups.length + 1, name: newGroupName }];
            newGroupName = '';
          }
        }}
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Group
      </button>
    </div>
  
    <!-- Groups List -->
    <ul>
      {#each groups as group}
        <li class="flex text-white justify-between items-center p-2 border-b">
          <span>{group.name}</span>
          <button
            on:click={() => {
              groups = groups.filter(g => g.id !== group.id);
            }}
            class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </li>
      {/each}
    </ul>
  </div>


















<!-- <script lang="ts">
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
</style> -->

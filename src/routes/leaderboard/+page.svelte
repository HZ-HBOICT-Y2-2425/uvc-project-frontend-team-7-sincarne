<script lang="ts">

	type User = {
		name: string;
		co2Saved: number;
		rank: number;
		avatar: string;
	};

	let users: User[] = [];

	export let data;
	if (data.redirect) {
        location.href = data.redirect; // Perform the redirect to the backend route
    } else {
        users = data.users;
    }

</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h2 class="text-3xl font-bold text-slate-100 text-center mb-6">Global Leaderboard</h2>
	<section class="bg-zinc-900 bg-opacity-90 shadow-lg rounded-lg">
		<table class="w-full text-slate-100">
			<thead>
				<tr class="border-b border-gray-700">
					<th class="py-4 px-6 text-left">Rank</th>
					<th class="py-4 px-6 text-left">User</th>
					<th class="py-4 px-6 text-right">CO₂ Saved (kg)</th>
				</tr>
			</thead>
			<tbody>
				{#if users.length > 0}
					{#each users as user (user.rank)}
						<tr class="hover:bg-gray-700 transition-all">
							<td class="py-4 px-6">{user.rank}</td>
							<td class="py-4 px-6 flex items-center space-x-4">
								<img
									src={user.avatar}
									alt="{user.name}'s avatar"
									class="h-10 w-10 rounded-full object-cover"
								/>
								<span>{user.name}</span>
							</td>
							<td class="py-4 px-6 text-right">{user.co2Saved}</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="3" class="py-4 px-6 text-center">No data available.</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</section>
</section>

<style>
	th {
		font-weight: 600;
		text-transform: uppercase;
		font-size: 0.875rem;
	}

	td {
		font-size: 1rem;
	}
</style>

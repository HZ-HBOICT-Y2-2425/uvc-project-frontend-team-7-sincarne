<script lang="ts">
	let { children } = $props();
</script>

<div
	class="fixed right-0 top-1/2 transform -translate-y-1/2 bg-zinc-900 w-64 p-4 rounded-l-xl shadow-lg 
    z-50 flex flex-col items-center bg-opacity-90">
	<h3 class="text-xl font-semibold text-center mb-3 text-white">30 Meatless Days Challenge</h3>
	<p class="text-center text-white mb-4 text-sm">
		Ready to take on the 30 Meatless Days Challenge? Join now for better health and a greener
		planet!
	</p>
	<div class="flex justify-center space-x-3">
		<button class="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded text-sm">
			Accept
		</button>
		<button class="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded text-sm">
			Reject
		</button>
	</div>
</div>

<style>
	button {
		cursor: pointer;
		transition: all 0.3s ease;
	}

	button:hover {
		transform: scale(1.05);
	}

	.transform {
		transform: translateX(0);
	}

	footer button:hover {
		background-color: #48bb78;
		transform: scale(1.05);
	}
</style>

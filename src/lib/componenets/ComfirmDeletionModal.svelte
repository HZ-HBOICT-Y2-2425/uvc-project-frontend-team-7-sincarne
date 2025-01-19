<script lang="ts">
	import axios from 'axios';

	interface IProps {
		text: string;
		deletionFunc: () => void;
	}
	let { text, deletionFunc }: IProps = $props();

	function closeModal() {
		text = '';
	}
</script>

{#if text}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
		<!-- Background Overlay -->
		<button aria-label="Close Modal" class="absolute inset-0 cursor-pointer" onclick={closeModal}
		></button>

		<!-- Modal Content -->
		<div
			class="relative z-10 bg-zinc-900 p-6 rounded-lg shadow-lg flex flex-col items-center gap-4"
		>
			<!-- Modal Label -->
			<label for="name" class="self-start text-gray-300 text-lg font-semibold p-3">
				{text}
			</label>

			<!-- DELETE Button -->
			<div class="flex justify-end space-x-4">
				<!-- DELETE Button -->
				<button
					type="button"
					class="px-6 py-3 text-sm font-semibold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-300 transition duration-200"
					onclick={() => {
						deletionFunc();
						closeModal();
					}}
				>
					DELETE
				</button>

				<!-- CANCEL Button -->
				<button
					type="button"
					class="px-6 py-3 text-sm font-semibold text-gray-500 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 transition duration-200"
					onclick={closeModal}
				>
					CANCEL
				</button>
			</div>
		</div>
	</div>
{/if}

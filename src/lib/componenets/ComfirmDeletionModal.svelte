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
<div class="absolute top-0 left-0 h-full w-full flex justify-center text-white">
	<button
		aria-label="Close"
		class="absolute bg-black bg-opacity-90 cursor-pointer h-full w-full"
		onclick={closeModal}
	></button>
	<div class="absolute z-10 self-center bg-zinc-900 p-6 flex flex-col items-center gap-4">
		<label for="name" class="mb-[-8px] self-start">{text}</label>
		<button
			type="submit"
			class="text-red-500"
			onclick={() => {
				deletionFunc();
				closeModal();
			}}>DELETE</button
		>
		<button type="submit" onclick={closeModal}>CANCEL</button>
	</div>
</div>
{/if}

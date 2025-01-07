<script lang='ts'>
	import axios from 'axios';

	interface IProps{
		isModalOpen : boolean
	}
	let {isModalOpen = $bindable()} : IProps = $props() 

	let name = $state("")

	function closeModal(){
		isModalOpen = false;
	}

	//todo: error handling
	async function createRecipe(){

		await axios.post<{name : string}>('/user/createRecipe/',{name:name}).then(() => {isModalOpen = false;}
		);
	}



</script>

<div class="absolute top-0 left-0 h-full w-full flex justify-center" >
	<button aria-label="Close" class="absolute bg-black bg-opacity-90 cursor-pointer h-full w-full" onclick={closeModal}></button>
	<div class="absolute z-10 self-center bg-zinc-900 p-6 flex flex-col items-center gap-4">
		<h1>Create new Recipe</h1>
		<label for="name" class="mb-[-8px] self-start">Recipes's Title</label>
		<input  type="text" name="name" class="bg-zinc-600" bind:value={name}>
		<button type="submit" onclick={createRecipe}>submit</button>
	</div>

</div>



<script lang="ts">
    import "../../app.css";
    import ShareButton from '$lib/componenets/ShareButton.svelte';

    let profilePicture: string | null = null;
    let name: string = ''; 
    let message: string | null = null; 
    let bio = '';

    export let data;
	if (data.redirect) {
        location.href = data.redirect; // Perform the redirect to the backend route
    } else {
        name = data.name;
        profilePicture = data.picture;
    }

    // On page load, check if there's a saved profile picture and name in localStorage
    import { onMount } from 'svelte';

    onMount(() => {
        if (name === '') {
            const savedProfilePicture = localStorage.getItem('profilePicture');
            const savedName = localStorage.getItem('name');

            if (savedProfilePicture) {
                profilePicture = savedProfilePicture;
            }
            if (savedName) {
                name = savedName;
            }
        }
    });

    function handleProfilePicUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                profilePicture = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    function submitProfile() {
        if (profilePicture) {
            localStorage.setItem('profilePicture', profilePicture);
        }
        if (name) {
            localStorage.setItem('name', name);
        }

        message = 'Profile saved successfully!';

        // Hide the message after 1 second
        setTimeout(() => {
            message = null;
        }, 1000);
    }

    // Log out function
    function logOut() {
        // Redirect to login page 
        window.location.href = 'http://localhost:3011/user/logout'; 
    }
</script>

<section class="mx-4 text-slate-100 flex flex-col items-center justify-center space-y-4 sm:space-y-8 md:space-y-12 lg:space-y-14 relative">
    <div class="bg-zinc-900 bg-opacity-50 pb-8 rounded-sm shadow-lg text-slate-100 max-w-4xl w-full h-auto relative flex"> <!-- Flex layout for side menu and content -->

        <!-- Side Menu -->
        <div class="w-1/4 bg-zinc-900 p-6 flex flex-col space-y-4">
            <button 
                on:click={logOut}
                class="text-white font-semibold text-lg hover:text-red-500 transition-colors text-left">
                Log Out
            </button>
            <nav class="flex flex-col space-y-2">
                <a href="/co2personal" class="text-slate-300 hover:text-white text-lg transition-colors">
                    Statistics
                </a>
                
                <!-- Share buttons moved here -->
                <div class="share-buttons flex flex-col space-y-2 mt-4 pt-4 border-t border-zinc-700">
                    <h3 class="text-sm font-semibold text-slate-400 mb-2">Share CO2 prevented on</h3>
                    <ShareButton platform="TWITTER" />
                    <ShareButton platform="FACEBOOK" />
                    <ShareButton platform="LINKEDIN" />
                </div>
            </nav>
        </div>

        <!-- Profile Content -->
        <div class="w-3/4 p-6">
            <h1 class="bg-zinc-800 bg-opacity-70 py-6 text-2xl sm:text-3xl md:text-3xl font-bold text-center mb-6">
                Profile
            </h1>

            <form class="space-y-8 mx-4 sm:mx-6 md:mx-8 lg:mx-10">
                <!-- Profile Picture Section -->
                <div class="my-4">
                    {#if profilePicture}
                        <!-- svelte-ignore a11y_img_redundant_alt -->
                        <img src="{profilePicture}" 
                        alt="Profile Picture" 
                        class="mx-auto mb-4 w-48 h-48 rounded-full object-cover border-2 border-gray-300" />
                    {:else}
                        <img src="https://via.placeholder.com/200" 
                        alt="Placeholder" 
                        class="mx-auto mb-4 w-48 h-48 rounded-full object-cover border-2 border-gray-300" />
                    {/if}
                    <input 
                        type="file" 
                        accept="image/*" 
                        class="block mx-auto text-white" 
                        on:change={handleProfilePicUpload} />
                </div>

                <!-- Username Input -->
                <div>
                    <label for="username" class="block text-sm font-medium text-slate-300">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        class="mt-1 block w-full rounded-md border-slate-300 bg-zinc-600 bg-opacity-50 text-slate-100 focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                        bind:value={name}
                        placeholder="Enter your username"
                    />
                </div>

                <!-- Bio Section -->
                <div>
                    <label for="bio" class="block text-sm font-medium text-slate-300">Bio</label>
                    <textarea 
                        id="bio" 
                        class="mt-1 block w-full rounded-md border-slate-300 bg-zinc-900 bg-opacity-50 text-slate-100 focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                        bind:value={bio}
                        placeholder="Tell us about yourself..."></textarea>
                </div>

                <button 
                    type="submit" 
                    on:click={submitProfile}
                    class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-all">
                    Save
                </button>
            </form>

            {#if message}
                <div class="mt-4 text-green-500 font-bold text-center">{message}</div>
            {/if}
        </div>
    
</section>

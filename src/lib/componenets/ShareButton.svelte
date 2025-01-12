<script lang="ts">
    export let platform: 'TWITTER' | 'FACEBOOK' | 'LINKEDIN';

    const handleShare = async () => {
        try {
            const response = await fetch(`http://localhost:3011/user/share?platform=${platform}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            if (data.shareUrl) {
                window.open(data.shareUrl, '_blank');
            }
        } catch (error) {
            console.error('Share failed:', error);
        }
    };
</script>

<button 
    on:click={handleShare} 
    class="px-2 py-2 rounded-md cursor-pointer bg-green-500 text-white border-none hover:bg-green-600 transition-colors"
>{platform}</button>
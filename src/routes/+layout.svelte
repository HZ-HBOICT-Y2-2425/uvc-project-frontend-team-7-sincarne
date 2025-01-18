<script lang="ts">
    import '../app.css';
    let { children } = $props();
</script>

<section class="bg-cover bg-center bg-fixed min-h-screen flex flex-col bg-blur-md" style="background-image: url('/MainBg3.jpg')">
    <header>
        <section class="bg-black bg-opacity-50 text-slate-100 top-0 w-full">
            <nav class="max-w-7xl w-full px-4 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between h-16">
    <section class="flex-shrink-0 pl-0">
        <a href="/">
            <img src="/newSincarneLogo.png" alt="SinCarne Logo" class="h-14 w-auto object-contain" />
        </a>
    </section>
    <section class="flex items-center space-x-2 sm:space-x-2 md:space-x-4 lg:space-x-6">
        <a href="/diary">
            <button class="nav-link">
                Nutritional Diary
            </button>
        </a>
        <a href="/about">
            <button class="nav-link">
                About
            </button>
        </a>
        <a href="/co2global">
            <button class="nav-link">
                CO2
            </button>
        </a>
        <a href="/leaderboard">
            <button class="nav-link">
                Leaderboard
            </button>
        </a>
        <button>
            <a href="/profile">
                <img src="/profile.png" alt="Profile" class="h-8 sm:h-8 md:h-10 lg:h-12 w-auto max-h-12 max-w-12 object-cover" />
            </a>
        </button>
    </section>
</nav>
        </section>
    </header>

    <main class="mt-2 flex-grow relative">
        {@render children()}
    </main>
    <a href=/popup>
        <footer class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center w-full mt-auto">
            <p class="p-2 text-center text-slate-50 font-bold absolute-center">TOGETHER, WE CAN MAKE A DIFFERENCE</p>
            <p class="absolute right-4 text-right text-slate-100 font-italic">Version 3.1.0</p>
        </footer>
        
    </a>
</section>


<style>
    .nav-link {
        font-size: 1.2rem;
        font-weight: 500;
        color: #ffffff;
        text-decoration: none;
        transition: all 0.3s;
    }
    .nav-link:hover {
        border-bottom: 2px solid #fff;
        padding-bottom: 2px;
    }

</style>

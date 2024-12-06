<script lang="ts">
    let faqs = [
        {
            question: "What is SinCarne?",
            answer: "SinCarne is an application designed to help users reduce their environmental impact by swapping out meat in their recipes for plant-based alternatives. The app calculates and tracks CO2 savings, offers personalized recipe suggestions, and helps users adopt a more sustainable diet."
        },
        {
            question: "How does the app help reduce CO2 emissions?",
            answer: "By suggesting plant-based alternatives to meat-based ingredients, SinCarne reduces the carbon footprint associated with food production and consumption. The app tracks the CO2 savings from your recipe choices and provides you with real-time statistics to motivate you."
        },
        {
            question: "Can I store my favorite recipes in the app?",
            answer: "Yes! You can store, edit, and delete your recipes. The app also allows you to track the impact of switching to plant-based ingredients for each of your saved recipes."
        },
        {
            question: "How do I track my CO2 savings?",
            answer: "The app provides a personal dashboard where you can view your total CO2 savings. Each time you choose a plant-based recipe over a meat-based one, your CO2 savings are updated in real-time."
        },
        {
            question: "Can I track my progress over time?",
            answer: "Yes, SinCarne allows you to generate detailed reports of your progress, including CO2 savings and milestones. These reports can be shared on social media to inspire others."
        },
        {
            question: "What challenges can I participate in?",
            answer: "The app offers fun challenges such as 'Meat-Free Week' or '100 Days of Vegan Cooking.' These challenges encourage you to stay engaged with the app while contributing to your sustainability goals."
        },
        {
            question: "Can I connect with others in the app?",
            answer: "Yes, you can form groups, invite friends, and collaborate on collective CO2-saving challenges. There's also a global leaderboard where users with the highest CO2 savings are showcased."
        },
        {
            question: "How does the app recommend recipes?",
            answer: "SinCarne uses your dietary preferences, goals, and available ingredients to recommend plant-based recipes. The app also suggests random recipes through the 'Surprise Me' feature to keep your meals exciting and diverse."
        },
        {
            question: "Can I track my calories and nutritional intake?",
            answer: "Yes, the app provides a calorie and macro tracking feature to ensure that your plant-based meals align with your nutritional goals while being environmentally friendly."
        },
        {
            question: "How can I get started?",
            answer: "Simply create an account, and start exploring plant-based recipes."
        }
    ];
   
    let showAnswer = (index: number) => {
        const answerElement = document.getElementById(`answer-${index}`);
        answerElement?.classList.toggle("hidden");
    }
 </script>
 
 
 <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h2 class="text-4xl font-bold text-slate-100 text-center mb-8">Frequently Asked Questions</h2>
   
    <div class="space-y-6">
        {#each faqs as { question, answer }, index}
            <div class="border-b border-gray-700 py-4">
                <button
                    class="text-xl font-semibold text-slate-300 w-full text-left"
                    on:click={() => showAnswer(index)}
                >
                    {question}
                </button>
                <p
                    id={`answer-${index}`}
                    class="text-slate-300 mt-2 hidden"
                >
                    {answer}
                </p>
            </div>
        {/each}
    </div>
 </section>
 
 
 <style>
    section {
        background: rgba(0, 0, 0, 0.7);
        padding: 2rem;
        border-radius: 8px;
    }
 
 
    button {
        cursor: pointer;
        outline: none;
        background: none;
        border: none;
    }
 
 
    p {
        font-size: 1.125rem;
    }
 
 
    .hidden {
        display: none;
    }
 
 
    button:hover {
        color: #48bb78;
    }
 </style>
 
 
 
 
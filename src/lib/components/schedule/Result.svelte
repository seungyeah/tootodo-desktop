<script lang="ts">
	import TenMResult from "$components/tenMTable/tenMResult.svelte";
	import { currentTime, formatTime } from "$store";

	
	import { Circle, Star } from "lucide-svelte";
   let Stars = new Array(5).fill(0);

   export let tasks;
	const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
</script>

<div class="flex w-full h-full space-x-1.5">
   {#each weeks as _, i}
      <div
         class="relative flex flex-col w-full h-full border-b border-l-2 border-double rounded-b-lg shadow border-zinc-900 "
      >
      <div class="absolute w-2 h-2 rounded-full -left-1 -top-1.5 bg-zinc-700">
         <Circle fill="white" size={5} class="absolute right-0" />
      </div>
         <div
            class="flex flex-col justify-between w-full h-1/3"
         >
         <!-- star feedback -->
            <div
               class="flex w-auto justify-center xl:space-x-1"
            >
               {#each Stars as star, i}
                  <button
                     on:click={() => {
                        Stars = Stars.map((_, j) => j <= i);
                     }}
                  >
                     <Star
                        size={13}
                        fill={star ? "#fde047" : "white"}
                     />
                  </button>
               {/each}
            </div>
            <!-- completed items -->
             <div class="flex flex-col w-[calc(100%-0.5rem)] h-full mx-auto my-1 border-zinc-300 border-dashed border rounded-md">
               {#each Array(5) as _, j}
               <div class="flex items-center px-1 space-x-2 border-b">
                  <div class="w-1 h-3.5 bg-pomodoro-100"></div>
                  <div>title</div>
               </div>
               {/each}

            </div>
            <!-- total time -->
            <div
               class="bg-zinc-50 font-digital text-zinc-800 title h-[20px] text-center font-bold"
            >
               05H 30M
            </div>
         </div>
         <!-- tenM planner -->
         <div
            class="relative w-full overflow-y-auto rounded-lg shadow h-2/3 overflow-x-clip no-scrollbar"
         >
            {#if i == $currentTime?.getDay() - 1}
               <div
                  class="absolute z-10 flex flex-col justify-between h-[calc(100%-22px)] translate-y-5"
               >
                  {#each Array.from({ length: 24 }, (_, i) => i) as hour}
                     <div
                        class="px-1 py-0 text-center font-semibold text-[0.6rem] leading-3 text-zinc-700"
                     >
                        {hour}
                     </div>
                  {/each}
               </div>
            {/if}

            <div class="absolute top-0 left-0 w-full h-full">
               <TenMResult />
            </div>
         </div>
      </div>
   {/each}
</div>
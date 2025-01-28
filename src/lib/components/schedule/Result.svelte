<script lang="ts">
   import TenMResult from "$components/tenMTable/tenMResult.svelte";
   import { currentTime, formatTime } from "$store";
   import { Button } from "$ui";
   import Progress from "$ui/progress/progress.svelte";

   import { Circle, Maximize2, Star } from "lucide-svelte";
   let Stars = new Array(5).fill(0);

   let { taskTree = [] } = $props();
   let record = {
      studytime: "05H 30M",
      totalTime: "10H 00M",
   };
   const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
</script>

<div class="flex w-full h-full space-x-1.5 ">
   {#each weeks as _, i}
      <div
         class="relative flex flex-col w-full h-full !ml-0 border border-dotted border-y-0 rounded-b-lg border-zinc-500"
      >
         <div
            class="absolute w-2 h-2 rounded-full -left-1 -top-1.5 bg-zinc-700"
         >
            <Circle fill="white" size={5} class="absolute right-0" />
         </div>
         <div class="flex space-x-1 w-full p-1 mb-2">
            <div
               class="barcontainer relative bg-zinc-700 w-2 h-full rounded-lg"
            >
               <div
                  class="bar bg-pomodoro-700/90 absolute bottom-0 rounded-b-lg"
                  style="height:60%"
               ></div>
            </div>
            <!-- study time -->
            <button
               class=" flex flex-col space-y-1 px-1 justify-center items-center w-full h-full mx-auto my-1 border-zinc-300 border-dashed border rounded-md"
            >
               {#each [record.studytime, record.totalTime] as time, i}
                  <Button
                     variant="outline"
                     class="relative flex items-center text-center border w-full px-0.5 xl:px-1 "
                  >
                     <div
                        class="absolute w-full -top-1.5 text-pomodoro-800 font-serif font-bold text-xs"
                     >
                        {#if i === 0}
                           Study
                        {:else}
                           Total
                        {/if}
                     </div>
                     <div
                        class="font-digital text-zinc-800 title h-[20px]  translate-y-0.5"
                     >
                        {time}
                     </div>
                  </Button>
               {/each}
            </button>
         </div>
         <!-- tenM planner -->

         <div
            class="relative w-full overflow-y-auto rounded-lg shadow h-full overflow-x-clip no-scrollbar"
         >
            {#if i == $currentTime?.getDay() - 1}
               <div
                  class="absolute z-10 flex flex-col justify-between h-[calc(100%-26px)] translate-y-5"
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

            <div class="absolute pb-1 pl-0.5 pr-[3px] left-0 w-full h-full">
               <TenMResult />
            </div>
         </div>
      </div>
   {/each}
</div>

<style>
   .barcontainer {
      transform: translateY(-50%);
      top: 50%;
      float: left;
   }

   .bar {
      width: 100%;
      height: 80%;
      border-top: 4px solid #fff;
      box-sizing: border-box;
      animation: grow 1.5s ease-out forwards;
      transform-origin: bottom;
   }
   @keyframes grow {
      from {
         transform: scaleY(0);
      }
   }
</style>

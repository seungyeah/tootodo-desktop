<script lang="ts">
   import { Button, DropdownMenu, Popover, RangeCalendar } from "$ui";
   import Input from "$ui/input/input.svelte";
   import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
   import {
      Book,
      BookPlus,
      Circle,
      MessageCircle,
      Pencil,
      Workflow,
   } from "lucide-svelte";
   import { Pin, EllipsisVertical, Trash2 } from "lucide-svelte";

   // let {
   //    record = $bindable({
   //       pin: true,
   //       item: "note",
   //       title: "urgent note",
   //       days: [
   //          { day: "mon", time: "" },
   //          { day: "wed", time: "" },
   //       ],
   //       openChat: false,

   //       category: { title: "Project K", color: "#e46b75" },
   //    }),
   // } = $props();

   let {
      task = $bindable({
         title: "",
         plans: [{ start_date: "2025-03-03", end_date: "2025-03-09" }],
         critical_path: { name: "", color: "rgb(106 21 28 / 0.1)" },
         related_notes: [],
         subtasks: [],
         status: 0,
         //weekly
         pined: false,
      }),
   } = $props();

   $inspect(task);

   let cellDuration = $state({
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()).add({ days: 0 }),
   });

   function handleUpdateDuration(task, duration) {
      const updateData = {
         startDate: duration.start.toString(),
         endDate: duration.end.toString(),
      };
   }
</script>

<DropdownMenu.Root>
   <!-- item info -->
   <DropdownMenu.Trigger>
      <div class="flex space-y-0.5 h-full w-full justify-between">
         <div
            class="w-3 h-[calc(100%-3px)] rounded-l border-r bg-pomodoro-900/10"
            style="background-color: {task.critical_path?.color};"
         ></div>

         <!-- item title -->
         <div
            class="flex h-9 w-full items-center justify-center px-2 py-1 -translate-y-[0.15rem]"
         >
            <div
               class="w-full text-start text-sm font-sans line-clamp-2 leading-4"
            >
               {task?.title}
            </div>
         </div>

         <!-- item pin -->
         {#if task.pined}
            <Button
               variant="ghost"
               class="absolute h-6  px-1 -top-2 -right-3 -rotate-12 "
               onclick={() => (task.pined = false)}
            >
               <Pin size={16} fill="#e4e4e7" color="#52525b" />
            </Button>
         {/if}
      </div>
   </DropdownMenu.Trigger>
   <!-- setting item -->
   <DropdownMenu.Content>
      <DropdownMenu.Group class="space-y-2">
         <!-- update trigger -->
         <div class="my-2 flex items-center justify-between">
            <div
               class="h-8 w-8 aspect-square mx-2 rounded-lg bg-pomodoro-900/10 text-neutral-50 shadow-sm border-2 border-white"
               style="background-color: {task.critical_path?.color};"
            ></div>

            <Input bind:value={task.title} class="!py-0 h-8" />

            <DropdownMenu.Item onclick={() => (task.pin = true)}
               ><Pin size={16} class="mx-1" /></DropdownMenu.Item
            >
         </div>

         <DropdownMenu.Separator />
         <!-- goto -->
         <div class="flex justify-end h-10">
            {#if task.note}
               <DropdownMenu.Item onclick={() => (task.pin = true)}
                  ><Book
                     size={24}
                     fill="#f4f4f5"
                     class="text-neutral-400"
                  /></DropdownMenu.Item
               >
            {:else}
               <DropdownMenu.Item onclick={() => (task.pin = true)}
                  ><BookPlus
                     size={24}
                     fill="#f4f4f5"
                     class="text-neutral-400"
                  /></DropdownMenu.Item
               >
            {/if}
            <DropdownMenu.Item onclick={() => (task.pin = true)}>
               <Workflow size={24} fill="#f4f4f5" class="text-neutral-400" />
            </DropdownMenu.Item>

            <DropdownMenu.Item onclick={() => (task.pin = true)}>
               <MessageCircle
                  size={24}
                  fill="#f4f4f5"
                  class="text-neutral-400"
               />
            </DropdownMenu.Item>
         </div>

         <!-- status -->
         <DropdownMenu.Item>
            Status
            <div class="flex items-center w-full h-10 px-2">
               <input
                  class="w-full shadow opacity-70 h-10"
                  class:complete={task.progress_rate === 100}
                  class:inProgress={task.progress_rate > 25 &&
                     task.progress_rate < 100}
                  type="range"
                  step="25"
                  min="0"
                  max="100"
                  value={task.progress_rate || 0}
                  list="markers"
                  onchange={(e) =>
                     //handleUpdateProgressRate(task, e.target.value)
                     console.log(e.target.value)}
               />
               <datalist id="markers" class="-translate-y-[21px] opacity-50">
                  <option value="0" class="!opacity-0"></option>
                  <option value="25"></option>
                  <option value="50"></option>
                  <option value="75"></option>
                  <option value="100" class="!opacity-0"></option>
               </datalist>
            </div>
         </DropdownMenu.Item>

         <!-- plans -->
         <DropdownMenu.Item>
            Plan
            {#each task.plans as plan}
               <Popover.Root
                  onOpenChange={(open) => {
                     if (!open) {
                        plan.startDate = cellDuration.start.toString();
                        plan.endDate = cellDuration.end.toString();
                        handleUpdateDuration(task, cellDuration);
                     } else {
                        cellDuration.start = parseDate(plan.startDate);
                        cellDuration.end = parseDate(plan.endDate);
                     }
                  }}
               >
                  <Popover.Trigger
                     ><td class="inline-block h-[30px] w-[120px] border-b">
                        <div
                           class="inline-flex space-x-1 h-[20px] translate-y-1"
                        >
                           {#if plan.startDate && plan.endDate}
                              <div class="">
                                 {plan.startDate.slice(5, 10)}
                              </div>
                              <div class="font-extrabold text-neutral-400">
                                 ~
                              </div>
                              <div>
                                 {plan.endDate.slice(5, 10)}
                              </div>
                           {:else}
                              00-00 <span
                                 class="font-extrabold text-neutral-400">~</span
                              > 00-00
                           {/if}
                        </div>
                     </td></Popover.Trigger
                  >
                  <Popover.Content class="w-[300px]">
                     <!-- select range -->
                     <RangeCalendar
                        bind:value={cellDuration}
                        weekStartsOn={1}
                        class="w-full bg-white border rounded-lg shadow "
                     />
                     move to next week
                     <RangeCalendar
                        bind:value={cellDuration}
                        weekStartsOn={1}
                        class="w-full bg-white border rounded-lg shadow "
                     />
                  </Popover.Content>
               </Popover.Root>
            {/each}
         </DropdownMenu.Item>

         <!-- delete -->
         <Trash2 size={20} class="mr-2 absolute left-4 bottom-3" />

         <div
            class="relative flex w-[calc(100%-48px)] justify-between items-center translate-x-[48px]"
         >
            <DropdownMenu.Item class="w-1/2">list</DropdownMenu.Item>
            <DropdownMenu.Item class="w-1/2">self</DropdownMenu.Item>
         </div>
      </DropdownMenu.Group>
   </DropdownMenu.Content>
</DropdownMenu.Root>

<style>
   datalist {
      position: relative;
      display: flex;
      justify-content: space-between;
      display: flex;
      justify-content: space-between;
      z-index: -1;
   }

   datalist option {
      display: flex;
      justify-content: center;
      background: #56121800;
      z-index: -1;
   }
   /* https://blog.logrocket.com/creating-custom-css-range-slider-javascript-upgrades/ */
   input[type="range"] {
      /* removing default appearance */
      appearance: none;
      /* creating a custom design */
      width: 100%;
      height: 57%;
      cursor: pointer;
      outline: none;
      /*  slider progress trick  */
      overflow: hidden;
      border-radius: 16px;
   }

   /* Track: webkit browsers */
   input[type="range"]::-webkit-slider-runnable-track {
      height: 15px;
      background: linear-gradient(
         to right,
         #e46b756d 0%,
         #f6ecec 50%,
         #7eaf807c 100%
      );
      border-radius: 16px;
   }

   /* Track: Mozilla Firefox */
   input[type="range"]::-moz-range-track {
      height: 15px;
      background: linear-gradient(
         to right,
         #e46b758d 0%,
         #f8ecec 50%,
         #7eaf807c 100%
      );
      border-radius: 16px;
   }

   /* Thumb: webkit */
   input[type="range"]::-webkit-slider-thumb {
      /* removing default appearance */
      -webkit-appearance: none;
      appearance: none;
      /* creating a custom design */
      height: 15px;
      width: 15px;
      border-radius: 50%;
      border: 2px solid #b91c1cb4;
      /*  slider progress trick  */
      box-shadow: -407px 0 2px 400px #b91c1cb4;
   }

   input[type="range"].complete::-webkit-slider-thumb {
      /* removing default appearance */
      -webkit-appearance: none;
      appearance: none;
      /* creating a custom design */
      height: 15px;
      width: 15px;
      border-radius: 50%;
      border: 2px solid #7eaf80;
      /*  slider progress trick  */
      box-shadow: -407px 0 2px 400px #7eaf80;
   }

   input[type="range"].inProgress::-webkit-slider-thumb {
      /* removing default appearance */
      -webkit-appearance: none;
      appearance: none;
      /* creating a custom design */
      height: 15px;
      width: 15px;
      border-radius: 50%;
      border: 2px solid #7194b1;
      /*  slider progress trick  */
      box-shadow: -407px 0 2px 400px #7194b1;
   }

   /* Thumb: Firefox */
   input[type="range"]::-moz-range-thumb {
      height: 15px;
      width: 15px;
      background-color: #fff;
      border-radius: 50%;
      border: 1px solid #e46b75;
      /*  slider progress trick  */
      box-shadow: -407px 0 0 400px #e46b75;
   }
</style>

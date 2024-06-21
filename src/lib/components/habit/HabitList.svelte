<script lang="ts">
   import { getContext,  } from "svelte";
   import { Button,  } from "$ui";
   import {
      GripVertical,
   } from "lucide-svelte";
   import IconPicker from "./IconPicker.svelte";
   import icons from "$lib/icons";
   import { type Habit} from "$lib/schema";

   const habits = getContext("habits");
   const statusOption: string = getContext("statusOption");

   // update
   const handleUpdateHabit = getContext('handleUpdateHabit');

   function handleUpdateName(habit: Habit, name: String) {
      const updateData = {
         name: name,
      };
      handleUpdateHabit({ habit, updateData });
   }

   // udate from child
   function handleUpdateIcon(habit, e) {
      let { key, value } = e.detail;
      let updateData = {};
      if (key === "icon") {
         habit.icon = value;
         updateData.icon = value;
      } else if (key === "color") {
         habit.color = value;
         updateData.color = value;
      }
      handleUpdateHabit({ habit, updateData });
      return habit;
   }

   // dnd
   let draggedIndex = null;

   function handleDragStart(e, index) {
      draggedIndex = index;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", index);
   }

   function handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
   }

   function handleDrop(e, index) {
      e.preventDefault();
      const draggedOverIndex = index;

      if (draggedIndex !== draggedOverIndex) {
         const reorderedhabits = [...$habits];
         const [movedItem] = reorderedhabits.splice(draggedIndex, 1);
         reorderedhabits.splice(draggedOverIndex, 0, movedItem);
         $habits = reorderedhabits;
      }

      draggedIndex = null;
   }

   function handleDragEnd() {
      draggedIndex = null;
   }
</script>

{#key $habits}
   <table class="h-full ">
      <thead class="sticky top-0 z-10 h-0 bg-white border-t-2 border-zinc-500">
      </thead>
      <tbody class="h-full text-center">
         {#if $habits.length === 0}
            <td class="h-[300px] w-full" colspan="3">No habits</td>
         {:else}
            {#each $habits as habit, i}
               {#if habit.status === $statusOption}
                  <tr class="text-start" class:dragging={draggedIndex === i}>
                     <!-- index -->
                     <td
                        class="h-[30px] w-5 draggable inline-block border-b"
                        draggable="true"
                        on:dragstart={(e) => handleDragStart(e, i)}
                        on:dragover={handleDragOver}
                        on:drop={(e) => handleDrop(e, i)}
                        on:dragend={handleDragEnd}
                     >
                        <div class="w-full h-full text-center translate-y-1">
                           {#if draggedIndex === i}
                              <GripVertical size={18} />
                           {/if}{i + 1}
                        </div>
                     </td>
                     <!-- name -->
                     <td class="h-[30px] border border-t-0 w-full "
                        ><input
                           value={habit.name}
                           class="h-full px-1.5 w-full bg-transparent"
                           on:blur={(e) =>
                              handleUpdateName(habit, e.target.value)}
                        />
                     </td>
                     <!-- icon -->
                     <td class="h-[30px] border border-t-0 w-full inline-block">
                        <IconPicker
                           on:update={(e) =>
                              (habit = handleUpdateIcon(habit, e))}
                        >
                           <div slot="trigger" class="h-[30px]">
                              <Button
                                 variant="ghost"
                                 class="p-1.5 h-[24px] bg-white"
                              >
                                 <svelte:component
                                    this={icons[habit.icon]}
                                    size={16}
                                    color={habit.color}
                                 />
                              </Button>
                           </div>
                        </IconPicker>
                     </td>
                  </tr>{/if}{/each}{/if}
      </tbody>
   </table>
{/key}

<!-- @migration-task Error while migrating Svelte code: Cannot reassign or bind to each block argument in runes mode. Use the array and index variables instead (e.g. `array[i] = value` instead of `entry = value`, or `bind:value={array[i]}` instead of `bind:value={entry}`)
https://svelte.dev/e/each_item_invalid_assignment -->
<script lang="ts">
   import { getContext } from "svelte";
   import { Button } from "$ui";
   import { GripVertical } from "lucide-svelte";
   import IconPicker from "./IconPicker.svelte";
   import icons from "$lib/icons";
   import { type Habit } from "$lib/schema";

   // habit/+page.svelte에서 정의됨
   const habits = getContext("habits");
   const statusOption: string = getContext("statusOption");

   // update
   const handleUpdateHabit = getContext("handleUpdateHabit");

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
   let draggedIndex = $state(null);

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
   <table class="h-full">
      <thead
         class="sticky top-0 z-10 h-0 bg-white border-t-2 border-neutral-500"
      >
      </thead>
      <tbody class="h-full text-center">
         {#if !$habits || $habits.length === 0}
            <td class="h-[300px] w-full" colspan="3">No habits</td>
         {:else}
            {#each $habits as habit, i}
               {#if habit.status === $statusOption}
                  <tr class="text-start" class:dragging={draggedIndex === i}>
                     <!-- index -->
                     <td
                        class="h-[30px] w-5 draggable inline-block border-b"
                        draggable="true"
                        ondragstart={(e) => handleDragStart(e, i)}
                        ondragover={handleDragOver}
                        ondrop={(e) => handleDrop(e, i)}
                        ondragend={handleDragEnd}
                     >
                        <div class="w-full h-full text-center translate-y-1">
                           {#if draggedIndex === i}
                              <GripVertical size={18} />
                           {/if}{i + 1}
                        </div>
                     </td>
                     <!-- name -->
                     <td class="h-[30px] border border-t-0 w-full"
                        ><input
                           value={habit.name}
                           class="h-full px-1.5 w-full bg-transparent"
                           onblur={(e) =>
                              handleUpdateName(habit, e.target.value)}
                        />
                     </td>
                     <!-- icon -->
                     <td class="h-[30px] border border-t-0 w-full inline-block">
                        <IconPicker
                           on:update={(e) =>
                              ($habits[i] = handleUpdateIcon(habit, e))}
                        >
                           {#snippet trigger()}
                              <div class="h-[30px]">
                                 <Button
                                    variant="ghost"
                                    class="p-1.5 h-[24px] bg-white"
                                 >
                                    {@const Component = icons[habit.icon]}
                                    <Component size={16} color={habit.color} />
                                 </Button>
                              </div>
                           {/snippet}
                        </IconPicker>
                     </td>
                  </tr>{/if}{/each}{/if}
      </tbody>
   </table>
{/key}

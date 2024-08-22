<script lang="ts">
   import { melt, type TreeView } from "@melt-ui/svelte";
   import { getContext } from "svelte";
   import { parseDate } from "@internationalized/date";
   import { getDuration } from "$lib/utils";

   export let treeItems = [];
   export let totalDays: number;
   export let level = 0;

   const {
      elements: { item, group },
      helpers: { isExpanded, },
   } = getContext<TreeView>("tree");

   const selectedDate = getContext("selectedDateRange");

   function calculateDurations(task) {
      const start_date = parseDate(task.start_date);
      const end_date = parseDate(task.end_date);
      return {
         task_start: getDuration($selectedDate.start, start_date),
         task_duration: getDuration(start_date, end_date),
         task_end: getDuration(end_date, $selectedDate.end),
      };
   }

   function isTaskVisible(durations) {
      return (
         durations.task_start + durations.task_duration + durations.task_end > 0
      );
   }

   function getColspans(durations) {
      const { task_start, task_duration, task_end } = durations;
      if (task_start === 0 && task_end === 0) {
         return [{ colspan: task_duration + task_start + 1, isTask: true }];
      } else if (task_start <= 0) {
         return [
            { colspan: task_duration + task_start + 1, isTask: true },
            { colspan: task_end, isTask: false },
         ];
      } else if (task_end <= 0) {
         return [
            { colspan: task_start, isTask: false },
            { colspan: task_duration + task_end + 1, isTask: true },
         ];
      } else {
         return [
            { colspan: task_start, isTask: false },
            { colspan: task_duration + 1, isTask: true },
            { colspan: task_end, isTask: false },
         ];
      }
   }
</script>

{#each treeItems as { task, subtasks }}
   {@const itemId = `${task.id}`}
   {@const hasChildren = !!subtasks?.length}
   {@const durations = calculateDurations(task)}

   {#if isTaskVisible(durations)}
      <tr      
         class="h-[30px] border-b"
         use:melt={$item({
            id: itemId,
            hasChildren,
         })}
      >
         {#each getColspans(durations) as { colspan, isTask }}
            <td {colspan} >
               {#if isTask}
                  <div        
                     class="relative w-full h-full border-t border-b-2 shadow-lg bg-zinc-400 border-zinc-900"
                  >
                     <div
                        class="h-5 p-0 m-0 bg-zinc-400"
                        class:task={!task.milestone}
                        class:complete={task.progress_rate === 100}
                        class:start={task.progress_rate > 0 && task.progress_rate <= 25}
                        class:inProgress={task.progress_rate > 25 &&
                           task.progress_rate < 100}
                     >
                        {#if task.milestone}
                           <div
                              class="absolute top-0.5 w-4 h-4 rotate-45 border border-zinc-900 -z-10 bg-inherit -left-2"
                              class:none={task.progress_rate <= 0}
                           />
                           <div
                              class="absolute top-0.5 w-4 h-4 rotate-45 border-2 border-zinc-900 -z-10 bg-inherit -right-2"
                              class:complete={task.progress_rate === 100}
                           />
                        {/if}
                     </div>
                  </div>
               {/if}
            </td>
         {/each}
      </tr>
   {/if}

   {#if hasChildren}
      <tr use:melt={$group({ id: itemId })}   >
         <td colspan={totalDays} class="p-0"       
         >
            <table class="w-full table-fixed" >
               <svelte:self
                  treeItems={subtasks}
                  {totalDays}
                  level={level + 1}
               />
            </table>
         </td>
      </tr>
   {/if}
{/each}

<style>
   .task{
      @apply border-r-2 border-l border-zinc-900;
   }
   .complete {
      background-color: #7eaf80;
   }
   .inProgress {
      background-color: #80b5df;
   }
   .none {
      background-color: #a1a1aa;
   }
   .start {
      background-color: #e46b75e0;
   }
</style>

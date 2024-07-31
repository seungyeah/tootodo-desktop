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
      let colspans = [];
      if (task_start > 0) colspans.push({ colspan: task_start, isTask: false });
      colspans.push({ colspan: task_duration, isTask: true });
      if (task_end > 0) colspans.push({ colspan: task_end, isTask: false });
      return colspans;
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
            <td
               {colspan}
               class:milestone={isTask && task.milestone}
               class:task={isTask && !task.milestone}
               data-percent={isTask ? task.progress_rate : null}
            >
               {#if isTask}
                  <div class="w-full h-full bg-zinc-200">
                     <div
                        class="h-5 p-0 bg-zinc-600"
                        class:milestone={task.milestone}
                        style="width: {task.progress_rate }%;"
                     ></div>
                  </div>
               {/if}
            </td>
         {/each}
      </tr>
   {/if}

   {#if hasChildren}
      <tr use:melt={$group({ id: itemId })}>
         <td colspan={totalDays} class="p-0">
            <table class="w-full table-fixed">
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
   .task {
      background-color: #3f3f46;
      opacity: 80%;
      color: white;
   }
   .milestone {
      background-color: rgb(217 43 58);
      opacity: 80%;
      color: white;
   }
</style>

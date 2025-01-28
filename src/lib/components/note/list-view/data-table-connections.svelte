<script lang="ts">
   import {
      CalendarCheck,
      CalendarDays,
      CalendarPlus,
   } from "lucide-svelte";
   import {
      Button,
      Progress,
      HoverCard,
      Popover,
      Label,
      Input,
      RadioGroup,
   } from "$ui";
   let { itemInfo } = $props();
   let newConnectionTitle = "";
</script>

{#if itemInfo}
   <HoverCard.Root>
      <HoverCard.Trigger
         class="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
      >
         {#if itemInfo.type === "task"}
            <Button
               variant="ghost"
               class="w-[70px] h-6 px-2 shadow-sm flex items-center justify-start"
               ><CalendarCheck size={15} class="mr-1" />Task</Button
            >
         {:else if itemInfo.type === "habit"}
            <Button
               variant="ghost"
               class="w-[70px] h-6 px-2 shadow-sm flex items-center justify-start"
               ><CalendarDays size={14} class="mr-1" />Habit</Button
            >
         {/if}
      </HoverCard.Trigger>
      <HoverCard.Content class="-translate-x-1 -translate-y-1.5 w-80" side="bottom">
         <div class="flex justify-between w-full space-x-4">
            <div class="w-full space-y-1">
               <h4 class="text-sm font-semibold">{itemInfo.title}</h4>
               <div class="flex items-center justify-between pb-1">
                  <span class="text-xs text-muted-foreground">
                     {itemInfo.start_date}
                  </span>
                  ~
                  <span class="text-xs text-muted-foreground">
                     {itemInfo.end_date}
                  </span>
               </div>
               <Progress value={itemInfo.progress} max={100} />
            </div>
         </div>
      </HoverCard.Content>
   </HoverCard.Root>
{:else}
   <Popover.Root portal={null}>
      <Popover.Trigger asChild >
         {#snippet children({ builder })}
                  <Button
               builders={[builder]}
               variant="ghost"
               class="w-[70px] h-6 px-2 shadow-sm"
               ><CalendarPlus size={14} class="mr-1" /></Button
            >
                        {/snippet}
            </Popover.Trigger>
      <Popover.Content class="-translate-x-1 w-80" side="left">
         <div class="grid gap-4">
            <h4 class="text-sm font-semibold">Add New Connection</h4>
            <div class="flex flex-col space-y-3">
               <div class="grid items-center grid-cols-3 gap-4">
                  <Label class="font-bold">Type</Label>
                  <RadioGroup.Root value="task" class="flex">
                     <div class="flex items-center space-x-2">
                        <RadioGroup.Item value="task"  />
                        <Label for="task">Task</Label>
                     </div>
                     <div class="flex items-center space-x-2">
                        <RadioGroup.Item value="habit"  />
                        <Label for="habit">Habit</Label>
                     </div>
                  </RadioGroup.Root>
               </div>
               <Input value={newConnectionTitle} placeholder="new connection title" class="w-full h-8 " />

            </div>
         </div>
      </Popover.Content>
   </Popover.Root>
{/if}

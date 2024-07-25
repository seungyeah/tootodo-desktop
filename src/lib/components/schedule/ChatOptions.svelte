<script lang="ts">
   import { DropdownMenu,Button } from "$ui";
   export let tasks = [];
   $:selectedTask = {
      title: "",
      id: "",
   };
</script>
<div class="flex h-full p-1 ">

<DropdownMenu.Root >
   <DropdownMenu.Trigger asChild let:builder>
      <Button builders={[builder]} variant="outline" class="h-full px-3 text-xs shadow-sm">{selectedTask.title || "Select Task"}</Button>
   </DropdownMenu.Trigger>
   <DropdownMenu.Content>
      <DropdownMenu.Group>
         <DropdownMenu.Label>Today's Todo List</DropdownMenu.Label>
         <DropdownMenu.Separator />
         {#each tasks as task}
         <DropdownMenu.Item on:click={()=>selectedTask = task}>{task.title}</DropdownMenu.Item>
         {/each}
      </DropdownMenu.Group>
   </DropdownMenu.Content>
</DropdownMenu.Root>
   
</div>

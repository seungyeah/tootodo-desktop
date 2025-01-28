<script lang="ts">
   import { Button, DropdownMenu } from "$ui";
   import {
      Book,
      BookPlus,
      Circle,
      MessageCircle,
      Pencil,
   } from "lucide-svelte";
   import { Pin, EllipsisVertical, Trash2 } from "lucide-svelte";
   let { record = $bindable({
      pin: true,
      alarm: true,
      item: "note",
      title: "urgent note",
      days: [
         { day: "mon", time: "" },
         { day: "wed", time: "" },
      ],
      openChat: false,

      category: { title: "Project K", color: "#e46b75" },
   }) } = $props();
</script>

<!-- setting item -->
<DropdownMenu.Root>
   <DropdownMenu.Trigger>
      <div class="flex flex-col space-y-0.5 h-full justify-between">
         {#each Array(3) as _}
            <Circle
               strokeWidth={6}
               class="text-zinc-500 w-5 h-[4px] -translate-x-3.5"
            />
         {/each}
      </div>
   </DropdownMenu.Trigger>
   <DropdownMenu.Content>
      <DropdownMenu.Group>
         <DropdownMenu.Separator />
         <DropdownMenu.Item on:click={() => (record.pin = true)}
            ><Pin size={16} class="mr-2" />Pin</DropdownMenu.Item
         >
         {#if record.note}
            <DropdownMenu.Item on:click={() => (record.pin = true)}
               ><Book size={16} class="mr-2" />Open Note</DropdownMenu.Item
            >
         {:else}
            <DropdownMenu.Item on:click={() => (record.pin = true)}
               ><BookPlus size={16} class="mr-2" />Add Note</DropdownMenu.Item
            >
         {/if}
         <DropdownMenu.Item
            ><Pencil size={16} class="mr-2" />Edit</DropdownMenu.Item
         >
         <DropdownMenu.Item
            ><MessageCircle size={16} class="mr-2" />Chat</DropdownMenu.Item
         >

         <DropdownMenu.Item
            ><Trash2 size={16} class="mr-2" />Delete</DropdownMenu.Item
         >
      </DropdownMenu.Group>
   </DropdownMenu.Content>
</DropdownMenu.Root>

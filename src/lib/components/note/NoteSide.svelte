<script lang="ts">
   import { getContext, tick } from "svelte";
   import { createEventDispatcher } from "svelte";
   import {
      Button,
      DropdownMenu,
      Input,
      Label,
      Popover,
      ScrollArea,
      Separator,
   } from "$ui";
   import {
      CirclePlus,
      Hexagon,
      Ungroup,
      Group,
      Tag,
      Tags,
      ArrowBigDownDash,
      Plus,
      Minus,
      RotateCcw,
      Circle,
   } from "lucide-svelte";
   import Tab from "./NoteTab.svelte";
   import TagGroup from "./ListTagGroup.svelte";
   import ManageTags from "./ManageTags.svelte";
   import SearchTag from "./SearchTag.svelte";

   const dispatch = createEventDispatcher();
   // new habit
   function resetNewHabit() {
      newHabit = {
         name: "",
         icon: "Hexagon",
         color: "#09090b",
      };
   }

   $: newHabit = {
      name: "",
      icon: "Hexagon",
      color: "#09090b",
   };

   async function handleSubmit(
      event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
   ) {
      event.preventDefault();
      if (newHabit.name.trim() === "") {
         return;
      }

      await tick();

      handleCreate({
         name: newHabit.name,
         icon: newHabit.icon,
         color: newHabit.color,
      });
      resetNewHabit();
   }

   // crud
   function handleCreate(habit) {
      dispatch("create", { habit });
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
      return habit;
   }

   let isAddTagGroupMode = false;
   let searchTags = [{}];

   import { tailwindColors } from "$lib/tailwindColors";
   let new_color_name = "violet";
   let new_color_hex = "#c4b5fd";
</script>

<div class="flex flex-col w-full h-full space-y-2">
   <!-- add habit -->
   <form
      on:submit|preventDefault={handleSubmit}
      class="relative flex items-center w-full h-9"
   >
      <div>
         <Button
            variant="ghost"
            size="sm"
            class="h-8 px-1 rounded shadow bg-zinc-100 translate-y-0.5"
            on:click={() => (isAddTagGroupMode = !isAddTagGroupMode)}
         >
            {#if isAddTagGroupMode}
               <Tags size={20} strokeWidth={2} />
            {:else}
               <Tag size={20} strokeWidth={2} />
            {/if}
         </Button>
      </div>

      {#if isAddTagGroupMode}
         <Popover.Root>
            <Popover.Trigger asChild let:builder>
               <Button
                  builders={[builder]}
                  variant="ghost"
                  size="sm"
                  class="h-7 p-1 w-7 ml-2 rounded-full shadow bg-zinc-100 translate-y-0.5"
                  ><Circle fill={new_color_hex} color={new_color_hex} class="p-0 w-6 h-6" />
               </Button></Popover.Trigger
            >
            <Popover.Content class="bg-white w-[360px]" side="right">
               <Label class="font-bold text-lg">Tag Group's Color</Label>
               <Separator />
               <div class="grid grid-cols-13 data-[highlighted]:bg-zinc-50">
                  {#each tailwindColors as color}
                     <div class="col-span-2 mr-2 text-xs font-digital">
                        {color.name}
                     </div>

                     {#each color.shades as shade}
                        <Button
                           class="w-5 h-5 p-2 m-2"
                           style={`background-color: ${shade.hex};`}
                           on:click={() => {
                              new_color_hex = shade.hex;
                              new_color_name = color.name.toLowerCase();
                           }}
                        />
                     {/each}
                  {/each}
               </div>
            </Popover.Content>
         </Popover.Root>
      {/if}
      <Input
         type="text"
         placeholder={"name : put more than 1 char"}
         bind:value={newHabit.name}
         on:keydown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
               e.preventDefault();
               handleSubmit(e);
            }
         }}
         class="my-2 ml-2 h-9 w-full scale-y-95 rounded-r-full p-2 pr-9 text-[0.9rem] font-normal focus:shadow"
      />
      <Button
         variant="ghost"
         type="submit"
         class="absolute z-10 p-0 rounded-full botom-0 right-1 hover:bg-zinc-100"
         ><CirclePlus color="#a1a1aa" /></Button
      >
   </form>

   <Tab defaultValue="list">
      <div slot="tags">
         <div class="tab-title">Manage Tags</div>
         <ManageTags></ManageTags>
      </div>

      <div slot="list">
         <div class="relative tab-title">
            Filter List by Tags
            <Button
               variant="ghost"
               class="bg-pomodoro-800/70  h-6 px-1.5 shadow hover:bg-pomodoro-900 absolute right-2"
               ><RotateCcw size={16} color="white" /></Button
            >
         </div>
         <TagGroup></TagGroup>
      </div>

      <div slot="kanban" class="flex flex-col w-full">
         <div class="tab-title">Select Tag Groups - Kanban</div>

         <Button
            class="h-20 p-2 m-2 bg-white border border-b-4 border-dashed rounded-lg shadow border-zinc-500 hover:bg-zinc-100"
         >
            x: select group
         </Button>

         <Button
            class="h-20 p-2 m-2 bg-white border border-l-4 border-dashed rounded-lg shadow border-zinc-500 hover:bg-zinc-100"
         >
            y: select group
         </Button>

         <ArrowBigDownDash class="w-full" />
         <Button variant="default" class="m-2 font-bold shadow bg-zinc-200 ">
            Group!</Button
         >
      </div>

      <div slot="graph" class="flex flex-col h-full">
         <div class="tab-title">Select Tag Groups - Classify</div>
         <ScrollArea class="max-h-[calc(100%-150px)] h-auto min-h-40 ">
            {#each searchTags as _, i (i)}
               <div
                  class="flex mx-2 mt-2 bg-white border border-dashed rounded-lg shadow-sm border-zinc-500"
               >
                  <SearchTag></SearchTag>
                  <Button
                     class="w-8 p-0"
                     disabled={searchTags.length <= 1}
                     on:click={() => (searchTags = searchTags.slice(0, -1))}
                     ><Minus size={15} /></Button
                  >
               </div>
            {/each}
         </ScrollArea>

         <Button
            variant="ghost"
            class="self-center w-full h-8 p-0 mt-2 font-bold border-t-2 border-double rounded-t-none shadow border-zinc-500"
            on:click={() => (searchTags = [...searchTags, {}])}
         >
            <Plus size={20} /></Button
         >

         <Button variant="default" class="m-2 font-bold shadow bg-zinc-200 ">
            Classify!</Button
         >
      </div>
   </Tab>
</div>

<style>
   .tab-title {
      @apply text-center w-full text-[1rem] pt-2 pb-1 font-semibold text-zinc-700;
   }
</style>

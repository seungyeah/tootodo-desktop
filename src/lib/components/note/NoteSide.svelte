<script lang="ts">
   import { getContext, setContext, tick } from "svelte";
   import { createEventDispatcher } from "svelte";
   import {
      Button,
      Input,
      Label,
      Popover,
      ScrollArea,
      Separator,
      Command,
      Badge,
   } from "$ui";
   import {
      CirclePlus,
      Tag,
      Tags,
      ArrowBigDownDash,
      Plus,
      Minus,
      RotateCcw,
      Check,
      Circle,
      ChevronsUpDown,
      ChevronsRight,
   } from "lucide-svelte";
   import Tab from "./NoteTab.svelte";
   import TagGroup from "./list-view/SideOfListView.svelte";
   import ManageTags from "./ManageTags.svelte";
   import SearchTag from "./SearchTag.svelte";
   import { cn } from "$lib/utils";
   import SelectGroupColor from "./SelectGroupColor.svelte";
   import SelectGroup from "./SelectGroup.svelte";
   import { Select } from "bits-ui";
   import SideOfKanbanView from "./kanban-view/SideOfKanbanView.svelte";

   const dispatch = createEventDispatcher();

   let tagGroups = [
      {
         id: "0",
         name: "undefined",
         tags: ["대회"],
         color: "#f4f4f5",
      },
      {
         id: "5",
         name: "요즘 관심사",
         tags: ["tootodo 개발", "rust", "mongodb"],
         color: "#ddd6fe",
      },
      {
         id: "3",
         name: "grammer",
         tags: ["error 처리", "소유권", "타입", "메모리", "테스트"],
         color: "#fed7aa",
      },
      {
         id: "3",
         name: "language",
         tags: ["rust", "javascript", "python", "c++", "c"],
         color: "#fef3c7",
      },
      {
         id: "2",
         name: "ai",
         tags: ["qdrant", "cohere", "langchain"],
         color: "#ecfccb",
      },
      {
         id: "4",
         name: "database",
         tags: ["qdrant", "postgres", "mongodb"],
         color: "#d1fae5",
      },
      {
         id: "1",
         name: "english",
         tags: ["speaking", "writing", "reading", "listening", "word"],
         color: "#f3e8ff",
      },
   ];
   let tags = [
      {
         id: "0",
         name: "rust",
         groups: ["3"],
      },
      {
         id: "1",
         name: "speaking",
         groups: ["1"],
      },
      {
         id: "2",
         name: "writing",
         groups: ["1"],
      },
      {
         id: "3",
         name: "listening",
         groups: ["1"],
      },
      {
         id: "4",
         name: "reading",
         groups: ["1"],
      },
      {
         id: "5",
         name: "word",
         groups: ["1"],
      },
      {
         id: "6",
         name: "qdrant",
         groups: ["2", "4"],
      },
      {
         id: "7",
         name: "cohere",
         groups: ["2"],
      },
      {
         id: "8",
         name: "langchain",
         groups: ["2"],
      },
      {
         id: "9",
         name: "javascript",
         groups: ["3"],
      },
      {
         id: "10",
         name: "python",
         groups: ["3"],
      },
   ];
   setContext("tagGroups", tagGroups);

   let isAddTagGroupMode = true;
   let searchTags = [{}];

   // new tag group
   $: newTagGroup = {
      name: "",
      tags: [],
      color: "#f4f4f5",
   };

   async function handleSubmit(
      event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
   ) {
      event.preventDefault();

      if (newTagGroup.name.trim() === "" || newTagGroup.name === "undefined") {
         return;
      }

      if (isAddTagGroupMode) {
         const alreadyExists = tagGroups.some(
            (tagGroup) => tagGroup.name === newTagGroup.name,
         );
         if (alreadyExists) {
            alert("이미 존재하는 태그 그룹입니다.");
            return;
         }
         handleCreate({
            name: newTagGroup.name,
            tags: [],
            color: newTagGroup.color,
         });
      } else {
         const alreadyExists = tagGroups.some(
            (tagGroup) => tagGroup.name === newTagGroup.name,
         );
         if (alreadyExists) {
            alert("이미 존재하는 태그 그룹입니다.");
            return;
         }
         handleUpdate({
            name: "undefined",
            newTag: newTagGroup.name,
         });
      }
      resetNewHabit();
   }

   function resetNewHabit() {
      newTagGroup = {
         name: "",
         tags: [],
         color: "#f4f4f5",
      };
   }

   // crud
   function handleCreate(tagGroup) {
      dispatch("create", { tag: tagGroup });
   }

   function handleUpdate(tag) {
      dispatch("update", { tag });
   }

   // select tag group when add tag
   let value = "undefined";
</script>

<div class="flex flex-col w-full h-full space-y-2">
   <!-- add tag -->
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
               <Tags size={22} strokeWidth={1.8} />
            {:else}
               <Tag size={20} strokeWidth={2} />
            {/if}
         </Button>
      </div>

      {#if isAddTagGroupMode}
         <SelectGroupColor
            bind:tagGroup={newTagGroup}
            class="absolute shadow h-6 w-6 left-8 rounded-full ml-2 border-zinc-300 border-2 border-dashed text-zinc-100 hover:text-zinc-100"
         >
            <div slot="info">Select Color</div>
         </SelectGroupColor>
      {:else}
         <SelectGroup
            bind:value
            {tagGroups}
            class="w-[100px] min-w-[100px] max-w-[100px] h-8 ml-1 px-2 text-xs  translate-y-0.5"
         >
            <div slot="info">
               <div
                  class="absolute -top-3.5 font-bold text-xs left-10 text-zinc-500"
               >
                  Select Group
               </div>
            </div>
         </SelectGroup>
      {/if}

      <Input
         type="text"
         placeholder={isAddTagGroupMode ? "add new tag Group" : "add new tag"}
         bind:value={newTagGroup.name}
         on:keydown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
               e.preventDefault();
               handleSubmit(e);
            }
         }}
         class={cn(
            "my-2 ml-1 h-9 w-full scale-y-95 rounded-r-full p-2 pr-9 text-[0.9rem] font-normal focus:shadow",
            isAddTagGroupMode && "pl-9 rounded-l-full ml-1",
         )}
      />
      <Button
         variant="ghost"
         type="submit"
         class="absolute z-10 p-0 rounded-full botom-0 right-1 hover:bg-zinc-100"
         ><CirclePlus color="#a1a1aa" /></Button
      >
   </form>

   <Tab defaultValue="tags">
      <div slot="tags" class="h-full">
         <div class="tab-title">Manage Tags</div>
         <ScrollArea class="max-h-[calc(100%-70px)] h-[calc(100%-70px)]  ">
            {#each tagGroups as tagGroup}
               <ManageTags {tagGroup}></ManageTags>
            {/each}
         </ScrollArea>
      </div>

      <div slot="list" class="h-full">
         <div class="tab-title">
            Filter Notes by Tags
            <Button
               variant="ghost"
               class="bg-pomodoro-800/70  h-6 px-1.5 shadow hover:bg-pomodoro-900 absolute right-2"
               ><ChevronsRight size={16} color="white" /></Button
            >
         </div>

         <ScrollArea class="max-h-[calc(100%-55px)] h-[calc(100%-55px)]  ">
            {#each tagGroups as tagGroup}
               <TagGroup {tagGroup}></TagGroup>
            {/each}
         </ScrollArea>
      </div>

      <div slot="kanban" class="flex flex-col w-full">
         <div class="tab-title">
            Build Kanban Board
            <Button
               variant="ghost"
               class="bg-pomodoro-800/70  h-6 px-1.5 shadow hover:bg-pomodoro-900 absolute right-2"
               ><ChevronsRight size={16} color="white" /></Button
            >
         </div>

         <SideOfKanbanView {tagGroups} />
      </div>

      <div slot="graph" class="flex flex-col h-full">
         <div class="tab-title">
            Build Classify Map
            <Button
               variant="ghost"
               class="bg-pomodoro-800/70  h-6 px-1.5 shadow hover:bg-pomodoro-900 absolute right-2"
               ><ChevronsRight size={16} color="white" /></Button
            >
         </div>
         <!-- add tag group -->
         <Button
            variant="ghost"
            class="self-center w-full h-8 p-0 mt-2 font-bold border-t-2 border-double rounded-t-none shadow border-zinc-500"
            on:click={() => (searchTags = [{}, ...searchTags])}
         >
            <Plus size={20} /></Button
         >

         <ScrollArea class="max-h-[calc(100%-110px)] h-auto min-h-64 ">
            {#each searchTags as _, i (i)}
               {@const tagGroup = tagGroups.filter(
                  (tag) => tag.name === searchTags[i],
               )[0] || {}}
               <div
                  class="flex flex-col space-y-1 mx-2 mt-2.5 p-2 bg-white border border-dashed rounded-lg shadow-sm border-zinc-500"
               >
                  <div class="flex w-full">
                     <SelectGroup bind:value={searchTags[i]} {tagGroups} />
                     <Button
                        class="w-8 p-0"
                        disabled={searchTags.length <= 1}
                        on:click={() => (searchTags = searchTags.slice(0, -1))}
                        ><Minus size={15} /></Button
                     >
                  </div>
                  <div class="flex flex-wrap">
                     {#each tagGroup?.tags || [] as tag}
                     <Badge
                        class="m-0.5 w-auto text-nowrap h-5 font-medium rounded-md data-[selected]:bg-zinc-400 "
                        style={`background-color: ${tagGroup.color};`}
                     >
                        {tag}
                     </Badge>
                  {/each}
                  </div>
                  
               </div>
            {/each}
            <div
               class="w-full mt-2 rounded-b-md z-50 bg-white absolute -bottom-4 h-5 shadow rotate-180"
            />
         </ScrollArea>
      </div>
   </Tab>
</div>

<style>
   .tab-title {
      @apply relative  text-center w-full text-[1rem] pt-2 pb-1 font-semibold text-zinc-700;
   }
</style>

<script lang="ts">
   import EditorContentsTable from "./EditorContentsTable.svelte";
   import {
      Badge,
      ScrollArea,
      Tabs,
      Resizable,
   } from "$ui";
   import Input from "$ui/input/input.svelte";
   import Editor from "$components/note/editor/Editor.svelte";
   import {
      Text,
      Brush,
      Mic,
      BotMessageSquare,
      Paperclip,
   } from "lucide-svelte";
   export let note;
</script>

<Resizable.PaneGroup direction="horizontal" class="gap-2">
   <Resizable.Pane defaultSize={26} minSize={0}>
      <div
         class=" h-full space-y-1 bg-zinc-50 flex flex-col justify-between p-1"
      >
         <div class="flex flex-col bg-white rounded-lg h-15">
            <Tabs.Root value="editor" class="w-full h-8 p-1 pt-[5px] ">
               <Tabs.List class="flex space-x-2 p-0 h-7 rounded-b-none">
                  <Tabs.Trigger value="drawings" class="p-1"
                     ><Brush size={15} /></Tabs.Trigger
                  >
                  <Tabs.Trigger value="recordings" class="p-1"
                     ><Mic size={15} /></Tabs.Trigger
                  >
                  <Tabs.Trigger value="editor" class="p-1"
                     ><Text size={15} /></Tabs.Trigger
                  >
                  <Tabs.Trigger value="chatbot" class="p-1"
                     ><BotMessageSquare size={15} /></Tabs.Trigger
                  >
                  <Tabs.Trigger value="file" class="p-1"
                     ><Paperclip size={15} /></Tabs.Trigger
                  >
               </Tabs.List>
            </Tabs.Root>

            <Input
               class="border-zinc-100 font-editor focus-visible:shadow "
               placeholder="page title.."
            />
         </div>

         <div class="h-full">
            <EditorContentsTable pages={note.pages}></EditorContentsTable>
         </div>
      </div>
   </Resizable.Pane>
   <Resizable.Handle
      withHandle={true}
      direction="horizontal"
      class="border border-dotted border-zinc-500"
   />
   <Resizable.Pane defaultSize={74} minSize={30}>
      <ScrollArea class="w-full h-[calc(100vh-120px)] font-mono ">
         <!-- pages -->
         {#each note.pages as page}
            <div
               class="flex flex-col mb-2 p-2 space-x-1 border rounded-md border-zinc-500"
            >
               <div class="h-7 font-medium">
                  <Badge class="bg-zinc-100 hover:bg-zinc-100">{page.type}</Badge>
                  {page.title}
               </div>
               <div class="-translate-x-0.5">
                  <Editor
                     content={page.content}
                     class="h-full min-h-80  font-editor focus-visible:outline-none"
                  />
               </div>
            </div>
            <button
               class="w-full rounded bg-zinc-50 text-center h-5 mb-2 hover:bg-zinc-100"
            >
               + new page</button
            >
         {/each}
      </ScrollArea>
   </Resizable.Pane>
</Resizable.PaneGroup>

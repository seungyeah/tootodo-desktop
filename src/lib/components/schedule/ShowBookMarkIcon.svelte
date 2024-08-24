<script lang="ts">
   import { Button, Popover } from "$ui";
   import { BookMarked, Bookmark, X } from "lucide-svelte";
   export let messages = [];
</script>

<Popover.Root>
   <Popover.Trigger>
      <Button
         variant="ghost"
         size="sm"
         class="w-auto h-8 p-2 text-xs bg-white rounded-lg shadow"
         ><BookMarked size={16} />
      </Button>
   </Popover.Trigger>
   <Popover.Content
      class="h-[300px] max-h-[calc(100%-60px)] w-1/4 max-w-[300px]  overflow-y-auto px-3 pt-0 "
      side="top"
      avoidCollisions={false}
   >
      <div class="flex-col items-center justify-between pt-1">
         <div
            class="sticky top-0 flex items-center justify-between h-8 mb-2 bg-white border-b-2"
         >
            <h4 class="font-bold">Bookmarked</h4>
            <Popover.Close>
               <Button
                  variant="ghost"
                  class="h-6 translate-y-0.5 p-1 hover:bg-zinc-200 "
                  ><X color="#a1a1aa" />
               </Button>
            </Popover.Close>
         </div>
         <div class="flex-col space-y-2">
            {#each messages as msg}
               {#if msg.save}
                  <div
                     class="flex items-start justify-start space-x-1 border-b border-dashed"
                  >
                     <Button
                        variant="ghost"
                        class="h-6 p-1 "
                        on:click={() => (msg.save = !msg.save)}
                     >
                        {#if msg.ask}
                           <Bookmark size={20} color="#52525b" fill="#059669" />
                        {:else}
                           <Bookmark size={20} color="#52525b" fill="#facc15" />
                        {/if}
                     </Button>
                     <div
                        class="line-clamp-3 text-ellipsis text-start text-[0.8rem] font-semibold"
                     >
                        {msg.content}
                     </div>
                  </div>
               {/if}
            {/each}
         </div>
      </div>
   </Popover.Content>
</Popover.Root>

<style>
   .chat {
      @apply fixed z-50 h-[calc(100vh-120px)] w-full  min-w-[250px] rounded-lg  bg-zinc-50 shadow-lg shadow-emerald-950 sm:h-[calc(100vh-80px)];
   }

   .time {
      @apply w-[50px] translate-y-1 scale-90 font-mono text-xs font-light text-zinc-400;
   }
</style>

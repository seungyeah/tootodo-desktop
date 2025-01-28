<script lang="ts">
   import { DropdownMenu, Button, ScrollArea } from "$ui";
   import { BookMarked, Bookmark, X } from "lucide-svelte";
   let { messages = [] } = $props();
</script>

<DropdownMenu.Root>
   <DropdownMenu.Trigger asChild >
      {#snippet children({ builder })}
            <Button
            builders={[builder]}
            variant="ghost"
            size="sm"
            class="w-auto h-8 p-2 text-xs bg-white rounded-lg shadow"
            ><BookMarked size={16} />
         </Button>
               {/snippet}
      </DropdownMenu.Trigger>
   <DropdownMenu.Content class="h-[300px]" side="top">
      <DropdownMenu.Group>
         <DropdownMenu.Label>Bookmarked</DropdownMenu.Label>
         <DropdownMenu.Separator />
         <ScrollArea class="h-60 w-60">
            <div class="flex-col items-center justify-between pt-1">
               <div class="flex-col space-y-2">
                  {#each messages as msg}
                     {#if msg.save}
                        <div
                           class="flex items-start justify-start space-x-1 border-b m-1.5 mr-2.5 border-dashed"
                        >
                           <Button
                              variant="ghost"
                              class="h-6 p-1 "
                              onclick={() => (msg.save = !msg.save)}
                           >
                              <Bookmark
                                 size={16}
                                 color="#52525b"
                                 fill={msg.save
                                    ? msg.ask
                                       ? "#05966980"
                                       : "#d92b3a80"
                                    : "none"}
                              />
                           </Button>
                           <div
                              class="line-clamp-3 text-ellipsis text-start text-sm font-chat"
                           >
                              {msg.content}
                           </div>
                        </div>
                     {/if}
                  {/each}
               </div>
            </div>
         </ScrollArea>
      </DropdownMenu.Group>
   </DropdownMenu.Content>
</DropdownMenu.Root>

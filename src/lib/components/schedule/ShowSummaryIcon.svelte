<script lang="ts">
   import { DropdownMenu, Button, ScrollArea } from "$ui";
   import { Stamp } from "lucide-svelte";

   let days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
</script>

<DropdownMenu.Root>
   <DropdownMenu.Trigger asChild let:builder>
      <Button
         builders={[builder]}
         variant="ghost"
         size="sm"
         class="w-auto h-8 p-2 text-xs bg-white rounded-lg shadow"
         ><Stamp size={16} />
      </Button>
   </DropdownMenu.Trigger>
   <DropdownMenu.Content class="h-[300px]" side="top">
      <DropdownMenu.Group>
         <DropdownMenu.Label>Summary</DropdownMenu.Label>
         <DropdownMenu.Separator />
         <ScrollArea class="h-60 w-60">
            <div class="flex-col items-center justify-between pt-1">
               <div class="flex-col space-y-2">
                  {#each days as day}
                     <div
                        class="flex items-start justify-start space-x-1 border-b m-1.5 mr-2.5 border-dashed"
                     >
                        <Button
                           variant="ghost"
                           class="h-6 p-1 bg-zinc-50 rounded -translate-y-1"
                        >
                           {day}
                        </Button>
                        <div
                           class="line-clamp-3 text-ellipsis text-start text-sm font-chat"
                        >
                           great!
                        </div>
                     </div>
                  {/each}
               </div>
            </div>
         </ScrollArea>
      </DropdownMenu.Group>
   </DropdownMenu.Content>
</DropdownMenu.Root>

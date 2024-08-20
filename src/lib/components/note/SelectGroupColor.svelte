<script lang="ts">
   import { Popover, Button, Label, Separator } from "$ui";
   import { Circle } from "lucide-svelte";
   import { tailwindColors } from "$lib/tailwindColors";
   import { cn } from "$lib/utils";
   export let tagGroup;
   export let icon: $$Props["icon"] = Circle;
   export { className as class };
   let className: $$Props["class"] = undefined;

</script>

<Popover.Root>
   <Popover.Trigger asChild let:builder>
      <div class="absolute -top-3.5 font-bold text-xs left-10 text-zinc-500">
         <slot name="info" />
      </div>
      <Button
         builders={[builder]}
         variant="ghost"
         size="sm"
         class={cn(" z-10 p-0   translate-y-0"
         ,className)}>
         <svelte:component this={icon}
            fill={tagGroup.color}
            class="p-0"
            size={17}
         />
      </Button></Popover.Trigger
   >
   <Popover.Content class="bg-white w-[360px] translate-y-1 translate-x-2 p-2">
      <Label class="font-bold text-lg font-digital w-full text-center"
         >Select Tag Group's Color</Label
      >
      <Separator />
      <div class="grid grid-cols-9 data-[highlighted]:bg-zinc-50">
         {#each tailwindColors as color}
            <!-- <div class="col-span-1 text-xs font-digital">
               {color.name}
            </div> -->

            {#each color.shades as shade}
               {#if shade.shade === "100" || shade.shade === "200" || shade.shade === "300"}
                  <Button
                     class="w-5 h-5 p-2 m-2"
                     style={`background-color: ${shade.hex};`}
                     on:click={() => {
                        tagGroup.color = shade.hex;
                     }}
                  />
               {/if}
            {/each}
         {/each}
      </div>
   </Popover.Content>
</Popover.Root>

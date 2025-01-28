<script lang="ts">
   import { Popover, Button, Label, Separator } from "$ui";
   import { Circle } from "lucide-svelte";
   import { tailwindColors } from "$lib/tailwindColors";
   import { cn } from "$lib/utils";

   interface Props {
      tagGroup: any;
      icon?: $$Props["icon"];
      class?: $$Props["class"];
      info?: import("svelte").Snippet;
   }

   let {
      tagGroup = $bindable(),
      icon = Circle,
      class: className = undefined,
      info,
   }: Props = $props();
</script>

<Popover.Root>
   <Popover.Trigger asChild>
      {#snippet children({ builder })}
         <div class="absolute -top-3.5 font-bold text-xs left-10 text-zinc-500">
            {@render info?.()}
         </div>
         <Button
            builders={[builder]}
            variant="ghost"
            size="sm"
            class={cn(" z-10 p-0   translate-y-0", className)}
         >
            {@const Component = icon}
            <Component fill={tagGroup.color} class="p-0" size={17} />
         </Button>
      {/snippet}
   </Popover.Trigger>
   <Popover.Content class="bg-white w-[330px] translate-y-1 translate-x-2 p-3">
      <Label class="font-bold text-lg font-digital w-full text-center"
         >Select Tag Group's Color</Label
      >
      <Separator class="my-1" />
      <div
         class="grid grid-cols-9 data-[highlighted]:bg-zinc-50 translate-x-0.5"
      >
         {#each tailwindColors as color}
            {#each color.shades as shade}
               {#if shade.shade === "100" || shade.shade === "200" || shade.shade === "300"}
                  <Button
                     class="w-5 h-5 p-2 m-1"
                     style={`background-color: ${shade.hex};`}
                     onclick={() => {
                        tagGroup.color = shade.hex;
                     }}
                  />
               {/if}
            {/each}
         {/each}
      </div>
   </Popover.Content>
</Popover.Root>

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
      <div class="absolute -top-3.5 font-bold text-xs left-10 text-neutral-500">
         {@render info?.()}
      </div>
      <Button
         variant="ghost"
         size="sm"
         class={cn(" z-10 p-0 translate-y-0", className)}
      >
         {@const Component = icon}
         <Component fill={tagGroup.color} class="" size={17} />
      </Button>
   </Popover.Trigger>
   <Popover.Content class="bg-white w-[330px] translate-y-4 translate-x-5 p-3">
      <Label class="font-semibold text-lg w-full text-center"
         >Select Tag Group's Color</Label
      >
      <Separator class="my-1" />
      <div
         class="grid grid-cols-9 data-[highlighted]:bg-neutral-50 translate-x-0.5"
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

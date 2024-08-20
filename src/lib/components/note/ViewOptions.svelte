<script lang="ts">
   import { Blend, Kanban, List, Tags, Settings2 } from "lucide-svelte";
   import {
      RadioGroup,
      Label,
      Switch,
      Separator,
      Button,
      DropdownMenu,
   } from "$ui";

</script>

<DropdownMenu.Root closeOnItemClick={false}>
   <DropdownMenu.Trigger class="w-12 h-full bg-pomodoro-900/80"
      ><button class=" w-7">
         <Settings2
            size={20}
            strokeWidth={1.65}
            class="m-auto text-white translate-y-0.5"
         />
      </button></DropdownMenu.Trigger
   >
   <DropdownMenu.Content class="w-44">
      <DropdownMenu.Group>
         <DropdownMenu.Label class="text-center">Note Filter Options</DropdownMenu.Label>
         <DropdownMenu.Separator />
         <DropdownMenu.Item class="flex justify-between"
            ><Label class="text-[0.9rem] ">Favorite?</Label>
            <Switch
               class="w-8 h-4 data-[state=checked]:bg-pomodoro-800"
            /></DropdownMenu.Item
         >
         <DropdownMenu.Item class="flex justify-between">
            <Label class="text-[0.9rem] ">On Website?</Label>
            <Switch
               class="w-8 h-4 data-[state=checked]:bg-pomodoro-800"
            /></DropdownMenu.Item
         >
      </DropdownMenu.Group>
      <Separator class="my-1" />
      <DropdownMenu.Group>
         <DropdownMenu.Label class="text-center">Note Sort Options</DropdownMenu.Label>
         <DropdownMenu.Separator />
         <DropdownMenu.Item class="flex justify-between">
            <RadioGroup.Root value="option-one">
               <div class="flex items-center space-x-2">
                  <RadioGroup.Item value="created"  />
                  <Label for="created">Created Date</Label>
               </div>
               <div class="flex items-center space-x-2">
                  <RadioGroup.Item value="updated"  />
                  <Label for="updated">Updated Date</Label>
               </div>
               <div class="flex items-center space-x-2">
                  <RadioGroup.Item value="titleA"  />
                  <Label for="titleA">Title A~</Label>
               </div>
               <div class="flex items-center space-x-2">
                  <RadioGroup.Item value="titleZ"  />
                  <Label for="titleZ">Title Z~</Label>
               </div>
            </RadioGroup.Root>
         </DropdownMenu.Item>
      </DropdownMenu.Group>
      <Separator class="my-1" />
      <Button
         variant="default"
         class="w-full h-8 text-lg font-bold text-white bg-pomodoro-900/80 hover:bg-pomodoro-950/80"
         >Apply</Button
      >
   </DropdownMenu.Content>
</DropdownMenu.Root>
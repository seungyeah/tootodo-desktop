<script>
    import Button from "$ui/button/button.svelte";
    import { FileDown, FileUp, Import, ListRestart } from "lucide-svelte";
    import NoteList from "./list-view/ViewList.svelte";

</script>
<div class="relative w-full">
   <div class="absolute top-0 right-0 flex items-center justify-end w-full h-5 space-x-2">
      <Button variant="secondary" class="h-6 px-2 shadow-sm"><FileDown size={15} class=""/></Button>
      <Button variant="secondary" class="h-6 px-2 shadow-sm"><FileUp size={15} class=""/></Button>
      <!-- refresh current page -->
      <Button variant="ghost" class="bg-pomodoro-800/70  h-6 px-1.5 shadow hover:bg-pomodoro-900"
      ><ListRestart size={16} color="white" /></Button
   >
   </div>
   <NoteList/>
</div>
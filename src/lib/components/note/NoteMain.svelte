<script>
    import Button from "$ui/button/button.svelte";
    import NoteList from "./NoteList.svelte";

</script>
<div class="w-full">
   <div class="flex items-center justify-end w-full h-5 space-x-2">
      <Button variant="secondary" class="h-6 px-2">sort</Button>
      <Button variant="secondary" class="h-6 px-2">view</Button>
      <Button variant="secondary" class="h-6 px-2">share</Button>
   </div>
   <NoteList/>
</div>
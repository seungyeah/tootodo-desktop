
<script lang="ts">
    import { Separator } from "$ui";
    import Editor from '$components/TipTapEditor.svelte';
	import TipTapEditor from "$components/TipTapEditor.svelte";
  </script>
   
  <div class="m-2 h-full">    
    <Separator class="my-3" />
    <div class="flex h-5 items-center space-x-4 text-sm">
      <div class="w-2/5 font-bold text-lg">Schedule</div>
      <Separator orientation="vertical" />
      <div class="w-3/5 font-bold text-lg h-full">Diary
        <TipTapEditor />
      </div>
      <Separator orientation="vertical" />
      <div class="w-1/4 font-bold text-lg">Timer Record</div>
    </div>
  </div>
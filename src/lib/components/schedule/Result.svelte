<script>
   import TenMResult from "$components/tenMTable/tenMResult.svelte";
</script>

<div class="w-full h-full">
   <div class="relative flex flex-col w-full h-full !ml-0">
      <!-- tenM planner -->
      <div
         class="relative w-full overflow-y-auto rounded-md h-full overflow-x-clip no-scrollbar"
      >
         <!-- tenM result -->
         <div class=" w-full h-full">
            <TenMResult />
         </div>
      </div>
   </div>
</div>

<script lang="ts">
   import {
      Render,
      Subscribe,
      createRender,
      createTable,
   } from "svelte-headless-table";
   import {
      addHiddenColumns,
      addPagination,
      addSelectedRows,
      addSortBy,
      addTableFilter,
      addResizedColumns,
   } from "svelte-headless-table/plugins";
   import { readable } from "svelte/store";
   import{ ArrowUpDown, ChevronDown, Milestone } from "lucide-svelte";
   import Actions from "./data-table-actions.svelte";
   import ItemInfo from "./data-table-connections.svelte"
   import DataTableCheckbox from "./data-table-checkbox.svelte";   
   import Title from "./data-table-title.svelte";
   import { Button,Table,Input } from "$ui";
   import { cn } from "$lib/utils.js";

   type Note = {
      id: string;
      tags: {
         name: string;
         color: string;
      }[];
      title: string;
      connectedItemInfo: {
         type: string;
         id: string;
         title: string;
         start_date: string;
         end_date: string;
         progress: number;
      } | undefined;
   };

   const data: Note[] = [
      {
         id: "m5gr84i9",
         tags: [{name:"rust",color:"#fb923c80"},
            {name:"qdrant",color:"#991b1b80"},
            {name:"cohere",color:"#facc1580"},
            {name:"ai",color:"#a3e63580"},
         ],
         title: "Qdrant examples, tutorial 분석",
         connectedItemInfo:{
            type: "task",
            id: "123456789",
            title: "qdrant examples, tutorial 분석",
            start_date: "2023-09-12T12",
            end_date: "2023-09-12T12",
            progress: 75,
         }
      },
      {
         id: "m5gr84i89",
         tags: [{name:"speaking",color:"#2563eb80"}],
         title: "speak 하루 한 챕터",
         connectedItemInfo:{
            type: "habit",
            id: "123456789",
            title: "speak 하루 한 챕터",
            start_date: "2023-09-12T12",
            end_date: "2023-09-12T12",
            progress: 75,
         }
      },
      {
         id: "m5gr8479",
         tags: [{name:"사이드 프로젝트",color:"#a78bfa80"}],
         title: "대회 세부 일정",
         connectedItemInfo:undefined
      },
   ];

   const table = createTable(readable(data), {
      sort: addSortBy({ disableMultiSort: true }),
      page: addPagination(),
      filter: addTableFilter({
         fn: ({ filterValue, value }) => value.includes(filterValue),
      }),
      select: addSelectedRows(),
      hide: addHiddenColumns(),
      resize:addResizedColumns(),
   });

   const columns = table.createColumns([
      table.column({
         header: (_, { pluginStates }) => {
            const { allPageRowsSelected } = pluginStates.select;
            return createRender(DataTableCheckbox, {
               checked: allPageRowsSelected,
            });
         },
         accessor: "id",
         cell: ({ row }, { pluginStates }) => {
            const { getRowState } = pluginStates.select;
            const { isSelected } = getRowState(row);

            return createRender(DataTableCheckbox, {
               checked: isSelected,
            });
         },
         plugins: {
            sort: {
               disable: true,
            },
            filter: {
               exclude: true,
            },
            resize:{
               initialWidth: 34,
            },
         },
      }),
      table.column({
         header: createRender(Milestone, { size: 18 }),
         accessor: ({ connectedItemInfo }) => connectedItemInfo,
         cell: (item) => {
            return createRender(ItemInfo, {itemInfo : item.value });
         },
         plugins: {
            sort: {
               disable: true,
            },
            filter: {
               exclude: true,
            },
            resize:{
               initialWidth: 80,
            },
         },
      }),
      table.column({
         header: "Title",
         accessor: (value) => value,
         cell: ({value}) => {
            return createRender(Title, {note:value});
         },
         plugins: {
            filter: {
               getFilterValue(value) {
                  return value.title.toLowerCase();
               },
            },
            sort:{
               getSortValue(value) {
                  return value.title;
               },
            }
         },
      }),      
      table.column({
         header: "",
         accessor: ({ id }) => id,
         cell: (item) => {
            return createRender(Actions, { id: item.value });
         },
         plugins: {
            sort: {
               disable: true,
            },
            resize:{
               initialWidth: 40,
            },
         },
      }),
   ]);

   const {
      headerRows,
      pageRows,
      tableAttrs,
      tableBodyAttrs,
      flatColumns,
      pluginStates,
      rows,
   } = table.createViewModel(columns);

   const { sortKeys } = pluginStates.sort;

   const ids = flatColumns.map((c) => c.id);

   const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
   const { filterValue } = pluginStates.filter;

   const { selectedDataIds } = pluginStates.select;

</script>

<div class="w-full h-full">
   <div class="flex items-center pt-3 pb-2">
      <Input
         class="max-w-sm"
         placeholder="Search by titles..."
         type="text"
         bind:value={$filterValue}
      />
   </div>

   <!-- table -->
   <div class="border rounded-md">
      <Table.Root {...$tableAttrs}>
         <Table.Header class="h-6 p-0" >
            {#each $headerRows as headerRow}
               <Subscribe rowAttrs={headerRow.attrs()} >
                  <Table.Row class="h-6">
                     {#each headerRow.cells as cell (cell.id)}
                        <Subscribe
                           attrs={cell.attrs()}
                           let:attrs
                           props={cell.props()}
                           let:props
                        >
                           <Table.Head
                              {...attrs}
                              class={cn("[&:has([role=checkbox])]:px-3 py-0 !h-6")}
                           >
                              {#if cell.id === "Title"}
                                 <Button
                                    variant="ghost"
                                    on:click={props.sort.toggle}
                                    class="w-full "
                                 >
                                    <Render of={cell.render()} />
                                    <ArrowUpDown
                                       class={cn(
                                          $sortKeys[0]?.id === cell.id &&
                                             "text-foreground",
                                          "ml-2 h-4 p-0 w-4",
                                       )}
                                    />
                                 </Button>
                              {:else}
                                 <Render of={cell.render()} />
                              {/if}
                           </Table.Head>
                        </Subscribe>
                     {/each}
                  </Table.Row>
               </Subscribe>
            {/each}
         </Table.Header>
         
         <Table.Body {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
               <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                  <Table.Row
                     {...rowAttrs}
                     data-state={$selectedDataIds[row.id] && "selected"}                     
                  >
                     {#each row.cells as cell (cell.id)}
                        <Subscribe attrs={cell.attrs()} let:attrs>
                           <Table.Cell
                              class={cn("[&:has([role=checkbox])]:pl-3 px-1 py-0 h-12")}
                              {...attrs}
                           >
                                 <Render of={cell.render()} />
                           </Table.Cell>
                        </Subscribe>
                     {/each}
                  </Table.Row>
               </Subscribe>
            {/each}
         </Table.Body>
      </Table.Root>
   </div>
   
   <!-- pagination -->
   <div class="flex items-center justify-end py-4 space-x-2">
      <div class="flex-1 text-sm text-muted-foreground">
         {Object.keys($selectedDataIds).length} of {$rows.length} row(s) selected.
      </div>
      <Button
         variant="outline"
         size="sm"
         on:click={() => ($pageIndex = $pageIndex - 1)}
         disabled={!$hasPreviousPage}>Previous</Button
      >
      <Button
         variant="outline"
         size="sm"
         disabled={!$hasNextPage}
         on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
      >
   </div>
</div>

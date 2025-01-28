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
   import { ArrowUpDown, ChevronDown, Milestone } from "lucide-svelte";
   import Actions from "./data-table-actions.svelte";
   import ItemInfo from "./data-table-connections.svelte";
   import DataTableCheckbox from "./data-table-checkbox.svelte";
   import Title from "./data-table-title.svelte";
   import { Button, Table, Input } from "$ui";
   import { cn } from "$lib/utils.js";

   type Note = {
      id: string;
      tags: {
         name: string;
         groups: string[];
      }[];
      title: string;
      pages: {
         title: string|undefined;
         type: string;
         content: string;
      }[];
      connectedItemInfo:
         | {
              type: string;
              id: string;
              title: string;
              start_date: string;
              end_date: string;
              progress: number;
           }
         | undefined;
   };

   const data: Note[] = [
      
      {
         id: "m5gr84i89",
         tags: [{ name: "speaking", groups: ["1"] }],
         title: "speak 하루 한 챕터",
         connectedItemInfo: {
            type: "habit",
            id: "123456789",
            title: "speak 하루 한 챕터",
            start_date: "2023-09-12T12",
            end_date: "2023-09-12T12",
            progress: 75,
         },
         pages:[]
      },
      {
         id: "m5gr8479",
         tags: [{ name: "사이드 프로젝트", groups: ["0"] }],
         title: "대회 세부 일정",
         connectedItemInfo: undefined,
         pages:[{
            type: "editor",
            content:"마감: 2024 08 28",            
         },{
            type: "editor",
            content:"마감: 2024 08 28",         
         }]
      },
      {
         id: "m5gr84i9",
         tags: [
            { name: "rust", groups: ["3"] },
            { name: "qdrant", groups: ["2", "4","5"] },
            { name: "cohere", groups: ["2"] },
         ],
         title: "Qdrant examples, tutorial 분석",
         connectedItemInfo: {
            type: "task",
            id: "123456789",
            title: "qdrant examples, tutorial 분석",
            start_date: "2023-09-12T12",
            end_date: "2023-09-12T12",
            progress: 75,
         },
         pages: [
            {
               title: "개발 과정",
               type: "editor",
               updated:"2024-08-28",
               content: `1. qdrant와 cohere client생성
                  2. cohere으로 notes 임베딩 데이터 생성(벡터화)
                  3. qdrant에 2에서 생성한 embeddings 저장 
                  4. 앱 cors설정
                  5. searchQuery, Document(note), SearchResult 스키마(class)생성
                  6. search api생성: 입력 쿼리를 cohere로 벡터화 한 후, 입력 쿼리에 대한 응답를 qdrant에서 검색. 
               `,
            },
            {
               title: "fastapi",
               type: "editor",
               updated:"2024-08-20",
               content: `fastapi의 depends가 머임?
                  - Depends(client): FastAPI에서 client 함수의 반환 값을 엔드포인트 파라미터로 자동으로 주입하는 기능입니다.
                  - Annotated[QdrantClient, Depends(client)]: client 파라미터가 QdrantClient 타입이며, Depends(client)를 통해 의존성 주입을 수행함을 나타냅니다.
                  희한한 문법 - 코드에서 Document(**point.payload) for point in results 부분은 파이썬의 리스트 컴프리헨션(List Comprehension)을 사용하여 results 리스트의 각 요소를 Document 객체로 변환하는 작업을 수행하는 부분
                  - Document(**point.payload): point.payload는 Document 클래스의 필드를 채우기 위한 딕셔너리입니다. **point.payload는 이 딕셔너리의 키와 값을 Document 클래스의 생성자에 전달하여 새로운 Document 객체를 만듭니다.
                  - 리스트 컴프리헨션: results 리스트의 각 요소를 변환하여 새로운 리스트를 생성합니다. 이 리스트는 Document 객체들로 구성됩니다.
               `,
            },
         ],
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
      resize: addResizedColumns(),
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
            resize: {
               initialWidth: 34,
            },
         },
      }),
      table.column({
         header: createRender(Milestone, { size: 18 }),
         accessor: ({ connectedItemInfo }) => connectedItemInfo,
         cell: (item) => {
            return createRender(ItemInfo, { itemInfo: item.value });
         },
         plugins: {
            sort: {
               disable: true,
            },
            filter: {
               exclude: true,
            },
            resize: {
               initialWidth: 80,
            },
         },
      }),
      table.column({
         header: "Title",
         accessor: (value) => value,
         cell: ({ value }) => {
            return createRender(Title, { note: value });
         },
         plugins: {
            filter: {
               getFilterValue(value) {
                  return value.title.toLowerCase();
               },
            },
            sort: {
               getSortValue(value) {
                  return value.title;
               },
            },
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
            resize: {
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
         <Table.Header class="h-6 p-0">
            {#each $headerRows as headerRow}
               <Subscribe rowAttrs={headerRow.attrs()}>
                  <Table.Row class="h-6">
                     {#each headerRow.cells as cell (cell.id)}
                        <Subscribe
                           attrs={cell.attrs()}
                           
                           props={cell.props()}
                           
                        >
                           {#snippet children({ attrs, props })}
                                                      <Table.Head
                                 {...attrs}
                                 class={cn(
                                    "[&:has([role=checkbox])]:px-3 py-0 !h-6",
                                 )}
                              >
                                 {#if cell.id === "Title"}
                                    <Button
                                       variant="ghost"
                                       onclick={props.sort.toggle}
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
                                                                              {/snippet}
                                                </Subscribe>
                     {/each}
                  </Table.Row>
               </Subscribe>
            {/each}
         </Table.Header>

         <Table.Body {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
               <Subscribe rowAttrs={row.attrs()} >
                  {#snippet children({ rowAttrs })}
                                    <Table.Row
                        {...rowAttrs}
                        data-state={$selectedDataIds[row.id] && "selected"}
                     >
                        {#each row.cells as cell (cell.id)}
                           <Subscribe attrs={cell.attrs()} >
                              {#snippet children({ attrs })}
                                                      <Table.Cell
                                    class={cn(
                                       "[&:has([role=checkbox])]:pl-3 px-1 py-0 h-12 w-full",
                                    )}
                                    {...attrs}
                                 >
                                    <Render of={cell.render()} />
                                 </Table.Cell>
                                                                                 {/snippet}
                                                </Subscribe>
                        {/each}
                     </Table.Row>
                                                   {/snippet}
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
         onclick={() => ($pageIndex = $pageIndex - 1)}
         disabled={!$hasPreviousPage}>Previous</Button
      >
      <Button
         variant="outline"
         size="sm"
         disabled={!$hasNextPage}
         onclick={() => ($pageIndex = $pageIndex + 1)}>Next</Button
      >
   </div>
</div>

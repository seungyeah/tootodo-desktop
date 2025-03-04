<script lang="ts">
    import { Tabs, Button, Input, DropdownMenu } from "$ui";
    import { CirclePlus, Droplet, Grip } from "lucide-svelte";
    import MemoEditor from "./MemoEditor.svelte";
    import { currentTime, formatDay } from "$store";
    import { onMount, tick } from "svelte";
    import ScrollArea from "$ui/scroll-area/scroll-area.svelte";
    import { cn } from "$lib/utils";

    let memos = $state([
        {
            pin: true,
            title: "Take a break",
            date: "2024-04-22",
            color: "rose",
            content: "I need to take a break and recharge",
        },
        {
            pin: false,
            title: "Prioritize notes",
            date: "2024-04-23",
            color: "violet",
            content: "Prioritizing notes is key to managing workload",
        },
        {
            pin: true,
            title: "Follow up with team",
            date: "2024-04-24",
            color: "blue",
            content:
                "Remember to follow up with the team regarding the project",
        },
        {
            pin: false,
            title: "Client meeting",
            date: "2024-04-25",
            color: "default",
            content: "Schedule a meeting with the client to discuss progress",
        },
        {
            pin: true,
            title: "Prepare presentation",
            date: "2024-04-26",
            color: "fuchsia",
            content:
                "Prepare the presentation slides for the upcoming conference",
        },
        {
            pin: false,
            title: "Review design mockups",
            date: "2024-04-27",
            color: "green",
            content: "Review and provide feedback on the design mockups",
        },
    ]);

    let newMemo = $state({
        pin: true,
        title: "",
        date: "",
        color: "default",
        content: "",
    });

    function resetNewMemo() {
        newMemo = {
            pin: true,
            title: "",
            date: "",
            color: newMemo.color,
            content: "",
        };
    }

    async function handleSubmit(
        event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
    ) {
        event.preventDefault();
        if (newMemo.title.trim() === "") {
            return;
        }
        if (newMemo.title.length <= 1) {
            resetNewMemo();
            return;
        }

        memos = [
            {
                pin: newMemo.pin,
                title: newMemo.title,
                date: formatDay($currentTime),
                color: newMemo.color,
                content: "",
            },
            ...memos,
        ];
        await tick();
        resetNewMemo();
    }

    onMount(() => {
        memos = memos.sort((a, b) => (b.pin === a.pin ? 0 : b.pin ? 1 : -1));
    });

    // 200,400,600
    let colors = [
        {
            name: "default",
            normal: "#fbbf24",
            light: "#fde68a",
            dark: "#d97706",
        },
        { name: "green", normal: "#4ade90", light: "#bbf7d0", dark: "#16a34a" },
        { name: "blue", normal: "#60a5fa", light: "#bfdbfe", dark: "#2563eb" },
        // { name: 'orange', normal: '#fb923c', light: '#fed7aa', dark: '#ea590c' },
        {
            name: "violet",
            normal: "#a78bfa",
            light: "#ddd6fe",
            dark: "#7c3aed",
        },
        {
            name: "fuchsia",
            normal: "#e879f9",
            light: "#f5d0fe",
            dark: "#c026d3",
        },
        { name: "rose", normal: "#fb7185", light: "#fecdd3", dark: "#e11d48" },
    ];

    $effect(() => {
        memos = memos.sort((a, b) => (b.pin === a.pin ? 0 : b.pin ? 1 : -1));
    });
</script>

<div class="relative w-full h-full">
    <Tabs.Root value="all" class="w-full h-full flex flex-col">
        {#snippet children({ value })}
            <!-- input form-->
            <form
                onsubmit={handleSubmit}
                class="relative flex items-center w-full h-9 mb-2"
            >
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        class=" h-9 -translate-y-0.5 rounded p-0"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            class="h-full p-0 w-7 rounded shadow "
                        >
                            <Droplet
                                size={30}
                                fill={colors.find(
                                    (c) => c.name === newMemo.color,
                                )?.dark ||
                                    colors.find((c) => c.name === "default")
                                        ?.dark}
                            />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="-translate-y-2">
                        <DropdownMenu.Group>
                            <DropdownMenu.Label class="text-center"
                                >Select Color
                            </DropdownMenu.Label>
                            <DropdownMenu.Item
                                class="grid grid-cols-3 data-[highlighted]:bg-neutral-50"
                            >
                                {#each colors as color}
                                    <Button
                                        class="w-5 h-5 p-2 m-2"
                                        style={`background-color: ${color.normal};`}
                                        onclick={() => {
                                            newMemo.color = color.name;
                                        }}
                                    />
                                {/each}
                            </DropdownMenu.Item>
                        </DropdownMenu.Group>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <Input
                    type="text"
                    placeholder="title : put more than 1 char"
                    bind:value={newMemo.title}
                    onkeydown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    class="my-2 ml-2 h-9 w-full scale-y-95 rounded-r-full p-2 pr-9 text-[1rem] font-normal focus:shadow"
                />
                <Button
                    variant="ghost"
                    type="submit"
                    class="absolute z-10 p-0 rounded-full -top-0.5 right-3 hover:bg-neutral-100"
                >
                    <CirclePlus color="#a1a1aa" />
                </Button>
            </form>

            <!-- select color -->
            <Tabs.List
                class="p-2 flex w-full justify-between bg-neutral-50 rounded-b-none border-neutral-200 border-b"
            >
                <Tabs.Trigger
                    value="all"
                    class="w-[40px] scale-75 translate-y-0"
                    onclick={() => {
                        newMemo.color = "default";
                    }}
                >
                    <Button
                        variant="ghost"
                        class="absolute left-0 bg-neutral-700 !p-3 hover:bg-neutral-900  shadow-md"
                    >
                        <Grip color="#fffbeb" fill="white" />
                    </Button>
                </Tabs.Trigger>
                {#each colors as color}
                    <Tabs.Trigger
                        value={color.name}
                        style={`background-color: ${color.light};`}
                        class="mx-1 rounded-lg rounded-b-none   h-7 w-7 translate-y-1.5"
                        onclick={() => {
                            newMemo.color = color.name;
                        }}
                    >
                        {#if value === color.name}
                            <div
                                class="my-2 bg-neutral-700 rounded-full w-3 h-3"
                            >
                                <Grip color="#fffbeb" fill="white" size={12} />
                            </div>
                        {/if}
                    </Tabs.Trigger>
                {/each}
            </Tabs.List>

            <!-- memo list -->
            <!-- all -->
            <Tabs.Content
                value="all"
                class="h-full w-full max-h-full overflow-y-auto m-0 shadow rounded-b-lg"
            >
                <ScrollArea
                    class="h-full max-h-full border-[3px] rounded-b-lg border-double  border-neutral-200 w-full px-3 py-2 space-y-1 border-t-0"
                >
                    {#each memos as memo, i}
                        <MemoEditor bind:memo={memos[i]} class="" />
                    {/each}
                </ScrollArea>
            </Tabs.Content>

            <!-- color filter -->
            {#each colors as color}
                {@const border_color = color.light}
                <Tabs.Content
                    value={color.name}
                    class="h-full w-full max-h-full overflow-y-auto m-0 shadow rounded-b-lg"
                >
                    <ScrollArea
                        class={cn(
                            "h-full max-h-full border-[3px] border-double rounded-b-lg w-full px-3 py-2 space-y-1 border-t-0",
                        )}
                        style={`border-color: ${border_color}; `}
                    >
                        {#each memos as memo, i}
                            {#if memo.color === color.name}
                                <MemoEditor bind:memo={memos[i]} class="" />
                            {/if}
                        {/each}
                    </ScrollArea>
                </Tabs.Content>
            {/each}
        {/snippet}
    </Tabs.Root>
</div>

<script lang="ts">
    import { currentTime, formatTime } from "$store";
    import { Button, DropdownMenu } from "$ui";
    let { projects, selectedProject = $bindable() } = $props();
    let currentTimeDisplay = $derived(formatTime($currentTime));
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <Button
            variant="ghost"
            size="sm"
            class="font-digital  w-[80px] text-[1.4rem] font-bold text-violet-950 border-b-4 border-l-4 border-r-4 rounded-xl  border-neutral-900 "
            style={`color: ${selectedProject.color}; border-color: ${selectedProject.color}`}
        >
            {currentTimeDisplay}
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="-translate-y-2">
        <DropdownMenu.Group>
            <DropdownMenu.Label class="text-center"
                >Select Project</DropdownMenu.Label
            >
            <DropdownMenu.Item
                class="grid grid-cols-3 data-[highlighted]:bg-neutral-50"
            >
                {#each projects as project}
                    <Button
                        class="m-2 h-5 w-5 p-2"
                        style={`background-color: ${project.color};`}
                        onclick={() => {
                            selectedProject = project;
                        }}
                    />
                {/each}
            </DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>

<script lang="ts">
    import { Button, DropdownMenu } from "$ui";
    let projects = [
        { color: "#3f3f46", id: "p0", title: "프로젝트 0" },
        { color: "#e11d48", id: "p1", title: "프로젝트 1" },
        { color: "#db2777", id: "p2", title: "프로젝트 2" },
        { color: "#c026d3", id: "p3", title: "프로젝트 3" },
        { color: "#9333ea", id: "p4", title: "프로젝트 4" },
        { color: "#7c3aed", id: "p5", title: "프로젝트 5" },
        { color: "#4f46e5", id: "p6", title: "프로젝트 6" },
        { color: "#2563eb", id: "p7", title: "프로젝트 7" },
        { color: "#0284c7", id: "p8", title: "프로젝트 8" },
    ];
    let { record = $bindable() } = $props();
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <Button
            class="p-0 ml-1 mr-2 mt-0.5 rounded-full w-5 h-5 border-2 border-white"
            style="background-color:{record?.color}"
        />
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
                            record.projectId = project.id;
                            record.color = project.color;
                        }}
                    />
                {/each}
            </DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>

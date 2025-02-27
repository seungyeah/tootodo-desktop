<script lang="ts">
    import "../app.pcss";
    import { Button, Breadcrumb, Avatar, DropdownMenu, ToggleGroup } from "$ui";
    import HeaderNav from "$components/HeaderNav.svelte";
    import TWindicator from "$components/TWindicator.svelte";
    import { goto } from "$app/navigation";
    import { onDestroy, onMount, tick } from "svelte";
    import { page } from "$app/state";
    import ShowRecord from "$components/tenMTable/showRecord.svelte";
    import PlanRecord from "$components/tenMTable/planRecord.svelte";

    import NProgress from "nprogress";
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    import "nprogress/nprogress.css";
    import { cn } from "$lib/utils";

    let { children } = $props();

    onMount(() => console.log(children));

    NProgress.configure({
        showSpinner: false,
    });

    afterNavigate(() => {
        NProgress.done();
    });

    beforeNavigate(() => {
        NProgress.start();
    });

    let openTenM = $state(false);

    onMount(async () => {
        await goto("/do/schedule", { replaceState: true });

        if (typeof window !== "undefined")
            document.addEventListener("keydown", handleKeyDown); // keydown 이벤트 리스너 추가
    });

    onDestroy(() => {
        if (typeof window !== "undefined")
            document.removeEventListener("keydown", handleKeyDown); // keydown 이벤트 리스너 제거
    });

    function handleKeyDown(event) {
        if (event.key === "Escape" || event.key === "Esc") {
            openTenM = false;
        }
    }
</script>

<div class="relative flex justify-between w-screen h-12">
    <!-- left menu (navigate page) -->
    <div
        class="bg-neutral-100 w-fit h-12 top-2.5 flex absolute right-4 z-50 items-center space-x-3 rounded-t-2xl px-4"
    >
        <!-- backward/forward page -->
        <!-- <HeaderNav/>-->
        <!-- navigation -->
        <Breadcrumb.Root class="px-2">
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Link
                        href="/too/tasks"
                        class="text-xl font-bold flex items-center space-x-2 text-foreground translate-y-0.5 hover:text-muted-foreground"
                    >
                        <div>Too</div>
                        {#if page.url.pathname.includes("too")}
                            <ToggleGroup.Root
                                class="flex w-[140px] gap-3 translate-y-0 h-9 items-center bg-neutral-100"
                            >
                                <!-- select item -->
                                <ToggleGroup.Item
                                    value="tasks"
                                    aria-label="task"
                                    class="w-full p-0 ml-2 h-6"
                                >
                                    <Button
                                        variant="ghost"
                                        href="/too/tasks"
                                        class={cn(
                                            "h-6 rounded-lg hover:bg-white/60",
                                            page.url.pathname.includes(
                                                "tasks",
                                            ) && "bg-white",
                                        )}
                                        >Task
                                    </Button>
                                </ToggleGroup.Item>
                                <ToggleGroup.Item
                                    value="habits"
                                    aria-label="habit"
                                    class="w-full p-1 mr-2 h-6"
                                >
                                    <Button
                                        variant="ghost"
                                        href="/too/habits"
                                        class={cn(
                                            "h-6 rounded-lg hover:bg-white/60",
                                            page.url.pathname.includes(
                                                "habits",
                                            ) && "bg-white",
                                        )}
                                        >Habit
                                    </Button>
                                </ToggleGroup.Item>
                            </ToggleGroup.Root>
                        {/if}
                    </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator class="text-neutral-400" />
                <Breadcrumb.Item>
                    <Breadcrumb.Link
                        href="/do/schedule"
                        class="text-xl font-bold flex items-center gap-0 text-foreground translate-y-0.5 hover:text-muted-foreground"
                    >
                        <div>Do</div>
                        {#if page.url.pathname.includes("do")}
                            <ToggleGroup.Root
                                class="flex gap-3 w-[180px] translate-x-3 justify-center h-9 items-center bg-neutral-100"
                            >
                                <!-- select item -->
                                <ToggleGroup.Item
                                    value="tasks"
                                    aria-label="task"
                                    class="w-full p-1 h-6 ml-5"
                                >
                                    <Button
                                        variant="ghost"
                                        href="/do/schedule"
                                        class={cn(
                                            "h-6 rounded-lg hover:bg-white/60",
                                            page.url.pathname.includes(
                                                "schedule",
                                            ) && "bg-white",
                                        )}
                                        >Schedule
                                    </Button>
                                </ToggleGroup.Item>
                                <ToggleGroup.Item
                                    value="habits"
                                    aria-label="habit"
                                    class="w-full p-1 h-6 "
                                >
                                    <Button
                                        href="/do/notes"
                                        variant="ghost"
                                        class={cn(
                                            "h-6 rounded-lg hover:bg-white/60",
                                            page.url.pathname.includes(
                                                "notes",
                                            ) && "bg-white",
                                        )}
                                        >Note
                                    </Button>
                                </ToggleGroup.Item>
                            </ToggleGroup.Root>
                        {/if}
                    </Breadcrumb.Link>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
    </div>

    <!-- right menu (profile, search, timer) -->
    <!--	<div-->
    <!--		class="absolute right-0 z-50 flex h-12 w-[200px] items-center justify-evenly space-x-2 rounded-b-2xl rounded-l-2xl bg-neutral-800 px-4"-->
    <!--	>-->
    <!--		&lt;!&ndash; timer, tenMplanner &ndash;&gt;-->
    <!--		<Button-->
    <!--			variant="ghost"-->
    <!--			onclick={() => (openTenM = !openTenM)}-->
    <!--			class={openTenM-->
    <!--				? "-translate-x-1 translate-y-1 scale-105 rounded-full border  border-dotted bg-neutral-900 !p-2 shadow-xl shadow-neutral-500 hover:bg-neutral-900 hover:shadow hover:shadow-neutral-200"-->
    <!--				: "h-8 w-10 !p-1 hover:bg-neutral-900 hover:shadow hover:shadow-neutral-200"}-->
    <!--			><Clock-->
    <!--				size={26}-->
    <!--				color="white"-->
    <!--				fill="#09090b"-->
    <!--				strokeWidth={2}-->
    <!--			/></Button-->
    <!--		>-->
    <!--		<div-->
    <!--			class="fixed z-50 hidden right-0 top-10 w-[470px] translate-y-1 p-0"-->
    <!--			class:openTimer={openTenM}-->
    <!--		>-->
    <!--			<div-->
    <!--				class={$timerOpen-->
    <!--					? " relative m-auto  h-[290px] "-->
    <!--					: "relative m-3 h-[470px] w-[calc(100%-24px)] bg-white border-[6px] border-double border-neutral-900 rounded-lg shadow-lg shadow-neutral-500"}-->
    <!--			>-->
    <!--				<ShowRecord />-->
    <!--				<div class="absolute top-0 w-full h-full">-->
    <!--					&lt;!&ndash; plan record and start timer directly &ndash;&gt;-->
    <!--					<PlanRecord />-->
    <!--				</div>-->
    <!--			</div>-->
    <!--		</div>-->

    <!--		&lt;!&ndash; profile &ndash;&gt;-->
    <!--		<DropdownMenu.Root>-->
    <!--			<DropdownMenu.Trigger >-->
    <!--					<Button-->
    <!--						variant="ghost"-->
    <!--						class="w-8 h-8 hover:bg-neutral-950 "-->
    <!--						><Avatar.Root-->
    <!--							class="w-8 h-8 border-2 shadow-lg text-neutral-500"-->
    <!--						>-->
    <!--							<Avatar.Image src="/favicon.png" alt="profile" />-->
    <!--							<Avatar.Fallback class="font-bold bg-black"-->
    <!--								>Hi</Avatar.Fallback-->
    <!--							>-->
    <!--						</Avatar.Root></Button-->
    <!--					>-->
    <!--						</DropdownMenu.Trigger>-->
    <!--			<DropdownMenu.Content class="w-56">-->
    <!--				<DropdownMenu.Label>{$auth.email}</DropdownMenu.Label>-->
    <!--				<DropdownMenu.Separator />-->
    <!--				<DropdownMenu.Item>-->
    <!--					Quit-->
    <!--					<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>-->
    <!--				</DropdownMenu.Item>-->
    <!--			</DropdownMenu.Content>-->
    <!--		</DropdownMenu.Root>-->
    <!--	</div>-->
</div>

<div class="h-full max-h-[calc(100vh-80px)] w-full">
    {@render children()}
</div>

<!--<TWindicator/>-->

<style>
    :global(html, body) {
        height: 100%;
    }

    :global(body) {
        font-family: "Manrope Variable", sans-serif;
    }

    :global(#nprogress) {
        pointer-events: none;
    }

    :global(#nprogress .bar) {
        background: #a3202c !important;
        height: 2px;
        opacity: 60%;
    }

    :global(#nprogress .peg) {
        box-shadow:
            0 0 10px #a3202c,
            0 0 5px #a3202c;
    }

    :root {
        --bg-light-red: 254 242 242;
        --bg-light-orange: 255 247 237;
        --bg-light-amber: 255 251 235;
        --bg-light-yellow: 254 252 232;
        --bg-light-lime: 247 254 231;
        --bg-light-green: 240 253 244;
        --bg-light-emerald: 236 253 245;
        --bg-light-teal: 240 253 250;
        --bg-light-cyan: 236 254 255;
        --bg-light-sky: 240 249 255;
        --bg-light-blue: 239 246 255;
        --bg-light-indigo: 238 242 255;
        --bg-light-violet: 245 243 255;
        --bg-light-purple: 250 245 255;
        --bg-light-fuchsia: 253 244 255;
        --bg-light-pink: 253 242 248;
        --bg-light-rose: 255 241 242;
    }
</style>

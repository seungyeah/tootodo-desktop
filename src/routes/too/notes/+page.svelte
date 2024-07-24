<script lang="ts">
	import PageTemplete from "$components/PageTemplete.svelte";

	import {
		Search,
	} from "lucide-svelte";
	import { onMount, tick } from "svelte";
	import { Input, } from "$ui";
    import NoteSide from "$components/note/NoteSide.svelte";
    import NoteMain from "$components/note/NoteMain.svelte";

	type Category = {
		value: string;
		label: string;
		properties: {
			options: string[];
			label: string;
		}[];
	};
	const categories: Category[] = [
		{
			value: "tootodo",
			label: "tootodo",
			properties: [
				{
					label: "tags",
					options: [
						"FE",
						"BE",
						"DB",
						"DevOps",
						"Design",
						"Marketing",
						"Sales",
						"HR",
						"Management",
						"Others",
					],
				},
				{
					label: "status",
					options: ["Todo", "Doing", "Done"],
				},
			],
		},
		{
			value: "english",
			label: "English",
			properties: [
				{
					label: "tags",
					options: [
						"Vocabulary",
						"Grammar",
						"Listening",
						"Speaking",
						"Reading",
						"Writing",
						"Others",
					],
				},
				{
					label: "status",
					options: ["Todo", "Doing", "Done"],
				},
			],
		},
	];
	
</script>

<PageTemplete>
	<div slot="nav" class="translate-x-2 -translate-y-2">
		<div class="px-2 md:hidden"><Search /></div>
		<Input
			placeholder="Search"
			class="hidden md:block w-[calc(100%-200px)]"
		/>
	</div>
	<div slot="side" class="w-full h-full">
		<NoteSide />
	</div>
	<div slot="main" class="w-full h-full">
		<NoteMain />
	</div>
</PageTemplete>

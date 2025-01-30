<script lang="ts">

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

</script>

<div class="flex flex-col justify-center items-end w-full h-full sm:absolute sm:top-0">
	<div class="w-2/3 h-10">
	</div>

	<div class="h-[calc(100%-70px)] w-full">
		{@render children?.()}
	</div>
</div>

<script lang="ts">
  let {
    data = [30, 0, 30],
    color = (d: number, i: number) => ["#c32734", "#09090b", "#501016"][i],
  } = $props();

  let size = 186;
  let strokeWidth = 0;

  let total = $derived(data.reduce((sum, d) => sum + d, 0));
  let angles = $derived(
    data.reduce((acc, d, i) => {
      const startAngle = i === 0 ? 0 : acc[i - 1].endAngle;
      const endAngle = startAngle + (d / total) * (Math.PI * 2);
      acc.push({ startAngle, endAngle });
      return acc;
    }, []),
  );
</script>

<div class="pie-chart" style="width: {size}px; height: {size}px;">
  <svg viewBox="0 0 {size} {size}">
    {#each angles as { startAngle, endAngle }, i (i)}
      <path
        d="
            M {size / 2} {size / 2}
            L {size / 2 +
          Math.sin(startAngle) * (size / 2 - strokeWidth / 2)} {size / 2 -
          Math.cos(startAngle) * (size / 2 - strokeWidth / 2)}
            A {size / 2 - strokeWidth / 2} {size / 2 -
          strokeWidth / 2} 0 {endAngle - startAngle > Math.PI ? 1 : 0} 1 {size /
          2 +
          Math.sin(endAngle) * (size / 2 - strokeWidth / 2)} {size / 2 -
          Math.cos(endAngle) * (size / 2 - strokeWidth / 2)}
            Z
          "
        fill={color(data[i], i)}
        stroke="none"
      />
    {/each}
  </svg>
</div>

<style>
  .pie-chart {
    display: inline-block;
    vertical-align: middle;
  }
</style>

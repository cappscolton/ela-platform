<script>
  import StudentWidget from "$components/StudentWidget.svelte";
  import Line from "chart.js/auto";
  import { onMount } from "svelte";
  // import LineChart from "$components/LineChart.svelte";
  // function replot() {
  //   const data = [
  //     { day: "5-05", count: 0 },
  //     { day: "5-06", count: 0 },
  //     { day: "5-07", count: 0 },
  //     { day: "5-08", count: 0 },
  //     { day: "5-09", count: 0 },
  //     { day: "5-10", count: 0 },
  //     { day: "5-11", count: },
  //   ];

  //   // @ts-ignore
  //   new Line(document.getElementById("acquisitions"), {
  //     type: "line",
  //     data: {
  //       labels: data.map((row) => row.day),
  //       datasets: [
  //         {
  //           label: "Mastery by day",
  //           data: data.map((row) => row.count),
  //         },
  //       ],
  //     },
  //   });
  // }

  onMount(async () => {
    const data = [
      { day: "5-05", count: 0 },
      { day: "5-06", count: 0 },
      { day: "5-07", count: 0 },
      { day: "5-08", count: 0 },
      { day: "5-09", count: 0 },
      { day: "5-10", count: 0 },
      { day: "5-11", count: 30 },
    ];

    // @ts-ignore
    new Line(document.getElementById("acquisitions"), {
      type: "line",
      data: {
        labels: data.map((row) => row.day),
        datasets: [
          {
            label: "Mastery by day",
            data: data.map((row) => row.count),
          },
        ],
      },
    });
  });
</script>

<StudentWidget />

<div class="container mx-auto content-center">
  <div style="width: 1000px;"><canvas id="acquisitions" /></div>
</div>

<script lang="ts">
  import EquivalencySelection from "./EquivalencySelection.svelte";
  export let equivalencySet: { id: string; concept: string }[];
  export let activities: { id: string; name: string; equivalencyId: string }[];
  export let action = "";
</script>

<div class="my-8 border-2 rounded-lg">
  <form id="myForm" action="/api/equivalency/{action}" method="post">
    <div class="overflow-x-auto">
      <table class="table table-zebra w-full">
        <!-- head -->
        <thead>
          <tr>
            <th />
            <th>Activity Title</th>
            <th />
            <th>Equivalency Concept</th>
          </tr>
        </thead>

        <tbody>
          {#each activities as activity, i}
            <tr>
              <!-- <label class="label cursor-pointer"> -->
              <th />
              <td>
                <a href="/platform/admin/dashboard/modify/{activity.id}">
                  {activity.name}
                </a>
              </td>
              <td />
              <td>
                <EquivalencySelection
                  activityId={activity.id}
                  equivalencySet={Object.assign(equivalencySet)}
                />
              </td>
            </tr>
          {/each}

          <tr>
            <th />
            <td
              ><div class="">
                <input
                  type="submit"
                  class="m-2 btn btn-primary"
                  value="{action} Equivalencies"
                />
              </div></td
            >
            <td />
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  </form>
</div>

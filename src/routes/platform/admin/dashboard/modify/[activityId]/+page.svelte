<script lang="ts">
  import ActivityForm from "$components/ActivityForm.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  import { superForm } from "sveltekit-superforms/client";
  const activity = superForm(data.activityForm, {
    delayMs: 100,
    timeoutMs: 8000,
    clearOnSubmit: "errors-and-message",
    multipleSubmits: "prevent",
  });
  const { form } = activity;
  console.log($form.id);
</script>

<ActivityForm
  superform={activity}
  toolProviderSet={data.toolProviderSet}
  action="Modify"
/>

<script lang="ts">
  import ActivityForm from "$components/ActivityForm.svelte";
  import CreateEquivalency from "$components/CreateEquivalency.svelte";
  import CreateToolProvider from "$components/CreateToolProvider.svelte";
  import type { PageData } from "./$types";
  export let data: PageData;

  import { superForm } from "sveltekit-superforms/client";
  const tp = superForm(data.tpForm, {
    delayMs: 100,
    timeoutMs: 8000,
    clearOnSubmit: "errors-and-message",
    multipleSubmits: "prevent",
  });
  const activity = superForm(data.activityForm, {
    delayMs: 100,
    timeoutMs: 8000,
    clearOnSubmit: "errors-and-message",
    multipleSubmits: "prevent",
  });
  const equivalency = superForm(data.equivalencyForm, {
    delayMs: 100,
    timeoutMs: 8000,
    clearOnSubmit: "errors-and-message",
    multipleSubmits: "prevent",
  });
</script>

<div class="flex container mx-auto">
  <div class="mx-12">
    <div class="my-12">
      <ActivityForm
        superform={activity}
        toolProviderSet={data.toolProviderSet}
      />
    </div>
  </div>

  <div class="mx-12">
    <div class="my-12">
      <CreateEquivalency superform={equivalency} />
    </div>
  </div>

  <div class="mx-12">
    <div class="my-12">
      <CreateToolProvider superform={tp} />
    </div>
  </div>
</div>

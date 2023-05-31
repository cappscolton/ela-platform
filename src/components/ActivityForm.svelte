<script lang="ts">
  export let superform;
  const { form, errors, enhance, delayed } = superform;
  export let toolProviderSet: { id: string; name: string }[] = [];
  export let action = "Create";
</script>

<h1 class="text-2xl font-bold">{action} Activity</h1>
<form action="?/activity" method="post" use:enhance>
  <table class="table-auto">
    <div class="my-2 container mx-auto">
      <label>
        <span class="label-text">Activity Name*</span>
        <input
          name="name"
          type="text"
          placeholder="Activity name"
          class="input input-bordered w-full max-w-xs"
          bind:value={$form.name}
        />
      </label>
    </div>

    <div class="my-2 container mx-auto">
      <label>
        <span class="label-text">Activity URL*</span>
        <input
          name="ltiUrl"
          type="text"
          placeholder="LTI URL"
          class="input input-bordered w-full max-w-xs"
          bind:value={$form.ltiUrl}
        />
      </label>
      {#if $errors.ltiUrl}
        <small>{$errors.ltiUrl}</small>
      {/if}
    </div>

    <div class="my-2 container mx-auto">
      <label>
        <span class="label-text">Correctness Threshold</span>
        <input
          name="correctnessThreshold"
          type="number"
          placeholder="100"
          value="100"
          min="0"
          max="100"
          class="input input-bordered w-full max-w-xs"
        />
      </label>
      {#if $errors.correctnessThreshold}
        <small>{$errors.correctnessThreshold}</small>
      {/if}
    </div>

    <div class="my-2 container mx-auto">
      <div>
        <label>
          <span class="label-text">Tool Provider*</span>
          <select
            name="toolProviderId"
            bind:value={$form.toolProviderId}
            class="select select-bordered w-full max-w-xs"
            >\
            <option value="no" />
            {#each toolProviderSet as toolProvider}
              <option value={toolProvider.id}>{toolProvider.name}</option>
            {/each}
          </select>
        </label>
      </div>
      {#if $errors.toolProviderId}
        <small>{$errors.toolProviderId}</small>
      {/if}
    </div>
  </table>

  <div class="my-2">
    <input type="submit" class="btn btn-primary" value="{action} Activity" />
  </div>
  {#if action === "Modify"}
    <input type="hidden" name="id" value={$form.id} />
    <form action="?/deleteActivity" method="post">
      <input type="hidden" name="id" value={$form.id} />
      <input type="hidden" name="toolProviderId" value={$form.toolProviderId} />
      <input type="hidden" name="ltiUrl" value={$form.ltiUrl} />
      <input type="hidden" name="name" value={$form.name} />
      <input
        type="hidden"
        name="correctnessThreshold"
        value={$form.correctnessThreshold}
      />
      <input type="submit" class="btn btn-primary" value="Delete Activity" />
    </form>
  {/if}
</form>

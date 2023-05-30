<script lang="ts">
  export let superform;
  const { form, errors, enhance, delayed } = superform;
  export let toolProviderSet: { id: string; name: string }[] = [];
</script>

<h1 class="text-2xl font-bold">Create Activity</h1>
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
          bind:value={$form.url}
        />
      </label>
      {#if $errors.url}
        <small>{$errors.url}</small>
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
    <input type="submit" class="btn btn-primary" value="Create Activity" />
  </div>
</form>

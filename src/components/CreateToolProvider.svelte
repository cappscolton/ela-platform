<script lang="ts">
  export let superform;
  const { form, errors, enhance, delayed } = superform;
</script>

<h1 class="text-2xl font-bold">Create Tool Provider</h1>
<form action="?/tp" method="post" use:enhance>
  <table class="table-auto">
    <div class="my-2 container mx-auto">
      <label>
        <span class="label-text">Tool Name*</span>
        <input
          name="name"
          type="text"
          placeholder="Tool name"
          class="input input-bordered w-full max-w-xs"
          bind:value={$form.name}
        />
      </label>
      {#if $errors.name}
        <small>{$errors.name}</small>
      {/if}
    </div>

    <div class="my-2 container mx-auto">
      <label>
        <span class="label-text">Secret*</span>
        <input
          name="oauthSecret"
          type="text"
          placeholder="OAuth 1.0 Client Secret"
          class="input input-bordered w-full max-w-xs"
          bind:value={$form.oauthSecret}
        />
      </label>
      {#if $errors.oauthSecret}
        <small>{$errors.oauthSecret}</small>
      {/if}
    </div>

    <div class="my-2 container mx-auto">
      <label>
        <span class="label-text">Key*</span>
        <input
          name="oauthKey"
          type="text"
          placeholder="OAuth 1.0 Consumer Key"
          class="input input-bordered w-full max-w-xs"
          bind:value={$form.oauthKey}
        />
      </label>
      {#if $errors.oauthKey}
        <small>{$errors.oauthKey}</small>
      {/if}
    </div>

    <div class="my-2">
      <input
        type="submit"
        class="btn btn-primary"
        value="Create Tool Provider"
      />
    </div>
    {#if $delayed}<span class="delayed">Working...</span>{/if}
  </table>
</form>

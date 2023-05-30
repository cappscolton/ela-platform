<script>
  export let superform;
  const { form, errors, enhance, delayed } = superform;
</script>

<h1 class="text-2xl font-bold">Create Equivalency</h1>
<form action="?/equivalency" method="post" use:enhance>
  <table class="table-auto">
    <div class="my-2 container mx-auto">
      <label>
        <span class="label-text">Equivalency Concept*</span>
        <input
          name="concept"
          type="text"
          placeholder="Equivalency Concept"
          class="input input-bordered w-full max-w-xs"
          bind:value={$form.concept}
        />
      </label>
    </div>

    <div class="my-2 container mx-auto">
      <label>
        <span class="label-text">Mastery Formula</span>
        <select
          name="masteryFormula"
          class="select select-bordered w-full max-w-xs"
        >
          <option selected>3CCR</option>
          <option>4CCR</option>
          <option>5CCR</option>
          <option disabled>ToW</option>
          <option disabled>BKT</option>
        </select>
      </label>
    </div>
  </table>

  <div class="my-2">
    <input type="submit" class="btn btn-primary" value="Create Equivalency" />
  </div>
</form>

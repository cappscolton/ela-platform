<script>
  import { signIn, signOut } from "@auth/sveltekit/client";

  export let data;

  console.log(data);
</script>

<h1 class="fill-">Login</h1>
<p>
  {#if data.session}
    {#if data.session.user?.image}
      <span
        style="background-image: url('{data.session.user.image}')"
        class="avatar"
      />
    {/if}
    <span class="signedInText">
      <small>Signed in as</small><br />
      <strong>{data.session.user?.name ?? "User"}</strong>
    </span>
    <button on:click={() => signOut()} class="button">Sign out</button>
  {:else}
    <span class="notSignedInText">You are not signed in</span>
    <br />
    <button on:click={() => signIn("discord")}>Sign In with Discord</button>
  {/if}
</p>

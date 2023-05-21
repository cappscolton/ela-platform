<script lang="ts">
  export const data = {};
</script>

<div class="navbar m-1 bg-primary">
  <div class="navbar-start">
    <div class="dropdown">
      <div class="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      </div>
      <ul
        class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
      />
    </div>
    <a href="/platform" class="btn btn-ghost normal-case text-xl"
      >ELA Platform</a
    >
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li>
        <a href="/platform">Home</a>
      </li>
      <li>
        <a href="/platform/admin/dashboard">
          Dashboard
          <svg
            class="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
            />
          </svg>
        </a>
        <ul style="z-index:99" class="p-2">
          <li>
            <a href="/platform/admin/dashboard/classwide"
              >Class-wide Analytics</a
            >
          </li>
          <li>
            <a href="/platform/admin/dashboard/individual"
              >Individual Analytics</a
            >
          </li>
        </ul>
      </li>
      <li>
        <a href="/platform/admin/dashboard/equivalency">Equivalencies</a>
      </li>
      <li><a href="/platform/admin/dashboard/activity">Activities</a></li>
      <li><a href="/login">Login</a></li>
    </ul>
  </div>
  <div class="navbar-end">
    <a class="btn" href="https://k-state.instructure.com/">Back to LMS</a>
  </div>
</div>

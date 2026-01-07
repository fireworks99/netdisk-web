<template>
  <div class="sidebar_wrapper">

    <div class="header flex_center">
      <div class="icon flex_center">
        <img src="@/assets/images/logo.svg" alt="">
      </div>
      <div class="text">NetDisk</div>
    </div>

    <div class="content"></div>

  </div>
</template>

<style lang="scss" scoped>
.sidebar_wrapper {
  height: 100%;
  border-right: $border-std;

  .header {
    height: $header-height;
    gap: 16px;

    .text {
      font-size: 18px;
      font-weight: bold;
    }
  }

}
</style>


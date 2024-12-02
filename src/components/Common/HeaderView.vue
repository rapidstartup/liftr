<template>
  <header class="client-dashboard-header">
    <div class="client-dashboard-header-nav px-4">
      <div class="d-flex align-items-center">
        <img src="@/assets/logo.png" width="50" >
        <span class="dashboard-btn ml-5 back" v-if="$route.name != 'workout-dashboard'" @click="$router.back()">
          <i class="fa-solid fa-angle-left mr-2"></i>
          Back
        </span>
        <span class="dashboard-btn ml-5" :class="{'back': $route.name == 'workout-dashboard'}" @click="redirectTo('/workout-dashboard')">
           Dashboard
        </span>
      </div>
      <div>
        <span
         @click="redirectTo('/workout-dashboard')"
          ><i
            class="fa-solid fa-calendar mr-4"
            style="font-size: 1.4rem; cursor: pointer"
            :style="{color: $route.name == 'workout-dashboard' ? '#15e7fb' : '#808080'}"
          ></i
        ></span>
        <span
        title="Messages"
            @click="redirectTo('/messages')"
          ><i
            class="fa-solid fa-comment mr-4"
            style="font-size: 1.4rem; cursor: pointer"
            :style="{color: $route.name == 'messages' ? '#15e7fb' : '#808080'}"
          ></i
        ></span>
        <span
        title="My Profile"
            @click="redirectTo('/profile')"
          ><i
            class="fa-solid fa-user mr-3"
            style="font-size: 1.4rem; cursor: pointer"
            :style="{color: $route.name == 'profile' ? '#15e7fb' : '#808080'}"
          ></i
        ></span>
        
        <span title="Performance" @click="redirectTo('/performance')" >
          <img src="@/assets/performance.png" class="mb-0" width="30" style="cursor: pointer">
        <!-- <i
            class="fa-solid fa-info-circle"
            style="font-size: 1.4rem; cursor: pointer"
            :style="{color: $route.name == 'Performance' ? '#15e7fb' : '#808080'}"
          ></i
        > -->
        </span>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  methods: {
    redirectTo(path) {
        if(this.$route.path!=path){
            this.$router.push(path);
        }
    },
  },
};
</script>

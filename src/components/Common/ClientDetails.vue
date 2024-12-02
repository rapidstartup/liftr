<template>
  <div class="athelete-card" :class="shortView ? '' : ''">
    <div class="athelete-card-header">
      <h4 class="mb-0">Athelete</h4>
    </div>
    <div class="d-flex justify-content-evenly" :class="!shortView ? 'flex-column': ''">
      <div class="athelete-profile-view my-4 d-flex flex-column align-items-center">
        <img :src="profileImage" alt="profile-pic" />
          <input
            type="file"
            class="d-none"
            id="file"
            @change="$emit('update',$event)"
          />
        <label v-if="shortView" for="file" class="profile-img-btn d-flex justify-content-end m-3" >Choose Image</label>
      </div>
      <div class="athelete-card-body">
        <h2 class="mb-4">{{ selectClient?.name }}</h2>
        <div class="form-data" v-if="shortView">
          <span>Email :&nbsp; </span>
          {{ selectClient?.email }}
        </div>
        <div class="form-data" v-if="shortView">
          <span>Phone :&nbsp; </span>
          {{ selectClient?.phone }}
        </div>
        <div class="form-data">
          <span>Member Since :&nbsp; </span>
          {{ selectClient?.member_since }}
        </div>
        <div class="form-data" :class="shortView ? 'mb-5': ''">
          <span>Last Checkin :&nbsp; </span>
          {{ selectClient?.last_checkin }}
        </div>
        <div class="form-data" v-if="!shortView">
          <span>Lifetime Checkins :&nbsp; </span>
        </div>
        <div class="form-data" v-if="!shortView">
          <span>Streak :&nbsp; </span>
         
        </div>
        <div class="form-data mb-5" v-if="!shortView">
          <span>30 Day Average :</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["shortView", "profileInfo"],
  data() {
    return {
      selectClient: null,
    };
  },
  computed: {
    profileImage() {
      return this.profileInfo?.profile_image || this.selectClient?.profile_image;
    }
  },
  mounted() {
    this.selectClient = this.$store.state.auth.user.data;
    console.log(this.selectClient);
  },
};
</script>
<style scoped>
.athelete-card .athelete-profile-view img {
    height: 12rem;
    width: 12rem;
}
</style>

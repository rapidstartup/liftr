<template>
  <div class="athelete-card">
    <div class="athelete-card-header">
      <h4 class="mb-0">Attendence</h4>
    </div>
    <div class="d-flex justify-content-evenly">
      <div class="athelete-card-body w-100">
        <div class="form-data">
          <span>Last Checkin :</span>
          {{ selectClient?.last_checkin }}
        </div>
        <div class="form-data">
          <span>Lifetime Checkins :</span>
        </div>
        <div class="form-data">
          <span>Streak :</span>
          
        </div>
        <div class="form-data mb-5">
          <span>30 Day Average :</span>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectClient: null,
    };
  },
  mounted() {
    this.selectClient = this.$store.state.auth.user.data;
  },
};
</script>
<style scoped>
.athelete-card {
    border-color: #15e7fb;
}
</style>

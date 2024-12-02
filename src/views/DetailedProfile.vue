<template>
  <div class="client-dashboard">
    <header-view />
    <!-- <nav class="client-dashboard-header with__edit">
      <div
        class="client-dashboard-header-navs client-dashboard-header__with__edit"
      >
        <span><i class="fa-solid fa-user"></i></span><span> User Information</span>
      </div>
    </nav> -->
    <section class="client-dashboard-body my-2" v-if="userInfo.name">
      <div class="client-dashboard-body-content">
        <figure class="profile-card">
          <div class="profile-image">
            <i class="fa-solid fa-user"></i>
          </div>
          <figcaption>
            <h2>{{userInfo.name}}</h2>
            <h4><em>{{userInfo.email}}</em></h4><br>
            <h6><strong>Client Id : </strong>{{userInfo.client_id}}</h6>
            <!-- <h6><strong>Last Updated At : </strong>{{userInfo.updated_at | getCompleteDate}}</h6>
            <h6><strong>Created At : </strong>{{userInfo.created_at | getCompleteDate}}</h6> -->
          </figcaption>
        </figure>
      </div>
    </section>
  </div>
</template>

<script>
import moment from "moment";
import HeaderView from "../components/Common/HeaderView.vue";
export default {
  components: { HeaderView },
  mounted() {
    this.userInfo = this.$store.state.auth.user.data;
  },
  filters: {
        getCompleteDate: function (value) {
            if (!value) return "";
            value = value.toString();
            return moment(value).format("MM-DD-YYYY HH:mm");
        },
  },
  data() {
    return {
      userInfo: {
        client_id: null,
        created_at: null,
        email: null,
        name: null,
        updated_at: null,
      },
    };
  },
};
</script>

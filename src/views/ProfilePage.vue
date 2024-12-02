<template>
  <div class="client-dashboard">
    <header-view />
    <section class="client-dashboard-body my-2">
      <div class="d-flex w-100">
        <div class="d-flex flex-column w-40">
          <div class="m-4"><client-details @update="fileUpload" :profileInfo="profileData" :shortView="true" /></div>
          <div class="m-4"><attendance-info></attendance-info> </div>
        </div>
        <div class="d-flex flex-column w-60">
          <div class="m-4" v-if="profileData"><athelete-bio @update="updateProfile" :profileInfo="profileData"></athelete-bio> </div>
          <div class="m-4">
            <div class="client-card">
              <div class="d-flex align-items-center">
                <div class="card-title-icon">
                  <div><i class="fa-solid fa-moon" color='#808080' style="font-size: 1.8rem;"></i></div>
                  <div class="profile-card-title">Dark Mode</div>
                </div>
                <div class="ml-5 mt-2"><toggle-button :width="40" @change="toggleTheme" :value="theme === 'darkMode'  ?  true : false" aria-label="Toggle themes"/></div>
              </div>
              <div class="client-workout-card-button"  @click="logout"><button class="px-5">Log Out</button></div>
            </div>
          </div>
          
        </div>
      </div>
      <div class="client-dashboard-body-content"  v-if="false" >
        <div class="client-card profile-card-header" @click="redirectToProfile">
          <div class="card-title-icon">
            <div class="profile-card-icon">AS</div>
            <div class="profile-card-title">{{userInfo.name}}</div>
          </div>
          <div class="right-arrow-icon"><i class="fa-solid fa-angle-right"></i></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import HeaderView from "../components/Common/HeaderView.vue";
import ClientDetails from "../components/Common/ClientDetails.vue"
import AttendanceInfo from "../components/Common/AttendanceInfo.vue"
import AtheleteBio from "../components/Common/AtheleteBio.vue";
export default {
  components: { HeaderView, ClientDetails, AttendanceInfo, AtheleteBio },
  mounted() {
    this.theme = localStorage.getItem('theme')
    this.userInfo = this.$store.state.auth.user.data;
    this.getProfile();
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
      theme: '',
      userInfo: {
        client_id: null,
        created_at: null,
        email: null,
        name: null,
        updated_at: null,
      },
      profileData: null
    };
  },
  methods: {
    async logout() {
      await this.$store.dispatch("LogOut");
      this.$router.push("/login");
    },
    toggleTheme() {
      console.log(this.theme)
      this.theme = this.theme == 'darkMode' ? '' : 'darkMode'; //toggles theme value
      document.documentElement.setAttribute('data-theme', this.theme); // sets the data-theme attribute
      localStorage.setItem('theme', this.theme); // stores theme value on local storage
    },
    redirectToProfile() {
       this.$router.push(`/profile-detail`);
    },
    async getProfile() {
      try {
          const profile = await axios.get('/gym-schedule/client/profile');
          console.log(profile)
          this.profileData = profile.data.data;
          await this.$store.dispatch("SetUser", {data : {...this.userInfo, ...this.profileData}});
      }
      catch(err) {
          console.log(err)
      }
    },
    async fileUpload(event) {
      try {
          const formdata = new FormData();
          formdata.append('profile', event.target.files[0]);
          Object.keys(this.profileData).forEach(key => {
            formdata.append(key, this.profileData[key]);
          });
          const result = await axios.post('/gym-schedule/client/profile/update', formdata);
          this.getProfile();
          window.toastr.success(result.data.message, null, {timeOut: 2000, positionClass: 'toast-bottom-center'});
      }
      catch(err) {
          console.log(err)
      }
    },
    async updateProfile(profile) {
      try {
          const result = await axios.post('/gym-schedule/client/profile/update', profile);
          this.getProfile();
          window.toastr.success(result.data.message, null, {timeOut: 2000, positionClass: 'toast-bottom-center'});
      }
      catch(err) {
          console.log(err)
      }
    }
  },
};
</script>

<style scoped>
.w-40 {
  width: 40%
}
.w-60 {
  width: 60%
}
</style>

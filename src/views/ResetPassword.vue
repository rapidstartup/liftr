<template>
<div class="main-container d-flex justify-content-center align-items-center">
<div class="container reset-container" id="container">
	<div class="form-container reset-password-container">
		<form  @submit.prevent="submit">
			<h3 class="signin-head mb-4">Reset Password</h3>
			<input type="password" placeholder="Password" v-model="form.password" :class="{'invalid-input': isSubmitted && form.password==''}"/>
      <span class="error" v-if="isSubmitted && form.password==''">Password is Required</span>
			<input type="password" placeholder="Confirm Password" v-model="form.cpassword" :class="{'invalid-input': isSubmitted && form.cpassword==''}"/>
      <span class="error" v-if="isSubmitted && form.cpassword==''">Confirm Password is Required</span>
			<button class="mt-4">Update Password</button>
		</form>
	</div>
</div>
</div>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    form: {
        cpassword: "",
        password: "",
      },
    isSubmitted: false
  }),
  methods: {
    async submit() {
      try {
          this.isSubmitted = true;
          if(this.form.password === '' || this.form.cpassword === '') {
            return;
          }
          const result = await axios.post('/gym-schedule/client/forgot-password/reset-password', {
              new_password : this.form.password, 
              confirm_password : this.form.cpassword,
              token: this.$route.query.token
          });
          if(result){
            window.toastr.success(result.data.message, null, {timeOut: 2000, positionClass: 'toast-bottom-center'});
            this.$router.push("/login");
          }
          this.showError = false
      } catch (error) {
        this.showError = true
      }
    },
  },

};
</script>


<style scoped>
@import url("../login.css");
</style>
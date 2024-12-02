<template>
<div class="main-container d-flex justify-content-center align-items-center">
<div class="container" id="container">
	<div class="form-container sign-in-container">
		<form  @submit.prevent="submit">
			<h3 class="signin-head mb-4">Forget Password</h3>
			<input type="email" placeholder="Email" v-model="form.email" :class="{'invalid-input': isSubmitted && form.email==''}"/>
      <span class="error" v-if="isSubmitted && form.email==''">Email is Required</span>
			<button class="my-2">Send Reset Password Link</button>
      <a @click="navigateTo()">Back to Login?</a>
		</form>
	</div>
	<div class="overlay-container">
		<div class="overlay">
			<div class="overlay-panel overlay-right">
				<h3>Liftr Client</h3>
				<p>Enter your personal details and start journey with Us</p>
			</div>
		</div>
	</div>
</div>
</div>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    form: {
        email: ""
    },
    isSubmitted: false
  }),
  methods: {
    navigateTo() {
      this.$router.push("/login");
    },
    async submit() {
      try {
          this.isSubmitted = true;
          if(this.form.email === '') {
            return;
          }
          const result = await axios.post('/gym-schedule/client/forgot-password/reset-link', {
              email : this.form.email, 
          });
          if(result){
            window.toastr.success(result.data.message, null, {timeOut: 2000, positionClass: 'toast-bottom-center'});
            this.$router.push("/login");
          }
          this.showError = false
      } catch (error) {
        console.log('errr', error)
        window.toastr.error(error.response.data.message, null, {timeOut: 1000, positionClass: 'toast-bottom-center'});
       
        this.showError = true
      }
    },
  },

};
</script>


<style scoped>
@import url("../login.css");
</style>
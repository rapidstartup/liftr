<template>
<div class="main-container d-flex justify-content-center align-items-center">
<div class="container" id="container">
	<div class="form-container sign-in-container">
		<form  @submit.prevent="submit">
      <img src="@/assets/logo.png" width="50" class="signin-icon">
			<h3 class="signin-head">Sign In</h3>
			<span>or Use your account</span>
			<input type="email" placeholder="Email" v-model="form.email" :class="{'invalid-input': isSubmitted && form.email==''}"/>
      <span class="error" v-if="isSubmitted && form.email==''">Email is Required</span>
			<input type="password" placeholder="Password" v-model="form.password" :class="{'invalid-input': isSubmitted && form.password==''}"/>
      <span class="error" v-if="isSubmitted && form.password==''">Password is Required</span>
			<a @click="navigateTo()">Forgot your password?</a>
			<button>Sign In</button>
		</form>
	</div>
	<div class="overlay-container">
		<div class="overlay">
			<div class="overlay-panel overlay-right">
        <img src="@/assets/logo.png" width="250">
				<h3>Liftr</h3>
				<p>Enter your personal details and start journey with Us</p>
			</div>
		</div>
	</div>
</div>
</div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    form: {
        email: "",
        password: "",
      },
    isSubmitted: false
  }),
  methods: {
    ...mapActions(["LogIn", "getAssignedClass"]),
    navigateTo() {
      this.$router.push("/forget-password");
    },
    async submit() {
      try {
          this.isSubmitted = true;
          if(this.form.email === '' || this.form.password === '') {
            return;
          }
          await this.LogIn(this.form);
          await this.getAssignedClass();
          this.$router.push("/workout-dashboard");
          this.showError = false
      } catch (error) {
        console.log(error)
        this.showError = true
      }
    },
  },

};
</script>


<style scoped>
@import url("../login.css");
</style>
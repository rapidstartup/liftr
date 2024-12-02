<template>
    <div class="client-dashboard">
        <header-view />
        <div class="d-flex w-100">
            <div class="left-section mx-4">
                <client-details />
            </div>
            <div class="right-section mx-4">
                <nav class="client-dashboard-header">
                    <div class="client-dashboard-header-navs">
                        <a :class="activeTab=='upcoming' ? 'active-tab' :''" @click="getAssignedWorkout('upcoming');activeTab='upcoming'">Upcoming Workout</a>
                        <a :class="activeTab=='past' ? 'active-tab' :''" @click="getAssignedWorkout('past');activeTab='past'">Past Workout</a>
                    </div>
                </nav>
                <section class="class-selection p-4"> 
                    <div class="workout-class d-flex align-items-center">
                        Programs: 
                        <select class="form-control ml-2" @change="changeClass($event)">
                        <option v-for="workoutClass in classes" :value="workoutClass.class.id+'$$$'+workoutClass.class.coach.coach_id" :key="workoutClass.id">{{workoutClass.class.name +" with "+ workoutClass.class.coach.name }}</option>
                        <option v-if="classes.length" value="all">All</option>
                        </select>
                    </div>
                </section>
                <section class="client-dashboard-body h-60vh" v-if="activeTab=='upcoming'">
                    <div class="client-dashboard-body-content">
                        <workout-cards class="mt-4 p-4" v-for="data in workoutInfo" :key="data.id" :workout="data" @update="redirectToDashboard(data.id, 'upcoming', )" />
                    </div>
                </section>
                <section class="client-dashboard-body h-60vh" v-if="activeTab=='past'">
                    <div class="client-dashboard-body-content">
                        <workout-cards class="mt-4 p-4" v-for="data in workoutInfo" :key="data.id" :workout="data" @update="redirectToDashboard(data.id, 'past', )"/>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderView from '../components/Common/HeaderView.vue';
import WorkoutCards from '../components/Client/WorkoutCards.vue';
import ClientDetails from "../components/Common/ClientDetails.vue"
import axios from "axios";
export default {
    components: { WorkoutCards, HeaderView, ClientDetails },
    mounted() {
        console.log('Component mounted.');
        this.getClasses();
    },
    data() {
        return {
            activeTab: 'upcoming',
            workoutInfo: [],
            classes: [],
            coachId: null
        }
    },
    methods : {
        redirectToDashboard(id, type) {
            this.$router.push(`/workout-dashboard/${type}/${this.classId}/update/${id}/${this.coachId}`);
        },

        changeClass(event){
            [this.classId, this.coachId] = event.target.value.split('$$$');
            console.log(event.target.value.split('$$$'))
            this.getAssignedWorkout(this.activeTab);  
        },

        async getClasses() {
            try {
                this.classes = [];
                const classes = await axios.get('/gym-schedule/client/assigned/class');
                this.classes = [...classes.data.data];
                if(this.classes.length) {
                    this.classId = this.classes[0].class.id;
                    this.coachId = this.classes[0].class.coach.coach_id;
                    this.getAssignedWorkout('upcoming');  
                }
            }
            catch(err) {
                console.log(err)
            }
        },

        async getAssignedWorkout(type) {
            try {
                this.workoutInfo = [];
                const key = this.classId === 'all' ? 'action' : 'program_class_id'
                const workouts = await axios.post('/gym-schedule/client/workout/assigned', {
                    key : type, 
                    [key]: this.classId
                });
                this.workoutInfo = workouts.data.data;
                console.log(this.workoutInfo)
            }
            catch(err) {
                console.log(err)
            }
        }
    }
    
}
</script>

<style scoped>
</style>
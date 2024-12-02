<template>
    <div class="client-dashboard">
        <header-view />
        <div class="d-flex w-100">
            <div class="mx-4 w-100">
                <nav class="client-dashboard-header">
                    <div class="client-dashboard-header-navs w-100">
                        <h3 class="mb-0">Performance</h3>
                        <a :class="activeTab=='rmax' ? 'active-tab' :''" @click="getPerformance('rmax');activeTab='rmax'">1 Rep Max</a>
                        <a :class="activeTab=='benchmark' ? 'active-tab' :''" @click="getPerformance('benchmark');activeTab='benchmark'">Workouts</a>
                        <div class="profile">
                            <img :src="selectClient?.profile_image" alt="profile-pic" height="46" class="mr-3" />
                            {{ selectClient?.name }}
                        </div>
                    </div>
                </nav>
                <section class="client-dashboard-body" >
                    <div v-if="selected">
                        <div class="tabs-list d-flex">
                            <div class="tabs" :class="{'active': selected?.id === tab.id }" v-for="tab in performanceList" 
                                :key="tab.id" @click="onSelect(tab)">{{tab.name}}</div>
                        </div>
                        <div class="tab-detail-container">
                            <div class="position-relative search-input-chat w-300 ml-4 mt-4">
                                <input type="search" placeholder="Search" class="w-100" v-model="search">
                                <span class="search-icon"><i class="fa-solid fa-search"></i></span>
                            </div>
                            <div class="mt-4 tab-data-item-list">
                                <performance-input @refresh="getPerformance(activeTab, true);" :idx="i" :type="activeTab" :performanceData="item" v-for="(item, i) in filteredList" :key="item.id"></performance-input>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderView from '../components/Common/HeaderView.vue';
import axios from "axios";
import PerformanceInput from '../components/Common/PerformanceInput.vue';
export default {
    components: { HeaderView, PerformanceInput },
    mounted() {
        console.log('Component mounted.');
        this.selectClient = this.$store.state.auth.user.data;
        this.getPerformance('rmax');
    },
    data() {
        return {
            activeTab: 'rmax',
            workoutInfo: [],
            performanceList: [],
            selectClient: null,
            selected: null,
            search: "",
            prevSelected: null,
            timer: null
        }
    },
    computed:  {
        filteredList() {
            return (this.selected.rmax_exercises || this.selected.workouts || []).filter(val => (val.name).toLowerCase().includes(this.search.toLowerCase()))
        }
    },
    methods : {
        onSelect(tab) {
            if (this.activeTab === 'rmax') {
                this.selected = {...tab, workouts: tab.rmax_exercises.slice(0, 10)};
            } else {
                this.selected = {...tab, workouts: tab.workouts.slice(0, 10)};
            }

            this.search = '';
            clearTimeout(this.timer);

            let startIndex = 10;
            const incrementSize = 10; 
            const maxItems = this.activeTab === 'rmax' ? tab.rmax_exercises.length : tab.workouts.length;
            
            const loadMoreData = () => {
                if (startIndex >= maxItems) {
                    return;
                }

                const nextSlice = this.activeTab === 'rmax' 
                    ? tab.rmax_exercises.slice(startIndex, startIndex + incrementSize) 
                    : tab.workouts.slice(startIndex, startIndex + incrementSize);
                
                this.selected.workouts.push(...nextSlice);

                startIndex += incrementSize;

                this.timer = setTimeout(loadMoreData, 50);
            };
            loadMoreData();
        },
        async getPerformance(slug, isrefresh) {
            try {
                this.prevSelected = {...this.selected};
                
                if(!isrefresh) {
                    this.selected = null;
                    this.search = "";
                    this.performanceList = [];
                }
                
                const performanceList = await axios.get('/gym-schedule/client/performance/get/'+slug);
                this.performanceList = [...performanceList.data.data];
                if (this.performanceList.length) {
                    if(!isrefresh) {
                        this.selected = this.performanceList[0];
                    }
                    else {
                        this.selected = {...this.prevSelected};
                    }
                }
                console.log(this.selected)
            }
            catch(err) {
                console.log(err)
            }
        },
    }
    
}
</script>

<style scoped>
</style>
<template>
  <div  v-if="item">
    <div class="tab-data-item d-flex">
        <div class="rmax_exercises" @click="selectedIndex = (selectedIndex != null || selectedIndex != undefined) ? null : idx;getDetail(item.id);">
            {{item.name}}
            <i class="fa-solid fa-chevron-down"></i>
        </div>
        <div class="d-flex details" v-for="input in (item.exercise_details || item.workout_details)" :key="input.id">
            <div class="d-flex">
                <div class="label-type px-2">{{input.name}}</div>
                <input type="text" v-model="input.value" :readonly="!isEdit" ref="input">
            </div>
        </div>
        <div class="edit-save" @click="onEdit()">
            <span :class="{'d-none': !isEdit}">
                <i class="fa-solid fa-check-circle"></i>
            </span>
            <span :class="{'d-none': isEdit}">
                <i class="fa-solid fa-pencil"></i>
            </span>
        </div>
    </div>
    <div class="detail-progress" v-for="(info, i) in data" :key="i">
        <div v-if="idx === selectedIndex" class="mx-4 my-3">
            <h6> {{info.name}} - </h6>
            <div  v-for="(nested, j) in info.performance" :key="j">
                {{nested.date}} - {{nested.value}}
            </div>
        </div>
    </div>
</div>
</template>
<script>
import axios from "axios";
export default {
  props: ["performanceData", "type", "idx"],
  data() {
    return {
      isEdit: false,
      item: null,
      selectedIndex: null,
      data: []
    };
  },
  mounted() {
    this.item = {...this.performanceData};
  },
//   watch: {
//     performanceData(val) {
//       console.log(val)
//       if(val) {
//         this.item = val;
//       }
//     }
//   },
  methods: {
    onEdit() {
        this.isEdit = !this.isEdit;
        this.$refs.input[0].focus();
        if (!this.isEdit) {
            console.log(this.$refs)
            this.$refs.input.forEach((val, i) => {
                if(this.$refs.input[i].value) {
                    this.onSave(i);
                }
            })
        }
    },
    async getDetail(id) {
        console.log(id, this.selectedIndex)
        if(this.selectedIndex == null || this.selectedIndex == undefined) {
            return;
        }
        try {
            const result = await axios.get(`/gym-schedule/client/performance/history/${this.type}/${id}`);
            this.data = result.data.data;
            // window.toastr.success(result.data.message, null, {timeOut: 2000, positionClass: 'toast-bottom-center'});
        }
        catch (error) {
            window.toastr.error(error.response.data.message, null, {timeOut: 1000, positionClass: 'toast-bottom-center'});
        }
    },
    async onSave(i) {
        try {
            const result = await axios.post('/gym-schedule/client/performance/store', {
                performance_id: this.type === 'rmax' ? this.item.exercise_details[i].id : this.item.workout_details[i].id,
                value: this.$refs.input[i].value,
                type: this.type,
            });
            console.log(result)
            // window.toastr.success(result.data.message, null, {timeOut: 2000, positionClass: 'toast-bottom-center'});
            this.$emit("refresh");
        }
        catch (error) {
            console.log(error)
            window.toastr.error(error.response.data.message, null, {timeOut: 1000, positionClass: 'toast-bottom-center'});
        }
    }
  }
};
</script>


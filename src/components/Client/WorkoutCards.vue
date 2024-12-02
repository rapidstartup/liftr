<template>
  <div
    class="client-workout-card"
  >
    <div class="client-workout-card-date" :class="{'active-border': todayDate === workout.date }">
        <div class="card-workout-head-today" v-if="todayDate === workout.date">Today</div>
        <div class="card-workout-head-detailed-date">
            <div class="card-workout-head-date">{{ workout.date | getMonth}}</div>
            <div class="card-workout-head-month">{{ workout.date | getDate }}</div>
        </div>
    </div>
    <div class="client-workout-card-body">
        <div class="client-workout-card-body__btndate">
            <div>
                <div class="client-workout-card__date">{{ workout.date | getCompleteDate }}</div>
                <div class="client-workout-card__title">{{ workout.title }}</div>
            </div>
            <div class="client-workout-card-button"><button @click="$emit('update')">View Workout Results</button></div>
        </div>
        <span class="tag tag--green mb-3" v-if="workout.status">
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false" aria-hidden="true" data-icon="check-circle" data-prefix="fas" id="ember122" class="svg-inline--fa fa-check-circle fa-w-16 ember-view mr-1"><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
            </svg>
            {{workout.status}}
        </span>
        <div class="client-workout-card__info py-2">
            <li class="client-workout-card__info_list mt-2" v-for="(data, index) in workout.workout" :key="index">
                <span class="index">{{ String.fromCharCode(index + 65) }}</span><span class="workout-card-head">{{ data.title }}</span>
            </li>
        </div>
         <div class="client-workout-card__comments py-2" v-if="workout.comments && workout.comments.length">
            <li class="client-workout-card__info_list mt-2" v-for="(data, i) in workout.comments" :key="i">
                <span class="index">{{ data.initials }}</span>
                <span class="workout-card-comment_head pl-2"><span>{{ data.name }}</span> <div class="pt-2">{{ data.comment }}</div></span>
                <span class="workout-card-comment_day pl-2">{{ data.date | getRelativeTime }}</span>
            </li>
        </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
    props: ["workout"],
    data() {
        return {
            todayDate: moment().format("YYYY-MM-DD"),
        }
    },
    filters: {
        getMonth: function (value) {
            if (!value) return "";
            value = value.toString();
            return moment(value).format("MMM");
        },
        getDate: function (value) {
            if (!value) return "";
            value = value.toString();
            return moment(value).format("DD");
        },
        getCompleteDate: function (value) {
            if (!value) return "";
            value = value.toString();
            return moment(value).format("dddd, MMMM Do");
        },
        getRelativeTime: function (value) {
            if (!value) return "";
            value = value.toString();
            return moment(value).startOf('day').fromNow();
        },
    },
}
</script>

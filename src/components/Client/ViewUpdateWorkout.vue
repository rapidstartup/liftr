<template>
  <div class="client-dashboard">
    <header-view />
    <div class="d-flex w-100">
      <div class="left-section mx-4">
          <client-details />
      </div>
      <div class="right-section mx-4">
        <nav class="client-dashboard-header update-workout">
          <div
            class="client-dashboard-header-navs client-dashboard-header__with__edit d-flex align-items-center justify-content-evenly"
          >
            <a class="px-2">Log Results</a>
            <!-- <span class="d-flex align-items-center">
              <span><i class="fa-solid fa-calendar"></i></span
              ><span> {{ data.date | getCompleteDate }}</span>
            </span> -->
            <div class="workout-class workout-dropdown">
              <select
                class="form-control"
                v-model="selectedWorkoutId"
                @change="changeWorkout($event)"
              >
                <option v-for="item in workoutInfo" :value="item.id" :key="item.id">
                  {{ item.date | getCompleteDate }} - {{ item.title }}
                </option>
              </select>
            </div>
          </div>
        </nav>
        <section class="client-dashboard-body">
          <div class="client-dashboard-body-content">
            <div>
              <div class="font-weight-bold h2 m-4">{{ data.title }}</div>
              <div class="view-update-workout-card" v-if="data.title">
                <div
                  class="view-update-workout-card__detail p-4"
                  v-for="(workout, index) in data.workout"
                  :key="workout.id"
                >
                  <li class="client-workout-card__info_list">
                    <span class="index">{{ String.fromCharCode(index + 65) }}</span>
                  </li>
                  <div class="view-update-content">
                    <!-- <div v-if="workout.result.time">
                      Recorded Time : {{ workout.result.time }}
                    </div>
                    <div v-if="workout.result.reps !== null">
                      Recorded Reps : {{ workout.result.reps }}
                    </div>
                    <div v-if="workout.result.rounds !== null">
                      Recorded Rounds : {{ workout.result.rounds }}
                    </div> -->
                    <div>
                      <table>
                        <th colspan="3">
                          <div
                            class="view-update-content-head justify-content-between flex-wrap py-1"
                          >
                            <span class="h5 font-weight-bold">{{ workout.title }}</span>
                          </div>
                        </th>
                        <th>
                          <h6 class="font-weight-bold ml-4" v-if="!workout.description">Results</h6>
                        </th>
                        <tr v-for="detail in workout.workout_detail" :key="detail.id">
                          <td>
                            <span class="pr-3">{{detail.rep}}</span>
                            <span>X</span>
                            <span class="px-3">{{detail.set}}</span>
                          </td>
                          <td>
                            <span class="px-3">@{{detail.percentage}}%</span>
                          </td>
                          <td>
                            <span class="px-3 load-text">{{detail.load}}</span>
                          </td>
                          <td>
                            <div class="d-flex measurement-item p-1 ml-4" v-for="(input, indx) in workout.measurement" :key="input.id">
                                <div class="label-type px-2">{{ input.name }}</div>
                                <input type="text" :ref="'measure_'+index" v-if="detail.result_detail.length && detail.result_detail[indx]" 
                                   v-model="detail.result_detail[indx].value">
                                <input type="text" :ref="'measure_'+index" v-else >
                            </div>
                          </td>
                        </tr>
                      </table>
                      <div class="workout-description d-flex align-items-end" v-if="workout.description">
                        <div>{{ workout.description }}</div>
                        <div class="d-flex measurement-item p-1 ml-5 pl-5" v-for="(input, wi) in workout.measurement" :key="input.id">
                              <div class="label-type px-2">{{ input.name }}</div>
                              <input type="text" :ref="'measureW_'+index" v-if="workout.result && workout.result.result_detail && workout.result.result_detail.length && workout.result.result_detail[wi]" 
                                 v-model="workout.result.result_detail[wi].value">
                              <input type="text" :ref="'measureW_'+index" v-else >
                          </div>
                        </div>
                    </div>
                    <div
                      class="p-2 d-flex justify-centent-between workout-checkbox"
                    >
                      <!-- <a
                        ><i class="fa-solid fa-calendar-check"></i> View Excercise
                        History</a
                      > -->
                      <div></div>
                      <div> RX <toggle-button :width="40" v-model="workout.result.pr" aria-label="Toggle themes"/> SC</div>
                      <!-- <label>
                        <input
                          class="workout-checkbox"
                          type="checkbox"
                          name="pr"
                          id="pr-id"
                          v-model="workout.result.pr"
                        />
                        <span></span> PR &nbsp;&nbsp;&nbsp;
                      </label> -->
                      
                    </div>
                    <div
                      v-for="img in workout.result.result_asset"
                      :key="img.id"
                      class="mb-4"
                    >
                      <img :src="baseUrl + img.link" width="250" />
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-danger flex-start ml-2"
                        @click="deleteImage(img.id)"
                      >
                        Delete Image
                      </button>
                    </div>
                    <input
                      ref="uploader"
                      class="d-none"
                      type="file"
                      id="files"
                      accept="image/*"
                      @change="onFileChanged($event, index)"
                    />
                    <div class="textarea-icon">
                      <div @click="clickFileListener(index)">
                        <i class="fa-solid fa-camera"></i>
                      </div>
                      <textarea
                        class="form-control"
                        id="comment"
                        aria-describedby="comment"
                        v-model="workout.result.comment"
                        placeholder="Enter Results"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div class="finish-workout mx-4 d-flex justify-content-end">
                  <button
                    type="button"
                    class="px-2 btn btn-primary btn-md px-5 font-weight-bold"
                    @click="updateWorkout()"
                  >
                    Update Workout
                  </button>
                </div>
                <!-- <div class="show-comments my-4 py-4">
                  <div
                    v-for="comment in commentList"
                    :key="comment.id"
                    class="pt-2"
                  >
                    <li class="client-workout-card__info_list">
                      <span class="index">{{
                        comment.from
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      }}</span
                      ><strong class="from-name">
                      {{ comment.from }} </strong
                      > 
                      <span class="ml-3 create_date">{{comment.created_at | mmmmDDYYYY }}</span>
                      
                    </li>
                    <span class="comment__text">{{ comment.comment }}</span>
                  </div>
                </div>
                <div class="commment_area py-2">
                  <textarea
                    class="form-control"
                    id="comment"
                    rows="4"
                    v-model="comment"
                    aria-describedby="comment"
                    placeholder="Ask a question or comment on this workout"
                  ></textarea>
                  <div class="d-flex justify-content-between pt-3">
                    <div>
                      <button class="pr-4 btn-icon">
                        <i class="fa-solid fa-camera"></i>
                      </button>
                      <button class="btn-icon">
                        <i class="fa-regular fa-face-smile"></i>
                      </button>
                    </div>
                    <button
                      type="button"
                      class="px-2 btn btn-primary btn-sm"
                      @click="addComments"
                    >
                      Send
                    </button>
                  </div>
                </div> -->
                <div class="loader text-center py-4" :class="roomLoader == true ? 'show' : 'd-none'">
                    <i class="fa fa-spinner fa-spin" aria-hidden="true" style="font-size:30px"></i>
                </div>
                <div>
                  <message-send class="mx-4" v-if="activeChatRoom !== null && activeChatRoom !== undefined" :room="activeChatRoom"></message-send>
                  <div class="show-comments my-4 py-4" v-if="messages.length">
                    <div
                      v-for="message in messages"
                      :key="message.id"
                      class="pt-2 d-flex flex-column text_msg_row" 
                      :class="((message.senderId == clientId) ? 'align-items-end' : 'align-items-start')">
                      <li class="client-workout-card__info_list"  v-if="message.senderId !== clientId">
                        <span class="index">{{
                          message.senderName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        }}</span>
                        <strong class="from-name"> {{ message.senderName }} </strong>
                      </li>
                      <span class="comment__text msg" :class="((message.senderId == clientId) ? 'me' : 'them')" v-if="message.contentType === 'text'" v-html="message.content"></span>
                      <span class="comment__text msg" :class="((message.senderId == clientId) ? 'me' : 'them')" v-if="message.contentType === 'image'">
                        <div class="d-flex flex-column">
                          <a v-on:click.prevent="openImage(message.image)"><i class="fa fa-camera mx-3" area-hidden="true" style="font-size:30px;"></i></a>
                          <span v-html="message.content"></span>
                        </div>
                      </span>
                      <div class="time_stamp" :class="((message.senderId == clientId) ? 'me' : 'them')">{{message.createdAt | formatChatTimeStamp}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div
          class="modal fade"
          id="recordModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          data-backdrop="static"
          data-keyboard="false"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">{{ title }}</h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="form-group" v-if="title === 'Record Reps Count'">
                    <label for="recipient-name" class="col-form-label"
                      >Reps Count :</label
                    >
                    <input
                      type="number"
                      v-model="reps"
                      class="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div class="form-group" v-if="title === 'Record Round'">
                    <label for="recipient-name" class="col-form-label"
                      >Reps Round :</label
                    >
                    <input
                      type="number"
                      v-model="rounds"
                      class="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div class="form-group" v-if="title === 'Record Workout Time'">
                    <label for="message-text" class="col-form-label"
                      >Workout Time (in HH:MM:SS:mm) :</label
                    >
                    <div class="d-flex align-items-center mt-2">
                      <input
                        type="number"
                        v-model="time.HH"
                        min="0"
                        max="24"
                        class="form-control mx-2"
                        placeholder="HH"
                      />
                      :
                      <input
                        type="number"
                        v-model="time.MM"
                        min="0"
                        max="60"
                        class="form-control mx-2"
                        placeholder="MM"
                      />
                      :
                      <input
                        type="number"
                        v-model="time.SS"
                        min="0"
                        max="60"
                        class="form-control mx-2"
                        placeholder="SS"
                      />
                      :
                      <input
                        type="number"
                        v-model="time.mm"
                        min="0"
                        max="60"
                        class="form-control mx-2"
                        placeholder="mm"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-dismiss="modal"
                  @click="closeDialog()"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import HeaderView from "../Common/HeaderView.vue";
import ClientDetails from "../Common/ClientDetails.vue";
import DataService from "../../services/DataService";
import MessageSend from "../chat/MessageSend.vue";
import axios from "axios";
export default {
  components: { HeaderView, ClientDetails, MessageSend },
  filters: {
    getCompleteDate: function (value) {
      if (!value) return "";
      value = value.toString();
      return moment(value).format("ddd, MMMM Do");
    },
    mmmmDDYYYY: function (value) {
      if (!value) return "";
      value = value.toString();
      return moment(value).format("MMMM DD, YYYY");
    },
  },
  data() {
    return {
      indexVal: null,
      time: {
        HH: 0,
        MM: 0,
        SS: 0,
        mm: 0,
      },
      reps: 0,
      rounds: 1,
      title: "",
      data: {},
      result: [],
      baseUrl: "https://gym.therepconnect.co/",
      image: {},
      status: {},
      workoutInfo: [],
      selectedWorkoutId: null,
      comment: "",
      commentList: [],
      messages: [],
      activeChatRoom: {},
      roomLoader: true,
      coachId: this.$route.params.coachId,
      clientId: this.$store.state.auth.user.data.client_id
    };
  },
  mounted() {
    const id = this.$route.params.id;
    const type = this.$route.params.type;
    const classId = this.$route.params.classId;
    this.getAssignedWorkout(type, classId);

    this.getWorkoutDetails(id);
    // this.getComments();
    this.initializeChat();
    this.roomLoader = false;
  },
  methods: {
    openImage(fileName){
      let path = this.imgBaseUrl + "storage/chat/attachment/" + fileName;
      window.open(path, 'chart', 'width=1225, height=770') 
    },

    initializeChat() {  
      console.log(this.clientId, this.coachId)    
      if (this.clientId) {
        let messageNode = `${this.clientId}_${this.coachId}`;
        DataService.getRef("/messages/" + messageNode).on("value", this.onDataChanged);
      }
    },

    onDataChanged(snapshot) {
      this.setActiveChatRoom();

      const messages = snapshot.val();
      this.messages = messages ? 
        Object.keys(messages).map(key => ({ id: key, ...messages[key] }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sorting by date
        : [];
    },

    setActiveChatRoom() {
      this.activeChatRoom = {
        clientId: this.clientId,
        coachId: this.coachId,
        content: "hello",
        fbId: `clientId${this.clientId}_coachId${this.coachId}`,
        id: this.clientId,
        name: "ars c",
        programId: "",
        timeStamp: Date.now(),
        type: "user",
        unreadCount: 0,
      };
    },
    closeDialog() {
      const index = this.indexVal;
      if (this.title === "Record Reps Count") {
        this.reps = this.reps < 0 ? 0 : this.reps;
        this.data.workout[index]["result"]["reps"] = this.reps;
      } else if (this.title === "Record Round") {
        this.rounds = this.rounds < 0 ? 0 : this.rounds;
        this.data.workout[index]["result"]["rounds"] = this.rounds;
      } else {
        this.time.HH = this.time.HH < 0 ? 0 : this.time.HH;
        this.time.MM = this.time.MM < 0 ? 0 : this.time.MM;
        this.time.SS = this.time.SS < 0 ? 0 : this.time.SS;
        this.time.mm = this.time.mm < 0 ? 0 : this.time.mm;
        this.data.workout[index]["result"]["time"] =
          `0${this.time.HH}`.slice(-2) +
          ":" +
          `:0${this.time.MM}`.slice(-2) +
          ":" +
          `0${this.time.SS}`.slice(-2) +
          ":" +
          `:0${this.time.mm}`.slice(-2);
      }
    },
    changeWorkout(event) {
      const type = this.$route.params.type;
      const classId = this.$route.params.classId;
      const id = event.target.value;
      this.$router.push(`/workout-dashboard/${type}/${classId}/update/${id}/${this.coachId}`);
      this.selectedWorkoutId = id;
      this.getWorkoutDetails(id);
      this.getComments();
    },
    async getWorkoutDetails(id) {
      try {
        const data = await axios.get(
          "/gym-schedule/client/workout/assigned/" + id
        );
        this.result = [];
        let response = data.data.data;
        response.workout.forEach((element) => {
          if (!element.result) {
            element.result = {
              workout_id: element.id,
              status: 0,
              result_asset: [],
              comment: "",
            };
          }
          element.showStatusUpdate = false;
          // element.workout_detail.forEach(val => {
          //   val.result_detail.push({
          //     key: 
          //   })
          // })
        });
        this.data = response;
      } catch (err) {
        console.log(err);
      }
    },

    async deleteImage(id) {
      await axios.get("/gym-schedule/client/workout/result/asset/delete/" + id);
      this.getWorkoutDetails(this.$route.params.id);
    },

    clickFileListener(index) {
      this.$refs.uploader[index].click();
    },

    onFileChanged(event, index) {
      this.image[index] = event.target.files[0];
      this.updateWorkout();
    },

    async getAssignedWorkout(type, classId) {
      try {
        this.workoutInfo = [];
        this.selectedWorkoutId = this.$route.params.id;
        const key = classId === "all" ? "action" : "program_class_id";
        const workouts = await axios.post(
          "/gym-schedule/client/workout/assigned",
          {
            key: type,
            [key]: classId,
          }
        );
        this.workoutInfo = workouts.data.data;
      } catch (err) {
        console.log(err);
      }
    },

    async addComments() {
      try {
        await axios.post("/gym-schedule/client/workout/comment/add", {
          comment: this.comment,
          program_id: this.$route.params.id,
        });
        this.comment = "";
        this.getComments();
      } catch (err) {
        console.log(err);
      }
    },

    async getComments() {
      try {
        const response = await axios.get(
          `/gym-schedule/client/workout/comment/get/${this.$route.params.id}`
        );
        this.commentList = response.data.data.reverse();
      } catch (err) {
        console.log(err);
      }
    },

    async updateWorkout(data) {
      if (data) {
        this.status[data.index] = data.status;
        this.data.workout[data.index].showStatusUpdate = true;
      }
      try {
        let form = new FormData();
        this.data.workout.forEach((val, index) => {
          console.log(val);
          form.append(`result[${index}][workout_id]`, val.result.workout_id);
          if (val.result.id) form.append(`result[${index}][id]`, val.result.id);
          form.append(
            `result[${index}][status]`,
            this.status[index] === 1 || this.status[index] === 0
              ? this.status[index]
              : val.result.status
          );
          if (val.result.comment)
            form.append(`result[${index}][comment]`, val.result.comment);
          if (val.result.time)
            form.append(`result[${index}][time]`, val.result.time);
          if (val.result.reps)
            form.append(`result[${index}][reps]`, val.result.reps);
          if (val.result.pr != null && val.result.pr != undefined)
            form.append(`result[${index}][pr]`, val.result.pr ? 1 : 0);
          if (val.result.rounds)
            form.append(`result[${index}][rounds]`, val.result.rounds);
          if (this.image[index])
            form.append(`result[${index}][image]`, this.image[index]);
            // return
          val.workout_detail.forEach((detail, ind) => {
            val.measurement.forEach((mes, mesIndex) => {
              if(this.$refs['measure_'+(index)][ind + mesIndex].value) {
                form.append(`result[${index}][measurement][${ind + mesIndex}][key]`, mes.name);
                form.append(`result[${index}][measurement][${ind + mesIndex}][value]`, this.$refs['measure_'+(index)][ind + mesIndex].value);
                form.append(`result[${index}][measurement][${ind + mesIndex}][workout_detail_id]`, detail.id);
              }
            })
          })
          console.log(this.$refs)
          if(val.type === "circuit") {
            val.measurement.forEach((mes, mesIndex) => {
              if(this.$refs['measureW_'+(index)][mesIndex].value) {
                form.append(`result[${index}][measurement][${mesIndex}][key]`, mes.name);
                form.append(`result[${index}][measurement][${mesIndex}][value]`, this.$refs['measureW_'+(index)][mesIndex].value);
              }
            })
          }
        });
        

        await axios.post(
          "/gym-schedule/client/workout/result/update-workout",
          form
        );
        this.image = {};
        this.getWorkoutDetails(this.$route.params.id);
        this.$forceUpdate();
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style scoped>
.load-text {
  color: #15E7FB;
}
</style>

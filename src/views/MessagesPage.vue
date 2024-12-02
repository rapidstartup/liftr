<template>
    <div class="client-dashboard">
      <header-view />
      <!-- <nav class="client-dashboard-header" style="background-color: #15e7fb">
        <div class="client-dashboard-header-navs client-dashboard-header__with__edit">
          <span><i class="fa-solid fa-inbox"></i></span><span> Messages</span>
        </div>
      </nav> -->

        <div class="client-dashboard-body my-2 chat-content d-flex flex-column" :class="{'mv-programs-container' :$screen.isMobileView, 'list-open':$screen.isMobileView}" ref="mvBox" style="max-width: 1600px">
            <div class="chat-content-header p-3 mb-2">
                <div class="left-content-of-chat-header d-flex align-items-center">
                <div :class="{'selected-chat': coach === null}" @click="coach=null">All Messages</div>
                <div :class="{'selected-chat': coach}" @click="coach=true">Coach Chat</div>
                <div :class="{'selected-chat': coach === false}" @click="coach=false">Group Chat</div>
                </div>
                <div class="right-content-of-chat-header d-flex">
                <div class="btn-icon px-2 py-2 d-flex align-items-center justify-content-center" title="Mark As Read">
                    <i class="fa-solid fa-check"></i>
                </div>
                <div class="btn-icon px-2 py-2 d-flex align-items-center justify-content-center" title="Delete">
                    <i class="fa-solid fa-trash" style="color:red"></i>
                </div>
                <div class="btn-icon px-2 py-2 d-flex align-items-center justify-content-center" title="Follow Up">
                    <i class="fa-solid fa-star"></i>
                </div>
                </div>
            </div>
            <div class="d-flex w-100 chat-content-view ">
                <div class="sidebar-chat">
                    <div class="my-2 mr-3">
                        <div class="position-relative search-input-chat">
                        <input type="search" placeholder="Search" class="w-100" v-model="search" />
                        <span class="search-icon"><i class="fa-solid fa-search"></i></span>
                        </div>
                    </div>
                    <div class="chat-list pr-3">
                    <!-- <div class="programs-main-header d-flex justify-content-between align-items-center">
                            <h2 class="font-weight-bold pt-3">Chats</h2>
                        </div> -->
                    <div
                        class="chats-groups d-flex align-items-center mb-2"
                        :class="{ active: roomId == data.id }"
                        v-for="data in chatRoomList"
                        :key="data.id"
                        @click="
                            navigateTo(data.id);
                            currentChatGrp = data;
                        "
                        
                    >
                    <div class=" mx-2 my-2 py-1 d-flex align-items-center">
                        <img src="https://www.w3schools.com/howto/img_avatar.png" height="50" alt="image">
                        <span class="px-2 text-capitalize user-name ellipses">{{ data.name }}</span>
                    </div>
                    <span class="time-stamp">{{ data.timeStamp | formatRecentTimeStamp }}</span>
                    <span v-if="data.type == 'group'" class="room-type">Group</span>
                    <span class="badge badge-unread" v-if="data.unreadCount > 0">{{ data.unreadCount }}</span>
                    </div>
                </div>
                </div>
                <div class="main-chat-container d-flex flex-column position-relative ml-2">
                    <div class="room-info d-flex align-items-center p-3">
                        <a href="javascript:void(0)" @click="chatMenuOpen" class="menu-toggle"><i class="fa fa-user-circle"></i></a>
                        <span class="group-info pl-3">{{activeChatRoomName}}</span>
                    </div>
                    <chat-room :room="activeChatRoom" :room-loader="roomLoader" @hide-loader="hideLoader"></chat-room>
                    <message-send :room="activeChatRoom"></message-send>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import moment from "moment";
  //import axios from "axios";
  import DataService from "../services/DataService.js";
  import HeaderView from "../components/Common/HeaderView.vue";
  import ChatRoom from "@/components/chat/ChatRoom.vue";
  import MessageSend from "@/components/chat/MessageSend.vue";
  export default {
    components: { HeaderView, ChatRoom, MessageSend },
    mounted() {
      
      
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
        search: "",
        coach: null,
        theme: '',
        userInfo: {
          client_id: null,
          created_at: null,
          email: null,
          name: null,
          updated_at: null,
        },
        chatMsg: "",
        chatsGroup: [
            {
            id: 1,
            name: "Chat channnel Group 1",
            },
            {
            id: 2,
            name: "Chat channnel Group 2",
            },
            {
            id: 3,
            name: "Chat channnel Group 3",
            },
            {
            id: 4,
            name: "Chat channnel Group 4",
            },
            {
            id: 5,
            name: "Chat channnel Group 5",
            },
            {
            id: 6,
            name: "Chat channnel Group 6",
            },
            {
            id: 7,
            name: "Chat channnel Group 7",
            },
            {
            id: 8,
            name: "Chat channnel Group 8",
            },
            {
            id: 9,
            name: "Chat channnel Group 9",
            },
            {
            id: 10,
            name: "Chat channnel Group 10",
            },
            {
            id: 11,
            name: "Chat channnel Group 11",
            },
            {
            id: 12,
            name: "Chat channnel Group 12",
            },
        ],
        messages: [
            {
                text: "Hi, How are you?",
            },
        ],
        data: [],
        pageInfo: {},
        roomId:"",
        chatRooms : [],
        roomLoader:false,
        activeChatRoom:{},
        activeChatRoomName:"",
      };
    },
    methods: {
        chatMenuOpen(){
            if (this.$refs.mvBox.classList.contains("mv-programs-container")){
                if (!this.$refs.mvBox.classList.contains("list-open")){
                this.$refs.mvBox.classList.add("list-open");
                }
            }
      
        },
        navigateTo(id) {
            if (this.roomId == id){
                return;
            }
            this.roomId = id;
            this.roomLoader = true;
            this.selectChatRoom(id);
            if (this.$refs.mvBox.classList.contains("mv-programs-container")){
                if (this.$refs.mvBox.classList.contains("list-open")){
                this.$refs.mvBox.classList.remove("list-open");
                }
            }
            
        },
        sendMessage() {
            if(!this.chatMsg.trim()) {
                return;
            }
            console.log("iuoiuoiu")
            this.messages = [
                ...this.messages,
                {
                text: this.chatMsg,
                },
            ];
            this.chatMsg = "";
        },
        onDataChanged(snapshot){
            let _my_chat_rooms = [];
            if (snapshot.exists()){
                let clientRooms = snapshot.val();
                
                for (let k in clientRooms){
                    if (k.includes("clientId") && k.includes("coachId")){//client and coach
                        let tmpArr = k.toString().trim().split("_");
                        let tmpClientId = tmpArr[0].toString().trim().substring(8, tmpArr[0].toString().trim().length);
                        let tmpCoachId = tmpArr[1].toString().trim().substring(7, tmpArr[1].toString().trim().length);
                        if (this.userInfo.client_id == tmpClientId){
                            let isExistsClient = _my_chat_rooms.some((_p)=>_p.fbId == k);
                            if (!isExistsClient){
                                _my_chat_rooms.push({
                                    id:tmpClientId + "_" + tmpCoachId,
                                    fbId: k,
                                    clientId:tmpClientId,
                                    coachId:tmpCoachId,
                                    name:clientRooms[k].coachName,
                                    programId:"",
                                    content: clientRooms[k].lastMessage,
                                    timeStamp:clientRooms[k].lastMessageTime,
                                    unreadCount:((typeof clientRooms[k].clientUnReadCount !== 'undefined') ? parseInt(clientRooms[k].clientUnReadCount) : 0),
                                    type:'user'
                                });
                            }else{
                                _my_chat_rooms.some((p, i) => {
                                    if (p.fbId == k){
                                        _my_chat_rooms[i].name = clientRooms[k].coachName;
                                        _my_chat_rooms[i].content = clientRooms[k].lastMessage;
                                        _my_chat_rooms[i].timeStamp = clientRooms[k].lastMessageTime;
                                        _my_chat_rooms[i].unreadCount = ((typeof clientRooms[k].clientUnReadCount !== 'undefined') ? parseInt(clientRooms[k].clientUnReadCount) : 0);
                                    }
                                });

                            }
                        }
                    }else if (k.includes("programId")){// client program
                        let tmpProgramId = k.toString().trim().substring(9, k.toString().trim().length);
                        let isExistsProgram = _my_chat_rooms.some((_p) => _p.fbId == k);
                        if (!isExistsProgram){
                            _my_chat_rooms.push({
                                id:tmpProgramId,
                                fbId:k,
                                clientId:snapshot.key,
                                coachId:clientRooms[k].coachId,
                                name:clientRooms[k].programName,
                                programId:tmpProgramId,
                                content: clientRooms[k].lastMessage,
                                timeStamp:clientRooms[k].lastMessageTime,
                                unreadCount:((typeof clientRooms[k].clientUnReadCount !== 'undefined') ? parseInt(clientRooms[k].clientUnReadCount) : 0),
                                type:'group'
                            });
                        }else{
                            _my_chat_rooms.some((p, i) => {
                                    if (p.fbId == k){
                                        _my_chat_rooms[i].name = clientRooms[k].programName;
                                        _my_chat_rooms[i].content = clientRooms[k].lastMessage;
                                        _my_chat_rooms[i].timeStamp = clientRooms[k].lastMessageTime;
                                        _my_chat_rooms[i].unreadCount = ((typeof clientRooms[k].clientUnReadCount !== 'undefined') ? parseInt(clientRooms[k].clientUnReadCount) : 0);
                                    }
                                });

                        }
                

                    }
                }
                _my_chat_rooms.sort((x, y) => {
                    return x.timeStamp - y.timeStamp;
                }).reverse();
                this.chatRooms = _my_chat_rooms;
            }else{
                this.chatRooms = _my_chat_rooms;
                this.activeChatRoom = {},
                this.activeChatRoomName = "";
            }
        },
        selectChatRoom(_roomId){
            let $this = this;
            this.chatRooms.forEach((r) => {
                
                if (r.id === _roomId){
                    if (r.type == 'group'){
                        $this.activeChatRoomName = r.name + ' (Group)';
                        $this.activeChatRoom = r;
                        $this.activeChatRoom.roomClients = $this.getAssignedClass(r.programId);
                    }else{
                        $this.activeChatRoom = r;
                        $this.activeChatRoomName = r.name;
                    }
                }
            });
        },
        getAssignedClass(classId){
            this.userInfo = this.$store.state.auth.user.data;
            let assignedClass = this.$store.state.auth.assignedClass.data;
            let groupMembers = [];
            assignedClass.forEach((item) => {
                if (parseInt(item.program_class_id) == classId){
                    item.class.clients.forEach((cls) => {
                        if (parseInt(cls.program_class_id) == classId){
                            if (this.userInfo.client_id != cls.client_id){
                                groupMembers.push(cls.client_id);
                            }
                        }
                    });
                }
            });
            return groupMembers;
        },
        hideLoader(){
            setTimeout(()=>{
                this.roomLoader = false;
            }, 1500);
        }
    },
    created(){
        this.theme = localStorage.getItem('theme')
        this.userInfo = this.$store.state.auth.user.data;
        DataService.getMyChatRoom(this.userInfo.client_id).on("value", this.onDataChanged);
    },
    computed: {
        chatRoomList() {
            console.log(this.coach)
            if(this.coach) {
                return this.chatRooms.filter(val => val.type !== 'group').filter(val => val.name.toLowerCase().includes(this.search.toLowerCase()))
            }
            else if(this.coach === false) {
                return this.chatRooms.filter(val => val.type === 'group').filter(val => val.name.toLowerCase().includes(this.search.toLowerCase()))
            }
            return this.chatRooms.filter(val => val.name.toLowerCase().includes(this.search.toLowerCase()));
        },
    },
    beforeDestroy(){
        DataService.getMyChatRoom(this.userInfo.client_id).off("value", this.onDataChanged);
    }
  };
  </script>
  
  <style scoped>
  /* @import "../../css/programs.css"; */
  </style>
  
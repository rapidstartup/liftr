<template>
    <div class="chart-container-body" v-chat-scroll="{always:false}">
        <div class="loader" :class="{'show': (roomLoader == true)}">
            <i class="fa fa-spinner fa-spin" aria-hidden="true" style="font-size:30px"></i>
        </div>
        <div class="chat-msg-text" v-for="(msg, index) in messages" :key="index" :class="((msg.senderId == userInfo.client_id) ? 'justify-content-end' : 'justify-content-start')">
            <div class="text-msg-row">
                <div class="msgThem" v-if="msg.senderId != userInfo.client_id && msg.conversation == 'group'">{{ msg.senderName }}</div>
                <div class="msg" :class="((msg.senderId == userInfo.client_id) ? 'me' : 'them')" v-if="msg.contentType === 'text'" v-html="msg.content"></div>
                <div class="msg" :class="((msg.senderId == userInfo.client_id) ? 'me' : 'them')" v-if="msg.contentType === 'image'">
                    <div class="d-flex flex-column">
                        <a v-on:click.prevent="openImage(msg.image)"><i class="fa fa-camera mx-3" area-hidden="true" style="font-size:30px;"></i></a>
                        <span class="imgContent" v-html="msg.content"></span>
                    </div>
                </div>
                <div class="msgTimeStamp">{{msg.createdAt | formatChatTimeStamp}}</div>
            </div>
            
        </div>
    </div>
    
</template>
<script>
import DataService from '@/services/DataService';
export default{
    components:{},
    props:['room', 'roomLoader'],
    data(){
        return{
            userInfo: {
                client_id: null,
                created_at: null,
                email: null,
                name: null,
                updated_at: null,
            },
            messages:[],
            roomFbId:"",
            chatRoomKey:null,
            chatRoom:null,
            
        }
    },
    methods:{
        onDataChanged(snapshot){
            let _message_list = [];
            if (snapshot.exists()){
                if (snapshot.key === this.chatRoomKey){
                    snapshot.forEach((m)=>{
                        let children = m.val();
                        _message_list.push(children);
                    });
                    this.messages = _message_list;
                    this.getActiveChatRoomUnReadCount();
                }
            }else{
                this.messages = _message_list;
            }
            
        },
        openImage(fileName){
            let path = DataService.ImageBaseUrl + "storage/chat/attachment/" + fileName;
            window.open(path, 'chart', 'width=1225, height=770') 
        },
        getActiveChatRoomUnReadCount(){
            let ref = "/users/" + this.chatRoom.clientId + "/" + this.chatRoom.fbId + "/clientUnReadCount";
            DataService.getRef(ref).on("value", (snapshot) => {
                if (parseInt(snapshot.val()) > 0){
                    let updates = {};
                    updates[this.chatRoom.clientId + "/" + this.chatRoom.fbId + "/clientUnReadCount"] = 0;
                    DataService.getRef("/users").update(updates);
                }
            });
        }
        
    },
    mounted(){
        
    },
    watch:{
        room:function(room){
            if (Object.keys(room).length){
                let _messageNode;
                if (room.type == 'user'){
                    _messageNode = room.clientId + "_" + room.coachId;
                    if (parseInt(room.unreadCount) > 0){
                        let updates = {};
                        updates[room.clientId + "/" + room.fbId + "/clientUnReadCount"]  = 0;
                        DataService.getRef("/users").update(updates);
                    }

                }else if (room.type == 'group'){
                    _messageNode = room.programId + "_" + room.coachId;
                    if (parseInt(room.unreadCount) > 0){
                        let updates = {};
                        updates[room.clientId + "/"+room.fbId+"/clientUnReadCount"] = 0;
                        DataService.getRef("/users").update(updates);
                    }
                }
                this.roomFbId = room.fbId;
                this.chatRoomKey = _messageNode;
                this.chatRoom = room;
                DataService.getRoomMessages(_messageNode).on("value", this.onDataChanged);
                this.$emit("hide-loader");
            }else{
                this.roomFbId = "";
                this.messages = [];
            }
        }
    },
    created(){
        this.userInfo = this.$store.state.auth.user.data;
    },
    beforeDestroy(){
        //DataService.getRoomMessages().off("value", this.onDataChanged)
    }
}
</script>
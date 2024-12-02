<template>
    <div class="chart-container-textarea align-items-center"  :class="((chatId.length) ? 'd-flex' : 'd-none')">
        <textarea class="form-control form-control-lg chat-input-textarea" placeholder="Reply" id="chatInput" rows="1" ref="chatMessage" v-model="chatMsg" @keydown.enter="sendMessage"></textarea>
        <div class="d-flex action-icon-textarea">
            <div class="position-absolute emoji-list py-2 room-info" v-if="showEmoji">
                <div v-for="(emoji, index) in emojiList" :key="index" @click="chatMsg+=emoji">{{ emoji }}</div>
            </div>
            <div @click="showEmoji = !showEmoji">
                <i
                    class="fa fa-smile mx-3"
                    aria-hidden="true"
                    style="cursor: pointer; font-size: 20px"
                    
                ></i>
            </div>
            <div @click="sendMessage">
                <i class="fa fa-paper-plane mx-3" aria-hidden="true" style="cursor: pointer; font-size: 20px"></i>
            </div>
            <div @click="chooseFile()">
                <input type="file" style="visibility:hidden; position: absolute;" ref="file" @change="onFileChange" accept="image/x-png,image/gif,image/jpeg" />
                <i class="fa fa-paperclip mx-3" aria-hidden="true" style="cursor:pointer; font-size:20px; color:#15e7fb"></i>
            </div>
        </div>
        <upload-preview :room="activeChatRoom" :file-info="fileInfo" :group-members="groupMembers" v-if="showModel" @hide-model="closeModel"></upload-preview>
    </div>
</template>
<script>
import DataService from '@/services/DataService';
import moment from 'moment';
import UploadPreview from './UploadPreview.vue';

export default{
    components:{
        UploadPreview,
    },
    props:['room'],
    data(){
        return{
            showEmoji: false,
            userInfo: {
                client_id: null,
                created_at: null,
                email: null,
                name: null,
                updated_at: null,
            },
            emojiList: [
                '👍',
                '👊',
                '💪',
                '👋',
                '👎',
                '🏆',
                '🔥',
                '❤️',
                '🍎',
            ],
            chatId:"",
            chatMsg:"",
            activeChatRoom:{},
            showModel:false,
            previewData:{},
            fileInfo:null,


        }
    },
    methods:{
        chooseFile(){
            let fileInput = this.$refs.file;
            fileInput.click();
        },
        onFileChange(e){
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
                
            let fileType = /image.*/;
            if (!files[0].type.match(fileType)){
                alert('The file must be an image.');
                return;
            }
            let fileSize = files[0].size / 1024 / 1024;
            if (fileSize > 1){
                alert("Maximum file size to upload is 1MB (1024 KB).");
                return;
            }
            this.fileUpload(files[0]);
        },
        fileUpload(file){
            this.fileInfo = file;
            this.fileInfo.obj = file;
            this.fileInfo.url = URL.createObjectURL(file);
            this.showModel = true;
        },
        insert(emoji) {
            this.chatMsg += emoji
        },
        sendMessage(e) {
            if(e) {
                if (e.shiftKey === true && e.keyCode === 13){
                    return;
                }
                e.preventDefault();
            }
            if (!this.chatMsg.trim()){
                return;
            }
            let msg = {
                coachId:this.activeChatRoom.coachId,
                content:this.chatMsg.trim(),
                contentType:'text',
                conversation:this.activeChatRoom.type,
                createdAt:moment().utc().valueOf(),
                isRead:false,
                senderId:this.userInfo.client_id,
                senderName:this.userInfo.name,
                clients:this.groupMembers,
            };
            if (this.chatMsg.length){
                DataService.addMessage(this.chatId, msg);
            }
            this.chatMsg = "";
            /* this.$refs.chatMessage.text = '';
            e.target.reset(); */
        },
        
        closeModel:function(){
            this.fileInfo = null;
            this.$refs.file.value = null;
            this.showModel = false;
        }
    },
    watch:{
        room:function(room){
            if (Object.keys(room).length){
                this.groupMembers = [];
                this.chatId = room.id;
                this.activeChatRoom = room;
            }else{
                this.chatId = "";
            }
        }

    },
    created(){
        this.userInfo = this.$store.state.auth.user.data;
    },
}
</script>
<style scoped>
.emoji-list {
    display: flex;
    min-width: 53px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    bottom: 53px;
}
.emoji-list div {
    cursor: pointer;
    padding: 5px 0;
}
</style>
<template>
    <div class="preview-container">
        <div class="loader" :class="{'show': (showLoader == true)}">
            <i class="fa fa-spinner fa-spin" aria-hidden="true" style="font-size:30px"></i>
        </div>
        <div class="header">
            <a @click="cancelUpload()" class="close"><i class="fa fa-times-circle"></i></a>
            {{fileInfo.name}}
        </div>
        <div class="content">
            <img :src="fileInfo.url" class="img-fluid" :alt="fileInfo.name" />
        </div>
        <div class="footer d-flex align-items-center w75">
            <textarea placeholder="Type message" v-model="chatMsg" class="form-control form-control-lg mt-0" @keydown.enter="uploadFile"></textarea>
            <div @click="uploadFile()">
                <i
                class="fa fa-paper-plane mx-3"
                aria-hidden="true"
                style="cursor: pointer; font-size: 26px"
                
            ></i>
            </div>
            
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import DataService from '@/services/DataService';
import moment from 'moment';
export default{
    props:['room', 'fileInfo', 'groupMembers'],
    data(){
        return{
            userInfo: {
                client_id: null,
                created_at: null,
                email: null,
                name: null,
                updated_at: null,
            },
            chatId:"",
            chatMsg:"",
            UploadedFile:null,
            showLoader:false,
        }
    },
    methods:{
        cancelUpload(){
            this.$emit("hide-model");
        },
        uploadFile(e){
            if(e) {
                if (e.shiftKey === true && e.keyCode === 13){
                    return;
                }
                e.preventDefault();
            }
            this.showLoader = true;
            let formData = new FormData();
            formData.append("file", this.fileInfo.obj);
            axios.post('/gym-schedule/client/file-upload', formData, {headers:{'Content-Type':'multipart/form-data'}})
            .then((response) => {
                if (response.data.status == 'success'){
                    this.UploadedFile = response.data.data;
                    this.sendImageMessage();
                    this.showLoader = false;
                    this.$emit("hide-model");
                }else{
                    alert(response.data.errors.file[0]);
                    this.chatMsg = "";
                    this.showLoader = false;
                    this.$emit("hide-model");
                }
                
            })
            .catch((error)=>{
                this.showLoader = false;
                console.log(error);
            })
        },
        sendImageMessage(){
            let msg = {
            coachId:this.room.coachId,
            content:this.chatMsg.trim(),
            contentType:'image',
            conversation:this.room.type,
            createdAt:moment().utc().valueOf(),
            isRead:false,
            senderId:this.userInfo.client_id,
            senderName:this.userInfo.name,
            image:this.UploadedFile.name,
            groupMembers:this.groupMembers
            };
            DataService.addMessage(this.room.id, msg);
            this.chatMsg = "";
        }
    },
    created(){
        this.userInfo = this.$store.state.auth.user.data;
    },
}
</script>
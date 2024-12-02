import firebase from "../firebase";
//const db = firebase.ref("/lifter_programs/programs/");


class DataService{
    getRef( _node = ''){
        return firebase.ref("/lifter_programs" + ((_node !== '') ? _node : ''));
    }

    getUserNode(){
        return firebase.ref("/lifter_programs/users");
    }

    getMyChatRoom(clientId){
        return firebase.ref("/lifter_programs/users/" + clientId).orderByChild("lastMessageTime");
    }

    getMessagesRoot(){
        return firebase.ref("/lifter_programs/messages");
    }

    getRoomMessages(roomId){
        return firebase.ref("/lifter_programs/messages/" + roomId + "/");

    }

    addMessage(id, message){
        let _message_key = (message.conversation == 'group') ?  id + '_' + message.coachId : message.senderId + "_" + message.coachId;
        const $send = firebase.ref("/lifter_programs/messages/").child(_message_key).push(message).key;
        if (message.conversation == 'group'){
            firebase.ref("/lifter_programs/users").once("value", function(snapshot){
                let users = snapshot.val();
                let updateList = [];
                for (let u in users){
                    if (typeof users[u]["programId" + id] !== 'undefined'){
                        if (users[u]["programId" + id].coachId == message.coachId){
                            updateList.push({userId:u, programId:"programId"+id});
                            let clientUnReadCount = ((typeof users[u]["programId" + id].clientUnReadCount !== 'undefined') ? parseInt(users[u]["programId" + id].clientUnReadCount) : 0);
                            let coachUnReadCount = ((typeof users[u]["programId" + id].coachUnReadCount !== 'undefined') ? parseInt(users[u]["programId" + id].coachUnReadCount) : 0);
                            let updates = {};
                            updates[ u + "/programId" + id + "/lastMessage" ] = message.content;
                            updates[u + "/programId" + id + "/lastMessageTime"] = message.createdAt;
                            if (u != message.senderId){
                                updates[u + "/programId" + id + "/clientUnReadCount"] = clientUnReadCount + 1;
                            }
                            updates[u + "/programId" + id + "/coachUnReadCount"] = coachUnReadCount + 1;
                            firebase.ref("/lifter_programs").child("/users").update(updates);
                        }
                    }
                }
            });
        }else if (message.conversation == 'user'){
            let tmp_user_coach_key = "clientId"+message.senderId+"_coachId"+message.coachId;
            firebase.ref("/lifter_programs/users/" + message.senderId).child(tmp_user_coach_key).once("value", function(snapshot){
                let userRecentChat = snapshot.val();
                let unReadCount = ((typeof userRecentChat.coachUnReadCount !== "undefined") ? parseInt(userRecentChat.coachUnReadCount) : 0);
                let updates = {};
                updates[message.senderId+"/"+tmp_user_coach_key+"/lastMessage"] = message.content;
                updates[message.senderId+"/"+tmp_user_coach_key+"/lastMessageTime"] = message.createdAt;
                updates[message.senderId+"/"+tmp_user_coach_key+"/coachUnReadCount"] = unReadCount + 1;
                firebase.ref("/lifter_programs").child("/users").update(updates);
            });
        }
        return $send;
    }
    
    ImageBaseUrl = 'https://gym.therepconnect.co/';
}

export default new DataService;
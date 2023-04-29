<template>
  <v-card style="display: flex; flex-direction: column; align-content: center; justify-content: center; width: 300px">
    <v-btn @click="toggleChat()" >{{ visible? "Close chat" : "Open Chat" }}</v-btn>
    <v-card v-if="visible">
      <div class="chat-container">
        <div v-for="message in messages" :key="message" class="message">{{ message }}</div>
        <input v-model="newMessage" class="input-message" @keyup.enter="sendMessage"/>
      </div>
    </v-card>
  </v-card>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      messages: [],
      newMessage: "",
      socket: null,
      visible: false
    };
  },
  methods: {
    async sendMessage() {
      this.socket.emit('newMessage', this.newMessage);
      this.messages.push(this.newMessage)
      this.newMessage = "";
    },
    toggleChat() {
      this.visible = !this.visible;
    }
  },
  mounted() {
    this.socket = io('process.env.PORT || 3000;');
    this.socket.on('init', (messages) => {
      this.messages = messages;
    });
    this.socket.on('message', (message) => {
      this.messages.push(message);
    });
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script>

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 400px;
  border: 1px solid gray;
  padding: 10px;
}

.message {
  background-color: #f2f2f2;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
}

.input-message {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid gray;
  margin-top: 10px;
}
</style>

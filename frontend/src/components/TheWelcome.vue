<script setup>
import axios from 'axios';
import marked from 'marked';
</script>
<template>
  <div>
    <div v-for="(item, index) in messages" :key="index">
      <div v-if="item.type === 'input'" class="input-message">
        {{ item.message }}
      </div>
      <div v-else-if="item.type === 'response'" class="response-message" v-html="formatResponse(item.message)">
      </div>
    </div>
    <div class="input-group mb-3">
      <input v-model="inputValue" type="text" class="form-control" placeholder="Enter message"
        @keyup.enter="submitData">
    </div>
    <div class="input-group-append">
      <button @click="submitData" class="btn btn-primary">Submit</button>
    </div>
  </div>
</template>
<script>
const API_URL = import.meta.env.API_URL || 'http://localhost:3000/conversation';
export default {
  data() {
    return {
      inputValue: '',
      messages: [],
      conversationId: '',
      parentMessageId: ''
    };
  },
  methods: {
    async submitData() {
      const input = this.inputValue;
      this.inputValue ='';
      this.messages.push({
        message: input,
        type: 'input'
      });
      try {
        const res = await axios.post(API_URL, {
          message: input,
          conversationId: this.conversationId,
          parentMessageId: this.parentMessageId
        },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        this.conversationId = res.data.conversationId;
        this.parentMessageId = res.data.messageId;
        this.messages.push({
          message: JSON.stringify(res.data.response),
          type: 'response'
        });
      } catch (error) {
        this.messages.push({
          message: error,
          type: 'response'
        });
      }
    },
    formatResponse(message) {
      return marked.parse(message).replace(/\\n/g,'<br>');
    }
  }
};
</script>

<style>
.input-message {
  background-color: lightgray;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
}

.response-message {
  background-color: lightblue;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
}
</style>


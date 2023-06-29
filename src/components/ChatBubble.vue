<template>
  <div
    class="container flex flex-col h-screen w-screen bg-gray-900 no-scrollbar::-webkit-scrollbar no-scrollbar content"
  >
    <div class="flex">
      <p v-if="user != null" class="text-gray-100 text-5xl">
        Welcome!
        <span class="text-[#12e675]">
          {{ `${user.firstName} ${user.lastName}` }}
        </span>
      </p>
    </div>
    <div class="flex pt-9">
      <div class="flex flex-col">
        <div
          v-for="conversation in conversations"
          class="flex p-2 border-2 border-transparent"
          :class="{
            'bg-gray-800': selectedConversationId == conversation.id,
            'hover:cursor-pointer hover:border-2 hover:border-cyan-300 duration-100':
              !isMobile,
          }"
          @click="
            {
              setSelectedConversationId(conversation.id);
              setSelectedConversation(conversation);
            }
          "
        >
          <img
            class="w-8 h-8 rounded-full border-cyan-300 border-2"
            :src="getUrl(conversation.users[0].profileBackDropPath)"
            alt="avatar"
          />
          <p
            class="font-bold text-gray-100 ml-2 self-center"
            :class="{ 'text-xxsm': isMobile }"
          >
            {{
              `${conversation.users[0].firstName} ${conversation.users[0].lastName}`
            }}
          </p>
        </div>
      </div>
      <ul
        class="flex-1 flex-col bg-gray-800 rounded-md pb-[6rem]"
        :class="{ 'p-4': !isMobile }"
      >
        <li
          v-if="selectedConversation != null"
          v-for="message in selectedConversation.messages.sort((a, b) => {
            return a.id - b.id;
          })"
          class="flex text-white"
        >
          <ChatMessage
            :name="`${message.user.firstName} ${message.user.lastName}`"
            :isMe="checkIfMe(message)"
            :message="message.content"
            :avatarUrl="getUrl(message.user.profileBackDropPath)"
            :time="getTime(message.date)"
            :id="message.id"
          ></ChatMessage>
        </li>
      </ul>
    </div>

    <div class="flex justify-between">
      <input
        class="fixed right-10 z-90 bottom-10 left-5 bg-gray-700 py-3 rounded-lg pl-2 outline-none text-gray-300"
        placeholder="type something"
        v-model="message"
        @keyup.enter="sendMessage(selectedUserId)"
      />
      <button
        class="fixed z-90 bottom-10 right-4 bg-[#12e675] p-3 px-4 rounded-lg"
        :class="{ 'hover:opacity-80 duration-200': !isMobile }"
        @click="sendMessage(selectedUserId)"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script setup>
import ChatMessage from "./ChatMessage.vue";
import { ref, onMounted, computed } from "vue";
import remote from "../util/remote";

const conversations = ref([]);
const selectedConversationId = ref();
const selectedConversation = ref();
const user = ref();

function checkIfMe(message) {
  return message.user.id == user.value.id;
}

const response = ref();

const setSelectedConversationId = (id) => {
  selectedConversationId.value = id;
};
const setSelectedConversation = (conversation) => {
  selectedConversation.value = conversation;
};

const getUrl = (backdropPath) => {
  return `https://randomuser.me/api/portraits/men/${backdropPath}`;
};

const message = ref("");
const isMobile = ref(false);

const loadConversations = async () => {
  let res = (await remote.get("/chat/conversation")).data.conversations;
  conversations.value = res;
  selectedConversationId.value = res[0].id;
  selectedConversation.value = res[0];
};

const initilize = async () => {
  const me = (await remote.get("/auth/me")).data.user;
  user.value = me;
  if (window.innerWidth <= 1080) {
    isMobile.value = true;
  }
  await loadConversations();
};

onMounted(initilize);

const sendMessage = async (userId) => {
  let trimmedMessage = message.value.trim();
  if (trimmedMessage === "") return;
  const body = {
    user: user.value,
    content: trimmedMessage,
    conversation: selectedConversation.value,
  };

  try {
    const newMessage = (
      await remote.post(`/chat/${selectedConversationId.value}/message`, body)
    ).data;
    try {
      selectedConversation.value.messages.push({
        id: newMessage.id,
        content: newMessage.content,
        date: newMessage.date,
        user: newMessage.user,
      });
    } catch (e) {
      console.log(`failed to push because ${e.message}`);
    }
    message.value = "";
  } catch (e) {}
};

function getTime(dbDate) {
  let date = new Date(dbDate);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const currentTime = hours + ":" + minutes + " " + amPm;
  return currentTime;
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  overflow: hidden;
}

.content {
  overflow-y: scroll;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.text-xxsm {
  font-size: 0.6rem;
}

@media (max-width: 1080px) {
  p {
    font-size: 14px;
    max-width: 100%;
    word-break: break-word;
  }
}
</style>

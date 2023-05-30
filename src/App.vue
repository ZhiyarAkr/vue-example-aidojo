<template>
  <div
    class="container flex flex-col justify-between h-screen w-screen bg-gray-900 no-scrollbar::-webkit-scrollbar no-scrollbar content"
  >
    <div class="flex">
      <div class="flex flex-col">
        <div
          v-for="(user, index) in users"
          class="flex p-2 border-2 border-transparent"
          :class="{
            'bg-gray-800': selectedUserId == user.id,
            'hover:cursor-pointer hover:border-2 hover:border-cyan-300 duration-100':
              !isMobile,
          }"
          @click="
            {
              setSelectedUserId(user.id);
              setSelectedUser(user);
              loadMessagesOfUser(user.id);
            }
          "
        >
          <img
            class="w-8 h-8 rounded-full border-cyan-300 border-2"
            :src="getUrl(user.profileBackDropPath)"
            alt="avatar"
          />
          <p
            class="font-bold text-gray-100 ml-2 self-center"
            :class="{ 'text-xxsm': isMobile }"
          >
            {{ user.name }}
          </p>
        </div>
      </div>

      <ul
        class="flex-1 flex-col bg-gray-800 rounded-md pb-[6rem]"
        :class="{ 'p-4': !isMobile }"
      >
        <li v-for="(item, index) in conversations" class="flex text-white">
          <ChatBubble
            :name="selectedUser.name"
            :isMe="checkIfMe(item)"
            :message="item.content"
            :avatarUrl="getUrl(selectedUser.profileBackDropPath)"
            :time="getTime(item.date)"
            :id="item.id"
            @onDelete="deleteMessage"
            @onEdit="editMessage"
          ></ChatBubble>
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
import ChatBubble from "./components/ChatBubble.vue";
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const selectedUserId = ref(1);
const selectedUser = ref();

const users = ref([]);

const conversations = ref([]);

function checkIfMe(message) {
  return message.userId == 0;
}

const response = ref();

function setSelectedUserId(id) {
  selectedUserId.value = id;
}

function setSelectedUser(user) {
  selectedUser.value = user;
}

const getUrl = (backdropPath) => {
  return `https://randomuser.me/api/portraits/men/${backdropPath}`;
};

const message = ref("");
const isMobile = ref(false);

const loadUsers = async () => {
  try {
    let res = (await axios.get("http://localhost:3000/chat/user")).data;
    res.forEach((element) => {
      if (element.id != 0) {
        users.value.push(element);
        if (element.id == 1) {
          selectedUser.value = element;
        }
      }
    });
  } catch (e) {}
};

const loadMessages = async () => {
  try {
    let res = (await axios.get("http://localhost:3000/chat/message/1")).data;
    res.forEach((element) => {
      conversations.value.push(element);
    });
  } catch (e) {}
};

const loadMessagesOfUser = async (id) => {
  conversations.value = [];
  try {
    let res = (await axios.get(`http://localhost:3000/chat/message/${id}`))
      .data;
    let res2 = (await axios.get("http://localhost:3000/chat/message/0")).data;
    res.forEach((element) => {
      conversations.value.push(element);
    });
    res2.forEach((element) => {
      if (element.toUserId == id) {
        conversations.value.push(element);
      }
    });
    conversations.value.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  } catch (e) {}
};

const initilize = () => {
  if (window.innerWidth <= 1080) {
    isMobile.value = true;
  }
  loadUsers();
  loadMessagesOfUser(selectedUserId.value);
};

onMounted(initilize);

const sendMessage = async (userId) => {
  let trimmedMessage = message.value.trim();
  if (trimmedMessage === "") return;
  const body = {
    userId: 0,
    content: trimmedMessage,
    toUserId: userId,
  };

  try {
    await axios.post("http://localhost:3000/chat/message", body);
  } catch (e) {}
  message.value = "";
  loadMessagesOfUser(userId);
};

const deleteMessage = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/chat/message/${id}`);
    loadMessagesOfUser(selectedUserId.value);
  } catch (e) {}
};

const editMessage = async (id) => {
  let trimmedMessage = message.value.trim();
  if (trimmedMessage === "") return;

  try {
    await axios.patch(`http://localhost:3000/chat/message/${id}`, {
      content: trimmedMessage,
    });

    message.value = "";
    loadMessagesOfUser(selectedUserId.value);
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

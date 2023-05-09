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
            'bg-gray-800': selectedConversation == index,
            'hover:cursor-pointer hover:border-2 hover:border-cyan-300 duration-100':
              !isMobile,
          }"
          @click="setSelectedConversation(index)"
        >
          <img
            class="w-8 h-8 rounded-full border-cyan-300 border-2"
            :src="user.avatarUrl"
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
        <li
          v-for="(item, index) in conversations[selectedConversation]"
          class="flex text-white"
        >
          <ChatBubble
            :name="users[item.userId] ? users[item.userId].name : ''"
            :isMe="checkIfMe(item)"
            :message="item.content"
            :avatarUrl="users[item.userId] ? users[item.userId].avatarUrl : ''"
            :time="item.time"
          ></ChatBubble>
        </li>
      </ul>
    </div>

    <div class="flex justify-between">
      <input
        class="fixed right-10 z-90 bottom-10 left-5 bg-gray-700 py-3 rounded-lg pl-2 outline-none text-gray-300"
        placeholder="type something"
        v-model="message"
      />
      <button
        class="fixed z-90 bottom-10 right-4 bg-[#12e675] p-3 px-4 rounded-lg"
        :class="{ 'hover:opacity-80 duration-200': !isMobile }"
        @click="sendMessage"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script setup>
import ChatBubble from "./components/ChatBubble.vue";
import { ref, onMounted, computed } from "vue";

const selectedConversation = ref(0);

const users = ref([
  {
    name: "John Doe",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "كرار محمد",
    avatarUrl: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    name: "ژیار عقراوي",
    avatarUrl: "https://randomuser.me/api/portraits/men/6.jpg",
  },
]);

const conversations = ref([
  [
    {
      userId: 0,
      content: "Hi, how are doing",
      time: getTime(),
    },
    {
      userId: null,
      content: "Good, and you",
      time: getTime(),
    },
  ],
  [
    {
      userId: 1,
      content: "مرحبا, شونك",
      time: getTime(),
    },
    {
      userId: null,
      content: "الحمدلله, انت شونك",
      time: getTime(),
    },
  ],
  [
    {
      userId: 2,
      content: "چەوانی باشی",
      time: getTime(),
    },
    {
      userId: null,
      content: "ئەز باشم، تۆ چەوانی",
      time: getTime(),
    },
  ],
]);

function checkIfMe(message) {
  return message.userId == null;
}

function setSelectedConversation(index) {
  selectedConversation.value = index;
}

const message = ref("");
const isMobile = ref(false);

const checkIfMobile = () => {
  if (window.innerWidth <= 1080) {
    isMobile.value = true;
  }
};

onMounted(checkIfMobile);

function sendMessage() {
  let trimmedMessage = message.value.trim();
  if (trimmedMessage === "") return;

  conversations.value[selectedConversation.value].push({
    name: null,
    content: trimmedMessage,
    time: getTime(),
  });
  message.value = "";
}

function getTime() {
  const dateObj = new Date();
  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes();
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

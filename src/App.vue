<template>
  <div
    class="flex flex-col justify-between h-screen w-screen bg-gray-900 no-scrollbar::-webkit-scrollbar no-scrollbar content"
  >
    <ul class="flex-1 ml-0 pb-[6rem]" :class="{ 'ml-5': !isMobile }">
      <li v-for="(item, index) in messages" class="flex">
        <ChatBubble
          :name="item.name"
          :isMe="item.isMe"
          :message="item.message"
          :avatarUrl="item.avatarUrl"
          :time="item.time"
        ></ChatBubble>
      </li>
    </ul>

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
        send
      </button>
    </div>
  </div>
</template>

<script setup>
import ChatBubble from "./components/ChatBubble.vue";
import { ref, onMounted } from "vue";

const messages = ref([
  {
    name: "John Doe",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    message:
      "Hello, World!!!!!!! !!!!!! !!!!!! !!!!! !!!!! !!!!! !!!! !!!!!!!!! !!!!!! !!!!! !!!!!",
    isMe: false,
    time: getTime(),
  },
  {
    name: "",
    avatarUrl: "",
    message: "How are you today",
    isMe: true,
    time: getTime(),
  },
  {
    name: "Jane Smith",
    avatarUrl: "https://randomuser.me/api/portraits/women/3.jpg",
    message: "Hello There",
    isMe: false,
    time: getTime(),
  },
  {
    name: "",
    avatarUrl: "",
    message:
      "Testing overflowwww wwwww wwww wwwww wwwww wwwwwwww wwwww wwwww wwwwwww ",
    isMe: true,
    time: getTime(),
  },
]);

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

  messages.value.push({
    name: "",
    avatarUrl: "",
    message: trimmedMessage,
    isMe: true,
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

@media (max-width: 1080px) {
  p {
    font-size: 14px;
    max-width: 100%;
    word-break: break-word;
  }
}
</style>

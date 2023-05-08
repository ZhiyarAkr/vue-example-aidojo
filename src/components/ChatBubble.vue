<template>
  <div class="mt-5 mobile-right" :class="{ 'ml-auto mr-2': isMe }">
    <div class="flex">
      <img
        v-if="!isMe"
        class="w-14 h-14 rounded-full mobile-left border-cyan-300 border-2"
        :src="avatarUrl"
        alt="avatar"
      />
      <div class="flex flex-col mobile-left">
        <p v-if="!isMe" class="font-bold text-gray-100 ml-2">
          {{ name }}
        </p>
        <p
          class="break-words bg-[#12e675] max-w-sm px-4 py-2 rounded-lg text-gray-300"
          :class="{
            'text-gray-900 rounded-tr-none': isMe,
            'bg-gray-800 rounded-tl-none': !isMe,
          }"
        >
          {{ message }}
        </p>
        <p class="text-gray-400 text-xs" :class="{ 'ml-auto': !isMe }">
          {{ time }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
  avatarUrl: String,
  message: String,
  isMe: Boolean,
  time: String,
});
</script>

<style scoped>
.rounded-tr-none {
  border-top-right-radius: 0rem;
}

.rounded-tl-none {
  border-top-left-radius: 0rem;
}

@media (max-width: 1080px) {
  p {
    font-size: 14px;
    max-width: 100%;
    word-break: break-word;
  }

  .mobile-right {
    margin-right: 0.25rem;
  }
  .mobile-left {
    margin-left: 0.25rem;
  }
}
</style>
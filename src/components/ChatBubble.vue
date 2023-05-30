<template>
  <div :class="{ 'ml-auto': isMe }">
    <div class="flex">
      <img
        v-if="!isMe"
        class="w-14 h-14 rounded-full border-cyan-300 border-2"
        :src="avatarUrl"
        alt="avatar"
      />
      <div class="flex flex-col">
        <div class="flex">
          <p v-if="!isMe" class="font-bold text-gray-100 ml-2">
            {{ name }}
          </p>
          <p
            class="text-red-300 hover:cursor-pointer hover:underline"
            :class="{ 'ml-5': !isMe }"
            @click="onDelete"
          >
            Delete
          </p>
          <p
            class="text-blue-300 hover:cursor-pointer hover:underline ml-2"
            @click="onEdit"
          >
            Edit
          </p>
        </div>
        <p
          class="break-words bg-[#12e675] max-w-sm px-4 py-2 rounded-lg text-gray-300"
          :class="{
            'text-gray-900 rounded-tr-none': isMe,
            'bg-gray-700 rounded-tl-none m-1': !isMe,
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
  id: Number,
});

const emit = defineEmits(["onDelete", "onEdit"]);

const onDelete = () => {
  emit("onDelete", props.id);
};

const onEdit = () => {
  emit("onEdit", props.id);
};
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
}
</style>

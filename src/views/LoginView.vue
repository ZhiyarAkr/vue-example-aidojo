<template>
  <div class="h-screen w-full flex justify-center items-center">
    <div class="bg-gray-800 rounded-lg p-4 w-1/4 flex flex-col text-black">
      <p v-if="errorMessage != null" class="text-red-500">
        {{ errorMessage }}
      </p>

      <div class="flex flex-col mb-2">
        <label class="text-gray-300" for="username">Username</label>
        <input
          id="username"
          class="border-2 border-[#12e675] text-gray-300 rounded-lg p-2 outline-none bg-gray-700"
          v-model="form.username"
          type="text"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label class="text-gray-300" for="password">Password</label>
        <input
          id="password"
          type="password"
          class="border-2 border-[#12e675] text-gray-300 rounded-lg p-2 outline-none bg-gray-700"
          v-model="form.password"
        />
      </div>

      <button
        @click="login"
        class="bg-[#12e675] text-gray-950 mt-2 rounded-lg px-4 py-3"
      >
        Login
      </button>
      <div class="text-gray-300 pt-3">
        Don't have an account
        <a href="#/auth/signup">
          <span class="text-[#12e675] hover:cursor-pointer">Sign Up</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import remote from "../util/remote";
import { useRouter } from "vue-router";

const router = useRouter();
const errorMessage = ref();
const form = ref({
  username: "",
  password: "",
});
const login = async () => {
  errorMessage.value = null;
  for (let key in form.value) {
    if (form.value[key] == "") {
      // alert(`The field: ${key} is required`);
      // return;
    }
  }
  try {
    const { data } = await remote.post("/auth/login", {
      ...form.value,
    });
    localStorage.setItem("accessToken", data.token);

    router.push({ name: "home" });
  } catch (e) {
    console.log(e);
    // errorMessage.value = e.response.data.message;
  }
};
</script>

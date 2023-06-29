<template>
  <div class="h-screen w-full flex justify-center items-center">
    <div class="bg-gray-800 rounded-lg p-4 w-1/4 flex flex-col text-black">
      <p v-if="errorMessage != null" class="text-red-500">
        {{ errorMessage }}
      </p>
      <div class="flex flex-col mb-2">
        <label class="text-gray-300" for="firstName">First Name</label>
        <input
          id="firstName"
          class="border-2 border-[#12e675] rounded-lg p-2 outline-none bg-gray-700 text-gray-300"
          v-model="form.firstName"
          type="text"
        />
      </div>
      <div class="flex flex-col mb-2">
        <label class="text-gray-300" for="lastName">Last Name</label>
        <input
          id="lastName"
          class="border-2 border-[#12e675] rounded-lg p-2 outline-none bg-gray-700 text-gray-300"
          v-model="form.lastName"
          type="text"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label class="text-gray-300" for="username">Username</label>
        <input
          id="username"
          class="border-2 border-[#12e675] rounded-lg p-2 outline-none bg-gray-700 text-gray-300"
          v-model="form.username"
          type="text"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label class="text-gray-300" for="password">Password</label>
        <input
          id="password"
          type="password"
          class="border-2 border-[#12e675] rounded-lg p-2 outline-none bg-gray-700 text-gray-300"
          v-model="form.password"
        />
      </div>

      <button
        @click="signup"
        class="bg-[#12e675] text-gray-950 mt-2 rounded-lg px-4 py-3"
      >
        Signup
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import remote from "../util/remote";
import { useRouter } from "vue-router";

const router = useRouter();
const errorMessage = ref();
const form = ref({
  firstName: "",
  lastName: "",
  username: "",
  password: "",
});
const signup = async () => {
  errorMessage.value = null;
  for (let key in form.value) {
    if (form.value[key] == "") {
      // alert(`The field: ${key} is required`);
      // return;
    }
  }
  const backdropPath = "4.jpg";
  try {
    const { data } = await remote.post("/auth/signup", {
      ...form.value,
      profileBackDropPath: backdropPath,
    });
    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    router.push({ name: "home" });
  } catch (e) {
    errorMessage.value = e.response.data.message;
  }
  console.log({ ...form.value });
};
</script>

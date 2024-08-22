<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const apiUrl = 'https://todolist-api.hexschool.io'
const signUpData = ref({
  email: 'terryd@kali.org',
  password: 'terryd123',
  nickname: 'Terry.D'
})
const passwordCheck = ref('terryd123')
const errMsg = ref('')

const signUp = () => {
  axios
    .post(apiUrl + '/users/sign_up', signUpData.value)
    .then(() => {
      errMsg.value = '註冊成功'
      setTimeout(() => {
        router.push('/')
      }, 500)
    })
    .catch((error) => {
      errMsg.value = '錯誤: ' + error.response.data.message
    })
}
</script>

<template>
  <!-- sign up -->
  <div id="signUpPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer">
      <div class="side">
        <a href="#"
          ><img
            class="logoImg"
            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
            alt=""
        /></a>
        <img
          class="d-m-n"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
          alt="workImg"
        />
      </div>
      <div>
        <form class="formControls">
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            required
            v-model="signUpData.email"
          />
          <label class="formControls_label" for="name">您的暱稱</label>
          <input
            class="formControls_input"
            type="text"
            name="name"
            id="name"
            placeholder="請輸入您的暱稱"
            v-model="signUpData.nickname"
          />
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            required
            v-model="signUpData.password"
          />
          <label class="formControls_label" for="pwd">再次輸入密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwdchk"
            id="pwdchk"
            placeholder="請再次輸入密碼"
            required
            v-model="passwordCheck"
          />
          <span v-if="signUpData.password != passwordCheck">請確認密碼</span>
          <button type="button" class="formControls_btnSubmit" @click="signUp">註冊</button>
          <span v-if="errMsg != ''">{{ errMsg }}</span>
        </form>
      </div>
    </div>
  </div>
</template>

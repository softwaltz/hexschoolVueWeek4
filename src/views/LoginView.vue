<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useStateStore } from '@/store/stateStore'
import { useRouter } from 'vue-router'

const state = useStateStore()
const apiUrl = 'https://todolist-api.hexschool.io'

const signInData = ref({
  email: 'terryd@kali.org',
  password: 'terryd123'
})
const errMsg = ref('')
const router = useRouter()

const login = async () => {
  await axios
    .post(apiUrl + '/users/sign_in', signInData.value)
    .then((resp) => {
      state.nickname = resp.data.nickname
      state.exp = resp.data.exp
      state.status = resp.data.status
      state.token = resp.data.token

      document.cookie = `hexschoolTodo=${state.token}`

      setTimeout(() => {
        router.push('/todo')
      }, 300)
      errMsg.value = ''
    })
    .catch((error) => {
      if (error.response === undefined) {
        errMsg.value = error.message
      } else {
        errMsg.value = error.response.data.message
      }
      signInData.value.email = ''
      signInData.value.password = ''
    })
}
</script>

<template>
  <div id="loginPage" class="bg-yellow">
    <div class="conatiner loginPage vhContainer">
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
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            required
            v-model="signInData.email"
          />
          <span v-if="signInData.email == ''">此欄位不可留空</span>
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            required
            v-model="signInData.password"
          />
          <input class="formControls_btnSubmit" type="button" value="登入" @click="login" />
          <span v-if="errMsg != ''">錯誤: {{ errMsg }}</span>
          <a class="formControls_btnLink" href="#signup">註冊帳號</a>
        </form>
      </div>
    </div>
  </div>
</template>

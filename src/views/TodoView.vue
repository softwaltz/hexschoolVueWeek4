<script setup>
import { useStateStore } from '@/store/stateStore'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const stateStore = useStateStore()
const apiUrl = 'https://todolist-api.hexschool.io'

const todos = ref('')

const getAllTodos = () => {
  axios
    .get(apiUrl + '/todos', {
      headers: {
        Authorization: stateStore.token
      }
    })
    .then((resp) => {
      todos.value = resp.data.data
      todos.value.forEach((todo) => {
        todo.tmpContent = todo.content
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

const newTodo = ref({
  content: ''
})
const addNewTodo = () => {
  if (newTodo.value.content != '') {
    axios
      .post(apiUrl + '/todos', newTodo.value, {
        headers: {
          Authorization: stateStore.token
        }
      })
      .then(() => {
        getAllTodos()
        newTodo.value.content = ''
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

const todoTab = ref('all')
const filtedTodos = computed(() => {
  return 0
})

onMounted(() => {
  getAllTodos()
})
</script>

<template>
  <!-- ToDo List -->
  <div id="todoListPage" class="bg-half">
    <nav>
      <h1><a href="#">ONLINE TODO LIST</a></h1>
      <ul>
        <li class="todo_sm">
          <a href="#/todo"
            ><span>{{ stateStore.nickname }} 的代辦</span>
          </a>
        </li>
        <li><a href="#loginPage">登出</a></li>
      </ul>
    </nav>
    todo: {{ todos }}
    <div class="conatiner todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input type="text" placeholder="請輸入待辦事項" v-model="newTodo.content" />
          <a @click="addNewTodo">
            <i class="fa fa-plus"></i>
          </a>
        </div>
        <div class="todoList_list">
          <ul class="todoList_tab">
            <li><a :class="{ active: todoTab == 'all' }">全部</a></li>
            <li><a :class="{ active: todoTab == 'incomplete' }">待完成</a></li>
            <li><a :class="{ active: todoTab == 'done' }">已完成</a></li>
          </ul>
          <div class="todoList_items">
            <ul class="todoList_item">
              <li>
                <label class="todoList_label">
                  <input class="todoList_input" type="checkbox" value="true" />
                  <span>把冰箱發霉的檸檬拿去丟</span>
                </label>
                <a href="#">
                  <i class="fa fa-times"></i>
                </a>
              </li>
              <li>
                <label class="todoList_label">
                  <input class="todoList_input" type="checkbox" value="true" />
                  <span>打電話叫媽媽匯款給我</span>
                </label>
                <a href="#">
                  <i class="fa fa-times"></i>
                </a>
              </li>
              <li>
                <label class="todoList_label">
                  <input class="todoList_input" type="checkbox" value="true" />
                  <span>整理電腦資料夾</span>
                </label>
                <a href="#">
                  <i class="fa fa-times"></i>
                </a>
              </li>
              <li>
                <label class="todoList_label">
                  <input class="todoList_input" type="checkbox" value="true" />
                  <span>繳電費水費瓦斯費</span>
                </label>
                <a href="#">
                  <i class="fa fa-times"></i>
                </a>
              </li>
              <li>
                <label class="todoList_label">
                  <input class="todoList_input" type="checkbox" value="true" />
                  <span>約vicky禮拜三泡溫泉</span>
                </label>
                <a href="#">
                  <i class="fa fa-times"></i>
                </a>
              </li>
              <li>
                <label class="todoList_label">
                  <input class="todoList_input" type="checkbox" value="true" />
                  <span>約ada禮拜四吃晚餐</span>
                </label>
                <a href="#">
                  <i class="fa fa-times"></i>
                </a>
              </li>
            </ul>
            <div class="todoList_statistics">
              <p>5 個已完成項目</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

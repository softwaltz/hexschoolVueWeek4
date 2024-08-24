<script setup>
import { useStateStore } from '@/store/stateStore'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const stateStore = useStateStore()
const apiUrl = 'https://todolist-api.hexschool.io'
const router = useRouter()

const todos = ref([])

const getAllTodos = async () => {
  await axios
    .get(apiUrl + '/todos', {
      headers: {
        Authorization: stateStore.token
      }
    })
    .then((resp) => {
      todos.value = resp.data.data
      todos.value.forEach((todo) => {
        todo.tmpContent = todo.content
        todo.editState = false
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

const deleteTodo = async (id) => {
  await axios
    .delete(apiUrl + '/todos/' + id, {
      headers: {
        Authorization: stateStore.token
      }
    })
    .then(() => {
      getAllTodos()
    })
    .catch((error) => {
      console.log(error)
    })
}

const updateTodo = async (todo) => {
  await axios
    .put(
      apiUrl + '/todos/' + todo.id,
      {
        content: todo.tmpContent
      },
      {
        headers: {
          Authorization: stateStore.token
        }
      }
    )
    .then(() => {
      getAllTodos()
    })
    .catch((error) => {
      console.log(error)
    })
}

const signOut = () => {
  const tokenInCookie = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexschoolTodo\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  )
  axios
    .post(
      apiUrl + '/users/sign_out',
      {},
      {
        headers: {
          Authorization: tokenInCookie
        }
      }
    )
    .then(() => {
      document.cookie = `hexschoolTodo=`

      setTimeout(() => {
        router.push('/')
      }, 100)
    })
    .catch((error) => {
      console.log(error)
    })
}

const toggleStatus = async (id) => {
  await axios
    .patch(
      apiUrl + '/todos/' + id + '/toggle',
      {},
      {
        headers: {
          Authorization: stateStore.token
        }
      }
    )
    .then(() => {
      getAllTodos()
    })
    .catch((error) => {
      console.log(error)
    })
}

const todoTab = ref('all')
const filtedTodos = computed(() => {
  let tmpTodos = []
  if (todoTab.value == 'all') {
    return todos.value
  } else if (todoTab.value == 'done') {
    todos.value.forEach(t => {
      if (t.status == true) {
        tmpTodos.push(t)
      }
    })
    return tmpTodos
  } else if (todoTab.value == 'incomplete') {
    todos.value.forEach(t => {
      if (t.status == false) {
        tmpTodos.push(t)
      }
    })
    return tmpTodos
  }
  return tmpTodos
})
const countDone = computed(() => {
  let count = 0;
  todos.value.forEach(t => {
    if (t.status == true) {
      count++
    }
  });
  return count
})
const countIncomplete = computed(() => {
  let count = 0;
  todos.value.forEach(t => {
    if (t.status == false) {
      count++
    }
  });
  return count
})

onMounted(async () => {
  await getAllTodos()

  if (todos.value.length < 5 ) {
    let todos = ['範例1', '範例2', '範例3', '範例4', '範例5']
    for (let t of todos) {
      console.log(t)
      await axios
        .post(apiUrl + '/todos', { "content": t }, {
          headers: {
            Authorization: stateStore.token
          }
        })
    }
  }
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
        <li><a @click="signOut">登出</a></li>
      </ul>
    </nav>
    <div class="conatiner todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input type="text" placeholder="請輸入待辦事項" v-model="newTodo.content" />
          <a @click="addNewTodo">
            <i class="fa fa-plus"></i>
          </a>
        </div>
        <div class="todoList_list" v-if="todos.length > 0">
          <ul class="todoList_tab">
            <li><a :class="{ active: todoTab == 'all' }" @click="todoTab = 'all'">全部</a></li>
            <li><a :class="{ active: todoTab == 'incomplete'}" @click="todoTab = 'incomplete'">待完成</a></li>
            <li><a :class="{ active: todoTab == 'done' }" @click="todoTab = 'done'">已完成</a></li>
          </ul>
          <div class="todoList_items">
            <ul class="todoList_item">
              <li v-for="(todo, index) in filtedTodos" :key="index">
                <label class="todoList_label" @click="toggleStatus(todo.id)" v-if="todo.editState == false">
                  <input class="todoList_input" type="checkbox" v-model="todo.status" />
                  <span >{{ todo.content }}</span>
                </label>
                <div v-if="todo.editState == false">
                  <a @click="todo.editState = !todo.editState">
                    <i class="fa fa-times">📝</i>
                  </a>
                  <a><hr/></a>
                  <a @click="deleteTodo(todo.id)">
                    <i class="fa fa-times">❌</i>
                  </a>
                </div>
                <label class="todoList_label" v-if="todo.editState == true">
                  <span v-if="todo.editState == true">
                    <input style="width: 200%;" v-model="todo.tmpContent"/>
                  </span>
                </label>
                <div v-if="todo.editState == true">
                  <a @click="updateTodo(todo)">
                    <i class="fa fa-times">✅</i>
                  </a>
                  <a><hr/></a>
                  <a @click="todo.editState = !todo.editState">
                    <i class="fa fa-times">❎</i>
                  </a>
                </div>
              </li>
            </ul>
            <div class="todoList_statistics">
              <p v-if="todoTab=='done'">{{ countDone }} 個已完成項目。</p>
              <p v-else-if="todoTab=='incomplete'">{{ countIncomplete }} 個未完成項目。</p>
              <p v-if="todoTab=='all'">{{ countDone }} 個已完成項目，{{ countIncomplete }} 個未完成項目。</p>
            </div>
          </div>
        </div>
        <div v-else>
          <div>目前尚無待辦事項</div>
        </div>
      </div>
    </div>
  </div>
</template>

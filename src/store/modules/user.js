import { getInfo } from '@/api/user'
import { getToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, defaultRoute } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    userId: '',
    avatar: '',
    menu: []
  }
}

const state = getDefaultState()

const mutations = {
  // RESET_STATE: (state) => {
  //   Object.assign(state, getDefaultState())
  // },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERINFO: (state, getUserInfo) => {
    state.getUserInfo = getUserInfo
  }
}

const actions = {
  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { account, userId, permissionVoList = [] } = data
        commit('SET_NAME', account)
        commit('SET_USERID', userId)
        let newRoute = filterAsyncRoutes(asyncRoutes, permissionVoList)
        const r = JSON.parse(JSON.stringify(defaultRoute))
        r[0].redirect = newRoute[0].redirect
        newRoute = [...r, ...newRoute]
        commit('SET_MENU', newRoute)
        resolve(newRoute)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_NAME')
      commit('SET_USERID')
      commit('SET_MENU')
      removeToken() // must remove  token  first
      resetRouter()
      resolve()
      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export function filterAsyncRoutes(arr1, arr2) {
  const res = []
  const routes = arr1 || []
  const menus = arr2 || []
  routes.forEach((route) => {
    if (route.hidden) {
      res.push(route)
    } else {
      menus.forEach((menu) => {
        if (route.meta && route.meta.title === menu.permissionName) {
          if (menu.permissionList && menu.permissionList.length) {
            route.children = filterAsyncRoutes(route.children, menu.permissionList)
          }
          res.push(route)
        }
      })
    }
  })
  return res
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


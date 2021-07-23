const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  menu: state => state.user.menu,
  name: state => state.user.name,
  getUserInfo: state => state.user.getUserInfo
}
export default getters

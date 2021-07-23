// url为服务端返回的流数据
export const exportParams = (url) => {
  try {
    const aLink = document.createElement('a')
    aLink.style.display = 'none'
    aLink.href = url
    document.body.appendChild(aLink)
    aLink.setAttribute('download', '用户数据.xlsx')
    aLink.click()
    document.body.removeChild(aLink)
  } catch (e) {
    console.log(e)
  }
}

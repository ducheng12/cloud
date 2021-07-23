import defaultSettings from '@/settings'

const title = defaultSettings.title || '云档口管理后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

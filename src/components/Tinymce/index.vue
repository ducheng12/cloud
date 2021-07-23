<template>
  <div :class="{ fullscreen: fullscreen }" class="tinymce-container" :style="{ width: containerWidth }">
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/cms-site/feature/component/rich-editor.html#tinymce
 */
// import editorImage from './components/EditorImage'
import axios from 'axios'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
// import { PublicUploadFileItem } from '@/api/PublicServices';

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  // components: { editorImage },
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    introductions: { type: String, default: '' }
  },
  data() {
    return {
      uploadfiles: {},
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      allimgurls: [],
      languageTypeList: {
        en: 'en',
        zh: 'zh_CN',
        es: 'es_MX',
        ja: 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    cshk(data) {
      for (let i = 0; i < this.allimgurls.length; i++) {
        this.$emit('imgurl', this.allimgurls[i])
      }
    },
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, err => {
        if (err) {
          this.$message.error(err.message)
          return
        }

        this.initTinymce()
      })
    },
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList['zh'],
        height: this.height,
        disolay: 'block',
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,

        // 图片上传
        images_upload_handler: function(blobInfo, success, failure) {
          var file = blobInfo.blob();//转化为易于理解的file对象
          if (file.size / 1024 / 1024 > 2) {
            _this.$message({message:'上传图片不能大于2M !', type: 'warning',customClass: 'zZindex'});
            document.getElementsByClassName("mce-throbber")[0].setAttribute("style", "display:none")
            document.getElementById("mce-modal-block").style.zIndex = "99"
            return
          }
          var formData = new FormData();
          formData.append('file', file, file.name);//此处与源文档不一样
          formData.append('useDay', 1);
//        formData.append('path', 'middleground/storeclass');
          formData.append('path', 1)
          formData.append('fileType', 1)
          axios.post(`${process.env.VUE_APP_FILE_URL}/file/uploadFile`, formData).then(data => {
            if (data.data.code === 200) {
              success(data.data.data.ip + '/' + data.data.data.fileUrl)
            } else {
              failure(data.msg)
            }
          }).catch(error => {
            failure(error)
          })
        },

        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.introductions) {
            editor.setContent(_this.introductions)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', e => {
            _this.fullscreen = e.state
          })
        },
        // it will try to keep these URLs intact
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        convert_urls: false
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK() {
      // 如果存在则是编辑进来，不存在是新增
      this.$nextTick(() => {
        window.tinymce.get(this.tinymceId).setContent(this.introductions)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}
.zZindex {
  z-index: 9000!important;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
</style>

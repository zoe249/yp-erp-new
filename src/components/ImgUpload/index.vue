<template>
  <div class="img-upload-wrap">
    <el-upload
      class="upload-demo"
      :action="actionInfo.uploadUrl"
      :data="actionInfo.data"
      :headers="actionInfo.headers"
      :method="method"
      :multiple="multiple"
      :name="name"
      :is-avatar="isAvatar"
      :show-file-list="showFileList"
      :drag="drag"
      :accept="accept"
      :list-type="listType"
      :disabled="disabled"
      :limit="limit"
      :auto-upload="autoUpload"
      :is-show-tip="isShowTip"
      :file-size="fileSize"
      :file-list="fileList"
      :before-upload="handleBeforeUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
    >
      <template v-if="isAvatar">
        <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
        <i-ep-plus v-else></i-ep-plus>
      </template>
      <!-- 插槽默认上传按钮，可自定义 -->
      <template v-if="listType !== 'picture-card'">
        <slot>
          <el-button>上传图片</el-button>
        </slot>
      </template>
      <!-- 如果是picture-card，则展示为+ icon -->
      <template v-if="listType === 'picture-card' && !isAvatar">
        <i-ep-plus></i-ep-plus>
      </template>
      <!-- 上传提示 -->
      <template v-if="isShowTip" #tip>
        <div class="el-upload__tip">
          请上传
          <span>
            大小不超过 <strong class="tip-color">{{ fileSize }}MB；</strong>
          </span>
          <span>
            格式为 <strong class="tip-color">{{ accept }}</strong>
          </span>
          的图片
        </div>
      </template>
    </el-upload>
    <!-- 预览图片 -->
    <el-image-viewer
      v-if="state.dialogVisible"
      :src="state.previewSrc"
      :url-list="state.previewSrcList"
      fit="cover"
      @close="closeViewer"
    ></el-image-viewer>
  </div>
</template>

<script setup lang="ts" name="imgUpload">
import { getQiniu } from './api'
import type { UploadUserFile, UploadProps } from 'element-plus'
import { useProxy } from '@/utils/proxy'
interface Propstype {
  method?: string // 上传的请求方法
  multiple?: boolean // 是否多选
  isAvatar?: boolean // 是否头像，如果是上传头像功能，上传一张后不允许再显示+
  avatarUrl?: string // 头像地址
  name?: string // 上传的文件字段名
  showFileList?: boolean // 是否显示上传文件列表 如果是头像置为false
  drag?: boolean // 是否启用拖拽上传
  accept?: string // 允许上传的文件类型
  listType?: 'text' | 'picture' | 'picture-card' // 文件列表的类型 'text' | 'picture' | 'picture-card'
  disabled?: boolean // 是否禁用上传
  limit?: number // 上传个数限制
  autoUpload?: boolean // 是否自动上传
  isShowTip?: boolean //  是否显示提示
  fileSize?: number // 文件大小
  fileList?: UploadUserFile[] // 文件列表
}
interface Istate {
  dialogVisible?: boolean
  previewSrc?: string | undefined
  previewSrcList?: string[]
}
const props = withDefaults(defineProps<Propstype>(), {
  method: 'post',
  multiple: false,
  isAvatar: false,
  avatarUrl: '',
  name: 'file',
  showFileList: true,
  drag: false,
  limit: 1,
  accept: '.png,.jpg,.jpeg',
  listType: 'picture-card',
  disabled: false,
  autoUpload: true,
  isShowTip: true,
  fileSize: 5,
  fileList: [] as any
})
const emits = defineEmits(['handleSuccess'])
const { proxy } = useProxy()
const state = reactive<Istate>({
  dialogVisible: false,
  previewSrc: '',
  previewSrcList: []
})
const actionInfo = reactive<any>({
  uploadUrl: '',
  cdnDomainName: '',
  headers: {
    token: ''
  },
  data: {
    key: '',
    token: '', // 七牛云token
    data: {}
  }
})
const getQiniuInfo = () => {
  getQiniu().then((res: any) => {
    if (res.code === '200000') {
      let _res = res.data
      actionInfo.uploadUrl = _res.uploadUrl
      actionInfo.headers.token = _res.qiniuToken
      actionInfo.data.token = _res.qiniuToken
      actionInfo.cdnDomainName = _res.cdnDomainName
    }
  })
}
const handleBeforeUpload: UploadProps['beforeUpload'] = (uploadFile): any => {
  // 校验文件格式
  let accepts = props.accept
  if (accepts.length) {
    const fileName = uploadFile.name.split('.')
    const fileExt = fileName[fileName.length - 1]
    const isTypeOk = props.accept.indexOf(fileExt) >= 0
    if (!isTypeOk) {
      proxy.$message.msgError(`文件格式不正确, 请上传${props.accept}格式文件!`)
      return false
    }
  }
  // 校验文件大小
  if (uploadFile.size) {
    let size = uploadFile.size / 1024 / 1024
    if (size > props.fileSize) {
      proxy.$message.msgError(`请上传大小不超过 ${props.fileSize} MB的文件`)
      return false
    }
  }
  actionInfo.data.data = uploadFile
  actionInfo.data.key = uploadFile.uid
}
// 预览图片
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  state.previewSrcList = []
  state.dialogVisible = true
  state.previewSrcList.push(uploadFile.url!)
  state.previewSrc = uploadFile.url!
}
const closeViewer = () => {
  state.dialogVisible = false
}
const handleRemove: UploadProps['onRemove'] = (uploadFile) => {
  console.log(uploadFile)
}
const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile): any => {
  const imgUrl = `${actionInfo.cdnDomainName}/${response.key}`
  emits('handleSuccess', imgUrl)
}
const handleError: UploadProps['onError'] = (uploadFile) => {
  proxy.$message.msgError('上传失败，请重新上传!！')
}
const handleExceed = () => {
  proxy.$message.msgWarning(`上传文件数量不能超过 ${props.limit} 个!`)
}
onMounted(() => {
  getQiniuInfo()
})
</script>

<style scoped lang="scss">
.el-upload__tip {
  font-size: 12px;
}
.upload-demo {
  :deep(.el-upload-list) {
    // 图片列表大小
    .el-upload-list__item {
      width: 100px;
      height: 100px;
      border-radius: 6px;
    }
  }
  // picture-card格式icon大小
  :deep(.el-upload) {
    width: 100px;
    height: 100px;
    border-radius: 6px;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 6px;
    display: block;
  }
}
.tip-color {
  color: #f56c6c;
}
</style>

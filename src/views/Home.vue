<template>
  <div class="Home-root">
    <div class="root-in">
      <div class="pic-box" ref="picBox">
        <span
          id="pendant"
          class="pendant"
          :style="{ backgroundImage: 'url(' + selectedItem.url + ')' }"
        ></span>
        <div class="pic">
          <van-image :src="imageBase64" alt="上传的图" v-show="imageBase64" />
        </div>
      </div>
      <div class="handle-box">
        <div class="pendant-in">
          <div class="pendant-list">
            <div
              class="tp"
              :class="{ 'tp-hover': item.uid == selectedItem.uid }"
              v-for="item in pendantList"
              :key="item.id"
              @click="bindSelectedItem(item)"
            >
              <div class="tp-in">
                <van-image :src="item.url" alt="挂饰图" />
              </div>
            </div>
          </div>
        </div>
        <p>{{ screen }}</p>
        <div class="foot-in">
          <van-row :gutter="10">
            <van-col :span="6">
              <div class="upload-btn">
                <van-button type="primary">{{
                  !imageBase64 ? '上传图片' : '重新上传'
                }}</van-button>
                <input
                  id="file"
                  class="file"
                  type="file"
                  accept="image/*"
                  @change="handleChange"
                />
              </div>
            </van-col>
            <van-col :span="6">
              <van-button type="danger" @click="handleReset"
                >重置位置</van-button
              ></van-col
            >
            <van-col :span="6">
              <van-button
                type="success"
                :loading="btnLoading"
                :disabled="btnLoading"
                loading-text="合成中..."
                @click="hanldePrints"
                >合成图片</van-button
              ></van-col
            >
            <van-col :span="6">
              <van-button type="warning" @click="hanldePreview"
                >预览图片</van-button
              ></van-col
            >
          </van-row>
        </div>
      </div>
    </div>
  </div>

  <van-dialog
    className="v-dialog"
    v-model:show="show"
    title="预览图片"
    :show-confirm-button="false"
    :closeOnClickOverlay="true"
  >
    <div class="pic-content" ref="picPreview">
      <img :src="imageCanvas" alt="" style="max-width: 100%" />
    </div>
  </van-dialog>
</template>

<script>
import { getCurrentInstance, ref, reactive, onMounted } from 'vue'
import { Drag } from '@/utils/hammerDrag'
import html2canvas from 'html2canvas'
import pendant01 from '@/assets/images/pendant01.png'
import pendant02 from '@/assets/images/pendant02.png'
import pendant03 from '@/assets/images/pendant03.png'
import pendant04 from '@/assets/images/pendant04.png'
import pendant05 from '@/assets/images/pendant05.png'
import pendant06 from '@/assets/images/pendant06.png'
import pendant07 from '@/assets/images/pendant07.png'
import pendant08 from '@/assets/images/pendant08.png'
export default {
  name: 'Home',
  setup() {
    let { proxy } = getCurrentInstance()
    let picBox = ref(null), //picBox
      imageBase64 = ref(''), //file图
      imageCanvas  = ref(''), //生成的canvas截图
      pendantList = reactive(list), //挂饰列表
      selectedItem = reactive({}), //选中项
      btnLoading = ref(false), //按钮状态
      show = ref(false) //预览图弹窗状态

    //初始化
    const init = () => {
        if (document.querySelector('#pendant')) {
          Drag('#pendant')
        }
      },
      //选择挂饰
      bindSelectedItem = (item) => {
        Object.assign(proxy, Object.assign(selectedItem, item))
      },
      //上传照片-本地
      handleChange = () => {
        const file = document.getElementById('file').files[0]
        fileToBase64(file).then((res) => {
          imageBase64.value = res
        })
      },
      //重置位置
      handleReset = () => {
        Drag('#pendant', { isReset: true })
      },
      //生成截图
      hanldePrints = () => {
        if (!imageBase64.value) {
          proxy.$toast('请先上传图片哦！')
          return
        }
        proxy.$dialog
          .confirm({
            title: '温馨提示',
            message: '亲，您确定要合成当前图片吗？',
          })
          .then(() => {
            btnLoading.value = true
            setTimeout(() => {
              html2canvas(picBox.value).then((canvas) => {
                imageCanvas.value = canvas.toDataURL('image/png')
                btnLoading.value = false
                proxy.$toast.success('图片合成成功！')
              })
            }, 0.5e3)
          })
          .catch(() => {
            // on cancel
          })
      },
      //预览生成图
      hanldePreview = () => {
        if (!imageBase64.value) {
          proxy.$toast('没有可预览的图片！')
          return
        }
        show.value = true
      }

    onMounted(() => {
      proxy.init()
    })
    return {
      picBox,
      imageBase64,
      imageCanvas,
      pendantList,
      selectedItem,
      btnLoading,
      show,
      init,
      bindSelectedItem,
      handleChange,
      handleReset,
      hanldePrints,
      hanldePreview,
    }
  },
}
//挂饰列表
const list = [
  {
    uid: 1,
    url: pendant01,
  },
  {
    uid: 2,
    url: pendant02,
  },
  {
    uid: 3,
    url: pendant03,
  },
  {
    uid: 4,
    url: pendant04,
  },
  {
    uid: 5,
    url: pendant05,
  },
  {
    uid: 6,
    url: pendant06,
  },
  {
    uid: 7,
    url: pendant07,
  },
  {
    uid: 8,
    url: pendant08,
  },
]
//file转bas64
function fileToBase64(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  return new Promise((resolve, reject) => {
    reader.onload = function (e) {
      resolve(e.target.result)
    }
  })
}
</script>

<style scoped lang="scss">
.Home-root {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .root-in {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    position: relative;
  }
}
.pic-box {
  width: 100%;
  min-height: 2rem;
  height: calc(100vh - 60%);
  overflow: hidden;
  background-color: #000;
  position: relative;
  .pendant {
    width: 2rem;
    height: 2rem;
    background-color: transparent;
    position: absolute;
    z-index: 11;
    left: 50%;
    margin-left: -1rem;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .pic {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: absolute;
    top: 0;
    left: 0;
    .van-image {
      width: 100%;
      display: block;
    }
    img {
      width: 100%;
      height: auto;
    }
  }
}
.handle-box {
  width: 100%;
  height: 60%;
  position: relative;
  overflow: hidden;
  .pendant-in {
    width: 100%;
    padding: 0.1rem 0;
    .pendant-list {
      width: 100%;
      padding: 0 0.05rem;
      box-sizing: border-box;
      overflow: hidden;
      .tp {
        width: 25%;
        height: auto;
        float: left;
        padding: 0.06rem;
        box-sizing: border-box;
        cursor: pointer;
        &.tp-hover {
          .tp-in {
            border-color: #00ab9e;
          }
        }
        .tp-in {
          height: 100%;
          background-color: #ecfaff;
          border: 0.04rem solid transparent;
          border-radius: 0.06rem;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .foot-in {
    position: fixed;
    bottom: 0;
    z-index: 2;
    width: 100%;
    max-width: 640px;
    height: 1.2rem;
    padding: 0 0.1rem;
    box-sizing: border-box;
    border-top: 1px solid #f0f0f0;
    .van-row {
      margin-top: 0.16rem;
    }
    .van-button {
      width: 100%;
      height: 0.88rem;
      padding: 0;
      font-size: 0.28rem;
    }
    .upload-btn {
      width: 100%;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      .file {
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        cursor: pointer;
      }
    }
  }
  .pic-content {
    width: 100%;
    text-align: center;
    img {
      max-width: 100%;
    }
  }
}
</style>
<style lang="scss">
.v-dialog { border-radius: .16rem;
  .van-dialog__header {
    padding-top: 0;
    line-height:.88rem;
  }
}
</style>
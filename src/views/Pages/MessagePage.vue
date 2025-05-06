<template>
  <div class="min-h-screen p-8">
    <!-- 留言表单区域 -->
    <div class="relative z-10 mx-auto max-w-4xl">
      <section class="mb-16">
        <h2 class="text-2xl font-bold mb-8 flex items-center gap-2">
          <component :is="MessagesSquareIcon" class="w-6 h-6" />
          PLZ_LEAVE_A_MESSAGE
        </h2>

        <div class="bg-zinc-800/50 rounded-lg overflow-hidden">
          <div class="p-4">
            <!-- 留言内容输入框 -->
            <textarea v-model="newMessage" rows="4" placeholder="say something..."
              class="w-full resize-none rounded-lg border p-3 bg-zinc-900/50 border-zinc-700 focus:border-purple-500 placeholder:text-gray-500"></textarea>

            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center gap-2">
                <!-- 昵称输入框 -->
                <input type="text" v-model="authorName" placeholder="Nickname"
                  class="rounded-lg border p-2 bg-zinc-900/50 border-zinc-700 placeholder:text-gray-500" />

                <!-- 头像文件上传组件 -->
                <label class="relative cursor-pointer">
                  <input type="file" accept="image/*" @change="handleFileUpload" class="hidden"
                    :disabled="isSubmitting" />
                  <span class="px-3 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-700/50 transition-colors">
                    {{ uploadButtonText }}
                  </span>
                </label>
              </div>

              <!-- 提交按钮 -->
              <button @click="submitMessage"
                class="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors"
                :disabled="isSubmitting">
                {{ isSubmitting ? "..." : "submit" }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 留言列表展示 -->
      <section>
        <h2 class="text-2xl font-bold mb-8 flex items-center gap-2">
          🛹🖐️🤜
        </h2>

        <div class="space-y-6">
          <!-- 遍历留言列表 -->
          <div v-for="message in messages" :key="message.id"
            class="bg-zinc-800/50 rounded-lg overflow-hidden hover:bg-zinc-700/50 transition-colors">
            <div class="p-4">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <!-- 用户头像展示 -->
                  <img :src="message.author_avatar || 'https://via.placeholder.com/40'"
                    class="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 class="font-medium text-gray-400">{{ message.author_name }}</h3>
                    <!-- 格式化时间显示 -->
                    <p class="text-sm text-gray-400">{{ formatTime(message.created_at) }}</p>
                  </div>
                </div>
              </div>
              <!-- 留言内容 -->
              <p class="text-sm leading-relaxed text-gray-300">{{ message.content }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { MessagesSquareIcon } from 'lucide-vue-next'
import { getMessages, insertMessage } from '../../api/message_request'

// 定义留言数据结构接口
interface Message {
  id: number
  author_name: string
  author_avatar: string  // Supabase中为text类型
  created_at: string
  content: string
}

// 响应式数据
const newMessage = ref('')          // 新留言内容
const authorName = ref('')          // 用户昵称
const authorAvatar = ref<File | null>(null) // 上传的头像文件
  const messages = ref<Message[]>([]);
const isSubmitting = ref(false)     // 提交状态

// 计算上传按钮显示文本
const uploadButtonText = computed(() => {
  return authorAvatar.value ? '🖼️ OK' : '"📸 Upload avatar'
})

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]

    // 文件类型验证（仅允许图片）
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件（支持JPG/PNG等格式）')
      return
    }

    // 文件大小限制（2MB）
    if (file.size > 2 * 1024 * 1024) {
      alert('文件大小不能超过2MB')
      return
    }

    authorAvatar.value = file
  }
}

// 将文件转换为Base64字符串
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)  // 读取文件为Data URL格式
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// 提交留言
const submitMessage = async () => {
  // 基础验证
  if (!newMessage.value.trim()) {
    alert('请输入留言内容')
    return
  }
  if (!authorName.value.trim()) {
    alert('请输入昵称')
    return
  }

  isSubmitting.value = true

  try {
    let avatarBase64 = ''
    // 如果有上传头像则进行转换
    if (authorAvatar.value) {
      avatarBase64 = await convertToBase64(authorAvatar.value)
    }

    // 调用Supabase插入接口
    await insertMessage({
      user_id: 'anonymous',    // 根据你的认证系统修改
      content: newMessage.value.trim(),
      author_name: authorName.value.trim(),
      author_avatar: avatarBase64  // 发送Base64字符串到Supabase
    })

    // 清空表单
    newMessage.value = ''
    authorName.value = ''
    authorAvatar.value = null
    await loadMessages()  // 重新加载留言列表
  } catch (error) {
    console.error('提交失败:', error)
    alert('留言提交失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

// 加载留言列表
const loadMessages = async () => {
  try {
    messages.value = (await getMessages()) as Message[];
  } catch (error) {
    console.error('加载留言失败:', error);
    alert('无法加载留言列表');
  }
};
// 时间格式化函数
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 计算时间差
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}分钟前`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`

  const days = Math.floor(hours / 24)
  return `${days}天前`
}

// 组件挂载时加载留言
onMounted(async () => {
  await loadMessages()
})
</script>
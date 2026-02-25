<template>
  <view style="padding:20px">
    <button @tap="generateWord">生成Word</button>
  </view>
</template>

<script>
import { htmlToWord } from '@/utils/htmlToWord'

export default {
  methods: {
    async generateWord() {
      uni.showLoading({ title: '生成中' })
      try {
        const html = `
          <h1>测试文档</h1>
					<p>这是用HTML生成的Word文档</p>
					<p>生成时间：${new Date().toLocaleString()}</p>
					<table>
						<tr><th>姓名</th><th>年龄</th><th>职位</th></tr>
						<tr><td>张三zz</td><td>25</td><td>工程师</td></tr>
						<tr><td>李四</td><td>28</td><td>设计师</td></tr>
					</table>
        `
        const filePath = await htmlToWord(html, 'test.doc')
        uni.hideLoading()
				uni.showModal({
					title: '生成成功',
					content: `Word文档已生成\n路径: ${filePath}`,
					showCancel: false,
					success: () => {
						// 尝试打开文档
						// if (plus.runtime && plus.runtime.openFile) {
						// 	plus.runtime.openFile(filePath, {}, () => {
						// 		console.log('打开文档成功')
						// 	}, (err) => {
						// 		console.log('打开文档失败:', err)
						// 	})
						// }
					}
				})
      } catch(e) {
				console.error('生成Word文档失败:', error)
        uni.hideLoading()
        uni.showToast({ title: '生成失败', icon: 'none' })
      }
    }
  }
}
</script>
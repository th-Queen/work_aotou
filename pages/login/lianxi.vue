<template>
	<view class="login-container">
		
		<view>
			<button @click="savefile">保存文件</button>
			<button @click="getfilelist">本地文件信息</button>
			<button @click="chooseImage">上传照片</button>
			
		</view>
		
	</view>
</template>

<script>
import api from '../../services/api.js';
import cache from '../../services/cache.js';

export default {
	data() {
		return {
			username: '',
		}
	},
	methods: {
		savefile() {
			// 假设有一个buffer数据
			const buffer = new ArrayBuffer(8);
			const view = new Uint8Array(buffer);
			view[0] = 72; // 'H'
			view[1] = 101; // 'e'
			view[2] = 108; // 'l'
			view[3] = 108; // 'l'
			view[4] = 111; // 'o'
			
			// 将ArrayBuffer转为Base64
			const base64 = uni.arrayBufferToBase64(buffer);
			
			console.log("go2")
			uni.saveFile({
			  //tempFilePath: `data:text/plain;base64,${base64}`,
				//tempFilePath: `_doc/uniapp_save/17688145345000.jpg`,	
				//tempFilePath: `_doc/uniapp_save/test.docx`,
				//tempFilePath: `file:///storage/emulated/0/Download/test.docx`,
				//tempFilePath: `file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/doc/uniapp_temp/compressed/1768824622018_Screenshot_2026-01-19-18-58-01-217_cn.gov.chinatax.gt4.app.jpg`,
				//tempFilePath: `file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/test.docx`,
				
				success: function (res) {
					console.log("success:", res)
			    var savedFilePath = res.savedFilePath;
			  },
			  fail: function (err) {
					console.error("文件保存失败:", err);
					uni.showToast({
						title: '文件保存失败',
						icon: 'none'
					});
				}
			});
		},
		
		getfilelist() {
			uni.getSavedFileList({
			  success: function (res) {
			    console.log(res.fileList);
			  }
			});
		},
		
		chooseImage() {
			uni.chooseImage({
			  success: function (res) {
			    var tempFilePaths = res.tempFilePaths;
					console.log(tempFilePaths)
			    uni.saveFile({
			      tempFilePath: tempFilePaths[0],
			      success: function (res) {
			        var savedFilePath = res.savedFilePath;
			      }
			    });
			  }
			});
		},
		

	},
	
	onLoad() {
		// 检查是否已经登录
		// if (cache.getLoginStatus()) {
		// 	// 如果已经登录，直接跳转到首页
		// 	uni.switchTab({
		// 		url: '/pages/index/index'
		// 	});
		// }
	}
}
</script>

<style>
	
	

		
.login-container {
	height: 90vh;
	/* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
	padding: 300rpx 60rpx 10rpx;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}


</style>

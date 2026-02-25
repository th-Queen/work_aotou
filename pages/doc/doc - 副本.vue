<template>
	<view class="container">
		<text class="title">基础数据</text>
		<view class="data">
			<text>记录ID: {{ item.recordid }}</text>
			<text>螺丝大小: M{{ item.screwsize }}</text>
			<text>螺距大小: {{ item.pitchSize }}</text>
			<text>材料: {{ item.selectedMaterial }}</text>
			<text>操作员: {{ item.operatorname }}</text>
			<text>地点: {{ item.operatoradd }}</text>
			<text>业主要求: {{ item.ownerrequire }}</text>
			<text>操作时间: {{ item.operatetime }}</text>
		</view>

		<text class="title">额外数据</text>
		<view class="extradata">
			<view class="input-row">
				<text class="label">法兰尺寸(D，单位mm)：</text>
				<input class="input" v-model="flangeSize" placeholder="请输入法兰尺寸" />
			</view>
			<view class="input-row">
				<text class="label">磅级(cl)：</text>
				<input class="input" v-model="poundRating" placeholder="请输入磅级" />
			</view>
			<view class="input-row">
				<text class="label">垫片类型：</text>
				<input class="input" v-model="gasketType" placeholder="请输入垫片类型" />
			</view>
		</view>


		<view class="btns">
			<button class="btn" @click="generateDoc">生成文档</button>
			<button class="btn" @click="exportDoc">导出文档</button>
		</view>
	</view>
</template>

<script>
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { Buffer } from 'buffer';

export default {
	data() {
		return {
			item: {},
			flangeSize: '',
			poundRating: '',
			gasketType: ''
		}
	},
	onLoad() {
		this.loadDocData();
	},
	onShow() {
		this.loadDocData();
	},
	methods: {
		loadDocData() {
			const data = uni.getStorageSync('docData');
			// console.log("data:", data)
			if (data) {
				this.item = data;
				uni.removeStorageSync('docData');
			}
		},
		
		// generateDoc() {
		// 	console.log("go1")
		//   // 创建一个新的Word文档
		//   const doc = new Document({
		//     sections: [{
		//       properties: {},
		//       children: [
		//         new Paragraph({
		//           children: [
		//             new TextRun("Hello, World!"),
		//             new TextRun({
		//               text: " This is a test document.",
		//               bold: true,
		//             }),
		//           ],
		//         }),
		//       ],
		//     }],
		//   });
			
			// const buffer = Packer.toBuffer(doc);
			// const filePath = `file:///storage/emulated/0/Download/test.docx`;
			// const fs = uni.getFileSystemManager();
			// fs.writeFile({
			//   filePath: filePath,
			//   data: buffer,
			//   encoding: 'binary',
			//   success: () => {
			//     console.log('File saved:', filePath);
			//   },
			//   fail: (error) => {
			//     console.error('Error saving file:', error);
			//   }
			// });
			
			// console.log("go2")
		  // 将文档写入文件
		  // Packer.toBuffer(doc).then((buffer) => {
		  //   // 这里你可以将buffer保存为文件或者发送到服务器等操作
		  //   console.log('Document generated successfully.');
		  //   // 例如，可以使用uniapp的文件系统API保存文件
		  //   //const filePath = `${uni.env.USER_DATA_PATH}/test.docx`;
				// const filePath = `file:///storage/emulated/0/Download/test.docx`;
		  //   uni.writeFile({
		  //     filePath: filePath,
		  //     data: buffer,
		  //     encoding: 'binary',
		  //     success: () => {
		  //       console.log('File saved:', filePath);
		  //     },
		  //     fail: (error) => {
		  //       console.error('Error saving file:', error);
		  //     }
		  //   });
		  // });
		// },
		
		// async generateDoc() {
		// 	try {
		// 		uni.showLoading({ title: '文档生成中...' });

		// 		const doc = new Document({
		// 			sections: [{
		// 				children: [
		// 					new Paragraph({ children: [new TextRun({ text: "液压扳手操作报告", bold: true, size: 32 })] }),
		// 					new Paragraph({ children: [new TextRun({ text: "" })] }),
		// 					new Paragraph({ children: [new TextRun({ text: `记录ID: ${this.item.recordid || '无'}` })] }),
		// 					new Paragraph({ children: [new TextRun({ text: `螺丝大小: M${this.item.screwsize || '无'}` })] }),
		// 					new Paragraph({ children: [new TextRun({ text: `螺距大小: ${this.item.pitchSize || '无'}` })] }),
		// 					new Paragraph({ children: [new TextRun({ text: `材料: ${this.item.selectedMaterial || '无'}` })] }),
		// 					new Paragraph({ children: [new TextRun({ text: `操作员: ${this.item.operatorname || '无'}` })] }),
		// 					new Paragraph({ children: [new TextRun({ text: `操作地点: ${this.item.operatoradd || '无'}` })] }),
		// 					new Paragraph({ children: [new TextRun({ text: `业主要求: ${this.item.ownerrequire || '无'}` })] }),
		// 					new Paragraph({ children: [new TextRun({ text: `法兰尺寸: ${this.flangeSize || '无'}` })] }),
		// 					new Paragraph({ children: [new TextRun({ text: `磅级: ${this.poundRating || '无'}` })] }),
		// 					new Paragraph({ children: [new TextRun({ text: `垫片类型: ${this.gasketType || '无'}` })] }),
		// 					new Paragraph({ children: [new TextRun({ text: `操作时间: ${this.item.operatetime || '无'}` })] })
		// 				]
		// 			}]
		// 		});

		// 		console.log("uni.env.USER_DATA_PATH:");
		// 		//const buffer = await Packer.toBuffer(doc);
		// 		const buffer = Buffer.from(doc.toString(),'utf8');
		// 		const base64Data = uni.arrayBufferToBase64(buffer);
		// 		//const fs = uni.getFileSystemManager();
		// 		const fileName = `test_${this.item.recordid || '新文档'}.docx`;
		// 		const filePath = `file:///storage/emulated/0/Download/${fileName}`;
		// 		console.log(filePath);

		// 		//fs.writeFileSync(filePath, base64Data, 'base64');

		// 		uni.saveFile({
		// 			tempFilePath: filePath,
		// 			success: (res) => {
		// 				uni.showToast({ title: `文件已保存到: ${res.savedFilePath}`, icon: 'success' });
		// 			},
		// 			fail: (err) => {
		// 				console.error('文件保存失败:', err);
		// 				uni.showToast({ title: '文件保存失败', icon: 'none' });
		// 			}
		// 		});

		// 		uni.hideLoading();
		// 		uni.showToast({ title: '文档生成成功', icon: 'success' });
		// 	} catch (error) {
		// 		console.error('生成文档失败:', error);
		// 		uni.hideLoading();
		// 		uni.showToast({ title: '文档生成失败', icon: 'none' });
		// 	}
		// },
		
		exportDoc() {
			uni.showToast({ title: '导出功能开发中', icon: 'none' });
		}
	}
}
</script>

<style scoped>
.container {
	padding: 20rpx;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 40rpx;
}

.data {
	margin-bottom: 40rpx;
	border: 3rpx solid #007aff;
	border-radius: 12rpx;
	padding: 30rpx;
}

.data text {
	display: block;
	font-size: 28rpx;
	margin-bottom: 16rpx;
	padding: 16rpx;
	background: #f8f8f8;
	border-radius: 8rpx;
}

.btns {
	display: flex;
	justify-content: space-between;
}

.btn {
	flex: 1;
	margin: 0 10rpx;
	padding: 16rpx;
	background: #007aff;
	color: white;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.extradata {
	margin-bottom: 40rpx;
	border: 3rpx solid #007aff;
	border-radius: 12rpx;
	padding: 30rpx;
}

.input-row {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.input-row .label {
	width: 250rpx;
	font-size: 28rpx;
	font-weight: bold;
}

.input {
	flex: 1;
	border: 2rpx solid #ddd;
	border-radius: 8rpx;
	padding: 16rpx;
	font-size: 28rpx;
}
</style>

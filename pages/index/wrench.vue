<template>
    <view class="container">
        <view class="photo-section">
            <button class="upload-btn" @click="chooseImage">上传照片</button>
            <!-- 新增：三个照片框容器 + 三个预览框，核心新增HTML -->
            <view class="photo-preview-list">
                <!-- 照片框1 -->
                <view class="photo-preview-item" v-if="imageUrls[0]">
                    <image
                        :src="imageUrls[0]"
                        class="preview-image"
                        @click="previewImage(0)"
                    />
                    <button class="delete-btn" @click="deleteImage(0)">
                        删除
                    </button>
                </view>
                <!-- 照片框2 -->
                <view class="photo-preview-item" v-if="imageUrls[1]">
                    <image
                        :src="imageUrls[1]"
                        class="preview-image"
                        @click="previewImage(1)"
                    />
                    <button class="delete-btn" @click="deleteImage(1)">
                        删除
                    </button>
                </view>
                <!-- 照片框3 -->
                <view class="photo-preview-item" v-if="imageUrls[2]">
                    <image
                        :src="imageUrls[2]"
                        class="preview-image"
                        @click="previewImage(2)"
                    />
                    <button class="delete-btn" @click="deleteImage(2)">
                        删除
                    </button>
                </view>
            </view>
        </view>

        <view class="form-list">
            <!-- <view class="field-row">
				<text class="remark">备注：带星号为必填项</text>
			</view> -->
            <view class="field-row">
                <text class="label">螺丝大小(M，单位mm)：</text>
                <input
                    class="input"
                    type="number"
                    v-model="screwSize"
                    placeholder="仅填数字,例如:10"
                    @blur="checkThreadType"
                />
            </view>
            <view class="field-row">
                <text class="label">螺距大小(P，单位mm)：</text>
                <input
                    class="input"
                    type="number"
                    v-model="pitchSize"
                    placeholder="仅填数字,例如:1.5"
                    @blur="checkThreadType"
                />
            </view>
            <view class="field-row">
                <text class="label">选择材料：</text>
                <input
                    class="input"
                    v-model="selectedMaterial"
                    placeholder="在右侧选择"
                />
                <picker
                    mode="selector"
                    :range="materials"
                    @change="onMaterialChange"
                >
                    <!-- <view class="picker-display">{{ selectedMaterial || '请选择材料' }}</view> -->
                    <view class="picker-display">请选择材料</view>
                </picker>
            </view>
            <view class="field-row">
                <text class="label">所选材料的化学成分（标准编号）：</text>
                <input
                    class="input"
                    v-model="materialComposition"
                    placeholder="选择材料后显示"
                    readonly
                />
            </view>
            <view class="field-row">
                <text class="label">所选材料的热处理制度：</text>
                <input
                    class="input"
                    v-model="materialHeatTreatment"
                    placeholder="选择材料后显示"
                    readonly
                />
            </view>
            <!-- <view class="field-row">
				<text class="label">法兰尺寸(D，单位mm)：</text>
				<input class="input" type="number" v-model="flangesize" placeholder="法兰尺寸,仅填数字,例如:10" />
			</view>
			<view class="field-row">
				<text class="label">磅级(cl)：</text>
				<input class="input" type="number" v-model="poundrating" placeholder="磅级" />
			</view>
			<view class="field-row">
				<text class="label">垫片类型：</text>
				<input class="input" type="string" v-model="gaskettype" placeholder="垫片类型" />
			</view> -->
            <view class="field-row">
                <text class="label">计算结果（N*m）：</text>
                <input
                    class="input"
                    type="number"
                    v-model="torque"
                    placeholder="点击计算按钮"
                />
            </view>

            <!-- <button class="calc-btn" @click="calculateTorque">计算</button> -->
            <view class="calc-container">
                <button class="calc-btn" @click="calculateTorque">计算</button>
            </view>
        </view>

        <!-- <view class="result" v-if="torque">
			<text>需要力矩：{{torque}} N·m</text>
		</view> -->

        <view class="result" v-if="torqueList.length">
            <view v-for="(item, index) in torqueList" :key="index">
                <text
                    >需要力矩：{{ item.torque }} N·m，M{{ item.screwSize }}，P{{
                        item.pitchSize
                    }}，{{ item.material }}</text
                >
            </view>
        </view>

        <view class="operator-row">
            <view class="field-row-l">
                <text class="label-l">操作员名字：</text>
                <input
                    class="input-l"
                    v-model="operatorName"
                    placeholder="输入操作员名字"
                />
            </view>

            <view class="field-row-l">
                <text class="label-l">操作地点：</text>
                <input
                    class="input"
                    v-model="operatoradd"
                    placeholder="输入操作地点"
                />
            </view>
        </view>

        <view class="form-item">
            <text class="labelitem">操作时间：</text>
            <picker mode="date" :value="operationTime" @change="onTimeChange">
                <view class="picker-display">{{
                    operationTime || "请选择操作日期"
                }}</view>
            </picker>
        </view>

        <view class="form-item">
            <text class="labelitem">业主要求：</text>
            <input
                class="input"
                type=""
                v-model="partRequirement"
                placeholder="输入业主要求"
            />
        </view>

        <view class="submit-section">
            <button class="submit-btn" @click="submitData">提交数据</button>
        </view>
    </view>
</template>

<script>
import api from "../../services/api.js";
import boltData from "../../data/boltdata.js";

export default {
    data() {
        return {
            userid: 0,
            imageUrls: ["", "", ""],
            screwSize: "",
            pitchSize: "",
            torque: "",
            torqueList: [], // 存储历史计算结果
            partRequirement: "",
            operatorName: "",
            operatoradd: "",
            operationTime: "", //操作时间
            materials: [
                "35CrMo",
                "42CrMo",
                "25Cr2MoV",
                "0Cr18Ni9",
                "0Cr17Ni12Mo2",
                "A193,B8-2",
                "A193,B8M-2",
                "A320,L7",
                "A453,660",
            ],
            selectedMaterial: "",
            materialData: {
                "35CrMo": {
                    composition: "GB/T 3077",
                    heatTreatment: "调质(回火≥550℃)",
                },
                "42CrMo": {
                    composition: "DL/T439",
                    heatTreatment: "调质(回火≥580℃)",
                },
                "25Cr2MoV": {
                    composition: "GB/T 3077",
                    heatTreatment: "调质(回火≥600℃)",
                },
                "0Cr18Ni9": { composition: "GB/T 1220", heatTreatment: "固溶" },
                "0Cr17Ni12Mo2": {
                    composition: "GB/T 1220",
                    heatTreatment: "固溶",
                },
                "A193,B8-2": {
                    composition: "ASTM A193",
                    heatTreatment: "固溶+应变硬化",
                },
                "A193,B8M-2": {
                    composition: "ASTM A193",
                    heatTreatment: "固溶+应变硬化",
                },
                "A320,L7": {
                    composition: "ASTM A320",
                    heatTreatment: "调质(回火≥620℃)",
                },
                "A453,660": {
                    composition: "ASTM A453",
                    heatTreatment: "固溶+应变硬化",
                },
            },
            materialComposition: "",
            materialHeatTreatment: "",
            uploadTime: "", // 上传时间
        };
    },

    onLoad(options) {
        if (options.data) {
            const item = JSON.parse(decodeURIComponent(options.data));
            this.screwSize = item.screwsize || "";
            this.pitchSize = item.pitchSize || "";
            this.selectedMaterial = item.selectedMaterial || "";
            this.partRequirement = item.ownerrequire || "";
            this.operatorName = item.operatorname || "";
            this.operatoradd = item.operatoradd || "";
            this.operationTime = item.operatetime
                ? item.operatetime.split("T")[0]
                : "";
            this.onMaterialChange({
                detail: {
                    value: this.materials.indexOf(this.selectedMaterial),
                },
            });
            this.userid = item.userid;
            this.imageUrls = Array.isArray(item.imageUrls)
                ? item.imageUrls
                : ["", "", ""];
            // 解析历史计算结果
            if (item.caltorqueList) {
                this.torqueList = JSON.parse(item.caltorqueList).map((str) => {
                    const [torque, screwSize, pitchSize, material] =
                        str.split("，");
                    return { torque, screwSize, pitchSize, material };
                });
            }
        } else {
            const userInfo = uni.getStorageSync("userInfo") || {};
            this.userid = userInfo.userid || null;
        }
    },
    methods: {
        chooseImage() {
            uni.showActionSheet({
                itemList: ["从相册选择", "拍照"],
                success: (res) => {
                    const sourceType =
                        res.tapIndex === 0 ? ["album"] : ["camera"];
                    uni.chooseImage({
                        count: 3,
                        sourceType: sourceType,
                        success: (chooseImageRes) => {
                            const newImages = chooseImageRes.tempFilePaths;
                            let emptyIndex = 0;
                            this.imageUrls = this.imageUrls.map((item) => {
                                if (!item && emptyIndex < newImages.length) {
                                    return newImages[emptyIndex++];
                                }
                                return item;
                            });
                        },
                    });
                },
            });
        },

        previewImage(index) {
            const validImages = this.imageUrls.filter((item) => item);
            if (validImages.length === 0) return;
            uni.previewImage({
                current: this.imageUrls[index],
                urls: validImages,
            });
        },

        deleteImage(index) {
            this.$set(this.imageUrls, index, "");
            uni.showToast({ title: "图片已删除", icon: "success" });
        },

        onMaterialChange(e) {
            this.selectedMaterial = this.materials[e.detail.value];
            const materialInfo = this.materialData[this.selectedMaterial];
            if (materialInfo) {
                this.materialComposition = materialInfo.composition;
                this.materialHeatTreatment = materialInfo.heatTreatment;
            }
        },

        onTimeChange(e) {
            this.operationTime = e.detail.value;
        },

        checkThreadType() {
            if (!this.screwSize || !this.pitchSize) return;
            const size = parseFloat(this.screwSize);
            const pitch = parseFloat(this.pitchSize);
            const key = `M${size}-${pitch}`;
            const coarseData = boltData.coarseThread[key];
            const fineData = boltData.fineThread[key];
            let message = "";
            if (coarseData && fineData) {
                message = "你选的是螺丝同时存在于粗牙和细牙中";
            } else if (coarseData) {
                message = "你选的是粗牙螺丝";
            } else if (fineData) {
                message = "你选的是细牙螺丝";
            } else {
                message = "你选的螺丝不符合标准";
            }
            uni.showModal({
                title: "螺纹类型检查",
                content: message,
                showCancel: false,
                confirmText: "确定",
            });
        },

        calculateTorque() {
            if (!this.screwSize) {
                uni.showToast({ title: "请输入螺丝大小", icon: "none" });
                return;
            }
            if (!this.pitchSize) {
                uni.showToast({ title: "请输入螺距大小", icon: "none" });
                return;
            }
            if (!this.selectedMaterial) {
                uni.showToast({ title: "请选择材料", icon: "none" });
                return;
            }
            api.wrenchApi
                .calculateTorque(
                    this.screwSize,
                    this.selectedMaterial,
                    this.pitchSize
                )
                .then((res) => {
                    if (res.status === "success") {
                        this.torque = res.torque;
                        // 添加到历史记录
                        this.torqueList.unshift({
                            torque: res.torque,
                            screwSize: this.screwSize,
                            pitchSize: this.pitchSize,
                            material: this.selectedMaterial,
                        });
                    } else {
                        uni.showToast({
                            title: res.message || "计算失败",
                            icon: "none",
                        });
                    }
                })
                .catch((err) => {
                    uni.showToast({ title: "网络错误，请重试", icon: "none" });
                });
        },

        async submitData() {
            if (!this.screwSize) {
                uni.showToast({ title: "请输入螺丝大小", icon: "none" });
                return;
            }
            if (!this.partRequirement.trim()) {
                uni.showToast({ title: "请输入业主要求", icon: "none" });
                return;
            }
            if (!this.operatorName.trim()) {
                uni.showToast({ title: "请输入操作员名字", icon: "none" });
                return;
            }
            if (!this.operatoradd.trim()) {
                uni.showToast({ title: "请输入操作地点", icon: "none" });
                return;
            }
            if (!this.operationTime.trim()) {
                uni.showToast({ title: "请选择操作时间", icon: "none" });
                return;
            }
            if (!this.torque) {
                uni.showToast({ title: "请先点击计算扭矩", icon: "none" });
                return;
            }

            uni.showLoading({ title: "提交中..." });

            // 上传图片
            let imageUrls = [];
            if (this.imageUrls && this.imageUrls.length > 0) {
                for (let i = 0; i < this.imageUrls.length; i++) {
                    const url = this.imageUrls[i];
                    if (url) {
                        const uploadRes = await api.wrenchApi.uploadImage(url);
                        if (uploadRes.status === "success") {
                            imageUrls.push(uploadRes.imageUrl);
                        } else {
                            uni.showToast({
                                title: `第${i + 1}张图片上传失败`,
                                icon: "none",
                            });
                        }
                    }
                }
            }

            // 序列化扭矩列表
            const torqueListStr = JSON.stringify(
                this.torqueList.map(
                    (item) =>
                        `${item.torque}，${item.screwSize}，${item.pitchSize}，${item.material}`
                )
            );

            try {
                const userInfo = uni.getStorageSync("userInfo") || {};
                const res = await api.wrenchApi.saveRecord({
                    userid: userInfo.userid,
                    screwSize: this.screwSize,
                    pitchSize: this.pitchSize,
                    selectedMaterial: this.selectedMaterial,
                    materialComposition: this.materialComposition,
                    materialHeatTreatment: this.materialHeatTreatment,
                    torque: this.torque,
                    partRequirement: this.partRequirement,
                    operatorName: this.operatorName,
                    operatoradd: this.operatoradd,
                    operationTime: this.operationTime,
                    imageUrls: imageUrls,
                    caltorqueList: torqueListStr, // 提交扭矩列表
                    uploadTime: new Date().toISOString(),
                    // uploadTime: this.uploadTime,
                });

                uni.hideLoading();
                if (res.status === "success") {
                    uni.showToast({ title: "提交成功", icon: "success" });
                    this.resetForm();
                } else {
                    uni.showToast({
                        title: res.message || "提交失败",
                        icon: "none",
                    });
                }
            } catch (err) {
                uni.hideLoading();
                uni.showToast({ title: "网络错误，请重试", icon: "none" });
            }
        },

        resetForm() {
            this.partRequirement = "";
            this.operatorName = "";
            this.operatoradd = "";
            this.operationTime = "";
            this.torqueList = []; //清空历史记录
            this.imageUrls = ["", "", ""];
            this.userid = 0;
        },
    },
};
</script>

<style>
.container {
    padding: 40rpx;
}

.photo-section {
    margin-bottom: 40rpx;
    text-align: center;
}

.upload-btn {
    background: #007aff;
    color: white;
    border: none;
    border-radius: 8rpx;
    padding: 20rpx 40rpx;
    font-size: 28rpx;
    transition: all 0.3s ease;
    /* 新增：平滑过渡 */
}

.upload-btn:active {
    background: #002e6a;
    /* 更深的蓝色 */
    transform: scale(0.95);
    /* 轻微缩小 */
}

.image-display {
    margin-top: 20rpx;
    position: relative;
    /* 	display: inline-block; */
}

.preview-image {
    width: 400rpx;
    height: 400rpx;
    border-radius: 8rpx;
    border: 2rpx solid #ddd;
}

.delete-btn {
    position: absolute;
    top: -15rpx;
    right: 30rpx;
    width: 120rpx;
    height: 60rpx;
    border-radius: 30rpx;
    background: #ff4757;
    color: white;
    border: 4rpx solid white;
    font-size: 24rpx;
    font-weight: bold;
    line-height: 52rpx;
    text-align: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.4);
    z-index: 10;
}

.form-list {
    margin-bottom: 30rpx;
    border: 3rpx solid #007aff;
    border-radius: 12rpx;
    padding: 30rpx;
}

.field-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20rpx;
}

.field-row-l {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20rpx;
}

.form-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 40rpx;
}

.labelitem {
    margin-bottom: 15rpx;
}

.calc-container {
    text-align: center;
    margin-top: 30rpx;
}

.remark {
    width: 1000rpx;
    font-size: 28rpx;
    color: #e80d05;
}

.operator-row {
    display: flex;
    justify-content: space-between;
}

.operator-row .field-row-l {
    width: 48%;
    display: flex;
    align-items: center;
}

.label {
    width: 200rpx;
    font-size: 28rpx;
    color: #333;
}

.label-l {
    font-size: 28rpx;
    color: #000000;
}

.input {
    flex: 1;
    border: 1rpx solid #ddd;
    border-radius: 6rpx;
    padding: 16rpx;
    font-size: 28rpx;
}

.input-l {
    border: 1rpx solid #ddd;
    border-radius: 6rpx;
    padding: 16rpx;
    font-size: 28rpx;
}

.picker-display {
    margin-left: 20rpx;
    flex: 1;
    border: 1rpx solid #ddd;
    border-radius: 6rpx;
    padding: 16rpx;
    font-size: 28rpx;
    color: #333;
    background: #f8f9fa;
    transition: all 0.3s ease;
    /* 新增：平滑过渡 */
}

.picker-display:active {
    /* 新增：点击状态 */
    background: #8c8d8d;
    /* 更深的蓝色 */
    transform: scale(0.95);
    /* 轻微缩小 */
}

.calc-btn {
    /* text-align: center;
	margin-top: 30rpx; */

    background: #007aff;
    color: white;
    border: none;
    border-radius: 6rpx;
    padding: 16rpx 30rpx;
    font-size: 28rpx;
    margin-left: 20rpx;
    transition: all 0.3s ease;
    /* 新增：平滑过渡 */
}

.calc-btn:active {
    /* 新增：点击状态 */
    background: #0056cc;
    /* 更深的蓝色 */
    transform: scale(0.95);
    /* 轻微缩小 */
}

.result {
    background: #f0f9ff;
    border: 1rpx solid #007aff;
    border-radius: 6rpx;
    padding: 20rpx;
    margin-bottom: 30rpx;
    font-size: 28rpx;
    color: #007aff;
}

.submit-section {
    margin-top: 60rpx;
    text-align: center;
}

.submit-btn {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    border: none;
    border-radius: 8rpx;
    padding: 30rpx 80rpx;
    font-size: 32rpx;
    font-weight: bold;
    box-shadow: 0 4rpx 15rpx rgba(76, 175, 80, 0.4);
    transition: all 0.3s ease;
    /* 新增：平滑过渡 */
}

.submit-btn:active {
    background: #006400;
    /* 更深的蓝色 */
    transform: scale(0.95);
    /* 轻微缩小 */
}

/*三个照片框的容器，同行排列 */
.photo-preview-list {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20rpx;
    margin-top: 20rpx;
}

.photo-preview-item {
    position: relative;
}

.preview-image {
    width: 220rpx;
    height: 220rpx;
    border-radius: 8rpx;
    border: 2rpx solid #ddd;
}

.delete-btn {
    top: -10rpx;
    right: -10rpx;
    width: 80rpx;
    height: 40rpx;
    font-size: 20rpx;
    line-height: 32rpx;
}
</style>
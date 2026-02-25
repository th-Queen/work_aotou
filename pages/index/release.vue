<template>
    <!-- 	市场部发布页面说明
		排单员可以点击设置单任务的"紧急程度"，
		分为（红色：重要紧急任务）和(绿色:普通任务）；在设置紧急程度的下方是任务工序框，包含："任务名称"、"人员姓名"和"时长"、"工序"三部分，
		在排单任务里面，排单员可以选择新增填写"工序"
		填写完才能发布任务。 -->
    <view class="publish-container">
        <view class="urgency-section">
            <view
                class="urgency-btn urgent"
                :class="{ active: isUrgent }"
                @click="setUrgency(true)"
            >
                重要紧急任务
            </view>
            <view
                class="urgency-btn normal"
                :class="{ active: !isUrgent }"
                @click="setUrgency(false)"
            >
                不紧急任务
            </view>
        </view>

        <view class="task-section">
            <text class="label">任务名称</text>
            <input
                v-model="taskName"
                placeholder="请输入任务名称"
                class="input"
            />

            <text class="label">负责人</text>
            <input
                v-model="mainPerson"
                placeholder="请输入负责人姓名"
                class="input"
            />

            <view class="process-list">
                <view class="process-header">
                    <text>工序列表</text>
                    <button @click="showModal = true" class="add-btn">
                        + 新增工序
                    </button>
                </view>

                <view
                    v-for="(process, index) in processes"
                    :key="index"
                    class="process-item"
                >
                    <text class="process-index">{{ index + 1 }}.</text>
                    <view class="process-info">
                        <text class="process-name">「{{ process.name }}」</text>
                        <text class="process-desc"
                            >人员: {{ process.person }} | 时长:
                            {{ process.duration }}h</text
                        >
                    </view>
                    <button
                        v-if="processes.length > 1"
                        @click="removeProcess(index)"
                        class="remove-btn"
                    >
                        ×
                    </button>
                </view>
            </view>

            <!-- 弹窗 -->
            <view
                v-if="showModal"
                class="modal-mask"
                @click="showModal = false"
            ></view>
            <view v-if="showModal" class="modal">
                <view class="modal-header">新增工序</view>
                <view class="modal-content">
                    <view class="modal-field">
                        <text class="modal-label">工序名称</text>
                        <input
                            v-model="modalName"
                            placeholder="请输入工序名称"
                            class="input modal-input"
                            maxlength="20"
                        />
                    </view>
                    <view class="modal-field">
                        <text class="modal-label">选择人员</text>
                        <picker
                            mode="selector"
                            :range="staffList"
                            @change="onStaffChange"
                        >
                            <view class="picker">{{
                                selectedStaff || "请选择人员"
                            }}</view>
                        </picker>
                    </view>
                    <view class="modal-field">
                        <text class="modal-label">时长(h)</text>
                        <input
                            v-model.number="modalDuration"
                            type="number"
                            placeholder="请输入时长:h"
                            class="input modal-input"
                            min="0.5"
                            step="0.5"
                        />
                    </view>
                </view>
                <view class="modal-footer">
                    <button @click="showModal = false" class="modal-btn cancel">
                        取消
                    </button>
                    <button
                        @click="confirmAddProcess"
                        class="modal-btn confirm"
                    >
                        确定添加
                    </button>
                </view>
            </view>

            <button
                @click="publishTask"
                :disabled="!canPublish"
                class="publish-btn"
                :class="{ disabled: !canPublish }"
            >
                {{ canPublish ? "发布任务" : "请完善任务信息" }}
            </button>
        </view>
        <button class="btn" @click="openReleasedt">查看市场部门人员任务</button>
    </view>
</template>

<script>
import api from "../../services/api.js";
export default {
    data() {
        return {
            isUrgent: true,
            ordertype: "市场部",
            taskName: "",
            mainPerson: "", //负责人
            // 预设人员列表
            staffList: ["张师傅", "李师傅", "王师傅"],
            processes: [], // 初始为空，通过弹窗添加
            showModal: false,
            modalName: "",
            selectedStaff: "",
            modalDuration: null,
        };
    },
    computed: {
        canPublish() {
            return (
                this.taskName.trim() &&
                // this.mainPerson.trim() &&
                this.processes.length > 0 &&
                this.processes.every(
                    (proc) =>
                        proc.name.trim() && proc.person && proc.duration > 0
                )
            );
        },
    },
    methods: {
        openReleasedt() {
            uni.navigateTo({
                url: "/pages/index/detail/releasedt",
            });
        },
        setUrgency(value) {
            this.isUrgent = value;
        },
        // 人员选择器变更
        onStaffChange(e) {
            this.selectedStaff = this.staffList[e.detail.value];
        },
        // 确认添加工序
        confirmAddProcess() {
            if (!this.modalName.trim()) {
                uni.showToast({ title: "请输入工序名称", icon: "none" });
                return;
            }
            if (!this.selectedStaff) {
                uni.showToast({ title: "请选择人员", icon: "none" });
                return;
            }
            if (!this.modalDuration || this.modalDuration <= 0) {
                uni.showToast({ title: "请输入有效时长", icon: "none" });
                return;
            }

            this.processes.push({
                name: this.modalName.trim(),
                person: this.selectedStaff,
                duration: parseFloat(this.modalDuration.toFixed(1)),
            });

            // 重置弹窗
            this.modalName = "";
            this.selectedStaff = "";
            this.modalDuration = null;
            this.showModal = false;
        },
        removeProcess(index) {
            if (this.processes.length > 1) {
                this.processes.splice(index, 1);
            }
        },

        async publishTask() {
            console.log("taskName:", this.taskName);
            if (!this.canPublish) return;
            const userInfo = uni.getStorageSync("userInfo") || {};
            //任务状态默认：生产中
            const orderstatus = "production";
            const createtime = new Date().toISOString();

            const taskData = {
                ordertype: this.ordertype,
                userid: userInfo.userid,
                orderurgency: this.isUrgent ? "紧急" : "普通",
                ordername: this.taskName.trim(),
                orderstatus: orderstatus, //整个任务单的任务状态
                // mainPerson: this.mainPerson.trim(),后端无负责人字段
                createtime: createtime,
                orderprocess: this.processes.map((p) => ({
                    name: p.name,
                    people: p.person,
                    time: p.duration,
                })),
            };
            console.log("完整的 taskData:", JSON.stringify(taskData, null, 2));
            try {
                const res = await api.releaseApi.createTask(taskData);
                uni.showToast({
                    title: "任务发布成功！",
                    icon: "success",
                });
            } catch (error) {
                console.error("API错误", error);
                uni.showToast({ title: "发布失败，请重试", icon: "none" });
            }
        },
    },
};
</script>

<style scoped>
.publish-container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.urgency-section {
    display: flex;
    gap: 15px;
    margin-bottom: 25px;
}
.urgency-btn {
    flex: 1;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 6px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}
.urgency-btn:not(.active) {
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
    color: #999 !important;
}
.urgent.active {
    background-color: #ff4d4f;
    border-color: #ff4d4f;
    color: white;
}
.normal.active {
    background-color: #52c41a;
    border-color: #52c41a;
    color: white;
}
.urgency-btn:hover:not(.active) {
    opacity: 0.9;
}
.task-section {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 25px;
    position: relative;
}
.btn {
    background: #007aff;
    color: white;
    width: 96%;
    margin-top: 40rpx;
    border: none;
    border-radius: 8rpx;
    padding: 20rpx 30rpx;
    font-size: 28rpx;
    min-width: 200rpx;
    transition: all 0.4s ease; /* 新增：平滑过渡 */
}
.btn:active {
    background: #0056cc;
    transform: scale(0.95);
}
.label {
    display: block;
    margin: 15px 0 8px;
    font-weight: 500;
    margin-bottom: 10rpx;
}
.input {
    border: 2rpx solid #e0e0e0;
    border-radius: 8rpx;
    padding: 20rpx;
    font-size: 28rpx;
    width: 100%;
    box-sizing: border-box;
    height: 88rpx;
    line-height: 48rpx;
}
.input::placeholder {
    font-size: 28rpx;
}
.main-process {
    display: flex;
    gap: 15px;
    margin: 15px 0 25px;
}
.process-list {
    margin-top: 10px;
}
.process-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
}
.add-btn {
    background: #409eff;
    color: white;
    margin-right: 0;
    border: none;
    border-radius: 4px;
    padding: 5px 12px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3); /* 新增按钮阴影 */
}
.add-btn:active {
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(64, 158, 255, 0.4);
}
.process-item {
    display: flex;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px dashed #eee;
    align-items: center;
}
.process-index {
    font-weight: bold;
    color: #1890ff;
    min-width: 28px;
    font-size: 18px;
}
.process-info {
    flex: 1;
}
.process-name {
    font-weight: 500;
    color: #1a365d;
    display: block;
    margin-bottom: 4px;
}
.process-desc {
    color: #666;
    font-size: 14px;
}
.remove-btn {
    width: 36px;
    height: 36px;
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    line-height: 36px;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3); /* 删除按钮阴影 */
}
.remove-btn:active {
    transform: scale(0.95);
    box-shadow: 0 1px 3px rgba(255, 77, 79, 0.4);
}
.publish-btn {
    width: 100%;
    padding: 14px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
    cursor: pointer;
    transition: background 0.3s;
    box-shadow: 0 4px 10px rgba(24, 144, 255, 0.25); /* 发布按钮阴影 */
}
.publish-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.35);
}
.publish-btn:hover:not(:disabled) {
    background: #40a9ff;
}
.publish-btn.disabled {
    background: #bfbfbf;
    cursor: not-allowed;
    box-shadow: none;
}

/*弹窗样式*/
.modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
}
.modal {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-radius: 16px 16px 0 0;
    padding: 25px;
    z-index: 1001;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
}
.modal-header {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 25px;
    color: #1a365d;
}
.modal-content {
    margin-bottom: 25px;
}
.modal-field {
    margin-bottom: 22px;
}
.modal-label {
    display: block;
    margin-bottom: 10px;
    font-weight: 500;
    color: #333;
}
.modal-input {
    height: 72rpx;
}
.picker {
    /* width: 100%; */
    height: 72rpx;
    padding: 0 20rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: #333;
    background: #fafafa;
}
.modal-footer {
    display: flex;
    gap: 15px;
}
.modal-btn {
    flex: 1;
    height: 48px;
    border-radius: 8px;
    font-size: 17px;
    font-weight: 500;
    border: none;
    color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.modal-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
.cancel {
    background: #88929d;
}
.confirm {
    /* background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%); */
    background: #1890ff;
}
</style>
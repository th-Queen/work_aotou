<template>
    <!-- 市场部门任务页面：显示发布页的任务条，每个任务条下方有"确定完成"和"还没完成"操作按钮 -->
    <view class="task-container">
        <view class="header">市场部人员任务列表</view>
        <view
            v-for="task in tasks"
            :key="task.id"
            class="task-card"
            :class="{ 'urgent-task': task.urgency === 'urgent' }"
        >
            <view class="task-header">
                <view class="task-title">{{ task.taskName }}</view>
                <view
                    class="urgency-tag"
                    :class="task.urgency === 'urgent' ? 'urgent' : 'normal'"
                >
                    {{ task.urgency === "urgent" ? "重要紧急" : "普通任务" }}
                </view>
            </view>

            <view class="task-info">
                <!-- <text>负责人：{{ task.mainPerson }}</text> -->
                <!-- <text>时长：{{ task.mainDuration }}小时</text> -->
            </view>

            <view
                class="advanced-toggle"
                @click="task.expanded = !task.expanded"
            >
                <text>{{ task.expanded ? "收起" : "展开" }}查看工序</text>
            </view>
            <view class="advanced-fields" :class="{ expanded: task.expanded }">
                <view
                    v-for="(process, index) in task.processes"
                    :key="index"
                    class="process-item"
                >
                    <view class="process-header">
                        <text class="process-index">工序{{ index + 1 }}</text>
                    </view>
                    <view class="process-row">
                        <text class="process-label">工序名称</text>
                        <text class="process-value">{{ process.name }}</text>
                    </view>
                    <view class="process-row">
                        <text class="process-label">人员姓名</text>
                        <text class="process-value">{{ process.people }}</text>
                    </view>
                    <view class="process-row">
                        <text class="process-label">工序时长</text>
                        <text class="process-value">{{ process.time }}h</text>
                    </view>
                </view>
            </view>

            <!-- 操作按钮 -->
            <view class="action-buttons">
                <button
                    class="btn-confirm"
                    @click="handleAction(task.id, 'done')"
                    :active-class="'btn-active'"
                >
                    确定完成
                </button>
                <button
                    class="btn-cancel"
                    @click="handleAction(task.id, 'cancel')"
                    :active-class="'btn-active'"
                >
                    还没完成
                </button>
            </view>
        </view>

        <view v-if="tasks.length === 0" class="empty-state">
            暂无待处理任务
        </view>
    </view>
</template>

<script>
import api from "../../../services/api.js";
export default {
    data() {
        return {
            tasks: [],
            ordertype: "市场部",
        };
    },
    created() {},
    onLoad() {
        const userInfo = uni.getStorageSync("userInfo");
        if (userInfo && userInfo.userid) {
            this.getTaskList(userInfo.userid, this.ordertype);
        }
    },
    methods: {
        async getTaskList(userId, ordertype) {
            console.log("1");
            try {
                console.log(ordertype);
                const res = await api.taskApi.taskList({
                    userid: userId,
                    ordertype: ordertype,
                });
                console.log(res);
                if (res.status === "success") {
                    this.tasks = res.data
                        .filter((item) => item.orderstatus === "未完成")
                        .map((item) => ({
                            id: item.orderid,
                            taskName: item.ordername || `任务${item.orderid}`,
                            urgency:
                                item.orderurgency === "紧急"
                                    ? "urgent"
                                    : "normal",
                            processes: item.orderprocess || [],
                            expanded: false, // 展开
                        }));
                }
            } catch (error) {
                console.error("获取任务失败", error);
                uni.showToast({ title: "加载任务失败", icon: "none" });
            }
        },

        calculateTotalDuration(task) {
            // 计算总时长
            return task.processes
                .reduce((sum, p) => sum + (parseFloat(p.time) || 0), 0)
                .toFixed(1);
        },

        async handleAction(taskId, action) {
            if (action === "done") {
                await api.taskApi.taskComplete({ orderid: taskId });
                this.tasks = this.tasks.filter((t) => t.id !== taskId);
                uni.showToast({ title: "任务完成", icon: "success" });
            } else {
                uni.showToast({ title: "已放弃任务", icon: "success" });
                this.tasks = this.tasks.filter((t) => t.id !== taskId);
            }
            // const task = this.tasks.find(t => t.id === taskId)
            // const actionText = action === 'done' ? '完成' : '放弃'

            // // 实际项目中此处调用API提交
            // console.log(`任务【${task.taskName}】操作: ${actionText}`)
            // uni.showToast({
            //   title: `已${actionText}任务`,
            //   icon: 'success'
            // })

            // // 模拟移除任务（实际根据业务逻辑处理）
            // setTimeout(() => {
            //   this.tasks = this.tasks.filter(t => t.id !== taskId)
            // }, 300)
        },
    },
};
</script>

<style scoped>
.task-container {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: 100vh;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.header {
    font-size: 24px;
    font-weight: bold;
    color: #1a365d;
    text-align: center;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid #eaeaea;
}
.task-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s;
}
.task-card:active {
    transform: translateY(1px);
}
.urgent-task {
    /* border-left: 4px solid #ff4d4f; */
}
.task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}
.task-title {
    font-size: 18px;
    font-weight: bold;
    color: #1a365d;
}
.urgency-tag {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
}
.urgent {
    background-color: #fff1f0;
    color: #ff4d4f;
    border: 1px solid #ffccc7;
}
.normal {
    background-color: #f6ffed;
    color: #52c41a;
    border: 1px solid #b7eb8f;
}
.task-info {
    display: flex;
    justify-content: space-between;
    color: #666;
    font-size: 15px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px dashed #eee;
}
.action-buttons {
    display: flex;
    gap: 15px;
}
button {
    flex: 1;
    height: 48px;
    border-radius: 8px;
    font-size: 17px;
    font-weight: 500;
    border: none;
    color: white;
    box-shadow: 0 4px 10px rgba(24, 144, 255, 0.25);
    transition: all 0.2s;
}
button:active {
    transform: translateY(1px);
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.35);
}
.btn-confirm {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
}
.btn-cancel {
    background: linear-gradient(135deg, #597ef7 0%, #3d5afe 100%);
}
.btn-active {
    opacity: 0.9;
    transform: translateY(2px) !important;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2) !important;
}
.empty-state {
    text-align: center;
    color: #999;
    font-size: 16px;
    margin-top: 50px;
    padding: 20px;
}
.advanced-fields {
    margin-top: 10px;
    padding: 8px 0;
    border-top: 1px dashed #eee;
    opacity: 0;
    height: 0;
    transition: all 0.3s;
}
.advanced-fields.expanded {
    opacity: 1;
    height: auto;
    padding: 8px 0;
}
.taskview {
}
.taskview text {
    display: block;
    font-size: 26rpx;
    margin-bottom: 8rpx;
}
.advanced-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    /* border-top: 2rpx solid #f0f0f0; */
    color: #1890ff;
    font-size: 28rpx;
}
/* 工序列表 */
.advanced-fields {
    overflow: hidden;
    transition: all 0.3s ease;
    opacity: 0;
    max-height: 0;
}
.advanced-fields.expanded {
    opacity: 1;
    max-height: 1000px;
    margin-bottom: 20rpx;
}
.process-item {
    background-color: #f8f9fc;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 16rpx;
    border: 2rpx solid #eef2f6;
}
.process-header {
    margin-bottom: 12rpx;
}
.process-index {
    font-weight: 600;
    color: #1a365d;
    font-size: 28rpx;
    /* background: #e6f7ff; */
    padding: 4rpx 16rpx;
    display: inline-block;
}
.process-row {
    display: flex;
    align-items: baseline;
    margin-bottom: 8rpx;
    font-size: 26rpx;
}
.process-label {
    width: 140rpx;
    color: #666;
    flex-shrink: 0;
}
.process-value {
    color: #333;
    font-weight: 450;
    flex: 1;
    word-break: break-word;
}
</style>
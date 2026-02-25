<template>
    <!-- 做一个过程进度页面：页面分为"技术-生产-品质-出货"，每个阶段完成之后在文字上方显示一个黄山亮灯状态表示已经完成，没有完成的时候不亮灯为灰色状态，然后流程下方是工序框，先用蓝色边框占着位置，不写内容。先写前端逻辑，后端方法还没实现 -->
    <view class="progress-container">
        <!-- 流程进度条 -->
        <view class="steps">
            <view v-for="(step, index) in steps" :key="index" class="step-item">
                <view class="light" :class="{ active: step.completed }"></view>
                <view class="step-name">{{ step.name }}</view>
            </view>
        </view>

        <!-- 工序框占位（蓝色边框） -->
        <view class="process-placeholder"></view>
    </view>
</template>

<script>
import api from "../../services/api.js";

export default {
    data() {
        return {
            // 初始状态
            steps: [
                { name: "技术", completed: true },
                { name: "生产", completed: false },
                { name: "品质", completed: false },
                { name: "出货", completed: false },
            ],
        };
    },
    //  后续从后端获取实际进度状态
    // mounted() {
    //   api.getProgress().then(res => {
    //     this.steps = res.data.steps
    //   })
    // }
};
</script>

<style scoped>
.progress-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.steps {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 40px;
    padding: 20px 0;
}
.steps::before {
    content: "";
    position: absolute;
    top: 24px;
    left: 0;
    right: 0;
    height: 2px;
    background: #e8e8e8;
    z-index: 1;
}
.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
    margin-top: -12rpx;
}
.light {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #d9d9d9; /* 灰色未完成 */
    margin-bottom: 10px;
    border: 2px solid #f0f0f0;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}
.light.active {
    background: #fadb14;
    box-shadow: 0 0 12px #fadb14;
    transform: scale(1.1);
}
.step-name {
    font-size: 16px;
    color: #333;
    margin-top: 4px;
    white-space: nowrap;
}
.process-placeholder {
    width: 100%;
    height: 300px;
    border: 2px solid #1890ff;
    border-radius: 8px;
    background: #fafafa;
}
</style>
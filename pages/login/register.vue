<template>
    <view class="register-container">
        <view class="register-header">
            <image src="/static/logo.png" class="logo"></image>
            <text class="app-title">远大石化机械螺栓紧固APP</text>
            <text class="page-title">用户注册</text>
        </view>

        <view class="register-form">
            <view class="form-item">
                <text class="label">用户名：</text>
                <input
                    class="input"
                    v-model="username"
                    placeholder="请输入用户名"
                    :maxlength="20"
                />
            </view>

            <view class="form-item">
                <text class="label">密码：</text>
                <input
                    class="input"
                    v-model="password"
                    placeholder="请输入密码"
                    password
                    :maxlength="20"
                />
            </view>

            <view class="form-item">
                <text class="label">确认密码：</text>
                <input
                    class="input"
                    v-model="confirmPassword"
                    placeholder="请再次输入密码"
                    password
                    :maxlength="20"
                />
            </view>

            <button class="register-btn" @click="handleRegister">注册</button>

            <view class="login-link">
                <text>已有账号？</text>
                <text class="login-text" @click="goToLogin">立即登录</text>
            </view>
        </view>
    </view>
</template>

<script>
import api from "../../services/api.js";
import cache from "../../services/cache.js";

export default {
    data() {
        return {
            username: "",
            password: "",
            confirmPassword: "",
        };
    },
    methods: {
        handleRegister() {
            if (!this.username.trim()) {
                uni.showToast({
                    title: "请输入用户名",
                    icon: "none",
                });
                return;
            }

            if (!this.password.trim()) {
                uni.showToast({
                    title: "请输入密码",
                    icon: "none",
                });
                return;
            }

            if (this.password !== this.confirmPassword) {
                uni.showToast({
                    title: "两次密码输入不一致",
                    icon: "none",
                });
                return;
            }

            // 调用注册API
            // uni.showLoading({
            // 	title: '注册中...'
            // });

            api.userApi
                .register(this.username, this.password)
                .then((res) => {
                    uni.hideLoading();
                    if (res.status === "success") {
                        uni.showToast({
                            title: "注册成功",
                            icon: "success",
                        });
                        // 注册成功后跳转到登录页面
                        setTimeout(() => {
                            uni.navigateBack();
                        }, 10);
                    } else if (res.message === "用户名已存在") {
                        uni.showToast({
                            title: res.message || "注册失败",
                            icon: "none",
                        });
                    }
                })
                .catch((err) => {
                    uni.hideLoading();
                    uni.showToast({
                        title: "网络错误，请重试",
                        icon: "none",
                    });
                    console.error("注册请求失败:", err);
                });
        },

        goToLogin() {
            uni.navigateBack();
        },
    },
};
</script>

<style>
.register-container {
    min-height: 100vh;
    /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
    background: linear-gradient(to bottom, #7fd1e3, #f0fdfe);
    padding: 80rpx 60rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.logo {
    width: 300rpx;
    height: 200rpx;
    border-radius: 20rpx;
    margin-bottom: 40rpx;
}
.register-header {
    text-align: center;
    margin-bottom: 60rpx;
}

.app-title {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 20rpx;
    display: block;
}

.page-title {
    font-size: 40rpx;
    color: #333;
    font-weight: bold;
}

.register-form {
    background: white;
    border-radius: 20rpx;
    padding: 60rpx 40rpx;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.form-item {
    margin-bottom: 40rpx;
}

.label {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
    font-weight: 500;
}

.input {
    border: 2rpx solid #e1e5e9;
    border-radius: 8rpx;
    padding: 24rpx 20rpx;
    font-size: 28rpx;
    background: #f8f9fa;
}

.register-btn {
    /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
    background-color: #007aff;
    color: white;
    border: none;
    border-radius: 8rpx;
    height: 88rpx;
    font-size: 32rpx;
    font-weight: bold;
    margin-top: 40rpx;
    box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.4);
}

.login-link {
    text-align: center;
    margin-top: 40rpx;
    font-size: 26rpx;
    color: #666;
}

.login-text {
    color: #007aff;
    font-weight: bold;
    margin-left: 10rpx;
}
</style>

<template>
    <view class="login-container">
        <view class="login-header">
            <image src="/static/logo.png" class="logo"></image>
            <text class="app-title">远大石化机械螺栓紧固APP</text>
        </view>

        <view class="login-form">
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

            <button class="login-btn" @click="handleLogin">登录</button>

            <view class="register-link">
                <text>还没有账号？</text>
                <text class="register-text" @click="goToRegister"
                    >立即注册</text
                >
            </view>

            <!-- <text class="register-text" @click="goToRegisterz">ceshi1</text> -->
            <!-- <text class="register-text" @click="goToRegisterz2">ceshi2</text> -->
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
        };
    },
    methods: {
        handleLogin() {
            // 登录成功，跳转到首页
            // uni.switchTab({
            // 	url: '/pages/index/index'
            // });

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

            // 调用登录API
            uni.showLoading({
                title: "登录中...",
            });

            api.userApi
                .login(this.username, this.password)
                .then((res) => {
                    uni.hideLoading();
                    if (res.status === "success") {
                        console.log("res.data:", res.data);
                        // 保存用户数据到缓存
                        cache.setLoginStatus(true);
                        cache.setUsername(this.username);
                        cache.setUserInfo(res.data);
                        // 登录成功，跳转到首页
                        uni.switchTab({
                            url: "/pages/index/index",
                        });
                    } else {
                        uni.showToast({
                            title: res.message || "登录失败",
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
                    console.error("登录请求失败:", err);
                });
        },

        goToRegister() {
            uni.navigateTo({
                url: "/pages/login/register",
            });
        },

        goToRegisterz() {
            uni.navigateTo({
                url: "/pages/login/lianxi",
            });
        },

        goToRegisterz2() {
            uni.navigateTo({
                url: "/pages/login/ceshi",
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
    },
};
</script>

<style>
.login-container {
    height: 100vh;
    background: linear-gradient(to bottom, #ffff8c, #f0fdfe);
    /* background: linear-gradient(to bottom, #7fd1e3, #f0fdfe); */
    padding: 200rpx 60rpx 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 80rpx;
}

.logo {
    width: 300rpx;
    height: 200rpx;
    border-radius: 20rpx;
    margin-bottom: 40rpx;
}

.app-title {
    font-size: 36rpx;
    color: #333;
    font-weight: bold;
}

.login-form {
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

.login-btn {
    background-color: #007aff;
    color: white;
    border: none;
    border-radius: 8rpx;
    height: 88rpx;
    font-size: 32rpx;
    font-weight: bold;
    margin-top: 40rpx;
}

.register-link {
    text-align: center;
    margin-top: 40rpx;
    font-size: 26rpx;
    color: #666;
}

.register-text {
    color: #007aff;
    font-weight: bold;
    margin-left: 10rpx;
}
</style>

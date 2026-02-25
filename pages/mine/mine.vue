<template>
    <view class="container">
        <view class="user-info">
            <image class="avatar" :src="avatarUrl" mode="aspectFill" />
            <text class="username">{{ username }}</text>
        </view>

        <view class="data">
            <text>姓名: {{ realname }}</text>
            <!-- 新增：显示真实姓名 -->
            <text>所在部门: {{ department }}</text>
            <!-- 新增：显示部门 -->
            <text>联系电话: {{ phone }}</text>
            <!-- 新增：显示电话 -->
        </view>

        <view class="button-group">
            <button class="edit-btn" @click="handleEditUser">
                修改用户信息
            </button>
            <button class="logout-btn" @click="handleLogout">退出登录</button>
        </view>
    </view>
</template>

<script>
import cache from "../../services/cache.js";

export default {
    data() {
        return {
            username: "",
            realname: "",
            department: "",
            phone: "",
            avatarUrl: "/static/logo.png", // 默认头像
        };
    },
    onLoad() {
        // 从缓存中读取用户信息
        this.loadUserInfoFromCache();
    },
    onShow() {
        // 获取缓存中的用户信息
        const userInfo = cache.getUserInfo();
        this.username = cache.getUsername() || "用户";

        // 从缓存中读取用户详细信息（新增）
        if (userInfo) {
            this.realname = userInfo.realname || "";
            this.department = userInfo.department || "";
            this.phone = userInfo.phone || "";
            this.avatarUrl = userInfo.avatarUrl || "/static/logo.png";
        }
    },
    methods: {
        /**
         * 从缓存加载用户信息
         * 解决登录后首次进入页面数据为空的问题
         */
        loadUserInfoFromCache() {
            const userInfo = cache.getUserInfo();
            this.username = cache.getUsername() || "用户";

            // 从缓存中读取用户详细信息
            if (userInfo) {
                this.realname = userInfo.realname || "";
                this.department = userInfo.department || "";
                this.phone = userInfo.phone || "";
                this.avatarUrl = userInfo.avatarUrl || "/static/logo.png";
            }
        },

        handleEditUser() {
            uni.navigateTo({
                url: "/pages/mine/modifyinfo",
            });
        },
        handleLogout() {
            // 清除所有缓存数据
            cache.clearAll();
            // 跳转到登录页面
            uni.reLaunch({
                url: "/pages/login/login",
            });
        },
    },
};
</script>

<style>
.container {
    /* justify-content: center;
	align-items: center; */
    /* display: flex; */
    height: 100vh;
    padding: 40rpx;
    background: linear-gradient(to bottom, #7fd1e3, #f0fdfe);
}

.user-info {
    display: flex;
    align-items: center;
    margin-top: 30px;
}

.avatar {
    width: 250rpx;
    height: 250rpx;
    border-radius: 125rpx;
    margin-bottom: 20rpx;
    border: 4rpx solid #f0f0f0;
}

.username {
    /* display: block; */
    font-size: 100rpx;
    color: #333;
    font-weight: bold;
    margin-left: 50px;
}

.data {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    border: 3rpx solid #007aff;
    border-radius: 12rpx;
    margin-top: 20rpx;

    padding: 20rpx;
    gap: 20rpx;
}

.data text {
    font-size: 35rpx;
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
    margin-top: 30px;
}

.edit-btn {
    background: #007aff;
    color: white;
    border: none;
    border-radius: 8rpx;
    height: 80rpx;
    font-size: 32rpx;
    min-width: 200rpx;
}

.logout-btn {
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 8rpx;
    height: 80rpx;
    font-size: 32rpx;
    min-width: 200rpx;
}
</style>

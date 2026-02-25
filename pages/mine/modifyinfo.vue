<template>
    <view class="container">
        <view class="form">
            <view class="avatar-section">
                <image
                    class="avatar"
                    :src="formData.avatarUrl"
                    mode="aspectFill"
                    @click="chooseAvatar"
                />
                <text class="avatar-tip">点击更换头像</text>
            </view>

            <view class="form-item">
                <text class="label">用户名：</text>
                <input
                    class="input"
                    v-model="formData.username"
                    placeholder="请输入用户名"
                />
            </view>

            <view class="form-item">
                <text class="label">手机号：</text>
                <input
                    class="input"
                    v-model="formData.phone"
                    placeholder="请输入手机号"
                    type="number"
                />
            </view>

            <view class="form-item">
                <text class="label">真实姓名：</text>
                <input
                    class="input"
                    v-model="formData.realname"
                    placeholder="请输入真实姓名"
                />
            </view>

            <!-- <view class="form-item">
				<text class="label">邮箱：</text>
				<input class="input" v-model="formData.email" placeholder="请输入邮箱"  />
			</view> -->

            <view class="form-item">
                <text class="label">所在部门：</text>
                <input
                    class="input"
                    v-model="formData.department"
                    placeholder="请输入部门"
                />
            </view>

            <view class="button-group">
                <button class="save-btn" @click="saveUserInfo">保存修改</button>
                <button class="cancel-btn" @click="goBack">取消</button>
            </view>
        </view>
    </view>
</template>

<script>
import cache from "../../services/cache.js";
import api from "../../services/api.js";

export default {
    data() {
        return {
            // 标记用户是否选择了新头像
            isNewAvatar: false,
            formData: {
                userid: "",
                username: "",
                realname: "",
                phone: "",
                password: "",
                department: "",
                avatarUrl: "/static/logo.png",
            },
        };
    },
    onLoad() {
        this.loadUserInfo();
    },
    methods: {
        loadUserInfo() {
            const userInfo = cache.getUserInfo();
            if (userInfo) {
                this.formData = {
                    userid: userInfo.userid || userInfo.id || "",
                    username: userInfo.username || "",
                    realname: userInfo.realname || "",
                    phone: userInfo.phone || "",
                    password: "",
                    department: userInfo.department || "",
                    avatarUrl: userInfo.avatarUrl || "/static/logo.png",
                };
            }
        },
        chooseAvatar() {
            uni.chooseImage({
                count: 1,
                sizeType: ["compressed"],
                sourceType: ["album", "camera"],
                success: (res) => {
                    this.formData.avatarUrl = res.tempFilePaths[0];
                    this.isNewAvatar = true; // 标记用户选择了新头像
                },
            });
        },
        saveUserInfo() {
            if (!this.formData.username.trim()) {
                uni.showToast({
                    title: "请输入用户名",
                    icon: "none",
                });
                return;
            }

            // 获取缓存中的用户ID
            const userInfo = cache.getUserInfo() || {};
            const userid = userInfo.userid || userInfo.id;

            uni.showLoading({
                title: "保存中...",
            });

            // 定义更新用户信息的函数
            const doUpdateUser = async (avatarUrl) => {
                //
                // 字段名与后端UserDTO一致
                const userData = {
                    userid: userid,
                    username: this.formData.username,
                    password: this.formData.password,
                    realname: this.formData.realname,
                    department: this.formData.department,
                    phone: this.formData.phone,
                    type: userInfo.type || 0,
                    useravatar: avatarUrl,
                };

                try {
                    const res = await api.userApi.updateUser(userData);

                    if (res.status === "success") {
                        // API调用成功后，更新本地缓存
                        const updatedUserInfo = {
                            ...userInfo,
                            ...this.formData,
                            userid: userid,
                            avatarUrl: avatarUrl,
                        };
                        cache.setUserInfo(updatedUserInfo);
                        cache.setUsername(this.formData.username);

                        uni.showToast({
                            title: "更新成功",
                            icon: "success",
                        });
                        setTimeout(() => {
                            uni.navigateBack();
                        }, 1500);
                    } else {
                        uni.showToast({
                            title: res.message || "更新失败",
                            icon: "none",
                        });
                    }
                } catch (error) {
                    console.error("更新用户信息失败：", error);
                    uni.showToast({
                        title: "网络错误，请重试",
                        icon: "none",
                    });
                } finally {
                    uni.hideLoading();
                }
            };

            // 判断是否需要上传新头像
            if (this.isNewAvatar && this.formData.avatarUrl) {
                // 先上传头像到OSS，获取URL后再更新用户信息
                console.log("avatarUrl");
                api.wrenchApi
                    .uploadImage(this.formData.avatarUrl)

                    .then((uploadRes) => {
                        // 上传成功，获取返回的头像URL
                        const avatarUrl = uploadRes.imageUrl || "";
                        console.log("头像上传成功，URL：", avatarUrl);
                        if (avatarUrl) {
                            doUpdateUser(avatarUrl);
                        } else {
                            uni.showToast({
                                title: "头像上传失败，未获取到URL",
                                icon: "none",
                            });
                            uni.hideLoading();
                        }
                    })
                    .catch((err) => {
                        console.error("头像上传失败：", err);
                        uni.showToast({
                            title: "头像上传失败",
                            icon: "none",
                        });
                        uni.hideLoading();
                    });
            } else {
                // 没有新头像，直接更新用户信息，传入当前头像URL
                doUpdateUser(this.formData.avatarUrl);
            }
        },
        goBack() {
            uni.navigateBack();
        },
    },
};
</script>

<style>
.container {
    padding: 40rpx;
    background: linear-gradient(to bottom, #7fd1e3, #f0fdfe);
    min-height: 100vh;
}

.form {
    background: white;
    border-radius: 20rpx;
    padding: 40rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.avatar-section {
    text-align: center;
    margin-bottom: 40rpx;
}

.avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    border: 4rpx solid #f0f0f0;
}

.avatar-tip {
    display: block;
    font-size: 26rpx;
    color: #666;
    margin-top: 10rpx;
}

.form-item {
    margin-bottom: 30rpx;
}

.label {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 10rpx;
    font-weight: bold;
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
    vertical-align: middle;
}

.input::placeholder {
    font-size: 28rpx;
    /* color: #999; */
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    margin-top: 40rpx;
}

.save-btn {
    background: #007aff;
    color: white;
    border: none;
    border-radius: 8rpx;
    height: 80rpx;
    font-size: 32rpx;
}

.cancel-btn {
    background: #f0f0f0;
    color: #666;
    border: none;
    border-radius: 8rpx;
    height: 80rpx;
    font-size: 32rpx;
}
</style>
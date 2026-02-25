<template>
    <view class="container">
        <!-- 轮播图 -->
        <!-- 		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :circular="true">
			<swiper-item v-for="(item, index) in bannerImages" :key="index">
				<image :src="item" class="swiper-image" mode="aspectFit" />
			</swiper-item>
		</swiper> -->

        <view class="button">
            <button class="btn" @click="openRelease">市场部</button>
            <button class="btn" @click="openTechnical">技术部</button>
        </view>
        <view class="button">
            <button class="btn" @click="openTask">生产部</button>
            <button class="btn" @click="openQuality">品质部</button>
        </view>

        <!-- 		<view class="button">
			<button class="btn" @click="openReleasedt">市场部车工</button>
			<button class="btn" @click="openTechnicaldt">技术部车工</button>
		</view>
		<view class="button">
		<button class="btn" @click="openTaskdt">生产部车工</button>
		<button class="btn" @click="openQualitydt">品质部车工</button>
		</view> -->
    </view>
</template>

<script>
export default {
    data() {
        return {
            bannerImages: [
                "/static/image/1.jpg",
                "/static/image/2.jpg",
                "/static/image/4.jpg",
            ],
        };
    },
    methods: {
        openRelease() {
            uni.navigateTo({
                url: "/pages/index/release",
            });
        },
        openTechnical() {
            uni.navigateTo({
                url: "/pages/index/technical",
            });
        },
        openTorqueWrench() {
            uni.navigateTo({
                url: "/pages/index/wrench",
            });
        },
        openTask() {
            uni.navigateTo({
                url: "/pages/index/task",
            });
        },
        openQuality() {
            uni.navigateTo({
                url: "/pages/index/qt",
            });
        },
    },
};
</script>

<style>
.container {
    padding: 20rpx;
}

.swiper {
    height: 380rpx;
    border-radius: 12rpx;
    overflow: hidden;
    margin-bottom: 30rpx;
}

.swiper-image {
    width: 100%;
    height: 100%;
}

.button {
    display: flex;
    align-items: center;
    gap: 40rpx;
    border: 3rpx solid #007aff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
}

.btn {
    background: #007aff;
    color: white;
    border: none;
    border-radius: 8rpx;
    padding: 20rpx 30rpx;
    font-size: 28rpx;
    min-width: 200rpx;
    /* 		background: #007aff;
		color: white;
		border: none;
		border-radius: 6rpx;
		padding: 16rpx 30rpx;
		font-size: 28rpx;
		margin-left: 20rpx; */
    transition: all 0.4s ease; /* 新增：平滑过渡 */
}
.btn:active {
    /* 新增：点击状态 */
    background: #0056cc; /* 更深的蓝色 */
    transform: scale(0.95); /* 轻微缩小 */
}

.company-images {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.company-image {
    width: 100%;
    height: 400rpx;
    border-radius: 8rpx;
}
</style>

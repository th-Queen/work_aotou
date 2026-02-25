if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const API_BASE_URL = "http://localhost:8059";
  const request = (url, method = "GET", data = {}) => {
    return new Promise((resolve, reject) => {
      uni.request({
        url,
        method,
        data,
        success: (res) => {
          resolve(res.data);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  };
  const userApi = {
    // 用户登录
    login: (username, password) => {
      return request(`${API_BASE_URL}/user/login`, "POST", {
        username,
        password
      });
    },
    // 用户注册
    register: (username, password) => {
      return request(`${API_BASE_URL}/user/register`, "POST", {
        username,
        password
      });
    },
    // 修改用户信息（新增:2.3）
    // userData，包含 useravatar,string类型（头像URL）
    updateUser: (userData) => {
      return request(`${API_BASE_URL}/user/update`, "POST", userData);
    }
  };
  const releaseApi = {
    // 发布新任务
    createTask: (taskData) => {
      return request(`${API_BASE_URL}/order/save`, "POST", taskData);
    }
  };
  const taskApi = {
    //显示任务列表
    taskList: (userid) => {
      return request(`${API_BASE_URL}/search/searchAllOrders`, "POST", userid);
    },
    // “确认完成”按钮方法
    taskComplete: (orderid) => {
      return request(`${API_BASE_URL}/order/finish`, "POST", orderid);
    }
  };
  const api = {
    userApi,
    // wrenchApi,
    releaseApi,
    taskApi
  };
  const CACHE_KEYS = {
    IS_LOGGED_IN: "isLoggedIn",
    USERNAME: "username",
    USER_INFO: "userInfo"
  };
  const cacheService = {
    // 保存登录状态
    setLoginStatus: (isLoggedIn) => {
      uni.setStorageSync(CACHE_KEYS.IS_LOGGED_IN, isLoggedIn);
    },
    // 获取登录状态
    getLoginStatus: () => {
      return uni.getStorageSync(CACHE_KEYS.IS_LOGGED_IN) || false;
    },
    // 保存用户名
    setUsername: (username) => {
      uni.setStorageSync(CACHE_KEYS.USERNAME, username);
    },
    // 获取用户名
    getUsername: () => {
      return uni.getStorageSync(CACHE_KEYS.USERNAME) || "";
    },
    // 保存用户信息
    setUserInfo: (userInfo) => {
      uni.setStorageSync(CACHE_KEYS.USER_INFO, userInfo);
    },
    // 获取用户信息
    getUserInfo: () => {
      return uni.getStorageSync(CACHE_KEYS.USER_INFO) || null;
    },
    // 清除所有缓存
    clearAll: () => {
      uni.removeStorageSync(CACHE_KEYS.IS_LOGGED_IN);
      uni.removeStorageSync(CACHE_KEYS.USERNAME);
      uni.removeStorageSync(CACHE_KEYS.USER_INFO);
    }
  };
  const _imports_0 = "/static/logo.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$c = {
    data() {
      return {
        username: "",
        password: ""
      };
    },
    methods: {
      handleLogin() {
        if (!this.username.trim()) {
          uni.showToast({
            title: "请输入用户名",
            icon: "none"
          });
          return;
        }
        if (!this.password.trim()) {
          uni.showToast({
            title: "请输入密码",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "登录中..."
        });
        api.userApi.login(this.username, this.password).then((res) => {
          uni.hideLoading();
          if (res.status === "success") {
            formatAppLog("log", "at pages/login/login.vue:86", "res.data:", res.data);
            cacheService.setLoginStatus(true);
            cacheService.setUsername(this.username);
            cacheService.setUserInfo(res.data);
            uni.switchTab({
              url: "/pages/index/index"
            });
          } else {
            uni.showToast({
              title: res.message || "登录失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          uni.hideLoading();
          uni.showToast({
            title: "网络错误，请重试",
            icon: "none"
          });
          formatAppLog("error", "at pages/login/login.vue:108", "登录请求失败:", err);
        });
      },
      goToRegister() {
        uni.navigateTo({
          url: "/pages/login/register"
        });
      },
      goToRegisterz() {
        uni.navigateTo({
          url: "/pages/login/lianxi"
        });
      },
      goToRegisterz2() {
        uni.navigateTo({
          url: "/pages/login/ceshi"
        });
      }
    },
    onLoad() {
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-container" }, [
      vue.createElementVNode("view", { class: "login-header" }, [
        vue.createElementVNode("image", {
          src: _imports_0,
          class: "logo"
        }),
        vue.createElementVNode("text", { class: "app-title" }, "远大石化机械螺栓紧固APP")
      ]),
      vue.createElementVNode("view", { class: "login-form" }, [
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "用户名："),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.username = $event),
              placeholder: "请输入用户名",
              maxlength: 20
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.username]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "密码："),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.password = $event),
              placeholder: "请输入密码",
              password: "",
              maxlength: 20
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.password]
          ])
        ]),
        vue.createElementVNode("button", {
          class: "login-btn",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.handleLogin && $options.handleLogin(...args))
        }, "登录"),
        vue.createElementVNode("view", { class: "register-link" }, [
          vue.createElementVNode("text", null, "还没有账号？"),
          vue.createElementVNode("text", {
            class: "register-text",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.goToRegister && $options.goToRegister(...args))
          }, "立即注册")
        ]),
        vue.createCommentVNode(' <text class="register-text" @click="goToRegisterz">ceshi1</text> '),
        vue.createCommentVNode(' <text class="register-text" @click="goToRegisterz2">ceshi2</text> ')
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "D:/HBuilderProjects/2026_33/factory/pages/login/login.vue"]]);
  const _sfc_main$b = {
    data() {
      return {
        username: "",
        password: "",
        confirmPassword: ""
      };
    },
    methods: {
      handleRegister() {
        if (!this.username.trim()) {
          uni.showToast({
            title: "请输入用户名",
            icon: "none"
          });
          return;
        }
        if (!this.password.trim()) {
          uni.showToast({
            title: "请输入密码",
            icon: "none"
          });
          return;
        }
        if (this.password !== this.confirmPassword) {
          uni.showToast({
            title: "两次密码输入不一致",
            icon: "none"
          });
          return;
        }
        api.userApi.register(this.username, this.password).then((res) => {
          uni.hideLoading();
          if (res.status === "success") {
            uni.showToast({
              title: "注册成功",
              icon: "success"
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 10);
          } else if (res.message === "用户名已存在") {
            uni.showToast({
              title: res.message || "注册失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          uni.hideLoading();
          uni.showToast({
            title: "网络错误，请重试",
            icon: "none"
          });
          formatAppLog("error", "at pages/login/register.vue:120", "注册请求失败:", err);
        });
      },
      goToLogin() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "register-container" }, [
      vue.createElementVNode("view", { class: "register-header" }, [
        vue.createElementVNode("image", {
          src: _imports_0,
          class: "logo"
        }),
        vue.createElementVNode("text", { class: "app-title" }, "远大石化机械螺栓紧固APP"),
        vue.createElementVNode("text", { class: "page-title" }, "用户注册")
      ]),
      vue.createElementVNode("view", { class: "register-form" }, [
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "用户名："),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.username = $event),
              placeholder: "请输入用户名",
              maxlength: 20
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.username]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "密码："),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.password = $event),
              placeholder: "请输入密码",
              password: "",
              maxlength: 20
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.password]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "确认密码："),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.confirmPassword = $event),
              placeholder: "请再次输入密码",
              password: "",
              maxlength: 20
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.confirmPassword]
          ])
        ]),
        vue.createElementVNode("button", {
          class: "register-btn",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.handleRegister && $options.handleRegister(...args))
        }, "注册"),
        vue.createElementVNode("view", { class: "login-link" }, [
          vue.createElementVNode("text", null, "已有账号？"),
          vue.createElementVNode("text", {
            class: "login-text",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.goToLogin && $options.goToLogin(...args))
          }, "立即登录")
        ])
      ])
    ]);
  }
  const PagesLoginRegister = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "D:/HBuilderProjects/2026_33/factory/pages/login/register.vue"]]);
  const _sfc_main$a = {
    data() {
      return {
        bannerImages: [
          "/static/image/1.jpg",
          "/static/image/2.jpg",
          "/static/image/4.jpg"
        ]
      };
    },
    methods: {
      openRelease() {
        uni.navigateTo({
          url: "/pages/index/release"
        });
      },
      openTechnical() {
        uni.navigateTo({
          url: "/pages/index/technical"
        });
      },
      openTorqueWrench() {
        uni.navigateTo({
          url: "/pages/index/wrench"
        });
      },
      openBoltStretcher() {
        uni.showToast({
          title: "打开液压螺栓拉伸器",
          icon: "none"
        });
      },
      openTask() {
        uni.navigateTo({
          url: "/pages/index/task"
        });
      },
      openQuality() {
        uni.navigateTo({
          url: "/pages/index/qt"
        });
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 轮播图 "),
      vue.createCommentVNode(' 		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :circular="true">\n			<swiper-item v-for="(item, index) in bannerImages" :key="index">\n				<image :src="item" class="swiper-image" mode="aspectFit" />\n			</swiper-item>\n		</swiper> '),
      vue.createElementVNode("view", { class: "button" }, [
        vue.createElementVNode("button", {
          class: "btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.openRelease && $options.openRelease(...args))
        }, "市场部"),
        vue.createElementVNode("button", {
          class: "btn",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.openTechnical && $options.openTechnical(...args))
        }, "技术部")
      ]),
      vue.createElementVNode("view", { class: "button" }, [
        vue.createElementVNode("button", {
          class: "btn",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.openTask && $options.openTask(...args))
        }, "生产部"),
        vue.createElementVNode("button", {
          class: "btn",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.openQuality && $options.openQuality(...args))
        }, "品质部")
      ]),
      vue.createCommentVNode(" 公司图片 "),
      vue.createCommentVNode(' 		<view class="company-images">\n			<image src="/static/image/1.jpg" class="company-image" mode="aspectFit" />\n			<image src="/static/image/2.jpg" class="company-image" mode="aspectFit" />\n		</view> ')
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "D:/HBuilderProjects/2026_33/factory/pages/index/index.vue"]]);
  const _sfc_main$9 = {
    data() {
      return {
        username: "",
        realname: "",
        department: "",
        phone: "",
        avatarUrl: "/static/logo.png"
        // 默认头像
      };
    },
    onLoad() {
      this.loadUserInfoFromCache();
    },
    onShow() {
      const userInfo = cacheService.getUserInfo();
      this.username = cacheService.getUsername() || "用户";
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
        const userInfo = cacheService.getUserInfo();
        this.username = cacheService.getUsername() || "用户";
        if (userInfo) {
          this.realname = userInfo.realname || "";
          this.department = userInfo.department || "";
          this.phone = userInfo.phone || "";
          this.avatarUrl = userInfo.avatarUrl || "/static/logo.png";
        }
      },
      handleEditUser() {
        uni.navigateTo({
          url: "/pages/mine/modifyinfo"
        });
      },
      handleLogout() {
        cacheService.clearAll();
        uni.reLaunch({
          url: "/pages/login/login"
        });
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "user-info" }, [
        vue.createElementVNode("image", {
          class: "avatar",
          src: $data.avatarUrl,
          mode: "aspectFill"
        }, null, 8, ["src"]),
        vue.createElementVNode(
          "text",
          { class: "username" },
          vue.toDisplayString($data.username),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "data" }, [
        vue.createElementVNode(
          "text",
          null,
          "姓名: " + vue.toDisplayString($data.realname),
          1
          /* TEXT */
        ),
        vue.createCommentVNode(" 新增：显示真实姓名 "),
        vue.createElementVNode(
          "text",
          null,
          "所在部门: " + vue.toDisplayString($data.department),
          1
          /* TEXT */
        ),
        vue.createCommentVNode(" 新增：显示部门 "),
        vue.createElementVNode(
          "text",
          null,
          "联系电话: " + vue.toDisplayString($data.phone),
          1
          /* TEXT */
        ),
        vue.createCommentVNode(" 新增：显示电话 ")
      ]),
      vue.createElementVNode("view", { class: "button-group" }, [
        vue.createElementVNode("button", {
          class: "edit-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleEditUser && $options.handleEditUser(...args))
        }, "修改用户信息"),
        vue.createElementVNode("button", {
          class: "logout-btn",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.handleLogout && $options.handleLogout(...args))
        }, "退出登录")
      ])
    ]);
  }
  const PagesMineMine = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "D:/HBuilderProjects/2026_33/factory/pages/mine/mine.vue"]]);
  const _sfc_main$8 = {
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
          avatarUrl: "/static/logo.png"
        }
      };
    },
    onLoad() {
      this.loadUserInfo();
    },
    methods: {
      loadUserInfo() {
        const userInfo = cacheService.getUserInfo();
        if (userInfo) {
          this.formData = {
            userid: userInfo.userid || userInfo.id || "",
            username: userInfo.username || "",
            realname: userInfo.realname || "",
            phone: userInfo.phone || "",
            password: "",
            department: userInfo.department || "",
            avatarUrl: userInfo.avatarUrl || "/static/logo.png"
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
            this.isNewAvatar = true;
          }
        });
      },
      saveUserInfo() {
        if (!this.formData.username.trim()) {
          uni.showToast({
            title: "请输入用户名",
            icon: "none"
          });
          return;
        }
        const userInfo = cacheService.getUserInfo() || {};
        const userid = userInfo.userid || userInfo.id;
        uni.showLoading({
          title: "保存中..."
        });
        const doUpdateUser = async (avatarUrl) => {
          const userData = {
            userid,
            username: this.formData.username,
            password: this.formData.password,
            realname: this.formData.realname,
            department: this.formData.department,
            phone: this.formData.phone,
            type: userInfo.type || 0,
            useravatar: avatarUrl
          };
          try {
            const res = await api.userApi.updateUser(userData);
            if (res.status === "success") {
              const updatedUserInfo = {
                ...userInfo,
                ...this.formData,
                userid,
                avatarUrl
              };
              cacheService.setUserInfo(updatedUserInfo);
              cacheService.setUsername(this.formData.username);
              uni.showToast({
                title: "更新成功",
                icon: "success"
              });
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            } else {
              uni.showToast({
                title: res.message || "更新失败",
                icon: "none"
              });
            }
          } catch (error2) {
            formatAppLog("error", "at pages/mine/modifyinfo.vue:153", "更新用户信息失败：", error2);
            uni.showToast({
              title: "网络错误，请重试",
              icon: "none"
            });
          } finally {
            uni.hideLoading();
          }
        };
        if (this.isNewAvatar && this.formData.avatarUrl) {
          formatAppLog("log", "at pages/mine/modifyinfo.vue:166", "avatarUrl");
          api.wrenchApi.uploadImage(this.formData.avatarUrl).then((uploadRes) => {
            const avatarUrl = uploadRes.imageUrl || "";
            formatAppLog("log", "at pages/mine/modifyinfo.vue:172", "头像上传成功，URL：", avatarUrl);
            if (avatarUrl) {
              doUpdateUser(avatarUrl);
            } else {
              uni.showToast({
                title: "头像上传失败，未获取到URL",
                icon: "none"
              });
              uni.hideLoading();
            }
          }).catch((err) => {
            formatAppLog("error", "at pages/mine/modifyinfo.vue:184", "头像上传失败：", err);
            uni.showToast({
              title: "头像上传失败",
              icon: "none"
            });
            uni.hideLoading();
          });
        } else {
          doUpdateUser(this.formData.avatarUrl);
        }
      },
      goBack() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "form" }, [
        vue.createElementVNode("view", { class: "avatar-section" }, [
          vue.createElementVNode("image", {
            class: "avatar",
            src: $data.formData.avatarUrl,
            mode: "aspectFill",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.chooseAvatar && $options.chooseAvatar(...args))
          }, null, 8, ["src"]),
          vue.createElementVNode("text", { class: "avatar-tip" }, "点击更换头像")
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "用户名："),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.formData.username = $event),
              placeholder: "请输入用户名"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.formData.username]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "手机号："),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.formData.phone = $event),
              placeholder: "请输入手机号",
              type: "number"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.formData.phone]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "真实姓名："),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.formData.realname = $event),
              placeholder: "请输入真实姓名"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.formData.realname]
          ])
        ]),
        vue.createCommentVNode(' <view class="form-item">\n				<text class="label">邮箱：</text>\n				<input class="input" v-model="formData.email" placeholder="请输入邮箱"  />\n			</view> '),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "所在部门："),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.formData.department = $event),
              placeholder: "请输入部门"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.formData.department]
          ])
        ]),
        vue.createElementVNode("view", { class: "button-group" }, [
          vue.createElementVNode("button", {
            class: "save-btn",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.saveUserInfo && $options.saveUserInfo(...args))
          }, "保存修改"),
          vue.createElementVNode("button", {
            class: "cancel-btn",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.goBack && $options.goBack(...args))
          }, "取消")
        ])
      ])
    ]);
  }
  const PagesMineModifyinfo = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "D:/HBuilderProjects/2026_33/factory/pages/mine/modifyinfo.vue"]]);
  const _sfc_main$7 = {
    data() {
      return {
        isUrgent: true,
        taskName: "",
        // mainPerson: '',//负责人
        // 预设人员列表
        staffList: ["张师傅", "李师傅", "王师傅"],
        processes: [],
        // 初始为空，通过弹窗添加
        showModal: false,
        modalName: "",
        selectedStaff: "",
        modalDuration: null
      };
    },
    computed: {
      canPublish() {
        return this.taskName.trim() && // this.mainPerson.trim() && 
        this.processes.length > 0 && this.processes.every(
          (proc) => proc.name.trim() && proc.person && proc.duration > 0
        );
      }
    },
    methods: {
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
          duration: parseFloat(this.modalDuration.toFixed(1))
        });
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
        formatAppLog("log", "at pages/index/release.vue:189", "taskName:", this.taskName);
        if (!this.canPublish)
          return;
        const userInfo = uni.getStorageSync("userInfo") || {};
        const orderstatus = "production";
        const createtime = (/* @__PURE__ */ new Date()).toISOString();
        const taskData = {
          userid: userInfo.userid,
          orderurgency: this.isUrgent ? "紧急" : "普通",
          ordername: this.taskName.trim(),
          orderstatus,
          //整个任务单的任务状态
          // mainPerson: this.mainPerson.trim(),后端无负责人字段
          createtime,
          orderprocess: this.processes.map((p) => ({
            name: p.name,
            people: p.person,
            time: p.duration
          }))
        };
        formatAppLog("log", "at pages/index/release.vue:210", "完整的 taskData:", JSON.stringify(taskData, null, 2));
        try {
          const res = await api.releaseApi.createTask(taskData);
          uni.showToast({
            title: "任务发布成功！",
            icon: "success"
          });
        } catch (error2) {
          formatAppLog("error", "at pages/index/release.vue:218", "API错误", error2);
          uni.showToast({ title: "发布失败，请重试", icon: "none" });
        }
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(' 	发布页面说明\n		大致流程：排单员可以点击"新增"按钮，新增排单任务。排单员可以点击设置单任务的"紧急程度"，\n		分为（红色：重要紧急任务）和(绿色:不紧急任务）；在设置紧急程度的下方是任务工序框，任务工序框包含："任务名称"、"人员姓名"和"时长"、"工序"三部分，\n		排单员可以输入"任务名称"，排单员可以输入"人员姓名"，"时长"；\n		在排单任务里面，排单员可以选择新增填写"工序"，新增的工序要有序号1、2、3、4......工序分为1："人员姓名"和2："时长"，\n		最后填写完毕才能点击发布按钮进行发布任务。 '),
        vue.createElementVNode("view", { class: "publish-container" }, [
          vue.createElementVNode("view", { class: "urgency-section" }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["urgency-btn urgent", { active: $data.isUrgent }]),
                onClick: _cache[0] || (_cache[0] = ($event) => $options.setUrgency(true))
              },
              " 重要紧急任务 ",
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["urgency-btn normal", { active: !$data.isUrgent }]),
                onClick: _cache[1] || (_cache[1] = ($event) => $options.setUrgency(false))
              },
              " 不紧急任务 ",
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("view", { class: "task-section" }, [
            vue.createElementVNode("text", { class: "label" }, "任务名称"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.taskName = $event),
                placeholder: "请输入任务名称",
                class: "input"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.taskName]
            ]),
            vue.createCommentVNode(' 	  <text class="label">负责人</text>\r\n	  <input \r\n	    v-model="mainPerson" \r\n	    placeholder="请输入负责人姓名" \r\n	    class="input"\r\n	  /> '),
            vue.createElementVNode("view", { class: "process-list" }, [
              vue.createElementVNode("view", { class: "process-header" }, [
                vue.createElementVNode("text", null, "工序列表"),
                vue.createElementVNode("button", {
                  onClick: _cache[3] || (_cache[3] = ($event) => $data.showModal = true),
                  class: "add-btn"
                }, "+ 新增工序")
              ]),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.processes, (process, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "process-item"
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "process-index" },
                      vue.toDisplayString(index + 1) + ".",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "process-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "process-name" },
                        "「" + vue.toDisplayString(process.name) + "」",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "process-desc" },
                        "人员: " + vue.toDisplayString(process.person) + " | 时长: " + vue.toDisplayString(process.duration) + "h",
                        1
                        /* TEXT */
                      )
                    ]),
                    $data.processes.length > 1 ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 0,
                      onClick: ($event) => $options.removeProcess(index),
                      class: "remove-btn"
                    }, " × ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createCommentVNode(" 弹窗 "),
            $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "modal-mask",
              onClick: _cache[4] || (_cache[4] = ($event) => $data.showModal = false)
            })) : vue.createCommentVNode("v-if", true),
            $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "modal"
            }, [
              vue.createElementVNode("view", { class: "modal-header" }, "新增工序"),
              vue.createElementVNode("view", { class: "modal-content" }, [
                vue.createElementVNode("view", { class: "modal-field" }, [
                  vue.createElementVNode("text", { class: "modal-label" }, "工序名称"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.modalName = $event),
                      placeholder: "请输入工序名称",
                      class: "input modal-input",
                      maxlength: "20"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.modalName]
                  ])
                ]),
                vue.createElementVNode("view", { class: "modal-field" }, [
                  vue.createElementVNode("text", { class: "modal-label" }, "选择人员"),
                  vue.createElementVNode("picker", {
                    mode: "selector",
                    range: $data.staffList,
                    onChange: _cache[6] || (_cache[6] = (...args) => $options.onStaffChange && $options.onStaffChange(...args))
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "picker" },
                      vue.toDisplayString($data.selectedStaff || "请选择人员"),
                      1
                      /* TEXT */
                    )
                  ], 40, ["range"])
                ]),
                vue.createElementVNode("view", { class: "modal-field" }, [
                  vue.createElementVNode("text", { class: "modal-label" }, "时长(h)"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.modalDuration = $event),
                      type: "number",
                      placeholder: "请输入时长:h",
                      class: "input modal-input",
                      min: "0.5",
                      step: "0.5"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      vue.vModelText,
                      $data.modalDuration,
                      void 0,
                      { number: true }
                    ]
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "modal-footer" }, [
                vue.createElementVNode("button", {
                  onClick: _cache[8] || (_cache[8] = ($event) => $data.showModal = false),
                  class: "modal-btn cancel"
                }, "取消"),
                vue.createElementVNode("button", {
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.confirmAddProcess && $options.confirmAddProcess(...args)),
                  class: "modal-btn confirm"
                }, "确定添加")
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("button", {
              onClick: _cache[10] || (_cache[10] = (...args) => $options.publishTask && $options.publishTask(...args)),
              disabled: !$options.canPublish,
              class: vue.normalizeClass(["publish-btn", { disabled: !$options.canPublish }])
            }, vue.toDisplayString($options.canPublish ? "发布任务" : "请完善任务信息"), 11, ["disabled"])
          ])
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesIndexRelease = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-aefa05e0"], ["__file", "D:/HBuilderProjects/2026_33/factory/pages/index/release.vue"]]);
  const _sfc_main$6 = {
    data() {
      return {
        tasks: []
      };
    },
    created() {
    },
    onLoad() {
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo && userInfo.userid) {
        this.getTaskList(userInfo.userid);
      }
    },
    methods: {
      async getTaskList(userId) {
        formatAppLog("log", "at pages/index/task.vue:91", "1");
        try {
          const res = await api.taskApi.taskList({ userid: userId });
          formatAppLog("log", "at pages/index/task.vue:94", res);
          if (res.status === "success") {
            this.tasks = res.data.filter((item) => item.orderstatus === "未完成").map((item) => ({
              id: item.orderid,
              taskName: item.ordername || `任务${item.orderid}`,
              urgency: item.orderurgency === "紧急" ? "urgent" : "normal",
              processes: item.orderprocess || [],
              expanded: false
              // 展开
            }));
          }
        } catch (error2) {
          formatAppLog("error", "at pages/index/task.vue:107", "获取任务失败", error2);
          uni.showToast({ title: "加载任务失败", icon: "none" });
        }
      },
      calculateTotalDuration(task) {
        return task.processes.reduce((sum, p) => sum + (parseFloat(p.time) || 0), 0).toFixed(1);
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
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(' 车工确认任务页面：显示发布页的任务条，每个任务条下方有"确定完成"和"还没完成"操作按钮 '),
        vue.createElementVNode("view", { class: "task-container" }, [
          vue.createElementVNode("view", { class: "header" }, "车工任务列表"),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.tasks, (task) => {
              return vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: task.id,
                  class: vue.normalizeClass(["task-card", { "urgent-task": task.urgency === "urgent" }])
                },
                [
                  vue.createElementVNode("view", { class: "task-header" }, [
                    vue.createElementVNode(
                      "view",
                      { class: "task-title" },
                      vue.toDisplayString(task.taskName),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["urgency-tag", task.urgency === "urgent" ? "urgent" : "normal"])
                      },
                      vue.toDisplayString(task.urgency === "urgent" ? "重要紧急" : "普通任务"),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "task-info" }, [
                    vue.createCommentVNode(" <text>负责人：{{ task.mainPerson }}</text> "),
                    vue.createCommentVNode(" <text>时长：{{ task.mainDuration }}小时</text> ")
                  ]),
                  vue.createElementVNode("view", {
                    class: "advanced-toggle",
                    onClick: ($event) => task.expanded = !task.expanded
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(task.expanded ? "收起" : "展开") + "查看工序",
                      1
                      /* TEXT */
                    )
                  ], 8, ["onClick"]),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["advanced-fields", { "expanded": task.expanded }])
                    },
                    [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(task.processes, (process, index) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            key: index,
                            class: "taskview"
                          }, [
                            vue.createCommentVNode(" <text>工序{{ index + 1 }}: {{ process.name }} | {{ process.people }} | {{ process.time }}h</text> "),
                            vue.createElementVNode(
                              "text",
                              null,
                              "工序" + vue.toDisplayString(index + 1) + ":",
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              "工序名称" + vue.toDisplayString(process.name),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              "人员姓名" + vue.toDisplayString(process.people),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              "工序时长" + vue.toDisplayString(process.time),
                              1
                              /* TEXT */
                            )
                          ]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ],
                    2
                    /* CLASS */
                  ),
                  vue.createCommentVNode(" 操作按钮 "),
                  vue.createElementVNode("view", { class: "action-buttons" }, [
                    vue.createElementVNode("button", {
                      class: "btn-confirm",
                      onClick: ($event) => $options.handleAction(task.id, "done"),
                      "active-class": "btn-active"
                    }, " 确定完成 ", 8, ["onClick"]),
                    vue.createElementVNode("button", {
                      class: "btn-cancel",
                      onClick: ($event) => $options.handleAction(task.id, "cancel"),
                      "active-class": "btn-active"
                    }, " 还没完成 ", 8, ["onClick"])
                  ])
                ],
                2
                /* CLASS */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          $data.tasks.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, " 暂无待处理任务 ")) : vue.createCommentVNode("v-if", true)
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesIndexTask = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-f41f7038"], ["__file", "D:/HBuilderProjects/2026_33/factory/pages/index/task.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {
        isUrgent: true,
        taskName: "",
        // mainPerson: '',//负责人
        // 预设人员列表
        staffList: ["张师傅", "李师傅", "王师傅"],
        processes: [],
        // 初始为空，通过弹窗添加
        showModal: false,
        modalName: "",
        selectedStaff: "",
        modalDuration: null
      };
    },
    computed: {
      canPublish() {
        return this.taskName.trim() && // this.mainPerson.trim() && 
        this.processes.length > 0 && this.processes.every(
          (proc) => proc.name.trim() && proc.person && proc.duration > 0
        );
      }
    },
    methods: {
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
          duration: parseFloat(this.modalDuration.toFixed(1))
        });
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
        formatAppLog("log", "at pages/index/qt.vue:189", "taskName:", this.taskName);
        if (!this.canPublish)
          return;
        const userInfo = uni.getStorageSync("userInfo") || {};
        const orderstatus = "production";
        const createtime = (/* @__PURE__ */ new Date()).toISOString();
        const taskData = {
          userid: userInfo.userid,
          orderurgency: this.isUrgent ? "紧急" : "普通",
          ordername: this.taskName.trim(),
          orderstatus,
          //整个任务单的任务状态
          // mainPerson: this.mainPerson.trim(),后端无负责人字段
          createtime,
          orderprocess: this.processes.map((p) => ({
            name: p.name,
            people: p.person,
            time: p.duration
          }))
        };
        formatAppLog("log", "at pages/index/qt.vue:210", "完整的 taskData:", JSON.stringify(taskData, null, 2));
        try {
          const res = await api.releaseApi.createTask(taskData);
          uni.showToast({
            title: "任务发布成功！",
            icon: "success"
          });
        } catch (error2) {
          formatAppLog("error", "at pages/index/qt.vue:218", "API错误", error2);
          uni.showToast({ title: "发布失败，请重试", icon: "none" });
        }
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(' 	发布页面说明\n		大致流程：排单员可以点击"新增"按钮，新增排单任务。排单员可以点击设置单任务的"紧急程度"，\n		分为（红色：重要紧急任务）和(绿色:不紧急任务）；在设置紧急程度的下方是任务工序框，任务工序框包含："任务名称"、"人员姓名"和"时长"、"工序"三部分，\n		排单员可以输入"任务名称"，排单员可以输入"人员姓名"，"时长"；\n		在排单任务里面，排单员可以选择新增填写"工序"，新增的工序要有序号1、2、3、4......工序分为1："人员姓名"和2："时长"，\n		最后填写完毕才能点击发布按钮进行发布任务。 '),
        vue.createElementVNode("view", { class: "publish-container" }, [
          vue.createElementVNode("view", { class: "urgency-section" }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["urgency-btn urgent", { active: $data.isUrgent }]),
                onClick: _cache[0] || (_cache[0] = ($event) => $options.setUrgency(true))
              },
              " 重要紧急任务 ",
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["urgency-btn normal", { active: !$data.isUrgent }]),
                onClick: _cache[1] || (_cache[1] = ($event) => $options.setUrgency(false))
              },
              " 不紧急任务 ",
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("view", { class: "task-section" }, [
            vue.createElementVNode("text", { class: "label" }, "任务名称"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.taskName = $event),
                placeholder: "请输入任务名称",
                class: "input"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.taskName]
            ]),
            vue.createCommentVNode(' 	  <text class="label">负责人</text>\r\n	  <input \r\n	    v-model="mainPerson" \r\n	    placeholder="请输入负责人姓名" \r\n	    class="input"\r\n	  /> '),
            vue.createElementVNode("view", { class: "process-list" }, [
              vue.createElementVNode("view", { class: "process-header" }, [
                vue.createElementVNode("text", null, "工序列表"),
                vue.createElementVNode("button", {
                  onClick: _cache[3] || (_cache[3] = ($event) => $data.showModal = true),
                  class: "add-btn"
                }, "+ 新增工序")
              ]),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.processes, (process, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "process-item"
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "process-index" },
                      vue.toDisplayString(index + 1) + ".",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "process-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "process-name" },
                        "「" + vue.toDisplayString(process.name) + "」",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "process-desc" },
                        "人员: " + vue.toDisplayString(process.person) + " | 时长: " + vue.toDisplayString(process.duration) + "h",
                        1
                        /* TEXT */
                      )
                    ]),
                    $data.processes.length > 1 ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 0,
                      onClick: ($event) => $options.removeProcess(index),
                      class: "remove-btn"
                    }, " × ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createCommentVNode(" 弹窗 "),
            $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "modal-mask",
              onClick: _cache[4] || (_cache[4] = ($event) => $data.showModal = false)
            })) : vue.createCommentVNode("v-if", true),
            $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "modal"
            }, [
              vue.createElementVNode("view", { class: "modal-header" }, "新增工序"),
              vue.createElementVNode("view", { class: "modal-content" }, [
                vue.createElementVNode("view", { class: "modal-field" }, [
                  vue.createElementVNode("text", { class: "modal-label" }, "工序名称"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.modalName = $event),
                      placeholder: "请输入工序名称",
                      class: "input modal-input",
                      maxlength: "20"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.modalName]
                  ])
                ]),
                vue.createElementVNode("view", { class: "modal-field" }, [
                  vue.createElementVNode("text", { class: "modal-label" }, "选择人员"),
                  vue.createElementVNode("picker", {
                    mode: "selector",
                    range: $data.staffList,
                    onChange: _cache[6] || (_cache[6] = (...args) => $options.onStaffChange && $options.onStaffChange(...args))
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "picker" },
                      vue.toDisplayString($data.selectedStaff || "请选择人员"),
                      1
                      /* TEXT */
                    )
                  ], 40, ["range"])
                ]),
                vue.createElementVNode("view", { class: "modal-field" }, [
                  vue.createElementVNode("text", { class: "modal-label" }, "时长(h)"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.modalDuration = $event),
                      type: "number",
                      placeholder: "请输入时长:h",
                      class: "input modal-input",
                      min: "0.5",
                      step: "0.5"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      vue.vModelText,
                      $data.modalDuration,
                      void 0,
                      { number: true }
                    ]
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "modal-footer" }, [
                vue.createElementVNode("button", {
                  onClick: _cache[8] || (_cache[8] = ($event) => $data.showModal = false),
                  class: "modal-btn cancel"
                }, "取消"),
                vue.createElementVNode("button", {
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.confirmAddProcess && $options.confirmAddProcess(...args)),
                  class: "modal-btn confirm"
                }, "确定添加")
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("button", {
              onClick: _cache[10] || (_cache[10] = (...args) => $options.publishTask && $options.publishTask(...args)),
              disabled: !$options.canPublish,
              class: vue.normalizeClass(["publish-btn", { disabled: !$options.canPublish }])
            }, vue.toDisplayString($options.canPublish ? "发布任务" : "请完善任务信息"), 11, ["disabled"])
          ])
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesIndexQt = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-0a25cdaf"], ["__file", "D:/HBuilderProjects/2026_33/factory/pages/index/qt.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        isUrgent: true,
        taskName: "",
        // mainPerson: '',//负责人
        // 预设人员列表
        staffList: ["张师傅", "李师傅", "王师傅"],
        processes: [],
        // 初始为空，通过弹窗添加
        showModal: false,
        modalName: "",
        selectedStaff: "",
        modalDuration: null
      };
    },
    computed: {
      canPublish() {
        return this.taskName.trim() && // this.mainPerson.trim() && 
        this.processes.length > 0 && this.processes.every(
          (proc) => proc.name.trim() && proc.person && proc.duration > 0
        );
      }
    },
    methods: {
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
          duration: parseFloat(this.modalDuration.toFixed(1))
        });
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
        formatAppLog("log", "at pages/index/technical.vue:189", "taskName:", this.taskName);
        if (!this.canPublish)
          return;
        const userInfo = uni.getStorageSync("userInfo") || {};
        const orderstatus = "production";
        const createtime = (/* @__PURE__ */ new Date()).toISOString();
        const taskData = {
          userid: userInfo.userid,
          orderurgency: this.isUrgent ? "紧急" : "普通",
          ordername: this.taskName.trim(),
          orderstatus,
          //整个任务单的任务状态
          // mainPerson: this.mainPerson.trim(),后端无负责人字段
          createtime,
          orderprocess: this.processes.map((p) => ({
            name: p.name,
            people: p.person,
            time: p.duration
          }))
        };
        formatAppLog("log", "at pages/index/technical.vue:210", "完整的 taskData:", JSON.stringify(taskData, null, 2));
        try {
          const res = await api.releaseApi.createTask(taskData);
          uni.showToast({
            title: "任务发布成功！",
            icon: "success"
          });
        } catch (error2) {
          formatAppLog("error", "at pages/index/technical.vue:218", "API错误", error2);
          uni.showToast({ title: "发布失败，请重试", icon: "none" });
        }
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(' 	发布页面说明\n		大致流程：排单员可以点击"新增"按钮，新增排单任务。排单员可以点击设置单任务的"紧急程度"，\n		分为（红色：重要紧急任务）和(绿色:不紧急任务）；在设置紧急程度的下方是任务工序框，任务工序框包含："任务名称"、"人员姓名"和"时长"、"工序"三部分，\n		排单员可以输入"任务名称"，排单员可以输入"人员姓名"，"时长"；\n		在排单任务里面，排单员可以选择新增填写"工序"，新增的工序要有序号1、2、3、4......工序分为1："人员姓名"和2："时长"，\n		最后填写完毕才能点击发布按钮进行发布任务。 '),
        vue.createElementVNode("view", { class: "publish-container" }, [
          vue.createElementVNode("view", { class: "urgency-section" }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["urgency-btn urgent", { active: $data.isUrgent }]),
                onClick: _cache[0] || (_cache[0] = ($event) => $options.setUrgency(true))
              },
              " 重要紧急任务 ",
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["urgency-btn normal", { active: !$data.isUrgent }]),
                onClick: _cache[1] || (_cache[1] = ($event) => $options.setUrgency(false))
              },
              " 不紧急任务 ",
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("view", { class: "task-section" }, [
            vue.createElementVNode("text", { class: "label" }, "任务名称"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.taskName = $event),
                placeholder: "请输入任务名称",
                class: "input"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.taskName]
            ]),
            vue.createCommentVNode(' 	  <text class="label">负责人</text>\r\n	  <input \r\n	    v-model="mainPerson" \r\n	    placeholder="请输入负责人姓名" \r\n	    class="input"\r\n	  /> '),
            vue.createElementVNode("view", { class: "process-list" }, [
              vue.createElementVNode("view", { class: "process-header" }, [
                vue.createElementVNode("text", null, "工序列表"),
                vue.createElementVNode("button", {
                  onClick: _cache[3] || (_cache[3] = ($event) => $data.showModal = true),
                  class: "add-btn"
                }, "+ 新增工序")
              ]),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.processes, (process, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "process-item"
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "process-index" },
                      vue.toDisplayString(index + 1) + ".",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "process-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "process-name" },
                        "「" + vue.toDisplayString(process.name) + "」",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "process-desc" },
                        "人员: " + vue.toDisplayString(process.person) + " | 时长: " + vue.toDisplayString(process.duration) + "h",
                        1
                        /* TEXT */
                      )
                    ]),
                    $data.processes.length > 1 ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 0,
                      onClick: ($event) => $options.removeProcess(index),
                      class: "remove-btn"
                    }, " × ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createCommentVNode(" 弹窗 "),
            $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "modal-mask",
              onClick: _cache[4] || (_cache[4] = ($event) => $data.showModal = false)
            })) : vue.createCommentVNode("v-if", true),
            $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "modal"
            }, [
              vue.createElementVNode("view", { class: "modal-header" }, "新增工序"),
              vue.createElementVNode("view", { class: "modal-content" }, [
                vue.createElementVNode("view", { class: "modal-field" }, [
                  vue.createElementVNode("text", { class: "modal-label" }, "工序名称"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.modalName = $event),
                      placeholder: "请输入工序名称",
                      class: "input modal-input",
                      maxlength: "20"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.modalName]
                  ])
                ]),
                vue.createElementVNode("view", { class: "modal-field" }, [
                  vue.createElementVNode("text", { class: "modal-label" }, "选择人员"),
                  vue.createElementVNode("picker", {
                    mode: "selector",
                    range: $data.staffList,
                    onChange: _cache[6] || (_cache[6] = (...args) => $options.onStaffChange && $options.onStaffChange(...args))
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "picker" },
                      vue.toDisplayString($data.selectedStaff || "请选择人员"),
                      1
                      /* TEXT */
                    )
                  ], 40, ["range"])
                ]),
                vue.createElementVNode("view", { class: "modal-field" }, [
                  vue.createElementVNode("text", { class: "modal-label" }, "时长(h)"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.modalDuration = $event),
                      type: "number",
                      placeholder: "请输入时长:h",
                      class: "input modal-input",
                      min: "0.5",
                      step: "0.5"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      vue.vModelText,
                      $data.modalDuration,
                      void 0,
                      { number: true }
                    ]
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "modal-footer" }, [
                vue.createElementVNode("button", {
                  onClick: _cache[8] || (_cache[8] = ($event) => $data.showModal = false),
                  class: "modal-btn cancel"
                }, "取消"),
                vue.createElementVNode("button", {
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.confirmAddProcess && $options.confirmAddProcess(...args)),
                  class: "modal-btn confirm"
                }, "确定添加")
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("button", {
              onClick: _cache[10] || (_cache[10] = (...args) => $options.publishTask && $options.publishTask(...args)),
              disabled: !$options.canPublish,
              class: vue.normalizeClass(["publish-btn", { disabled: !$options.canPublish }])
            }, vue.toDisplayString($options.canPublish ? "发布任务" : "请完善任务信息"), 11, ["disabled"])
          ])
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesIndexTechnical = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-fca77d5f"], ["__file", "D:/HBuilderProjects/2026_33/factory/pages/index/technical.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        // 初始状态
        steps: [
          { name: "技术", completed: true },
          { name: "生产", completed: false },
          { name: "品质", completed: false },
          { name: "出货", completed: false }
        ]
      };
    }
    //  后续从后端获取实际进度状态
    // mounted() {
    //   api.getProgress().then(res => {
    //     this.steps = res.data.steps
    //   })
    // }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(' 做一个过程进度页面：页面分为"技术-生产-品质-出货"，每个阶段完成之后在文字上方显示一个黄山亮灯状态表示已经完成，没有完成的时候不亮灯为灰色状态，然后流程下方是工序框，先用蓝色边框占着位置，不写内容。先写前端逻辑，后端方法还没实现 '),
        vue.createElementVNode("view", { class: "progress-container" }, [
          vue.createCommentVNode(" 流程进度条 "),
          vue.createElementVNode("view", { class: "steps" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.steps, (step, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: "step-item"
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["light", { "active": step.completed }])
                    },
                    null,
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "step-name" },
                    vue.toDisplayString(step.name),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 工序框占位（蓝色边框） "),
          vue.createElementVNode("view", { class: "process-placeholder" })
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesSearchSearch = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-c10c040c"], ["__file", "D:/HBuilderProjects/2026_33/factory/pages/search/search.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        username: ""
      };
    },
    methods: {
      savefile() {
        const buffer = new ArrayBuffer(8);
        const view = new Uint8Array(buffer);
        view[0] = 72;
        view[1] = 101;
        view[2] = 108;
        view[3] = 108;
        view[4] = 111;
        uni.arrayBufferToBase64(buffer);
        formatAppLog("log", "at pages/login/lianxi.vue:38", "go2");
        uni.saveFile({
          //tempFilePath: `data:text/plain;base64,${base64}`,
          //tempFilePath: `_doc/uniapp_save/17688145345000.jpg`,	
          //tempFilePath: `_doc/uniapp_save/test.docx`,
          //tempFilePath: `file:///storage/emulated/0/Download/test.docx`,
          //tempFilePath: `file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/doc/uniapp_temp/compressed/1768824622018_Screenshot_2026-01-19-18-58-01-217_cn.gov.chinatax.gt4.app.jpg`,
          //tempFilePath: `file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/test.docx`,
          success: function(res) {
            formatAppLog("log", "at pages/login/lianxi.vue:48", "success:", res);
            res.savedFilePath;
          },
          fail: function(err) {
            formatAppLog("error", "at pages/login/lianxi.vue:52", "文件保存失败:", err);
            uni.showToast({
              title: "文件保存失败",
              icon: "none"
            });
          }
        });
      },
      getfilelist() {
        uni.getSavedFileList({
          success: function(res) {
            formatAppLog("log", "at pages/login/lianxi.vue:64", res.fileList);
          }
        });
      },
      chooseImage() {
        uni.chooseImage({
          success: function(res) {
            var tempFilePaths = res.tempFilePaths;
            formatAppLog("log", "at pages/login/lianxi.vue:73", tempFilePaths);
            uni.saveFile({
              tempFilePath: tempFilePaths[0],
              success: function(res2) {
                res2.savedFilePath;
              }
            });
          }
        });
      }
    },
    onLoad() {
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-container" }, [
      vue.createElementVNode("view", null, [
        vue.createElementVNode("button", {
          onClick: _cache[0] || (_cache[0] = (...args) => $options.savefile && $options.savefile(...args))
        }, "保存文件"),
        vue.createElementVNode("button", {
          onClick: _cache[1] || (_cache[1] = (...args) => $options.getfilelist && $options.getfilelist(...args))
        }, "本地文件信息"),
        vue.createElementVNode("button", {
          onClick: _cache[2] || (_cache[2] = (...args) => $options.chooseImage && $options.chooseImage(...args))
        }, "上传照片")
      ])
    ]);
  }
  const PagesLoginLianxi = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "D:/HBuilderProjects/2026_33/factory/pages/login/lianxi.vue"]]);
  const htmlToWord = (htmlContent, filename = "document.doc") => {
    return new Promise((resolve, reject) => {
      plus.io.resolveLocalFileSystemURL("_documents/", (root) => {
        root.getFile(filename, { create: true }, (fileEntry) => {
          fileEntry.createWriter((writer) => {
            writer.onwrite = () => {
              const filePath = fileEntry.toURL();
              resolve(filePath);
            };
            writer.onerror = reject;
            writer.write(htmlContent);
          }, reject);
        }, reject);
      }, reject);
    });
  };
  const _sfc_main$1 = {
    methods: {
      async generateWord() {
        uni.showLoading({ title: "生成中" });
        try {
          const html = `
          <h1>测试文档</h1>
					<p>这是用HTML生成的Word文档</p>
					<p>生成时间：${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
					<table>
						<tr><th>姓名</th><th>年龄</th><th>职位</th></tr>
						<tr><td>张三zz</td><td>25</td><td>工程师</td></tr>
						<tr><td>李四</td><td>28</td><td>设计师</td></tr>
					</table>
        `;
          const filePath = await htmlToWord(html, "test.doc");
          uni.hideLoading();
          uni.showModal({
            title: "生成成功",
            content: `Word文档已生成
路径: ${filePath}`,
            showCancel: false,
            success: () => {
            }
          });
        } catch (e) {
          formatAppLog("error", "at pages/login/ceshi.vue:43", "生成Word文档失败:", error);
          uni.hideLoading();
          uni.showToast({ title: "生成失败", icon: "none" });
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { style: { "padding": "20px" } }, [
      vue.createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = (...args) => $options.generateWord && $options.generateWord(...args))
      }, "生成Word")
    ]);
  }
  const PagesLoginCeshi = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "D:/HBuilderProjects/2026_33/factory/pages/login/ceshi.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/login/register", PagesLoginRegister);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/mine/mine", PagesMineMine);
  __definePage("pages/mine/modifyinfo", PagesMineModifyinfo);
  __definePage("pages/index/release", PagesIndexRelease);
  __definePage("pages/index/task", PagesIndexTask);
  __definePage("pages/index/qt", PagesIndexQt);
  __definePage("pages/index/technical", PagesIndexTechnical);
  __definePage("pages/search/search", PagesSearchSearch);
  __definePage("pages/login/lianxi", PagesLoginLianxi);
  __definePage("pages/login/ceshi", PagesLoginCeshi);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/HBuilderProjects/2026_33/factory/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);

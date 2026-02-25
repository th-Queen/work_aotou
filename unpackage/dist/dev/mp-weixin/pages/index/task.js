"use strict";
const common_vendor = require("../../common/vendor.js");
const services_api = require("../../services/api.js");
const _sfc_main = {
  data() {
    return {
      isUrgent: true,
      ordertype: "生产部",
      taskName: "",
      mainPerson: "",
      //负责人
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
    openTaskdt() {
      common_vendor.index.navigateTo({
        url: "/pages/index/detail/taskdt"
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
        common_vendor.index.showToast({ title: "请输入工序名称", icon: "none" });
        return;
      }
      if (!this.selectedStaff) {
        common_vendor.index.showToast({ title: "请选择人员", icon: "none" });
        return;
      }
      if (!this.modalDuration || this.modalDuration <= 0) {
        common_vendor.index.showToast({ title: "请输入有效时长", icon: "none" });
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
      common_vendor.index.__f__("log", "at pages/index/task.vue:196", "taskName:", this.taskName);
      if (!this.canPublish)
        return;
      const userInfo = common_vendor.index.getStorageSync("userInfo") || {};
      const orderstatus = "production";
      const createtime = (/* @__PURE__ */ new Date()).toISOString();
      const taskData = {
        ordertype: this.ordertype,
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
      common_vendor.index.__f__("log", "at pages/index/task.vue:217", "完整的 taskData:", JSON.stringify(taskData, null, 2));
      try {
        const res = await services_api.api.releaseApi.createTask(taskData);
        common_vendor.index.showToast({
          title: "任务发布成功！",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/task.vue:225", "API错误", error);
        common_vendor.index.showToast({ title: "发布失败，请重试", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isUrgent ? 1 : "",
    b: common_vendor.o(($event) => $options.setUrgency(true)),
    c: !$data.isUrgent ? 1 : "",
    d: common_vendor.o(($event) => $options.setUrgency(false)),
    e: $data.taskName,
    f: common_vendor.o(($event) => $data.taskName = $event.detail.value),
    g: $data.mainPerson,
    h: common_vendor.o(($event) => $data.mainPerson = $event.detail.value),
    i: common_vendor.o(($event) => $data.showModal = true),
    j: common_vendor.f($data.processes, (process, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(index + 1),
        b: common_vendor.t(process.name),
        c: common_vendor.t(process.person),
        d: common_vendor.t(process.duration)
      }, $data.processes.length > 1 ? {
        e: common_vendor.o(($event) => $options.removeProcess(index), index)
      } : {}, {
        f: index
      });
    }),
    k: $data.processes.length > 1,
    l: $data.showModal
  }, $data.showModal ? {
    m: common_vendor.o(($event) => $data.showModal = false)
  } : {}, {
    n: $data.showModal
  }, $data.showModal ? {
    o: $data.modalName,
    p: common_vendor.o(($event) => $data.modalName = $event.detail.value),
    q: common_vendor.t($data.selectedStaff || "请选择人员"),
    r: $data.staffList,
    s: common_vendor.o((...args) => $options.onStaffChange && $options.onStaffChange(...args)),
    t: $data.modalDuration,
    v: common_vendor.o(common_vendor.m(($event) => $data.modalDuration = $event.detail.value, {
      number: true
    })),
    w: common_vendor.o(($event) => $data.showModal = false),
    x: common_vendor.o((...args) => $options.confirmAddProcess && $options.confirmAddProcess(...args))
  } : {}, {
    y: common_vendor.t($options.canPublish ? "发布任务" : "请完善任务信息"),
    z: common_vendor.o((...args) => $options.publishTask && $options.publishTask(...args)),
    A: !$options.canPublish,
    B: !$options.canPublish ? 1 : "",
    C: common_vendor.o((...args) => $options.openTaskdt && $options.openTaskdt(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f41f7038"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/task.js.map

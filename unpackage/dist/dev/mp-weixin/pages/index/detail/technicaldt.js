"use strict";
const common_vendor = require("../../../common/vendor.js");
const services_api = require("../../../services/api.js");
const _sfc_main = {
  data() {
    return {
      tasks: [],
      ordertype: "技术部"
    };
  },
  created() {
  },
  onLoad() {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo && userInfo.userid) {
      this.getTaskList(userInfo.userid, this.ordertype);
    }
  },
  methods: {
    async getTaskList(userId, ordertype) {
      common_vendor.index.__f__("log", "at pages/index/detail/technicaldt.vue:99", "1");
      try {
        const res = await services_api.api.taskApi.taskList({ userid: userId, ordertype });
        common_vendor.index.__f__("log", "at pages/index/detail/technicaldt.vue:102", res);
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
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/detail/technicaldt.vue:115", "获取任务失败", error);
        common_vendor.index.showToast({ title: "加载任务失败", icon: "none" });
      }
    },
    calculateTotalDuration(task) {
      return task.processes.reduce((sum, p) => sum + (parseFloat(p.time) || 0), 0).toFixed(1);
    },
    async handleAction(taskId, action) {
      if (action === "done") {
        await services_api.api.taskApi.taskComplete({ orderid: taskId });
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
        common_vendor.index.showToast({ title: "任务完成", icon: "success" });
      } else {
        common_vendor.index.showToast({ title: "已放弃任务", icon: "success" });
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tasks, (task, k0, i0) => {
      return {
        a: common_vendor.t(task.taskName),
        b: common_vendor.t(task.urgency === "urgent" ? "重要紧急" : "普通任务"),
        c: common_vendor.n(task.urgency === "urgent" ? "urgent" : "normal"),
        d: common_vendor.t(task.expanded ? "收起" : "展开"),
        e: common_vendor.o(($event) => task.expanded = !task.expanded, task.id),
        f: common_vendor.f(task.processes, (process, index, i1) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(process.name),
            c: common_vendor.t(process.people),
            d: common_vendor.t(process.time),
            e: index
          };
        }),
        g: task.expanded ? 1 : "",
        h: common_vendor.o(($event) => $options.handleAction(task.id, "done"), task.id),
        i: common_vendor.o(($event) => $options.handleAction(task.id, "cancel"), task.id),
        j: task.id,
        k: task.urgency === "urgent" ? 1 : ""
      };
    }),
    b: $data.tasks.length === 0
  }, $data.tasks.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8746da5f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/index/detail/technicaldt.js.map

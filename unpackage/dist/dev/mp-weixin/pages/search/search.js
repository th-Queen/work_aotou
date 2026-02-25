"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.steps, (step, index, i0) => {
      return {
        a: step.completed ? 1 : "",
        b: common_vendor.t(step.name),
        c: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c10c040c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map

"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_htmlToWord = require("../../utils/htmlToWord.js");
const _sfc_main = {
  methods: {
    async generateWord() {
      common_vendor.index.showLoading({ title: "生成中" });
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
        const filePath = await utils_htmlToWord.htmlToWord(html, "test.doc");
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "生成成功",
          content: `Word文档已生成
路径: ${filePath}`,
          showCancel: false,
          success: () => {
          }
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/login/ceshi.vue:43", "生成Word文档失败:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "生成失败", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.generateWord && $options.generateWord(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/ceshi.js.map

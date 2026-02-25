"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
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
      common_vendor.index.arrayBufferToBase64(buffer);
      common_vendor.index.__f__("log", "at pages/login/lianxi.vue:38", "go2");
      common_vendor.index.saveFile({
        //tempFilePath: `data:text/plain;base64,${base64}`,
        //tempFilePath: `_doc/uniapp_save/17688145345000.jpg`,	
        //tempFilePath: `_doc/uniapp_save/test.docx`,
        //tempFilePath: `file:///storage/emulated/0/Download/test.docx`,
        //tempFilePath: `file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/doc/uniapp_temp/compressed/1768824622018_Screenshot_2026-01-19-18-58-01-217_cn.gov.chinatax.gt4.app.jpg`,
        //tempFilePath: `file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/test.docx`,
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/login/lianxi.vue:48", "success:", res);
          res.savedFilePath;
        },
        fail: function(err) {
          common_vendor.index.__f__("error", "at pages/login/lianxi.vue:52", "文件保存失败:", err);
          common_vendor.index.showToast({
            title: "文件保存失败",
            icon: "none"
          });
        }
      });
    },
    getfilelist() {
      common_vendor.index.getSavedFileList({
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/login/lianxi.vue:64", res.fileList);
        }
      });
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        success: function(res) {
          var tempFilePaths = res.tempFilePaths;
          common_vendor.index.__f__("log", "at pages/login/lianxi.vue:73", tempFilePaths);
          common_vendor.index.saveFile({
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.savefile && $options.savefile(...args)),
    b: common_vendor.o((...args) => $options.getfilelist && $options.getfilelist(...args)),
    c: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/lianxi.js.map

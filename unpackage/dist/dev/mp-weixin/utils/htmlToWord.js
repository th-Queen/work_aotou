"use strict";
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
exports.htmlToWord = htmlToWord;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/htmlToWord.js.map

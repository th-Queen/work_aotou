export const htmlToWord = (htmlContent, filename = 'document.doc') => {
  return new Promise((resolve, reject) => {
    const wordHtml = `
      <!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<style>
					body { font-family: 'Microsoft YaHei', sans-serif; }
					table { border-collapse: collapse; width: 100%; }
					th, td { border: 1px solid #ddd; padding: 8px; }
				</style>
			</head>
			<body>
				${htmlContent}
			</body>
			</html>
    ` 
		// 尝试保存到指定目录
    const targetPath = `Download/WeiXin/test/${filename}`;
		 
				
		//plus.io.resolveLocalFileSystemURL('_doc/', (root) => {
    plus.io.resolveLocalFileSystemURL('_documents/', (root) => {
		// plus.io.resolveLocalFileSystemURL('file:///storage/emulated/0/Download/', (root) => {
			//console.log('获取到根目录')
      root.getFile(filename, { create: true }, (fileEntry) => {
				//console.log('获取到文件对象')
        fileEntry.createWriter((writer) => {
					//console.log('创建写入器成功')
          writer.onwrite = () => {
						const filePath = fileEntry.toURL()
						resolve(filePath)
					}
          writer.onerror = reject
          // writer.write(wordHtml)
					writer.write(htmlContent)
        }, reject)
      }, reject)
    }, reject)
	
  })
}
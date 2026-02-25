// API基础配置
// const API_BASE_URL = 'http://47.120.37.74:8058';
//const API_BASE_URL = 'http://192.168.1.6:8058';
//const API_BASE_URL = 'http://192.168.3.175:8058';
// const API_BASE_URL = 'http://192.168.1.103:8058';
//后端给
// const API_BASE_URL = 'http://localhost:8059';
const API_BASE_URL = 'http://192.168.31.128:8059';


// HTTP请求封装
const request = (url, method = 'GET', data = {}) => {
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

// 用户相关API
const userApi = {
	// 用户登录
	login: (username, password) => {
		return request(`${API_BASE_URL}/user/login`, 'POST', {
			username,
			password
		});
	},

	// 用户注册
	register: (username, password) => {
		return request(`${API_BASE_URL}/user/register`, 'POST', {
			username,
			password
		});
	},

	// 修改用户信息（新增:2.3）
	// userData，包含 useravatar,string类型（头像URL）
	updateUser: (userData) => {
		return request(`${API_BASE_URL}/user/update`, 'POST', userData);
	}
};

	// 发布任务页相关API
const releaseApi = {

	// 发布新任务
	createTask: (taskData) => {
		return request(`${API_BASE_URL}/order/save`, 'POST', taskData);
	},

};
const taskApi = {
	//显示任务列表
	taskList: ({userid,ordertype}) => {
		return request(`${API_BASE_URL}/search/searchAllOrders`, 'POST', {userid,ordertype});
	},
	
	// “确认完成”按钮方法
	taskComplete: (orderid) => {
		return request(`${API_BASE_URL}/order/finish`, 'POST', orderid);
	},
}


// 扳手相关API
const wrenchApi = {
	// 计算扭矩
	calculateTorque: (screwSize, selectedMaterial, pitchSize) => {
		return request(`${API_BASE_URL}/wrench/calculateTorque`, 'POST', {
			screwSize,
			selectedMaterial,
			pitchSize
		});
	},

	// 保存记录
	saveRecord: (data) => {
		return request(`${API_BASE_URL}/wrench/saveRecord`, 'POST', data);
	},

	// 上传图片到OSS
	uploadImage: (filePath) => {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: `${API_BASE_URL}/wrench/uploadImage`,
				filePath: filePath,
				name: 'file',
				success: (res) => {
					resolve(JSON.parse(res.data));
				},
				fail: (err) => {
					reject(err);
				}
			});
		});
	},

	// 上传文档
	uploadDoc: (filePath) => {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: `${API_BASE_URL}/generateDoc/upload`,
				filePath: filePath,
				name: 'file',
				success: (res) => {
					try {
						console.log('文档上传后端原始响应：', res.data);
						const data = JSON.parse(res.data);
						resolve(data);
					} catch (e) {
						console.error('文档上传JSON解析失败：', e, '后端原始数据：', res.data);
						reject({
							status: 'fail',
							message: '文档上传响应解析失败',
							rawData: res.data
						});
					}
				},
				fail: (err) => {
					reject(err);
				}
			});
		});
	}
};

// 导出API接口
export default {
	userApi,
	// wrenchApi,
	releaseApi,
	taskApi
	
};
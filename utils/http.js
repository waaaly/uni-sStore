import popup from './popup.js'
export default class Http{
	static request (param,debug,loading=true){
		popup.load();
		return new Promise((resolve,reject)=>{
			if(debug){console.log(param)}
				uni.request({
					method:param.method,
					url:param.url,
					data:param.data,
					success:(res)=>{
						if(res.data.data==undefined) resolve(res.data);
						else resolve(res.data.data);
					},
					fail:(err)=>{
						reject(res);
					},
					complete:(res=>{
						popup.hideLoad();
						if(debug){console.log(res)}
					})
				})
			})
	}
	static get(url,data,needLogin=true,debug=false,loading=true){
		var param={
			method:'GET',
			url:url,
			data:data,
		}
		//有得get用户无需登录直接访问
		if(!needLogin) return this.request(param,debug,loading);
		//添加请求头 和用户信息
		if (wx.getStorageSync('userToken')) {
			var header = {
				"Content-Type": "application/x-www-form-urlencoded",
				'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
			}
			param['header'] = header;
			param.data['code'] = wx.getStorageSync('userCode');
			param.data['rawData'] = wx.getStorageSync('userRawData');
		}else{
			uni.showModal({
				title:'温馨提示',
				content:'您当前尚未登录，请您登录后再进行相关操作！',
				cancelText:'下次再说',
				cancelColor:'#888888',
				confirmText:'前往登录',
				confirmColor:'#f06c7a',
				success:(res=>{
					if(!res.cancel){
						uni.navigateTo({
							url:'../login/login'
						})
					}
				})
			})
			return new Promise((resolve,reject)=>{reject()});
		}
		return this.request(param,debug,loading);
	}
		
	static post(url,data,debug=false,loading=true){
		var param={
			method:'POST',
			url:url,
			data:data
		}
		//添加请求头 和用户信息
		if (wx.getStorageSync('userToken')) {
			var header = {
				"Content-Type": "application/x-www-form-urlencoded",
				'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
			}
			param['header'] = header;
			param.data['code'] = wx.getStorageSync('userCode');
			param.data['rawData'] = wx.getStorageSync('userRawData');
		}
		else{
			uni.showModal({
				title:'温馨提示',
				content:'您当前尚未登录，请您登录后再进行相关操作！',
				cancelText:'下次再说',
				cancelColor:'#888888',
				confirmText:'前往登录',
				confirmColor:'#f06c7a',
				success:(res=>{
					if(!res.cancel){
						uni.navigateTo({
							url:'../login/login'
						})
					}
				})
			})
			return new Promise((resolve,reject)=>{reject()});
		}
		return this.request(param,debug,loading);
	}
}


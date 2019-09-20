export default class Http{
	static request (method,url,data,loading=true){
		return new Promise((resolve,reject)=>{
				uni.request({
					method:method,
					url:url,
					data:data,
					success:(res)=>{
						// console.log(res)
						resolve(res.data.data);
					},
					fail:(err)=>{
						// console.log(err)
						reject(res);
					},
				})
			})
	}
	static get(url,data,loading=true){
		return this.request('GET',url,data,loading);
	}
		
	static post(url,data,loading=true){
		return this.request('POST',url,data,loading);
	}
}


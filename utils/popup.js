export default class Popop{
	static toast(
		title='提示',//	string		是	提示的内容	
		icon='success'	,//string	'success'	否	图标	
		//image	,//string		否	自定义图标的本地路径，image 的优先级高于 icon	1.1.0
		duration=1500	,//number	1500	否	提示的延迟时间	
		mask=false	,//boolean	false	否	是否显示透明蒙层，防止触摸穿透
	){
		uni.showToast({
			title:title,
			icon:icon,
			duration:duration,
			mask:mask,
		})
	}
	static model(
		title='提示',//	string		否	提示的标题
		content='这是正文',//	string		否	提示的内容
		showCancel=true,//	boolean	true	否	是否显示取消按钮
		cancelText='取消',//	string	'取消'	否	取消按钮的文字，最多 4 个字符
		cancelColor='#000000',//	string	#000000	否	取消按钮的文字颜色，必须是 16 进制格式的颜色字符串
		confirmText='确定',//	string	'确定'	否	确认按钮的文字，最多 4 个字符
		confirmColor='#576B95',//	string	#576B95	否	确认按钮的文字颜色，必须是 16 进制格式的颜色字符串	
	){
		return new Promise((resolve,reject)=>{
			uni.showModal({
				title:title,	
				content:content,	
				showCancel:showCancel,
				cancelText:cancelText,
				cancelColor:cancelColor,
				confirmText:confirmText,	
				confirmColor:confirmColor,	
				success:(res)=>{
					if(res.cancel){
						reject();
					}else{
						resolve();
					}
				}
			})
		})
	}
}


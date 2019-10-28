export default class Popop{
	static toast(
		title='提示',//	string		是	提示的内容	
		image	,//string		否	自定义图标的本地路径，image 的优先级高于 icon	1.1.0
		icon='success'	,//string	'success'	否	图标	
		duration=1500	,//number	1500	否	提示的延迟时间	
		mask=false	,//boolean	false	否	是否显示透明蒙层，防止触摸穿透
	){
		uni.showToast({
			title:title,
			icon:icon,
			image:image,
			duration:duration,
			mask:mask,
		})
	}
	static load(title='正在加载中'){
		uni.showLoading({
			title:title,
		})
	}
	static hideLoad(){
		uni.hideLoading();
	}
	static modal(param){
		/*
		content='这是正文',//	string		否	提示的内容
		confirmText='确定',//	string	'确定'	否	确认按钮的文字，最多 4 个字符
		cancelText='取消',//	string	'取消'	否	取消按钮的文字，最多 4 个字符
		title='提示',//	string		否	提示的标题
		cancelColor='#888888',//	string	#000000	否	取消按钮的文字颜色，必须是 16 进制格式的颜色字符串
		showCancel=true,//	boolean	true	否	是否显示取消按钮
		confirmColor='#f06c7a',//	string	#576B95	否	确认按钮的文字颜色，必须是 16 进制格式的颜色字符串	
		*/
			uni.showModal({
				title:param.title?param.title:'温馨提示',	
				content:param.content,	
				showCancel:param.showCancel?param.showCancel:true,
				cancelText:param.cancelText?param.cancelText:'取消',
				confirmText:param.confirmText?param.confirmText:'确认',
				success:param.success,
				cancelColor:'#888888',
				confirmColor:'#f06c7a',
			})
	}
}


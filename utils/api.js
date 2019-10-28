const baseUrl = 'https://zhiqu.mingrui-gz.com/api/';

module.exports = {
	imageBaseUrl:'https://mingrui-static.oss-cn-shenzhen.aliyuncs.com/',
						/*登录相关*/
	AuthLoginByWeixin:  baseUrl + 'login', //登录接口
	//------------------------------------------------------------//
						/*首页相关*/
	Swiper: 			baseUrl + 'index-carousel', //首页轮播图数据
	HotGood: 			baseUrl + 'goods-hot', //活动专区图片
	//------------------------------------------------------------//
						/*商品分类相关*/
	GoodsCategory: 		baseUrl + 'goods-category', //获得分类数据
	GoodListAddress: 	baseUrl + 'shop-goods-category', //获取单商家的商品
	//------------------------------------------------------------//
						/*商品详情相关*/
	GoodsDetail: 		baseUrl + 'goods-detail', //获得商品的详情
	GroupProduct: 		baseUrl + 'group-product', //选择团购商品属性
	//------------------------------------------------------------//
						/*收藏相关*/
	CollectAdd: 		baseUrl + 'collection-add', //添加收藏
	CollectList: 		baseUrl + 'collection-list', //收藏列表
	CollectDelete: 		baseUrl + 'collection-delete', //取消收藏
	//------------------------------------------------------------//
						/*购物车相关*/
	CartList: 			baseUrl + 'cart-index', //获取购物车的数据
	CartAdd: 			baseUrl + 'cart-add', // 添加商品到购物车
	CartChecked: 		baseUrl + 'cart-checked', // 选择或取消选择单个商品
	CartChechedAll: 	baseUrl + 'cart-check-all', //全选或全不选所有商品
	CartUpdate: 		baseUrl + 'cart-update', // 更新购物车商品数量
	CartDelete: 		baseUrl + 'cart-delete', // 删除购物车的商品
	//------------------------------------------------------------//
						/*地址相关*/
	AddressList: 		baseUrl + 'address-list', //获取地址列表
	AddressSave: 		baseUrl + 'address-save', //保存和修改收货地址
	AddressDelete: 		baseUrl + 'address-delete', //删除地址
	AddressSetDefault: 	baseUrl + 'address-default', //直接设为默认地址
	//------------------------------------------------------------//
						/*团购相关*/
	GroupList: 			baseUrl + 'group-list', //团购商品列表
	GroupCarousel: 		baseUrl + 'group-carousel', //团购商品轮播 
	GroupDetail: 		baseUrl + 'group-detail', //团购商品详情    					
	//------------------------------------------------------------//
						/*订单相关*/
	CartCheckout: 		baseUrl + 'cart-checkout', // 下单前信息确认
	OrderSubmit: 		baseUrl + 'order-submit', // 提交订单
	WechatPay: 			baseUrl + 'pay-prepay', //使用微信支付
	OrderList: 			baseUrl + 'order-list', // 全部订单列表
	OrderDetail: 		baseUrl + 'order-detail', //订单详情
	OrderCancel: 		baseUrl + 'order-cancel', //用户取消待付款订单
	UserRefund: 		baseUrl + 'order-user-refund', //用户申请退款
	UserComment: 		baseUrl + 'user-comment', //用户提交评论
	//------------------------------------------------------------//
}
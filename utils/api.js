const baseUrl = 'https://test.mingrui-gz.com/api/';

module.exports = {
	imageBaseUrl:'https://mingrui-static.oss-cn-shenzhen.aliyuncs.com/',
	Swiper: 			baseUrl + 'index-carousel', //首页轮播图数据
	AuthLoginByWeixin:  baseUrl + 'login', //登录接口
	HotGood: 			baseUrl + 'goods-hot', //活动专区图片
	GoodListAddress: 	baseUrl + 'shop-goods-category', //获取单商家的商品
	GoodsCategory: 		baseUrl + 'goods-category', //获得分类数据
}
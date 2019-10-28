<template>
	<view>
		<!-- 状态栏 -->
		<view v-if="showHeader" class="status" :style="{position:headerPosition}"></view>
        <view v-if="showHeader" class="header" :style="{position:headerPosition}">
			<view class="title">分类</view>
		</view>
		<!-- 占位 -->
		<view v-if="showHeader" class="place"></view>
		<view class="category-list">
			<!-- 左侧分类导航 -->
			<scroll-view  scroll-y="true" class="left" >
                <view class="row" v-for="(category,index) in cateList" :key="category.index" :class="[index==showCategoryIndex?'on':'']" 
				@tap="showCategory(index)">
					<view class="text">
						<view class="block"></view>
						{{category.name}}
					</view>
				</view>
				
            </scroll-view>
			<!-- 右侧子导航 -->
			<scroll-view  scroll-y="true" class="right" >
			    <view class="category" v-for="(cate,index) in cateList" :key="index" 
				v-show="index==showCategoryIndex" >
					<view class="banner">
						<image :src="cate.banner_url"  @error='imgErr(cate)'></image>
					</view>
					<view class="list" v-if="curGoodList.length!=0">
						<view class="box" v-for="(good,i) in curGoodList" :key="i"  @tap="toCategory(good)" >
							<image :src="good.primary_pic_url" @error='goodErr(good)'></image>
							<view class="text">{{good.goods_name}}</view>
						</view>
					</view>
					<view v-else>
						<image style="width: 98%;margin-top:180rpx" src="../../static/img/noGood.png"></image>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
	import api from "../../utils/api.js";
	import popup from '../../utils/popup.js';
	import http from '../../utils/http.js';
	//高德SDK
	// import amap from '@/common/SDK/amap-wx.js';
	export default {
		data() {
			return {
				imageUrl:api.imageBaseUrl,
				showHeader:false,//顶部占位符
				showCategoryIndex:0,
				headerPosition:"fixed",
				//分类列表包含分类名、banner、商品列表
				cateList:[],
				//当前分类商品列表
				curGoodList:[]
			}
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		onLoad() {
			http.get(api.GoodsCategory,{},false).then(res=>{
				this.cateList = res.brotherCategory;
				this.curGoodList = res.brotherCategory[0].subCategoryList;
			})
			// http.get(api.GoodListAddress,{district:'番禺区'},false).then(res=>{
			// 	console.log(res);
			// 	this.allProduct = res;
			// 	this.getProduct(0);
			// })
		},
		
		methods: {
			//banner加载失败
			imgErr(cate){
				cate.banner_url = '../../static/img/imgErr.jpg';
			},
			//商品加载失败
			goodErr(good){
				good.primary_pic_url ='../../static/img/imgErr.jpg';
			},
			//消息列表
			toMsg(){
				uni.navigateTo({
					url:'../../msg/msg'
				})
			},
			//分类切换显示
			showCategory(index){
				this.getProduct(index);
				this.showCategoryIndex = index;
			},
			//获取分类商品
			getProduct(categoryIndex){
				this.curGoodList = this.cateList[categoryIndex].subCategoryList;
			},
			toCategory(e){
				console.log(e)
				uni.navigateTo({
					url:`../goodDetail/goodDetail?good_id=${e.good_id}&shop_id=${e.shop_id}`,
				})
			},

		}
	}
</script>
<style lang="scss">

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height);//覆盖样式
		/*  #endif  */
		
	}

	.header{
		width: 92%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #ff743c;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
		.title{
			font-size: 36upx;
		}
		.addr{
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			font-size: 28upx;
			.icon{
				height: 60upx; 
				margin-right: 5upx;
				display: flex;
				align-items: center;
				font-size: 42upx;
				color: #ffc50a;
			}
		}
		.input-box{
			width: 100%;
			height: 60upx;
			background-color: #f5f5f5;
			border-radius: 30upx;
			position: relative;
			display: flex;
			align-items: center;
			.icon{
				display: flex;
				align-items: center;
				position: absolute;
				top:0;
				right: 0;
				width: 60upx;
				height: 60upx;
				font-size: 34upx;
				color: #c0c0c0;
			}
			input{
				padding-left: 28upx;
				height: 28upx;
				font-size: 28upx;
			}
		}
		.icon-btn{
			width: 60upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			.icon{
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42upx;
			}
		}
	}
	.place{
		
		background-color: #ffffff;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
	.category-list{
		width: 100%;
		background-color: #fff;
		display: flex;
		.left,.right{
			position: absolute;
			// top: 100upx;
			/*  #ifdef  APP-PLUS  */
			top: calc(100upx + var(--status-bar-height));
			/*  #endif  */
			// bottom: 0upx;
		}
		.left{
			width: 24%;
			left: 0upx;
			background-color: #f2f2f2;
			.row{
				width: 100%;
				height: 90upx;
				display: flex;
				align-items: center;
				.text{
					width: 100%;
					position: relative;
					font-size: 28upx;
					display: flex;
					justify-content: center;
					color: #3c3c3c;
					.block{
						position: absolute;
						width: 0upx;
						left: 0;
					}
				}
				&.on{
					height: 100upx;
					background-color: #fff;
					.text{
						font-size: 30upx;
						font-weight: 600;
						color: #ff743c;
						.block{
							width: 10upx;
							height: 80%;
							top: 10%;
							background-color: #f06c7a;
						}
					}
				}
			}
		}
		.right{
		   width: 76%;
			left: 24%;
			.category{
				width: 94%;
				padding: 20upx 3%;
				.banner{
					width: 100%;
					height: 24.262vw;
					border-radius: 10upx;
					overflow: hidden;
					box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.3);
					image{
						width: 100%;
						height: 24.262vw;
					}
				}
				.list{
					margin-top: 40upx;
					width: 100%;
					display: flex;
					flex-wrap: wrap;
					.box{
						width: calc(71.44vw / 3);
						margin-bottom: 30upx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;
						image{
							width: 60%;
							height: calc(71.44vw / 3 * 0.6);
						}
						.text{
							margin-top: 5upx;
							width: 100%;
							display: flex;
							justify-content: center;
							font-size: 26upx;
						}
					}
				}
			}
		}
	}

</style>

<template>
	<view>
		<view v-if="showHeader" class="status" :style="{position:headerPosition,top:statusTop}"></view>
		<view v-if="showHeader" class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="title">购物车</view>
		</view>
		<!-- 占位 -->
		<view v-if="showHeader" class="place"></view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="tis" v-if="goodsList.length==0">购物车是空的哦~</view>
            <view class="row" v-for="(good,index) in goodsList" :key="index" >
				<!-- 删除按钮 -->
				<view class="menu" @tap.stop="deleteGoods(good)">
					<view class="icon shanchu"></view>
				</view>
				<!-- 商品 -->
				<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" 
						@touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" 
						@touchend="touchEnd(index,$event)">
					<!-- checkbox -->
					<view class="checkbox-box" @tap="selected(good)">
						<view class="checkbox">
							<view :class="[good.selected?'on':'']"></view>
						</view>
					</view>
					<!-- 下架提示-->
					<view v-if='!good.is_sale' class="icon shixiao"></view>
					<!-- 商品信息 -->
					<view class="goods-info" @tap="toGoods(good)">
						<view class="img">
							<image :src="good.img"></image>
						</view>
						<view class="info">
							<view class="title">{{good.name}}</view>
							<view class="spec">{{good.spec}}</view>
							<view class="price-number">
								<view class="price">￥{{good.price}}</view>
								<view class="number">
									<view class="sub" @tap.stop="sub(index)">
										<view class="icon jian"></view>
									</view>
									<view class="input" @tap.stop="discard">
										<input type="number" v-model="good.number" @blur="sum($event,index)" />
									</view>
									<view class="add"  @tap.stop="add(index)">
										<view class="icon jia"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
        </view>
		<!-- 脚部菜单 -->
		<view class="footer" :style="{bottom:footerbottom}">
			<view class="checkbox-box" @tap="allSelect">
				<view class="checkbox">
					<view :class="[isAllselected?'on':'']"></view>
				</view>
				<view class="text">全选</view>
			</view>
			<view class="delBtn" @tap="deleteList" v-if="selectedList.length>0">删除</view>
			<view class="settlement">
				<view class="sum">合计:<view class="money">￥{{sumPrice}}</view></view>
				<view class="btn" @tap="toConfirmation">结算({{selecGoodNum}})</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "../../utils/api.js";
	import http from '../../utils/http.js';
	import popup from '../../utils/popup.js';
	export default {
		data() {
			return {
				
				headerPosition:"fixed",
				headerTop:null,
				statusTop:null,
				showHeader:false,
				selectedList:[],
				isAllselected:false,
				goodsList:[],
				//控制滑动效果
				theIndex:null,
				oldIndex:null,
				isStop:false,
				selecGoodNum:0,//已选中的所有商品
				sumPrice:'0.00',//已选中的所有商品价格
			}
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop>=0?"fixed":"absolute";
			this.headerTop = e.scrollTop>=0?null:0;
			this.statusTop = e.scrollTop>=0?null:-this.statusHeight+'px';
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    // setTimeout(function () {
		    //     uni.stopPullDownRefresh();
		    // }, 1000);
		},
		onLoad() {
			//兼容H5下结算条位置
			// #ifdef H5
				this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight+'px';
			// #endif
			// #ifdef APP-PLUS
			this.showHeader = false;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
			
		},
		onShow(){
			http.get(api.CartList,{user_id:uni.getStorageSync('userInfo').id}).then(res=>{
				console.log(res)
				this.selecGoodNum=res.CountNum;//已选中的所有商品
				this.sumPrice=res.TotalPrice;//已选中的所有商品价格
				if(res.cartList.length==0){
					this.goodsList=[];
				}else{
					this.handleGood(res.cartList);
				}				
			})
		},
		methods: {
			handleGood(goods){
				var good = new Object();
				this.goodsList = [];
				for(let item of goods){
					good['goods_id'] = item.goods_id;
					good['img'] = api.imageBaseUrl + item.primary_pic_url;
					good['name'] = item.goods_name;
					good['spec'] = item.goods_specifition_name_value?item.goods_specifition_name_value:'默认属性';
					good['price'] = item.retail_price;
					good['number'] = item.number;
					good['selected'] = item.is_on_sale?item.checked:0;
					good['cart_id'] = item.id;
					good['is_sale'] = item.is_on_sale;
					this.goodsList.push(good);
					good = {};
				}
			},
			//删除下架商品
			hanldeInvalidGood(cart_id){
				popup.modal({
					title:'下架商品提示',
					content:'该商品已下架，您希望将它从购物车中移除吗？',
					confirmText:'移除商品',
					success:(res=>{
						if(res.confirm){
							http.post(api.CartDelete,{id:cart_id,user_id:uni.getStorageSync('userInfo')}).then(res=>{
								console.log(res)
								this.selecGoodNum=res.CountNum;//已选中的所有商品
								this.sumPrice=res.TotalPrice;//已选中的所有商品价格
								if(res.cartList.length==0){
									this.goodsList=[];
								}else{
									this.handleGood(res.cartList);
								}
							})
						}
					})
				})
			},
			//商品跳转
			toGoods(good){
				if(!good.is_sale){
					this.hanldeInvalidGood(good.cart_id);
					return ;
				}
				uni.navigateTo({
					url: `../goodDetail/goodDetail?good_id=${good.goods_id}`,
				});
			},
			//删除单个商品
			deleteGoods(good){
				popup.modal({
					title:'移除商品',
					content:'您确定将选中商品移除购物车吗？',
					success:(res=>{
						if(res.confirm){
							http.post(api.CartDelete,{id:good.cart_id, user_id:uni.getStorageSync('userInfo').id}).then(res=>{
								console.log(res)
								this.selecGoodNum=res.CountNum;//已选中的所有商品
								this.sumPrice=res.TotalPrice;//已选中的所有商品价格
								if(res.cartList.length==0){
									this.goodsList=[];
								}else{
									this.handleGood(res.cartList);
								}
							})
						}
					})
				})
			},
			// 删除所有商品
			deleteList(){
				//等待新的api
			},
			// 选中商品
			selected(good){
				if(!good.is_sale){
					this.hanldeInvalidGood(good.cart_id);
					return ;
				}
				http.post(api.CartChecked,{
				          goods_id: good.goods_id,
				          id:       good.cart_id,
				          user_id:  uni.getStorageSync('userInfo').id,
				          checked:  good.selected?0:1}).then(res=>{
				            console.log(res);
							this.selecGoodNum=res.CountNum;//已选中的所有商品
							this.sumPrice=res.TotalPrice;//已选中的所有商品价格
							if(res.cartList.length==0){
								this.goodsList=[];
							}else{
								this.handleGood(res.cartList);
							}
						})	
			},
			//全选
			allSelect(){
				http.post(api.CartChechedAll,{shop_id:currentShop.id,
				      user_id:wx.getStorageSync('userInfoInServer').id,
				      checked_all:currentShop.shopChecked}).then(res=>{
				        console.log(res)
				        this.allList = res;   
				        this.$apply() ;  
				}) 
			},
			// 减少数量
			sub(index){
				if(this.goodsList[index].number<=1){
					return;
				}
				this.goodsList[index].number--;
				this.sum(null,index);
			},
			// 增加数量
			add(index){
				this.goodsList[index].number++;
				this.sum(null,index);
			},
			// 合计
			sum(e,index){
				console.log(index)
				if(e){
					this.goodsList[index].number=(e.detail.value);
				}
				//提交商品数目
				http.post(api.CartUpdate,{
						id:      this.goodsList[index].cart_id,
						goods_id:this.goodsList[index].goods_id,
						number:  this.goodsList[index].number,
						user_id: uni.getStorageSync('userInfo').id
					  },true).then(res=>{
						console.log(res);
						if(res.code == 201){
						  popup.toast('添加失败','../../static/img/warn.png');
						}else{
							this.selecGoodNum=res.CountNum;//已选中的所有商品
							this.sumPrice=res.TotalPrice;//已选中的所有商品价格
							if(res.cartList.length==0){
								this.goodsList=[];
							}else{
								this.handleGood(res.cartList);
							}
						}
					})
			},
			//结算
			toConfirmation(){
				if(this.selecGoodNum == 0){
					popup.toast('请选择商品结算','../../static/img/warn.png');
					return ;
				}
				//设置默认地址
				uni.getStorage({
					key:'userDefaultAddress',
					fail:(res=>{
						popup.modal({
							title:'设置默认地址',
							content:'您还没有设置默认收货地址哦～',
							confirmText:'前往设置',
							success:(res=>{
								if(res.confirm){
									uni.navigateTo({
										url:"../address/list",
									})
								}
							})
						})
					})
				})
				//跳转到订单填写页
				uni.navigateTo({
					url:'../orderConfirm/orderConfirm',
				})
			},
			//控制左滑删除效果-begin
			touchStart(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX,event.touches[0].pageY];
			},
			touchMove(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
				
				if(this.isStop||Math.abs(moveX)<5){
					return ;
				}
				if (Math.abs(moveY) > Math.abs(moveX)){
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}
				
				if(moveX<0){
					this.theIndex = index;
					this.isStop = true;
				}else if(moveX>0){
					if(this.theIndex!=null&&this.oldIndex==this.theIndex){
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(()=>{
							this.oldIndex = null;
						},150)
					}
				}
			},
			touchEnd(index,$event){
				//结束禁止触发效果
				this.isStop = false;
			},
			//控制左滑删除效果-end
			
			discard() {
				//丢弃
			}
			
			
		}
	}
</script>
<style scoped>
  @import './icon.css';
</style>
<style lang="scss" >
	
	page{position: relative;background-color: #fff;}
	.checkbox-box{
		display: flex;
		align-items: center;
		.checkbox{
			width: 35upx;
			height: 35upx;
			border-radius: 100%;
			border: solid 2upx #f06c7a;
			display: flex;
			justify-content: center;
			align-items: center;
			.on{
				width: 25upx;
				height: 25upx;
				border-radius: 100%;
				background-color: #f06c7a;
			}
		}
		.text{
			font-size: 28upx;
			margin-left: 10upx;
		}
	}
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
		
	}
	.place{
		
		background-color: #ffffff;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
	.goods-list{
		width: 100%;
		padding: 20upx 0 120upx 0;
		.tis{
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}
		.row{
			width: calc(92%);
			height: calc(22vw + 40upx); 
			margin: 20upx auto;
			
			border-radius: 15upx;
			box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;
			.menu{
				.icon{
					color: #fff;
					// font-size: 25upx;
				}
				position: absolute;
				width: 30%;
				height: 100%;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}
			.carrier{
				@keyframes showMenu {
					0% {transform: translateX(0);}100% {transform: translateX(-30%);}
				}
				@keyframes closeMenu {
					0% {transform: translateX(-30%);}100% {transform: translateX(0);}
				}
				&.open{
					animation: showMenu 0.25s linear both;
				}
				&.close{
					animation: closeMenu 0.15s linear both;
				}
				background-color: #fff;
				.checkbox-box{
					padding-left: 20upx;
					flex-shrink: 0;
					height: 22vw;
					margin-right: 20upx;
				}
				.shixiao{
					position: absolute;
					right: 20upx;
					font-size: 150upx;
					z-index: 6;
					color: rgba(153,153,153,0.9)
				}
				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				display: flex;
				align-items: center;
				.goods-info{
					width: 100%;
					display: flex;
					padding-right: 20upx;
					.img{
						width: 22vw;
						height: 22vw;
						border-radius: 10upx;
						overflow: hidden;
						flex-shrink: 0;
						margin-right: 10upx;
						image{
							width: 22vw;
							height: 22vw;
						}
					}
					.info{
						width: 100%;
						height: 22vw;
						overflow: hidden;
						display: flex;
						flex-wrap: wrap;
						position: relative;
						.title{
							width: 100%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							// text-align: justify;
							overflow: hidden;
						}
						.spec{
							font-size: 20upx;
							background-color: #f3f3f3;
							color: #a7a7a7;
							height: 30upx;
							display: flex;
							align-items: center;
							padding: 0 10upx;
							border-radius: 15upx;
							margin-bottom: 20vw;
						}
						.price-number{
							position: absolute;
							width: 100%;
							bottom: 0upx;
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							font-size: 28upx;
							height: 60upx;
							.price{
							}
							.number{
								display: flex;
								justify-content: center;
								align-items: flex-end;
								.input{
									width: 60upx;
									height: 60upx;
									margin: 0 10upx;
									background-color: #f3f3f3;
									input{
										width: 60upx;
										height: 60upx;
										display: flex;
										justify-content: center;
										align-items: center;
										text-align: center;
										font-size: 26upx;
									}
								}
								.sub ,.add{
									width: 45upx;
									height: 45upx;
									background-color: #f3f3f3;
									border-radius: 5upx;
									.icon{
										font-size: 22upx;
										width: 45upx;
										height: 45upx;
										display: flex;
										justify-content: center;
										align-items: center;
										
									}
								}
							}
						}
					}
				}
			}
		}
	}
	.footer{
		width: 92%;
		padding: 0 4%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;
		.delBtn{
			border: solid 1upx #f06c7a;
			color: #f06c7a;
			padding: 0 30upx;
			height: 50upx;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.settlement{
			width: 60%;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.sum{
				width: 50%;
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;
				.money{
					font-weight: 600;
				}
			}
			.btn{
				padding: 0 30upx;
				height: 50upx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				
				border-radius: 30upx;
			}
		}
	}
</style>
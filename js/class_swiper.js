class swiper{
	constructor(props){
		this.state = {
			className: props.className,
			imgUrl: props.imgUrl,
			index: 0,
			time: 300,//位移总时间
			interval: 10,//间隔
			swiperTimer:null,
			_isLock: false,
			_swiperItemLen: props.swiperItemlen,
			_swiperItem: null,
			_swiperItemWidth:null,
			_swiperPagination: null,
			_swiperList:null,
			_translateStart: null,
			
		};

		this._$ = selector => document.querySelector(selector);
		this._createElement = type => document.createElement(type);
        this._setContent = (elem, content) => elem.textContent = content;
        this._appendChild = (container_1, node_1) => container_1.appendChild(node_1);
        this._insertBefore = (container_2, node_2) => container_2.insertBefore(node_2,container_2.childNodes[0])

        this._init();
	}
	_init(){
		this._addHTML();
	}
	_addHTML(){
		//创建DOM
		let $ = this._$;
		let swiperContainer = $(`.${this.state.className}`);
		let swiperList = this._createElement('div');
		let swiperPagination = this._createElement('div');
		let arrSwiperItem = [];
		let arrswiperPagination = [];
		for(let i = 0;i < this.state._swiperItemLen;i++){
			let swiperItem = this._createElement('a');
			let swiperPaginationSwitch = this._createElement('span');
			this._appendChild(swiperList,swiperItem);
			this._appendChild(swiperPagination,swiperPaginationSwitch);
			swiperPaginationSwitch.setAttribute("data-value",i);
			swiperItem.setAttribute("data-index",i);
			swiperItem.setAttribute("class","swiper-item");
			swiperItem.style.backgroundImage = "url( '"+ this.state.imgUrl[i] +"' )";	
			swiperItem.style.backgroundPosition = "center";
			swiperItem.style.backgroundSize = "cover";
			arrSwiperItem.push(swiperItem)
			arrswiperPagination.push(swiperPaginationSwitch) 
			this.state._swiperItem = arrSwiperItem;
			this.state._swiperPagination = arrswiperPagination;
			if(i == 0){
				swiperPaginationSwitch.setAttribute("class","swiper-pagination-switch active")
			}else{
				swiperPaginationSwitch.setAttribute("class","swiper-pagination-switch")
			}
		}


		console.log(this.state._swiperItem)
		let swiperArrowLeft = this._createElement('a');
		let swiperArrowRight = this._createElement('a');
		let arrowLeftImg = this._createElement('img');
		let arrowRihgtImg = this._createElement('img');
		arrowLeftImg.setAttribute("src","./images/arrowleft.png");
		arrowRihgtImg.setAttribute("src","./images/arrowleft.png");
		swiperContainer.setAttribute("class","swiper-container");
		swiperList.setAttribute("class","swiper-list");
		swiperPagination.setAttribute("class","swiper-pagination");
		swiperArrowLeft.setAttribute("class","swiper-arrow swiper-arrow-left");
		swiperArrowRight.setAttribute("class","swiper-arrow swiper-arrow-right");
		this._appendChild(swiperContainer,swiperList);
		this._appendChild(swiperContainer,swiperPagination);
		this._appendChild(swiperContainer,swiperArrowLeft);
		this._appendChild(swiperContainer,swiperArrowRight);
		this._appendChild(swiperArrowLeft,arrowLeftImg);
		this._appendChild(swiperArrowRight,arrowRihgtImg);
		//克隆第一和最后一个项目并插入节点
		let firstItem = this.state._swiperItem[0];
		let lastItem = this.state._swiperItem[this.state._swiperItemLen-1];
		let cloneFirstItem = firstItem.cloneNode();
		let cloneLastItem = lastItem.cloneNode();
		this._appendChild(swiperList,cloneFirstItem);
		this._insertBefore(swiperList,cloneLastItem);
		//获取Item宽度
		this.state._swiperItemWidth = this.state._swiperItem[0].offsetWidth;
		console.log(this.state._swiperItemWidth)
		//重设偏移值
		swiperList.style.left = -this.state._swiperItemWidth + "px";
		this.state._translateStart = this.state._swiperItemWidth
		//存储swiperList
		this.state._swiperList = swiperList;
		console.log(this.state._swiperList)
		//绑定事件
		console.log(swiperArrowLeft)
		swiperArrowLeft.addEventListener('click',this._swiperPrev.bind(this));
		swiperArrowRight.addEventListener('click',this._swiperNext.bind(this));
		swiperPagination.addEventListener('click',this._swiperSwitch.bind(this));
		window.addEventListener('resize',this._resetSwiperWidth.bind(this));
		// swiperContainer.addEventListener('mouseover',this.stopAutoPlay.bind(this));
		// swiperContainer.addEventListener('mouseout',this.autoPlay.bind(this));
		// this.autoPlay();
	}


   autoPlay(){
   		this.state.swiperTimer = setInterval(()=>{
   			this._swiperNext()
   		},5000)
   }

   	stopAutoPlay(){
   		clearInterval(this.state.swiperTimer);
   	}


	_swiperPrev(){
		let prev_index = this.state.index - 1;
		this._gotoIndex(prev_index)
		console.log('prev',this.state.index)
	}
	_swiperNext(){
		let next_index = this.state.index + 1;
		this._gotoIndex(next_index)
		console.log('next',this.state.index)
	}
	_swiperSwitch(e){
		let active_index = Number(e.target.getAttribute("data-value"));
		this._gotoIndex(active_index)
		console.log('active',this.state.index)
	}
	_resetSwiperWidth(){
		let active_index = this.state.index;
		let swiperItemWidth = document.getElementsByClassName('swiper-item')[0].offsetWidth;
		let translateX = swiperItemWidth + swiperItemWidth * active_index;
		this.state._swiperList.style.left = -translateX + "px";
		console.log(this.state._translateStart)
		this.state._swiperItemWidth = swiperItemWidth;
		this.state._translateStart = swiperItemWidth;
	}
	_gotoIndex(index){
		let isLock = this.state._isLock;
		if(isLock){
          return
          console.log("return")
        }else{
			this.state._isLock = true;
        }
		let swiperItemLen = this.state._swiperItemLen;
		let swiperItemWidth = this.state._swiperItemWidth;
		let newleft = null;
		let count = this.state.time/this.state.interval;//次数
		let translateStart = this.state._translateStart
		let timer = setInterval(()=>{
			if(count>0){
				count --;
				console.log(index,"move")
				let eachleft = ((swiperItemWidth + swiperItemWidth * index) - translateStart)/(this.state.time/this.state.interval);//每次位移量
				newleft += eachleft;
				this.state._swiperList.style.left = -(translateStart + newleft) + "px";
			}else{
				this.state._translateStart = (swiperItemWidth + swiperItemWidth * index)
				if(index == -1){
					index = swiperItemLen - 1;
					this.state._swiperList.style.left = -(swiperItemWidth * swiperItemLen) + "px";
					this.state._translateStart = swiperItemWidth * swiperItemLen
				}
				if(index == swiperItemLen){
					index = 0;
					this.state._swiperList.style.left = -swiperItemWidth + "px";
					this.state._translateStart = swiperItemWidth
				}
				this.state.index = index;
				console.log(index,"end");
				clearInterval(timer)
				this.state._isLock = false;
				for(let i = 0 ;i < this.state._swiperPagination.length;i++ ){
					this.state._swiperPagination[i].setAttribute("class","swiper-pagination-switch")
				}
				this.state._swiperPagination[index].setAttribute("class","swiper-pagination-switch active")
			}
		},20);
		console.log(index)

		console.log(translateStart,"translateStart")

		// for(let i = 0;i < this.state._swiperItemLen;i++){
		// 	let allPagination = document.getElementsByClassName("swiper-pagination-switch")[i];
		// 	allPagination.setAttribute("class","swiper-pagination-switch")
		// 	let activePagination = document.getElementsByClassName("swiper-pagination-switch")[index];
		// 	activePagination.setAttribute("class","swiper-pagination-switch active")
		// }

	}
}

{
	let pageSwiper = {
		init:function(){
            this.initSwiper();
        },
        initSwiper:function(){
            const swiper_1 = new swiper({
                className : 'swiper-container',
                swiperItemlen : 3,
                imgUrl : ["./images/bg2.jpg","./images/bg3.jpg","./images/bg4.jpg"]
            })
            
		},
	}
	pageSwiper.init();
}
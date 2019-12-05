/*
  1:歌曲搜索接口
    请求地址:https://autumnfish.cn/search
    请求方法:get
    请求参数:keywords(查询关键字)
    响应内容:歌曲搜索结果

  2:歌曲url获取接口
    请求地址:https://autumnfish.cn/song/url
    请求方法:get
    请求参数:id(歌曲id)
    响应内容:歌曲url地址
  3.歌曲详情获取
    请求地址:https://autumnfish.cn/song/detail
    请求方法:get
    请求参数:ids(歌曲id)
    响应内容:歌曲详情(包括封面信息)
  4.热门评论获取
    请求地址:https://autumnfish.cn/comment/hot?type=0
    请求方法:get
    请求参数:id(歌曲id,地址中的type固定为0)
    响应内容:歌曲的热门评论
  5.mv地址获取
    请求地址:https://autumnfish.cn/mv/url
    请求方法:get
    请求参数:id(mvid,为0表示没有mv)
    响应内容:mv的地址
*/

// 设置axios的基地址
axios.defaults.baseURL = 'https://autumnfish.cn';
// axios.defaults.baseURL = 'http://localhost:3000';

// 实例化vue
var app = new Vue({
  el: "#player",
  data: {
    // 搜索关键字
    query: '邓紫棋',
    // 歌曲列表
    musicList: [],
    // 歌曲url
    musicUrl: '',
    // 是否正在播放
    isPlay: false,
    // 歌曲热门评论
    hotComments: [],
    // 歌曲封面地址
    coverUrl: '',
    // 显示视频播放
    showVideo: false,
    // mv地址
    mvUrl: '',
    //歌曲标题
    musicTitle: '',
    //当前播放歌曲下标
    musicIndex: 0
  },
  mounted() {
    this.searchMusic()
    this.query = ''
  },
  // 方法
  methods: {
    // 搜索歌曲
    searchMusic() {
      if (this.query == 0) {
        return
      }

      axios.get('/search?keywords=' + this.query).then(response => {

        // 保存内容
        this.musicList = response.data.result.songs;
        this.musicIndex = -1

      })

      // 清空搜索
      //this.query = ''

      //使文本框失焦
      //this.$refs.search.blur()
    },
    // 播放歌曲
    playMusic(music, index) {
      //当前播放歌曲下表
      this.musicIndex = index
      // 获取歌曲url
      axios.get('/song/url?id=' + music.id).then(response => {
        // 保存歌曲url地址
        this.musicUrl = response.data.data[0].url
        if (music.id == 1391453675) {
          this.musicUrl = 'http://vd3.bdstatic.com/mda-jif1x7cic4zm0wkm/mda-jif1x7cic4zm0wkm.mp3';
        }

      })
      // 获取歌曲热门评论
      axios.get('/comment/hot?type=0&id=' + music.id).then(response => {
        // console.log(response)
        // 保存热门评论
        this.hotComments = response.data.hotComments

      })
      // 获取歌曲封面
      axios.get('/song/detail?ids=' + music.id).then(response => {
        // console.log(response)
        // 设置封面
        this.coverUrl = response.data.songs[0].al.picUrl
      })

      //设置歌曲头
      this.musicTitle = music.artists.reduce((preValue, item) => {
        preValue = preValue && preValue + '，'
        return preValue + ' ' + item.name
      }, '') + ' - ' + music.name

    },
    // audio的play事件
    play() {
      this.isPlay = true
      // 清空mv的信息
      this.mvUrl = ''
    },
    // audio的pause事件
    pause() {
      this.isPlay = false
    },
    // 播放mv
    playMv(vid) {
      if (vid) {
        this.showVideo = true;
        // 获取mv信息
        axios.get('/mv/url?id=' + vid).then(response => {
          // console.log(response)
          // 暂停歌曲播放
          this.$refs.audio.pause()
          // 获取mv地址
          this.mvUrl = response.data.data.url
        })
      }
    },
    // 关闭mv界面
    closeMv() {
      this.showVideo = false
      this.$refs.video.pause()
    },
    // 搜索历史记录中的歌曲
    historySearch(history) {
      this.query = history
      this.searchMusic()
      this.showHistory = false;
    },
    //歌曲播放完
    musicEnd() {
      console.log('播放完成')
      //下一曲
      console.log(this.musicList.length)
      if (this.musicList.length > this.musicIndex + 1) {
        this.musicIndex++

      } else {
        this.musicIndex = 0

      }
      this.playMusic(this.musicList[this.musicIndex], this.musicIndex)
    },
    //歌曲播放暂停
    musicOption() {
      if (this.isPlay) {
        this.$refs.audio.pause()
      } else {
        this.$refs.audio.play()
      }
    }
  },

})

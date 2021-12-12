import request  from "../utils/request";

export default
{
  //1.添加小节
  addVideo(video)
  {
      return request({
        url:'/edu/video/addVideo',
        method:'post',
        data:video
      })
  },
  //2.删除小节
  deleteVideo(videoId)
  {
    return request({
      url:'/edu/video/'+videoId,
      method:'delete',
    })
  },
  //3.更新小节
  updateVideo(video)
  {
    return request({
      url:'/edu/video/updateVideo',
      method:'post',
      data:video
    })
  },
  //4.查询小节
  getVideo(videoId)
  {
    return request({
      url:'/edu/video/getVideo/'+videoId,
      method:'get'
    })
  },
  //5 删除小节
  removeVideoById(videoId)
  {
    return request(
      {
        url:'/eduvod/removeVideo/'+videoId,
        method:'delete'
      }
    )

  }



}

import request  from "../utils/request";
export default {
    //1 根据课程id获取章节和小节数据列表
  getAllChapterVideo(courseId)
  {
    return request(
      {
        url:'/edu/chapter/getCourseVideo/'+courseId,
        method:'get'
      }
    )
  },
  addChapter(CHAPTER)
  {
    return request({
      url:'/edu/chapter/addChapter',
      method:'post',
      data:CHAPTER
    })
  },
  updateChapter(CHAPTER)
  {
    return request({
        url:'/edu/chapter/updateChapter',
        method:'post',
        data:CHAPTER
      })
  },
  delete(chapterId)
  {
    return request({
        url:'/edu/chapter/delete/'+chapterId,
        method:'get'
      })
  },
  getChapter(chapterId)
  {
    return request({
      url:'/edu/chapter/getChapterInfo/'+chapterId,
      method:'get'
    })
  }


}

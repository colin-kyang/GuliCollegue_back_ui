import request from '@/utils/request'

export default
{
  //1.添加课程信息
  addCourseInfo(courseInfo){
    return request({
      url:'/edu/course/addCourseInfo',
      method:'post',
      data:courseInfo
    })
  },
  //2.查询所有的讲师
  getListTeacher()
  {
      return request(
        {
          url:'/edu/teacher/findAll',
          method:'get'
        }
      )

  },
  getCourseInfoById(courseId)
  {
    return request({
      url:'/edu/course/getCourseByid/'+courseId,
      method:'get'
    })
  },
  //修改课程信息
  updateCourseInfo(courseInfo)
  {
      return request(
        {
          url:'/edu/course/edit',
          method:'post',
          data:courseInfo
        }
      )
  },
  //获取课程确认信息
  getPublishCourseInfo(courseId)
  {
    return request(
      {
        url:'/edu/course/getPublishCourseInfo/'+courseId,
        method:'get'
      }
    )
  },
  publishCourse(courseId)
  {
    return request(
      {
        url:'/edu/course/publishCourse/'+courseId,
        method:'post'
      }
    )
  },
  getCourseList(searchObj,limit,current)
  {
    return request({
      url:'/edu/course/pageTeacherCondition/'+current+"/"+limit,
      method:'post',
      data:searchObj
    })
  },
  removeCourse(courseId)
  {
    return request({
      url:'/edu/course/removeCourse/'+courseId,
      method:'delete'
    })
  }
}

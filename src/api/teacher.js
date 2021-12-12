import request from '@/utils/request'

export default
{
  //1.讲师列表（条件查询分页）
  getTeacherPageList(current,limit,teacherQuery){
    return request(
      {
        url: `/edu/teacher/pageTeacherCondition/${current}/${limit}` ,
        method: 'post',
        //teacherQuery条件对象，后端使用RequestBody获取数据
        //data表示把对象转换成json进行传递,故后端采用@RequestBody注解
        data:teacherQuery
      }
    );
  },
  removeTeacherById(id) {
    return request(
      {
        url:`/edu/teacher/${id}`,
        method:'get'
      }
    )

  },
  addTeacher(teacher)
  {
    return request({
      url:'/edu/teacher/addTeacher',
      method:'post',
      data:teacher
    });
  },
  getTeacherInfo(id)
  {
  return request(
    {
      url:`/edu/teacher/getTeacher/${id}`,
      method:'get'
    });
  },
  updateTeacher(teacher)
  {
   return  request({
      url:`/edu/teacher/updateTeacher`,
      method:'post',
      data:teacher
    });
  }
}

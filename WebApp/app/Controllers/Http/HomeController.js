'use strict'
const Database = use('Database');
const Helper = use ('ESING/Helper')

class HomeController {

    async getLesson ({request, auth, response}) {
        const { id } = request.all()
        let breadcrumb = []
        let lesson = null
        let category_id = id
        let user = null
        try {
            user = await auth.getUser()
        } catch (error) {
            return response.json({
                code: 5,
                message: 'Nội dung cần phải đăng nhập'
            })
        }

        if (id) {
            lesson = await Database.table('lessons')
            .where('id', id)
            .first()

            if (lesson.sach && lesson.sach != '') {
                lesson.sach = JSON.parse(lesson.sach)
            }

            // Get breadcrumb
            const course = await Database.table('courses')
            .where('id', lesson.course_id)
            .select('id', 'title', 'category_id')
            .first()

            if (course) {

                let checkCode = await Database.table('product_code')
                .join('codes', 'product_code.code_id', 'codes.id')
                .join('courses', 'courses.id', 'product_code.course_id')
                .where('product_code.user_id', auth.user.id)
                .where('courses.id', course.id)
                .where('product_code.exp_date', '>', this._getDateTimeBefore(0))
                .first()

                if (checkCode) {
                    category_id = course.category_id

                    course.url = '/khoa-hoc/'+Helper.toSlug(course.title) + '-' + course.id
                    breadcrumb.push(course)
                    while (true) {
                        let category = await Database.table('course_categories')
                        .where('id', category_id)
                        .first();

                        if (category) {
                            category.url = '/danh-muc/'+Helper.toSlug(category.title) + '-' + category.id
                            breadcrumb.push(category)
                            category_id = category.parent_id
                        } else {
                            break
                        }
                    }
                } else {
                    return response.json({
                        code: 3,
                        message: 'Bạn chưa đăng ký nội dung này !'
                    })
                }
                
            }
        }

        return response.json({
            code: 1,
            message: '',
            data: {
                breadcrumb: breadcrumb ? breadcrumb.reverse() : [],
                lesson: lesson
            }
        })
    }

    _getDateTimeBefore(beforeDay) {
        let date = new Date();
        date.setDate(date.getDate() + beforeDay);
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    
        let fullDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        return fullDateTime;
    }

    async getCourse ({request, auth, response}) {
        try {

            const { id } = request.all()
            let lesson = []
            let breadcrumb = []
            let category_id = id
            let course_id = null
            let user = null

            try {
                user = await auth.getUser()
            } catch (error) {
                return response.json({
                    code: 5,
                    message: 'Nội dung cần phải đăng nhập'
                })
            }
            if (id) {

                let checkCode = await Database.table('product_code')
                .join('codes', 'product_code.code_id', 'codes.id')
                .join('courses', 'courses.id', 'product_code.course_id')
                .where('product_code.user_id', auth.user.id)
                .where('courses.id', id)
                .where('product_code.exp_date', '>', this._getDateTimeBefore(0))
                .first()

                if (checkCode) {
                    // Get lesson info
                    lesson = await Database.table('lessons')
                    .where('course_id', id)

                    for (let i = 0 ; i < lesson.length; i++) {
                        lesson[i].url = Helper.toSlug(lesson[i].title) + '-' + lesson[i].id
                        course_id = lesson[i].course_id
                    }


                    // Get breadcrumb
                    const course = await Database.table('courses')
                    .where('id', course_id)
                    .where('status', 1)
                    .select('id', 'title', 'category_id')
                    .first()

                    if (course) {
                        category_id = course.category_id

                        course.url = '/khoa-hoc/'+Helper.toSlug(course.title) + '-' + course.id
                        breadcrumb.push(course)
                        while (true) {
                            let category = await Database.table('course_categories')
                            .where('id', category_id)
                            .first();

                            if (category) {
                                category.url = '/danh-muc/'+Helper.toSlug(category.title) + '-' + category.id
                                breadcrumb.push(category)
                                category_id = category.parent_id
                            } else {
                                break
                            }
                        }
                    } else {
                        return response.json({
                            code: 2,
                            message: 'Khóa học không có hoặc tạm thời không hoạt động'
                        })
                    }

                    return response.json({
                        code: 1,
                        message: '',
                        data: {
                            breadcrumb: breadcrumb ? breadcrumb.reverse() : [],
                            lesson: lesson
                        }
                    })
                } else {
                    return response.json({
                        code: 3,
                        message: 'Bạn chưa đăng ký nội dung này !'
                    })
                }
            }

            return response.json({
                code: 0,
                message: ''
            })
        } catch (error) {
            return response.json({
                code: 0,
                message: error.message
            })
        }
        
    }

    async getCategoryAndCourse ({request, response}) {
        const { id } = request.all()

        let category, course = []
        let categoryinfo = {
            url: '',
            title: ''
        }

        if (id) {

            const categoryIf = await Database.table('course_categories')
            .where('id', id)
            .first()

            if (categoryIf) {
                categoryinfo.url = Helper.toSlug(categoryIf.title) + '-' + categoryIf.id
                categoryinfo.title = categoryIf.title
            }

            category = await Database.table('course_categories')
            .where('parent_id', id)

            for (let i = 0 ; i < category.length; i++) {
                category[i].url = Helper.toSlug(category[i].title) + '-' + category[i].id
            }

            course = await Database.table('courses')
            .where('category_id', id)

            const listCourseId = []
            
            for (let index = 0; index < course.length; index++) {
                listCourseId.push(course[index].id)
            }
            
            let lessonList = await Database.table('lessons')
            .whereIn('course_id', listCourseId)

            for (let i = 0 ; i < lessonList.length; i++) {
                lessonList[i].url = Helper.toSlug(lessonList[i].title) + '-' + lessonList[i].id
            }

            for (let i = 0 ; i < course.length; i++) {
                course[i].url = Helper.toSlug(course[i].title) + '-' + course[i].id
                course[i].lessons = lessonList.filter(lesson => {return lesson.course_id == course[i].id})
            }
        }

        return response.json({
            code: 1,
            message: '',
            data: {
                categoryinfo: categoryinfo,
                category: category,
                course: course
            }
        })
    }
    async getMenu ({request, response}) {
        const { location } = request.all()

        if (location) {
            const menu = await Database.table('menu')
            .where('location', location)
            .first()
            
            if (menu && menu.data && menu.data != '') {
                return response.json({
                    code: 1,
                    data: JSON.parse(menu.data)
                })
            }
        }

        return response.json({
            code: 1,
            data: []
        })
    }
}

module.exports = HomeController

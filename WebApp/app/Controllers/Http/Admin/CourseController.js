'use strict';
const Database = use('Database');
const { validate } = use('Validator')
const Helper = use ('ESING/Helper')

class CourseController {

    async index({ request, auth, response, view }){

      let productData = await Database.table('course_categories');

      let products = productData.filter((pr) => { return pr.parent_id == 0 || pr.parent_id == null})

      // Loop productCategory level 1
      for (let index = 0; index < products.length; index++) {
        products[index].childs = productData.filter((pr) => { return pr.parent_id == products[index].id })
        // Loop productCategory level 2
        for (let index2 = 0; index2 < products[index].childs.length; index2++) {
          products[index].childs[index2].childs = productData.filter((pr) => { return pr.parent_id == products[index].childs[index2].id })
          for (let index3 = 0; index3 < products[index].childs[index2].childs.length; index3++) {
            products[index].childs[index2].childs[index3].childs = productData.filter((pr) => { return pr.parent_id == products[index].childs[index2].childs[index3].id })
          }
        }
      }

      return response.send(view.render('admin.product.category',{ 
        products
      }))
    }

    async getCategory ({request, response}) {
      try {
        let productData = await Database.table('course_categories');

        let products = productData.filter((pr) => { return pr.parent_id == 0 || pr.parent_id == null})

        // Loop productCategory level 1
        for (let index = 0; index < products.length; index++) {
          products[index].childs = productData.filter((pr) => { return pr.parent_id == products[index].id })
          // Loop productCategory level 2
          for (let index2 = 0; index2 < products[index].childs.length; index2++) {
            products[index].childs[index2].childs = productData.filter((pr) => { return pr.parent_id == products[index].childs[index2].id })
            for (let index3 = 0; index3 < products[index].childs[index2].childs.length; index3++) {
              products[index].childs[index2].childs[index3].childs = productData.filter((pr) => { return pr.parent_id == products[index].childs[index2].childs[index3].id })
            }
          }
        }

        return response.json({
          code: 1,
          message: '',
          data: products
        })
      } catch (error) {
        return response.json({
          code: 1,
          message: error.message,
        })
      }
    }

    async getCategoryById ({request, response, params}) {

      const category = await Database.table('course_categories')
      .where('id', params.id)
      .first()

      return response.json({
        code: 1,
        message: '',
        data: category
      })
    }

    async deleteCategory ({request, response}) {
      const { id } = request.all();

      // Chuyen categorie con ra ngoai cung
      await Database.table('course_categories')
      .where('parent_id', id)
      .update({
        parent_id: 0
      })

      // Xoa categorie
      await Database.table('course_categories')
      .where('id', id)
      .delete()

      return response.json({
        code: 1,
        message: '',
      })
    }

    async updateCategory ({request, response}) {
      const { id, parent_id, title, status, image } = request.all();

      // Chuyen categorie con ra ngoai cung
      await Database.table('course_categories')
      .where('id', id)
      .update({
        parent_id,
        title,
        image,
        status: status ? 1 : 0
      })

      return response.json({
        code: 1,
        message: '',
      })
    }

    async addCategory ({request, response}) {
      const {  parent_id, title, status, image } = request.all();

      // Chuyen categorie con ra ngoai cung
      await Database.table('course_categories')
      .insert({
        parent_id,
        title,
        image,
        status: status ? 1 : 0
      })

      return response.json({
        code: 1,
        message: '',
      })
    }


    async addCourse ({request, response}) {
      const {  title, status, category_id, image } = request.all();

      // Chuyen categorie con ra ngoai cung
      await Database.table('courses')
      .insert({
        title,
        category_id,
        image,
        status: status ? 1 : 0
      })

      return response.json({
        code: 1,
        message: '',
      })
    }

    async editCourse ({request, response}) {
      const { id, title, status, category_id, image } = request.all();

      // Chuyen categorie con ra ngoai cung
      await Database.table('courses')
      .where('id', id)
      .update({
        title,
        category_id,
        image,
        status: status ? 1 : 0
      })

      return response.json({
        code: 1,
        message: '',
      })
    }

    async getCourse ({request, response}) {

      let course = await Database.table('courses')
      .leftJoin('course_categories', 'courses.category_id', 'course_categories.id')
      .select('courses.*', 'course_categories.title as category_title')

      for (let i = 0 ; i < course.length; i++) {
        course[i].url = Helper.toSlug(course[i].title) + '-' + course[i].id
      }

      return response.json({
        code: 1,
        message: '',
        data: course
      })
    }

    async deleteCourse ({request, response}) {
      const { id } = request.all();

      // Xoa categorie
      await Database.table('courses')
      .where('id', id)
      .delete()

      return response.json({
        code: 1,
        message: '',
      })
    }

    async addLesson ({request, response}) {
      const {  title, status, course_id, image, baihat, tuvung, sach, type } = request.all();

      // Chuyen categorie con ra ngoai cung
      await Database.table('lessons')
      .insert({
        title,
        course_id,
        image,
        baihat,
        tuvung,
        sach: JSON.stringify(sach) || '',
        status: status ? 1 : 0,
        type: type
      })

      return response.json({
        code: 1,
        message: '',
      })
    }

    async editLesson ({request, response}) {
      const { id, title, status, course_id, image, baihat, tuvung, sach, type} = request.all();

      await Database.table('lessons')
      .where('id', id)
      .update({
        title,
        course_id,
        image,
        baihat,
        tuvung,
        sach: JSON.stringify(sach) || '',
        status: status ? 1 : 0,
        type: type
      })

      return response.json({
        code: 1,
        message: '',
      })
    }

    async getLesson ({request, response}) {
      const { course_id } = request.all()

      let lessons = await Database.table('lessons')
      .join('courses', 'courses.id', 'lessons.course_id')
      .select('lessons.*', 'courses.title as course_title')
      .where('lessons.course_id', course_id)

      for (let i = 0 ; i < lessons.length; i++) {
        lessons[i].url = Helper.toSlug(lessons[i].title) + '-' + lessons[i].id
      }

      return response.json({
        code: 1,
        message: '',
        data: lessons
      })
    }

    async getLessonById ({request, response, params}) {

      let lessons = await Database.table('lessons')
      .where('lessons.id', params.id)
      .first()

      if (lessons.sach && lessons.sach != '') {
        lessons.sach = JSON.parse(lessons.sach)
      }

      return response.json({
        code: 1,
        message: '',
        data: lessons
      })
    }
}

module.exports = CourseController

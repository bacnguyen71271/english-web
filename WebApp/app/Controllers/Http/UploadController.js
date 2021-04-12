'use strict'

const Helpers = use('Helpers')
const uuid = use('uuid')
const Env = use('Env')
const Database = use('Database');
const Video = use('ESING/Video');
const fs = require('fs');
const code_generator = use('voucher-code-generator');

class UploadController {

    async getMediaType ({ request, auth, response} ) {
        const mediaType = await Database.table('media')
        .distinct('type')

        return response.json({
            code: 1,
            message: 'success',
            data: mediaType
        })
    }

    async deleteMedia ({ request, auth, response} ) {
        let { id, src } = request.all()
        let srcInfo, fileName, folder, error

        if (id && src && src != '') {
            try {
                const mediaInfo = await Database.table('media')
                .where('id', id)
                .first()
                if (mediaInfo) {
                    srcInfo = mediaInfo.src.split('/')
                    if (srcInfo.length > 2) {
                        fileName = srcInfo[srcInfo.length - 1]
                        folder = srcInfo[srcInfo.length - 2]
                    }

                    if (mediaInfo.type == 'video') {
                        try {
                            fs.rmdirSync(Helpers.publicPath(`uploads/video/${fileName}`), { recursive: true })
                        } catch(err) {
                            error = err
                            console.error(err)
                        }
                    } else {
                        if (fileName && folder) {
                            try {
                                fs.unlinkSync(Helpers.publicPath(`uploads/${folder}/${fileName}`))
                            } catch(err) {
                                error = err
                                console.error(err)
                            }
                        }
                    }

                    if (!error) {
                        await Database.table('media')
                            .where('id', id)
                            .delete()
                    }
                }
            } catch (err) {
                error = err
            }
        }

        if (!error) {
            return response.json({
                code: 1,
                message: 'success'
            })
        } else {
            return response.json({
                code: 0,
                message: error
            })
        }
        
    }

    async mediaRename ({request, response}) {
        const { id, name } = request.all();

        if (id && name) {
            await Database.table('media')
            .where('id', id)
            .update({
                file_name: name
            })
        }

        return response.json({
            code: 1,
            message: 'success'
        })
    }

    async getMedia ( {request, auth, response} ) {
        let { page, type } = request.all()
        if (!page) page = 1

        let mediaList = Database.table('media')
            .orderBy('updated_at', 'desc')

        if (type == 'video') {
            mediaList.where('type', 'video')
        } else {
            mediaList.where('type', '!=', 'video')
        }
        
        mediaList = await mediaList
        .paginate(page, 100)

        if (mediaList.data) {
            for (let index = 0; index < mediaList.data.length; index++) {
                mediaList.data[index].src = `${Env.get('PUBLIC_URL', 'http://127.0.0.1:3333')}/${mediaList.data[index].src}`
                
            }
        }

        return response.json({
            code: 1,
            message: 'success',
            data: mediaList
        })
    }

    async uploads ( {request, auth, response} ) {

        const profilePic = request.file('file', {
            types: ['image', 'application', 'video'],
            size: '2000mb'
        })

        if (!profilePic) {
            return response.json({
                code: 0,
                message: 'Không tìm thấy file !'
            })
        } else {

            let dataOut = [];
            let dataIn = [];

            if (profilePic.files) {
                dataIn = profilePic.files
            } else {
                dataIn.push(profilePic)
            }

            for (let index = 0; index < dataIn.length; index++) {
                const element = dataIn[index];
                let saveFile = null
                if (element.type == 'video') {
                    saveFile = await this.videoSave(element);
                    Video.ConvertsVideo(saveFile.file_name)
                } else {
                    saveFile = await this.save(element);
                }
                if (saveFile) {
                    dataOut.push(saveFile)
                }
            }

            return response.json({
                code: 1,
                message: 'success',
                data: dataOut
            })
        }

    }

    async videoSave (file) {
        
        let code = code_generator.generate({
            // length: 8,
            count: 1,
            charset: "0123456789QWERTYUIOPASDFGHJKLZXCVBNM",
            pattern: "##########",
        });

        code = code[0].toUpperCase();

        const fileName = code + '.' + file.extname
        await file.move(Helpers.tmpPath('uploads'), {
            name: fileName,
            overwrite: true
        })

        if (!file.moved()) {
            return false
        } else { 
            const media = await Database.table('media')
                .insert({
                    src: `uploads/video/${code}/0`,
                    size: file.size,
                    format: file.extname,
                    file_name: file.clientName,
                    type: file.type
                })
            return {
                id: media[0],
                src: `${Env.get('PUBLIC_URL', 'http://127.0.0.1:3333')}/uploads/video/${code}/0`,
                file_name: fileName,
                format: file.extname,
                size: file.size
            }
        }

    }

    async save (file) {

        const date = new Date();
        const folder = date.getDay()+''+(date.getMonth()+1)+''+date.getFullYear();
        const fileName = uuid.v4() + '.' + file.extname;
        await file.move(Helpers.publicPath('uploads/'+folder), {
            name: fileName,
            overwrite: true
        })

        if (!file.moved()) {
            return false
        } else { 
            const media = await Database.table('media')
                .insert({
                    src: `uploads/${folder}/${fileName}`,
                    size: file.size,
                    format: file.extname,
                    file_name: file.clientName,
                    type: file.type
                })
            return {
                id: media[0],
                src: `${Env.get('PUBLIC_URL', 'http://127.0.0.1:3333')}/uploads/${folder}/${fileName}`,
                format: file.extname,
                size: file.size
            }
        }

    }
}

module.exports = UploadController

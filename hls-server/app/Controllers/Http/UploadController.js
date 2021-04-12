'use strict'
const Video = require('../../Common/VideoHepler')
const code_generator = use('voucher-code-generator');
const Helpers = use('Helpers')
const Env = use('Env')

class UploadController {
    async uploads ( {request, response} ) {
        const profilePic = request.file('file', {
            types: ['video'],
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
                const saveFile = await this.save(element);
                if (saveFile) {
                    Video.ConvertsVideo(saveFile.file_name)
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

    async save (file) {
        
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
            // const media = await Database.table('media')
            //     .insert({
            //         src: `uploads/${fileName}`,
            //         size: file.size,
            //         format: file.extname,
            //         file_name: file.clientName
            //     })
            return {
                // id: media[0],
                src: `${Env.get('PUBLIC_URL', 'http://127.0.0.1:3333')}/uploads/video/${code}`,
                file_name: fileName,
                format: file.extname,
                size: file.size
            }
        }

    }
}

module.exports = UploadController

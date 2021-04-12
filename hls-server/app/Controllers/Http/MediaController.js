'use strict'
const fs = require('fs');
const Helpers = use('Helpers')
const util = require('util');
const directoryPath = Helpers.publicPath(`uploads`)
const readdir = util.promisify(fs.readdir);

class MediaController {
    
    async brower ({request, response}) {
        try {
            const files = await readdir(directoryPath);
            return response.json({
                code: 1,
                message: '',
                data: files
            }) 
        } catch (error) {
            return response.json({
                code: 0,
                message: error,
            }) 
        }
    }
}

module.exports = MediaController

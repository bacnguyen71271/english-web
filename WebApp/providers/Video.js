'use strict'
const Helpers = use('Helpers')
const cv = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const Drive = use('Drive')

class Video {
    constructor (Config) {
        // this.config = Config
    }

    async ConvertsVideo (file_name) {
        const filename = file_name.split('.')
        cv.setFfmpegPath(ffmpegInstaller.path);

        if (!fs.existsSync(Helpers.publicPath(`uploads/video/${filename[0]}`))){
            fs.mkdirSync(Helpers.publicPath(`uploads/video/${filename[0]}`));
        }
        console.log('Conversion: ' + filename[0] + ' - start' );
        cv(Helpers.tmpPath(`uploads/${file_name}`), { timeout: 432000 }).addOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 4',
            // '-hls_key_info_file enc.keyinfo',
            '-hls_list_size 0',
            '-f hls'
        ]).output(Helpers.publicPath(`uploads/video/${filename[0]}/0`)).on('end', async () => { 
            console.log('Conversion: ' + filename[0] + ' - done' );
            // Delete source media
            await Drive.delete(Helpers.tmpPath(`video/${file_name}`))
        }).run();
    }

}

module.exports = Video

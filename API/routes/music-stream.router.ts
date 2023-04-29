import {Router} from 'express';

const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const router = Router();

router.get('/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    const info = await ytdl.getInfo(url);
    const formats = info.formats.filter((f: any) => f.isHLS && f.hasAudio);
    try {
        const format = ytdl.chooseFormat(formats, {quality: 'highestaudio'});

        const stream = ytdl(url, {
            format,
        })

        const ffmpegProcess = ffmpeg(stream)
            .audioCodec('libmp3lame')
            .format('mp3')
            .on('error', (err) => {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', () => {
                console.log('Streaming ended.');
            });
        res.set('Content-Type', 'audio/mpeg');
        ffmpegProcess.pipe(res);
    } catch (error) {
        console.log(error)
        ytdl(url, {
            filter: 'audioonly',
        }).pipe(res)
    }
});

export default router;

import type { Timeline } from "animejs";
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { FFmpeg, type FileData } from '@ffmpeg/ffmpeg'; 
import { snapdom, preCache } from '@zumer/snapdom';
import { consoleOutput, element, timelines } from "./store";
import { get } from "svelte/store";
import { tick } from "svelte";

const ffmpeg = new FFmpeg();
ffmpeg.on("log", (log) => consoleOutput.update(output => [...output, log.message]));

await ffmpeg.load();
await preCache(document.body);

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// TODO: optimize by compiling ffmpeg with svg support and using snapdom raw
// TODO: optimize ffmpeg with multithreading
export async function recordAnimation() {
    console.log("Recording animation...");
    const tls = get(timelines);
    const tlmain = tls[0];
    const duration = tlmain.duration;
    const fps = tlmain.fps;
    console.log(`Duration: ${duration}ms, FPS: ${fps}`);
    const totalFrames = Math.ceil(duration / (1000 / fps));
    const elem = get(element);
    const width = elem.offsetWidth;
    const height = elem.offsetHeight;
    const frames: Blob[] = [];

    for (const tl of tls) {
        tl.restart();
        tl.pause();
    }
    
    for (let frame = 0; frame < totalFrames; frame++) {
        console.log(`Capturing frame ${frame + 1}/${totalFrames}...`);
        for (const tl of tls) {
            tl.seek((frame / fps) * 1000);
        }

        const wrapper = document.createElement('div');
        wrapper.appendChild(elem.cloneNode(true) as HTMLElement);
        wrapper.style.width = `${width}px`;
        wrapper.style.height = `${height}px`;
        wrapper.style.backgroundColor = 'transparent';
        document.body.appendChild(wrapper);

        await new Promise(requestAnimationFrame);

        const blob = await snapdom.toBlob(wrapper, { quality: 1.00, fast: true, embedFonts: true, type: "webp", backgroundColor: 'transparent' });
        frames.push(blob);

        // downloadFile(blob, `frame${frame}.webp`);

        document.body.removeChild(wrapper);
        wrapper.remove();
    }

    console.log("Converting frames to WebM...");

    const webmBlob = await webpToVideo(frames, fps, width, height, "animation.webm");

    downloadFile(webmBlob, "animation.webm");
}

async function webpToVideo(frames: Blob[], fps: number, width = 640, height = 480, outputFilename = "output.webm") {
    if (!ffmpeg.loaded) throw new Error("FFmpeg is not loaded");

    console.log("Writing frames to FFmpeg...");
    await Promise.all(frames.map((blob, i) => fetchFile(blob).then((data) => ffmpeg.writeFile(`frame${i}.webp`, data))));
    
    console.time("execFFmpeg");
    const res = await ffmpeg.exec([
        "-video_size", `${width}x${height}`,
        '-framerate', `${fps}`,
        '-i', 'frame%d.webp',
        // TODO: update when VP9 is supported
        '-c:v', 'libvpx', // VP8 codec
        '-pix_fmt', 'yuva420p',

        // possible transparency issues without these
        '-auto-alt-ref', '0',
        '-lag-in-frames', '0',

        '-r', `${fps}`,
        '-crf', '20',
        outputFilename
    ]);

    // full command
    // ffmpeg -video_size 640x480 -framerate 60 -i frame%d.webp -c:v libvpx -pix_fmt yuva420p -auto-alt-ref 0 -lag-in-frames 0 -r 60 -crf 20 output.webm
    // 
    console.timeEnd("execFFmpeg");

    if (res !== 0) throw new Error("FFmpeg encoding failed");

    await Promise.all(frames.map((_, i) => ffmpeg.deleteFile(`frame${i}.webp`)));

    const webmData = await ffmpeg.readFile(outputFilename);
    return new Blob([(webmData as Uint8Array).buffer], {
        type: "video/webm",
    });
}

function downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

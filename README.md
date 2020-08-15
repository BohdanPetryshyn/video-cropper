# video-cropper

#### High-level algorithm description
1. Accept the request;
2. Validate the file format;
3. Generate UUID that will be used as the result file name;
4. Return the response with a link to the file that will be eventually generated;
5. Generate the result file:
    * `mp4` case:
        1. Pipe the request stream to a temp file with name, same as the future result file name;
        2. As soon as input is saved to the file, spawn `ffmpeg` process that will produce the result file;
        3. As soon as the `ffmpeg` process finishes - delete the temp file.
    * `avi` case:
        1. Spawn `ffmpeg` process with input set to the `stdin` and output to the result file;
        2. Pipe the request stream to the `ffmpeg`'s `stdin`;

# video-cropper
Cropps your video. Eventually.

#### How to get the things up?
For convenience purposes, the application was dokerized along with the required version of `ffmpeg`.

So, starting the application is as easy as
```shell
docker build -t video-cropper .
docker run -p 8080:8080 --name video-cropper-test video-cropper
```

To crop the video, you need to make a `POST` request to the `/video` endpoint
with the video file in body and appropriate `Content-Type` header value. 
The `mp4` and `avi` video formats are supported.

#### High-level algorithm description
1. Accept the request;
2. Validate the file format;
3. Generate UUID that will be used as the result file name;
4. Return the response with a link to the file that will be eventually generated;
5. Generate the result file:
    1. Pipe the request stream to a temp file with name, same as the future result file name;
    2. As soon as input is saved to the file, spawn `ffmpeg` process that will produce the result file;
    3. As soon as the `ffmpeg` process finishes - delete the temp file.
    
The response is being sent instantly because the processing can take a while. A while means up to infinity.
Not all the clients can wait for an infinity, so it was decided that to return the response before we can make sure
that the video is processable is still better than don't return the response at all.
    
#### Development log
From the very beginning the plan was to handle `mp4` and `avi` differently. 

In most of the cases, `mp4` contains it's metadata at the end of the file.
So it isn't always suitable for streaming. On the other hand, `avi` suits for streaming well.
We could have benefit from that by skipping the buffering for `avi` and pass 
the request data stream directly to the `ffmpeg` process.

##### So, why do we use buffering for `avi`?
The problem is that controlling the `ffmpeg` process concurrency level is vital for application stability.
That means that requests should be queued somehow. Obviously, we can't postpone the client data upload
to the moment the turn comes. So, it was decided to apply buffering for all video formats.

One thing has left from the time the idea of the optimization was looking valid.

### 🥁

... An over engineered `Cropper`s class structure.

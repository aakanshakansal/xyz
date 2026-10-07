import { useCallback, useEffect, useRef, useState } from "react";
import FloatingCard from "../../common/FloatingCard";

const Default_BITRATE = 8000;

function getSupportedMimeType() {
  const types = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  return types.find((type) => MediaRecorder.isTypeSupported(type) || "");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export default function CapturePanel({ canvas, onClose }) {
  const mediaRecordRef = useRef(null);
  const timeRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const [bitRate, setBitRate] = useState(Default_BITRATE);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timeLineEnabled, setTimeLineEnabled] = useState(false);

  const takeScreenshot = useCallback(() => {
    if (!canvas) {
      console.warn("Canvas is not Available");
      return;
    }
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Unable to take screenshot");
          return;
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

        downloadBlob(blob, `badvisor-screenshot-${timestamp}.png`);
      }, "image/png");
    } catch (error) {
      console.error("Capture Failed ", error);
    }
  }, [canvas]);
  const stopRecording = useCallback(() => {
    const recorder = mediaRecordRef.current;

    if (!recorder) return;

    if (recorder.state !== "inactive") {
      recorder.stop();
    }

    if (timeRef.current) {
      clearInterval(timeRef.current);
      timeRef.current = null;
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!canvas) {
      console.warn("Canvas is not Available");
      return;
    }
    if (!canvas.captureStream) {
      alert("Screen Recording not supported by this browser");
      return;
    }
    if (typeof MediaRecorder === "undefined") {
      alert("Media Recorder not supported by this browser");
      return;
    }

    if (mediaRecordRef.current?.state === "recording") {
      stopRecording();
      return;
    }

    try {
      const stream = canvas.captureStream(60);

      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = getSupportedMimeType();
      const options = {
        videoBitsPerSecond: Number(bitRate) * 1000,
      };
      if (mimeType) {
        options.mimeType = mimeType;
      }

      const recorder = new MediaRecorder(stream, options);

      mediaRecordRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const chunks = chunksRef.current;

        if (!chunks.length) {
          setIsRecording(false);
          return;
        }

        const blob = new Blob(chunks, {
          type: recorder.mimeType || mimeType || "video/webm",
        });
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

        downloadBlob(blob, `badvisor-recording-${timestamp}.webm`);
        chunksRef.current = [];
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => {
            track.stop();
          });
        }

        streamRef.current = null;
        mediaRecordRef.current = null;
        setIsRecording(false);
        setRecordingTime(0);
      };
      recorder.onerror = (event) => {
        console.error("error in screen Recording", event.error);
        setIsRecording(false);
      };
      recorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);

      timeRef.current = setInterval(() => {
        setRecordingTime((time) => time + 1)
      }, 1000);
    } catch (error) {
      console.error("Unable to start recording", error);
      setIsRecording(false);
    }
  }, [canvas, bitRate, stopRecording]);

  useEffect(() => {
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
        timeRef.current = null;
      }

      const recorder = mediaRecordRef.current;

      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }

      streamRef.current = null;
      mediaRecordRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (isRecording) {
        stopRecording();
      } else {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRecording, onClose, stopRecording]);

  const formattedTime = `${String(Math.floor(recordingTime / 60)).padStart(2, "0")}: ${String(recordingTime % 60).padStart(2, "0")}`;

  return (
    <FloatingCard
      title="Capture"
      icon=""
      onClose={onClose}
      width={345}
      initialPosition={{
        x: 280,
        y: 180,
      }}
    >
      <div className="space-y-3 p-2 ">
        <section>
          <div className="mb-1 text-sm font-medium">Take Screenshot</div>
          <button
            type="button"
            onClick={takeScreenshot}
            disabled={!canvas}
            className="h-8 w-full rounded-md border border-neutral-400 bg-[#4b4b4b] text-sm font-medium text-white transition  hover:bg-[#5a5a5a] "
          >
            Screenshot
          </button>
        </section>
        {/* Recording */}
        <section>
          <div className="mb-1 text-sm font-medium">Screen Recording</div>
          <div className="flex h-10 overflow-hidden rounded-md bg-[#8ca45b]">
            <div className="flex flex-1 items-center px-3">
              <span className="text-xs font-semibold">kb/s</span>
            </div>
            <input
              type="number"
              min="0"
              max="10000"
              step="500"
              value={bitRate}
              disabled={isRecording}
              onChange={(event) => {
                setBitRate(Math.max(500, Number(event.target.value) || 500));
              }}
              className="w-[70px] border-0 bg-transparent px-1 text-center text-sm font-semibold text-white outline-none"
            />
          </div>
          <button
            type="button"
            onClick={startRecording}
            className="mt-4 h-8 w-full rounded-md border border-neutral-400 bg-[#4b4b4b] text-sm font-medium text-white transition hover:bg-[#5a5a5a] "
          >
            {isRecording
              ? `Stop Recording ${formattedTime}`
              : "Start Recording"}
          </button>
        </section>
        {/* Timeline */}
        <div className="flex h-8 items-center justify-between rounded-md bg-[#4b4b4b] px-2">
          <span className="text-sm">Timeline</span>
          <button
            type="button"
            role="switch"
            aria-checked={timeLineEnabled}
            onClick={() => setTimeLineEnabled((value) => !value)}
            className={`relative h-5 w-8 rounded-full transition ${
              timeLineEnabled ? "bg-[#a8bd6b]" : "bg-[#777777]"
            } `}
          >
            <span
              className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow transition 
              ${timeLineEnabled ? "left-4" : "left-0.5"}
                `}
            />
          </button>
        </div>
      </div>
    </FloatingCard>
  );
}

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

let youTubeApiPromise;

function getYouTubeConfig(source) {
  if (!source) {
    return { videoId: "", listId: "", startRadio: false };
  }

  try {
    const url = new URL(source);
    const host = url.hostname.replace(/^www\./, "");
    const listId = url.searchParams.get("list") ?? "";
    const startRadio = url.searchParams.get("start_radio") === "1";
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.replace("/", "");
    } else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") ?? "";
      } else if (
        url.pathname.startsWith("/embed/") ||
        url.pathname.startsWith("/shorts/")
      ) {
        videoId = url.pathname.split("/")[2] ?? "";
      }
    }

    return { videoId, listId, startRadio };
  } catch {
    return { videoId: "", listId: "", startRadio: false };
  }
}

function loadYouTubeIframeApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube is only available in the browser."));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youTubeApiPromise) {
    return youTubeApiPromise;
  }

  youTubeApiPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    const previousHandler = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousHandler === "function") {
        previousHandler();
      }

      resolve(window.YT);
    };

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load YouTube iframe API."));
    document.head.append(script);
  });

  return youTubeApiPromise;
}

function useOutsideClick(ref, onOutsideClick) {
  useEffect(() => {
    function handleClick(event) {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      onOutsideClick();
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onOutsideClick, ref]);
}

function CassettePlayer({ audio, storyTitle }) {
  const audioRef = useRef(null);
  const youTubeHostRef = useRef(null);
  const youTubePlayerRef = useRef(null);
  const youTubeCurrentTimeRef = useRef(0);
  const source = audio?.src?.trim();
  const fallbackTitle = audio?.title?.trim() || storyTitle;
  const shouldAutoPlay = audio?.autoPlay !== false;
  const youTubeConfig = getYouTubeConfig(source);
  const isYouTube = Boolean(youTubeConfig.videoId);
  const [displayTitle, setDisplayTitle] = useState(fallbackTitle);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setDisplayTitle(fallbackTitle);
  }, [fallbackTitle, source]);

  useEffect(() => {
    if (!isYouTube) {
      setIsReady(false);
      return undefined;
    }

    let isCancelled = false;

    setHasError(false);
    setIsPlaying(false);
    setIsReady(false);
    setHasStarted(false);
    youTubeCurrentTimeRef.current = 0;

    loadYouTubeIframeApi()
      .then((YT) => {
        if (isCancelled || !youTubeHostRef.current) {
          return;
        }

        const player = new YT.Player(youTubeHostRef.current, {
          width: "1",
          height: "1",
          videoId: youTubeConfig.videoId,
          playerVars: {
            autoplay: shouldAutoPlay ? 1 : 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            list: youTubeConfig.listId || undefined,
            listType: youTubeConfig.listId ? "playlist" : undefined,
            loop: !youTubeConfig.listId && audio?.loop ? 1 : 0,
            modestbranding: 1,
            origin: window.location.origin,
            playsinline: 1,
            playlist:
              !youTubeConfig.listId && audio?.loop ? youTubeConfig.videoId : undefined,
            rel: 0,
            start_radio: youTubeConfig.startRadio ? 1 : undefined,
          },
          events: {
            onReady: (event) => {
              if (isCancelled) {
                return;
              }

              youTubePlayerRef.current = event.target;
              setIsReady(true);
              setHasError(false);

              const title = event.target.getVideoData?.().title?.trim();
              setDisplayTitle(title || fallbackTitle);

              if (shouldAutoPlay) {
                event.target.playVideo();
              }
            },
            onStateChange: (event) => {
              if (isCancelled) {
                return;
              }

              const title = event.target.getVideoData?.().title?.trim();
              if (title) {
                setDisplayTitle(title);
              }

              const state = event.data;
              const playerState = window.YT?.PlayerState;
              const isNowPlaying =
                state === playerState?.PLAYING || state === playerState?.BUFFERING;
              youTubeCurrentTimeRef.current =
                event.target.getCurrentTime?.() ?? youTubeCurrentTimeRef.current;
              setIsPlaying(isNowPlaying);

              if (isNowPlaying) {
                setHasStarted(true);
              }
            },
            onError: () => {
              if (isCancelled) {
                return;
              }

              setHasError(true);
              setIsPlaying(false);
              setIsReady(false);
            },
          },
        });

        youTubePlayerRef.current = player;
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }

        setHasError(true);
        setIsPlaying(false);
        setIsReady(false);
      });

    return () => {
      isCancelled = true;

      if (youTubePlayerRef.current) {
        youTubePlayerRef.current.destroy?.();
        youTubePlayerRef.current = null;
      }

      if (youTubeHostRef.current) {
        youTubeHostRef.current.innerHTML = "";
      }
    };
  }, [
    audio?.loop,
    fallbackTitle,
    isYouTube,
    shouldAutoPlay,
    source,
    youTubeConfig.listId,
    youTubeConfig.startRadio,
    youTubeConfig.videoId,
  ]);

  useEffect(() => {
    if (!source || isYouTube) {
      if (!source) {
        setIsPlaying(false);
        setHasError(false);
        setHasStarted(false);
      }

      return undefined;
    }

    if (!source) {
      setIsPlaying(false);
      setHasError(false);
      return undefined;
    }

    const node = audioRef.current;

    if (!node) {
      return undefined;
    }

    node.currentTime = 0;
    setHasError(false);
    setHasStarted(false);

    if (!shouldAutoPlay) {
      return () => {
        node.pause();
        node.currentTime = 0;
      };
    }

    const playPromise = node.play();

    if (playPromise?.catch) {
      playPromise.catch(() => {
        setIsPlaying(!node.paused);
      });
    }

    return () => {
      node.pause();
      node.currentTime = 0;
    };
  }, [isYouTube, shouldAutoPlay, source]);

  if (!source) {
    return null;
  }

  function togglePlayback() {
    if (isYouTube) {
      const player = youTubePlayerRef.current;

      if (!player) {
        return;
      }

      setHasError(false);
      const playerState = player.getPlayerState?.();
      const playerStates = window.YT?.PlayerState;
      const isActuallyPlaying =
        playerState === playerStates?.PLAYING || playerState === playerStates?.BUFFERING;

      if (isActuallyPlaying) {
        youTubeCurrentTimeRef.current =
          player.getCurrentTime?.() ?? youTubeCurrentTimeRef.current;
        player.pauseVideo?.();
      } else {
        const resumeAt =
          player.getCurrentTime?.() ?? youTubeCurrentTimeRef.current;

        if (resumeAt > 0) {
          player.seekTo?.(resumeAt, true);
        }

        player.playVideo?.();
        setHasStarted(true);
      }

      return;
    }

    const node = audioRef.current;

    if (!node) {
      return;
    }

    if (node.paused) {
      const playPromise = node.play();

      if (playPromise?.catch) {
        playPromise.catch(() => {
          setHasError(true);
        });
      }

      return;
    }

    node.pause();
  }

  const playerNote = hasError
    ? "The audio source could not be played. Check the link in content.js."
    : audio.note ??
      (isYouTube
        ? "This chapter opens with your YouTube soundtrack automatically."
        : "This chapter starts playing your song as soon as it opens.");
  const playbackLabel = isPlaying ? "Pause" : hasStarted ? "Resume" : "Play";

  return (
    <section
      className={`cassette-player${isPlaying ? " is-playing" : ""}${hasError ? " has-error" : ""}`}
      aria-label={`Music player for ${storyTitle}`}
    >
      <div className="cassette-player__tape" aria-hidden="true">
        <span className="cassette-player__top-strip" />
        <span className="cassette-player__window" />
        <span className="cassette-player__bridge" />
        <span className="cassette-player__reel cassette-player__reel--left" />
        <span className="cassette-player__reel cassette-player__reel--right" />
      </div>

      <div className="cassette-player__copy">
        <p className="cassette-player__eyebrow">
          {audio.label ?? "Cassette tape"}
        </p>
        <strong>{displayTitle}</strong>
        <p>{playerNote}</p>
      </div>

      <div className="cassette-player__actions">
        <button
          type="button"
          className="cassette-player__toggle"
          onClick={togglePlayback}
          disabled={isYouTube && !isReady}
        >
          {playbackLabel}
        </button>
      </div>

      {isYouTube ? (
        <div
          ref={youTubeHostRef}
          className="cassette-player__youtube"
          aria-hidden="true"
        />
      ) : (
        <audio
          ref={audioRef}
          src={source}
          preload={audio?.preload ?? "metadata"}
          autoPlay={shouldAutoPlay}
          loop={audio?.loop ?? true}
        onPlay={() => {
          setIsPlaying(true);
          setHasError(false);
          setHasStarted(true);
        }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false);
            setHasError(true);
          }}
        />
      )}
    </section>
  );
}

export function ExpandableMemoryList({ cards }) {
  const [active, setActive] = useState(null);
  const dialogRef = useRef(null);

  useOutsideClick(dialogRef, () => setActive(null));

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    document.body.style.overflow = active ? "hidden" : "auto";
    document.body.classList.toggle("has-story-modal-open", Boolean(active));
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      document.body.classList.remove("has-story-modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active]);

  function openStory(card, index) {
    setActive({ card, index });
  }

  const modal = active ? (
    <div className="expandable-modal is-open">
      <div className="expandable-modal__backdrop" />
      <article
        className="expandable-modal__card"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={active.card.title}
      >
        <button
          type="button"
          className="expandable-modal__close"
          onClick={() => setActive(null)}
          aria-label="Close story"
        >
          {"\u00D7"}
        </button>
        <div
          className="expandable-modal__media"
          style={{ "--modal-image": `url("${active.card.src}")` }}
        >
          <img
            src={active.card.src}
            alt={active.card.title}
            className="expandable-modal__image"
          />
        </div>
        <div className="expandable-modal__content">
          <p className="expandable-modal__eyebrow">
            Chapter {String(active.index + 1).padStart(2, "0")}
          </p>
          <h3>{active.card.title}</h3>
          <p className="expandable-modal__description">
            {active.card.description}
          </p>
          <CassettePlayer
            audio={active.card.audio}
            storyTitle={active.card.title}
          />
          <div className="expandable-modal__body">
            {active.card.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  ) : null;

  return (
    <>
      <div className="expandable-list">
        {cards.map((card, index) => (
          <button
            key={card.title}
            type="button"
            className="expandable-list__item"
            onClick={() => openStory(card, index)}
            aria-label={`Open story ${card.title}`}
          >
            <img src={card.src} alt={card.title} />
            <div className="expandable-list__meta">
              <div>
                <span className="expandable-list__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              <span>{card.ctaText}</span>
            </div>
          </button>
        ))}
      </div>

      {typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}

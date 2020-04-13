function formatDuration(duration) {
  const minutes = Math.floor(duration / 1000 / 60);
  const seconds = Math.floor((duration / 1000) % 60);
  const milliseconds = Math.floor((duration % 1000) / 100);

  return (
    String(minutes).padStart(2, "0") +
    `:${String(seconds).padStart(2, "0")}` +
    `.${String(milliseconds).padStart(1, "0")}`
  );
}

function createStateStore(reduce, initialState) {
  const listeners = [];
  let state = initialState;
  console.log(`📦 state`, state);

  return {
    get state() {
      return state;
    },
    dispatch(event) {
      console.log(`💌 event`, event);
      const previousState = state;
      state = reduce(previousState, event);
      console.log(`📦 state`, state);
      listeners.forEach((listener) => listener(state, previousState));
    },
    onUpdate(listener) {
      listeners.push(listener);
    },
  };
}

const alarm = (function createAlarmStateStore() {
  // TODO Make the reducer pure (don't access current time)
  // TODO Bring more logic to the reducer? Eg, reducer to determine when to
  //   start and stop the alarm
  // TODO Bring even more logic to the reducer? Eg, "reducer" to control the UI
  //   elements, timer, audio, ...

  function createRunningState(state, event) {
    return { ...state, name: "RUNNING", dueDate: Date.now() + event.duration };
  }

  const reducersByStateAndEvent = {
    STOPPED: {
      SET: createRunningState,
    },
    RUNNING: {
      SET: createRunningState,
      TOGGLE_PAUSE: (state) => ({
        ...state,
        name: "PAUSED",
        duration: state.dueDate - Date.now(),
      }),
      STOP: (state) => ({ ...state, name: "STOPPED" }),
      FIRE: (state) => ({ ...state, name: "FIRED" }),
    },
    PAUSED: {
      SET: createRunningState,
      TOGGLE_PAUSE: (state) => ({
        ...state,
        name: "RUNNING",
        dueDate: Date.now() + state.duration,
      }),
      STOP: (state) => ({ ...state, name: "STOPPED" }),
    },
    FIRED: {
      SET: createRunningState,
      STOP: (state) => ({ ...state, name: "STOPPED" }),
    },
  };

  function reduce(state, event) {
    const stateReducersByEvent = reducersByStateAndEvent[state.name] || {};
    const stateEventReducer = stateReducersByEvent[event.name] || (() => {});
    return stateEventReducer(state, event);
  }

  const initialState = { name: "STOPPED" };

  return createStateStore(reduce, initialState);
})();

function ifTransitionedState(callback) {
  return (state, previousState) => {
    if (state.name !== previousState.name) callback(state, previousState);
  };
}

addEventListener("DOMContentLoaded", function setupTimeLeft() {
  const el = document.querySelector("#timeRemaining");

  function update(timeLeft) {
    el.textContent = formatDuration(timeLeft);
  }

  function updateWhileRunning() {
    if (alarm.state.name === "RUNNING") {
      const timeLeft = Math.max(0, alarm.state.dueDate - Date.now());
      update(timeLeft);
      requestAnimationFrame(updateWhileRunning);
    }
  }

  alarm.onUpdate(
    ifTransitionedState((state) => {
      if (state.name === "RUNNING") updateWhileRunning();
      else if (state.name === "STOPPED") update(0);
    })
  );

  update(0);
});

(function setupTimer() {
  let timeoutId;

  alarm.onUpdate((state, previousState) => {
    if (previousState.name === "RUNNING") clearTimeout(timeoutId);

    if (state.name === "RUNNING") {
      timeoutId = setTimeout(
        () => alarm.dispatch({ name: "FIRE" }),
        state.dueDate - Date.now()
      );
    }
  });
})();

(function setupAudio() {
  alarm.onUpdate(
    ifTransitionedState((state, previousState) => {
      if (state.name === "FIRED") playAlarm();
      else if (previousState.name === "FIRED") pauseAlarm();
    })
  );
})();

addEventListener("DOMContentLoaded", function setupSetButton() {
  const setButtonEl = document.querySelector("#set");
  const setInputEl = document.querySelector("#alarmSet");

  function update() {
    setButtonEl.disabled = !setInputEl.value;
  }

  setInputEl.addEventListener("input", update);
  update();
});

addEventListener("DOMContentLoaded", function setupStopButton() {
  const el = document.querySelector("#stop");

  el.addEventListener("click", () => alarm.dispatch({ name: "STOP" }));

  function update() {
    // TODO Obtain states from the state machine?
    el.disabled = alarm.state.name === "STOPPED";
  }

  alarm.onUpdate(ifTransitionedState(update));
  update();
});

addEventListener("DOMContentLoaded", function setupPauseResumeButton() {
  const el = document.querySelector("#pauseResume");

  function update() {
    // TODO Obtain states from the state machine?
    el.disabled = !["RUNNING", "PAUSED"].includes(alarm.state.name);
    el.textContent =
      alarm.state.name === "PAUSED" ? "Resume Alarm" : "Pause Alarm";
  }

  el.addEventListener("click", () => alarm.dispatch({ name: "TOGGLE_PAUSE" }));

  alarm.onUpdate(ifTransitionedState(update));
  update();
});

function setAlarm() {
  const duration = document.querySelector("#alarmSet").value * 1000;
  alarm.dispatch({ name: "SET", duration });
}

// DO NOT EDIT BELOW HERE

var audio = new Audio("alarmsound.mp3");

function setup() {
  document.getElementById("set").addEventListener("click", () => {
    setAlarm();
  });

  document.getElementById("stop").addEventListener("click", () => {
    pauseAlarm();
  });
}

function playAlarm() {
  audio.play();
}

function pauseAlarm() {
  audio.pause();
}

window.onload = setup;

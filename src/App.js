import { useEffect, useState } from 'react';
import './App.css';

const useNow = () => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let requestChange;
    const update = () => {
      setNow(Date.now());
      requestChange = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(requestChange);
  }, []);
  return now;
};

const STATES = {
  INITIAL: 'initial',
  RUNNING: 'running',
  STOPPED: 'stopped',
};

const parseDurationToString = (duration) => {
  const hh = String(Math.floor(duration / 1000 / 60 / 60)).padStart(2, '0');
  const mm = String(Math.floor(duration / 1000 / 60) % 60).padStart(2, '0');
  const ss = String(Math.floor(duration / 1000) % 60).padStart(2, '0');
  const ms = String(Math.floor(duration % 1000)).padStart(3, '0');

  return `${hh}:${mm}:${ss}.${ms}`;
};

const StopWatchInitial = ({ onStart }) => (
  <>
    <p className="initial">Initial</p>
    <p className="clock">{`00:00:00.000`}</p>
    <div className="actions">
      <button onClick={onStart}>Start</button>
    </div>
  </>
);

const StopWatchRunning = ({ onStop, onLap, start }) => {
  const duration = useNow() - start;
  return (
    <>
      <p className="running">Running</p>
      <p className="clock">{parseDurationToString(duration)}</p>
      <div className="actions">
        <button onClick={() => onStop(duration)}>Stop</button>
        <button onClick={() => onLap(duration)}>Lap</button>
      </div>
    </>
  );
};

const StopWatchStopped = ({ onReset, onResume, duration }) => {
  return (
    <>
      <p className="stopped">Stopped</p>
      <p className="clock">{parseDurationToString(duration)}</p>
      <div className="actions">
        <button onClick={onResume}>Resume</button>
        <button onClick={onReset}>Reset</button>
      </div>
    </>
  );
};

const App = () => {
  const [appState, setAppState] = useState(STATES.INITIAL);
  const [laps, setLaps] = useState([]);
  const [start, setStart] = useState(0);
  const [stop, setStop] = useState(0);

  return (
    <div className="app">
      <div className="card">
        {appState === STATES.INITIAL && (
          <StopWatchInitial
            onStart={() => {
              setAppState(STATES.RUNNING);
              setStart(Date.now());
            }}
          />
        )}
        {appState === STATES.RUNNING && (
          <StopWatchRunning
            onStop={(duration) => {
              setStop(duration);
              setAppState(STATES.STOPPED);
            }}
            onLap={(duration) => {
              if (laps.length < 5) {
                setLaps([...laps, duration]);
              } else {
                laps.shift();
                setLaps([...laps, duration]);
              }
            }}
            start={start}
          />
        )}
        {appState === STATES.STOPPED && (
          <StopWatchStopped
            onReset={() => {
              setLaps([]);
              setAppState(STATES.INITIAL);
            }}
            onResume={() => {
              setStart(Date.now() - stop);
              setAppState(STATES.RUNNING);
            }}
            duration={stop}
          />
        )}
        <div className="laps">
          {laps
            .map((lap, index) => (
              <div className="lap" key={index}>
                <div>{index + 1}</div>
                <code>{parseDurationToString(lap)}</code>
              </div>
            ))
            .reverse()}
        </div>
      </div>
    </div>
  );
};

export default App;

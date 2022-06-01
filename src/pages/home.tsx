import { Timer } from "../components/timer";

export function Home() {
  const timeEnd = new Date(2022, 5, 1, 12, 10, 0);
  /*
  const time = new Date();
  time.setSeconds(time.getSeconds() + 3599); // 10min later
  */
  const isStarted = timeEnd.getTime() > new Date().getTime();
  return (
    <>
      {isStarted && <Timer expiryTimestamp={timeEnd} onExpire={() => {}} />}
      {/* !isStarted && <div>Not Started!</div> */}
    </>
  );
}

import { Timer } from "../components/timer";

export function Home() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 599); // 10min later
  return <Timer expiryTimestamp={time} onExpire={() => {}} />;
}

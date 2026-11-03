import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { ArrowDown, Cake, Heart, LockKeyhole, PartyPopper, Sparkles, UnlockKeyhole } from 'lucide-react';
import confetti from './confetti';
import { birthdayConfig as config } from './config';

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

const targetTime = new Date(config.unlockAt).getTime();

function getTimeLeft(now: number): TimeLeft {
  const diff = Math.max(0, targetTime - now);
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

function formatMessage(value: string) {
  return value
    .replaceAll('{name}', config.friendName)
    .replaceAll('{nickname}', config.nickname);
}

function Countdown({ time }: { time: TimeLeft }) {
  const units = [
    ['Days', time.days], ['Hours', time.hours],
    ['Minutes', time.minutes], ['Seconds', time.seconds]
  ] as const;
  return <div className="countdown" aria-label={`${time.days} days, ${time.hours} hours, ${time.minutes} minutes, ${time.seconds} seconds remaining`}>
    {units.map(([label, value]) => <div className="time-tile" key={label}>
      <span className="time-number">{String(value).padStart(2, '0')}</span>
      <span className="time-label">{label}</span>
    </div>)}
  </div>;
}

function Balloon({ className, color }: { className: string; color: string }) {
  return <div className={`balloon ${className}`} style={{ background: color }} aria-hidden="true"><span /></div>;
}

export default function App() {
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const unlocked = now >= targetTime;
  const time = useMemo(() => getTimeLeft(now), [now]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (unlocked) confetti();
  }, [unlocked]);

  const openSurprise = async () => {
    if (!unlocked || busy) return;
    if (!config.redirectEndpoint || config.redirectEndpoint.includes('YOUR-WORKER')) {
      window.alert('The birthday page is unlocked! Add your Cloudflare Worker endpoint in src/config.ts to connect the surprise link.');
      return;
    }
    setBusy(true);
    try {
      // The endpoint checks the unlock time again server-side and redirects.
      window.location.assign(config.redirectEndpoint);
    } catch {
      setBusy(false);
      window.alert('The surprise could not be opened. Please try again in a moment.');
    }
  };

  const note = formatMessage(config.birthdayNote);
  const themeStyle = {
    '--cream': config.theme.cream, '--ink': config.theme.ink, '--pink': config.theme.pink,
    '--lavender': config.theme.lavender, '--peach': config.theme.peach,
    '--yellow': config.theme.yellow, '--blue': config.theme.blue, '--accent': config.theme.accent
  } as CSSProperties;

  return <main style={themeStyle}>
    <div className="ambient ambient-one" />
    <div className="ambient ambient-two" />
    <Balloon className="balloon-one" color="#f6a9be" />
    <Balloon className="balloon-two" color="#b9a7ed" />
    <Balloon className="balloon-three" color="#ffd77b" />
    <div className="sparkle sparkle-one">✦</div><div className="sparkle sparkle-two">✧</div>
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark"><Cake size={17} /></span> a little something</a>
      <span className="top-note">made just for you <Heart size={13} fill="currentColor" /></span>
    </header>

    <section className="hero" id="top">
      <div className="eyebrow"><span className="eyebrow-dot" /> THE BIG DAY IS ALMOST HERE <span className="eyebrow-dot" /></div>
      <h1>{unlocked ? formatMessage(config.headingAfter) : config.headingBefore}</h1>
      <p className="subtitle">{formatMessage(config.subtitle)}</p>
      <p className="intro">{formatMessage(config.intro)}</p>

      <div className={`countdown-card ${unlocked ? 'is-unlocked' : ''}`}>
        <div className="card-topline"><span>THE COUNTDOWN</span><span className="tiny-sparkle">✧ ✦ ✧</span></div>
        {unlocked ? <div className="birthday-state"><PartyPopper size={27} /><span>It's your day. Let's celebrate!</span><button className="replay-confetti" onClick={confetti} type="button" aria-label="Celebrate with confetti again">Celebrate again ✨</button></div> : <Countdown time={time} />}
        <div className="target-date"><span className="date-dot" /> WEDNESDAY, 4 NOVEMBER 2026 <span className="date-dot" /></div>
      </div>

      <div className="surprise-area">
        <div className="gift-illustration" aria-hidden="true"><div className="gift-bow">♡</div><div className="gift-box"><span /></div></div>
        <button className={`surprise-button ${unlocked ? 'unlocked' : 'locked'}`} disabled={!unlocked || busy} onClick={openSurprise}>
          {unlocked ? <><UnlockKeyhole size={19} /> {busy ? 'OPENING...' : 'OPEN YOUR SURPRISE'} <span className="button-emoji">🎁</span></> : <><LockKeyhole size={19} /> YOUR SURPRISE IS LOCKED <span className="button-emoji">🔒</span></>}
        </button>
        <p className="button-caption">{unlocked ? 'The moment you have been waiting for ✨' : 'Your surprise unlocks automatically at midnight!'}</p>
      </div>

      <a className="scroll-cue" href="#birthday-note"><span>there's a little note for you</span><ArrowDown size={15} /></a>
    </section>

    <section className="note-section" id="birthday-note">
      <div className="section-kicker"><Sparkles size={14} /> A NOTE FOR YOU</div>
      <div className="letter-wrap">
        <div className="letter-decoration"><span>✿</span><span>✧</span><span>♡</span></div>
        <article className="letter">
          <div className="letter-stamp"><Heart size={20} fill="currentColor" /></div>
          <p className="letter-overline">A LITTLE LETTER</p>
          <h2>For {config.nickname},</h2>
          <p className="letter-body">{note}</p>
          <div className="letter-signoff">with love <span>♡</span></div>
        </article>
      </div>
      <p className="note-foot">P.S. You're getting older, not wiser. Keep it up. <span>♡</span></p>
    </section>

    <footer><div className="footer-heart"><Heart size={15} fill="currentColor" /></div><p>{config.footerText}</p><span>✦ ✧ ✦</span></footer>
  </main>;
}
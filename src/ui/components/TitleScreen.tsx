import { useGame } from '@/state/store';
import { audio } from '@/systems/audio/audio';

export function TitleScreen() {
  const newGame = useGame((s) => s.newGame);

  return (
    <div className="ui-interactive absolute inset-0 grid place-items-center bg-gradient-to-b from-[#0c0a12] to-[#1a1426]">
      <div className="flex max-w-lg flex-col items-center px-6 text-center">
        <div className="mb-2 text-sm tracking-[0.3em] text-arcane">MUSHOKU TENSEI</div>
        <h1 className="font-jp text-5xl font-bold text-parchment drop-shadow">
          言葉<span className="text-mana">クエスト</span>
        </h1>
        <p className="mt-1 text-lg opacity-80">Kotoba Quest</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed opacity-70">
          Reincarnated into a world of magic, you must re-learn how to read, write, and speak.
          Walk the world, talk to people, and cast spells with the words you master.
          <br />
          <span className="text-mana">Language is magic.</span>
        </p>

        <button
          onClick={() => {
            audio.init();
            audio.playMusic('town');
            newGame();
          }}
          className="mt-8 rounded-xl bg-arcane px-8 py-3 text-lg font-bold text-white shadow-lg ring-1 ring-white/20 transition hover:scale-105 hover:bg-arcane/90"
        >
          新しい冒険 · New Game
        </button>

        <p className="mt-10 max-w-sm text-[10px] leading-relaxed opacity-40">
          A non-commercial fan project. Not affiliated with or endorsed by the creators or
          publishers of Mushoku Tensei. All art is original placeholder geometry.
        </p>
      </div>
    </div>
  );
}

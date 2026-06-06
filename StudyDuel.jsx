import React, { useState, useEffect, useRef } from "react";

// ─── テーマ定義 ────────────────────────────────────
const THEMES = {
  dark:   { id:"dark",   label:"ダーク",   icon:"🌙", bg:"#0a0f1e", card:"rgba(255,255,255,0.04)", text:"#f8fafc", sub:"#94a3b8", accent:"#60A5FA" },
  light:  { id:"light",  label:"ライト",   icon:"☀️", bg:"#f1f5f9", card:"rgba(255,255,255,0.85)", text:"#0f172a", sub:"#475569", accent:"#3b82f6" },
  ocean:  { id:"ocean",  label:"オーシャン", icon:"🌊", bg:"#0c1e3a", card:"rgba(96,165,250,0.08)", text:"#e0f2fe", sub:"#7dd3fc", accent:"#06b6d4" },
  sakura: { id:"sakura", label:"さくら",   icon:"🌸", bg:"#2a0a1f", card:"rgba(244,114,182,0.08)", text:"#fce7f3", sub:"#f9a8d4", accent:"#ec4899" },
  // 🆕 4テーマ追加
  cyber:  { id:"cyber",  label:"サイバー", icon:"⚡", bg:"#050a1a", card:"rgba(168,85,247,0.08)", text:"#e9d5ff", sub:"#c4b5fd", accent:"#a855f7" },
  pastel: { id:"pastel", label:"パステル", icon:"🍭", bg:"#fdf2f8", card:"rgba(167,139,250,0.12)", text:"#581c87", sub:"#a78bfa", accent:"#c084fc" },
  mint:   { id:"mint",   label:"ミント",   icon:"🌿", bg:"#0a1f1c", card:"rgba(52,211,153,0.08)", text:"#d1fae5", sub:"#6ee7b7", accent:"#10b981" },
  sunset: { id:"sunset", label:"サンセット", icon:"🌅", bg:"#1f0a14", card:"rgba(251,146,60,0.08)", text:"#fed7aa", sub:"#fdba74", accent:"#f97316" },
};

const GENRES = [
  { id:"english", label:"英語",  icon:"📖", color:"#60A5FA", dark:"#1e3a5f" },
  { id:"math",    label:"数学",  icon:"📐", color:"#A78BFA", dark:"#2d1f5f" },
  { id:"japanese",label:"国語",  icon:"✒️", color:"#FB7185", dark:"#3f1320" },
  { id:"social",  label:"社会",  icon:"🌍", color:"#34D399", dark:"#063d22" },
  { id:"science", label:"理科",  icon:"🔬", color:"#F472B6", dark:"#3d0626" },
  { id:"history", label:"歴史",  icon:"🏛️", color:"#FBBF24", dark:"#3d2d06" },
];

// ── エンドレスモード用 問題プール（単語系） ──────────
const ENDLESS_MODES = [
  { id:"english_words", label:"英単語", icon:"english", color:"#60A5FA", desc:"英語の意味を答える" },
  { id:"kanji",         label:"漢字",   icon:"japanese", color:"#FB7185", desc:"読み方を答える" },
  { id:"yojijukugo",    label:"四字熟語", icon:"history", color:"#FBBF24", desc:"意味を答える" },
  { id:"math_calc",     label:"計算",   icon:"math",   color:"#A78BFA", desc:"暗算スピード勝負" },
  { id:"capitals",      label:"首都",   icon:"social", color:"#34D399", desc:"国の首都を答える" },
];

const ENDLESS_QUESTIONS = {
  english_words: [
    { q:"apple",   choices:["りんご","みかん","ぶどう","もも"], answer:0 },
    { q:"library", choices:["公園","図書館","学校","駅"], answer:1 },
    { q:"courage", choices:["臆病","勇気","怒り","悲しみ"], answer:1 },
    { q:"friend",  choices:["敵","友達","家族","先生"], answer:1 },
    { q:"silent",  choices:["うるさい","静か","明るい","暗い"], answer:1 },
    { q:"ancient", choices:["新しい","古代の","近代の","未来の"], answer:1 },
    { q:"rapid",   choices:["遅い","速い","重い","軽い"], answer:1 },
    { q:"gentle",  choices:["乱暴な","優しい","賢い","愚かな"], answer:1 },
    { q:"brave",   choices:["勇敢な","臆病な","賢い","怠惰な"], answer:0 },
    { q:"honest",  choices:["嘘つき","正直な","怠惰な","勤勉な"], answer:1 },
    { q:"forest",  choices:["海","森","川","山"], answer:1 },
    { q:"weather", choices:["天気","季節","時間","空間"], answer:0 },
    { q:"future",  choices:["過去","現在","未来","永遠"], answer:2 },
    { q:"create",  choices:["壊す","作る","奪う","与える"], answer:1 },
    { q:"protect", choices:["攻撃する","守る","逃げる","隠す"], answer:1 },
    { q:"language",choices:["国","言語","音楽","物語"], answer:1 },
    { q:"medicine",choices:["毒","薬","食べ物","飲み物"], answer:1 },
    { q:"journey", choices:["仕事","旅","休み","勉強"], answer:1 },
    { q:"memory",  choices:["想像","記憶","夢","計画"], answer:1 },
    { q:"silence", choices:["音","沈黙","叫び","歌"], answer:1 },
  ],
  kanji: [
    { q:"美味", choices:["うまみ","びみ","おいしい","あじ"], answer:1 },
    { q:"雰囲気", choices:["ふんいき","ふいんき","ぶいんき","ぶんいき"], answer:0 },
    { q:"曖昧", choices:["あいまい","あいみょう","あんみつ","あいぼう"], answer:0 },
    { q:"刹那", choices:["せつな","さつな","せんな","しゃつな"], answer:0 },
    { q:"憂鬱", choices:["ゆううつ","ゆうかい","うゆつ","ゆうきつ"], answer:0 },
    { q:"邂逅", choices:["かいこう","えこう","がいこう","へこう"], answer:0 },
    { q:"訃報", choices:["ふほう","とほう","じほう","おうほう"], answer:0 },
    { q:"頓挫", choices:["とんざ","とんちゃ","とんち","どんさ"], answer:0 },
    { q:"凡庸", choices:["はんよう","ぼんよう","ぼんゆう","はんゆう"], answer:1 },
    { q:"洒落", choices:["しゃれ","しゃらく","せれ","じゃれ"], answer:0 },
    { q:"逡巡", choices:["しゅんじゅん","じゅんしゅん","しんじゅん","しゅんしん"], answer:0 },
    { q:"忖度", choices:["そんたく","すんたく","しんたく","じんたく"], answer:0 },
    { q:"傀儡", choices:["かいらい","ぐかい","かいぐ","ぐらい"], answer:0 },
    { q:"驟雨", choices:["しゅうう","じゅうう","しゅうあめ","じゅうあめ"], answer:0 },
    { q:"灼熱", choices:["しゃくねつ","しょうねつ","せきねつ","じゃくねつ"], answer:0 },
    { q:"暗澹", choices:["あんたん","あんだん","あんとう","あんどう"], answer:0 },
    { q:"瑕疵", choices:["かし","がし","かじ","がじ"], answer:0 },
    { q:"鋳造", choices:["ちゅうぞう","じゅうぞう","ちゅうそう","しょうぞう"], answer:0 },
    { q:"凌駕", choices:["りょうが","しのが","しょうが","りゅうが"], answer:0 },
    { q:"煩悩", choices:["ぼんのう","はんのう","ぼんとう","はんとう"], answer:0 },
  ],
  yojijukugo: [
    { q:"一期一会",     choices:["人生一度の出会い","百回会う","一日一回","始めと終わり"], answer:0 },
    { q:"温故知新",     choices:["古き学び新しき知る","暖かい知識","旅で学ぶ","友と学ぶ"], answer:0 },
    { q:"切磋琢磨",     choices:["互いに高め合う","切ったり叩いたり","急いで磨く","美しく磨く"], answer:0 },
    { q:"臥薪嘗胆",     choices:["復讐のため苦労","眠りの薬","美味しい胆","深く眠る"], answer:0 },
    { q:"四面楚歌",     choices:["四方が敵","四つの歌","四人で歌う","南の歌"], answer:0 },
    { q:"五里霧中",     choices:["状況不明で迷う","五キロ先","深い霧","遠い場所"], answer:0 },
    { q:"我田引水",     choices:["自分有利に解釈","田に水を引く","水を独占","自分の田"], answer:0 },
    { q:"傍若無人",     choices:["人を気にせず勝手","人がいない","若い人","隣人がいない"], answer:0 },
    { q:"自業自得",     choices:["自分のせいで報い","自分で稼ぐ","自分の仕事","得意な業"], answer:0 },
    { q:"百花繚乱",     choices:["華やかに集まる","百個の花","花が乱れる","花が散る"], answer:0 },
    { q:"竜頭蛇尾",     choices:["始め良く終わり悪い","竜と蛇","頭が竜","尻尾が蛇"], answer:0 },
    { q:"画竜点睛",     choices:["最後の仕上げが肝心","竜の絵","目を描く","点を描く"], answer:0 },
    { q:"風林火山",     choices:["軍の心得四つ","四つの自然","風と林","火と山"], answer:0 },
    { q:"二束三文",     choices:["非常に安い値段","二と三","三文の本","二束の花"], answer:0 },
    { q:"朝令暮改",     choices:["命令がすぐ変わる","朝と夕","令を変える","早起き"], answer:0 },
  ],
  math_calc: [
    { q:"12 × 7",  choices:["74","84","94","104"], answer:1 },
    { q:"15 + 28", choices:["43","45","53","48"], answer:0 },
    { q:"100 ÷ 4",choices:["20","25","30","40"], answer:1 },
    { q:"9 × 8",   choices:["63","72","81","64"], answer:1 },
    { q:"56 ÷ 7", choices:["6","7","8","9"], answer:2 },
    { q:"13 × 6", choices:["68","72","78","84"], answer:2 },
    { q:"144 ÷ 12",choices:["10","11","12","13"], answer:2 },
    { q:"25 × 4", choices:["100","105","95","110"], answer:0 },
    { q:"81 ÷ 9", choices:["7","8","9","10"], answer:2 },
    { q:"17 + 18",choices:["33","34","35","36"], answer:2 },
    { q:"63 - 27",choices:["34","36","38","40"], answer:1 },
    { q:"7²",     choices:["49","56","64","42"], answer:0 },
    { q:"11²",    choices:["111","121","131","141"], answer:1 },
    { q:"6 × 9",  choices:["54","56","48","52"], answer:0 },
    { q:"96 ÷ 8", choices:["10","11","12","13"], answer:2 },
    { q:"15²",    choices:["215","225","235","255"], answer:1 },
    { q:"√81",    choices:["7","8","9","11"], answer:2 },
    { q:"24 × 5", choices:["100","110","120","130"], answer:2 },
    { q:"99 + 99",choices:["188","198","208","218"], answer:1 },
    { q:"7 × 13", choices:["81","91","101","87"], answer:1 },
  ],
  capitals: [
    { q:"アメリカ",   choices:["NY","ワシントンDC","LA","シカゴ"], answer:1 },
    { q:"イギリス",   choices:["ロンドン","パリ","ベルリン","ローマ"], answer:0 },
    { q:"フランス",   choices:["ローマ","パリ","マドリード","ベルリン"], answer:1 },
    { q:"ドイツ",     choices:["ベルリン","ミュンヘン","ハンブルク","ボン"], answer:0 },
    { q:"中国",       choices:["上海","北京","香港","広州"], answer:1 },
    { q:"韓国",       choices:["釜山","ソウル","仁川","大邱"], answer:1 },
    { q:"オーストラリア",choices:["シドニー","メルボルン","キャンベラ","パース"], answer:2 },
    { q:"カナダ",     choices:["トロント","モントリオール","オタワ","バンクーバー"], answer:2 },
    { q:"ブラジル",   choices:["サンパウロ","リオ","ブラジリア","サルバドル"], answer:2 },
    { q:"インド",     choices:["ムンバイ","デリー","ニューデリー","コルカタ"], answer:2 },
    { q:"エジプト",   choices:["カイロ","アレクサンドリア","ギザ","ルクソール"], answer:0 },
    { q:"トルコ",     choices:["イスタンブール","アンカラ","イズミル","ブルサ"], answer:1 },
    { q:"スペイン",   choices:["バルセロナ","マドリード","セビリア","バレンシア"], answer:1 },
    { q:"イタリア",   choices:["ミラノ","ローマ","ナポリ","フィレンツェ"], answer:1 },
    { q:"ロシア",     choices:["サンクトペテルブルク","モスクワ","ノヴゴロド","カザン"], answer:1 },
    { q:"南アフリカ", choices:["ヨハネスブルク","ケープタウン","プレトリア","ダーバン"], answer:2 },
    { q:"アルゼンチン",choices:["ブエノスアイレス","コルドバ","ロサリオ","メンドーサ"], answer:0 },
    { q:"タイ",       choices:["バンコク","チェンマイ","プーケット","パタヤ"], answer:0 },
    { q:"ベトナム",   choices:["ホーチミン","ハノイ","ダナン","フエ"], answer:1 },
    { q:"オランダ",   choices:["アムステルダム","ロッテルダム","ハーグ","ユトレヒト"], answer:0 },
  ],
};

// ─── 効果音システム（Web Audio API） ──────────────
let audioCtx = null;
function getAudioCtx() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) { return null; }
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTone({ freq=440, dur=0.1, type="sine", vol=0.15, freqEnd=null, delay=0 }) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd !== null) osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
  const finalVol = vol * (typeof window !== "undefined" && window.__STUDYUM_VOL !== undefined ? window.__STUDYUM_VOL : 1);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(finalVol, t0 + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

// ─── 触覚フィードバック（モバイル端末でバイブ） ──────
const HAPTIC = {
  _supported() {
    return typeof window !== "undefined" && typeof window.navigator !== "undefined" && typeof window.navigator.vibrate === "function";
  },
  _enabled() {
    if (typeof window === "undefined") return false;
    return !window.__STUDYUM_HAPTIC_OFF;
  },
  light()    { if (this._supported() && this._enabled()) try { window.navigator.vibrate(10); } catch(e){} },
  medium()   { if (this._supported() && this._enabled()) try { window.navigator.vibrate(20); } catch(e){} },
  heavy()    { if (this._supported() && this._enabled()) try { window.navigator.vibrate(40); } catch(e){} },
  success()  { if (this._supported() && this._enabled()) try { window.navigator.vibrate([10, 30, 20]); } catch(e){} },
  error()    { if (this._supported() && this._enabled()) try { window.navigator.vibrate([20, 50, 20, 50]); } catch(e){} },
  critical() { if (this._supported() && this._enabled()) try { window.navigator.vibrate([30, 30, 60]); } catch(e){} },
};

const SFX = {
  tap:      () => { playTone({ freq:800, freqEnd:1200, dur:0.06, type:"sine", vol:0.1 }); HAPTIC.light(); },
  select:   () => { playTone({ freq:600, freqEnd:900, dur:0.08, type:"square", vol:0.08 }); HAPTIC.light(); },
  back:     () => { playTone({ freq:600, freqEnd:300, dur:0.1, type:"sine", vol:0.1 }); HAPTIC.light(); },
  correct:  () => {
    playTone({ freq:880, dur:0.06, type:"sine", vol:0.05 });
    playTone({ freq:1320, dur:0.08, type:"sine", vol:0.05, delay:0.05 });
    HAPTIC.success();
  },
  wrong:    () => { playTone({ freq:260, freqEnd:200, dur:0.12, type:"triangle", vol:0.05 }); HAPTIC.error(); },
  start:    () => {
    playTone({ freq:400, dur:0.08, type:"square", vol:0.12 });
    playTone({ freq:600, dur:0.08, type:"square", vol:0.12, delay:0.08 });
    playTone({ freq:800, dur:0.15, type:"square", vol:0.12, delay:0.16 });
    HAPTIC.medium();
  },
  levelUp:  () => {
    playTone({ freq:500, dur:0.1, type:"square", vol:0.12 });
    playTone({ freq:700, dur:0.1, type:"square", vol:0.12, delay:0.1 });
    playTone({ freq:900, dur:0.1, type:"square", vol:0.12, delay:0.2 });
    playTone({ freq:1300, dur:0.25, type:"square", vol:0.12, delay:0.3 });
    HAPTIC.critical();
  },
  coin:     () => {
    playTone({ freq:1000, dur:0.05, type:"square", vol:0.1 });
    playTone({ freq:1400, dur:0.12, type:"square", vol:0.1, delay:0.04 });
    HAPTIC.light();
  },
  victory:  () => {
    playTone({ freq:500, dur:0.12, type:"square", vol:0.12 });
    playTone({ freq:600, dur:0.12, type:"square", vol:0.12, delay:0.12 });
    playTone({ freq:700, dur:0.12, type:"square", vol:0.12, delay:0.24 });
    playTone({ freq:900, dur:0.12, type:"square", vol:0.12, delay:0.36 });
    playTone({ freq:1200, dur:0.4, type:"square", vol:0.14, delay:0.48 });
    HAPTIC.heavy();
  },
  defeat:   () => {
    playTone({ freq:500, freqEnd:200, dur:0.3, type:"sawtooth", vol:0.1 });
    playTone({ freq:400, freqEnd:150, dur:0.4, type:"sawtooth", vol:0.1, delay:0.2 });
  },
  hit:      () => playTone({ freq:200, freqEnd:80, dur:0.1, type:"square", vol:0.12 }),
  open:     () => playTone({ freq:600, freqEnd:1000, dur:0.15, type:"sine", vol:0.1 }),
  claim:    () => {
    playTone({ freq:800, dur:0.08, type:"square", vol:0.12 });
    playTone({ freq:1200, dur:0.08, type:"square", vol:0.12, delay:0.08 });
    playTone({ freq:1600, dur:0.18, type:"square", vol:0.12, delay:0.16 });
  },
};

// ─── BGMシステム（軽量シンセBGM） ─────────────────────
const BGM = {
  current: null, // 現在再生中のID
  intervalIds: [], // setIntervalハンドル
  audioCtx: null,
  vol: 0.05, // 控えめ
  
  // メロディ定義（簡略化されたパターン）
  patterns: {
    home: {
      // ホーム: のんびり明るい
      tempo: 480, // ms/beat
      notes: [
        [523, 0.4], [659, 0.4], [784, 0.4], [659, 0.4], 
        [523, 0.4], [659, 0.4], [784, 0.8],
        [880, 0.4], [784, 0.4], [659, 0.4], [523, 0.4],
        [587, 0.4], [659, 0.4], [523, 0.8],
      ],
      bassNotes: [
        [131, 1.6], [165, 1.6], [196, 1.6], [131, 1.6],
      ],
      wave: "sine",
    },
    battle: {
      // バトル: 緊迫感
      tempo: 280,
      notes: [
        [392, 0.3], [466, 0.3], [523, 0.3], [466, 0.3],
        [392, 0.3], [466, 0.3], [587, 0.6],
        [523, 0.3], [466, 0.3], [392, 0.3], [349, 0.3],
        [392, 0.6], [466, 0.6],
      ],
      bassNotes: [
        [98, 1.2], [123, 1.2], [147, 1.2], [98, 1.2],
      ],
      wave: "square",
    },
    result: {
      // 結果: ファンファーレ的
      tempo: 400,
      notes: [
        [523, 0.3], [659, 0.3], [784, 0.3], [1047, 0.6],
        [784, 0.3], [1047, 0.6],
      ],
      bassNotes: [
        [131, 1.2], [196, 1.2],
      ],
      wave: "triangle",
    },
  },

  _getCtx() {
    if (typeof window === "undefined") return null;
    if (window.__STUDYUM_MUTED) return null;
    if (!this.audioCtx) {
      try {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { return null; }
    }
    return this.audioCtx;
  },

  _playNote(freq, dur, wave, gainMul = 1) {
    const ctx = this._getCtx();
    if (!ctx) return;
    const volSetting = (window.__STUDYUM_VOL ?? 0.6);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = wave;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(this.vol * volSetting * gainMul, ctx.currentTime + 0.02);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur + 0.05);
  },

  play(id) {
    if (this.current === id) return; // 既に再生中
    this.stop();
    if (window.__STUDYUM_MUTED || window.__STUDYUM_BGM_OFF) return;
    const pattern = this.patterns[id];
    if (!pattern) return;
    this.current = id;

    // メロディーをループ
    let melodyIdx = 0;
    const playMelody = () => {
      if (this.current !== id) return;
      const [freq, dur] = pattern.notes[melodyIdx];
      this._playNote(freq, dur * 0.9, pattern.wave, 1);
      melodyIdx = (melodyIdx + 1) % pattern.notes.length;
    };
    const melodyInterval = setInterval(playMelody, pattern.tempo);
    this.intervalIds.push(melodyInterval);
    playMelody(); // 即座開始

    // ベースライン
    let bassIdx = 0;
    const playBass = () => {
      if (this.current !== id) return;
      const [freq, dur] = pattern.bassNotes[bassIdx];
      this._playNote(freq, dur * 0.95, "sine", 0.7);
      bassIdx = (bassIdx + 1) % pattern.bassNotes.length;
    };
    const bassInterval = setInterval(playBass, pattern.tempo * 4);
    this.intervalIds.push(bassInterval);
    playBass();
  },

  stop() {
    this.current = null;
    this.intervalIds.forEach(id => clearInterval(id));
    this.intervalIds = [];
  },
};

// ─── ショップアイテム（装飾品＆肩書き） ───────────
const SHOP_ITEMS = [
  // === 帽子（追加で6個増えて22個） ===
  { id:"hat_crown",     type:"hat",    name:"王冠",         icon:"👑", price:300, desc:"威厳ある王の証" },
  { id:"hat_party",     type:"hat",    name:"パーティ帽",   icon:"🎉", price:120, desc:"いつでもお祝い気分" },
  { id:"hat_witch",     type:"hat",    name:"魔女帽",       icon:"🧙", price:200, desc:"神秘の力を授かる" },
  { id:"hat_tophat",    type:"hat",    name:"シルクハット", icon:"🎩", price:250, desc:"紳士の嗜み" },
  { id:"hat_cap",       type:"hat",    name:"野球帽",       icon:"🧢", price:80,  desc:"カジュアルに" },
  { id:"hat_grad",      type:"hat",    name:"学士帽",       icon:"🎓", price:180, desc:"知の象徴" },
  { id:"hat_santa",     type:"hat",    name:"サンタ帽",     icon:"🎅", price:200, desc:"クリスマス気分" },
  { id:"hat_pumpkin",   type:"hat",    name:"カボチャ帽",   icon:"🎃", price:180, desc:"ハロウィン仕様" },
  { id:"hat_helmet",    type:"hat",    name:"勇者の兜",     icon:"⛑️", price:280, desc:"戦士の魂" },
  { id:"hat_cherry",    type:"hat",    name:"桜の冠",       icon:"🌸", price:260, desc:"春の優雅さ" },
  { id:"hat_horns",     type:"hat",    name:"魔王の角",     icon:"😈", price:500, desc:"闇の支配者" },
  { id:"hat_halo",      type:"hat",    name:"天使の輪",     icon:"😇", price:500, desc:"聖なる光" },
  { id:"hat_pirate",    type:"hat",    name:"海賊帽",       icon:"🏴‍☠️", price:220, desc:"七つの海を制す" },
  { id:"hat_chef",      type:"hat",    name:"シェフ帽",     icon:"👨‍🍳", price:150, desc:"料理の達人" },
  { id:"hat_ninja",     type:"hat",    name:"忍びの頭巾",   icon:"🥷", price:240, desc:"音もなく学ぶ" },
  { id:"hat_unicorn",   type:"hat",    name:"ユニコーン角", icon:"🦄", price:600, desc:"幻獣の祝福" },
  // 🆕 帽子追加6個
  { id:"hat_detective", type:"hat",    name:"探偵帽",       icon:"🕵️", price:280, desc:"真実を見抜く" },
  { id:"hat_sun",       type:"hat",    name:"麦わら帽",     icon:"🌾", price:140, desc:"夏休みの気分" },
  { id:"hat_mortarboard",type:"hat",   name:"博士帽",       icon:"📔", price:450, desc:"博識の証" },
  { id:"hat_robot",     type:"hat",    name:"ロボット頭",   icon:"🤖", price:550, desc:"未来からの来訪者" },
  { id:"hat_starcrown", type:"hat",    name:"星の冠",       icon:"⭐", price:700, desc:"夜空の主役" },
  { id:"hat_dragonking",type:"hat",    name:"龍王の冠",     icon:"🐲", price:1200,desc:"伝説の王" },

  // === オーラ（追加で6個増えて20個） ===
  { id:"aura_fire",     type:"aura",   name:"炎のオーラ",   icon:"🔥", price:200, desc:"燃え盛る情熱" },
  { id:"aura_water",    type:"aura",   name:"水のオーラ",   icon:"💧", price:200, desc:"清らかな水" },
  { id:"aura_light",    type:"aura",   name:"光のオーラ",   icon:"✨", price:250, desc:"煌めく星屑" },
  { id:"aura_dark",     type:"aura",   name:"闇のオーラ",   icon:"🌑", price:250, desc:"深淵の力" },
  { id:"aura_thunder",  type:"aura",   name:"雷のオーラ",   icon:"⚡", price:300, desc:"閃光の輝き" },
  { id:"aura_wind",     type:"aura",   name:"風のオーラ",   icon:"🌪️", price:200, desc:"そよ風の如く" },
  { id:"aura_ice",      type:"aura",   name:"氷のオーラ",   icon:"❄️", price:220, desc:"凍てつく静寂" },
  { id:"aura_leaf",     type:"aura",   name:"森のオーラ",   icon:"🍃", price:180, desc:"自然の癒し" },
  { id:"aura_rainbow",  type:"aura",   name:"虹のオーラ",   icon:"🌈", price:450, desc:"七色の祝福" },
  { id:"aura_star",     type:"aura",   name:"星空のオーラ", icon:"🌟", price:400, desc:"宇宙の神秘" },
  { id:"aura_heart",    type:"aura",   name:"愛のオーラ",   icon:"💖", price:350, desc:"温かな想い" },
  { id:"aura_sakura",   type:"aura",   name:"桜のオーラ",   icon:"🌸", price:320, desc:"春の風情" },
  { id:"aura_galaxy",   type:"aura",   name:"銀河のオーラ", icon:"🌌", price:700, desc:"無限の彼方" },
  { id:"aura_dragon",   type:"aura",   name:"龍のオーラ",   icon:"🐉", price:800, desc:"古龍の波動" },
  // 🆕 オーラ追加6個
  { id:"aura_butterfly",type:"aura",   name:"蝶のオーラ",   icon:"🦋", price:280, desc:"優雅な舞" },
  { id:"aura_phoenix",  type:"aura",   name:"不死鳥のオーラ",icon:"🔥",price:850, desc:"蘇る魂の炎" },
  { id:"aura_aurora",   type:"aura",   name:"オーロラ",     icon:"🌠", price:550, desc:"極北の幻想" },
  { id:"aura_diamond",  type:"aura",   name:"宝石のオーラ", icon:"💎", price:650, desc:"輝く宝石" },
  { id:"aura_neon",     type:"aura",   name:"ネオン",       icon:"💫", price:350, desc:"サイバー風" },
  { id:"aura_blackhole",type:"aura",   name:"ブラックホール",icon:"🕳️",price:1500,desc:"宇宙の謎" },

  // === 肩書き（追加で6個増えて18個） ===
  { id:"title_master",  type:"title",  name:"勉強の達人",   icon:"📚", price:500, desc:"知識を極めし者" },
  { id:"title_hero",    type:"title",  name:"知識の勇者",   icon:"⚔️", price:400, desc:"学問の戦士" },
  { id:"title_genius",  type:"title",  name:"天才",         icon:"🧠", price:600, desc:"圧倒的な頭脳" },
  { id:"title_chaos",   type:"title",  name:"混沌の支配者", icon:"🔮", price:800, desc:"伝説の称号" },
  { id:"title_dragon",  type:"title",  name:"竜の守護者",   icon:"🐲", price:700, desc:"古の力を継ぐ" },
  { id:"title_star",    type:"title",  name:"星の旅人",     icon:"🌟", price:450, desc:"夜空を駆ける" },
  { id:"title_scholar", type:"title",  name:"探求者",       icon:"🔍", price:350, desc:"真理を追う者" },
  { id:"title_sage",    type:"title",  name:"賢者",         icon:"🧙‍♂️", price:550, desc:"全てを見抜く" },
  { id:"title_ninja",   type:"title",  name:"忍び",         icon:"🥷", price:450, desc:"音なき学習者" },
  { id:"title_phoenix", type:"title",  name:"不死鳥",       icon:"🔥", price:650, desc:"何度でも蘇る" },
  { id:"title_ancient", type:"title",  name:"古代の賢人",   icon:"📜", price:700, desc:"時を超えた知恵" },
  { id:"title_supreme", type:"title",  name:"覇王",         icon:"👑", price:1000,desc:"頂点に立つ者" },
  // 🆕 肩書き追加6個
  { id:"title_alchemist",type:"title", name:"錬金術師",     icon:"⚗️", price:600, desc:"知識を金に変える" },
  { id:"title_oracle",  type:"title",  name:"預言者",       icon:"🔮", price:750, desc:"未来を見通す" },
  { id:"title_emperor", type:"title",  name:"皇帝",         icon:"🏛️", price:1200,desc:"頂点を超えた存在" },
  { id:"title_void",    type:"title",  name:"虚無の使徒",   icon:"🌑", price:900, desc:"全てを知る者" },
  { id:"title_celestial",type:"title", name:"天界の使者",   icon:"😇", price:850, desc:"神々の代弁者" },
  { id:"title_omniscient",type:"title",name:"全知者",       icon:"🌌", price:2000,desc:"最高の称号" },
];

// コインの獲得量設定
// ── ログインボーナス（7日サイクル） ───────────────
const LOGIN_BONUSES = [
  { day:1, reward:20,  icon:"🪙" },
  { day:2, reward:30,  icon:"🪙" },
  { day:3, reward:50,  icon:"💰" },
  { day:4, reward:80,  icon:"💰" },
  { day:5, reward:100, icon:"💎" },
  { day:6, reward:150, icon:"💎" },
  { day:7, reward:300, icon:"👑" }, // ジャックポット
];

const COIN_REWARDS = {
  correct:    5,    // 正解1問
  perfect:    50,   // 全問正解ボーナス
  win:        30,   // バトル1位
  rankedWin:  50,   // ランクマッチ1位
  bossKill:   100,  // ボス撃破
};

// ─── トロフィー・業績システム ─────────────────────
const TROPHIES = [
  // === 既存16個 ===
  { id:"first_win",     icon:"🥉", title:"初勝利",       desc:"バトルで初めて1位を取る",   check: (s) => (s.wins||0) >= 1,    rare:"common" },
  { id:"win10",         icon:"🥈", title:"10勝達成",     desc:"バトルで10回勝利",           check: (s) => (s.wins||0) >= 10,   rare:"common" },
  { id:"win50",         icon:"🥇", title:"50勝達成",     desc:"バトルで50回勝利",           check: (s) => (s.wins||0) >= 50,   rare:"rare" },
  { id:"win100",        icon:"👑", title:"100連勝の覇者",desc:"バトル累計100勝",            check: (s) => (s.wins||0) >= 100,  rare:"legend" },
  { id:"streak5",       icon:"🔥", title:"5問連続正解",  desc:"連続正解5問",                check: (s) => (s.streak||0) >= 5, rare:"common" },
  { id:"streak10",      icon:"💥", title:"10問連続正解", desc:"連続正解10問",               check: (s) => (s.streak||0) >= 10, rare:"rare" },
  { id:"perfect5",      icon:"💎", title:"全問正解マスター", desc:"全問正解を5回達成",       check: (s) => (s.perfects||0) >= 5, rare:"rare" },
  { id:"correct100",    icon:"📚", title:"100問の壁突破",desc:"通算100問正解",              check: (s) => (s.correct||0) >= 100, rare:"common" },
  { id:"correct500",    icon:"🎓", title:"知識の達人",   desc:"通算500問正解",              check: (s) => (s.correct||0) >= 500, rare:"rare" },
  { id:"all_subjects",  icon:"🌈", title:"全教科マスター",desc:"6教科全てで20問以上正解",   check: (s) => ["english","math","japanese","social","science","history"].every(g => (s["correct_"+g]||0) >= 20), rare:"legend" },
  { id:"pet5",          icon:"🥚", title:"ペットコレクター", desc:"5種類のペットを発見",   check: (s) => (s.petsUnlocked||0) >= 5, rare:"common" },
  { id:"pet18",         icon:"🏆", title:"図鑑完全制覇", desc:"全18種のペットを発見",       check: (s) => (s.petsUnlocked||0) >= 18, rare:"legend" },
  { id:"silver",        icon:"🥈", title:"シルバー到達",  desc:"シルバーランクに到達",      check: (s) => (s.maxRating||0) >= 1000, rare:"common" },
  { id:"gold",          icon:"🥇", title:"ゴールド到達",  desc:"ゴールドランクに到達",      check: (s) => (s.maxRating||0) >= 1500, rare:"rare" },
  { id:"diamond",       icon:"💎", title:"ダイヤ到達",    desc:"ダイヤランクに到達",        check: (s) => (s.maxRating||0) >= 2500, rare:"legend" },
  { id:"rich",          icon:"💰", title:"小金持ち",     desc:"コイン1000枚貯める",         check: (s) => (s.maxCoins||0) >= 1000, rare:"common" },
  { id:"tycoon",        icon:"🏦", title:"大富豪",       desc:"コイン5000枚貯める",         check: (s) => (s.maxCoins||0) >= 5000, rare:"rare" },
  
  // === 新規追加20個 ===
  // 🆕 連続日数系
  { id:"login3",         icon:"📅", title:"3日坊主突破",   desc:"3日連続ログイン",            check: (s) => (s.loginStreak||0) >= 3, rare:"common" },
  { id:"login7",         icon:"🗓️", title:"1週間継続",     desc:"7日連続ログイン",            check: (s) => (s.loginStreak||0) >= 7, rare:"common" },
  { id:"login30",        icon:"💯", title:"1ヶ月マスター", desc:"30日連続ログイン",           check: (s) => (s.loginStreak||0) >= 30, rare:"rare" },
  { id:"login100",       icon:"🏛️", title:"100日継続の伝説",desc:"100日連続ログイン",         check: (s) => (s.loginStreak||0) >= 100, rare:"legend" },
  
  // 🆕 連続正解系
  { id:"streak20",       icon:"⚡", title:"連続正解20問",  desc:"連続正解20問",               check: (s) => (s.streak||0) >= 20, rare:"legend" },
  { id:"streak50",       icon:"☄️", title:"連続正解50問",  desc:"連続正解50問の伝説",         check: (s) => (s.streak||0) >= 50, rare:"legend" },
  
  // 🆕 問題数系
  { id:"correct1000",    icon:"🎖️", title:"千の知識",      desc:"通算1000問正解",             check: (s) => (s.correct||0) >= 1000, rare:"legend" },
  { id:"answered500",    icon:"📖", title:"勉強の鬼",      desc:"通算500問挑戦",              check: (s) => (s.total||0) >= 500, rare:"rare" },
  
  // 🆕 教科別マスター
  { id:"english_lover",  icon:"📘", title:"英語の達人",    desc:"英語で100問正解",            check: (s) => (s.correct_english||0) >= 100, rare:"rare" },
  { id:"math_lover",     icon:"📐", title:"数学の達人",    desc:"数学で100問正解",            check: (s) => (s.correct_math||0) >= 100, rare:"rare" },
  { id:"japanese_lover", icon:"📜", title:"国語の達人",    desc:"国語で100問正解",            check: (s) => (s.correct_japanese||0) >= 100, rare:"rare" },
  
  // 🆕 ガチャ系
  { id:"gacha1",         icon:"🎰", title:"初ガチャ",      desc:"初めてガチャを引く",         check: (s) => (s.gachaPulls||0) >= 1, rare:"common" },
  { id:"gacha10",        icon:"🎁", title:"ガチャ常連",    desc:"ガチャを10回引く",           check: (s) => (s.gachaPulls||0) >= 10, rare:"common" },
  { id:"gacha50",        icon:"🎴", title:"運命を呼ぶ者",  desc:"ガチャを50回引く",           check: (s) => (s.gachaPulls||0) >= 50, rare:"rare" },
  { id:"legend_pull",    icon:"🌟", title:"レジェンド降臨",desc:"レジェンドアイテムを獲得",   check: (s) => (s.legendItems||0) >= 1, rare:"legend" },
  
  // 🆕 ボス系
  { id:"boss1",          icon:"🐉", title:"ボスキラー",    desc:"ワールドボスを撃破",         check: (s) => (s.bossKills||0) >= 1, rare:"rare" },
  { id:"boss5",          icon:"🐲", title:"ボスハンター",  desc:"ワールドボス5体撃破",        check: (s) => (s.bossKills||0) >= 5, rare:"legend" },
  
  // 🆕 ブックマーク・暗記カード系
  { id:"bookmark10",     icon:"⭐", title:"記録の達人",    desc:"ブックマーク10問保存",       check: (s) => (s.bookmarks||0) >= 10, rare:"common" },
  { id:"flashcard50",    icon:"🃏", title:"暗記マスター",  desc:"暗記カードで50問達成",       check: (s) => (s.flashcards||0) >= 50, rare:"rare" },
  
  // 🆕 ペット育成系
  { id:"petName",        icon:"💞", title:"名付け親",      desc:"ペットに名前をつける",       check: (s) => (s.hasPetName||false), rare:"common" },

  // === さらに追加20個 ===
  // 🆕 教科マスター系（残り3教科）
  { id:"social_lover",   icon:"🌍", title:"社会の達人",    desc:"社会で100問正解",            check: (s) => (s.correct_social||0) >= 100, rare:"rare" },
  { id:"science_lover",  icon:"🔬", title:"理科の達人",    desc:"理科で100問正解",            check: (s) => (s.correct_science||0) >= 100, rare:"rare" },
  { id:"history_lover",  icon:"🏛️", title:"歴史の達人",    desc:"歴史で100問正解",            check: (s) => (s.correct_history||0) >= 100, rare:"rare" },
  
  // 🆕 完璧主義系
  { id:"perfect1",       icon:"⭐", title:"パーフェクト初達成",desc:"全問正解を1回達成",       check: (s) => (s.perfects||0) >= 1, rare:"common" },
  { id:"perfect20",      icon:"🌟", title:"完璧の伝道者",  desc:"全問正解を20回達成",         check: (s) => (s.perfects||0) >= 20, rare:"legend" },
  
  // 🆕 スピード系
  { id:"speedy",         icon:"⚡", title:"スピード王",    desc:"5秒以内に5問正解",           check: (s) => (s.fastAnswers||0) >= 5, rare:"rare" },
  { id:"taScore50",      icon:"🏃", title:"タイムアタッカー",desc:"タイムアタックで50問達成",  check: (s) => (s.taBest50||false), rare:"rare" },
  
  // 🆕 学習継続系
  { id:"earlyBird",      icon:"🌅", title:"早起き学習者",  desc:"朝6時前に勉強する",          check: (s) => (s.earlyMorning||false), rare:"common" },
  { id:"nightOwl",       icon:"🦉", title:"夜更かしの学者",desc:"23時以降に勉強する",         check: (s) => (s.lateNight||false), rare:"common" },
  { id:"weekendWarrior", icon:"📆", title:"週末戦士",      desc:"土日に100問挑戦",            check: (s) => (s.weekendQs||0) >= 100, rare:"rare" },
  
  // 🆕 友達・ソーシャル系
  { id:"friend1",        icon:"🤝", title:"友達はじめて",  desc:"フレンドコードで友達を追加",  check: (s) => (s.friends||0) >= 1, rare:"common" },
  { id:"friend5",        icon:"👥", title:"仲間の輪",      desc:"5人の友達を追加",            check: (s) => (s.friends||0) >= 5, rare:"rare" },
  
  // 🆕 ペット系
  { id:"petFed",         icon:"🍖", title:"愛情たっぷり",  desc:"ペットに餌を10回あげる",     check: (s) => (s.petFedTotal||0) >= 10, rare:"common" },
  { id:"petHappy",       icon:"🥰", title:"ペット愛好家",  desc:"ペットを100回満腹にする",    check: (s) => (s.petFedTotal||0) >= 100, rare:"rare" },
  { id:"petEvolve",      icon:"🦋", title:"進化の証人",    desc:"ペットを最終形態に進化させる",check: (s) => (s.petEvolved||false), rare:"legend" },
  
  // 🆕 リスニング・スピーキング系
  { id:"listening30",    icon:"🎧", title:"リスニングの匠",desc:"リスニング30問正解",         check: (s) => (s.listening||0) >= 30, rare:"rare" },
  { id:"speaking30",     icon:"🎤", title:"スピーキングの達人",desc:"スピーキング30問正解",   check: (s) => (s.speaking||0) >= 30, rare:"rare" },
  
  // 🆕 称号・コレクション系
  { id:"title5",         icon:"🏷️", title:"称号コレクター",desc:"5個の称号を獲得",            check: (s) => (s.titles||0) >= 5, rare:"rare" },
  { id:"title15",        icon:"👑", title:"称号マスター",  desc:"15個の称号を獲得",           check: (s) => (s.titles||0) >= 15, rare:"legend" },
  
  // 🆕 究極の達成
  { id:"ultimate",       icon:"🌠", title:"完璧なる学者",  desc:"全教科でレベル20到達",       check: (s) => ["english","math","japanese","social","science","history"].every(g => (s["xp_"+g]||0) >= 2000), rare:"legend" },
];

const RARITY_COLORS = {
  common: "#94a3b8",
  rare:   "#60A5FA",
  legend: "#FBBF24",
};

// 季節イベント定義
const SEASONS = {
  spring: { id:"spring", label:"春の桜", icon:"🌸", color:"#F472B6", months:[3,4], gradient:"linear-gradient(135deg, #2d1b3a 0%, #4a2848 100%)", particle:"🌸", coinBonus:1.2 },
  summer: { id:"summer", label:"夏のひかり", icon:"🌻", color:"#FBBF24", months:[6,7,8], gradient:"linear-gradient(135deg, #1e2a3a 0%, #2d3f5a 100%)", particle:"☀️", coinBonus:1.2 },
  autumn: { id:"autumn", label:"秋の紅葉", icon:"🍁", color:"#FB923C", months:[10,11], gradient:"linear-gradient(135deg, #2d1f15 0%, #4a2f1a 100%)", particle:"🍁", coinBonus:1.2 },
  winter: { id:"winter", label:"冬の雪", icon:"❄️", color:"#60A5FA", months:[12,1,2], gradient:"linear-gradient(135deg, #0f1d3a 0%, #1a2f5a 100%)", particle:"❄️", coinBonus:1.2 },
  christmas: { id:"christmas", label:"クリスマス", icon:"🎄", color:"#EF4444", months:[12], days:[20,21,22,23,24,25,26], gradient:"linear-gradient(135deg, #1a0f0f 0%, #3a1a1a 100%)", particle:"🎁", coinBonus:1.5 },
  newyear:   { id:"newyear",   label:"お正月",     icon:"🎍", color:"#FBBF24", months:[1],  days:[1,2,3,4,5,6,7], gradient:"linear-gradient(135deg, #2d1f1a 0%, #4a3225 100%)", particle:"🎍", coinBonus:1.5 },
};

function getCurrentSeason() {
  const d = new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  // 特別期間優先
  if (m === 12 && day >= 20 && day <= 26) return SEASONS.christmas;
  if (m === 1 && day <= 7) return SEASONS.newyear;
  // 通常季節
  if ([3, 4].includes(m)) return SEASONS.spring;
  if ([6, 7, 8].includes(m)) return SEASONS.summer;
  if ([10, 11].includes(m)) return SEASONS.autumn;
  if ([12, 1, 2].includes(m)) return SEASONS.winter;
  return null;
}

// ─── イベントクエスト（期間限定チャレンジ） ────────
// 月ごとに変わる特別チャレンジ
const EVENT_QUESTS = [
  // 春（3-4月）
  { id:"spring_100", months:[3,4], icon:"🌸", title:"桜の100問チャレンジ", desc:"期間中に100問正解で500💰", target:100, type:"correct", reward:500, color:"#F472B6" },
  // 夏（6-8月）
  { id:"summer_streak", months:[6,7,8], icon:"☀️", title:"夏休み連続正解50", desc:"連続50問正解を達成", target:50, type:"streak", reward:600, color:"#FBBF24" },
  // 秋（10-11月）
  { id:"autumn_subjects", months:[10,11], icon:"🍁", title:"全教科秋の陣", desc:"全6教科でバトル勝利", target:6, type:"all_genres_win", reward:700, color:"#FB923C" },
  // 冬（12月後半・1月初・2月）
  { id:"winter_battles", months:[12,1,2], icon:"❄️", title:"冬の30バトル", desc:"バトルに30回参加", target:30, type:"battles", reward:550, color:"#60A5FA" },
  // クリスマス（12/20-26）
  { id:"xmas_gacha", months:[12], days:[20,21,22,23,24,25,26], icon:"🎄", title:"クリスマスガチャ祭", desc:"ガチャを10回引く", target:10, type:"gacha", reward:800, color:"#EF4444" },
  // お正月（1/1-7）
  { id:"newyear_quests", months:[1], days:[1,2,3,4,5,6,7], icon:"🎍", title:"お正月の七福問", desc:"7日連続でログイン", target:7, type:"login", reward:1000, color:"#FBBF24" },
  // 5月（こどもの日）
  { id:"may_perfect", months:[5], icon:"🎏", title:"5月のパーフェクト", desc:"全問正解を5回達成", target:5, type:"perfects", reward:600, color:"#06B6D4" },
  // 9月（学園祭）
  { id:"sept_bookmark", months:[9], icon:"📚", title:"秋の知の蓄積", desc:"問題を30個ブックマーク", target:30, type:"bookmark", reward:500, color:"#A78BFA" },
];

// 現在月のイベントを取得
function getCurrentEvent() {
  const d = new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  // 期間限定（日付付き）を優先
  for (const ev of EVENT_QUESTS) {
    if (ev.months.includes(m) && ev.days && ev.days.includes(day)) return ev;
  }
  // 月のみ
  for (const ev of EVENT_QUESTS) {
    if (ev.months.includes(m) && !ev.days) return ev;
  }
  return null;
}


const DAILY_MISSIONS_POOL = [
  { id:"battle3",    iconName:"sword",    title:"バトルに3回参加",     target:3,  reward:50,  track:"battles" },
  { id:"win1",       iconName:"trophy",   title:"バトルで1位を取る",   target:1,  reward:80,  track:"wins" },
  { id:"correct10",  iconName:"check",    title:"正解を10問する",       target:10, reward:60,  track:"correct" },
  { id:"perfect",    iconName:"diamond",  title:"全問正解する",         target:1,  reward:100, track:"perfects" },
  { id:"ranked2",    iconName:"crown",    title:"ランクマッチを2回",   target:2,  reward:70,  track:"ranked" },
  { id:"photo1",     iconName:"camera",   title:"写真モードで1回",     target:1,  reward:40,  track:"photos" },
  { id:"english3",   iconName:"english",  title:"英語で3回正解",        target:3,  reward:40,  track:"correct_english" },
  { id:"math3",      iconName:"math",     title:"数学で3回正解",        target:3,  reward:40,  track:"correct_math" },
  { id:"streak3",    iconName:"fire",     title:"3連続正解",            target:3,  reward:60,  track:"streak" },
  { id:"boss_dmg",   iconName:"history",  title:"ボスに100ダメージ",   target:100,reward:50,  track:"boss_dmg" },
];

// 称号: 累計実績に基づいて獲得（プロフィールに表示）
const TITLES = [
  // === 既存18個 ===
  { id:"newbie",       label:"新米学習者",     icon:"🌱", req: { type:"total_correct", val:1   }, color:"#34D399", desc:"初めての正解" },
  { id:"learner100",   label:"勉強家",         icon:"📚", req: { type:"total_correct", val:100 }, color:"#60A5FA", desc:"累計100問正解" },
  { id:"learner500",   label:"努力家",         icon:"📖", req: { type:"total_correct", val:500 }, color:"#A78BFA", desc:"累計500問正解" },
  { id:"learner1000",  label:"学習マスター",   icon:"🎓", req: { type:"total_correct", val:1000}, color:"#FBBF24", desc:"累計1000問正解" },
  { id:"streak10",     label:"集中の達人",     icon:"🔥", req: { type:"max_streak",    val:10  }, color:"#EF4444", desc:"10連続正解" },
  { id:"streak20",     label:"無敵モード",     icon:"⚡", req: { type:"max_streak",    val:20  }, color:"#F472B6", desc:"20連続正解" },
  { id:"english_m",    label:"英語マスター",   icon:"📖", req: { type:"genre_xp",      val:500, genre:"english"  }, color:"#60A5FA", desc:"英語XP 500" },
  { id:"math_m",       label:"数学マスター",   icon:"📐", req: { type:"genre_xp",      val:500, genre:"math"     }, color:"#A78BFA", desc:"数学XP 500" },
  { id:"japanese_m",   label:"国語マスター",   icon:"✒️", req: { type:"genre_xp",      val:500, genre:"japanese" }, color:"#FB7185", desc:"国語XP 500" },
  { id:"social_m",     label:"社会マスター",   icon:"🌍", req: { type:"genre_xp",      val:500, genre:"social"   }, color:"#34D399", desc:"社会XP 500" },
  { id:"science_m",    label:"理科マスター",   icon:"🔬", req: { type:"genre_xp",      val:500, genre:"science"  }, color:"#F472B6", desc:"理科XP 500" },
  { id:"history_m",    label:"歴史マスター",   icon:"🏛️", req: { type:"genre_xp",      val:500, genre:"history"  }, color:"#FBBF24", desc:"歴史XP 500" },
  { id:"all_subjects", label:"全教科の達人",   icon:"👑", req: { type:"all_genres_xp", val:200 }, color:"#FBBF24", desc:"全6教科XP200以上" },
  { id:"daily7",       label:"継続は力なり",   icon:"🔁", req: { type:"login_streak",  val:7   }, color:"#34D399", desc:"7日連続ログイン" },
  { id:"daily30",      label:"鋼鉄の意志",     icon:"💎", req: { type:"login_streak",  val:30  }, color:"#A78BFA", desc:"30日連続ログイン" },
  { id:"ranked_pro",   label:"競技者",         icon:"⚔️", req: { type:"rating",        val:1500}, color:"#EF4444", desc:"レート1500到達" },
  { id:"ranked_elite", label:"エリート",       icon:"🏆", req: { type:"rating",        val:2000}, color:"#FBBF24", desc:"レート2000到達" },
  { id:"collector",    label:"コレクター",     icon:"📦", req: { type:"items_owned",   val:10  }, color:"#A78BFA", desc:"10種類のアイテム所持" },
  
  // === 新規18個 ===
  // 🆕 連続正解上位
  { id:"streak30",     label:"覚醒モード",     icon:"☄️", req: { type:"max_streak",    val:30  }, color:"#FFA500", desc:"30連続正解" },
  { id:"streak50",     label:"超越者",         icon:"🌌", req: { type:"max_streak",    val:50  }, color:"#FF00FF", desc:"50連続正解の伝説" },
  
  // 🆕 早期学習者
  { id:"earlybird",    label:"早起き勉強",     icon:"🌅", req: { type:"total_correct", val:10  }, color:"#FFD700", desc:"累計10問正解" },
  { id:"learner2000",  label:"知恵の聖人",     icon:"🌟", req: { type:"total_correct", val:2000}, color:"#FF6B6B", desc:"累計2000問正解" },
  
  // 🆕 教科極み（XP1000）
  { id:"english_g",    label:"英語の神",       icon:"🇬🇧", req: { type:"genre_xp",     val:1000, genre:"english"  }, color:"#1E40AF", desc:"英語XP 1000" },
  { id:"math_g",       label:"数学の神",       icon:"∞",  req: { type:"genre_xp",     val:1000, genre:"math"     }, color:"#7C3AED", desc:"数学XP 1000" },
  { id:"japanese_g",   label:"言葉の神",       icon:"🖋️", req: { type:"genre_xp",     val:1000, genre:"japanese" }, color:"#BE185D", desc:"国語XP 1000" },
  
  // 🆕 全教科極み
  { id:"all_500",      label:"六道の賢者",     icon:"⚜️", req: { type:"all_genres_xp", val:500 }, color:"#FFD700", desc:"全6教科XP500以上" },
  
  // 🆕 ログイン継続
  { id:"daily100",     label:"継続の伝説",     icon:"🏔️", req: { type:"login_streak",  val:100 }, color:"#FF6347", desc:"100日連続ログイン" },
  { id:"daily365",     label:"1年間の鬼",      icon:"🐉", req: { type:"login_streak",  val:365 }, color:"#DC143C", desc:"365日連続ログイン" },
  
  // 🆕 ランクマスター
  { id:"ranked_legend",label:"伝説のプレイヤー",icon:"👑", req: { type:"rating",       val:2500}, color:"#FF00FF", desc:"レート2500到達" },
  
  // 🆕 コレクター
  { id:"collector_pro",label:"装飾の達人",     icon:"💎", req: { type:"items_owned",   val:20  }, color:"#06B6D4", desc:"20種類のアイテム所持" },
  { id:"collector_god",label:"装飾の王",       icon:"👑", req: { type:"items_owned",   val:40  }, color:"#FFD700", desc:"40種類のアイテム所持" },
  
  // 🆕 ペット系
  { id:"pet_dad",      label:"ペットの親",     icon:"💖", req: { type:"hasPetName"           }, color:"#FF69B4", desc:"ペットに名前をつける" },
  { id:"pet_collector",label:"育成王",         icon:"🐾", req: { type:"pets_unlocked", val:10  }, color:"#A78BFA", desc:"10種類のペット発見" },
  
  // 🆕 ボス
  { id:"boss_slayer",  label:"龍殺し",         icon:"🗡️", req: { type:"boss_kills",    val:5   }, color:"#DC2626", desc:"ボス5体撃破" },
  
  // 🆕 ガチャ
  { id:"lucky",        label:"幸運の星",       icon:"🍀", req: { type:"legend_pulls",  val:5   }, color:"#22C55E", desc:"レジェンド5回引く" },
  
  // 🆕 隠し称号
  { id:"speedrun",     label:"スピードランナー",icon:"💨", req: { type:"total_correct", val:50  }, color:"#FF8C00", desc:"短期で50問正解" },

  // === さらに追加20個 ===
  // 🆕 教科の極致（XP2000）
  { id:"english_legend",  label:"英語の伝説", icon:"🌐", req: { type:"genre_xp", val:2000, genre:"english"  }, color:"#1E3A8A", desc:"英語XP 2000" },
  { id:"math_legend",     label:"数学の伝説", icon:"♾️", req: { type:"genre_xp", val:2000, genre:"math"     }, color:"#5B21B6", desc:"数学XP 2000" },
  { id:"japanese_legend", label:"言葉の伝説", icon:"📜", req: { type:"genre_xp", val:2000, genre:"japanese" }, color:"#9F1239", desc:"国語XP 2000" },
  { id:"social_legend",   label:"社会の伝説", icon:"🌏", req: { type:"genre_xp", val:2000, genre:"social"   }, color:"#065F46", desc:"社会XP 2000" },
  { id:"science_legend",  label:"理科の伝説", icon:"⚗️", req: { type:"genre_xp", val:2000, genre:"science"  }, color:"#9D174D", desc:"理科XP 2000" },
  { id:"history_legend",  label:"歴史の伝説", icon:"⚱️", req: { type:"genre_xp", val:2000, genre:"history"  }, color:"#92400E", desc:"歴史XP 2000" },

  // 🆕 究極
  { id:"ultimate_god",    label:"全知全能", icon:"🌠", req: { type:"all_genres_xp", val:1000 }, color:"#F59E0B", desc:"全6教科XP1000以上" },

  // 🆕 連続正解上位
  { id:"streak100",       label:"無限連鎖", icon:"♾️", req: { type:"max_streak", val:100 }, color:"#A855F7", desc:"100連続正解の神話" },

  // 🆕 累計
  { id:"learner5000",     label:"知識の塔", icon:"🗼", req: { type:"total_correct", val:5000 }, color:"#0EA5E9", desc:"累計5000問正解" },
  { id:"learner10000",    label:"無双の賢者", icon:"🧙", req: { type:"total_correct", val:10000 }, color:"#DB2777", desc:"累計10000問正解" },

  // 🆕 ペット系
  { id:"pet_master",      label:"ペット図鑑コンプ", icon:"📔", req: { type:"pets_unlocked", val:18 }, color:"#FBBF24", desc:"全18種のペット発見" },
  { id:"pet_chef",        label:"愛情の料理人", icon:"🍳", req: { type:"pet_fed", val:50 }, color:"#FB7185", desc:"ペットに50回餌をあげる" },

  // 🆕 ボス
  { id:"boss_master",     label:"ボス制圧者", icon:"💀", req: { type:"boss_kills", val:10 }, color:"#7F1D1D", desc:"ボス10体撃破" },

  // 🆕 ガチャ運
  { id:"lucky_god",       label:"運命の寵児", icon:"🎰", req: { type:"legend_pulls", val:20 }, color:"#16A34A", desc:"レジェンド20回引く" },

  // 🆕 友達
  { id:"social_butterfly",label:"社交家", icon:"🦋", req: { type:"friends", val:10 }, color:"#06B6D4", desc:"10人の友達を追加" },

  // 🆕 ブックマーク
  { id:"bookmark_master", label:"記憶の管理者", icon:"📑", req: { type:"bookmarks", val:50 }, color:"#FCD34D", desc:"ブックマーク50問保存" },

  // 🆕 時間帯系
  { id:"morning_person",  label:"朝活マスター", icon:"🌄", req: { type:"early_morning" }, color:"#FCA5A5", desc:"朝6時前に勉強" },
  { id:"night_scholar",   label:"深夜の学者", icon:"🌙", req: { type:"late_night" }, color:"#818CF8", desc:"23時以降に勉強" },

  // 🆕 完璧主義
  { id:"perfect_master",  label:"完璧主義者", icon:"💯", req: { type:"perfects", val:30 }, color:"#FBBF24", desc:"全問正解30回達成" },

  // 🆕 タイムアタック
  { id:"speed_demon",     label:"音速の使者", icon:"⚡", req: { type:"ta_best", val:80 }, color:"#FB923C", desc:"タイムアタック80問達成" },

  // 🆕 プレイヤーレベル系
  { id:"level10",         label:"駆け出し勇者", icon:"🌟", req: { type:"player_level", val:10 },   color:"#34D399", desc:"プレイヤーLv10到達" },
  { id:"level50",         label:"上級学習者",   icon:"💫", req: { type:"player_level", val:50 },   color:"#60A5FA", desc:"プレイヤーLv50到達" },
  { id:"level100",        label:"エリート",     icon:"⭐", req: { type:"player_level", val:100 },  color:"#A78BFA", desc:"プレイヤーLv100到達" },
  { id:"level500",        label:"伝説の学者",   icon:"👑", req: { type:"player_level", val:500 },  color:"#F472B6", desc:"プレイヤーLv500到達" },
  { id:"level1000",       label:"真の覇王",     icon:"🌌", req: { type:"player_level", val:1000 }, color:"#FBBF24", desc:"プレイヤーLv1000到達" },
];

// 称号獲得判定
function checkTitleUnlocks(genreXp, totalCorrect, maxStreak, loginStreak, userRating, ownedItems, extraStats = {}) {
  const unlocked = [];
  TITLES.forEach(t => {
    const r = t.req;
    let ok = false;
    if (r.type === "total_correct") ok = totalCorrect >= r.val;
    else if (r.type === "max_streak") ok = maxStreak >= r.val;
    else if (r.type === "player_level") ok = (extraStats.playerLevel || 0) >= r.val;
    else if (r.type === "genre_xp") ok = (genreXp[r.genre] || 0) >= r.val;
    else if (r.type === "all_genres_xp") ok = Object.values(genreXp).every(v => v >= r.val);
    else if (r.type === "login_streak") ok = loginStreak >= r.val;
    else if (r.type === "rating") ok = userRating >= r.val;
    else if (r.type === "items_owned") ok = ownedItems.length >= r.val;
    else if (r.type === "hasPetName") ok = !!extraStats.hasPetName;
    else if (r.type === "pets_unlocked") ok = (extraStats.petsUnlocked || 0) >= r.val;
    else if (r.type === "boss_kills") ok = (extraStats.bossKills || 0) >= r.val;
    else if (r.type === "legend_pulls") ok = (extraStats.legendPulls || 0) >= r.val;
    else if (r.type === "pet_fed") ok = (extraStats.petFed || 0) >= r.val;
    else if (r.type === "friends") ok = (extraStats.friends || 0) >= r.val;
    else if (r.type === "bookmarks") ok = (extraStats.bookmarks || 0) >= r.val;
    else if (r.type === "early_morning") ok = !!extraStats.earlyMorning;
    else if (r.type === "late_night") ok = !!extraStats.lateNight;
    else if (r.type === "perfects") ok = (extraStats.perfects || 0) >= r.val;
    else if (r.type === "ta_best") ok = (extraStats.taBest || 0) >= r.val;
    if (ok) unlocked.push(t.id);
  });
  return unlocked;
}


// 日付に基づいて3つのミッションを選ぶ（同じ日なら同じ）
function getTodaysMissions() {
  const today = new Date().toISOString().slice(0,10); // YYYY-MM-DD
  const seed = today.split("-").reduce((a,b) => a + parseInt(b), 0);
  const pool = [...DAILY_MISSIONS_POOL];
  const selected = [];
  let s = seed;
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    s = (s * 9301 + 49297) % 233280;
    const idx = Math.floor((s/233280) * pool.length);
    selected.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return selected;
}

// ジャンル別のフォーム（部位パーツ）
const GENRE_FORMS = {
  english:  { creature:"🐍", element:"📖", aura:"#60A5FA", title:"知識の" },
  math:     { creature:"🤖", element:"⚙️", aura:"#A78BFA", title:"論理の" },
  japanese: { creature:"🐱", element:"✒️", aura:"#FB7185", title:"言の葉の" },
  social:   { creature:"🐺", element:"🗺️", aura:"#34D399", title:"探求の" },
  science:  { creature:"🦈", element:"🧪", aura:"#F472B6", title:"研究の" },
  history:  { creature:"🐉", element:"📜", aura:"#FBBF24", title:"古の" },
};

// 5段階の閾値
const STAGE_THRESHOLDS = [0, 50, 150, 300, 600, 1000];
const STAGE_NAMES = ["たまご","ヒナ","チャイルド","ティーン","アダルト"];

const AI_POOL = [
  { id:1, name:"ハルカ", level:24, avatar:"🦊", isAI:true, rating:1850, wins:42, battles:78, weeklyXp:1240, joinDate:"2024年8月", bio:"理科と数学が好き！特に物理が得意。",   privacy:"public" },
  { id:2, name:"リョウ", level:31, avatar:"🐺", isAI:true, rating:2340, wins:89, battles:124, weeklyXp:2150, joinDate:"2024年5月", bio:"歴史と社会のスペシャリスト。ボス戦専門。", privacy:"public" },
  { id:3, name:"ミク",   level:18, avatar:"🦋", isAI:true, rating:1420, wins:18, battles:45,  weeklyXp:680,  joinDate:"2025年1月", bio:"国語が大好き！日本文学に詳しいです。",     privacy:"public" },
  { id:4, name:"タツヤ", level:27, avatar:"🐯", isAI:true, rating:2010, wins:55, battles:92,  weeklyXp:1580, joinDate:"2024年7月", bio:"英語の単語ガチ勢。エンドレス100連勝目指す！", privacy:"public" },
  { id:5, name:"アヤカ", level:22, avatar:"🐰", isAI:true, rating:1680, wins:31, battles:62,  weeklyXp:950,  joinDate:"2024年11月",bio:"全教科バランス重視。毎日少しずつ。",          privacy:"friends" },
  { id:6, name:"ケンジ", level:35, avatar:"🐉", isAI:true, rating:2890, wins:142, battles:178,weeklyXp:3420, joinDate:"2024年3月", bio:"ドラゴン使い。歴史最強を目指す。",            privacy:"public" },
  { id:7, name:"ユウト", level:19, avatar:"🐱", isAI:true, rating:1530, wins:24, battles:51,  weeklyXp:820,  joinDate:"2024年12月",bio:"猫好き×国語好き。コツコツ派。",              privacy:"public" },
  { id:8, name:"サクラ", level:28, avatar:"🌸", isAI:true, rating:2150, wins:67, battles:103, weeklyXp:1820, joinDate:"2024年6月", bio:"理科の研究員になるのが夢！",                 privacy:"public" },
  { id:9, name:"リク",   level:33, avatar:"🌊", isAI:true, rating:2510, wins:98, battles:135, weeklyXp:2680, joinDate:"2024年4月", bio:"水の卵から育てた水龍が自慢。",               privacy:"private" },
  { id:10,name:"ノア",   level:20, avatar:"⭐", isAI:true, rating:1590, wins:22, battles:48,  weeklyXp:740,  joinDate:"2024年10月",bio:"星の旅人を目指して勉強中。",                privacy:"public" },
];

const MONSTERS = [
  {
    name:"スライム", hp:120, maxHp:120, atk:15, color:"#4ade80",
    palette:{ G:"#4ade80", D:"#16a34a", W:"#fff", B:"#0f172a", M:"#15803d" },
    pixels:[
      "............",
      "............",
      "....GGGG....",
      "...GGGGGG...",
      "..GGGGGGGG..",
      ".GGGGGGGGGG.",
      "GGWWGGGGWWGG",
      "GGWBGGGGBWGG",
      "GGGGGGGGGGGG",
      "GGGGMMMMGGGG",
      ".DDDDDDDDDD.",
      "..DDDDDDDD..",
    ],
  },
  {
    name:"ゴブリン", hp:160, maxHp:160, atk:20, color:"#fb923c",
    palette:{ O:"#fb923c", D:"#c2410c", W:"#fff", B:"#0f172a", F:"#fef3c7", R:"#dc2626" },
    pixels:[
      "............",
      "..O......O..",
      "..OO....OO..",
      "...OOOOOOO..",
      "..OOOOOOOOOO",
      "..OOOOOOOOO.",
      "..OWBOOOBWO.",
      "..OOOOROOOO.",
      "..OOFFFFFOO.",
      "..OFWFWFWFO.",
      "..DDDDDDDD..",
      "..D.D..D.D..",
    ],
  },
  {
    name:"ドラゴン", hp:220, maxHp:220, atk:28, color:"#f472b6",
    palette:{ P:"#f472b6", D:"#be185d", W:"#fff", B:"#0f172a", F:"#fef3c7", S:"#fbcfe8" },
    pixels:[
      ".P........P.",
      "PP........PP",
      "PPS......SPP",
      "PPPSSSSSSPPP",
      "PPPPPPPPPPPP",
      "PPWBPPPPBWPP",
      "PPPPPPPPPPPP",
      "PPPPFFFFPPPP",
      "PPPFFFFFFPPP",
      "PDDDDDDDDDDP",
      "PD.PPPPPP.DP",
      "..D.DD.DD.D.",
    ],
  },
];

// ─── 学年（難易度レベル） ──────────────────────────
const GRADES = [
  { id:"jh1", label:"中1", short:"中1", color:"#34D399" },
  { id:"jh2", label:"中2", short:"中2", color:"#60A5FA" },
  { id:"jh3", label:"中3", short:"中3", color:"#818CF8" },
  { id:"hs1", label:"高1", short:"高1", color:"#A78BFA" },
  { id:"hs2", label:"高2", short:"高2", color:"#F472B6" },
  { id:"hs3", label:"高3", short:"高3", color:"#FBBF24" },
];

// 学年別の問題集 [genre][grade] = [問題...]

// ─── 学年×分野の問題集 [genre][grade][topic] ──────────
// 指定された学年×分野の問題。なければ学年のみ→分野のみ→教科全体にフォールバック
const GRADE_TOPIC_QUESTIONS = {
  english: {
    jh1: {
      vocab: [
        {q:"「cat」の意味は？",choices:["猫","犬","鳥","魚"],answer:0},
        {q:"「school」の意味は？",choices:["学校","病院","駅","店"],answer:0},
        {q:"「water」の意味は？",choices:["水","火","土","風"],answer:0},
        {q:"「friend」の意味は？",choices:["友達","家族","先生","敵"],answer:0},
      ],
      grammar: [
        {q:"「I ___ Tom.」(私はトム)",choices:["am","is","are","be"],answer:0},
        {q:"「You ___ kind.」",choices:["are","am","is","be"],answer:0},
        {q:"「This ___ a pen.」",choices:["is","am","are","be"],answer:0},
        {q:"複数形「book」→？",choices:["books","bookes","book","booki"],answer:0},
      ],
      idiom: [
        {q:"「Thank you」の意味は？",choices:["ありがとう","ごめん","こんにちは","さようなら"],answer:0},
        {q:"「Good morning」はいつ使う？",choices:["朝","昼","夜","夕方"],answer:0},
        {q:"「How are you?」の意味は？",choices:["元気ですか","何歳ですか","誰ですか","どこですか"],answer:0},
      ],
    },
    jh2: {
      vocab: [
        {q:"「important」の意味は？",choices:["重要な","簡単な","小さい","遅い"],answer:0},
        {q:"「difficult」の意味は？",choices:["難しい","簡単な","楽しい","速い"],answer:0},
        {q:"「remember」の意味は？",choices:["覚えている","忘れる","走る","食べる"],answer:0},
      ],
      grammar: [
        {q:"過去形「play」→？",choices:["played","plaied","plays","playing"],answer:0},
        {q:"「彼は走っている」He is ___.",choices:["running","run","runs","ran"],answer:0},
        {q:"比較級「tall」→？",choices:["taller","more tall","tallest","taler"],answer:0},
        {q:"未来「~するつもり」be going ___",choices:["to","for","at","in"],answer:0},
      ],
      idiom: [
        {q:"「look for」の意味は？",choices:["探す","見る","作る","話す"],answer:0},
        {q:"「get up」の意味は？",choices:["起きる","寝る","座る","立つ"],answer:0},
        {q:"「take care」の意味は？",choices:["気をつけて","急いで","止まれ","行こう"],answer:0},
      ],
    },
    jh3: {
      vocab: [
        {q:"「decision」の意味は？",choices:["決定","質問","失敗","希望"],answer:0},
        {q:"「environment」の意味は？",choices:["環境","政府","経済","文化"],answer:0},
        {q:"「improve」の意味は？",choices:["改善する","壊す","止める","隠す"],answer:0},
      ],
      grammar: [
        {q:"受動態「is ___ by」",choices:["過去分詞","原形","ing形","過去形"],answer:0},
        {q:"現在完了「have ___」",choices:["過去分詞","原形","ing形","三単現"],answer:0},
        {q:"関係代名詞 the man ___ runs",choices:["who","which","whose","whom"],answer:0},
      ],
      idiom: [
        {q:"「give up」の意味は？",choices:["諦める","始める","続ける","勝つ"],answer:0},
        {q:"「look forward to」の意味は？",choices:["楽しみにする","後ろを見る","忘れる","急ぐ"],answer:0},
        {q:"「as soon as」の意味は？",choices:["~するとすぐ","~の間","~なので","~だが"],answer:0},
      ],
    },
    hs1: {
      vocab: [
        {q:"「ambitious」の意味は？",choices:["野心的な","臆病な","遅い","厳しい"],answer:0},
        {q:"「fragile」の意味は？",choices:["壊れやすい","強い","美しい","重い"],answer:0},
        {q:"「genuine」の意味は？",choices:["本物の","偽の","古い","小さい"],answer:0},
      ],
      grammar: [
        {q:"仮定法「If I ___ rich」",choices:["were","am","is","be"],answer:0},
        {q:"分詞構文の例は？",choices:["Walking, he...","He walks","Walk!","To walk"],answer:0},
        {q:"「~される」を表すのは？",choices:["受動態","能動態","命令法","疑問文"],answer:0},
      ],
      idiom: [
        {q:"「in spite of」の意味は？",choices:["~にもかかわらず","~のために","~の間","~に従って"],answer:0},
        {q:"「break a leg」の意味は？",choices:["頑張れ","怪我する","急げ","休め"],answer:0},
        {q:"「piece of cake」の意味は？",choices:["とても簡単","お菓子","小片","美味"],answer:0},
      ],
    },
    hs2: {
      vocab: [
        {q:"「inevitable」の意味は？",choices:["避けられない","避けられる","予測不能","重要でない"],answer:0},
        {q:"「meticulous」の意味は？",choices:["几帳面な","大雑把な","怠惰な","活発な"],answer:0},
        {q:"「reluctant」の意味は？",choices:["気が進まない","熱心な","快活な","勤勉な"],answer:0},
      ],
      grammar: [
        {q:"仮定法過去完了「had ___」",choices:["過去分詞","原形","ing形","過去形"],answer:0},
        {q:"強調構文 It is ~ that の用法は？",choices:["強調","否定","疑問","命令"],answer:0},
        {q:"「~するやいなや」no sooner ___ than",choices:["had","have","has","having"],answer:0},
      ],
      idiom: [
        {q:"「on cloud nine」の意味は？",choices:["とても幸せ","雲の上","9番目","空の旅"],answer:0},
        {q:"「let the cat out of the bag」",choices:["秘密を漏らす","猫を逃がす","袋を開ける","発見する"],answer:0},
        {q:"「once in a blue moon」",choices:["ごく稀に","毎月","青い月","満月"],answer:0},
      ],
    },
    hs3: {
      vocab: [
        {q:"「ubiquitous」の意味は？",choices:["遍在する","珍しい","危険な","小さい"],answer:0},
        {q:"「pragmatic」の意味は？",choices:["実用的な","理論的な","感情的な","抽象的な"],answer:0},
        {q:"「scrutinize」の意味は？",choices:["精査する","無視する","破壊する","作成する"],answer:0},
      ],
      grammar: [
        {q:"「notwithstanding」の品詞は？",choices:["前置詞","動詞","形容詞","副詞のみ"],answer:0},
        {q:"倒置「Never ___ I seen」",choices:["have","has","had","having"],answer:0},
        {q:"「lest ~ should」の意味は？",choices:["~しないように","~するように","~なので","~の間"],answer:0},
      ],
      idiom: [
        {q:"「bite the bullet」の意味は？",choices:["困難に耐える","噛む","逃げる","撃つ"],answer:0},
        {q:"「the ball is in your court」",choices:["君の番だ","球技する","裁判だ","終わりだ"],answer:0},
        {q:"「cut corners」の意味は？",choices:["手を抜く","曲がる","切る","急ぐ"],answer:0},
      ],
    },
  },
  math: {
    jh1: {
      calc: [
        {q:"(-3) + 5 = ?",choices:["2","-2","8","-8"],answer:0},
        {q:"(-4) × (-2) = ?",choices:["8","-8","6","-6"],answer:0},
        {q:"12 ÷ (-3) = ?",choices:["-4","4","-9","9"],answer:0},
        {q:"絶対値 |-7| = ?",choices:["7","-7","0","14"],answer:0},
      ],
      geometry: [
        {q:"三角形の内角の和は？",choices:["180°","360°","90°","270°"],answer:0},
        {q:"円の面積の公式は？",choices:["πr²","2πr","πd","r²"],answer:0},
        {q:"正方形の周りの長さ(1辺a)は？",choices:["4a","a²","2a","a"],answer:0},
      ],
    },
    jh2: {
      calc: [
        {q:"3a + 2a = ?",choices:["5a","6a","5a²","6a²"],answer:0},
        {q:"2x = 10 のとき x = ?",choices:["5","8","12","20"],answer:0},
        {q:"(x+2)(x+3)を展開すると？",choices:["x²+5x+6","x²+6x+5","x²+5","x²+6"],answer:0},
      ],
      quadratic: [
        {q:"一次関数 y=2x+1 の傾きは？",choices:["2","1","-2","0"],answer:0},
        {q:"y=2x+1 の切片は？",choices:["1","2","0","-1"],answer:0},
        {q:"一次関数のグラフは？",choices:["直線","放物線","円","双曲線"],answer:0},
      ],
      geometry: [
        {q:"平行四辺形の面積は？",choices:["底辺×高さ","底辺×高さ÷2","縦×横÷2","πr²"],answer:0},
        {q:"三角形の合同条件でないのは？",choices:["3角相等","3辺相等","2辺夾角","1辺両端角"],answer:0},
        {q:"多角形の外角の和は？",choices:["360°","180°","720°","540°"],answer:0},
      ],
    },
    jh3: {
      calc: [
        {q:"√9 = ?",choices:["3","9","81","6"],answer:0},
        {q:"√2 × √8 = ?",choices:["4","2","8","16"],answer:0},
        {q:"因数分解 x²-9 = ?",choices:["(x+3)(x-3)","(x-3)²","(x+3)²","(x-9)"],answer:0},
      ],
      quadratic: [
        {q:"x²-5x+6=0 の解は？",choices:["2,3","1,6","-2,-3","0,5"],answer:0},
        {q:"y=x² のグラフは？",choices:["放物線","直線","円","双曲線"],answer:0},
        {q:"y=x²の頂点は？",choices:["(0,0)","(1,1)","(0,1)","(1,0)"],answer:0},
      ],
      geometry: [
        {q:"三平方の定理 a²+b²=?",choices:["c²","c","2c","c³"],answer:0},
        {q:"円周角は中心角の何倍？",choices:["1/2","2","1","1/4"],answer:0},
        {q:"相似な図形の面積比は辺の比の？",choices:["2乗","3乗","1乗","1/2乗"],answer:0},
      ],
    },
    hs1: {
      quadratic: [
        {q:"y=(x-2)²+3 の頂点は？",choices:["(2,3)","(-2,3)","(2,-3)","(3,2)"],answer:0},
        {q:"判別式D>0なら実数解は？",choices:["2つ","1つ","0個","無限"],answer:0},
        {q:"y=x²-4x+3 のx切片は？",choices:["1と3","2と3","0と4","1と4"],answer:0},
      ],
      geometry: [
        {q:"sin²θ+cos²θ = ?",choices:["1","0","2","θ"],answer:0},
        {q:"sin30° = ?",choices:["1/2","√3/2","1","1/√2"],answer:0},
        {q:"正弦定理 a/sinA = ?",choices:["2R","R","R/2","πR"],answer:0},
      ],
      calc: [
        {q:"|x|<3 の範囲は？",choices:["-3<x<3","x>3","x<-3","x>0"],answer:0},
        {q:"集合 A∩B が表すのは？",choices:["共通部分","和集合","補集合","空集合"],answer:0},
        {q:"2³ × 2² = ?",choices:["32","16","64","8"],answer:0},
      ],
    },
    hs2: {
      calc: [
        {q:"log₂8 = ?",choices:["3","2","8","16"],answer:0},
        {q:"log₁₀1000 = ?",choices:["3","2","10","100"],answer:0},
        {q:"2^0 = ?",choices:["1","0","2","無限"],answer:0},
      ],
      quadratic: [
        {q:"微分 d/dx(x²) = ?",choices:["2x","x","2","x²"],answer:0},
        {q:"y=x²-2xの最小値は？",choices:["-1","0","1","-2"],answer:0},
        {q:"接線の傾きを求めるのは？",choices:["微分","積分","対数","因数分解"],answer:0},
      ],
      prob: [
        {q:"等差数列の一般項a_nは？",choices:["a+(n-1)d","ar^(n-1)","n²","2^n"],answer:0},
        {q:"等比数列の一般項a_nは？",choices:["ar^(n-1)","a+(n-1)d","n²","2n"],answer:0},
        {q:"Σの意味は？",choices:["総和","積","差","商"],answer:0},
      ],
    },
    hs3: {
      calc: [
        {q:"∫2x dx = ?",choices:["x²+C","2+C","x+C","2x²+C"],answer:0},
        {q:"d/dx(e^x) = ?",choices:["e^x","xe^x","e","1"],answer:0},
        {q:"d/dx(log x) = ?",choices:["1/x","x","log x","e^x"],answer:0},
      ],
      quadratic: [
        {q:"lim(x→0) sinx/x = ?",choices:["1","0","∞","-1"],answer:0},
        {q:"∫[0→1] x dx = ?",choices:["1/2","1","2","0"],answer:0},
        {q:"極大値での微分係数は？",choices:["0","1","-1","∞"],answer:0},
      ],
      prob: [
        {q:"複素数 i² = ?",choices:["-1","1","i","0"],answer:0},
        {q:"期待値の記号は？",choices:["E(X)","V(X)","σ","μ²"],answer:0},
        {q:"分散の記号は？",choices:["V(X)","E(X)","Σ","∫"],answer:0},
      ],
    },
  },
  japanese: {
    jh1: {
      kanji: [
        {q:"「曖昧」の読みは？",choices:["あいまい","あいみ","おうまい","あいばい"],answer:0},
        {q:"「絆」の読みは？",choices:["きずな","きづな","はん","ばん"],answer:0},
        {q:"「峠」の読みは？",choices:["とうげ","たお","みね","さか"],answer:0},
      ],
      classic: [
        {q:"「春はあけぼの」で始まる作品は？",choices:["枕草子","源氏物語","徒然草","方丈記"],answer:0},
        {q:"俳句の音数は？",choices:["5・7・5","5・7・5・7・7","7・5","5・5"],answer:0},
        {q:"「いとをかし」の意味は？",choices:["趣がある","悲しい","怖い","眠い"],answer:0},
      ],
      modern: [
        {q:"主語・述語の「述語」とは？",choices:["どうする・どんなだ","誰が","何を","いつ"],answer:0},
        {q:"句点は？",choices:["。","、","！","？"],answer:0},
        {q:"段落の最初は普通どうする？",choices:["一字下げる","空ける","記号","数字"],answer:0},
      ],
    },
    jh2: {
      kanji: [
        {q:"「五十歩百歩」の意味は？",choices:["大差ない","大きく違う","前進","後退"],answer:0},
        {q:"「推敲」の意味は？",choices:["文章を練る","急いで書く","破棄","暗記"],answer:0},
        {q:"「矛盾」の意味は？",choices:["つじつまが合わない","調和","正解","新発見"],answer:0},
      ],
      classic: [
        {q:"短歌の音数は？",choices:["5・7・5・7・7","5・7・5","7・7","5・5"],answer:0},
        {q:"「枕草子」の作者は？",choices:["清少納言","紫式部","兼好法師","鴨長明"],answer:0},
        {q:"係り結びで「ぞ」の結びは？",choices:["連体形","終止形","已然形","命令形"],answer:0},
      ],
      modern: [
        {q:"敬語「いらっしゃる」は？",choices:["尊敬語","謙譲語","丁寧語","命令"],answer:0},
        {q:"「しかし」の働きは？",choices:["逆接","順接","並列","添加"],answer:0},
        {q:"比喩で「~のような」は？",choices:["直喩","隠喩","擬人","反復"],answer:0},
      ],
    },
    jh3: {
      kanji: [
        {q:"「諸行無常」の意味は？",choices:["全ては移り変わる","永遠","平和","勝利"],answer:0},
        {q:"「温故知新」の意味は？",choices:["古きから新しきを知る","新しさ追求","古さ重視","変化なし"],answer:0},
        {q:"「四面楚歌」の意味は？",choices:["周囲が敵","四方の歌","四回戦","南の歌"],answer:0},
      ],
      classic: [
        {q:"「徒然草」の作者は？",choices:["兼好法師","清少納言","紫式部","鴨長明"],answer:0},
        {q:"「奥の細道」の作者は？",choices:["松尾芭蕉","与謝蕪村","小林一茶","正岡子規"],answer:0},
        {q:"漢文「レ点」の働きは？",choices:["一字返る","二字返る","読まない","強調"],answer:0},
      ],
      modern: [
        {q:"「漱石」の代表作は？",choices:["坊っちゃん","羅生門","檸檬","舞姫"],answer:0},
        {q:"指示語「これ」が指すのは？",choices:["近いもの","遠いもの","不明","未来"],answer:0},
        {q:"論説文の結論は普通どこ？",choices:["最後","最初","中間","なし"],answer:0},
      ],
    },
    hs1: {
      classic: [
        {q:"「源氏物語」の作者は？",choices:["紫式部","清少納言","和泉式部","菅原孝標女"],answer:0},
        {q:"「あはれ」の意味は？",choices:["しみじみとした情趣","明るい","怒り","退屈"],answer:0},
        {q:"古文「めり」の意味は？",choices:["推量","過去","完了","断定"],answer:0},
      ],
      modern: [
        {q:"「擬人法」とは？",choices:["人でないものを人に例える","比喩全般","反復","倒置"],answer:0},
        {q:"評論の「論旨」とは？",choices:["主張の筋道","具体例","引用","結論のみ"],answer:0},
        {q:"対義語「具体」⇔？",choices:["抽象","現実","実際","明確"],answer:0},
      ],
      kanji: [
        {q:"「画竜点睛」の意味は？",choices:["最後の仕上げ","始まり","失敗","絵"],answer:0},
        {q:"「呉越同舟」の意味は？",choices:["敵同士が同席","友と旅","船旅","遠征"],answer:0},
        {q:"「臥薪嘗胆」の意味は？",choices:["苦労に耐える","怠ける","楽しむ","眠る"],answer:0},
      ],
    },
    hs2: {
      classic: [
        {q:"助動詞「けり」の意味は？",choices:["過去・詠嘆","推量","打消","使役"],answer:0},
        {q:"漢詩の絶句は何句？",choices:["4句","8句","2句","6句"],answer:0},
        {q:"枕詞「ちはやぶる」が導くのは？",choices:["神","母","山","海"],answer:0},
      ],
      modern: [
        {q:"近代「浮雲」の作者は？",choices:["二葉亭四迷","森鴎外","夏目漱石","樋口一葉"],answer:0},
        {q:"「逆説」とは？",choices:["矛盾するようで真理","単純な否定","強調","反復"],answer:0},
        {q:"小説の三人称視点とは？",choices:["語り手が外から描く","主人公が語る","読者が語る","作者が登場"],answer:0},
      ],
      kanji: [
        {q:"「捲土重来」の意味は？",choices:["再起","逃走","敗北","休息"],answer:0},
        {q:"「五里霧中」の意味は？",choices:["方向不明","危険","平穏","明快"],answer:0},
        {q:"「換骨奪胎」の意味は？",choices:["作り変える","盗む","壊す","捨てる"],answer:0},
      ],
    },
    hs3: {
      classic: [
        {q:"「あらまほし」の意味は？",choices:["理想的だ","ありえない","めずらしい","退屈だ"],answer:0},
        {q:"係助詞「こそ」の結びは？",choices:["已然形","連体形","終止形","未然形"],answer:0},
        {q:"漢文「使役」を表す字は？",choices:["使・令","不・非","可・能","也・矣"],answer:0},
      ],
      modern: [
        {q:"芥川龍之介の作品は？",choices:["羅生門","雪国","金閣寺","斜陽"],answer:0},
        {q:"「私小説」の特徴は？",choices:["作者の実体験","空想","歴史物","推理"],answer:0},
        {q:"評論「敷衍」の意味は？",choices:["押し広げて説明","省略","否定","引用"],answer:0},
      ],
      kanji: [
        {q:"「換言」の意味は？",choices:["言い換え","沈黙","強調","否定"],answer:0},
        {q:"「示唆」の意味は？",choices:["それとなく示す","断言","命令","質問"],answer:0},
        {q:"「払拭」の意味は？",choices:["ぬぐい去る","付け足す","隠す","強める"],answer:0},
      ],
    },
  },
  social: {
    jh1: {
      geo: [
        {q:"日本の首都は？",choices:["東京","大阪","京都","名古屋"],answer:0},
        {q:"世界一広い海は？",choices:["太平洋","大西洋","インド洋","北極海"],answer:0},
        {q:"日本で一番高い山は？",choices:["富士山","北岳","槍ヶ岳","立山"],answer:0},
      ],
    },
    jh2: {
      geo: [
        {q:"促成栽培が盛んな地域は？",choices:["宮崎・高知","北海道","東北","北陸"],answer:0},
        {q:"日本の標準時子午線は東経何度？",choices:["135度","140度","120度","100度"],answer:0},
        {q:"日本三大都市圏でないのは？",choices:["札幌","東京","大阪","名古屋"],answer:0},
      ],
    },
    jh3: {
      civics: [
        {q:"三権分立の三権でないのは？",choices:["報道権","立法権","行政権","司法権"],answer:0},
        {q:"日本国憲法の三大原則でないのは？",choices:["軍国主義","国民主権","基本的人権","平和主義"],answer:0},
        {q:"選挙権は何歳から？",choices:["18歳","20歳","16歳","25歳"],answer:0},
      ],
      econ: [
        {q:"需要が増えると価格は？",choices:["上がる","下がる","変わらない","ゼロ"],answer:0},
        {q:"消費税は何に課される？",choices:["消費","所得","財産","相続"],answer:0},
        {q:"日本の中央銀行は？",choices:["日本銀行","三菱UFJ","世界銀行","みずほ"],answer:0},
      ],
    },
    hs1: {
      civics: [
        {q:"国会の種類でないのは？",choices:["定例会","通常国会","臨時国会","特別国会"],answer:0},
        {q:"三審制の最高機関は？",choices:["最高裁判所","地方裁判所","高等裁判所","家庭裁判所"],answer:0},
        {q:"民主主義の語源の意味は？",choices:["民衆の支配","王の支配","少数支配","無政府"],answer:0},
      ],
      econ: [
        {q:"GDPとは？",choices:["国内総生産","国民総所得","政府支出","貿易黒字"],answer:0},
        {q:"円高のとき有利なのは？",choices:["輸入","輸出","観光誘致","農業"],answer:0},
        {q:"インフレとは？",choices:["物価上昇","物価下落","失業増","金利低下"],answer:0},
      ],
    },
    hs2: {
      civics: [
        {q:"国際連合の本部所在地は？",choices:["ニューヨーク","ジュネーブ","パリ","ロンドン"],answer:0},
        {q:"日本国憲法第9条の内容は？",choices:["戦争放棄","国民主権","三権分立","地方自治"],answer:0},
        {q:"独占禁止法を運用するのは？",choices:["公正取引委員会","金融庁","総務省","財務省"],answer:0},
      ],
      econ: [
        {q:"需要曲線は普通どんな形？",choices:["右下がり","右上がり","水平","垂直"],answer:0},
        {q:"累進課税が適用されるのは？",choices:["所得税","消費税","関税","印紙税"],answer:0},
        {q:"市場価格を決めるのは？",choices:["需要と供給","政府","企業のみ","消費者のみ"],answer:0},
      ],
    },
    hs3: {
      econ: [
        {q:"「見えざる手」を説いたのは？",choices:["アダム・スミス","ケインズ","マルクス","リカード"],answer:0},
        {q:"ケインズが重視したのは？",choices:["有効需要","自由放任","通貨供給","比較優位"],answer:0},
        {q:"経常収支に含むのは？",choices:["貿易収支","資本移転","外貨準備","直接投資"],answer:0},
      ],
      civics: [
        {q:"三権分立を唱えた思想家は？",choices:["モンテスキュー","ルソー","ロック","ホッブズ"],answer:0},
        {q:"社会契約説を説いたのは？",choices:["ルソー","アダム・スミス","ケインズ","マルクス"],answer:0},
        {q:"環境権は何の権利に分類？",choices:["新しい人権","自由権","参政権","社会権のみ"],answer:0},
      ],
    },
  },
  science: {
    jh1: {
      bio: [
        {q:"植物が光で養分を作る働きは？",choices:["光合成","呼吸","蒸散","発芽"],answer:0},
        {q:"昆虫の体は何部分？",choices:["3つ","2つ","4つ","5つ"],answer:0},
        {q:"植物の根の役割は？",choices:["水を吸う","光合成","花を咲かす","種を作る"],answer:0},
      ],
      chem: [
        {q:"水が氷になると体積は？",choices:["増える","減る","変わらない","半分"],answer:0},
        {q:"気体で空気より軽いのは？",choices:["水素","酸素","二酸化炭素","窒素"],answer:0},
        {q:"磁石が引きつけるのは？",choices:["鉄","アルミ","銅","金"],answer:0},
      ],
    },
    jh2: {
      physics: [
        {q:"電流の単位は？",choices:["アンペア","ボルト","ワット","オーム"],answer:0},
        {q:"オームの法則 V=?",choices:["IR","I/R","R/I","I+R"],answer:0},
        {q:"電圧の単位は？",choices:["ボルト","アンペア","ワット","ジュール"],answer:0},
      ],
      chem: [
        {q:"水の電気分解で陽極に出るのは？",choices:["酸素","水素","窒素","塩素"],answer:0},
        {q:"化学式 H₂O は何？",choices:["水","二酸化炭素","酸素","塩"],answer:0},
        {q:"発熱反応とは？",choices:["熱を出す","熱を吸う","光を出す","音を出す"],answer:0},
      ],
      bio: [
        {q:"血液中で酸素を運ぶのは？",choices:["赤血球","白血球","血小板","血しょう"],answer:0},
        {q:"消化液でないのは？",choices:["汗","だ液","胃液","胆汁"],answer:0},
        {q:"植物の蒸散が起こるのは？",choices:["気孔","根","茎","種"],answer:0},
      ],
    },
    jh3: {
      physics: [
        {q:"力の単位は？",choices:["N","J","W","Pa"],answer:0},
        {q:"仕事率の単位は？",choices:["ワット","ジュール","ニュートン","パスカル"],answer:0},
        {q:"等速直線運動で一定なのは？",choices:["速さ","加速度","力","距離"],answer:0},
      ],
      chem: [
        {q:"イオンで+の電気を帯びるのは？",choices:["陽イオン","陰イオン","中性子","電子"],answer:0},
        {q:"中和でできるのは塩と？",choices:["水","酸","気体","金属"],answer:0},
        {q:"pH7は何性？",choices:["中性","酸性","アルカリ性","強酸"],answer:0},
      ],
      bio: [
        {q:"遺伝の法則を発見したのは？",choices:["メンデル","ダーウィン","パスツール","ニュートン"],answer:0},
        {q:"優性・劣性に関わるのは？",choices:["遺伝子","細胞膜","葉緑体","核膜"],answer:0},
        {q:"細胞分裂で染色体は？",choices:["複製される","消える","増え続ける","半分のまま"],answer:0},
      ],
    },
    hs1: {
      physics: [
        {q:"等加速度運動の加速度は？",choices:["一定","ゼロ","増加","減少"],answer:0},
        {q:"力の単位ニュートンの定義は？",choices:["kg·m/s²","kg·m","kg/s","m/s"],answer:0},
        {q:"力学的エネルギー保存で保存するのは？",choices:["運動+位置E","熱E","電気E","化学E"],answer:0},
      ],
      chem: [
        {q:"原子番号=陽子の数と等しいのは？",choices:["電子の数","中性子の数","質量数","原子量"],answer:0},
        {q:"モル質量の単位は？",choices:["g/mol","mol","g","L"],answer:0},
        {q:"周期表の縦の列を何という？",choices:["族","周期","系","群"],answer:0},
      ],
      bio: [
        {q:"細胞の遺伝情報を持つのは？",choices:["DNA","RNA","タンパク質","脂質"],answer:0},
        {q:"光合成の場は？",choices:["葉緑体","ミトコンドリア","核","リボソーム"],answer:0},
        {q:"ATPの役割は？",choices:["エネルギー貯蔵","遺伝","防御","運搬のみ"],answer:0},
      ],
    },
    hs2: {
      physics: [
        {q:"運動量保存則が成り立つのは？",choices:["外力なし","外力あり","摩擦あり","重力下"],answer:0},
        {q:"波の速さ v = ?",choices:["fλ","f/λ","λ/f","f+λ"],answer:0},
        {q:"電磁誘導を発見したのは？",choices:["ファラデー","オーム","アンペール","クーロン"],answer:0},
      ],
      chem: [
        {q:"気体の状態方程式 PV = ?",choices:["nRT","nR","RT","nT"],answer:0},
        {q:"化学反応を速める物質は？",choices:["触媒","抑制剤","水","塩"],answer:0},
        {q:"酸化とは電子を？",choices:["失う","得る","共有","移動しない"],answer:0},
      ],
    },
    hs3: {
      physics: [
        {q:"波の干渉で強め合う条件は？",choices:["位相が同じ","位相が逆","振幅ゼロ","周期ゼロ"],answer:0},
        {q:"半減期が一定なのは？",choices:["放射性崩壊","化学反応","燃焼","蒸発"],answer:0},
        {q:"ドップラー効果が起こるのは？",choices:["相対運動時","静止時","真空のみ","高温時"],answer:0},
      ],
      chem: [
        {q:"有機化合物に必ず含まれるのは？",choices:["炭素","窒素","硫黄","リン"],answer:0},
        {q:"ベンゼンの炭素数は？",choices:["6","5","4","8"],answer:0},
        {q:"アルコールの官能基は？",choices:["-OH","-COOH","-CHO","-NH₂"],answer:0},
      ],
    },
  },
  history: {
    jh1: {
      japan: [
        {q:"縄文時代の次は？",choices:["弥生時代","古墳時代","奈良時代","平安時代"],answer:0},
        {q:"卑弥呼がいた国は？",choices:["邪馬台国","大和国","出雲国","越国"],answer:0},
        {q:"聖徳太子が制定したのは？",choices:["十七条憲法","大宝律令","御成敗式目","武家諸法度"],answer:0},
      ],
      ancient: [
        {q:"ピラミッドを建てた文明は？",choices:["エジプト","ローマ","ギリシャ","インダス"],answer:0},
        {q:"四大文明でないのは？",choices:["日本","エジプト","メソポタミア","インダス"],answer:0},
        {q:"万里の長城を築いた国は？",choices:["秦","漢","唐","明"],answer:0},
      ],
    },
    jh2: {
      japan: [
        {q:"鎌倉幕府を開いたのは？",choices:["源頼朝","足利尊氏","徳川家康","平清盛"],answer:0},
        {q:"室町幕府を開いたのは？",choices:["足利尊氏","源頼朝","徳川家康","北条時宗"],answer:0},
        {q:"鉄砲を伝えたのは？",choices:["ポルトガル人","オランダ人","中国人","朝鮮人"],answer:0},
      ],
    },
    jh3: {
      japan: [
        {q:"明治維新で行われたのは？",choices:["廃藩置県","参勤交代","鎖国","刀狩"],answer:0},
        {q:"日清戦争の講和条約は？",choices:["下関条約","ポーツマス条約","日米和親","ベルサイユ"],answer:0},
        {q:"第二次世界大戦終結は何年？",choices:["1945年","1941年","1939年","1950年"],answer:0},
      ],
    },
    hs1: {
      world: [
        {q:"フランス革命が始まった年は？",choices:["1789年","1776年","1804年","1815年"],answer:0},
        {q:"ルネサンスの中心地は？",choices:["イタリア","フランス","スペイン","イギリス"],answer:0},
        {q:"宗教改革を始めたのは？",choices:["ルター","カルヴァン","ザビエル","教皇"],answer:0},
      ],
      ancient: [
        {q:"ローマ帝国初代皇帝は？",choices:["アウグストゥス","カエサル","ネロ","ハドリアヌス"],answer:0},
        {q:"古代ギリシャの哲学者は？",choices:["ソクラテス","シーザー","ハンニバル","ネロ"],answer:0},
        {q:"始皇帝が統一した国は？",choices:["中国","インド","日本","ローマ"],answer:0},
      ],
    },
    hs2: {
      world: [
        {q:"第一次世界大戦の開戦年は？",choices:["1914年","1939年","1900年","1918年"],answer:0},
        {q:"アメリカ独立宣言は何年？",choices:["1776年","1789年","1492年","1865年"],answer:0},
        {q:"産業革命が最初に起きた国は？",choices:["イギリス","フランス","ドイツ","アメリカ"],answer:0},
      ],
    },
    hs3: {
      world: [
        {q:"ロシア革命が起きた年は？",choices:["1917年","1905年","1922年","1914年"],answer:0},
        {q:"世界恐慌が始まった年は？",choices:["1929年","1939年","1919年","1945年"],answer:0},
        {q:"冷戦の象徴的な壁は？",choices:["ベルリンの壁","万里の長城","ハドリアヌス","嘆きの壁"],answer:0},
      ],
    },
  },
};

// ─── 不足分野の追加問題 [genre][grade][topic] ─────
const GRADE_TOPIC_EXTRA = {
  english: {
    jh1: {
      grammar: [
        {q:"「これは犬です」= This ___ a dog.",choices:["is","am","are","be"],answer:0},
        {q:"複数形: book → ?",choices:["books","bookes","bookies","book"],answer:0},
        {q:"「私は学生」I ___ a student.",choices:["am","is","are","be"],answer:0},
        {q:"疑問文: ___ you a student?",choices:["Are","Is","Am","Do"],answer:0},
      ],
      idiom: [
        {q:"「good morning」の意味は？",choices:["おはよう","こんにちは","こんばんは","さようなら"],answer:0},
        {q:"「thank you」の意味は？",choices:["ありがとう","ごめんなさい","さようなら","お願い"],answer:0},
        {q:"「see you」の意味は？",choices:["またね","はい","いいえ","お疲れ"],answer:0},
      ],
    },
    jh2: {
      vocab: [
        {q:"「favorite」の意味は？",choices:["お気に入りの","嫌いな","遠い","近い"],answer:0},
        {q:"「between」の意味は？",choices:["~の間に","~の上に","~の下に","~の中に"],answer:0},
        {q:"「something」の意味は？",choices:["何か","誰か","どこか","いつか"],answer:0},
        {q:"「borrow」の意味は？",choices:["借りる","貸す","買う","売る"],answer:0},
      ],
      idiom: [
        {q:"「Of course」の意味は？",choices:["もちろん","たぶん","いいえ","必ず"],answer:0},
        {q:"「by the way」の意味は？",choices:["ところで","道で","電車で","急いで"],answer:0},
        {q:"「at first」の意味は？",choices:["最初は","最後に","急いで","ゆっくり"],answer:0},
      ],
    },
    jh3: {
      vocab: [
        {q:"「achieve」の意味は？",choices:["達成する","始める","あきらめる","期待する"],answer:0},
        {q:"「opportunity」の意味は？",choices:["機会","危険","必要","結果"],answer:0},
        {q:"「decision」の意味は？",choices:["決定","議論","希望","計画"],answer:0},
      ],
      idiom: [
        {q:"「look forward to」の意味は？",choices:["楽しみにする","見上げる","失望する","忘れる"],answer:0},
        {q:"「make up one's mind」の意味は？",choices:["決心する","謝る","話す","怒る"],answer:0},
        {q:"「get along with」の意味は？",choices:["仲良くする","勝つ","逃げる","争う"],answer:0},
      ],
    },
    hs1: {
      vocab: [
        {q:"「significant」の意味は？",choices:["重要な","小さい","古い","明るい"],answer:0},
        {q:"「establish」の意味は？",choices:["設立する","壊す","終わる","始まる"],answer:0},
        {q:"「encounter」の意味は？",choices:["出会う","逃げる","隠す","攻撃する"],answer:0},
      ],
      idiom: [
        {q:"「in spite of」の意味は？",choices:["~にもかかわらず","~のために","~の代わりに","~の間"],answer:0},
        {q:"「by means of」の意味は？",choices:["~によって","~の意味で","~の代わりに","~なしで"],answer:0},
        {q:"「on behalf of」の意味は？",choices:["~を代表して","~の後ろで","~の上に","~に反して"],answer:0},
      ],
    },
    hs2: {
      vocab: [
        {q:"「abundant」の意味は？",choices:["豊富な","不足した","危険な","平凡な"],answer:0},
        {q:"「contradict」の意味は？",choices:["矛盾する","賛成する","強調する","証明する"],answer:0},
        {q:"「persistent」の意味は？",choices:["粘り強い","諦めの早い","親切な","几帳面な"],answer:0},
      ],
      idiom: [
        {q:"「come up with」の意味は？",choices:["思いつく","上がる","会う","遅れる"],answer:0},
        {q:"「put up with」の意味は？",choices:["我慢する","設置する","乗せる","祝う"],answer:0},
        {q:"「get rid of」の意味は？",choices:["取り除く","得る","乗る","逃げる"],answer:0},
      ],
    },
    hs3: {
      vocab: [
        {q:"「endure」の意味は？",choices:["耐え忍ぶ","諦める","逃げる","攻撃する"],answer:0},
        {q:"「subtle」の意味は？",choices:["微妙な","派手な","乱暴な","明白な"],answer:0},
        {q:"「pursue」の意味は？",choices:["追い求める","諦める","隠す","休む"],answer:0},
      ],
      idiom: [
        {q:"「take ~ for granted」の意味は？",choices:["当然と思う","保証する","承認する","受け取る"],answer:0},
        {q:"「at the expense of」の意味は？",choices:["~を犠牲にして","~の費用で","~の終わりに","~の代わりに"],answer:0},
        {q:"「in lieu of」の意味は？",choices:["~の代わりに","~の中で","~の前で","~の後で"],answer:0},
      ],
    },
  },
  math: {
    jh1: {
      quadratic: [{q:"二次方程式は中学何年で本格学習？",choices:["中3","中1","中2","高1"],answer:0}],
      geometry: [
        {q:"三角形の内角の和は？",choices:["180°","360°","90°","270°"],answer:0},
        {q:"正方形の角の数は？",choices:["4","3","5","6"],answer:0},
        {q:"円の直径は半径の何倍？",choices:["2倍","3倍","1/2倍","4倍"],answer:0},
      ],
      prob: [
        {q:"サイコロを1回振って6が出る確率は？",choices:["1/6","1/2","1/3","1/4"],answer:0},
        {q:"コインで表が出る確率は？",choices:["1/2","1/3","1/4","1"],answer:0},
      ],
    },
    jh2: {
      quadratic: [{q:"y=x²のグラフは？",choices:["放物線","直線","円","双曲線"],answer:0}],
      geometry: [
        {q:"平行線の同位角は？",choices:["等しい","補角","直角","異なる"],answer:0},
        {q:"三角形の合同条件で正しいのは？",choices:["3辺相等","角だけ","面積だけ","色"],answer:0},
        {q:"二等辺三角形の底角は？",choices:["等しい","直角","30°","異なる"],answer:0},
      ],
      prob: [
        {q:"場合の数で「順列」の記号は？",choices:["P","C","S","E"],answer:0},
        {q:"確率の最大値は？",choices:["1","100","10","∞"],answer:0},
      ],
    },
    jh3: {
      quadratic: [
        {q:"x²+5x+6=0の解は？",choices:["-2, -3","2, 3","-1, -6","1, 6"],answer:0},
        {q:"判別式D=b²-?",choices:["4ac","2ac","ac","4a"],answer:0},
        {q:"二次関数の頂点を求める方法は？",choices:["平方完成","因数分解","代入","展開"],answer:0},
      ],
      geometry: [
        {q:"三平方の定理: a²+b² = ?",choices:["c²","c","2c","c³"],answer:0},
        {q:"円周角は中心角の何倍？",choices:["1/2","2","等しい","3"],answer:0},
        {q:"相似比2:3なら面積比は？",choices:["4:9","2:3","8:27","√6"],answer:0},
      ],
      prob: [
        {q:"5本中2本があたりくじ、1本引いてあたる確率",choices:["2/5","1/2","1/5","3/5"],answer:0},
        {q:"標本調査の例は？",choices:["視聴率調査","国勢調査","全数調査","成績"],answer:0},
      ],
    },
    hs1: {
      calc: [
        {q:"√12 を簡単にすると？",choices:["2√3","3√2","√6","6"],answer:0},
        {q:"|x-3|=2 の解は？",choices:["1, 5","-1, 5","1, -5","-1, -5"],answer:0},
      ],
      geometry: [
        {q:"sin(45°) = ?",choices:["1/√2","√3/2","1/2","1"],answer:0},
        {q:"三角形の正弦定理: a/sinA = ?",choices:["2R","R","R/2","sinA"],answer:0},
      ],
      prob: [
        {q:"5C3 = ?",choices:["10","5","15","20"],answer:0},
        {q:"確率の和は何になる？",choices:["1","0","2","100"],answer:0},
      ],
    },
    hs2: {
      quadratic: [
        {q:"y=ax²+bx+c の頂点を求める方法は？",choices:["平方完成","微分","代入","因数分解"],answer:0},
      ],
      geometry: [
        {q:"ベクトルの大きさの記号は？",choices:["|a|","a²","|a|²","a"],answer:0},
        {q:"円の方程式 x²+y² = ?",choices:["r²","r","2r","πr²"],answer:0},
      ],
      prob: [
        {q:"期待値の記号は？",choices:["E(X)","V(X)","σ","μ²"],answer:0},
        {q:"二項分布の表記は？",choices:["B(n,p)","N(μ,σ)","P(X)","C(n,r)"],answer:0},
      ],
    },
    hs3: {
      quadratic: [
        {q:"曲線の極値はどう求める？",choices:["微分=0","積分","代入","判別式"],answer:0},
      ],
      geometry: [
        {q:"球の体積は？",choices:["4/3πr³","πr²","4πr²","2πr"],answer:0},
        {q:"楕円の標準形は？",choices:["x²/a²+y²/b²=1","x²+y²=r²","y=ax+b","y=ax²"],answer:0},
      ],
      prob: [
        {q:"正規分布の形は？",choices:["釣鐘型","直線","放物線","三角形"],answer:0},
        {q:"標準正規分布の平均は？",choices:["0","1","-1","100"],answer:0},
      ],
    },
  },
  japanese: {
    jh1: {
      classic: [
        {q:"和歌の音数は？",choices:["5・7・5・7・7","5・7・5","7・5・7","5・5・5"],answer:0},
        {q:"百人一首は何首？",choices:["100首","50首","200首","30首"],answer:0},
      ],
      modern: [
        {q:"主語と述語の関係は？",choices:["~が~する","~を~に","~と~","~の~"],answer:0},
        {q:"段落の最初の字下げは？",choices:["1マス","2マス","0マス","半マス"],answer:0},
      ],
    },
    jh2: {
      classic: [
        {q:"係助詞「ぞ」の結びは？",choices:["連体形","終止形","已然形","命令形"],answer:0},
        {q:"「徒然草」の作者は？",choices:["兼好法師","清少納言","紫式部","鴨長明"],answer:0},
      ],
      modern: [
        {q:"敬語「拝見する」は何敬語？",choices:["謙譲語","尊敬語","丁寧語","美化語"],answer:0},
        {q:"対義語「肯定」⇔？",choices:["否定","賛成","賞賛","承認"],answer:0},
      ],
    },
    jh3: {
      classic: [
        {q:"「奥の細道」の作者は？",choices:["松尾芭蕉","与謝蕪村","小林一茶","正岡子規"],answer:0},
        {q:"漢文の返り点「レ点」は？",choices:["一字返る","二字以上","読まない","強調"],answer:0},
      ],
      modern: [
        {q:"「夏目漱石」の代表作は？",choices:["坊っちゃん","羅生門","檸檬","舞姫"],answer:0},
        {q:"「擬人法」とは？",choices:["人でないものを人に例える","反復","対比","誇張"],answer:0},
      ],
    },
    hs1: {
      modern: [
        {q:"芥川龍之介の作品は？",choices:["羅生門","雪国","檸檬","舞姫"],answer:0},
        {q:"近代詩人の島崎藤村の代表作は？",choices:["若菜集","抒情小曲集","邪宗門","春と修羅"],answer:0},
      ],
      kanji: [
        {q:"「逡巡」の読みは？",choices:["しゅんじゅん","じゅんかい","ちゅうじゅん","しゅんかん"],answer:0},
        {q:"「忸怩」の意味は？",choices:["恥じ入る","怒る","喜ぶ","悲しむ"],answer:0},
      ],
    },
    hs2: {
      modern: [
        {q:"川端康成の代表作は？",choices:["雪国","羅生門","金閣寺","斜陽"],answer:0},
        {q:"自然主義文学の代表は？",choices:["田山花袋","夏目漱石","森鴎外","芥川"],answer:0},
      ],
      kanji: [
        {q:"「韜晦」の意味は？",choices:["才能を隠す","目立つ","怒る","喜ぶ"],answer:0},
        {q:"「曖昧模糊」の意味は？",choices:["はっきりしない","明確","派手","静か"],answer:0},
      ],
    },
    hs3: {
      modern: [
        {q:"三島由紀夫の代表作は？",choices:["金閣寺","雪国","坊っちゃん","羅生門"],answer:0},
        {q:"村上春樹の代表作は？",choices:["ノルウェイの森","雪国","金閣寺","檸檬"],answer:0},
      ],
      kanji: [
        {q:"「諦観」の意味は？",choices:["悟りの境地","怒り","快楽","興奮"],answer:0},
        {q:"「邂逅」の意味は？",choices:["偶然の出会い","別れ","計画","失敗"],answer:0},
      ],
    },
  },
  social: {
    jh1: {
      civics: [
        {q:"地方自治の長を選ぶのは？",choices:["住民の選挙","国会","内閣","天皇"],answer:0},
        {q:"市町村の議会は？",choices:["地方議会","国会","参議院","衆議院"],answer:0},
      ],
      econ: [
        {q:"お金の役割でないのは？",choices:["重さの単位","価値の尺度","交換手段","貯蔵手段"],answer:0},
        {q:"消費税の現在の税率は？",choices:["10%","8%","5%","15%"],answer:0},
      ],
    },
    jh2: {
      civics: [
        {q:"日本国憲法は何年施行？",choices:["1947年","1889年","1945年","1950年"],answer:0},
        {q:"参政権の代表的な権利は？",choices:["選挙権","教育権","勤労権","生存権"],answer:0},
      ],
      econ: [
        {q:"需要が増えると価格は？",choices:["上がる","下がる","変わらない","ゼロ"],answer:0},
        {q:"日本の通貨単位は？",choices:["円","ドル","ユーロ","元"],answer:0},
      ],
    },
    jh3: {
      geo: [
        {q:"地球の地軸の傾きは？",choices:["23.4°","45°","90°","0°"],answer:0},
        {q:"赤道は緯度何度？",choices:["0°","45°","90°","23°"],answer:0},
      ],
      econ: [
        {q:"国民の三大義務でないのは？",choices:["参政","勤労","納税","教育"],answer:0},
        {q:"独占を禁じる法律は？",choices:["独占禁止法","民法","刑法","会社法"],answer:0},
      ],
    },
    hs1: {
      geo: [
        {q:"プレートの境界で起こるのは？",choices:["地震","干ばつ","台風","津波だけ"],answer:0},
        {q:"季節風の方向が変わる地域は？",choices:["モンスーン地域","砂漠","ツンドラ","熱帯雨林"],answer:0},
      ],
      econ: [
        {q:"GDPとは？",choices:["国内総生産","国民総所得","政府支出","貿易黒字"],answer:0},
        {q:"インフレとは？",choices:["物価上昇","物価下落","失業","金利"],answer:0},
      ],
    },
    hs2: {
      geo: [
        {q:"日本の標準時子午線は東経何度？",choices:["135度","140度","120度","100度"],answer:0},
        {q:"環太平洋造山帯に属するのは？",choices:["日本","ヨーロッパ","インド","アフリカ"],answer:0},
      ],
      econ: [
        {q:"市場経済で価格を決めるのは？",choices:["需要と供給","政府","企業","消費者"],answer:0},
        {q:"日本銀行の役割でないのは？",choices:["税徴収","発券","政府の銀行","銀行の銀行"],answer:0},
      ],
    },
    hs3: {
      geo: [
        {q:"温室効果ガスの主な原因は？",choices:["二酸化炭素","酸素","窒素","水素"],answer:0},
        {q:"持続可能な開発目標の略称は？",choices:["SDGs","WTO","NGO","ODA"],answer:0},
      ],
      civics: [
        {q:"三権分立を唱えたのは？",choices:["モンテスキュー","ルソー","ロック","ホッブズ"],answer:0},
        {q:"基本的人権の自由権で正しいのは？",choices:["表現の自由","選挙権","勤労権","教育権"],answer:0},
      ],
    },
  },
  science: {
    jh1: {
      physics: [
        {q:"光の性質で正しいのは？",choices:["直進","曲線","止まる","ランダム"],answer:0},
        {q:"音は何で伝わる？",choices:["空気","真空","光","重力"],answer:0},
      ],
      chem: [
        {q:"水の状態変化で固体は？",choices:["氷","水","水蒸気","湯気"],answer:0},
        {q:"気体で空気より軽いのは？",choices:["水素","酸素","窒素","二酸化炭素"],answer:0},
      ],
      earth: [
        {q:"地震の揺れの大きさを表すのは？",choices:["震度","風速","気圧","湿度"],answer:0},
        {q:"火山が多い場所は？",choices:["プレート境界","平原","砂漠","海の真ん中"],answer:0},
      ],
    },
    jh2: {
      chem: [
        {q:"水の電気分解で陽極に出るのは？",choices:["酸素","水素","窒素","塩素"],answer:0},
        {q:"化学反応で熱を出すのは？",choices:["発熱反応","吸熱反応","中和","蒸発"],answer:0},
      ],
      bio: [
        {q:"血液中で酸素を運ぶのは？",choices:["赤血球","白血球","血小板","血しょう"],answer:0},
        {q:"消化器官でないのは？",choices:["心臓","胃","小腸","肝臓"],answer:0},
      ],
      earth: [
        {q:"前線の種類でないのは？",choices:["熱前線","寒冷前線","温暖前線","停滞前線"],answer:0},
        {q:"高気圧では風はどう吹く？",choices:["時計回り","反時計回り","上向き","下向き"],answer:0},
      ],
    },
    jh3: {
      chem: [
        {q:"中和でできるのは水と？",choices:["塩","酸","アルカリ","気体"],answer:0},
        {q:"pH7は何性？",choices:["中性","酸性","アルカリ性","強酸"],answer:0},
      ],
      bio: [
        {q:"細胞分裂で半分になるのは？",choices:["染色体数","細胞数","核数","DNA"],answer:0},
        {q:"遺伝の優性を発見したのは？",choices:["メンデル","ダーウィン","パスツール","ニュートン"],answer:0},
      ],
      earth: [
        {q:"太陽系の惑星数は？",choices:["8","9","7","10"],answer:0},
        {q:"月の自転周期は？",choices:["約27日","1日","1年","6ヶ月"],answer:0},
      ],
    },
    hs1: {
      chem: [
        {q:"周期表の縦の列を何という？",choices:["族","周期","系","群"],answer:0},
        {q:"原子番号1の元素は？",choices:["水素","ヘリウム","酸素","炭素"],answer:0},
      ],
      bio: [
        {q:"細胞の遺伝情報を持つのは？",choices:["DNA","細胞膜","葉緑体","液胞"],answer:0},
        {q:"光合成の場所は？",choices:["葉緑体","ミトコンドリア","核","リボソーム"],answer:0},
      ],
      earth: [
        {q:"地球の年齢は約何年？",choices:["46億年","100万年","1億年","500億年"],answer:0},
        {q:"恒星のエネルギー源は？",choices:["核融合","核分裂","化学反応","摩擦"],answer:0},
      ],
    },
    hs2: {
      chem: [
        {q:"モル質量の単位は？",choices:["g/mol","mol","g","L"],answer:0},
        {q:"酸とアルカリの中和の生成物は？",choices:["塩と水","酸素","水素","熱だけ"],answer:0},
      ],
      bio: [
        {q:"ATPの役割は？",choices:["エネルギー貯蔵","遺伝","防御","運搬"],answer:0},
        {q:"進化論を提唱したのは？",choices:["ダーウィン","メンデル","パスツール","ニュートン"],answer:0},
      ],
      earth: [
        {q:"大気圧の単位で正しいのは？",choices:["hPa","°C","kg","V"],answer:0},
        {q:"温帯低気圧の特徴は？",choices:["前線を伴う","熱帯発生","風がない","台風"],answer:0},
      ],
    },
    hs3: {
      chem: [
        {q:"有機化合物に必ず含まれるのは？",choices:["炭素","窒素","硫黄","鉄"],answer:0},
        {q:"アルコールの官能基は？",choices:["-OH","-COOH","-NH2","-CHO"],answer:0},
      ],
      bio: [
        {q:"DNAの構造を発見したのは？",choices:["ワトソンとクリック","メンデル","ダーウィン","パスツール"],answer:0},
        {q:"ホルモンを分泌するのは？",choices:["内分泌腺","外分泌腺","筋肉","神経"],answer:0},
      ],
    },
  },
  history: {
    jh1: {
      world: [
        {q:"四大文明でないのは？",choices:["日本文明","エジプト","メソポタミア","インダス"],answer:0},
        {q:"ピラミッドを建てた文明は？",choices:["エジプト","ローマ","ギリシャ","中国"],answer:0},
      ],
      ancient: [
        {q:"古代ローマの言語は？",choices:["ラテン語","ギリシャ語","アラビア語","英語"],answer:0},
        {q:"古代オリンピックの開催地は？",choices:["オリンピア","アテネ","スパルタ","ローマ"],answer:0},
      ],
    },
    jh2: {
      world: [
        {q:"ルネサンスが始まった国は？",choices:["イタリア","フランス","イギリス","ドイツ"],answer:0},
        {q:"十字軍の目的地は？",choices:["エルサレム","ローマ","カイロ","アテネ"],answer:0},
      ],
      ancient: [
        {q:"古代中国の最初の統一王朝は？",choices:["秦","漢","唐","明"],answer:0},
        {q:"古代インドのカースト最上位は？",choices:["バラモン","クシャトリヤ","ヴァイシャ","シュードラ"],answer:0},
      ],
    },
    jh3: {
      world: [
        {q:"フランス革命の年は？",choices:["1789年","1776年","1804年","1815年"],answer:0},
        {q:"アメリカ独立宣言の年は？",choices:["1776年","1789年","1804年","1812年"],answer:0},
      ],
      ancient: [
        {q:"ハンムラビ法典の文明は？",choices:["メソポタミア","エジプト","ギリシャ","インダス"],answer:0},
        {q:"古代エジプトの文字は？",choices:["ヒエログリフ","楔形","アルファベット","甲骨"],answer:0},
      ],
    },
    hs1: {
      japan: [
        {q:"鎌倉幕府を開いたのは？",choices:["源頼朝","足利尊氏","徳川家康","平清盛"],answer:0},
        {q:"江戸幕府を開いたのは？",choices:["徳川家康","織田信長","豊臣秀吉","明智光秀"],answer:0},
      ],
      ancient: [
        {q:"ローマ帝国の初代皇帝は？",choices:["アウグストゥス","カエサル","ネロ","ハドリアヌス"],answer:0},
        {q:"古代ギリシャの哲学者は？",choices:["ソクラテス","シーザー","クレオパトラ","ハンニバル"],answer:0},
      ],
    },
    hs2: {
      japan: [
        {q:"明治維新の年は？",choices:["1868年","1853年","1889年","1877年"],answer:0},
        {q:"大日本帝国憲法発布年は？",choices:["1889年","1868年","1890年","1894年"],answer:0},
      ],
      ancient: [
        {q:"古代の四大文明で正しいのは？",choices:["メソポタミア","アステカ","インカ","マヤ"],answer:0},
        {q:"始皇帝が統一した国は？",choices:["中国","インド","日本","ローマ"],answer:0},
      ],
    },
    hs3: {
      japan: [
        {q:"第二次世界大戦終結は何年？",choices:["1945年","1941年","1939年","1950年"],answer:0},
        {q:"日本国憲法施行は何年？",choices:["1947年","1945年","1950年","1952年"],answer:0},
      ],
      ancient: [
        {q:"古代エジプトの神で太陽神は？",choices:["ラー","オシリス","アヌビス","ホルス"],answer:0},
        {q:"古代ギリシャの民主政が発達したのは？",choices:["アテネ","スパルタ","コリント","テーベ"],answer:0},
      ],
    },
  },
};

// ─── さらなる追加問題プール（量を増やす） ─────────
const GRADE_TOPIC_EXTRA2 = {
  english: {
    jh1: {
      vocab: [
        {q:"「red」の意味は？",choices:["赤","青","黄","緑"],answer:0},
        {q:"「water」の意味は？",choices:["水","火","土","風"],answer:0},
        {q:"「pencil」の意味は？",choices:["鉛筆","消しゴム","ノート","本"],answer:0},
        {q:"「mother」の意味は？",choices:["母","父","姉","妹"],answer:0},
        {q:"「teacher」の意味は？",choices:["先生","生徒","医者","農家"],answer:0},
        {q:"「Sunday」の意味は？",choices:["日曜日","月曜日","土曜日","金曜日"],answer:0},
        {q:"「winter」の意味は？",choices:["冬","春","夏","秋"],answer:0},
        {q:"「small」の意味は？",choices:["小さい","大きい","重い","軽い"],answer:0},
        {q:"「happy」の意味は？",choices:["うれしい","かなしい","怒った","眠い"],answer:0},
        {q:"「run」の意味は？",choices:["走る","歩く","泳ぐ","飛ぶ"],answer:0},
      ],
      grammar: [
        {q:"「私は太郎です」I ___ Taro.",choices:["am","is","are","be"],answer:0},
        {q:"「彼女は学生」She ___ a student.",choices:["is","am","are","be"],answer:0},
        {q:"「私たちは~」We ___...",choices:["are","is","am","be"],answer:0},
        {q:"「これは~ですか？」___ this a book?",choices:["Is","Are","Am","Do"],answer:0},
        {q:"複数形: child →？",choices:["children","childs","childes","childies"],answer:0},
        {q:"否定文「私は~ではない」I ___ not...",choices:["am","is","are","be"],answer:0},
        {q:"「彼は走る」He ___s.",choices:["run","runs","running","ran"],answer:1},
        {q:"「~がある」There ___ a pen.",choices:["is","are","am","be"],answer:0},
      ],
    },
    jh2: {
      vocab: [
        {q:"「always」の意味は？",choices:["いつも","時々","決して","ふだん"],answer:0},
        {q:"「remember」の意味は？",choices:["覚える","忘れる","知る","教える"],answer:0},
        {q:"「different」の意味は？",choices:["違う","同じ","似た","等しい"],answer:0},
        {q:"「example」の意味は？",choices:["例","結果","原因","理由"],answer:0},
        {q:"「dream」の意味は？",choices:["夢","希望","失敗","成功"],answer:0},
        {q:"「important」の意味は？",choices:["重要な","小さい","古い","軽い"],answer:0},
        {q:"「careful」の意味は？",choices:["注意深い","怠惰な","危険な","急ぐ"],answer:0},
        {q:"「easy」の意味は？",choices:["簡単","難しい","新しい","遅い"],answer:0},
      ],
      grammar: [
        {q:"未来形「~するつもり」I ___ go.",choices:["will","do","am","is"],answer:0},
        {q:"過去進行形 was ___",choices:["~ing","~ed","原形","過去分詞"],answer:0},
        {q:"「~することが好き」I like ___.",choices:["to play","play","plays","played"],answer:0},
        {q:"比較級「より良い」",choices:["better","gooder","more good","best"],answer:0},
        {q:"最上級「最高の」",choices:["best","better","goodest","most good"],answer:0},
        {q:"接続詞「~なので」",choices:["because","but","or","and"],answer:0},
        {q:"「~したい」I want ___ go.",choices:["to","for","at","in"],answer:0},
        {q:"「~してもいい？」___ I open it?",choices:["May","Do","Am","Be"],answer:0},
      ],
    },
    jh3: {
      vocab: [
        {q:"「decide」の意味は？",choices:["決める","迷う","忘れる","続ける"],answer:0},
        {q:"「receive」の意味は？",choices:["受け取る","送る","捨てる","返す"],answer:0},
        {q:"「improve」の意味は？",choices:["改善する","悪化する","維持する","壊す"],answer:0},
        {q:"「discover」の意味は？",choices:["発見する","隠す","失う","作る"],answer:0},
        {q:"「prepare」の意味は？",choices:["準備する","終える","休む","食べる"],answer:0},
        {q:"「communicate」の意味は？",choices:["伝え合う","黙る","拒否する","勝つ"],answer:0},
      ],
      grammar: [
        {q:"完了形「~してしまった」have ___",choices:["過去分詞","原形","現在形","ing形"],answer:0},
        {q:"受動態「~される」be + ___",choices:["過去分詞","ing","原形","to不定詞"],answer:0},
        {q:"関係代名詞「もの」",choices:["which","who","whose","whom"],answer:0},
        {q:"関係代名詞「人」",choices:["who","which","whose","what"],answer:0},
        {q:"「~するための」目的のto",choices:["to+原形","for+ing","of+ing","on+原形"],answer:0},
        {q:"「~するほど」so ~ that",choices:["~なほど…","~でも","~けれど","~なら"],answer:0},
      ],
    },
    hs1: {
      vocab: [
        {q:"「achievement」の意味は？",choices:["達成","失敗","挑戦","希望"],answer:0},
        {q:"「previous」の意味は？",choices:["前の","次の","現在の","遠い"],answer:0},
        {q:"「specific」の意味は？",choices:["具体的な","曖昧な","一般的な","抽象的な"],answer:0},
        {q:"「necessary」の意味は？",choices:["必要な","不要な","便利な","危険な"],answer:0},
        {q:"「opportunity」の意味は？",choices:["機会","危険","責任","規則"],answer:0},
      ],
      grammar: [
        {q:"仮定法過去「もし~なら」If I ___",choices:["were/V過去","am","will be","being"],answer:0},
        {q:"使役動詞「~させる」have/make/let",choices:["原形","to+原形","ing","過去分詞"],answer:0},
        {q:"分詞構文「~しながら」",choices:["~ing","to+原形","to不定詞","過去分詞"],answer:0},
      ],
    },
    hs2: {
      vocab: [
        {q:"「inevitable」の意味は？",choices:["避けられない","選べる","遠い","古い"],answer:0},
        {q:"「sophisticated」の意味は？",choices:["洗練された","単純な","古い","遅い"],answer:0},
        {q:"「acknowledge」の意味は？",choices:["認める","否定する","隠す","強調する"],answer:0},
        {q:"「circumstance」の意味は？",choices:["状況","結果","原因","理由"],answer:0},
      ],
      grammar: [
        {q:"仮定法過去完了「~だったら」",choices:["had+過去分詞","were+ing","will+原形","be+過去分詞"],answer:0},
        {q:"倒置「neverを文頭」",choices:["疑問文の語順","通常語順","ing形","受身"],answer:0},
      ],
    },
    hs3: {
      vocab: [
        {q:"「unprecedented」の意味は？",choices:["前例のない","平凡な","予測可能な","重要な"],answer:0},
        {q:"「discrepancy」の意味は？",choices:["不一致","一致","完全","均衡"],answer:0},
        {q:"「indispensable」の意味は？",choices:["不可欠な","不要な","便利な","危険な"],answer:0},
        {q:"「meticulous」の意味は？",choices:["細心の","雑な","遅い","早い"],answer:0},
      ],
      grammar: [
        {q:"強調「It is X that...」のXに置けないのは？",choices:["動詞","名詞","副詞","場所"],answer:0},
        {q:"省略構文「if any」の意味は？",choices:["もしあれば","いつも","決して","必ず"],answer:0},
      ],
    },
  },
  math: {
    jh1: {
      calc: [
        {q:"5 + (-3) = ?",choices:["2","-2","8","-8"],answer:0},
        {q:"(-4) - (-2) = ?",choices:["-2","-6","2","6"],answer:0},
        {q:"6 × (-2) = ?",choices:["-12","12","8","-8"],answer:0},
        {q:"(-15) ÷ 3 = ?",choices:["-5","5","-3","3"],answer:0},
        {q:"2 + 3 × 4 = ?",choices:["14","20","9","11"],answer:0},
        {q:"(-2)² = ?",choices:["4","-4","2","-2"],answer:0},
        {q:"3x = 12 のとき x = ?",choices:["4","3","9","36"],answer:0},
        {q:"x - 5 = 7 のとき x = ?",choices:["12","2","-12","35"],answer:0},
      ],
      geometry: [
        {q:"円の面積の公式は？",choices:["πr²","2πr","πd","r²"],answer:0},
        {q:"円周の長さの公式は？",choices:["2πr","πr²","r²","πr"],answer:0},
        {q:"三角形の面積は底辺×高さ÷？",choices:["2","3","4","1"],answer:0},
        {q:"直角は何度？",choices:["90°","45°","180°","60°"],answer:0},
      ],
    },
    jh2: {
      calc: [
        {q:"2(x+3) = 14 のとき x = ?",choices:["4","8","7","2"],answer:0},
        {q:"3x + 2 = 11 のとき x = ?",choices:["3","2","9","13"],answer:0},
        {q:"連立方程式: x+y=5, x-y=1 のとき x = ?",choices:["3","2","4","1"],answer:0},
        {q:"(2x+3)+(x-1) を簡単に",choices:["3x+2","2x+2","3x+4","x+2"],answer:0},
        {q:"3(x+2) を展開すると？",choices:["3x+6","x+5","3x+2","x+6"],answer:0},
      ],
      geometry: [
        {q:"三角形の外角は内対角の和？",choices:["はい","いいえ","半分","2倍"],answer:0},
        {q:"平行線で錯角は？",choices:["等しい","補角","直角","異なる"],answer:0},
        {q:"多角形の内角の和の公式は？",choices:["(n-2)×180","n×180","n²","360"],answer:0},
      ],
    },
    jh3: {
      calc: [
        {q:"√25 = ?",choices:["5","25","±5","√25"],answer:0},
        {q:"√3 × √12 = ?",choices:["6","√36","12","3"],answer:0},
        {q:"x² - 9 = 0 のとき x = ?",choices:["±3","3","-3","9"],answer:0},
        {q:"二次方程式の解の公式の「2a」はどこ？",choices:["分母","分子","平方根の中","符号"],answer:0},
      ],
      geometry: [
        {q:"円周角の定理: 同じ弧の円周角は？",choices:["等しい","半分","2倍","補角"],answer:0},
        {q:"相似な図形の対応辺の比は？",choices:["一定","異なる","直角","平行"],answer:0},
      ],
    },
    hs1: {
      calc: [
        {q:"2x² + x - 1 を因数分解",choices:["(2x-1)(x+1)","(x-1)(2x+1)","(2x+1)(x-1)","(x+1)(2x-1)"],answer:0},
        {q:"x² - 16 を因数分解",choices:["(x+4)(x-4)","(x-4)²","(x+4)²","(x-16)"],answer:0},
        {q:"|x-3| < 2 を解くと？",choices:["1<x<5","x<1","x>5","-2<x<2"],answer:0},
      ],
      geometry: [
        {q:"sin60° = ?",choices:["√3/2","1/2","1/√2","1"],answer:0},
        {q:"tan45° = ?",choices:["1","√3","1/√3","0"],answer:0},
        {q:"余弦定理: cosA = ?",choices:["(b²+c²-a²)/2bc","a/sinA","b+c-a","b²+c²"],answer:0},
      ],
      prob: [
        {q:"場合の数で「組合せ」の記号は？",choices:["C","P","E","V"],answer:0},
        {q:"順列5P3の値は？",choices:["60","20","10","120"],answer:0},
      ],
    },
    hs2: {
      calc: [
        {q:"log₁₀ 100 = ?",choices:["2","10","100","1"],answer:0},
        {q:"2^5 = ?",choices:["32","16","25","10"],answer:0},
        {q:"等比数列でr=2,初項3のとき第4項は？",choices:["24","12","16","8"],answer:0},
      ],
      quadratic: [
        {q:"x² - 4x + 4 = ?",choices:["(x-2)²","(x+2)²","(x-2)(x+2)","x²-4"],answer:0},
        {q:"y = x² - 2x + 3 の頂点は？",choices:["(1,2)","(2,1)","(-1,2)","(1,3)"],answer:0},
      ],
    },
    hs3: {
      calc: [
        {q:"∫(2x+3)dx = ?",choices:["x²+3x+C","2x²+3x","x²+3","2x+3x+C"],answer:0},
        {q:"d/dx(x³) = ?",choices:["3x²","x²","3x","x³"],answer:0},
        {q:"極限 lim(x→∞) 1/x = ?",choices:["0","∞","1","-1"],answer:0},
      ],
    },
  },
  japanese: {
    jh1: {
      kanji: [
        {q:"「友達」の読みは？",choices:["ともだち","ゆうだち","ともたち","ゆうたつ"],answer:0},
        {q:"「家族」の読みは？",choices:["かぞく","いえぞく","かみぞく","やぞく"],answer:0},
        {q:"「学校」の読みは？",choices:["がっこう","がくしゃ","がくこう","まなびや"],answer:0},
        {q:"「先生」の読みは？",choices:["せんせい","さきうまれ","せんしょう","せんじょ"],answer:0},
        {q:"反対語「上手」⇔？",choices:["下手","上達","得意","熟練"],answer:0},
        {q:"類義語「努力」≒？",choices:["奮闘","休息","怠惰","放棄"],answer:0},
      ],
      modern: [
        {q:"「主語」とは何を表す？",choices:["~が・~は","~を","~に","~で"],answer:0},
        {q:"「述語」とは？",choices:["どうする","誰が","何の","いつ"],answer:0},
        {q:"修飾語の働きは？",choices:["詳しくする","主語","述語","句読点"],answer:0},
        {q:"段落の最初は何マス下げる？",choices:["1マス","2マス","下げない","半マス"],answer:0},
      ],
    },
    jh2: {
      kanji: [
        {q:"「経験」の読みは？",choices:["けいけん","けいげん","つねけん","けいたつ"],answer:0},
        {q:"「未来」の読みは？",choices:["みらい","みき","みらいき","びらい"],answer:0},
        {q:"「興味」の読みは？",choices:["きょうみ","こうみ","おきみ","きみ"],answer:0},
        {q:"類義語「容易」≒？",choices:["簡単","困難","複雑","重要"],answer:0},
        {q:"四字熟語「一石二鳥」の意味は？",choices:["一つで二つ得る","二つ失う","二度繰り返す","一度きり"],answer:0},
        {q:"故事成語「百聞は一見に~」",choices:["如かず","及ばず","勝る","等しい"],answer:0},
      ],
      classic: [
        {q:"係助詞「ぞ・なむ」の結びは？",choices:["連体形","已然形","終止形","未然形"],answer:0},
        {q:"古文「いと」の意味は？",choices:["とても","少し","決して","ふつう"],answer:0},
        {q:"「をかし」の意味は？",choices:["趣がある","おかしい","悲しい","怖い"],answer:0},
      ],
    },
    jh3: {
      classic: [
        {q:"漢文の返り点「一・二点」は？",choices:["二字以上返る","一字返る","読まない","強調"],answer:0},
        {q:"「奥の細道」の文学ジャンルは？",choices:["紀行文","小説","随筆","和歌"],answer:0},
        {q:"古文「めでたし」の意味は？",choices:["立派だ","祝う","目立つ","赤い"],answer:0},
        {q:"「平家物語」の冒頭の意味は？",choices:["諸行無常","愛","勝利","旅"],answer:0},
      ],
      modern: [
        {q:"「夏目漱石」の作品は？",choices:["こころ","羅生門","檸檬","雪国"],answer:0},
        {q:"芥川賞は誰の名前？",choices:["芥川龍之介","夏目漱石","川端康成","太宰治"],answer:0},
        {q:"私小説とは？",choices:["作者の実体験","空想物語","推理小説","歴史小説"],answer:0},
      ],
      kanji: [
        {q:"「躊躇」の読みは？",choices:["ちゅうちょ","じゅんかい","とうじ","しゅうじ"],answer:0},
        {q:"「払拭」の意味は？",choices:["ぬぐい去る","加える","強調する","変える"],answer:0},
      ],
    },
    hs1: {
      classic: [
        {q:"古文の助動詞「べし」の意味は？",choices:["推量・当然","否定","完了","受身"],answer:0},
        {q:"「ありがたし」の意味は？",choices:["めったにない","感謝する","ありふれた","当然"],answer:0},
        {q:"枕草子の文学ジャンルは？",choices:["随筆","物語","日記","和歌集"],answer:0},
      ],
      modern: [
        {q:"森鴎外の作品は？",choices:["舞姫","坊っちゃん","羅生門","檸檬"],answer:0},
        {q:"近代詩で口語自由詩を確立したのは？",choices:["萩原朔太郎","島崎藤村","北原白秋","正岡子規"],answer:0},
      ],
      kanji: [
        {q:"「敷衍」の意味は？",choices:["広めて説明","省略する","強調する","否定する"],answer:0},
        {q:"「示唆」の意味は？",choices:["それとなく示す","直接命令","強制する","拒否する"],answer:0},
      ],
    },
    hs2: {
      classic: [
        {q:"係助詞「こそ」の結びは？",choices:["已然形","連体形","終止形","未然形"],answer:0},
        {q:"和歌の「掛詞」とは？",choices:["一語二意","対句","反復","誇張"],answer:0},
        {q:"「方丈記」の主題は？",choices:["無常観","恋愛","戦記","旅"],answer:0},
      ],
      modern: [
        {q:"川端康成のノーベル文学賞受賞作は？",choices:["雪国","千羽鶴","古都","伊豆の踊子"],answer:0},
        {q:"プロレタリア文学の代表は？",choices:["蟹工船","坊っちゃん","羅生門","金閣寺"],answer:0},
      ],
    },
    hs3: {
      classic: [
        {q:"「源氏物語」の文体は？",choices:["和文","漢文","軍記","紀行"],answer:0},
        {q:"漢文「使役」の助字は？",choices:["使・令","不・非","可・能","也・矣"],answer:0},
      ],
      modern: [
        {q:"村上春樹の代表作は？",choices:["ノルウェイの森","雪国","金閣寺","檸檬"],answer:0},
        {q:"三島由紀夫の「金閣寺」のテーマは？",choices:["美への執着","戦争","恋愛","旅"],answer:0},
      ],
    },
  },
  social: {
    jh1: {
      geo: [
        {q:"世界の七大陸でないのは？",choices:["太平洋","アフリカ","南極","ユーラシア"],answer:0},
        {q:"日本の四大島でないのは？",choices:["沖縄","本州","北海道","九州"],answer:0},
        {q:"日本最北端の島は？",choices:["択捉島","北海道","与那国島","硫黄島"],answer:0},
        {q:"日本最南端は？",choices:["沖ノ鳥島","与那国島","南鳥島","硫黄島"],answer:0},
        {q:"日本最東端は？",choices:["南鳥島","沖ノ鳥島","択捉島","与那国島"],answer:0},
        {q:"日本最西端は？",choices:["与那国島","沖ノ鳥島","南鳥島","北方四島"],answer:0},
      ],
    },
    jh2: {
      geo: [
        {q:"日本の人口は約何人？",choices:["約1.2億人","約8千万人","約5億人","約2億人"],answer:0},
        {q:"日本最大の湖は？",choices:["琵琶湖","霞ヶ浦","諏訪湖","浜名湖"],answer:0},
        {q:"日本最長の川は？",choices:["信濃川","利根川","石狩川","北上川"],answer:0},
        {q:"扇状地が広がる山梨の盆地は？",choices:["甲府盆地","松本盆地","長野盆地","奈良盆地"],answer:0},
        {q:"近郊農業で有名な千葉県は？",choices:["首都圏供給","北海道","東北","九州"],answer:0},
      ],
      civics: [
        {q:"国会議員は誰が選ぶ？",choices:["国民","内閣","天皇","議長"],answer:0},
        {q:"地方議会の議員選挙は何年に1回？",choices:["4年","6年","8年","2年"],answer:0},
        {q:"市町村長を選ぶ選挙は？",choices:["直接選挙","間接選挙","くじ引き","議会指名"],answer:0},
      ],
    },
    jh3: {
      geo: [
        {q:"オーストラリアの首都は？",choices:["キャンベラ","シドニー","メルボルン","パース"],answer:0},
        {q:"イタリアの首都は？",choices:["ローマ","ミラノ","ベネチア","ナポリ"],answer:0},
        {q:"ブラジルで話されている言語は？",choices:["ポルトガル語","スペイン語","英語","仏語"],answer:0},
      ],
      civics: [
        {q:"国民の三大義務でないのは？",choices:["参政","勤労","納税","教育"],answer:0},
        {q:"基本的人権の自由権の例は？",choices:["表現の自由","選挙権","勤労権","教育権"],answer:0},
        {q:"裁判所の最終審は？",choices:["最高裁","地裁","高裁","家裁"],answer:0},
      ],
    },
    hs1: {
      civics: [
        {q:"民主主義の原則「多数決」の例外は？",choices:["少数意見尊重","全会一致","くじ引き","世襲"],answer:0},
        {q:"内閣総理大臣の任命は誰？",choices:["天皇","国民","国会","議長"],answer:0},
        {q:"憲法改正の発議は何分の何の賛成？",choices:["3分の2","過半数","4分の3","全員"],answer:0},
      ],
      econ: [
        {q:"市場経済の対義語は？",choices:["計画経済","封建経済","奴隷経済","資本経済"],answer:0},
        {q:"通貨の機能でないのは？",choices:["重さ","価値尺度","交換手段","貯蔵手段"],answer:0},
      ],
    },
    hs2: {
      econ: [
        {q:"需要曲線の形は？",choices:["右下がり","右上がり","水平","垂直"],answer:0},
        {q:"供給曲線の形は？",choices:["右上がり","右下がり","水平","垂直"],answer:0},
        {q:"独占禁止法を運用するのは？",choices:["公正取引委員会","金融庁","総務省","財務省"],answer:0},
      ],
      civics: [
        {q:"日本の議会制度は？",choices:["二院制","一院制","三院制","議会なし"],answer:0},
        {q:"参議院の任期は？",choices:["6年","4年","8年","終身"],answer:0},
      ],
    },
    hs3: {
      econ: [
        {q:"「見えざる手」を説いた経済学者は？",choices:["アダム・スミス","ケインズ","マルクス","リカード"],answer:0},
        {q:"国際収支の経常収支に含むのは？",choices:["貿易収支","資本移転","直接投資","証券投資"],answer:0},
        {q:"日本国憲法第9条の主旨は？",choices:["戦争放棄","国民主権","三権分立","地方自治"],answer:0},
      ],
    },
  },
  science: {
    jh1: {
      bio: [
        {q:"植物の三大栄養素でないのは？",choices:["カルシウム","窒素","リン","カリウム"],answer:0},
        {q:"動物で背骨があるのは？",choices:["脊椎動物","無脊椎動物","昆虫","軟体動物"],answer:0},
        {q:"植物の根の主な働きは？",choices:["水の吸収","光合成","受粉","蒸散"],answer:0},
        {q:"昆虫の特徴で正しいのは？",choices:["足が6本","足が8本","背骨あり","変温哺乳類"],answer:0},
      ],
      earth: [
        {q:"地震の揺れの大きさを表すのは？",choices:["震度","風速","気圧","湿度"],answer:0},
        {q:"火山が多い場所は？",choices:["プレート境界","平原","砂漠","海底中央"],answer:0},
        {q:"地球の形は？",choices:["わずかに楕円","完全な球","円盤","三角"],answer:0},
        {q:"日本が属するプレートでないのは？",choices:["アフリカ","北米","ユーラシア","太平洋"],answer:0},
      ],
    },
    jh2: {
      physics: [
        {q:"電気抵抗の単位は？",choices:["Ω","V","A","W"],answer:0},
        {q:"電力の単位は？",choices:["W","V","A","Ω"],answer:0},
        {q:"並列回路の電圧は？",choices:["どこも同じ","場所により異なる","ゼロ","無限"],answer:0},
        {q:"直列回路の電流は？",choices:["どこも同じ","場所により異なる","ゼロ","無限"],answer:0},
      ],
      chem: [
        {q:"原子の中で正電荷は？",choices:["陽子","電子","中性子","原子核全体"],answer:0},
        {q:"電子の電荷は？",choices:["負","正","ゼロ","変化する"],answer:0},
        {q:"水素の化学式は？",choices:["H₂","H","H₂O","OH"],answer:0},
      ],
    },
    jh3: {
      physics: [
        {q:"仕事の単位は？",choices:["J(ジュール)","W","N","Pa"],answer:0},
        {q:"運動エネルギーの式は？",choices:["1/2mv²","mgh","mv","gh"],answer:0},
        {q:"位置エネルギーの式は？",choices:["mgh","1/2mv²","mv","gh"],answer:0},
      ],
      bio: [
        {q:"DNAの基本単位は？",choices:["ヌクレオチド","アミノ酸","タンパク質","糖"],answer:0},
        {q:"遺伝子の存在場所は？",choices:["核","ミトコンドリア","葉緑体","液胞"],answer:0},
      ],
    },
    hs1: {
      physics: [
        {q:"運動の3法則を提唱したのは？",choices:["ニュートン","アインシュタイン","ガリレオ","ボーア"],answer:0},
        {q:"等加速度運動で速度は？",choices:["時間に比例","一定","時間の2乗","距離に比例"],answer:0},
      ],
      chem: [
        {q:"周期表の縦の列を何という？",choices:["族","周期","系","群"],answer:0},
        {q:"原子番号と等しいのは？",choices:["陽子数","中性子数","電子の質量","原子量"],answer:0},
      ],
      bio: [
        {q:"細胞の遺伝情報を持つのは？",choices:["DNA","RNA","タンパク質","脂質"],answer:0},
        {q:"光合成の場は？",choices:["葉緑体","ミトコンドリア","核","リボソーム"],answer:0},
      ],
    },
    hs2: {
      physics: [
        {q:"運動量保存則は何で成り立つ？",choices:["外力なし","外力あり","摩擦下","重力下のみ"],answer:0},
        {q:"波の速さ v = ?",choices:["fλ","f/λ","λ/f","f+λ"],answer:0},
      ],
      chem: [
        {q:"アボガドロ数は約？",choices:["6.02×10²³","6.02×10²²","6.02×10²⁴","6.02×10²¹"],answer:0},
        {q:"pH7は何性？",choices:["中性","酸性","アルカリ性","強酸"],answer:0},
      ],
    },
    hs3: {
      physics: [
        {q:"ドップラー効果が起こるのは？",choices:["相対運動時","静止時","真空中のみ","低温時"],answer:0},
        {q:"光は何の波？",choices:["電磁波","音波","縦波","物質波のみ"],answer:0},
      ],
      chem: [
        {q:"有機化合物に必ず含まれるのは？",choices:["炭素","窒素","硫黄","鉄"],answer:0},
        {q:"アルコールの官能基は？",choices:["-OH","-COOH","-NH₂","-CHO"],answer:0},
      ],
    },
  },
  history: {
    jh1: {
      japan: [
        {q:"日本最古の土器は？",choices:["縄文土器","弥生土器","須恵器","埴輪"],answer:0},
        {q:"卑弥呼が治めた国は？",choices:["邪馬台国","大和国","出雲国","越国"],answer:0},
        {q:"聖徳太子が定めたのは？",choices:["十七条憲法","大宝律令","御成敗式目","武家諸法度"],answer:0},
        {q:"奈良の大仏を建てた天皇は？",choices:["聖武天皇","推古天皇","桓武天皇","天武天皇"],answer:0},
        {q:"平安京遷都は何年？",choices:["794年","710年","645年","1192年"],answer:0},
        {q:"摂関政治を行ったのは？",choices:["藤原氏","平氏","源氏","蘇我氏"],answer:0},
      ],
    },
    jh2: {
      japan: [
        {q:"鎌倉幕府を開いたのは？",choices:["源頼朝","足利尊氏","徳川家康","平清盛"],answer:0},
        {q:"室町幕府を開いたのは？",choices:["足利尊氏","源頼朝","徳川家康","北条時宗"],answer:0},
        {q:"応仁の乱が起きた時代は？",choices:["室町","鎌倉","江戸","平安"],answer:0},
        {q:"鉄砲伝来は何年？",choices:["1543年","1492年","1573年","1600年"],answer:0},
        {q:"江戸幕府を開いたのは？",choices:["徳川家康","織田信長","豊臣秀吉","明智光秀"],answer:0},
        {q:"鎖国が完成したのは？",choices:["1639年","1600年","1700年","1500年"],answer:0},
      ],
    },
    jh3: {
      japan: [
        {q:"明治維新の年は？",choices:["1868年","1853年","1889年","1877年"],answer:0},
        {q:"大日本帝国憲法発布は何年？",choices:["1889年","1868年","1890年","1894年"],answer:0},
        {q:"日清戦争は何年？",choices:["1894-95年","1904-05年","1914年","1937年"],answer:0},
        {q:"日露戦争は何年？",choices:["1904-05年","1894-95年","1914年","1937年"],answer:0},
        {q:"第二次大戦終戦は何年？",choices:["1945年","1941年","1939年","1950年"],answer:0},
        {q:"日本国憲法施行は何年？",choices:["1947年","1945年","1950年","1952年"],answer:0},
      ],
    },
    hs1: {
      world: [
        {q:"四大文明でないのは？",choices:["日本文明","エジプト","メソポタミア","インダス"],answer:0},
        {q:"ピラミッドを建てた文明は？",choices:["エジプト","ローマ","ギリシャ","中国"],answer:0},
        {q:"ローマ帝国の初代皇帝は？",choices:["アウグストゥス","カエサル","ネロ","ハドリアヌス"],answer:0},
        {q:"ルネサンスが始まった国は？",choices:["イタリア","フランス","イギリス","ドイツ"],answer:0},
        {q:"宗教改革を始めたのは？",choices:["ルター","カルヴァン","ザビエル","ローマ教皇"],answer:0},
      ],
    },
    hs2: {
      world: [
        {q:"フランス革命の年は？",choices:["1789年","1776年","1804年","1815年"],answer:0},
        {q:"アメリカ独立宣言の年は？",choices:["1776年","1789年","1492年","1865年"],answer:0},
        {q:"産業革命が始まった国は？",choices:["イギリス","フランス","ドイツ","アメリカ"],answer:0},
        {q:"ナポレオンの出身地は？",choices:["コルシカ島","パリ","マルセイユ","リヨン"],answer:0},
        {q:"アヘン戦争の当事国は？",choices:["英と清","日と清","米と英","仏と清"],answer:0},
      ],
    },
    hs3: {
      world: [
        {q:"第一次世界大戦の開戦年は？",choices:["1914年","1939年","1900年","1918年"],answer:0},
        {q:"ロシア革命の年は？",choices:["1917年","1905年","1922年","1914年"],answer:0},
        {q:"世界恐慌の年は？",choices:["1929年","1939年","1919年","1945年"],answer:0},
        {q:"ベルリンの壁崩壊は何年？",choices:["1989年","1991年","1985年","2000年"],answer:0},
        {q:"国連設立は何年？",choices:["1945年","1919年","1939年","1950年"],answer:0},
      ],
    },
  },
};

const SUBTOPICS = {
  english: [
    { id:"vocab",     label:"単語の意味",    icon:"📖" },
    { id:"grammar",   label:"文法",          icon:"✍️" },
    { id:"idiom",     label:"熟語・慣用句",  icon:"💬" },
    { id:"listening", label:"リスニング",    icon:"🎧" },
    { id:"speaking",  label:"スピーキング",  icon:"🎤" },
  ],
  math: [
    { id:"calc",      label:"計算",          icon:"🔢" },
    { id:"quadratic", label:"二次関数",      icon:"📈" },
    { id:"geometry",  label:"図形",          icon:"📐" },
    { id:"prob",      label:"確率・統計",    icon:"🎲" },
  ],
  japanese: [
    { id:"classic",   label:"古文・漢文",    icon:"📜" },
    { id:"modern",    label:"現代文",        icon:"📚" },
    { id:"kanji",     label:"漢字・四字熟語",icon:"🈯" },
  ],
  social: [
    { id:"geo",       label:"地理",          icon:"🗺️" },
    { id:"civics",    label:"公民・政治",    icon:"⚖️" },
    { id:"econ",      label:"経済",          icon:"💴" },
  ],
  science: [
    { id:"physics",   label:"物理",          icon:"⚛️" },
    { id:"chem",      label:"化学",          icon:"🧪" },
    { id:"bio",       label:"生物",          icon:"🧬" },
    { id:"earth",     label:"地学",          icon:"🌍" },
  ],
  history: [
    { id:"japan",     label:"日本史",        icon:"⛩️" },
    { id:"world",     label:"世界史",        icon:"🌐" },
    { id:"ancient",   label:"古代史",        icon:"🏛️" },
  ],
};

const TOPIC_QUESTIONS = {
  english_vocab: [
    {q:"「ambitious」の意味は？",choices:["野心的な","臆病な","遅い","厳しい"],answer:0},
    {q:"「fragile」の意味は？",choices:["強い","壊れやすい","美しい","重い"],answer:1},
    {q:"「abandon」の意味は？",choices:["集める","見捨てる","作る","眠る"],answer:1},
    {q:"「sincere」の意味は？",choices:["嘘の","誠実な","怠惰な","危険な"],answer:1},
    {q:"「prohibit」の意味は？",choices:["許可する","禁止する","推奨する","延期する"],answer:1},
    {q:"「meticulous」の意味は？",choices:["大雑把な","几帳面な","怠惰な","活発な"],answer:1},
    {q:"「abundant」の意味は？",choices:["不足した","豊富な","危険な","平凡な"],answer:1},
    {q:"「reluctant」の意味は？",choices:["熱心な","気が進まない","快活な","勤勉な"],answer:1},
    {q:"「genuine」の意味は？",choices:["偽物の","本物の","古い","小さい"],answer:1},
    {q:"「vague」の意味は？",choices:["明確な","曖昧な","美しい","退屈な"],answer:1},
  ],
  english_grammar: [
    {q:"I ___ to school every day.",choices:["go","went","going","gone"],answer:0},
    {q:"She ___ been studying for 2 hours.",choices:["have","has","is","was"],answer:1},
    {q:"If I ___ rich, I would travel.",choices:["am","were","will be","be"],answer:1},
    {q:"The book ___ by him yesterday.",choices:["read","reads","was read","reading"],answer:2},
    {q:"He is ___ than his brother.",choices:["tall","taller","tallest","more tall"],answer:1},
    {q:"I look forward to ___ you.",choices:["see","seeing","saw","seen"],answer:1},
    {q:"Neither of them ___ correct.",choices:["are","is","were","be"],answer:1},
    {q:"___ you mind if I open the window?",choices:["Will","Would","Do","May"],answer:1},
    {q:"He doesn't know ___ to do next.",choices:["what","which","that","where"],answer:0},
    {q:"By the time he arrived, we ___ left.",choices:["have","had","were","are"],answer:1},
  ],
  english_idiom: [
    {q:"「break a leg」の意味は？",choices:["けがをする","頑張れ","骨折する","急ぐ"],answer:1},
    {q:"「piece of cake」の意味は？",choices:["お菓子","とても簡単","小さい部分","美味しい"],answer:1},
    {q:"「once in a blue moon」の意味は？",choices:["毎月","ごく稀に","青い月の日","満月の夜"],answer:1},
    {q:"「hit the books」の意味は？",choices:["本を叩く","熱心に勉強する","本を読む","本を捨てる"],answer:1},
    {q:"「under the weather」の意味は？",choices:["体調が悪い","天気の下","屋外で","雨の中"],answer:0},
    {q:"「cost an arm and a leg」の意味は？",choices:["けがする","とても高価","便利な","軽い"],answer:1},
    {q:"「let the cat out of the bag」の意味は？",choices:["猫を逃がす","秘密を漏らす","袋を開ける","発見する"],answer:1},
    {q:"「pull someone's leg」の意味は？",choices:["足を引っ張る","からかう","助ける","起こす"],answer:1},
    {q:"「spill the beans」の意味は？",choices:["豆をこぼす","秘密を話す","料理する","散らかす"],answer:1},
    {q:"「on cloud nine」の意味は？",choices:["雲の上","とても幸せ","9番目","空の旅"],answer:1},
  ],
  math_calc: [
    {q:"12 × 13 = ?",choices:["144","152","156","148"],answer:2},
    {q:"15² = ?",choices:["215","225","235","255"],answer:1},
    {q:"7! = ?",choices:["2520","5040","720","40320"],answer:1},
    {q:"√144 = ?",choices:["11","12","13","14"],answer:1},
    {q:"2³ × 3 = ?",choices:["18","24","12","36"],answer:1},
    {q:"125 ÷ 5 = ?",choices:["20","25","30","35"],answer:1},
    {q:"17 × 18 = ?",choices:["296","306","316","326"],answer:1},
    {q:"3⁴ = ?",choices:["64","81","100","27"],answer:1},
    {q:"√625 = ?",choices:["20","25","30","35"],answer:1},
    {q:"log₂8 = ?",choices:["2","3","4","8"],answer:1},
  ],
  math_quadratic: [
    {q:"x² - 5x + 6 = 0 の解は？",choices:["1, 6","2, 3","-2, -3","-1, -6"],answer:1},
    {q:"x² - 4 = 0 の解は？",choices:["±2","±4","2, 0","0のみ"],answer:0},
    {q:"y = x² の頂点は？",choices:["(1,1)","(0,0)","(-1,1)","(0,1)"],answer:1},
    {q:"y = (x-2)² + 3 の頂点は？",choices:["(2,3)","(-2,3)","(2,-3)","(3,2)"],answer:0},
    {q:"x² + 6x + 9 を因数分解",choices:["(x+3)²","(x-3)²","(x+3)(x-3)","(x+9)²"],answer:0},
    {q:"y = x² - 2x の最小値は？",choices:["-1","0","1","-2"],answer:0},
    {q:"x² - 7x + 12 = 0 の解は？",choices:["3, 4","2, 6","1, 12","-3, -4"],answer:0},
    {q:"2x² = 8 の解は？",choices:["±2","±4","2, 0","±8"],answer:0},
    {q:"y = -x² + 4 のグラフは？",choices:["上に凸","下に凸","直線","原点通る"],answer:0},
    {q:"判別式 b²-4ac の意味は？",choices:["解の数を判定","頂点を求める","面積","傾き"],answer:0},
  ],
  math_geometry: [
    {q:"3辺3,4,5の三角形の面積は？",choices:["6","8","10","12"],answer:0},
    {q:"半径5の円の面積は？(π=3.14)",choices:["78.5","31.4","25","157"],answer:0},
    {q:"正方形の対角線は1辺の何倍？",choices:["√2倍","2倍","√3倍","1.5倍"],answer:0},
    {q:"円周率πを小数第2位まで表すと？",choices:["3.14","3.15","3.12","3.16"],answer:0},
    {q:"sin(30°) = ?",choices:["1/2","√3/2","1/√2","1"],answer:0},
    {q:"cos(60°) = ?",choices:["1/2","√3/2","1/√2","1"],answer:0},
    {q:"三角形の内角の和は？",choices:["180°","360°","90°","270°"],answer:0},
    {q:"立方体の体積、一辺4cmなら？",choices:["64","16","48","32"],answer:0},
    {q:"円錐の体積の公式は？",choices:["1/3πr²h","πr²h","2πrh","4/3πr³"],answer:0},
    {q:"正六角形の内角は？",choices:["120°","90°","135°","150°"],answer:0},
  ],
  math_prob: [
    {q:"サイコロで偶数が出る確率は？",choices:["1/2","1/3","1/4","1/6"],answer:0},
    {q:"コインを2回投げて2回表が出る確率",choices:["1/4","1/2","1/3","1/8"],answer:0},
    {q:"5C2 = ?",choices:["10","20","25","15"],answer:0},
    {q:"トランプから絵札を引く確率",choices:["12/52","4/52","13/52","16/52"],answer:0},
    {q:"6P3 = ?",choices:["120","60","720","20"],answer:0},
    {q:"サイコロ2個で和が7の確率",choices:["6/36","1/6","5/36","7/36"],answer:0},
    {q:"平均と中央値が等しいデータは？",choices:["左右対称","右に偏り","左に偏り","ばらつき大"],answer:0},
    {q:"標準偏差が大きいということは？",choices:["ばらつき大","ばらつき小","平均が大","データが少"],answer:0},
    {q:"4! = ?",choices:["24","12","8","16"],answer:0},
    {q:"確率は何の範囲？",choices:["0以上1以下","0以上","1以上","-1以上1以下"],answer:0},
  ],
  japanese_classic: [
    {q:"「枕草子」を書いたのは？",choices:["紫式部","清少納言","和泉式部","松尾芭蕉"],answer:1},
    {q:"「源氏物語」を書いたのは？",choices:["紫式部","清少納言","和泉式部","菅原孝標女"],answer:0},
    {q:"「徒然草」を書いたのは？",choices:["兼好法師","鴨長明","親鸞","西行"],answer:0},
    {q:"「奥の細道」の作者は？",choices:["与謝蕪村","小林一茶","松尾芭蕉","正岡子規"],answer:2},
    {q:"「平家物語」の冒頭は？",choices:["祇園精舎","春はあけぼの","ゆく河の流れ","つれづれなるまま"],answer:0},
    {q:"「絶句」を書いた中国の詩人は？",choices:["李白","杜甫","白居易","王維"],answer:1},
    {q:"「方丈記」の作者は？",choices:["鴨長明","兼好法師","清少納言","紫式部"],answer:0},
    {q:"「いとをかし」の意味は？",choices:["とても良くない","とても趣がある","とても恥ずかしい","とても疲れた"],answer:1},
    {q:"「あはれ」の意味は？",choices:["かわいそう","しみじみとした感動","明るい","苦しい"],answer:1},
    {q:"「をかし」の反対は？",choices:["あはれ","つらし","わろし","めでたし"],answer:2},
  ],
  japanese_modern: [
    {q:"「夏目漱石」の代表作は？",choices:["羅生門","坊っちゃん","檸檬","蟹工船"],answer:1},
    {q:"「羅生門」を書いたのは？",choices:["芥川龍之介","太宰治","川端康成","三島由紀夫"],answer:0},
    {q:"「人間失格」の作者は？",choices:["太宰治","川端康成","谷崎潤一郎","志賀直哉"],answer:0},
    {q:"「雪国」を書いたのは？",choices:["川端康成","三島由紀夫","太宰治","夏目漱石"],answer:0},
    {q:"「吾輩は猫である」の作者は？",choices:["夏目漱石","森鴎外","芥川龍之介","志賀直哉"],answer:0},
    {q:"「走れメロス」の作者は？",choices:["太宰治","宮沢賢治","芥川龍之介","夏目漱石"],answer:0},
    {q:"「銀河鉄道の夜」の作者は？",choices:["宮沢賢治","太宰治","島崎藤村","与謝野晶子"],answer:0},
    {q:"「ノルウェイの森」の作者は？",choices:["村上春樹","村上龍","吉本ばなな","江國香織"],answer:0},
    {q:"森鴎外の作品は？",choices:["舞姫","坊っちゃん","羅生門","檸檬"],answer:0},
    {q:"「こころ」の作者は？",choices:["夏目漱石","芥川龍之介","太宰治","川端康成"],answer:0},
  ],
  japanese_kanji: [
    {q:"「五月雨」の読み方は？",choices:["ごがつあめ","さみだれ","つゆ","はるあめ"],answer:1},
    {q:"「破竹の勢い」の意味は？",choices:["弱々しい","止められない勢い","壊れる","退却"],answer:1},
    {q:"「諸行無常」の意味は？",choices:["全ては変わる","全ては同じ","平和の心","勝者の道"],answer:0},
    {q:"「四面楚歌」の意味は？",choices:["四方の歌","周囲が敵だらけ","四回戦った","南の歌"],answer:1},
    {q:"「温故知新」の意味は？",choices:["古きを温め新しきを知る","新しいだけ追う","古いだけ大事","変化なし"],answer:0},
    {q:"「呉越同舟」の意味は？",choices:["敵同士が同じ船に","友達と旅","船旅","遠征"],answer:0},
    {q:"「臥薪嘗胆」の意味は？",choices:["苦労に耐え目標","怠惰","快楽","眠る"],answer:0},
    {q:"「捲土重来」の意味は？",choices:["再起","逃走","敗北","休息"],answer:0},
    {q:"「画竜点睛」の意味は？",choices:["最後の仕上げ","始まり","失敗","絵を描く"],answer:0},
    {q:"「五里霧中」の意味は？",choices:["方向不明","危険","平穏","明快"],answer:0},
  ],
  social_geo: [
    {q:"日本の首都は？",choices:["大阪","京都","東京","名古屋"],answer:2},
    {q:"世界最大の国土面積の国は？",choices:["アメリカ","中国","ロシア","カナダ"],answer:2},
    {q:"日本最大の湖は？",choices:["諏訪湖","霞ヶ浦","琵琶湖","浜名湖"],answer:2},
    {q:"アマゾン川が流れる大陸は？",choices:["アフリカ","南アメリカ","アジア","オセアニア"],answer:1},
    {q:"日本の最北端の島は？",choices:["北海道","択捉島","与那国島","沖ノ鳥島"],answer:1},
    {q:"世界最高峰の山は？",choices:["K2","エベレスト","富士山","キリマンジャロ"],answer:1},
    {q:"赤道直下にある国は？",choices:["ブラジル","ロシア","カナダ","ノルウェー"],answer:0},
    {q:"日本の人口は約何人？",choices:["1.2億人","1.5億人","8000万人","5億人"],answer:0},
    {q:"世界一長い川は？",choices:["ナイル川","アマゾン川","長江","ミシシッピ川"],answer:0},
    {q:"日本の最南端は？",choices:["与那国島","沖ノ鳥島","南鳥島","硫黄島"],answer:1},
  ],
  social_civics: [
    {q:"日本の三権分立で立法を担うのは？",choices:["内閣","国会","裁判所","天皇"],answer:1},
    {q:"日本国憲法の三大原則は？",choices:["平和・自由・平等","平和・基本的人権・国民主権","民主・自由・人権","主権・平等・自由"],answer:1},
    {q:"国連本部がある都市は？",choices:["ロンドン","パリ","ニューヨーク","ジュネーブ"],answer:2},
    {q:"参議院議員の任期は？",choices:["4年","6年","8年","2年"],answer:1},
    {q:"日本の選挙権年齢は？",choices:["18歳","20歳","16歳","21歳"],answer:0},
    {q:"日本の元首は？",choices:["天皇","総理大臣","国会議長","最高裁長官"],answer:0},
    {q:"内閣総理大臣を指名するのは？",choices:["国民","国会","天皇","内閣"],answer:1},
    {q:"日本国憲法施行は何年？",choices:["1945年","1946年","1947年","1950年"],answer:2},
    {q:"衆議院議員の任期は？",choices:["4年","6年","8年","2年"],answer:0},
    {q:"国の最高法規は？",choices:["条例","法律","憲法","規則"],answer:2},
  ],
  social_econ: [
    {q:"消費税が初めて導入された年は？",choices:["1986年","1989年","1995年","2000年"],answer:1},
    {q:"日本の中央銀行は？",choices:["三菱UFJ","日本銀行","世界銀行","みずほ銀行"],answer:1},
    {q:"GDPの正式名称は？",choices:["国内総生産","国民総所得","国家貯金","政府支出"],answer:0},
    {q:"インフレとは?",choices:["物価上昇","物価下落","失業率","金利"],answer:0},
    {q:"円高で得をするのは?",choices:["輸出企業","輸入企業","工場","農家"],answer:1},
    {q:"日本の通貨単位は?",choices:["円","ドル","ユーロ","元"],answer:0},
    {q:"株式会社の最高意思決定機関は?",choices:["取締役会","株主総会","社長","従業員"],answer:1},
    {q:"独占禁止法を運用するのは?",choices:["公正取引委員会","総務省","経産省","財務省"],answer:0},
    {q:"日本の財政赤字解消策で正しいのは?",choices:["増税","減税","紙幣増発","禁輸"],answer:0},
    {q:"経済の三主体は?",choices:["家計・企業・政府","学校・銀行・政府","企業・銀行・家計","家計・企業・銀行"],answer:0},
  ],
  science_physics: [
    {q:"音の速さは秒速約何m？",choices:["340m","100m","1000m","30000m"],answer:0},
    {q:"光の速さは秒速約何km？",choices:["30万","3万","300万","3000"],answer:0},
    {q:"重力加速度は約何m/s²?",choices:["9.8","10.8","8.8","12"],answer:0},
    {q:"電圧の単位は?",choices:["A","V","W","Ω"],answer:1},
    {q:"電流の単位は?",choices:["A","V","W","Ω"],answer:0},
    {q:"フックの法則は何の法則?",choices:["ばねの伸び","光の屈折","熱伝導","電気"],answer:0},
    {q:"E=mc²のEは何?",choices:["エネルギー","電圧","質量","速度"],answer:0},
    {q:"絶対零度は何℃？",choices:["-100","-200","-273","-500"],answer:2},
    {q:"音は何で伝わる?",choices:["真空","空気・物質","光","電磁波のみ"],answer:1},
    {q:"力の単位は?",choices:["ニュートン","ワット","ジュール","ヘルツ"],answer:0},
  ],
  science_chem: [
    {q:"水の化学式は？",choices:["CO2","H2O","NaCl","O2"],answer:1},
    {q:"周期表の元素番号1番は？",choices:["ヘリウム","水素","酸素","炭素"],answer:1},
    {q:"原子の中心にあるものは？",choices:["電子","原子核","中性子","陽子"],answer:1},
    {q:"塩化ナトリウムの化学式は?",choices:["NaCl","NaCO3","KCl","HCl"],answer:0},
    {q:"二酸化炭素の化学式は?",choices:["CO","CO2","O2","H2O"],answer:1},
    {q:"鉄の元素記号は?",choices:["Fe","Au","Ag","Cu"],answer:0},
    {q:"金の元素記号は?",choices:["Au","Ag","Cu","Fe"],answer:0},
    {q:"pH7は何性?",choices:["中性","酸性","アルカリ性","強酸性"],answer:0},
    {q:"アルコール発酵で生じるのは?",choices:["エタノール","水素","酸素","塩"],answer:0},
    {q:"水を分解すると?",choices:["水素と酸素","炭素と酸素","窒素と水素","気体だけ"],answer:0},
  ],
  science_bio: [
    {q:"光合成に必要なものは？",choices:["酸素","二酸化炭素","窒素","水素"],answer:1},
    {q:"血液を全身に送る臓器は？",choices:["肺","肝臓","心臓","腎臓"],answer:2},
    {q:"DNAの二重らせんを発見したのは？",choices:["メンデル","ダーウィン","ワトソンとクリック","パスツール"],answer:2},
    {q:"動物の細胞にないものは?",choices:["核","ミトコンドリア","細胞壁","細胞膜"],answer:2},
    {q:"光合成を行う細胞小器官は?",choices:["葉緑体","ミトコンドリア","核","リボソーム"],answer:0},
    {q:"血液の赤色は何が原因?",choices:["ヘモグロビン","白血球","血小板","水分"],answer:0},
    {q:"人間の染色体は何本?",choices:["46","23","48","44"],answer:0},
    {q:"進化論を提唱したのは?",choices:["ダーウィン","メンデル","パスツール","ニュートン"],answer:0},
    {q:"植物の根の役割で間違いは?",choices:["光合成","水の吸収","植物を支える","養分吸収"],answer:0},
    {q:"哺乳類の特徴は?",choices:["卵を産む","毛がない","母乳で育てる","変温動物"],answer:2},
  ],
  science_earth: [
    {q:"地球から最も近い星は？",choices:["シリウス","ベガ","太陽","アルタイル"],answer:2},
    {q:"地球の自転周期は？",choices:["12時間","24時間","48時間","30日"],answer:1},
    {q:"日本付近のプレートは何枚?",choices:["2","3","4","5"],answer:2},
    {q:"地球は太陽系の何番目?",choices:["1","2","3","4"],answer:2},
    {q:"月の自転周期は?",choices:["1日","約27日","1年","6ヶ月"],answer:1},
    {q:"地震のマグニチュードの単位は?",choices:["震度","M","Pa","Hz"],answer:1},
    {q:"地球の表面の何%が水?",choices:["50%","70%","30%","90%"],answer:1},
    {q:"火山の主要な分布地帯は?",choices:["環太平洋","赤道沿い","極地","砂漠"],answer:0},
    {q:"地層の上下逆転の原因は?",choices:["褶曲","風化","侵食","堆積"],answer:0},
    {q:"地球の年齢は約何年?",choices:["46億","100万","1億","500億"],answer:0},
  ],
  history_japan: [
    {q:"江戸幕府を開いたのは？",choices:["豊臣秀吉","織田信長","徳川家康","源頼朝"],answer:2},
    {q:"鎌倉幕府を開いたのは？",choices:["源頼朝","足利尊氏","平清盛","徳川家康"],answer:0},
    {q:"明治維新が起こった年は？",choices:["1853年","1868年","1877年","1889年"],answer:1},
    {q:"日本最初の元号は？",choices:["昭和","大化","明治","平安"],answer:1},
    {q:"奈良の大仏を建立した天皇は？",choices:["桓武天皇","聖武天皇","推古天皇","天武天皇"],answer:1},
    {q:"卑弥呼が治めた国の名は？",choices:["邪馬台国","大和国","出雲国","倭国"],answer:0},
    {q:"室町幕府を開いたのは?",choices:["足利尊氏","足利義満","足利義政","新田義貞"],answer:0},
    {q:"関ヶ原の戦いは何年?",choices:["1600年","1582年","1615年","1573年"],answer:0},
    {q:"平安京遷都は何年?",choices:["794年","710年","645年","1192年"],answer:0},
    {q:"大化の改新を行ったのは?",choices:["中大兄皇子","聖徳太子","蘇我馬子","天智天皇"],answer:0},
  ],
  history_world: [
    {q:"第二次世界大戦が終わった年は？",choices:["1943","1944","1945","1946"],answer:2},
    {q:"フランス革命が始まった年は？",choices:["1776年","1789年","1799年","1804年"],answer:1},
    {q:"アメリカ独立宣言の年は？",choices:["1763年","1776年","1789年","1812年"],answer:1},
    {q:"第一次世界大戦は何年から?",choices:["1914年","1918年","1900年","1939年"],answer:0},
    {q:"ベルリンの壁崩壊は何年?",choices:["1989年","1991年","1985年","2000年"],answer:0},
    {q:"ナポレオンが皇帝になった年は?",choices:["1804年","1789年","1815年","1799年"],answer:0},
    {q:"ロシア革命は何年?",choices:["1917年","1905年","1922年","1914年"],answer:0},
    {q:"産業革命はどこで始まった?",choices:["イギリス","フランス","ドイツ","アメリカ"],answer:0},
    {q:"アヘン戦争はどの2国の戦争?",choices:["英・中","英・印","仏・中","米・日"],answer:0},
    {q:"コロンブスがアメリカ大陸到達は何年?",choices:["1492年","1500年","1453年","1488年"],answer:0},
  ],
  history_ancient: [
    {q:"ピラミッドを建てた古代文明は？",choices:["ギリシャ","ローマ","エジプト","メソポタミア"],answer:2},
    {q:"古代ギリシャの哲学者は?",choices:["ソクラテス","シーザー","クレオパトラ","ハンニバル"],answer:0},
    {q:"ローマ帝国の初代皇帝は?",choices:["カエサル","アウグストゥス","ネロ","ハドリアヌス"],answer:1},
    {q:"古代中国の万里の長城を建てたのは?",choices:["秦","漢","唐","明"],answer:0},
    {q:"インダス文明の都市は?",choices:["モヘンジョダロ","アテネ","ローマ","バビロン"],answer:0},
    {q:"古代エジプトの文字は?",choices:["ヒエログリフ","楔形文字","アルファベット","甲骨文字"],answer:0},
    {q:"ハンムラビ法典がある文明は?",choices:["メソポタミア","エジプト","ギリシャ","中国"],answer:0},
    {q:"古代オリンピックが行われた地は?",choices:["オリンピア","アテネ","スパルタ","ローマ"],answer:0},
    {q:"古代ローマの言葉は?",choices:["ラテン語","ギリシャ語","ヘブライ語","アラビア語"],answer:0},
    {q:"四大文明の一つで中国の川は?",choices:["黄河","ナイル","ガンジス","ティグリス"],answer:0},
  ],
};

// ─── リスニング問題（音声読み上げ→選択） ─────────────
// level: "easy"(中1-2) | "normal"(中3-高1) | "hard"(高2-高3)
const LISTENING_QUESTIONS = [
  // ── easy: 基本フレーズ ──
  { level:"easy", audio:"Hello, how are you?",          choices:["こんにちは、元気？","さようなら","また会おう","ごめんなさい"], answer:0 },
  { level:"easy", audio:"I have two apples.",            choices:["りんごを2個持ってる","みかんを3個持ってる","りんごを買う","りんごが欲しい"], answer:0 },
  { level:"easy", audio:"What time is it?",              choices:["何時ですか？","何曜日ですか？","お元気ですか？","誰ですか？"], answer:0 },
  { level:"easy", audio:"My name is Tom.",               choices:["私の名前はトム","私はトムが好き","トムは私","トムが来る"], answer:0 },
  { level:"easy", audio:"I like cats very much.",        choices:["猫が大好き","犬が好き","猫が嫌い","猫を見た"], answer:0 },
  { level:"easy", audio:"See you tomorrow.",             choices:["また明日","おはよう","おやすみ","ありがとう"], answer:0 },
  { level:"easy", audio:"This is my book.",              choices:["これは私の本","これは犬","あれはノート","これは机"], answer:0 },
  { level:"easy", audio:"I'm a student.",                choices:["私は学生","私は先生","私は医者","私は子供"], answer:0 },
  { level:"easy", audio:"How old are you?",              choices:["何歳ですか？","元気ですか？","誰ですか？","どこですか？"], answer:0 },
  { level:"easy", audio:"It's a sunny day.",             choices:["晴れた日","雨の日","曇りの日","雪の日"], answer:0 },
  { level:"easy", audio:"I go to school by bus.",        choices:["バスで学校に行く","電車で学校に行く","歩いて行く","車で行く"], answer:0 },
  { level:"easy", audio:"My favorite color is blue.",    choices:["好きな色は青","好きな色は赤","好きな色は緑","好きな色は黄"], answer:0 },
  { level:"easy", audio:"Let's play together.",          choices:["一緒に遊ぼう","勉強しよう","食べよう","眠ろう"], answer:0 },
  { level:"easy", audio:"I have a sister.",              choices:["姉妹がいる","兄弟がいる","友達がいる","ペットがいる"], answer:0 },
  { level:"easy", audio:"What's your name?",             choices:["名前は？","何歳？","どこに住んでる？","好きな食べ物は？"], answer:0 },
  { level:"easy", audio:"I can play the piano.",         choices:["ピアノが弾ける","ギターが弾ける","歌が歌える","踊れる"], answer:0 },
  { level:"easy", audio:"The weather is nice today.",    choices:["今日は天気がいい","今日は寒い","今日は暑い","今日は雨"], answer:0 },
  { level:"easy", audio:"I want a glass of water.",      choices:["水が一杯欲しい","ジュースが欲しい","お茶が欲しい","コーヒーが欲しい"], answer:0 },
  { level:"easy", audio:"Don't forget your homework.",   choices:["宿題を忘れずに","遅刻しないで","早く来て","ゆっくりして"], answer:0 },
  { level:"easy", audio:"My birthday is in May.",        choices:["誕生日は5月","誕生日は3月","誕生日は10月","誕生日は1月"], answer:0 },

  // ── normal: 中3〜高1レベル ──
  { level:"normal", audio:"Where are you going?",        choices:["どこに行くの？","いつ来るの？","誰と行くの？","何時に？"], answer:0 },
  { level:"normal", audio:"It is raining outside.",      choices:["外は雨","外は晴れ","部屋が寒い","明日は雨"], answer:0 },
  { level:"normal", audio:"Could you help me, please?",  choices:["手伝ってもらえる？","元気？","ありがとう","ごめんね"], answer:0 },
  { level:"normal", audio:"I'm hungry. Let's eat.",      choices:["お腹空いた、食べよう","眠い","疲れた","行こう"], answer:0 },
  { level:"normal", audio:"This book is interesting.",   choices:["この本は面白い","この本は難しい","本を読んだ","本を買った"], answer:0 },
  { level:"normal", audio:"How much is this?",           choices:["これいくら？","これ何？","どこにある？","誰の？"], answer:0 },
  { level:"normal", audio:"I've been to Tokyo before.",  choices:["前に東京に行ったことがある","東京に住んでいる","東京は近い","東京に行く予定"], answer:0 },
  { level:"normal", audio:"He is taller than me.",       choices:["彼は私より背が高い","彼は私より背が低い","彼は私と同じ","彼は私より若い"], answer:0 },
  { level:"normal", audio:"If it rains, we'll stay home.",choices:["雨なら家にいる","雨でも出かける","雨が好き","明日は雨"], answer:0 },
  { level:"normal", audio:"She has been studying for two hours.", choices:["2時間勉強している","2時間遊んでいる","2時間後に勉強","2時間休んだ"], answer:0 },
  { level:"normal", audio:"I want to become a doctor.",  choices:["医者になりたい","先生になりたい","医者に会いたい","医者を見た"], answer:0 },
  { level:"normal", audio:"Don't worry about it.",       choices:["心配しないで","急いで","注意して","聞いて"], answer:0 },
  { level:"normal", audio:"Please call me later.",       choices:["あとで電話して","今すぐ来て","早く返事して","メールして"], answer:0 },
  { level:"normal", audio:"I'm looking forward to it.",  choices:["楽しみにしている","心配している","知っている","興味ない"], answer:0 },
  { level:"normal", audio:"What do you think about this?",choices:["これについてどう思う？","これは何？","これを買う？","これはどこ？"], answer:0 },
  { level:"normal", audio:"I have to finish my report.", choices:["レポートを終わらせなきゃ","レポートを始める","レポートを読む","レポートをもらう"], answer:0 },
  { level:"normal", audio:"It depends on the weather.",  choices:["天気次第","天気が良い","天気が悪い","天気を見る"], answer:0 },
  { level:"normal", audio:"Let me think about it.",      choices:["考えさせて","教えて","聞いて","見て"], answer:0 },
  { level:"normal", audio:"I'm not sure about that.",    choices:["それは確かじゃない","それは正しい","それは違う","それは知らない"], answer:0 },
  { level:"normal", audio:"Could you say that again?",   choices:["もう一度言って","早く言って","ゆっくり言って","大きく言って"], answer:0 },

  // ── hard: 高2〜高3レベル ──
  { level:"hard", audio:"I would rather stay home tonight.", choices:["今夜は家にいる方がいい","今夜出かけたい","昨夜家にいた","明日家にいる"], answer:0 },
  { level:"hard", audio:"He must have forgotten the appointment.", choices:["約束を忘れたに違いない","約束を覚えている","約束しなかった","約束を変えた"], answer:0 },
  { level:"hard", audio:"The meeting was postponed until next week.", choices:["会議は来週に延期","会議は中止","会議は今週","会議は終了"], answer:0 },
  { level:"hard", audio:"I'm familiar with this topic.",    choices:["この話題はよく知っている","この話題は初耳","この話題は嫌い","この話題は難しい"], answer:0 },
  { level:"hard", audio:"It's beyond my expectation.",      choices:["予想以上","予想通り","予想以下","予想できない"], answer:0 },
  { level:"hard", audio:"He took advantage of the opportunity.", choices:["機会を活かした","機会を逃した","機会を作った","機会を断った"], answer:0 },
  { level:"hard", audio:"She is reluctant to accept the offer.", choices:["申し出を受けたがらない","申し出を受け入れた","申し出に賛成","申し出を待つ"], answer:0 },
  { level:"hard", audio:"The result was beyond our control.", choices:["結果は私たちの手に負えなかった","結果は予想通り","結果は良かった","結果を制御した"], answer:0 },
  { level:"hard", audio:"I'm inclined to agree with you.",  choices:["賛成したい気持ち","反対","無関心","興味がある"], answer:0 },
  { level:"hard", audio:"This issue should not be overlooked.", choices:["見過ごすべきでない","重要でない","解決済み","新しい"], answer:0 },
  { level:"hard", audio:"He has a profound knowledge of history.", choices:["歴史の深い知識を持つ","歴史を学んでいる","歴史が苦手","歴史を教える"], answer:0 },
  { level:"hard", audio:"The data is subject to change.",   choices:["データは変更の可能性あり","データは確定","データは正確","データは古い"], answer:0 },
  { level:"hard", audio:"I appreciate your cooperation.",   choices:["協力に感謝する","協力を断る","協力を求める","協力を考える"], answer:0 },
  { level:"hard", audio:"This problem is far from simple.", choices:["この問題は簡単とは程遠い","この問題は簡単","この問題は遠い","この問題はない"], answer:0 },
  { level:"hard", audio:"He is well-versed in economics.",  choices:["経済学に詳しい","経済学を学ぶ","経済学が苦手","経済学を教える"], answer:0 },
  { level:"hard", audio:"The outcome remains uncertain.",   choices:["結果は不確か","結果は決定","結果は明確","結果はない"], answer:0 },
  { level:"hard", audio:"She made up her mind to study abroad.", choices:["留学を決意した","留学を諦めた","留学を考える","留学した"], answer:0 },
  { level:"hard", audio:"His argument lacks consistency.",  choices:["彼の主張は一貫性がない","彼の主張は完璧","彼の主張は強い","彼の主張は新しい"], answer:0 },
  { level:"hard", audio:"We need to address this issue immediately.", choices:["この問題にすぐ対処すべき","この問題は無視できる","この問題は古い","この問題は終わった"], answer:0 },
  { level:"hard", audio:"The proposal was met with skepticism.", choices:["提案は懐疑的に受け止められた","提案は歓迎された","提案は無視された","提案は採用された"], answer:0 },
];

// ─── スピーキング問題（表示→発音） ──────────────────
// ─── 発音記号＆コツ辞書（よく出る単語の発音解説） ─────
const PRONUNCIATION_TIPS = {
  // 母音
  "hello":     { ipa:"/həˈloʊ/",     tip:"「ヘ」を弱く、「ロウ」をしっかり" },
  "thank":     { ipa:"/θæŋk/",       tip:"「th」は舌を歯の間に出して息を吐く" },
  "thanks":    { ipa:"/θæŋks/",      tip:"「th」は舌を歯の間に出して息を吐く" },
  "you":       { ipa:"/juː/",        tip:"「ユー」と長めに" },
  "good":      { ipa:"/ɡʊd/",        tip:"「グッ」の口で短く" },
  "morning":   { ipa:"/ˈmɔːrnɪŋ/",   tip:"「モー」を伸ばし、「ニン」は鼻に抜く" },
  "night":     { ipa:"/naɪt/",       tip:"「ナイ」をはっきり、「t」は軽く" },
  "fine":      { ipa:"/faɪn/",       tip:"「ファイン」、唇を噛んで「f」" },
  "yes":       { ipa:"/jes/",        tip:"「イェス」、最後の「s」を強く" },
  "no":        { ipa:"/noʊ/",        tip:"「ノウ」と二重母音" },
  "problem":   { ipa:"/ˈprɑːbləm/",  tip:"「プラブレム」、最初の母音は口を大きく" },
  "welcome":   { ipa:"/ˈwelkəm/",    tip:"「ウェル」を強く、「カム」は弱く" },
  "see":       { ipa:"/siː/",        tip:"「スィー」、口を横に引く" },
  "like":      { ipa:"/laɪk/",       tip:"「ライク」、「l」は舌を上に" },
  "it":        { ipa:"/ɪt/",         tip:"「イット」、口を少し開いて短く" },
  "excuse":    { ipa:"/ɪkˈskjuːz/",  tip:"「イクスキューズ」、「k」と「s」を分ける" },
  "me":        { ipa:"/miː/",        tip:"「ミー」、口を横に" },
  "how":       { ipa:"/haʊ/",        tip:"「ハウ」、口を大きく開けて閉じる" },
  "are":       { ipa:"/ɑːr/",        tip:"「アー」、口を縦に開く" },
  "am":        { ipa:"/æm/",         tip:"「アム」、口を横に広げて「ア」" },
  "happy":     { ipa:"/ˈhæpi/",      tip:"「ハ」を強く、口を横に広げて" },
  "this":      { ipa:"/ðɪs/",        tip:"「th」は舌を歯に当てて、有声で" },
  "is":        { ipa:"/ɪz/",         tip:"「イズ」、最後の「z」は震わせて" },
  "a":         { ipa:"/ə/",          tip:"「ア」と弱く、あいまいに" },
  "book":      { ipa:"/bʊk/",        tip:"「ブッ」、唇を閉じてから「k」" },
  "apples":    { ipa:"/ˈæpəlz/",     tip:"「アポーズ」、複数形の「z」音" },
  "hot":       { ipa:"/hɑːt/",       tip:"「ハッ」、口を大きく開ける" },
  "today":     { ipa:"/təˈdeɪ/",     tip:"「トゥデイ」、後ろを強く" },
  "where":     { ipa:"/wer/",        tip:"「ウェア」、唇を丸めてから開く" },
  "the":       { ipa:"/ðə/",         tip:"「th」は舌を歯に当てる、有声" },
  "bathroom":  { ipa:"/ˈbæθruːm/",   tip:"「バス」の「th」は無声、「ルーム」を伸ばす" },
  "want":      { ipa:"/wɑːnt/",      tip:"「ワン」、最後の「t」は軽く" },
  "some":      { ipa:"/sʌm/",        tip:"「サム」、口を縦に開いて" },
  "water":     { ipa:"/ˈwɔːtər/",    tip:"「ウォーラー」、米英で「t」が「r」のように" },
  "tomorrow":  { ipa:"/təˈmɔːroʊ/",  tip:"「トゥモロウ」、真ん中を強く" },
  "delicious": { ipa:"/dɪˈlɪʃəs/",   tip:"「ディリシャス」、「ci」は「シ」音" },
  "my":        { ipa:"/maɪ/",        tip:"「マイ」、二重母音" },
  "name":      { ipa:"/neɪm/",       tip:"「ネイム」、「ay」音をしっかり" },
  "nice":      { ipa:"/naɪs/",       tip:"「ナイス」、最後の「s」明確に" },
  "to":        { ipa:"/tuː/",        tip:"「トゥー」と長く、または「タ」と短く" },
  "meet":      { ipa:"/miːt/",       tip:"「ミート」、口を横に引いて長く" },
  "station":   { ipa:"/ˈsteɪʃən/",   tip:"「ステイション」、「ti」は「シャ」音" },
  "student":   { ipa:"/ˈstuːdənt/",  tip:"「ステューデント」、最初を強く" },
  "can":       { ipa:"/kæn/",        tip:"「キャン」、口を横に広げて" },
  "help":      { ipa:"/help/",       tip:"「ヘルプ」、「l」をしっかり" },
  "what":      { ipa:"/wʌt/",        tip:"「ワット」、最後の「t」は軽く" },
  "time":      { ipa:"/taɪm/",       tip:"「タイム」、二重母音はっきり" },
  "have":      { ipa:"/hæv/",        tip:"「ハヴ」、最後の「v」は唇を噛んで" },
  "question":  { ipa:"/ˈkwestʃən/",  tip:"「クエスチョン」、「ti」は「チョ」音" },
  "please":    { ipa:"/pliːz/",      tip:"「プリーズ」、最後の「z」を震わせて" },
  "speak":     { ipa:"/spiːk/",      tip:"「スピーク」、「sp」を素早く" },
  "slowly":    { ipa:"/ˈsloʊli/",    tip:"「スロウリー」、「ow」は口を丸めて" },
  "your":      { ipa:"/jʊr/",        tip:"「ユア」、舌を丸めるように" },
  "hobby":     { ipa:"/ˈhɑːbi/",     tip:"「ハビー」、「o」は口を大きく" },
  "from":      { ipa:"/frʌm/",       tip:"「フラム」、「fr」を素早く" },
  "japan":     { ipa:"/dʒəˈpæn/",    tip:"「ジャパン」、後ろを強く" },
  "much":      { ipa:"/mʌtʃ/",       tip:"「マッチ」、最後の「ch」音" },
  "does":      { ipa:"/dʌz/",        tip:"「ダズ」、最後の「z」は震わせて" },
  "cost":      { ipa:"/kɔːst/",      tip:"「コースト」、「st」をはっきり" },
  "would":     { ipa:"/wʊd/",        tip:"「ウッド」、短く" },
  "coffee":    { ipa:"/ˈkɔːfi/",     tip:"「コーフィー」、「ff」は唇を噛んで" },
  "lets":      { ipa:"/lets/",       tip:"「レッツ」、「ts」をしっかり" },
  "let's":     { ipa:"/lets/",       tip:"「レッツ」、「ts」をしっかり" },
  "go":        { ipa:"/ɡoʊ/",        tip:"「ゴウ」、二重母音" },
  "park":      { ipa:"/pɑːrk/",      tip:"「パーク」、「r」で舌を丸める" },
  "appreciate":{ ipa:"/əˈpriːʃieɪt/",tip:"「アプリーシエイト」、長め" },
  "interested":{ ipa:"/ˈɪntrəstɪd/", tip:"「インタレスティッド」、最初を強く" },
  "in":        { ipa:"/ɪn/",         tip:"「イン」、口を少し開けて" },
  "learning":  { ipa:"/ˈlɜːrnɪŋ/",   tip:"「ラーニング」、「r」で舌を丸めて" },
  "english":   { ipa:"/ˈɪŋɡlɪʃ/",    tip:"「イングリッシュ」、「ng」は鼻に抜く" },
  "let":       { ipa:"/let/",        tip:"「レット」、軽く" },
  "think":     { ipa:"/θɪŋk/",       tip:"「th」は舌を歯の間に、無声" },
  "about":     { ipa:"/əˈbaʊt/",     tip:"「アバウト」、後ろを強く" },
  "moment":    { ipa:"/ˈmoʊmənt/",   tip:"「モーメント」、最初を強く" },
  "for":       { ipa:"/fɔːr/",       tip:"「フォー」、唇を噛んで「f」" },
  "afraid":    { ipa:"/əˈfreɪd/",    tip:"「アフレイド」、後ろを強く" },
  "disagree":  { ipa:"/ˌdɪsəˈɡriː/", tip:"「ディサグリー」、最後を強く" },
  "depends":   { ipa:"/dɪˈpendz/",   tip:"「ディペンズ」、真ん中を強く" },
  "on":        { ipa:"/ɑːn/",        tip:"「オン」、口を大きく開けて" },
  "situation": { ipa:"/ˌsɪtʃuˈeɪʃən/",tip:"「シチュエーション」、「tu」は「チュ」音" },
  // 追加
  "im":        { ipa:"/aɪm/",        tip:"「アイム」、「I am」の短縮形" },
  "i":         { ipa:"/aɪ/",         tip:"「アイ」、長めに" },
  "do":        { ipa:"/duː/",        tip:"「ドゥー」、口を丸めて" },
  "and":       { ipa:"/ænd/",        tip:"「アンド」、弱く「ァン」とも" },
  "or":        { ipa:"/ɔːr/",        tip:"「オア」、舌を丸める" },
  "be":        { ipa:"/biː/",        tip:"「ビー」、口を横に引く" },
  "say":       { ipa:"/seɪ/",        tip:"「セイ」、二重母音" },
  "again":     { ipa:"/əˈɡen/",      tip:"「アゲン」、後ろを強く" },
  "could":     { ipa:"/kʊd/",        tip:"「クッド」、「l」は発音しない" },
  "tomorrow":  { ipa:"/təˈmɔːroʊ/",  tip:"「トゥモロウ」、真ん中を強く" },
  "going":     { ipa:"/ˈɡoʊɪŋ/",     tip:"「ゴウイング」、口を丸めて" },
  "look":      { ipa:"/lʊk/",        tip:"「ルック」、短く" },
  "forward":   { ipa:"/ˈfɔːrwərd/",  tip:"「フォーワード」、最初を強く" },
  "hearing":   { ipa:"/ˈhɪrɪŋ/",     tip:"「ヒアリング」、「ng」は鼻に" },
  "elaborate": { ipa:"/ɪˈlæbəreɪt/", tip:"「イラボレイト」、二音節目を強く" },
  "that":      { ipa:"/ðæt/",        tip:"「ザット」、「th」は舌を歯に" },
  "point":     { ipa:"/pɔɪnt/",      tip:"「ポイント」、二重母音" },
  "opinion":   { ipa:"/əˈpɪnjən/",   tip:"「オピニオン」、真ん中を強く" },
  "best":      { ipa:"/best/",       tip:"「ベスト」、口を横に" },
  "way":       { ipa:"/weɪ/",        tip:"「ウェイ」、唇を丸めてから" },
  "rather":    { ipa:"/ˈræðər/",     tip:"「ラザー」、「th」は有声" },
  "not":       { ipa:"/nɑːt/",       tip:"「ナット」、口を大きく" },
  "talk":      { ipa:"/tɔːk/",       tip:"「トーク」、「l」は発音しない" },
  "bear":      { ipa:"/ber/",        tip:"「ベア」、唇を引いて" },
  "with":      { ipa:"/wɪð/",        tip:"「ウィズ」、「th」は有声" },
  "makes":     { ipa:"/meɪks/",      tip:"「メイクス」、「ks」をはっきり" },
  "perfect":   { ipa:"/ˈpɜːrfɪkt/",  tip:"「パーフェクト」、「r」で舌を丸め" },
  "sense":     { ipa:"/sens/",       tip:"「センス」、最後の「s」明確に" },
  "understand":{ ipa:"/ˌʌndərˈstænd/",tip:"「アンダースタンド」、最後を強く" },
  "down":      { ipa:"/daʊn/",       tip:"「ダウン」、二重母音" },
  "business":  { ipa:"/ˈbɪznəs/",    tip:"「ビズネス」、「si」は発音しない" },
  "no":        { ipa:"/noʊ/",        tip:"「ノウ」と二重母音" },
  "choice":    { ipa:"/tʃɔɪs/",      tip:"「チョイス」、「ch」で破裂音" },
  "but":       { ipa:"/bʌt/",        tip:"「バット」、口を縦に開く" },
  "accept":    { ipa:"/əkˈsept/",    tip:"「アクセプト」、後ろを強く" },
  "take":      { ipa:"/teɪk/",       tip:"「テイク」、二重母音" },
  "effort":    { ipa:"/ˈefərt/",     tip:"「エフォート」、最初を強く" },
  "matter":    { ipa:"/ˈmætər/",     tip:"「マター」、米英で「tt」が「r」音" },
  "of":        { ipa:"/əv/",         tip:"「オブ」または「アヴ」、弱く" },
  "personal":  { ipa:"/ˈpɜːrsənəl/", tip:"「パーソナル」、最初を強く" },
  "preference":{ ipa:"/ˈprefərəns/", tip:"「プレファレンス」、最初を強く" },
  "ll":        { ipa:"/əl/",         tip:"「will」の短縮、弱く「ル」" },
  "keep":      { ipa:"/kiːp/",       tip:"「キープ」、口を横に引いて" },
  "mind":      { ipa:"/maɪnd/",      tip:"「マインド」、二重母音" },
  "full":      { ipa:"/fʊl/",        tip:"「フル」、唇を噛んで「f」" },
  "support":   { ipa:"/səˈpɔːrt/",   tip:"「サポート」、後ろを強く" },
  "will":      { ipa:"/wɪl/",        tip:"「ウィル」、唇を丸めて" },
  "take":      { ipa:"/teɪk/",       tip:"「テイク」、二重母音" },};

const SPEAKING_QUESTIONS = [
  // ── easy ──
  { level:"easy", phrase:"Hello",                  jp:"こんにちは" },
  { level:"easy", phrase:"Thank you",              jp:"ありがとう" },
  { level:"easy", phrase:"Good morning",           jp:"おはよう" },
  { level:"easy", phrase:"Good night",             jp:"おやすみ" },
  { level:"easy", phrase:"I'm fine",               jp:"元気です" },
  { level:"easy", phrase:"Yes I do",               jp:"はい、します" },
  { level:"easy", phrase:"No problem",             jp:"問題ない" },
  { level:"easy", phrase:"You are welcome",        jp:"どういたしまして" },
  { level:"easy", phrase:"See you",                jp:"またね" },
  { level:"easy", phrase:"I like it",              jp:"気に入った" },
  { level:"easy", phrase:"Excuse me",              jp:"すみません" },
  { level:"easy", phrase:"How are you",            jp:"お元気ですか" },
  { level:"easy", phrase:"I am happy",             jp:"私は嬉しい" },
  { level:"easy", phrase:"This is a book",         jp:"これは本です" },
  { level:"easy", phrase:"I like apples",          jp:"りんごが好き" },
  { level:"easy", phrase:"It is hot today",        jp:"今日は暑い" },
  { level:"easy", phrase:"Where is the bathroom", jp:"トイレはどこ" },
  { level:"easy", phrase:"I want some water",      jp:"水が欲しい" },
  { level:"easy", phrase:"See you tomorrow",       jp:"また明日" },
  { level:"easy", phrase:"This is delicious",      jp:"これは美味しい" },

  // ── normal ──
  { level:"normal", phrase:"My name is Tom",            jp:"私の名前はトム" },
  { level:"normal", phrase:"Nice to meet you",          jp:"はじめまして" },
  { level:"normal", phrase:"Where is the station",      jp:"駅はどこ" },
  { level:"normal", phrase:"I am a student",            jp:"私は学生です" },
  { level:"normal", phrase:"Can you help me",           jp:"手伝ってくれますか" },
  { level:"normal", phrase:"What time is it",           jp:"何時ですか" },
  { level:"normal", phrase:"I don't understand",        jp:"わかりません" },
  { level:"normal", phrase:"Could you say that again",  jp:"もう一度言ってください" },
  { level:"normal", phrase:"I am from Japan",           jp:"日本から来ました" },
  { level:"normal", phrase:"How much does it cost",     jp:"いくらですか" },
  { level:"normal", phrase:"I would like a coffee",     jp:"コーヒーをお願いします" },
  { level:"normal", phrase:"Let's go to the park",      jp:"公園に行こう" },
  { level:"normal", phrase:"I have a question",         jp:"質問があります" },
  { level:"normal", phrase:"Please speak slowly",       jp:"ゆっくり話してください" },
  { level:"normal", phrase:"What is your hobby",        jp:"趣味は何ですか" },
  { level:"normal", phrase:"I'm looking for a hotel",   jp:"ホテルを探しています" },
  { level:"normal", phrase:"It is my pleasure",         jp:"こちらこそ" },
  { level:"normal", phrase:"I'm sorry I'm late",        jp:"遅れてすみません" },
  { level:"normal", phrase:"What did you say",          jp:"何と言いましたか" },
  { level:"normal", phrase:"That sounds great",         jp:"いいですね" },

  // ── hard ──
  { level:"hard", phrase:"I would appreciate your help",       jp:"手伝っていただけたら助かります" },
  { level:"hard", phrase:"Could you tell me how to get there", jp:"行き方を教えていただけますか" },
  { level:"hard", phrase:"I'm interested in learning English", jp:"英語を学ぶことに興味があります" },
  { level:"hard", phrase:"Let me think about it for a moment", jp:"少し考えさせてください" },
  { level:"hard", phrase:"Would you mind if I ask a question", jp:"質問してもいいですか" },
  { level:"hard", phrase:"I'm afraid I have to disagree",      jp:"残念ながら反対です" },
  { level:"hard", phrase:"It depends on the situation",        jp:"状況によります" },
  { level:"hard", phrase:"I look forward to hearing from you", jp:"ご連絡お待ちしています" },
  { level:"hard", phrase:"Could you elaborate on that point",  jp:"その点を詳しく説明してください" },
  { level:"hard", phrase:"In my opinion this is the best way", jp:"私の意見では、これが最善の方法です" },
  { level:"hard", phrase:"I'd rather not talk about it",       jp:"その話はしたくありません" },
  { level:"hard", phrase:"Please bear with me",                jp:"少々お待ちください" },
  { level:"hard", phrase:"That makes perfect sense",           jp:"完全に納得しました" },
  { level:"hard", phrase:"I appreciate your understanding",    jp:"ご理解に感謝します" },
  { level:"hard", phrase:"Let's get down to business",         jp:"本題に入りましょう" },
  { level:"hard", phrase:"I have no choice but to accept",     jp:"受け入れるしかありません" },
  { level:"hard", phrase:"This will take time and effort",     jp:"時間と努力が必要です" },
  { level:"hard", phrase:"It's a matter of personal preference",jp:"個人の好みの問題です" },
  { level:"hard", phrase:"I'll keep that in mind",             jp:"心に留めておきます" },
  { level:"hard", phrase:"You have my full support",           jp:"全面的に支援します" },
];

const QUESTIONS = {
  english:[
    {q:"「ambitious」の意味は？",choices:["野心的な","臆病な","遅い","厳しい"],answer:0},
    {q:"「fragile」の意味は？",choices:["強い","壊れやすい","美しい","重い"],answer:1},
    {q:"「abandon」の意味は？",choices:["集める","見捨てる","作る","眠る"],answer:1},
    {q:"「sincere」の意味は？",choices:["嘘の","誠実な","怠惰な","危険な"],answer:1},
    {q:"「prohibit」の意味は？",choices:["許可する","禁止する","推奨する","延期する"],answer:1},
    {q:"「reluctant」の意味は？",choices:["熱心な","気が進まない","快活な","勤勉な"],answer:1},
    {q:"「accomplish」の意味は？",choices:["失敗する","成し遂げる","忘れる","延期する"],answer:1},
    {q:"「diligent」の意味は？",choices:["勤勉な","怠惰な","無関心な","軽率な"],answer:0},
    {q:"「inevitable」の意味は？",choices:["避けられる","避けられない","予測できない","重要でない"],answer:1},
    {q:"「genuine」の意味は？",choices:["偽物の","本物の","古い","小さい"],answer:1},
    {q:"「persuade」の意味は？",choices:["説得する","責める","逃げる","教える"],answer:0},
    {q:"「obvious」の意味は？",choices:["明らかな","曖昧な","危険な","秘密の"],answer:0},
    {q:"「criticize」の意味は？",choices:["褒める","批判する","応援する","無視する"],answer:1},
    {q:"「temporary」の意味は？",choices:["永続的な","一時的な","古い","新しい"],answer:1},
    {q:"「ancient」の意味は？",choices:["新しい","古代の","巨大な","小さな"],answer:1},
    {q:"「pretend」の意味は？",choices:["ふりをする","拒否する","信じる","疑う"],answer:0},
    {q:"「complicated」の意味は？",choices:["簡単な","複雑な","清潔な","汚い"],answer:1},
    {q:"「frequently」の意味は？",choices:["まれに","頻繁に","決して","ほとんど"],answer:1},
    {q:"「establish」の意味は？",choices:["設立する","破壊する","発見する","隠す"],answer:0},
    {q:"「emphasize」の意味は？",choices:["強調する","無視する","削減する","拡大する"],answer:0},
    {q:"「reveal」の意味は？",choices:["隠す","明らかにする","作る","壊す"],answer:1},
    {q:"「essential」の意味は？",choices:["不必要な","必要不可欠な","余分な","可能な"],answer:1},
    {q:"「struggle」の意味は？",choices:["遊ぶ","奮闘する","休む","眠る"],answer:1},
    {q:"「achievement」の意味は？",choices:["失敗","達成","始まり","終わり"],answer:1},
    {q:"「encourage」の意味は？",choices:["励ます","がっかりさせる","批判する","無視する"],answer:0},
    {q:"「significant」の意味は？",choices:["小さな","重要な","遅い","早い"],answer:1},
    {q:"「contribute」の意味は？",choices:["貢献する","破壊する","奪う","隠す"],answer:0},
    {q:"「opportunity」の意味は？",choices:["障害","機会","失敗","罰"],answer:1},
    {q:"「acquire」の意味は？",choices:["失う","獲得する","破壊する","返す"],answer:1},
    {q:"「modify」の意味は？",choices:["変更する","削除する","作成する","保持する"],answer:0},
  ],
  social:[
    {q:"日本の首都は？",choices:["大阪","京都","東京","名古屋"],answer:2},
    {q:"世界最大の国土面積の国は？",choices:["アメリカ","中国","ロシア","カナダ"],answer:2},
    {q:"国連本部がある都市は？",choices:["ロンドン","パリ","ニューヨーク","ジュネーブ"],answer:2},
    {q:"日本最大の湖は？",choices:["諏訪湖","霞ヶ浦","琵琶湖","浜名湖"],answer:2},
    {q:"世界で一番人口が多い国は？",choices:["中国","インド","アメリカ","ロシア"],answer:1},
    {q:"日本の三権分立で立法を担うのは？",choices:["内閣","国会","裁判所","天皇"],answer:1},
    {q:"アマゾン川が流れる大陸は？",choices:["アフリカ","南アメリカ","アジア","オセアニア"],answer:1},
    {q:"日本の最北端の島は？",choices:["北海道","択捉島","与那国島","沖ノ鳥島"],answer:1},
    {q:"消費税が初めて導入された年は？",choices:["1986年","1989年","1995年","2000年"],answer:1},
    {q:"日本国憲法の三大原則は？",choices:["平和・自由・平等","平和・基本的人権・国民主権","民主・自由・人権","主権・平等・自由"],answer:1},
    {q:"オーストラリアの首都は？",choices:["シドニー","メルボルン","キャンベラ","パース"],answer:2},
    {q:"世界一長い川は？",choices:["アマゾン川","ナイル川","長江","ミシシッピ川"],answer:1},
    {q:"日本で一番高い山は？",choices:["北岳","富士山","奥穂高岳","槍ヶ岳"],answer:1},
    {q:"カナダの首都は？",choices:["トロント","モントリオール","オタワ","バンクーバー"],answer:2},
    {q:"日本の県の数は？",choices:["43","45","47","49"],answer:2},
    {q:"EU(欧州連合)の本部がある国は？",choices:["フランス","ドイツ","ベルギー","オランダ"],answer:2},
    {q:"世界で一番面積が小さい国は？",choices:["モナコ","バチカン市国","ナウル","リヒテンシュタイン"],answer:1},
    {q:"砂漠で一番大きいのは？",choices:["ゴビ砂漠","サハラ砂漠","アラビア砂漠","カラハリ砂漠"],answer:1},
    {q:"日本の通貨単位は？",choices:["円","元","ウォン","ドル"],answer:0},
    {q:"国会議員の選挙権年齢は？",choices:["16歳","18歳","20歳","25歳"],answer:1},
    {q:"アフリカ大陸で一番人口が多い国は？",choices:["南アフリカ","エジプト","ナイジェリア","ケニア"],answer:2},
    {q:"GDPが世界2位の国は？",choices:["日本","中国","ドイツ","インド"],answer:1},
    {q:"日本の与党は？(2024年時点)",choices:["立憲民主党","自由民主党","公明党","維新の会"],answer:1},
    {q:"日本三大都市圏に含まれないのは？",choices:["札幌","東京","大阪","名古屋"],answer:0},
    {q:"地球の自転による線は？",choices:["緯線","経線","赤道","回帰線"],answer:1},
    {q:"日本の最南端の島は？",choices:["沖縄本島","沖ノ鳥島","与那国島","南鳥島"],answer:1},
    {q:"日本がG7に含まれるのは？",choices:["はい","いいえ","条件付き","オブザーバー"],answer:0},
    {q:"アメリカの州の数は？",choices:["48","50","52","54"],answer:1},
    {q:"地理用語「リアス式海岸」で有名なのは？",choices:["三陸海岸","湘南","江ノ島","房総半島"],answer:0},
    {q:"日本の主権が及ぶ範囲を定めた条約は？",choices:["日米安保条約","ポツダム宣言","サンフランシスコ平和条約","日中平和友好条約"],answer:2},
  ],
  math:[
    {q:"√144 = ?",choices:["11","12","13","14"],answer:1},
    {q:"2³ × 3 = ?",choices:["18","24","12","36"],answer:1},
    {q:"円周率πを小数第2位まで表すと？",choices:["3.14","3.15","3.12","3.16"],answer:0},
    {q:"12 × 13 = ?",choices:["144","152","156","148"],answer:2},
    {q:"15² = ?",choices:["215","225","235","255"],answer:1},
    {q:"7! = ?",choices:["2520","5040","720","40320"],answer:1},
    {q:"sin(30°) = ?",choices:["1/2","√3/2","1/√2","1"],answer:0},
    {q:"log₂8 = ?",choices:["2","3","4","8"],answer:1},
    {q:"x² - 5x + 6 = 0 の解は？",choices:["1,6","2,3","-2,-3","-1,-6"],answer:1},
    {q:"3辺3,4,5の三角形の面積は？",choices:["6","8","10","12"],answer:0},
    {q:"23 × 17 = ?",choices:["381","391","401","411"],answer:1},
    {q:"100の20%は？",choices:["10","15","20","25"],answer:2},
    {q:"1から10までの合計は？",choices:["45","50","55","60"],answer:2},
    {q:"半径5の円の面積は？(π=3.14)",choices:["78.5","31.4","314","25"],answer:0},
    {q:"6の階乗は？",choices:["120","720","360","60"],answer:1},
    {q:"cos(60°) = ?",choices:["1/2","√3/2","√2/2","1"],answer:0},
    {q:"-3 × -4 = ?",choices:["-12","12","-7","7"],answer:1},
    {q:"2^10 = ?",choices:["512","1024","2048","256"],answer:1},
    {q:"3/4 + 1/8 = ?",choices:["4/12","7/8","1/3","5/8"],answer:1},
    {q:"奇数の和: 1+3+5+...+19 = ?",choices:["80","90","100","110"],answer:2},
    {q:"60度を弧度法で表すと？",choices:["π/2","π/3","π/4","π/6"],answer:1},
    {q:"a²-b² の因数分解は？",choices:["(a+b)(a-b)","(a+b)²","(a-b)²","a²+b²"],answer:0},
    {q:"tan(45°) = ?",choices:["0","1","√2","√3"],answer:1},
    {q:"球の体積の公式は？",choices:["4πr²","4/3πr³","πr²h","2πr"],answer:1},
    {q:"y=2x+3 のy切片は？",choices:["2","3","0","-3"],answer:1},
    {q:"15と20の最大公約数は？",choices:["3","5","10","15"],answer:1},
    {q:"確率: コインを2回投げて2回とも表の確率は？",choices:["1/2","1/4","1/3","1/8"],answer:1},
    {q:"99 × 99 = ?",choices:["9701","9801","9901","9999"],answer:1},
    {q:"等差数列 2,5,8,11... の10番目は？",choices:["27","29","31","32"],answer:1},
    {q:"直方体の体積を求める公式は？",choices:["縦×横","縦×横×高さ","底面積×高さ÷3","4πr³/3"],answer:1},
  ],
  science:[
    {q:"光合成に必要なものは？",choices:["酸素","二酸化炭素","窒素","水素"],answer:1},
    {q:"水の化学式は？",choices:["CO2","H2O","NaCl","O2"],answer:1},
    {q:"地球から最も近い星は？",choices:["シリウス","ベガ","太陽","アルタイル"],answer:2},
    {q:"血液を全身に送る臓器は？",choices:["肺","肝臓","心臓","腎臓"],answer:2},
    {q:"音の速さは秒速約何m？",choices:["340m","100m","1000m","30000m"],answer:0},
    {q:"周期表の元素番号1番は？",choices:["ヘリウム","水素","酸素","炭素"],answer:1},
    {q:"絶対零度は何℃？",choices:["-100","-200","-273","-500"],answer:2},
    {q:"DNAの二重らせんを発見したのは？",choices:["メンデル","ダーウィン","ワトソンとクリック","パスツール"],answer:2},
    {q:"地球の自転周期は？",choices:["12時間","24時間","48時間","30日"],answer:1},
    {q:"原子の中心にあるものは？",choices:["電子","原子核","中性子","陽子"],answer:1},
    {q:"太陽系の惑星の数は？",choices:["7","8","9","10"],answer:1},
    {q:"植物が光合成で作るのは？",choices:["タンパク質","でんぷん","脂肪","ビタミン"],answer:1},
    {q:"重力加速度は約何m/s²？",choices:["8.8","9.8","10.8","11.8"],answer:1},
    {q:"水銀の元素記号は？",choices:["Mn","Hg","Mg","Hr"],answer:1},
    {q:"光の三原色は？",choices:["赤緑青","赤黄青","赤緑黄","青緑黄"],answer:0},
    {q:"哺乳類で唯一空を飛べるのは？",choices:["ムササビ","コウモリ","モモンガ","リス"],answer:1},
    {q:"地震の規模を表す単位は？",choices:["震度","マグニチュード","ガル","カイン"],answer:1},
    {q:"血液型の種類は何種類？(ABO式)",choices:["3種類","4種類","5種類","6種類"],answer:1},
    {q:"金属で常温で液体なのは？",choices:["鉄","水銀","金","銀"],answer:1},
    {q:"電気抵抗の単位は？",choices:["ボルト","アンペア","オーム","ワット"],answer:2},
    {q:"動物細胞にないものは？",choices:["核","ミトコンドリア","葉緑体","細胞膜"],answer:2},
    {q:"地球の表面で一番多いのは？",choices:["陸地","海","氷","砂漠"],answer:1},
    {q:"音は何の振動？",choices:["空気","水","電気","光"],answer:0},
    {q:"オゾン層がある場所は？",choices:["対流圏","成層圏","中間圏","熱圏"],answer:1},
    {q:"光の速さは秒速約何km？",choices:["30万km","300万km","3000km","3万km"],answer:0},
    {q:"プラスチックの主原料は？",choices:["木材","石油","金属","ガラス"],answer:1},
    {q:"鉄が錆びる反応は？",choices:["酸化","還元","分解","中和"],answer:0},
    {q:"昆虫の脚は何本？",choices:["4本","6本","8本","10本"],answer:1},
    {q:"地球の月の数は？",choices:["1個","2個","3個","4個"],answer:0},
    {q:"塩の化学式は？",choices:["NaCl","HCl","KCl","CaCl"],answer:0},
  ],
  history:[
    {q:"江戸幕府を開いたのは？",choices:["豊臣秀吉","織田信長","徳川家康","源頼朝"],answer:2},
    {q:"第二次世界大戦が終わった年は？",choices:["1943","1944","1945","1946"],answer:2},
    {q:"ピラミッドを建てた古代文明は？",choices:["ギリシャ","ローマ","エジプト","メソポタミア"],answer:2},
    {q:"日本最初の元号は？",choices:["昭和","大化","明治","平安"],answer:1},
    {q:"明治維新が起こった年は？",choices:["1853年","1868年","1877年","1889年"],answer:1},
    {q:"鎌倉幕府を開いたのは？",choices:["源頼朝","足利尊氏","平清盛","徳川家康"],answer:0},
    {q:"フランス革命が始まった年は？",choices:["1776年","1789年","1799年","1804年"],answer:1},
    {q:"奈良の大仏を建立した天皇は？",choices:["桓武天皇","聖武天皇","推古天皇","天武天皇"],answer:1},
    {q:"アメリカ独立宣言の年は？",choices:["1763年","1776年","1789年","1812年"],answer:1},
    {q:"卑弥呼が治めた国の名は？",choices:["邪馬台国","大和国","出雲国","倭国"],answer:0},
    {q:"室町幕府を開いたのは？",choices:["足利尊氏","新田義貞","楠木正成","後醍醐天皇"],answer:0},
    {q:"本能寺の変が起こった年は？",choices:["1573年","1582年","1592年","1600年"],answer:1},
    {q:"関ヶ原の戦いの年は？",choices:["1582年","1590年","1600年","1603年"],answer:2},
    {q:"ペリーが浦賀に来航した年は？",choices:["1843年","1853年","1863年","1873年"],answer:1},
    {q:"廃藩置県が行われた年は？",choices:["1868年","1871年","1873年","1877年"],answer:1},
    {q:"日本国憲法が施行された年は？",choices:["1945年","1946年","1947年","1950年"],answer:2},
    {q:"ベルリンの壁が崩壊した年は？",choices:["1985年","1989年","1991年","1995年"],answer:1},
    {q:"古代中国の万里の長城を作らせた皇帝は？",choices:["漢の武帝","秦の始皇帝","唐の太宗","隋の煬帝"],answer:1},
    {q:"応仁の乱が始まった年は？",choices:["1457年","1467年","1477年","1487年"],answer:1},
    {q:"日清戦争があった年は？",choices:["1884-85年","1894-95年","1904-05年","1914-18年"],answer:1},
    {q:"日露戦争があった年は？",choices:["1894-95年","1904-05年","1914-18年","1937-45年"],answer:1},
    {q:"第一次世界大戦の期間は？",choices:["1904-05年","1914-18年","1939-45年","1950-53年"],answer:1},
    {q:"江戸時代に鎖国を完成させた将軍は？",choices:["徳川家康","徳川秀忠","徳川家光","徳川綱吉"],answer:2},
    {q:"フランス革命のスローガンに含まれないのは？",choices:["自由","平等","友愛","平和"],answer:3},
    {q:"明智光秀が裏切った相手は？",choices:["豊臣秀吉","織田信長","徳川家康","武田信玄"],answer:1},
    {q:"アヘン戦争で戦ったのは？",choices:["イギリスと中国","フランスと中国","アメリカと日本","ロシアと日本"],answer:0},
    {q:"古代ギリシャの哲学者で『国家』を著したのは？",choices:["ソクラテス","プラトン","アリストテレス","ピタゴラス"],answer:1},
    {q:"幕末の薩長同盟を仲介したのは？",choices:["勝海舟","坂本龍馬","西郷隆盛","木戸孝允"],answer:1},
    {q:"ローマ帝国を東西に分けた皇帝は？",choices:["カエサル","アウグストゥス","コンスタンティヌス","テオドシウス"],answer:3},
    {q:"豊臣秀吉が行ったのは？",choices:["楽市楽座","太閤検地","参勤交代","公地公民"],answer:1},
  ],
  japanese:[
    {q:"「枕草子」を書いたのは？",choices:["紫式部","清少納言","和泉式部","松尾芭蕉"],answer:1},
    {q:"「諸行無常」の意味は？",choices:["全ては変わる","全ては同じ","平和の心","勝者の道"],answer:0},
    {q:"「破竹の勢い」の意味は？",choices:["弱々しい","止められない勢い","壊れる","退却"],answer:1},
    {q:"「絶句」を書いた中国の詩人は？",choices:["李白","杜甫","白居易","王維"],answer:1},
    {q:"「源氏物語」を書いたのは？",choices:["紫式部","清少納言","和泉式部","菅原孝標女"],answer:0},
    {q:"「徒然草」を書いたのは？",choices:["兼好法師","鴨長明","親鸞","西行"],answer:0},
    {q:"「五月雨」の読み方は？",choices:["ごがつあめ","さみだれ","つゆ","はるあめ"],answer:1},
    {q:"「奥の細道」の作者は？",choices:["与謝蕪村","小林一茶","松尾芭蕉","正岡子規"],answer:2},
    {q:"「夏目漱石」の代表作は？",choices:["羅生門","坊っちゃん","檸檬","蟹工船"],answer:1},
    {q:"「四面楚歌」の意味は？",choices:["四方の歌","周囲が敵だらけ","四回戦った","南の歌"],answer:1},
    {q:"「漁夫の利」の意味は？",choices:["漁師の幸運","争いの間に第三者が利を得る","海の恵み","勤勉な人"],answer:1},
    {q:"「方丈記」の作者は？",choices:["鴨長明","兼好法師","西行","紀貫之"],answer:0},
    {q:"「人間失格」の作者は？",choices:["太宰治","川端康成","三島由紀夫","芥川龍之介"],answer:0},
    {q:"「雪国」の作者は？",choices:["太宰治","川端康成","三島由紀夫","志賀直哉"],answer:1},
    {q:"「我輩は猫である」の作者は？",choices:["夏目漱石","森鴎外","樋口一葉","島崎藤村"],answer:0},
    {q:"「銀河鉄道の夜」の作者は？",choices:["宮沢賢治","北原白秋","萩原朔太郎","与謝野晶子"],answer:0},
    {q:"「人事を尽くして〇〇を待つ」の○○は？",choices:["天命","運命","神様","結果"],answer:0},
    {q:"「玄人」の読み方は？",choices:["げんと","くろうと","げんじん","くろじん"],answer:1},
    {q:"「臥薪嘗胆」の意味は？",choices:["復讐のために苦労に耐える","眠れない夜","薪を焼く","胆を試す"],answer:0},
    {q:"「七転八起」の意味は？",choices:["7回失敗する","失敗してもまた立ち上がる","8回成功する","早く起きる"],answer:1},
    {q:"「画竜点睛」の意味は？",choices:["最後の仕上げが重要","絵を描く","龍を点で書く","睛(ひとみ)を見る"],answer:0},
    {q:"「忖度」の読み方は？",choices:["そんたく","しんたく","ぐんたく","かんたく"],answer:0},
    {q:"「曖昧」の意味は？",choices:["はっきりしない","明確な","美しい","愚かな"],answer:0},
    {q:"「羅生門」の作者は？",choices:["芥川龍之介","太宰治","志賀直哉","川端康成"],answer:0},
    {q:"「老子」が説いた思想は？",choices:["儒教","道教","仏教","法家"],answer:1},
    {q:"古今和歌集の編者の1人は？",choices:["紀貫之","藤原定家","和泉式部","柿本人麻呂"],answer:0},
    {q:"「春はあけぼの」で始まる作品は？",choices:["枕草子","徒然草","方丈記","源氏物語"],answer:0},
    {q:"「一期一会」の意味は？",choices:["一生に一度の出会い","一年で一度の会","一日で一回会う","一度きりの試合"],answer:0},
    {q:"「以心伝心」の意味は？",choices:["言葉なく心が通じる","心配して伝える","信じて伝える","心を売る"],answer:0},
    {q:"「百聞は一見に〇〇」の○○は？",choices:["如かず","勝る","及ぶ","等しい"],answer:0},
  ],
};

const TABS = { HOME:"home", FRIENDS:"friends", RANKING:"ranking", GACHA:"gacha", PROFILE:"profile" };
const S = { ...TABS, PHOTO:"photo", RANKED:"ranked", LOBBY:"lobby", BATTLE:"battle", RESULT:"result", ONBOARDING:"onboarding", ENDLESS_SELECT:"endless_select", ENDLESS:"endless", DEX:"dex", ENDLESS_RESULT:"endless_result", SHOP:"shop", USER_PROFILE:"user_profile", TROPHIES:"trophies", SPLASH:"splash", TIMEATTACK_SELECT:"ta_select", TIMEATTACK:"ta", TIMEATTACK_RESULT:"ta_result", EVOLUTION:"evolution", REVIEW:"review", GACHA:"gacha", LISTENING:"listening", SPEAKING:"speaking", BOSS:"boss", BOSS_RESULT:"boss_result", FLASHCARD_SELECT:"fc_select", FLASHCARD:"flashcard", BOOKMARKS:"bookmarks" };

// ─── ボス（日替わり世界ボス・1日1回挑戦） ─────────────────────
// HP大: 世界中のプレイヤーが少しずつ削る想定。1人で全部削るのは無理だが、1位ランキングは狙える
const BOSSES = [
  { id:"dragon",    name:"知識の竜",       emoji:"🐉", hp:5000, color:"#EF4444", desc:"全教科の問題を出す古代竜",       reward:1500, weakness:null,       gachaTickets:1 },
  { id:"phoenix",   name:"灼熱の不死鳥",   emoji:"🔥", hp:4500, color:"#F472B6", desc:"高速の出題で集中を試す",         reward:1200, weakness:"english",  gachaTickets:1 },
  { id:"kraken",    name:"深淵の海王",     emoji:"🐙", hp:6000, color:"#60A5FA", desc:"知識の海の覇者",                 reward:1800, weakness:"math",     gachaTickets:1 },
  { id:"giant",     name:"古代の巨人",     emoji:"🗿", hp:7000, color:"#94a3b8", desc:"歴史の重みを背負う巨像",         reward:2000, weakness:"history",  gachaTickets:2 },
  { id:"yokai",     name:"森の妖怪",       emoji:"👹", hp:5500, color:"#A78BFA", desc:"言葉遊びで惑わす妖",             reward:1500, weakness:"japanese", gachaTickets:1 },
  // 🆕 追加2体
  { id:"chimera",   name:"幻獣キマイラ",   emoji:"🦁", hp:6500, color:"#FBBF24", desc:"全教科の混合問題で挑む",         reward:2200, weakness:null,       gachaTickets:2 },
  { id:"god",       name:"宇宙の創造神",   emoji:"🌌", hp:8500, color:"#FFFFFF", desc:"伝説の最強ボス・週末限定",       reward:5000, weakness:null,       gachaTickets:5, special:"weekend" },
];

function getCurrentBoss() {
  // 日替わり: 日数ベース
  const day = Math.floor((Date.now() / 1000 / 60 / 60 / 24));
  // 週末（土日）は宇宙の創造神を出現させる
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=日, 6=土
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return BOSSES[6]; // god
  }
  // 平日は6体（god以外）をローテーション
  const weekdayBosses = BOSSES.slice(0, 6);
  return weekdayBosses[day % weekdayBosses.length];
}

// 日付キー取得（YYYY-MM-DD）
function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ── 教科別サブジャンル ──────────────────────────────
const GENRE_TOPICS = {
  english: [
    { id:"all",      label:"おまかせ" },
    { id:"vocab",    label:"単語" },
    { id:"grammar",  label:"文法" },
    { id:"reading",  label:"読解" },
  ],
  math: [
    { id:"all",      label:"おまかせ" },
    { id:"calc",     label:"計算" },
    { id:"algebra",  label:"代数" },
    { id:"geometry", label:"図形" },
  ],
  japanese: [
    { id:"all",      label:"おまかせ" },
    { id:"kanji",    label:"漢字" },
    { id:"yojijukugo",label:"四字熟語" },
    { id:"classics", label:"古典" },
  ],
  social: [
    { id:"all",      label:"おまかせ" },
    { id:"civics",   label:"公民" },
    { id:"geo",      label:"地理" },
    { id:"politics", label:"政治" },
  ],
  science: [
    { id:"all",      label:"おまかせ" },
    { id:"physics",  label:"物理" },
    { id:"chemistry",label:"化学" },
    { id:"biology",  label:"生物" },
  ],
  history: [
    { id:"all",      label:"おまかせ" },
    { id:"japan",    label:"日本史" },
    { id:"world",    label:"世界史" },
    { id:"ancient",  label:"古代" },
  ],
};
const RANK_TIERS = [
  { id:"bronze",     name:"ブロンズ",     color:"#CD7F32", min:0,    max:1000, icon:"🥉", pop:25, title:"挑戦者" },
  { id:"silver",     name:"シルバー",     color:"#C0C0C0", min:1000, max:1500, icon:"🥈", pop:35, title:"剣士" },
  { id:"gold",       name:"ゴールド",     color:"#FBBF24", min:1500, max:2000, icon:"🥇", pop:20, title:"騎士" },
  { id:"platinum",   name:"プラチナ",     color:"#34D399", min:2000, max:2500, icon:"💠", pop:12, title:"勇者" },
  { id:"diamond",    name:"ダイヤ",       color:"#60A5FA", min:2500, max:3000, icon:"💎", pop:6,  title:"賢者" },
  { id:"doctorate",  name:"ドクタレイト", color:"#F472B6", min:3000, max:9999, icon:"👑", pop:2,  title:"伝説の博士" },
];

function getRank(rating) {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (rating >= RANK_TIERS[i].min) return RANK_TIERS[i];
  }
  return RANK_TIERS[0];
}

// ペットの気分（連勝数・連敗数から計算）
function getPetMood(winStreak, isOnLoss) {
  if (isOnLoss && isOnLoss >= 3) return { emoji:"😔", label:"元気ない", aura:"#64748b" };
  if (isOnLoss && isOnLoss >= 1) return { emoji:"😟", label:"がんばり中", aura:"#94a3b8" };
  if (winStreak >= 5) return { emoji:"🔥", label:"絶好調！", aura:"#FBBF24" };
  if (winStreak >= 2) return { emoji:"😊", label:"ご機嫌", aura:"#34D399" };
  return { emoji:"😌", label:"いつも通り", aura:"#60A5FA" };
}

function getNextRank(rating) {
  const cur = getRank(rating);
  const idx = RANK_TIERS.findIndex(r => r.id === cur.id);
  return RANK_TIERS[idx + 1] || cur;
}
const STARTER_EGGS = [
  { id:"flame",    name:"炎の卵",    color:"#F97316", desc:"情熱的で素早い" },
  { id:"water",    name:"水の卵",    color:"#3B82F6", desc:"冷静で柔軟" },
  { id:"tree",     name:"木の卵",    color:"#10B981", desc:"穏やかで知的" },
  { id:"crystal",  name:"光の卵",    color:"#FBBF24", desc:"神秘的で珍しい" },
  { id:"thunder",  name:"雷の卵",    color:"#A78BFA", desc:"電光石火" },
  { id:"shadow",   name:"闇の卵",    color:"#6366F1", desc:"静かで力強い" },
];

// ポップで機械感のないフォントスタック
const FONT = `"Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN W4", "Quicksand", "Rounded Mplus 1c", "Yu Gothic Medium", sans-serif`;


// 色を暗く/明るく
function shade(hex, pct) {
  if (!hex || !hex.startsWith("#")) return hex;
  const n = parseInt(hex.slice(1), 16);
  const r = (n>>16)&0xff, g = (n>>8)&0xff, b = n&0xff;
  const adj = v => Math.max(0, Math.min(255, v + Math.round(255 * pct/100)));
  return "#" + ((adj(r)<<16)|(adj(g)<<8)|adj(b)).toString(16).padStart(6,"0");
}

// ─── UIアイコン用ドット絵パターン ──────────────────
const ICON_PATTERNS = {
  // ジャンル
  english: [
    "........",
    ".CCCCCC.",
    "CCWWWWWC",
    "CWWWWWWC",
    "CWXXXXWC",
    "CWWWWWWC",
    "CWXXXXWC",
    ".CCCCCC.",
  ],
  math: [
    "........",
    ".CC..CC.",
    ".CC..CC.",
    "CCCCCCCC",
    "CCCCCCCC",
    ".CC..CC.",
    ".CC..CC.",
    "........",
  ],
  japanese: [
    "........",
    "..CCCC..",
    ".CCCCCC.",
    "CCCXXCCC",
    "CCCCCCCC",
    "CCXXXXCC",
    ".CCCCCC.",
    "..C..C..",
  ],
  social: [
    "........",
    "..CCCC..",
    ".CCWWCC.",
    "CWCCCCWC",
    "CCWCCWCC",
    "CWCCCCWC",
    ".CCWWCC.",
    "..CCCC..",
  ],
  science: [
    "...CC...",
    "...CC...",
    "...CC...",
    "..CCCC..",
    "..CCCC..",
    ".CCWWCC.",
    "CCWWWWCC",
    "CCCCCCCC",
  ],
  history: [
    ".CCCCCC.",
    "CCCCCCCC",
    "CC....CC",
    "CC.CC.CC",
    "CC....CC",
    "CC.CC.CC",
    "CCCCCCCC",
    ".CCCCCC.",
  ],
  // UI
  camera: [
    "........",
    "..CCCC..",
    "CCCCCCCC",
    "CCWWWWCC",
    "CWCCCCWC",
    "CWCCCCWC",
    "CCWWWWCC",
    "CCCCCCCC",
  ],
  folder: [
    "........",
    "CCC.....",
    "CCCCCCCC",
    "C......C",
    "C.WWWW.C",
    "C.WWWW.C",
    "C......C",
    "CCCCCCCC",
  ],
  crown: [
    "........",
    "C..CC..C",
    "CC.CC.CC",
    "CCCCCCCC",
    "CCCWWCCC",
    "CCCWWCCC",
    "CCCCCCCC",
    "........",
  ],
  trophy: [
    "..CCCC..",
    ".CCCCCC.",
    "CCCCCCCC",
    "CCWWWWCC",
    ".CCCCCC.",
    "..CCCC..",
    "..CCCC..",
    ".CCCCCC.",
  ],
  sword: [
    ".......C",
    "......CC",
    ".....CCC",
    "....CCC.",
    "...CCC..",
    "..CCC...",
    ".CCC....",
    "CC......",
  ],
  star: [
    "...CC...",
    "..CCCC..",
    "CCCCCCCC",
    ".CCCCCC.",
    "..CCCC..",
    ".CCCCCC.",
    "CC....CC",
    "C......C",
  ],
  fire: [
    "...CC...",
    "..CCCC..",
    "..CCCC..",
    ".CCCCCC.",
    ".CCWWCC.",
    "CCCWWCCC",
    "CCCCCCCC",
    ".CCCCCC.",
  ],
  check: [
    "........",
    ".......C",
    "......CC",
    "C....CCC",
    "CC..CCCC",
    "CCCCCC..",
    ".CCCC...",
    "..CC....",
  ],
  diamond: [
    "...CC...",
    "..CWWC..",
    ".CWCCWC.",
    "CWCCCCWC",
    "CCCCCCCC",
    ".CCCCCC.",
    "..CCCC..",
    "...CC...",
  ],
  calendar: [
    "CC....CC",
    "CCCCCCCC",
    "CCCCCCCC",
    "CC.CC.CC",
    "CC.CC.CC",
    "CC.CC.CC",
    "CC.CC.CC",
    "CCCCCCCC",
  ],
  arrow_right: [
    "........",
    "....C...",
    "....CC..",
    "CCCCCCC.",
    "CCCCCCCC",
    "CCCCCCC.",
    "....CC..",
    "....C...",
  ],
  question: [
    "..CCCC..",
    ".CCCCCC.",
    "CC....CC",
    "....CCCC",
    "...CCCC.",
    "...CC...",
    "........",
    "...CC...",
  ],
  pencil: [
    ".......C",
    "......CC",
    ".....CCW",
    "....CCWC",
    "...CCWC.",
    "..CCWC..",
    ".CCWC...",
    "CCWC....",
  ],
  spark: [
    "...C....",
    "..CCC...",
    "C.CCC.CC",
    "CCCCCCCC",
    "C.CCC.CC",
    "..CCC...",
    "...C....",
    "........",
  ],
};

// ジャンル → アイコン名
const GENRE_ICON_NAME = {
  english: "english",
  math: "math",
  japanese: "japanese",
  social: "social",
  science: "science",
  history: "history",
};

// 汎用アイコンコンポーネント
function PixelIcon({ name, size = 24, color = "#fff", bg = null }) {
  const pattern = ICON_PATTERNS[name];
  if (!pattern) return null;
  const cols = pattern[0].length;
  const rows = pattern.length;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      style={{ display:"block" }}
    >
      {pattern.map((row, y) =>
        row.split("").map((ch, x) => {
          let c = null;
          if (ch === "C") c = color;
          else if (ch === "W") c = bg || "#fff";
          else if (ch === "X") c = "#0f172a";
          if (!c) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={c} />;
        })
      )}
    </svg>
  );
}

// ─── ペット用ピクセルパターン（丸みのある可愛いカラフルドット） ──
// 1枚目の本みたいに、輪郭くっきり＋ハイライトで丸みのある可愛い見た目

// 共通記号:
// .=透明 D=輪郭(最暗) S=本体色 M=影 L=ハイライト H=最明 Y=黄(目) X=黒(瞳) G=サブカラー W=白

// Stage 1: たまご型（縦長の卵、ハイライト付き）
const PIXEL_EGG = [
  "...DDDD...",
  "..DSSSSD..",
  ".DSHSSSSD.",
  "DSHHSSSSD.",
  "DSHSSSSSSD",
  "DSSSSSSSSD",
  "DSSSSSSSSD",
  "DSSSSSSSSD",
  "DSSSSSSSSD",
  "DSSSSSSSSD",
  ".DSSSSSSD.",
  ".DSMMMMSD.",
  "..DDMMDD..",
  "...DDDD...",
];

// Stage 2: 殻が割れて目が見える
const PIXEL_HATCH = [
  "...DDDD...",
  "..DSSSSD..",
  ".DSHSSSSD.",
  "DDSSSSSSDD",
  "DSYDSSDYSD",
  "DSXDSSDXSD",
  "DSSSSSSSSD",
  "DSSMMMSSD.",
  "DSDSSSSDSD",
  ".DDSSSSDD.",
  "..DDDDDD..",
  "..DD.DDDD.",
  "..........",
  "..........",
];

// ── 英語: ヘビ系（とぐろを巻いた丸い感じ） ──
const PIXEL_OWL_S = [  // Stage 3 小: 丸っこいヘビの卵から顔だけ
  "..DDDDD...",
  ".DSHSSSD..",
  "DSHSSSSSD.",
  "DSYDSDYSSD",
  "DSXDSDXSSD",
  "DSSSSSSSSD",
  "DSDDMMDDDD",
  ".DDDDDDDD.",
  "..........",
  "..........",
];

const PIXEL_OWL_M = [  // Stage 4: ヘビ
  "...DDDD.....",
  "..DSHSSD....",
  ".DSHSSSSD...",
  "DSYDSDYSSD..",
  "DSXDSDXSSD..",
  "DSSSSSSSDDD.",
  "DSSSSSDSSSDD",
  ".DSSDDDDSSSD",
  "..DSSSSSDDSD",
  "...DDDDDDDD.",
  "............",
  "............",
];

const PIXEL_OWL_L = [  // Stage 5: 大蛇
  "...DDDD.....",
  "..DSHSSD....",
  ".DSHGGGSSD..",
  "DSYDGDDYSSD.",
  "DSXDDDDXSSD.",
  "DSSSSSSSSSDD",
  "DSSSSGSGSSSD",
  "DSSDDDDDDSSD",
  "DDDSSSSSDDDD",
  ".DDSSDDDDDD.",
  "..DDSSSSDD..",
  "...DDDDDD...",
];

// ── 数学: ロボット系（角ばってるけど丸みもある） ──
const PIXEL_ROBOT_S = [
  "...DDDD...",
  "..DSHSSD..",
  ".DSHSSSSD.",
  "DSYSSSSSYD",
  "DSXSSSSSXD",
  "DSSSDDSSSD",
  "DSSSSSSSSD",
  ".DDDDDDDD.",
  ".D..DD..D.",
  "..........",
];

const PIXEL_ROBOT_M = [
  "..DDDDDD....",
  ".DSHSSSSD...",
  "DSHHSSSSSD..",
  "DSYSSSSSYSD.",
  "DSXSSSSSXSD.",
  "DSGSSSSSSGD.",
  "DSSDDDDDSSD.",
  "DSSSSSSSSSD.",
  ".DDSSSSSSDD.",
  ".D.DDDDDD.D.",
  "............",
  "............",
];

const PIXEL_ROBOT_L = [
  ".DDDDDDDDDD.",
  "DSHHSSSSSHSD",
  "DSHSSSSSSSSD",
  "DSYSSSSSSYSD",
  "DSXSSSSSSXSD",
  "DSGSSGSGSSGD",
  "DSSDDDDDDSSD",
  "DSSSSSSSSSSD",
  "DSGSSSSSSGSD",
  ".DSSSSSSSSD.",
  ".DDSSSSSSDD.",
  "..D.DDDD.D..",
];

// ── 国語: たぬき系（丸っこい毛玉） ──
const PIXEL_RACCOON_S = [
  "..DDDDDD..",
  ".DSHSSSSD.",
  "DSHSSSSSSD",
  "DSYDSSDYSD",
  "DSXDSSDXSD",
  "DSSSGGSSSD",
  "DSSSSSSSSD",
  ".DSSSSSSD.",
  "..DDDDDD..",
  "..........",
];

const PIXEL_RACCOON_M = [
  ".DD....DD...",
  "DSHD..DSSD..",
  "DSHSDDSSSD..",
  "DSYDSSDYSSD.",
  "DSXDSSDXSSD.",
  "DSSSGGGGSSD.",
  "DSSSSSSSSSD.",
  ".DSSSSSSSSD.",
  "..DDSSSSDD..",
  "..D.DDDD.D..",
  "............",
  "............",
];

const PIXEL_RACCOON_L = [
  "DD........DD",
  "DSHD....DSSD",
  "DSHHDDDDSSSD",
  "DSYDSSSSDYSD",
  "DSXDSSSSDXSD",
  "DSSSGGGGSSSD",
  "DSSSSSSSSSSD",
  "DSSSSSSSSSSD",
  ".DSSSSSSSSD.",
  "..DDSSSSDD..",
  ".D.DDDDDD.D.",
  "............",
];

// ── 社会: 狼系（スケッチの狼参考） ──
const PIXEL_FOX_S = [  // 子狼
  "..DD..DD..",
  ".DSHDDSHD.",
  "DSHHDDSHSD",
  "DSYDDDDYSD",
  "DSXDGGDXSD",
  "DSSSGGSSSD",
  "DSSMMMMSSD",
  ".DSSSSSSD.",
  "..DDDDDD..",
  "..........",
];

const PIXEL_FOX_M = [  // 立ち姿の狼
  "DD........DD",
  "DSHD......DS",
  "DSHHDDDDDSHD",
  "DSYDGGGGDYSD",
  "DSXDGGGGDXSD",
  "DSSSGGGGSSSD",
  "DSSMMMMMMSSD",
  "DSSSSSSSSSDD",
  ".DSSSSSSSSDD",
  ".DD.DDDD.DDD",
  ".D...DD...D.",
  "............",
];

const PIXEL_FOX_L = [  // 大狼
  "DD........DD",
  "DSHD....DSSD",
  "DSHHDDDDSHSD",
  "DSYDGGGGDYSD",
  "DSXDGGGGDXSD",
  "DSSSGGGGSSSD",
  "DSSMMMMMMSSD",
  "DSSSSSSSSSSD",
  "DSSSSSSSSSSD",
  ".DDD.DD.DDDD",
  "..D...DD...D",
  "............",
];

// ── 理科: 蝶系（ふわっと羽根） ──
const PIXEL_BUTTERFLY_S = [
  ".GG....GG.",
  "GHGD..DGHG",
  "GHSDSSDSHG",
  ".GSYDDYSG.",
  ".GSXDDXSG.",
  "GHSDSSDSHG",
  "GHGD..DGHG",
  ".GG....GG.",
  "..........",
  "..........",
];

const PIXEL_BUTTERFLY_M = [
  "GGG......GGG",
  "GHGGD..DGGHG",
  "GHGSDDDDSGHG",
  "GHSDYDDYDSHG",
  "GSSDXDDXDSSG",
  "GSSDSSSSDSSG",
  "GHSDMMMMDSHG",
  "GHGSDDDDSGHG",
  "GHGGD..DGGHG",
  "GGG......GGG",
  ".GG......GG.",
  "............",
];

const PIXEL_BUTTERFLY_L = [
  "GGG......GGG",
  "GHGGDDDDGGHG",
  "GHGSDDDDSGHG",
  "GHSDYDDYDSHG",
  "GHSDXDDXDSHG",
  "GSSDSSSSDSSG",
  "GSSDGGGGDSSG",
  "GSSDMMMMDSSG",
  "GHSSDDDDSSGH",
  "GHGSDDDDSGHG",
  "GHGGDDDDGGHG",
  ".GG......GG.",
];

// ── 歴史: ドラゴン系（スケッチのドラゴン参考、翼を広げる） ──
const PIXEL_DRAGON_S = [  // 卵風ドラゴンの赤ちゃん
  "..DDDDDD..",
  ".DSHSSSSD.",
  "DSHGGSSSD.",
  "DSYDSSDYSD",
  "DSXDSSDXSD",
  "DSSSGGSSSD",
  "DSSSSSSSSD",
  ".DSGGGGSD.",
  "..DDSSDD..",
  "...DDDD...",
];

const PIXEL_DRAGON_M = [  // 翼が出る
  "GG........GG",
  "GHGD....DGHG",
  "GSSDDDDDDSSG",
  "GSSHSSSSHSSG",
  ".DSYDSSDYSD.",
  ".DSXDSSDXSD.",
  ".DSSSGGSSSD.",
  ".DSSMMMMSSD.",
  "..DSSSSSSDDS",
  "...DDDDDDDSS",
  ".....SSSSSS.",
  "............",
];

const PIXEL_DRAGON_L = [  // 翼を大きく広げたドラゴン
  "GGG......GGG",
  "GHGGDDDDGGHG",
  "GSSHSSSSHSSG",
  "GSYDSSSSDYSG",
  "GSXDSSSSDXSG",
  "GSSSGGGGSSSG",
  "GSSMMMMMMSSG",
  "GSSSSSSSSSSG",
  ".DSSSSSSSSD.",
  "..DGGGGGGD..",
  "...DDDDDD...",
  "............",
];

// ジャンル別パレット（カラフルで丸みのあるポップな見た目）
function petPalette(genreId, mainColor) {
  return {
    D: shade(mainColor, -55),    // 輪郭(最暗・はっきり)
    S: mainColor,                 // 基本色
    M: shade(mainColor, -25),     // 影
    L: shade(mainColor, 20),      // 中明
    H: shade(mainColor, 45),      // ハイライト(明るく)
    Y: "#FBBF24",                 // 目(黄)
    X: "#0f172a",                 // 瞳(黒)
    G: shade(mainColor, -10),     // サブカラー(同系色やや暗)
    W: "#ffffff",                 // 白
  };
}

// ジャンル別: 段階(0-2)に応じてサイズが大きくなる
const CREATURE_PIXELS = {
  english: {
    stages: [PIXEL_OWL_S, PIXEL_OWL_M, PIXEL_OWL_L],
    getPalette: c => petPalette("english", c),
  },
  math: {
    stages: [PIXEL_ROBOT_S, PIXEL_ROBOT_M, PIXEL_ROBOT_L],
    getPalette: c => petPalette("math", c),
  },
  japanese: {
    stages: [PIXEL_RACCOON_S, PIXEL_RACCOON_M, PIXEL_RACCOON_L],
    getPalette: c => petPalette("japanese", c),
  },
  social: {
    stages: [PIXEL_FOX_S, PIXEL_FOX_M, PIXEL_FOX_L],
    getPalette: c => petPalette("social", c),
  },
  science: {
    stages: [PIXEL_BUTTERFLY_S, PIXEL_BUTTERFLY_M, PIXEL_BUTTERFLY_L],
    getPalette: c => petPalette("science", c),
  },
  history: {
    stages: [PIXEL_DRAGON_S, PIXEL_DRAGON_M, PIXEL_DRAGON_L],
    getPalette: c => petPalette("history", c),
  },
};

// 汎用ピクセルスプライト
function PixelSprite({ pattern, palette, size, glow }) {
  const cols = pattern[0].length;
  const rows = pattern.length;
  return (
    <svg
      width={size}
      height={size * (rows/cols)}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      style={{ display:"block", imageRendering:"pixelated", filter: glow ? `drop-shadow(2px 2px 0 rgba(0,0,0,0.4)) drop-shadow(0 0 ${size/8}px ${glow})` : "drop-shadow(2px 2px 0 rgba(0,0,0,0.4))" }}
    >
      {pattern.map((row, y) =>
        row.split("").map((ch, x) => {
          const color = palette[ch];
          if (!color) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={color} />;
        })
      )}
    </svg>
  );
}

function HPBar({ hp, maxHp, color="#34D399", compact, showText }) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const c = pct > 50 ? color : pct > 25 ? "#FBBF24" : "#EF4444";
  return (
    <div style={{ width:"100%" }}>
      {showText && (
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:11, fontWeight:600 }}>
          <span style={{ color:"#94a3b8" }}>HP</span>
          <span style={{ color:c }}>{hp} / {maxHp}</span>
        </div>
      )}
      <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:99, height:compact?6:9, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", borderRadius:99, background:c, transition:"width 0.5s cubic-bezier(.34,1.56,.64,1)", boxShadow:`0 0 8px ${c}88` }} />
      </div>
    </div>
  );
}

// ── ドット絵モンスター ─────────────────────────────────
function PixelMonster({ monster, size=120 }) {
  const cols = monster.pixels[0].length;
  const rows = monster.pixels.length;
  return (
    <svg
      width={size}
      height={size * (rows/cols)}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      style={{ imageRendering:"pixelated", display:"block", filter:`drop-shadow(0 0 ${size/6}px ${monster.color}aa)` }}
    >
      {monster.pixels.map((row, y) =>
        row.split("").map((ch, x) => {
          const color = monster.palette[ch];
          if (!color) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={color} />;
        })
      )}
    </svg>
  );
}

function DmgPop({ dmg, id }) {
  // dmgは数値 or { amount, crit, taken } オブジェクト
  const amount = typeof dmg === "object" ? dmg.amount : dmg;
  const isCrit = typeof dmg === "object" && dmg.crit;
  const isTaken = typeof dmg === "object" && dmg.taken;
  const color = isCrit ? "#FBBF24" : isTaken ? "#EF4444" : "#F472B6";
  return (
    <div key={id} style={{
      position:"absolute", top:"5%", left:"50%", transform:"translateX(-50%)",
      fontSize: isCrit ? 56 : 44,
      fontWeight:900, color,
      textShadow:`0 0 24px ${color}, 0 0 12px ${color}, 0 2px 0 rgba(0,0,0,0.6)`,
      animation: isCrit ? "dmgCrit 1.1s ease forwards" : "dmgFloat 0.9s ease forwards",
      pointerEvents:"none", zIndex:50, whiteSpace:"nowrap",
      letterSpacing:1,
    }}>
      {isCrit && <div style={{ fontSize:14, fontWeight:900, color:"#FBBF24", textShadow:"0 0 10px #FBBF24", marginBottom:-4 }}>⚡CRITICAL⚡</div>}
      -{amount}!
    </div>
  );
}

function BattleCard({ player, rank, userGenreXp, userStarterEgg }) {
  const rankBg = ["#FBBF24","#94a3b8","#b45309","rgba(255,255,255,0.08)"];
  const hpCol = player.hp > 50 ? "#34D399" : player.hp > 25 ? "#FBBF24" : "#EF4444";
  // ペット表示
  const showPet = player.isPet !== false;
  const petGenreXp = player.isUser ? userGenreXp : (player.petGenreXp || {});
  const petEgg = player.isUser ? userStarterEgg : (player.petStarterColor ? { color: player.petStarterColor } : null);
  return (
    <div style={{
      background: player.isUser ? "rgba(96,165,250,0.08)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${player.isUser ? "rgba(96,165,250,0.3)" : "rgba(255,255,255,0.07)"}`,
      borderRadius:14, padding:"9px 13px", display:"flex", alignItems:"center", gap:9,
      boxShadow: player.isUser ? "0 0 20px rgba(96,165,250,0.1)" : "none",
      opacity: player.hp <= 0 ? 0.4 : 1,
    }}>
      <div style={{ width:24, height:24, borderRadius:8, background:rankBg[rank-1]||rankBg[3], display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color: rank<=3?"#0f172a":"#64748b", flexShrink:0 }}>{rank}</div>
      {showPet && (petGenreXp && Object.keys(petGenreXp).length > 0) ? (
        <div style={{ width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <PetDisplay genreXp={petGenreXp} size={28} starterEgg={petEgg} />
        </div>
      ) : (
        <span style={{ fontSize:22, flexShrink:0 }}>{player.avatar}</span>
      )}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}>
          <span style={{ fontSize:12, fontWeight:700, color: player.isUser ? "#93C5FD" : "#cbd5e1" }}>{player.name}</span>
          {player.hp <= 0 && <span style={{ fontSize:9, background:"#7c2d12", color:"#fecaca", borderRadius:99, padding:"1px 6px", fontWeight:700 }}>DOWN</span>}
        </div>
        <HPBar hp={player.hp} maxHp={player.maxHp} color={hpCol} compact />
      </div>
      <div style={{ textAlign:"right", flexShrink:0 }}>
        <div style={{ fontSize:17, fontWeight:700, color:"#f1f5f9" }}>{player.score}</div>
        <div style={{ fontSize:9, color:"#64748b" }}>pts</div>
      </div>
    </div>
  );
}

// ── 進化システム ──────────────────────────────────────
function getGenreLevel(xp) {
  // 100XPごとに1レベル、上限LV99
  return Math.min(99, Math.floor((xp || 0) / 100) + 1);
}
function getGenreLevelProgress(xp) {
  // 現在LVへの進捗（0〜1）
  return ((xp || 0) % 100) / 100;
}

function getTotalXp(genreXp) {
  return Object.values(genreXp).reduce((s, v) => s + v, 0);
}

function getStage(totalXp) {
  for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= STAGE_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

function getNextStageXp(totalXp) {
  for (const t of STAGE_THRESHOLDS) if (totalXp < t) return t;
  return STAGE_THRESHOLDS[STAGE_THRESHOLDS.length - 1];
}

function getTopGenres(genreXp) {
  return Object.entries(genreXp)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, v]) => v > 0);
}

// 忘却曲線復習リスト: 間違えた問題のうち「復習すべきタイミング」のものを抽出
// 1日後・3日後・7日後の3ピークで通知する
function getReviewQueue(answerHistory) {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  // 間違えた問題だけ集める
  const wrongs = answerHistory.filter(h => !h.correct);
  // 同じ問題は最新のもののみ（重複削除）
  const uniqMap = new Map();
  wrongs.forEach(w => {
    const key = w.q;
    if (!uniqMap.has(key) || uniqMap.get(key).timestamp < w.timestamp) {
      uniqMap.set(key, w);
    }
  });
  const uniqWrongs = Array.from(uniqMap.values());
  // 復習タイミング判定（経過日数とピーク日数）
  const queue = uniqWrongs.map(w => {
    const ageDays = (now - w.timestamp) / dayMs;
    let priority = 0;
    let label = "";
    let due = false;
    if (ageDays >= 0.9 && ageDays < 1.3) { priority = 3; label = "1日後"; due = true; }
    else if (ageDays >= 2.8 && ageDays < 3.3) { priority = 2; label = "3日後"; due = true; }
    else if (ageDays >= 6.8 && ageDays < 7.5) { priority = 1; label = "7日後"; due = true; }
    else if (ageDays >= 1.3 && ageDays < 2.8) { priority = 0; label = "もうすぐ復習"; }
    else if (ageDays >= 3.3 && ageDays < 6.8) { priority = 0; label = "復習推奨"; }
    return { ...w, ageDays, priority, label, due };
  });
  return queue.sort((a, b) => b.priority - a.priority);
}


// ── ペット表示（ドット絵） ────────────────────────────
// ─── ペット SVG（アイコンスタイル・5段階進化） ────────
// カラー: クリーム卵 + ミントグリーン恐竜 + 茶色のアウトライン
const PET_COLORS = {
  egg: "#FFF8E1",         // 卵の本体
  eggShade: "#E8DDB8",    // 卵の影
  eggSpot: "#D4C49C",     // 卵の斑点
  body: "#A8D5BA",        // 恐竜の体（ミントグリーン）
  bodyShade: "#7DB89A",   // 体の影
  outline: "#5D3D1F",     // 茶色のアウトライン
  eye: "#1a0e08",         // 目
  highlight: "#FFFFFF",   // 光沢
};

function PetSVG({ stage, size = 60, color = null }) {
  // color が指定された場合は体色を上書き（教科進化時用）
  const body = color || PET_COLORS.body;
  // 色から影を計算
  const bodyShade = color ? shade(color, -20) : PET_COLORS.bodyShade;
  
  // 共通の SVG プロパティ
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    style: { display: "block" },
  };

  if (stage === 1) {
    // Lv1: たまご（小さい）
    return (
      <svg {...props}>
        <ellipse cx="50" cy="58" rx="28" ry="34"
          fill={PET_COLORS.egg} stroke={PET_COLORS.outline} strokeWidth="3"/>
        {/* 斑点 */}
        <circle cx="42" cy="70" r="2.5" fill={PET_COLORS.eggSpot}/>
        <circle cx="55" cy="78" r="2" fill={PET_COLORS.eggSpot}/>
        <circle cx="48" cy="84" r="1.8" fill={PET_COLORS.eggSpot}/>
        {/* ハイライト */}
        <ellipse cx="40" cy="40" rx="6" ry="10" fill={PET_COLORS.highlight} opacity="0.5"/>
      </svg>
    );
  }

  if (stage === 2) {
    // Lv2: 卵から目だけ覗く（ジグザグ模様付き）
    return (
      <svg {...props}>
        {/* 卵の下半分 */}
        <path d="M 22 56 Q 22 92, 50 92 Q 78 92, 78 56 L 78 56 L 22 56 Z"
          fill={PET_COLORS.egg} stroke={PET_COLORS.outline} strokeWidth="3"/>
        {/* ジグザグの割れ目 */}
        <path d="M 22 56 L 30 50 L 38 56 L 46 50 L 54 56 L 62 50 L 70 56 L 78 56"
          fill="none" stroke={PET_COLORS.outline} strokeWidth="3" strokeLinejoin="round"/>
        {/* 恐竜の目（卵から覗く） */}
        <circle cx="42" cy="62" r="2.5" fill={PET_COLORS.eye}/>
        <circle cx="58" cy="62" r="2.5" fill={PET_COLORS.eye}/>
        {/* 卵の斑点 */}
        <circle cx="38" cy="80" r="2" fill={PET_COLORS.eggSpot}/>
        <circle cx="60" cy="78" r="1.8" fill={PET_COLORS.eggSpot}/>
      </svg>
    );
  }

  if (stage === 3) {
    // Lv3: 卵を破って恐竜の頭が出てる（アイコンと同じデザイン）
    return (
      <svg {...props}>
        {/* 恐竜の頭（卵の中・上半分が出てる） */}
        <ellipse cx="50" cy="48" rx="22" ry="20"
          fill={body} stroke={PET_COLORS.outline} strokeWidth="3"/>
        {/* 頭の上の小さなトゲ */}
        <path d="M 36 35 L 39 28 L 42 33 L 45 26 L 48 32 L 51 25 L 54 32 L 57 26 L 60 33 L 63 28 L 66 35"
          fill={body} stroke={PET_COLORS.outline} strokeWidth="2.5" strokeLinejoin="round"/>
        {/* 卵の下半分（破れた状態） */}
        <path d="M 22 60 Q 22 92, 50 92 Q 78 92, 78 60 L 78 60 L 22 60 Z"
          fill={PET_COLORS.egg} stroke={PET_COLORS.outline} strokeWidth="3"/>
        {/* ジグザグの割れ目 */}
        <path d="M 22 60 L 30 54 L 38 60 L 46 54 L 54 60 L 62 54 L 70 60 L 78 60"
          fill="none" stroke={PET_COLORS.outline} strokeWidth="3" strokeLinejoin="round"/>
        {/* 目 */}
        <circle cx="42" cy="50" r="2.5" fill={PET_COLORS.eye}/>
        <circle cx="58" cy="50" r="2.5" fill={PET_COLORS.eye}/>
        {/* 目のハイライト */}
        <circle cx="43" cy="49" r="0.8" fill={PET_COLORS.highlight}/>
        <circle cx="59" cy="49" r="0.8" fill={PET_COLORS.highlight}/>
        {/* 卵の斑点 */}
        <circle cx="38" cy="80" r="2" fill={PET_COLORS.eggSpot}/>
        <circle cx="60" cy="78" r="1.8" fill={PET_COLORS.eggSpot}/>
      </svg>
    );
  }

  if (stage === 4) {
    // Lv4: 殻が落ちて恐竜が完全に立ち上がる
    return (
      <svg {...props}>
        {/* しっぽ */}
        <path d="M 28 65 Q 15 50, 22 38 Q 30 30, 38 40"
          fill={body} stroke={PET_COLORS.outline} strokeWidth="3" strokeLinejoin="round"/>
        {/* 体 */}
        <ellipse cx="50" cy="65" rx="22" ry="20"
          fill={body} stroke={PET_COLORS.outline} strokeWidth="3"/>
        {/* 足（2本見える） */}
        <ellipse cx="42" cy="85" rx="5" ry="6"
          fill={body} stroke={PET_COLORS.outline} strokeWidth="2.5"/>
        <ellipse cx="58" cy="85" rx="5" ry="6"
          fill={body} stroke={PET_COLORS.outline} strokeWidth="2.5"/>
        {/* 頭 */}
        <ellipse cx="50" cy="40" rx="18" ry="17"
          fill={body} stroke={PET_COLORS.outline} strokeWidth="3"/>
        {/* 背中のトゲ（ジグザグ） */}
        <path d="M 36 30 L 39 22 L 43 27 L 47 20 L 51 26 L 55 19 L 59 26 L 63 22 L 66 30"
          fill={body} stroke={PET_COLORS.outline} strokeWidth="2.5" strokeLinejoin="round"/>
        {/* 目 */}
        <circle cx="43" cy="42" r="3" fill={PET_COLORS.eye}/>
        <circle cx="57" cy="42" r="3" fill={PET_COLORS.eye}/>
        <circle cx="44" cy="41" r="1" fill={PET_COLORS.highlight}/>
        <circle cx="58" cy="41" r="1" fill={PET_COLORS.highlight}/>
        {/* お腹 */}
        <ellipse cx="50" cy="68" rx="12" ry="10" fill={PET_COLORS.egg} opacity="0.5"/>
      </svg>
    );
  }

  // Lv5: 大きく成長した恐竜（堂々とした姿）
  return (
    <svg {...props}>
      {/* 長いしっぽ */}
      <path d="M 24 70 Q 8 60, 12 42 Q 18 28, 30 32 Q 38 38, 36 48"
        fill={body} stroke={PET_COLORS.outline} strokeWidth="3" strokeLinejoin="round"/>
      {/* 体（大きく） */}
      <ellipse cx="52" cy="64" rx="26" ry="22"
        fill={body} stroke={PET_COLORS.outline} strokeWidth="3"/>
      {/* 足（4本） */}
      <ellipse cx="38" cy="86" rx="5" ry="7" fill={body} stroke={PET_COLORS.outline} strokeWidth="2.5"/>
      <ellipse cx="50" cy="88" rx="5" ry="6" fill={body} stroke={PET_COLORS.outline} strokeWidth="2.5"/>
      <ellipse cx="62" cy="86" rx="5" ry="7" fill={body} stroke={PET_COLORS.outline} strokeWidth="2.5"/>
      {/* 頭（大きく） */}
      <ellipse cx="55" cy="38" rx="20" ry="18"
        fill={body} stroke={PET_COLORS.outline} strokeWidth="3"/>
      {/* 大きな背中のトゲ */}
      <path d="M 32 28 L 36 18 L 42 25 L 48 14 L 54 24 L 60 13 L 66 24 L 72 17 L 76 28"
        fill={body} stroke={PET_COLORS.outline} strokeWidth="2.5" strokeLinejoin="round"/>
      {/* 目（大きく光る） */}
      <circle cx="48" cy="40" r="3.5" fill={PET_COLORS.eye}/>
      <circle cx="62" cy="40" r="3.5" fill={PET_COLORS.eye}/>
      <circle cx="49" cy="39" r="1.3" fill={PET_COLORS.highlight}/>
      <circle cx="63" cy="39" r="1.3" fill={PET_COLORS.highlight}/>
      {/* お腹 */}
      <ellipse cx="52" cy="68" rx="14" ry="12" fill={PET_COLORS.egg} opacity="0.55"/>
      {/* 王者の角（小） */}
      <circle cx="44" cy="20" r="2" fill={PET_COLORS.highlight} stroke={PET_COLORS.outline} strokeWidth="1.5"/>
      <circle cx="66" cy="20" r="2" fill={PET_COLORS.highlight} stroke={PET_COLORS.outline} strokeWidth="1.5"/>
    </svg>
  );
}

function PetDisplay({ genreXp, size = 60, starterEgg = null, hat = null, aura = null }) {
  const total = getTotalXp(genreXp);
  const stage = getStage(total);
  const tops = getTopGenres(genreXp);
  const primary = tops[0]?.[0];
  const secondary = tops[1]?.[0];
  const pForm = primary ? GENRE_FORMS[primary] : null;
  const sForm = secondary ? GENRE_FORMS[secondary] : null;
  const auraColor = (stage <= 2 && starterEgg) ? starterEgg.color : (pForm?.aura || starterEgg?.color || "#a78bfa");

  const hatItem = hat ? SHOP_ITEMS.find(i => i.id === hat) : null;
  const auraItem = aura ? SHOP_ITEMS.find(i => i.id === aura) : null;

  // Lv3以降は教科色を体色に反映、それ以前はミントグリーン
  const bodyColor = stage >= 3 && pForm?.aura ? pForm.aura : null;

  const stageSize = stage === 5 ? size * 1.15 : stage === 4 ? size * 1.05 : size;
  const animDur = stage === 1 ? "3s" : stage === 2 ? "2.5s" : "3s";

  return (
    <div style={{ display:"inline-block", position:"relative" }}>
      {/* 装備中のオーラ（背景に表示） */}
      {auraItem && (
        <div style={{
          position:"absolute", inset:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          pointerEvents:"none",
        }}>
          <span style={{
            fontSize:size * 1.4,
            opacity:0.45,
            animation:"monsterFloat 2.2s ease-in-out infinite",
            filter:"blur(1px)",
          }}>{auraItem.icon}</span>
        </div>
      )}
      {/* メインのペット（SVG） */}
      <div style={{
        filter:`drop-shadow(0 0 ${size/4}px ${auraColor}88)`,
        animation:`monsterFloat ${animDur} ease-in-out infinite`,
        position:"relative",
        width: stageSize, height: stageSize,
      }}>
        <PetSVG stage={stage} size={stageSize} color={bodyColor}/>
        {/* 装備中の帽子（頭の上） */}
        {hatItem && stage >= 2 && (
          <div style={{
            position:"absolute",
            top:-size*0.25,
            left:"50%",
            transform:"translateX(-50%)",
            fontSize:size*0.5,
            filter:"drop-shadow(0 2px 2px rgba(0,0,0,0.4))",
          }}>{hatItem.icon}</div>
        )}
      </div>
      {/* Lv.4以降は副ジャンルの装飾 */}
      {stage >= 4 && sForm && !hatItem && (
        <div style={{
          position:"absolute",
          bottom:-size*0.05,
          right:-size*0.15,
          fontSize:size*0.4,
          filter:`drop-shadow(0 0 4px ${sForm.aura})`,
          animation:"monsterFloat 3.5s ease-in-out infinite",
        }}>{sForm.element}</div>
      )}
      {/* Lv.5は✨ */}
      {stage === 5 && (
        <div style={{ position:"absolute", top:-size*0.1, right:-size*0.1, fontSize:size*0.28 }}>✨</div>
      )}
    </div>
  );
}

// 部位構成の名前を生成
function getPetTitle(genreXp) {
  const total = getTotalXp(genreXp);
  const stage = getStage(total);
  const tops = getTopGenres(genreXp);
  if (stage <= 1) return STAGE_NAMES[0];
  if (stage === 2) return STAGE_NAMES[1];
  const primary = tops[0]?.[0];
  if (!primary) return STAGE_NAMES[stage - 1];
  const prefix = GENRE_FORMS[primary]?.title || "";
  return prefix + STAGE_NAMES[stage - 1];
}

// ── 下メニュー ───────────────────────────────────────────
function BottomNav({ current, onChange }) {
  const items = [
    { id:TABS.HOME,     label:"ホーム",     icon:(active)=>(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#60A5FA":"#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V11z"/>
      </svg>
    )},
    { id:TABS.FRIENDS,  label:"友達",      icon:(active)=>(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#60A5FA":"#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3.5"/>
        <path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6"/>
        <circle cx="17" cy="7" r="2.5"/>
        <path d="M22 19c0-2.8-2-5-5-5"/>
      </svg>
    )},
    { id:TABS.RANKING,  label:"ランキング", icon:(active)=>(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#60A5FA":"#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20l1-10 4 3 4-7 4 7 4-3 1 10H3z"/>
        <circle cx="12" cy="11" r="1.2" fill={active?"#60A5FA":"#64748b"}/>
      </svg>
    )},
    { id:TABS.GACHA,    label:"ガチャ",    icon:(active)=>(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#FBBF24":"#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="13" rx="7" ry="9" fill={active?"#FBBF2422":"none"}/>
        <path d="M5 11c2-1 5-1 7 0s5 1 7 0" strokeWidth="1.5"/>
        <circle cx="12" cy="9" r="1" fill={active?"#FBBF24":"#64748b"}/>
      </svg>
    )},
    { id:TABS.PROFILE,  label:"プロフィール", icon:(active)=>(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#60A5FA":"#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <ellipse cx="12" cy="18" rx="7" ry="4.5"/>
      </svg>
    )},
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:100,
      background:"rgba(10,15,30,0.92)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
      borderTop:"1px solid rgba(255,255,255,0.08)",
      display:"flex", padding:"10px 0 calc(18px + env(safe-area-inset-bottom, 0px))",
    }}>
      {items.map(it => {
        const active = current === it.id;
        return (
          <button key={it.id} onClick={() => onChange(it.id)} style={{
            flex:1, background:"none", border:"none", cursor:"pointer",
            display:"flex", flexDirection:"column", alignItems:"center", gap:5,
            padding:"4px 0", color:active?"#60A5FA":"#64748b",
            transition:"all 0.2s",
          }}>
            <div style={{ transform: active ? "translateY(-2px) scale(1.1)" : "none", transition:"transform 0.2s" }}>{it.icon(active)}</div>
            <span style={{ fontSize:10.5, fontWeight:active?700:500, letterSpacing:0.5 }}>{it.label}</span>
            {active && <div style={{ width:4, height:4, borderRadius:99, background:"#60A5FA", marginTop:-2, boxShadow:"0 0 8px #60A5FA" }}/>}
          </button>
        );
      })}
    </div>
  );
}

// ─── Error Boundary（クラッシュ防止） ──────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Studyum app crashed:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight:"100vh", background:"#0a0f1e",
          display:"flex", alignItems:"center", justifyContent:"center", padding:20,
          fontFamily:'"Hiragino Maru Gothic ProN", "Quicksand", sans-serif',
        }}>
          <div style={{
            maxWidth:340, width:"100%",
            background:"linear-gradient(135deg, rgba(239,68,68,0.1), rgba(244,114,182,0.05))",
            border:"1px solid rgba(239,68,68,0.3)",
            borderRadius:18, padding:24, textAlign:"center",
          }}>
            <div style={{ fontSize:48, marginBottom:10 }}>😢</div>
            <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginBottom:6 }}>
              ごめんなさい、エラーが起きました
            </div>
            <div style={{ fontSize:12, color:"#94a3b8", marginBottom:18, lineHeight:1.6 }}>
              アプリで問題が発生しました。<br/>
              再読み込みすると元に戻ります。
            </div>
            <button onClick={() => window.location.reload()} style={{
              background:"linear-gradient(135deg, #60A5FA, #A78BFA)",
              border:"none", borderRadius:12, padding:"12px 24px",
              color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer",
              boxShadow:"0 6px 18px rgba(96,165,250,0.4)",
            }}>🔄 再読み込み</button>
            {this.state.error && (
              <details style={{ marginTop:14, fontSize:9, color:"#64748b", textAlign:"left" }}>
                <summary style={{ cursor:"pointer" }}>詳細</summary>
                <div style={{ marginTop:6, padding:8, background:"rgba(0,0,0,0.3)", borderRadius:6, fontFamily:"monospace", wordBreak:"break-word" }}>
                  {String(this.state.error?.message || this.state.error)}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}

// ─── 共通ローディング表示 ──────────────────────────
function LoadingOverlay({ message, accent }) {
  const color = accent || "#60A5FA";
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:350,
      background:"rgba(10,15,30,0.85)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
      animation:"fadeIn 0.2s ease",
      backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)",
      fontFamily:'"Hiragino Maru Gothic ProN", "Quicksand", sans-serif',
    }}>
      <div style={{
        background:"linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        border:`1px solid ${color}55`,
        borderRadius:20, padding:"24px 32px",
        textAlign:"center",
        boxShadow:`0 0 40px ${color}33`,
      }}>
        <div style={{
          width:48, height:48, margin:"0 auto 12px",
          border:`3.5px solid ${color}22`,
          borderTop:`3.5px solid ${color}`,
          borderRadius:"50%",
          animation:"spin 0.9s linear infinite",
        }}/>
        <div style={{ fontSize:13, color:"#cbd5e1", fontWeight:700, letterSpacing:1 }}>
          {message || "読み込み中..."}
        </div>
      </div>
    </div>
  );
}

function AppInner() {
  const [screen, setScreen] = useState(S.SPLASH);
  const [dataLoaded, setDataLoaded] = useState(false); // 保存データ読込完了フラグ

  // スプラッシュ→（セーブ読込後）オンボーディング or ホーム自動遷移
  useEffect(() => {
    if (screen === S.SPLASH && dataLoaded) {
      const t = setTimeout(() => {
        // セーブ読込でstarterEggがあればHOMEに飛んでるので、まだSPLASHならオンボーディングへ
        setScreen(prev => prev === S.SPLASH ? S.ONBOARDING : prev);
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [screen, dataLoaded]);

  // システムのダークモード設定を監視（auto時に使用）
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const handler = (e) => setSystemDark(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler); // 古いブラウザ
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  // BGM切替: 画面に応じて自動で曲を変更
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__STUDYUM_MUTED || window.__STUDYUM_BGM_OFF) {
      BGM.stop();
      return;
    }
    // バトル系: バトル音楽
    if (screen === S.BATTLE || screen === S.LOBBY || screen === S.ENDLESS || screen === S.TIMEATTACK || screen === S.REVIEW) {
      BGM.play("battle");
    } 
    // 結果系
    else if (screen === S.RESULT || screen === S.ENDLESS_RESULT || screen === S.TIMEATTACK_RESULT) {
      BGM.play("result");
    }
    // それ以外（ホーム・プロフィール・ガチャなど）
    else if (screen === S.HOME || screen === S.PROFILE || screen === S.GACHA || screen === S.RANKING || screen === S.FRIENDS || screen === S.DEX || screen === S.TROPHIES) {
      BGM.play("home");
    }
    else {
      BGM.stop();
    }
  }, [screen]);

  // すべてのbuttonクリックでデフォルトのタップ音を鳴らす
  useEffect(() => {
    // 起動時に音量をデフォルト値で初期化
    if (typeof window !== "undefined") window.__STUDYUM_VOL = 0.6;
    const handler = (e) => {
      // buttonまたは role="button"の要素のみ
      const btn = e.target.closest("button");
      if (!btn || btn.disabled) return;
      // data-sfx="none"が指定されてたら無音
      if (btn.dataset.sfx === "none") return;
      // 専用音が指定されてればそれを再生、なければデフォルトtap
      const sfxName = btn.dataset.sfx;
      if (sfxName && SFX[sfxName]) SFX[sfxName]();
      else SFX.tap();
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  // ネット接続状態を自動検出（オフライン時は自動でAI機能を無効化）
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const [starterEgg, setStarterEgg] = useState(null);
  const [onboardStep, setOnboardStep] = useState(0); // 0=ようこそ 1=教科紹介 2=卵選択 3=名付け
  const [genre, setGenre] = useState(null);
  const [players, setPlayers] = useState([]);
  const [monster, setMonster] = useState(MONSTERS[0]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [genreXp, setGenreXp] = useState({ english:0, math:0, japanese:0, social:0, science:0, history:0 });
  const [playerLevel, setPlayerLevel] = useState(1); // プレイヤーレベル
  const [levelUpPopup, setLevelUpPopup] = useState(null); // {level, type:"normal"|"milestone10"|"milestone100"|"milestone1000"}
  const [communityTab, setCommunityTab] = useState("苦手");
  const [attacking, setAttacking] = useState(false);
  const [monHit, setMonHit] = useState(false);
  const [dmgPop, setDmgPop] = useState(null);
  const [dmgKey, setDmgKey] = useState(0);
  const [bgFlash, setBgFlash] = useState(null);
  const [lobbyCount, setLobbyCount] = useState(3);
  const [showInterim, setShowInterim] = useState(false); // 問題間の中間スコア表示
  // 攻撃エフェクト
  const [screenShake, setScreenShake] = useState(false);
  const [attackEffect, setAttackEffect] = useState(null); // {targetId, type:"hit"|"crit"|"super", dmg}
  const [slashEffect, setSlashEffect] = useState(null); // 攻撃の斬撃エフェクト
  const [battleMode, setBattleMode] = useState("solo"); // solo | ranked
  const [rankedMatching, setRankedMatching] = useState(false);
  const [userRating, setUserRating] = useState(1240);
  // デイリーミッション
  const [missionProgress, setMissionProgress] = useState({});
  const [claimedMissions, setClaimedMissions] = useState([]);
  const [missionToast, setMissionToast] = useState(null);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [comboPopup, setComboPopup] = useState(null); // {count, bonus}
  // エンドレスモード
  const [endlessMode, setEndlessMode] = useState(null); // モード定義
  const [endlessIdx, setEndlessIdx] = useState(0);
  const [endlessShuffled, setEndlessShuffled] = useState([]);
  const [endlessScore, setEndlessScore] = useState(0);
  const [endlessLives, setEndlessLives] = useState(3);
  const [endlessBest, setEndlessBest] = useState({}); // {mode_id: best_score}
  const [endlessSelected, setEndlessSelected] = useState(null);
  const [endlessTimer, setEndlessTimer] = useState(10);
  const endlessTimerRef = useRef(null);
  // ペット図鑑
  const [unlockedPets, setUnlockedPets] = useState([]); // ["english_3", "math_4" など]
  // ペット進化演出
  const [evolutionAnim, setEvolutionAnim] = useState(null); // {fromStage, toStage}
  const [prevStage, setPrevStage] = useState(1);
  // タイムアタック
  const [taGenre, setTaGenre] = useState(null);
  const [taTimeLeft, setTaTimeLeft] = useState(60);
  const [taScore, setTaScore] = useState(0);
  const [taCorrect, setTaCorrect] = useState(0);
  const [taTotal, setTaTotal] = useState(0);
  const [taCurrentQ, setTaCurrentQ] = useState(null);
  const [taSelected, setTaSelected] = useState(null);
  const [taFlash, setTaFlash] = useState(null);
  const [taBest, setTaBest] = useState({});
  // リスニング
  const [listenQ, setListenQ] = useState(null);
  const [listenSelected, setListenSelected] = useState(null);
  const [listenIdx, setListenIdx] = useState(0);
  const [listenScore, setListenScore] = useState(0);
  const [listenSpeaking, setListenSpeaking] = useState(false); // 音声再生中
  // スピーキング
  const [speakQ, setSpeakQ] = useState(null);
  const [speakIdx, setSpeakIdx] = useState(0);
  const [speakScore, setSpeakScore] = useState(0);
  const [speakListening, setSpeakListening] = useState(false); // 録音中
  const [speakResult, setSpeakResult] = useState(null); // {heard, match, score}
  // 解説機能
  const [explanation, setExplanation] = useState(null); // {q, text} 現在表示中の解説
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [speakSupported, setSpeakSupported] = useState(true);
  // 復習モード
  const [reviewQ, setReviewQ] = useState(null); // {q, choices, correctIdx, genre}
  const [reviewSelected, setReviewSelected] = useState(null);
  const [reviewFlash, setReviewFlash] = useState(null);
  const [reviewIdx, setReviewIdx] = useState(0);
  // ガチャ
  const [gachaResult, setGachaResult] = useState(null);
  const [gachaSpinning, setGachaSpinning] = useState(false);
  const [gachaCombo, setGachaCombo] = useState(0); // 連続ガチャ回数（10連で天井）
  const [gachaPity, setGachaPity] = useState(0); // 通算回数（30連でレジェ確定）
  const [gachaPulls, setGachaPulls] = useState(0); // 通算ガチャ回数
  const [legendItems, setLegendItems] = useState(0); // レジェンドアイテム獲得数
  const [bossKills, setBossKills] = useState(0); // ボス撃破数
  const [flashcardCount, setFlashcardCount] = useState(0); // 暗記カード達成数
  const [gachaResultHistory, setGachaResultHistory] = useState([]); // 最近の結果（最大5件）
  // 統計（デイリー）
  const [dailyStats, setDailyStats] = useState({ date: null, correct: 0, wins: 0, battles: 0 });
  // ミュート
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.6);
  // デイリーログインボーナス
  const [lastLoginDate, setLastLoginDate] = useState(null); // YYYY-MM-DD
  const [freeGachaDate, setFreeGachaDate] = useState(null); // 最後に無料ガチャ使った日 YYYY-MM-DD
  const [loginStreak, setLoginStreak] = useState(0);
  const [showLoginBonus, setShowLoginBonus] = useState(null); // {day, reward, streak}
  // ペット
  const [petName, setPetName] = useState("");
  const [petHunger, setPetHunger] = useState(100); // 0-100、満腹度
  const [lastFedAt, setLastFedAt] = useState(null); // 最後に餌やった時刻
  const [petFedToday, setPetFedToday] = useState({}); // {YYYY-MM-DD: count}
  const [petReaction, setPetReaction] = useState(null); // {emoji, msg, id}
  const [editingPetName, setEditingPetName] = useState(false);
  const [tempPetName, setTempPetName] = useState("");
  // 設定
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState("audio"); // audio | display | study | account
  const [volumeLevel, setVolumeLevel] = useState(0.6); // 0..1
  const [bgmOff, setBgmOff] = useState(false);
  const [hapticOff, setHapticOff] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false); // 手動オフラインモード
  const [offlineToast, setOfflineToast] = useState(null); // {type:"online"|"offline"|"reminder"}
  // 難易度・チュートリアル・デイリーチャレンジ
  const [difficulty, setDifficulty] = useState("normal"); // "easy" | "normal" | "hard"
  const [tutorialDone, setTutorialDone] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState(null); // {date, genre, topic, target, done, claimed}
  const [confetti, setConfetti] = useState(false); // 紙吹雪
  // ランクマッチ拡張
  const [winStreak, setWinStreak] = useState(0); // ランクマッチ連勝数
  const [bestWinStreak, setBestWinStreak] = useState(0);
  const [maxCorrectStreak, setMaxCorrectStreak] = useState(0); // 最大連続正解
  const [selectedTitle, setSelectedTitle] = useState(null); // プロフィール表示する称号 id
  const [titleUnlockToast, setTitleUnlockToast] = useState(null); // 新称号獲得トースト
  const [pendingTitles, setPendingTitles] = useState([]); // 結果画面で表示する称号のキュー
  const [showShareCard, setShowShareCard] = useState(false); // シェアカード表示
  // ボス戦（オンライン協力戦）
  const [bossData, setBossData] = useState(null); // 現在のボス
  const [bossHp, setBossHp] = useState(0);
  const [bossMaxHp, setBossMaxHp] = useState(0);
  const [bossTurn, setBossTurn] = useState(0); // 経過ターン
  const [bossWeeklyDefeated, setBossWeeklyDefeated] = useState({}); // {weekNum: bossId} 旧データ互換用
  const [bossDailyChallenged, setBossDailyChallenged] = useState({}); // {YYYY-MM-DD: bossId} 今日挑戦済か
  const [bossTotalKills, setBossTotalKills] = useState(0); // 累計撃破数（トロフィー用）
  const [freeGachaTickets, setFreeGachaTickets] = useState(0); // ボス報酬で貰えるガチャ無料券
  // 攻撃ランキング: [{name, avatar, dmg, isUser}]
  const [bossRanking, setBossRanking] = useState([]);
  const [bossAttackPopup, setBossAttackPopup] = useState(null); // {name, dmg, isUser, weakness}
  const [bossDmgEffect, setBossDmgEffect] = useState(null); // ボスへのダメージエフェクト
  // ワールドボス用ランキング・攻撃ログ
  const [bossPlayers, setBossPlayers] = useState([]); // [{name, avatar, dmg, isUser}]
  const [bossAttackLog, setBossAttackLog] = useState([]); // 最近の攻撃通知 [{name, dmg, ts}]
  const [myBossDmg, setMyBossDmg] = useState(0); // 自分の累計与ダメ
  const [bossAttackAnim, setBossAttackAnim] = useState(null); // {dmg, isCrit, weakness} 自分の攻撃演出
  // フレンドコード
  const [myFriendCode, setMyFriendCode] = useState("");
  const [showFriendQR, setShowFriendQR] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [myFriends, setMyFriends] = useState([]); // [{code, name, addedAt}]
  const [lossStreak, setLossStreak] = useState(0); // 連敗数（気分用）
  const [promotionAnim, setPromotionAnim] = useState(null); // 昇格時アニメ {from, to}
  const [matchHighlights, setMatchHighlights] = useState(null); // 試合後ハイライト
  // プロフィール公開設定 & 他人プロフィール閲覧
  const [profilePrivacy, setProfilePrivacy] = useState("public"); // "public" | "friends" | "private"
  const [viewingUser, setViewingUser] = useState(null); // 他人のプロフィール閲覧用
  const [rankingTab, setRankingTab] = useState("global"); // "global" | "weekly" | "friends"
  const [unlockedTrophies, setUnlockedTrophies] = useState([]); // 解除済みトロフィーID
  const [trophyToast, setTrophyToast] = useState(null);
  const [maxRating, setMaxRating] = useState(1240);
  const [maxCoins, setMaxCoins] = useState(150);
  // 学習履歴（AI診断用）
  const [answerHistory, setAnswerHistory] = useState([]); // {genre, q, choices, correctIdx, chosenIdx, correct, timestamp}
  const [studyTimeByDate, setStudyTimeByDate] = useState({}); // {YYYY-MM-DD: 分単位の累積}
  const [xpHistoryByDate, setXpHistoryByDate] = useState({}); // {YYYY-MM-DD: {english:xp, math:xp, ...}}
  const [sessionStartTime, setSessionStartTime] = useState(null); // セッション開始時刻
  const [bookmarkedQs, setBookmarkedQs] = useState([]); // ブックマーク済み問題
  const [wrongNotes, setWrongNotes] = useState({}); // {qHash: "メモ"}
  const [showWrongNote, setShowWrongNote] = useState(null); // 編集中の問題
  const [battleHistory, setBattleHistory] = useState([]); // 過去20件のバトル結果
  const [showBattleHistory, setShowBattleHistory] = useState(false);
  const [reviewPromptShown, setReviewPromptShown] = useState(false); // セッション中表示済みフラグ
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [reviewDeclined, setReviewDeclined] = useState(false); // ユーザーが「あとで」したか
  // ポモドーロ
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroPhase, setPomodoroPhase] = useState("work"); // "work" | "break"
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroCount, setPomodoroCount] = useState(0); // 完了したサイクル数
  const [showPomodoro, setShowPomodoro] = useState(false);
  // 問題報告
  const [showReportIssue, setShowReportIssue] = useState(null); // {q, reason}
  const [reportedQuestions, setReportedQuestions] = useState([]); // [{q, reason, timestamp}]
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [helpExpanded, setHelpExpanded] = useState(null); // 展開中のFAQ id
  // イベントクエスト
  const [eventProgress, setEventProgress] = useState({}); // {eventId: progress}
  const [eventClaimed, setEventClaimed] = useState([]); // 報酬受け取り済みID
  const [fcGenre, setFcGenre] = useState(null);
  const [fcQuestions, setFcQuestions] = useState([]);
  const [fcIndex, setFcIndex] = useState(0);
  const [fcFlipped, setFcFlipped] = useState(false);
  const [fcResults, setFcResults] = useState([]); // [{idx, known}]
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  // コイン & ショップ
  const [coins, setCoins] = useState(150);
  const [gems, setGems] = useState(0); // 💎 高級通貨
  const [maxGems, setMaxGems] = useState(0);
  const [xpBoosterUntil, setXpBoosterUntil] = useState(0); // タイムスタンプ（ms）。それまでXP×2
  const [showExchange, setShowExchange] = useState(false); // 両替モーダル
  const [showCasino, setShowCasino] = useState(false); // カジノモーダル
  const [casinoSpinning, setCasinoSpinning] = useState(false);
  const [casinoResult, setCasinoResult] = useState(null);
  const [casinoReels, setCasinoReels] = useState([0, 0, 0]);
  const [ownedItems, setOwnedItems] = useState([]);
  const [equippedHat, setEquippedHat] = useState(null);
  const [equippedAura, setEquippedAura] = useState(null);
  const [equippedTitle, setEquippedTitle] = useState(null);
  const [coinPop, setCoinPop] = useState(null);
  const [shopFilter, setShopFilter] = useState("hat");
  // 教科別サブジャンル選択（保存される）
  const [selectedTopics, setSelectedTopics] = useState({
    english: "vocab", math: "calc", japanese: "kanji",
    social: "geo", science: "bio", history: "japan",
  });
  // 学年選択（モードを「分野別」と「学年別」で切替）
  const [selectedGrade, setSelectedGrade] = useState("jh1"); // 中1がデフォルト
  const [questionCount, setQuestionCount] = useState(4); // 4 | 10 | 20
  // スケジュール（勉強リマインダー）
  const [reminderTime, setReminderTime] = useState(""); // "HH:MM" 形式、空文字なら無効
  const [reminderEnabled, setReminderEnabled] = useState(false);
  // テーマ
  const [theme, setTheme] = useState("dark"); // "dark" | "light" | "ocean" | "sakura" | "auto"
  const [systemDark, setSystemDark] = useState(true); // 端末のダークモード状態
  // 学習目標
  const [weeklyGoal, setWeeklyGoal] = useState({ target: 50, week: "" }); // target問題数
  const [showGoalSettings, setShowGoalSettings] = useState(false);
  // AIチューター
  const [showTutor, setShowTutor] = useState(false);
  const [tutorMessages, setTutorMessages] = useState([]); // [{role:"user"|"assistant", content}]
  const [tutorInput, setTutorInput] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);
  const [reminderShown, setReminderShown] = useState(null); // 今日表示済みの日付
  const [showReminder, setShowReminder] = useState(false);
  // 検索
  const [showHistorySearch, setShowHistorySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("history"); // "history" | "bookmark" | "wrong"
  const [studyMode, setStudyMode] = useState("topic"); // "topic"（分野別）| "grade"（学年別）
  const todaysMissions = getTodaysMissions();
  // 写真機能
  const [photoData, setPhotoData] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFileName, setPhotoFileName] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const [customQuestions, setCustomQuestions] = useState(null);
  const [battleQuestions, setBattleQuestions] = useState([]); // 今回のバトル用にランダム選択された問題
  const [battleAnswers, setBattleAnswers] = useState([]); // 今回のバトルの解答記録 [{q, chosenIdx, correct}]
  const [reviewExplanations, setReviewExplanations] = useState({}); // {qIndex: explanation_text}
  const [reviewLoadingIdx, setReviewLoadingIdx] = useState(null); // 読込中のidx
  const [quizMode, setQuizMode] = useState("auto"); // auto | vocab | content
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  const questions = customQuestions || battleQuestions;
  const currentQ = questions[qIndex];
  const genreInfo = GENRES.find(g => g.id === genre) || GENRES[0];

  // ── 保存データの読み込み（起動時1回） ──────────────
  useEffect(() => {
    (async () => {
      try {
        if (typeof window !== "undefined" && window.storage) {
          const result = await window.storage.get("studyum_save");
          if (result && result.value) {
            const d = JSON.parse(result.value);
            if (d.starterEgg) setStarterEgg(d.starterEgg);
            if (d.genreXp) setGenreXp(d.genreXp);
            if (typeof d.coins === "number") setCoins(d.coins);
            if (typeof d.maxCoins === "number") setMaxCoins(d.maxCoins);
            if (d.ownedItems) setOwnedItems(d.ownedItems);
            if (d.equippedHat !== undefined) setEquippedHat(d.equippedHat);
            if (d.equippedAura !== undefined) setEquippedAura(d.equippedAura);
            if (d.equippedTitle !== undefined) setEquippedTitle(d.equippedTitle);
            if (typeof d.userRating === "number") setUserRating(d.userRating);
            if (typeof d.maxRating === "number") setMaxRating(d.maxRating);
            if (typeof d.bestWinStreak === "number") setBestWinStreak(d.bestWinStreak);
            if (d.unlockedPets) setUnlockedPets(d.unlockedPets);
            if (d.unlockedTrophies) setUnlockedTrophies(d.unlockedTrophies);
            if (d.missionProgress) setMissionProgress(d.missionProgress);
            if (d.claimedMissions) setClaimedMissions(d.claimedMissions);
            if (d.endlessBest) setEndlessBest(d.endlessBest);
            if (d.taBest) setTaBest(d.taBest);
            if (d.answerHistory) setAnswerHistory(d.answerHistory);
            if (d.petName) setPetName(d.petName);
            if (d.profilePrivacy) setProfilePrivacy(d.profilePrivacy);
            if (d.lastLoginDate) setLastLoginDate(d.lastLoginDate);
            if (typeof d.loginStreak === "number") setLoginStreak(d.loginStreak);
            if (typeof d.volumeLevel === "number") setVolumeLevel(d.volumeLevel);
            if (typeof d.offlineMode === "boolean") setOfflineMode(d.offlineMode);
            if (typeof d.difficulty === "string") setDifficulty(d.difficulty);
            if (d.tutorialDone) setTutorialDone(d.tutorialDone);
            if (d.dailyChallenge) setDailyChallenge(d.dailyChallenge);
            if (d.selectedGrade) setSelectedGrade(d.selectedGrade);
            if (d.studyMode) setStudyMode(d.studyMode);
            if (d.selectedTopics) setSelectedTopics(d.selectedTopics);
            if (typeof d.questionCount === "number") setQuestionCount(d.questionCount);
            if (typeof d.reminderTime === "string") setReminderTime(d.reminderTime);
            if (typeof d.reminderEnabled === "boolean") setReminderEnabled(d.reminderEnabled);
            // 追加データ
            if (d.bookmarkedQs) setBookmarkedQs(d.bookmarkedQs);
            if (d.studyTimeByDate) setStudyTimeByDate(d.studyTimeByDate);
            if (d.xpHistoryByDate) setXpHistoryByDate(d.xpHistoryByDate);
            if (d.myFriendCode) setMyFriendCode(d.myFriendCode);
            if (d.myFriends) setMyFriends(d.myFriends);
            if (d.bossWeeklyDefeated) setBossWeeklyDefeated(d.bossWeeklyDefeated);
            if (d.freeGachaDate) setFreeGachaDate(d.freeGachaDate);
            if (typeof d.gachaPity === "number") setGachaPity(d.gachaPity);
            if (d.theme) setTheme(d.theme);
            if (typeof d.bgmOff === "boolean") setBgmOff(d.bgmOff);
            if (typeof d.hapticOff === "boolean") setHapticOff(d.hapticOff);
            if (d.weeklyGoal && typeof d.weeklyGoal === "object") setWeeklyGoal(d.weeklyGoal);
            if (d.selectedTitle) setSelectedTitle(d.selectedTitle);
            if (typeof d.maxCorrectStreak === "number") setMaxCorrectStreak(d.maxCorrectStreak);
            if (typeof d.petHunger === "number") setPetHunger(d.petHunger);
            if (d.lastFedAt) setLastFedAt(d.lastFedAt);
            if (d.petFedToday) setPetFedToday(d.petFedToday);
            if (d.wrongNotes) setWrongNotes(d.wrongNotes);
            if (Array.isArray(d.battleHistory)) setBattleHistory(d.battleHistory);
            if (typeof d.reviewDeclined === "boolean") setReviewDeclined(d.reviewDeclined);
            if (Array.isArray(d.reportedQuestions)) setReportedQuestions(d.reportedQuestions);
            if (d.eventProgress) setEventProgress(d.eventProgress);
            if (Array.isArray(d.eventClaimed)) setEventClaimed(d.eventClaimed);
            if (typeof d.pomodoroCount === "number") setPomodoroCount(d.pomodoroCount);
            if (d.bossDailyChallenged) setBossDailyChallenged(d.bossDailyChallenged);
            if (typeof d.bossTotalKills === "number") setBossTotalKills(d.bossTotalKills);
            if (typeof d.freeGachaTickets === "number") setFreeGachaTickets(d.freeGachaTickets);
            if (typeof d.gems === "number") setGems(d.gems);
            if (typeof d.maxGems === "number") setMaxGems(d.maxGems);
            if (typeof d.xpBoosterUntil === "number") setXpBoosterUntil(d.xpBoosterUntil);
            if (typeof d.playerLevel === "number") setPlayerLevel(d.playerLevel);
            if (typeof d.gachaPulls === "number") setGachaPulls(d.gachaPulls);
            if (typeof d.legendItems === "number") setLegendItems(d.legendItems);
            if (typeof d.bossKills === "number") setBossKills(d.bossKills);
            if (typeof d.flashcardCount === "number") setFlashcardCount(d.flashcardCount);
            // セーブデータがあればオンボーディングスキップ
            if (d.starterEgg) setScreen(S.HOME);
          }
        }
      } catch (e) {
        console.log("セーブデータ読込スキップ:", e);
      }
      setDataLoaded(true);
    })();
  }, []);

  // 自分のフレンドコードを初回生成
  useEffect(() => {
    if (!dataLoaded) return;
    if (!myFriendCode) {
      // 6桁のランダムなコードを生成（英数字）
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
      setMyFriendCode(code);
    }
  }, [dataLoaded, myFriendCode]);

  // ── 自動保存（主要stateが変わるたび） ──────────────
  useEffect(() => {
    if (!dataLoaded) return; // 読込完了前は保存しない
    (async () => {
      try {
        if (typeof window !== "undefined" && window.storage) {
          const save = {
            starterEgg, genreXp, coins, maxCoins, ownedItems,
            equippedHat, equippedAura, equippedTitle,
            userRating, maxRating, bestWinStreak,
            unlockedPets, unlockedTrophies, missionProgress, claimedMissions,
            endlessBest, taBest, answerHistory: answerHistory.slice(-100),
            petName, profilePrivacy, lastLoginDate, loginStreak,
            volumeLevel, offlineMode, difficulty, tutorialDone, dailyChallenge,
            selectedGrade, studyMode, selectedTopics,
            questionCount, reminderTime, reminderEnabled,
            bookmarkedQs, studyTimeByDate, xpHistoryByDate,
            myFriendCode, myFriends, bossWeeklyDefeated,
            freeGachaDate, gachaPity, theme, bgmOff, hapticOff,
            weeklyGoal, selectedTitle, maxCorrectStreak,
            petHunger, lastFedAt, petFedToday,
            wrongNotes, battleHistory, reviewDeclined,
            gachaPulls, legendItems, bossKills, flashcardCount,
            reportedQuestions, eventProgress, eventClaimed,
            pomodoroCount,
            bossDailyChallenged, bossTotalKills, freeGachaTickets,
            gems, maxGems, xpBoosterUntil,
            playerLevel,
          };
          await window.storage.set("studyum_save", JSON.stringify(save));
        }
      } catch (e) {
        console.log("セーブ失敗:", e);
      }
    })();
  }, [dataLoaded, starterEgg, genreXp, coins, maxCoins, ownedItems, equippedHat, equippedAura, equippedTitle, userRating, maxRating, bestWinStreak, unlockedPets, unlockedTrophies, missionProgress, claimedMissions, endlessBest, taBest, petName, profilePrivacy, lastLoginDate, loginStreak, volumeLevel, offlineMode, difficulty, tutorialDone, dailyChallenge, selectedGrade, studyMode, selectedTopics, questionCount, reminderTime, reminderEnabled, bookmarkedQs, studyTimeByDate, xpHistoryByDate, myFriendCode, myFriends, bossWeeklyDefeated, freeGachaDate, gachaPity, theme, bgmOff, hapticOff, weeklyGoal, selectedTitle, maxCorrectStreak]);

  // タイムアタックタイマー
  useEffect(() => {
    if (screen !== S.TIMEATTACK) return;
    if (taTimeLeft <= 0) {
      setTaBest(prev => ({ ...prev, [taGenre]: Math.max(prev[taGenre] || 0, taCorrect) }));
      setCoins(c => c + taCorrect * 3);
      setTimeout(() => setScreen(S.TIMEATTACK_RESULT), 300);
      return;
    }
    const t = setTimeout(() => setTaTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, taTimeLeft]);

  // ペット進化を検知して演出
  useEffect(() => {
    const currentStage = getStage(getTotalXp(genreXp));
    if (currentStage > prevStage && prevStage > 0) {
      setEvolutionAnim({ fromStage: prevStage, toStage: currentStage });
      SFX.levelUp();
    }
    setPrevStage(currentStage);
  }, [genreXp]);

  // デイリーログインボーナス（ホーム画面到達時）
  useEffect(() => {
    if (screen !== S.HOME) return;
    const today = new Date().toDateString();
    if (lastLoginDate === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isStreak = lastLoginDate === yesterday.toDateString();
    const newStreak = isStreak ? loginStreak + 1 : 1;
    const dayInCycle = ((newStreak - 1) % 7) + 1;
    const rewards = [20, 30, 40, 60, 80, 100, 200];
    const reward = rewards[dayInCycle - 1];
    setLastLoginDate(today);
    setLoginStreak(newStreak);
    setShowLoginBonus({ day: dayInCycle, reward, streak: newStreak, isJackpot: dayInCycle === 7 });
    setTimeout(() => setCoins(c => c + reward), 500);
  }, [screen]);

  // 勉強リマインダー（時刻チェック・1分毎）
  useEffect(() => {
    if (!reminderEnabled || !reminderTime) return;
    const check = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const current = `${hh}:${mm}`;
      const todayKey = now.toDateString();
      if (current === reminderTime && reminderShown !== todayKey) {
        setShowReminder(true);
        setReminderShown(todayKey);
        SFX.levelUp();
      }
    };
    check(); // 即時チェック
    const intervalId = setInterval(check, 30000); // 30秒毎
    return () => clearInterval(intervalId);
  }, [reminderEnabled, reminderTime, reminderShown]);

  // デイリーチャレンジ生成（日替わり）
  useEffect(() => {
    if (screen !== S.HOME) return;
    const today = new Date().toDateString();
    if (dailyChallenge && dailyChallenge.date === today) return;
    // 日付ベースで決定的に教科を選ぶ
    const dayNum = new Date().getDate();
    const g = GENRES[dayNum % GENRES.length];
    const topics = SUBTOPICS[g.id];
    const topic = topics[dayNum % topics.length];
    setDailyChallenge({
      date: today,
      genre: g.id,
      genreLabel: g.label,
      genreIcon: g.icon,
      genreColor: g.color,
      topic: topic.id,
      topicLabel: topic.label,
      target: 5, // 5問正解
      reward: 150,
      progress: 0,
      done: false,
      claimed: false,
    });
  }, [screen]);

  // ペット進化時に図鑑に登録
  useEffect(() => {
    const stage = getStage(getTotalXp(genreXp));
    if (stage < 3) return;
    const tops = getTopGenres(genreXp);
    const primary = tops[0]?.[0];
    if (!primary) return;
    const petId = `${primary}_${stage}`;
    if (!unlockedPets.includes(petId)) {
      setUnlockedPets(arr => [...arr, petId]);
      SFX.levelUp();
      setMissionToast({
        iconName: primary,
        title: `Lv.${stage} ${GENRE_FORMS[primary]?.title || ""}`,
        reward: "図鑑に追加",
        claimed: false,
        isPet: true,
      });
      setTimeout(() => setMissionToast(null), 3000);
    }
  }, [genreXp]);

  useEffect(() => {
    if (screen === S.ENDLESS && endlessSelected === null && endlessShuffled[endlessIdx]) {
      setEndlessTimer(10);
      endlessTimerRef.current = setInterval(() => {
        setEndlessTimer(t => {
          if (t <= 1) { clearInterval(endlessTimerRef.current); handleEndlessAnswer(-1); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(endlessTimerRef.current);
  }, [screen, endlessIdx]);

  useEffect(() => {
    if (screen === S.BATTLE && selected === null && currentQ) {
      const baseTtime = difficulty === "easy" ? 20 : difficulty === "hard" ? 12 : 15;
      setTimeLeft(baseTtime);
      setExplanation(null); // 問題が変わったら解説をクリア
      timerRef.current = setInterval(() => {
        setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); handleAnswer(-1); return 0; } return t - 1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, qIndex]);

  useEffect(() => {
    if (screen === S.LOBBY) {
      setLobbyCount(3);
      let c = 3;
      const id = setInterval(() => { c--; setLobbyCount(c); if (c <= 0) clearInterval(id); }, 800);
      const go = setTimeout(() => setScreen(S.BATTLE), 2600);
      return () => { clearInterval(id); clearTimeout(go); };
    }
  }, [screen]);

  useEffect(() => {
    if (screen === S.RESULT) {
      const rank = [...players].sort((a,b)=>b.score-a.score).findIndex(p=>p.isUser) + 1;
      const won = rank === 1;
      // 勝利/敗北の音
      if (won) { SFX.victory(); setConfetti(true); setTimeout(() => setConfetti(false), 3000); }
      else if (rank >= 3) SFX.defeat();
      else SFX.start();

      // コインボーナス
      let bonus = 0;
      if (won) bonus += battleMode === "ranked" ? COIN_REWARDS.rankedWin : COIN_REWARDS.win;
      const user = players.find(p => p.isUser);
      if (user && user.score >= questions.length * 3) bonus += COIN_REWARDS.perfect;
      if (battleMode === "boss" && monster && monster.hp <= 0) bonus += COIN_REWARDS.bossKill;

      // ランクマッチ専用処理（連勝・昇格・降格保護）
      if (battleMode === "ranked") {
        const oldRating = userRating;
        const oldRank = getRank(oldRating);
        if (won) {
          const newStreak = winStreak + 1;
          setWinStreak(newStreak);
          setBestWinStreak(prev => Math.max(prev, newStreak));
          setLossStreak(0); // 勝利でリセット
          // 連勝ボーナス
          if (newStreak >= 2) bonus += newStreak * 10;
        } else {
          setWinStreak(0);
          setLossStreak(prev => prev + 1);
        }
        // レート計算
        let delta = 0;
        if (rank === 1) {
          const streakBonus = Math.min(20, winStreak * 5);
          delta = 30 + streakBonus;
        } else if (rank === 2) delta = 10;
        else if (rank === 3) {
          delta = (oldRating - oldRank.min) < 30 ? -5 : -10;
        } else {
          delta = (oldRating - oldRank.min) < 30 ? -10 : -20;
        }
        const newRating = Math.max(0, oldRating + delta);
        setUserRating(newRating);
        setMaxRating(prev => Math.max(prev, newRating));
        // 昇格判定
        const newRank = getRank(newRating);
        const oldIdx = RANK_TIERS.findIndex(r => r.id === oldRank.id);
        const newIdx = RANK_TIERS.findIndex(r => r.id === newRank.id);
        if (newIdx > oldIdx) {
          setTimeout(() => {
            setPromotionAnim({ from: oldRank, to: newRank });
            SFX.victory();
          }, 1500);
          bonus += 100; // 昇格ボーナス
        }
      }

      if (bonus > 0) setTimeout(() => addCoins(bonus), 500);

      // 試合ハイライト
      const sortedByDmg = [...players].sort((a,b) => (b.dmgDealt||0) - (a.dmgDealt||0));
      setMatchHighlights({
        userRank: rank,
        topDmg: sortedByDmg[0] ? { name: sortedByDmg[0].name, dmg: sortedByDmg[0].dmgDealt || 0, isUser: sortedByDmg[0].isUser } : null,
        userDmg: user?.dmgDealt || 0,
        userScore: user?.score || 0,
        coinBonus: bonus,
      });

      // ミッショントラッキング
      const updates = {};
      if (won) updates.wins = 1;
      if (user && user.score >= questions.length * 3) updates.perfects = 1;
      if (battleMode === "boss" && monster && monster.hp <= 0) updates.bossKills = 1;
      if (Object.keys(updates).length > 0) trackMission(updates);
      // デイリー統計
      const today = new Date().toDateString();
      setDailyStats(prev => prev.date === today
        ? { ...prev, wins: prev.wins + (won ? 1 : 0), battles: prev.battles + 1 }
        : { date: today, correct: 0, wins: won ? 1 : 0, battles: 1 }
      );
    }
    if (screen === S.LOBBY) {
      SFX.start();
    }
  }, [screen]);

  // ショップでアイテム購入
  // AI学習診断
  // AIチューター: 質問送信
  // 共通AI呼び出し: window.claude.complete を優先（artifact内推奨）、ダメならfetch
  async function callAI(prompt) {
    // オフライン中はエラー
    if (!isOnline) {
      throw new Error("ネットワークに接続されていません");
    }
    // 方式1: artifact 専用の window.claude.complete を試す
    if (typeof window !== "undefined" && window.claude && typeof window.claude.complete === "function") {
      try {
        const result = await window.claude.complete(prompt);
        if (result && typeof result === "string") return result;
      } catch (e) {
        console.warn("window.claude.complete failed, falling back to fetch:", e);
      }
    }
    // 方式2: fetch でAPIを直接叩く
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{ role:"user", content: prompt }]
        }),
      });
      if (!res.ok) throw new Error("API " + res.status);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || "API error");
      const text = data.content?.map(c => c.text || "").join("\n");
      return text || "";
    } catch (e) {
      console.error("callAI fetch failed:", e);
      throw e;
    }
  }

  async function askTutor() {
    const q = tutorInput.trim();
    if (!q || tutorLoading || offlineMode) return;
    setTutorInput("");
    setTutorMessages(prev => [...prev, { role:"user", content: q }]);
    setTutorLoading(true);
    try {
      const history = tutorMessages.length > 0 
        ? "これまでの会話:\n" + tutorMessages.map(m => (m.role === "user" ? "ユーザー" : "AI") + ": " + m.content).join("\n") + "\n\n"
        : "";
      const prompt = "あなたは中学生・高校生の学習を助ける親しみやすいAIチューターです。日本語で、わかりやすく短く（150字以内目安）答えてください。\n\n" + history + "ユーザー: " + q + "\nAI:";
      const text = await callAI(prompt);
      setTutorMessages(prev => [...prev, { role:"assistant", content: text || "ごめんね、うまく答えられなかったみたい。もう一度試してみて。" }]);
    } catch (e) {
      setTutorMessages(prev => [...prev, { role:"assistant", content: "⚠️ ネットワークエラーが発生したよ。少し時間をおいて試してね。\n\n（オフライン中、または通信制限の可能性）" }]);
    }
    setTutorLoading(false);
  }

  // 問題の解説をAIに依頼
  async function fetchExplanation(qObj) {
    if (offlineMode) return;
    setExplanationLoading(true);
    try {
      const prompt = `次の選択問題について、なぜその答えが正解なのかを中学生にもわかるように日本語で簡潔に（120字以内）解説してください。\n\n問題: ${qObj.q}\n選択肢: ${qObj.choices.join(" / ")}\n正解: ${qObj.choices[qObj.answer]}\n\n解説:`;
      const text = await callAI(prompt);
      setExplanation({ q: qObj.q, text: text || "解説を取得できませんでした。" });
    } catch (e) {
      setExplanation({ q: qObj.q, text:"⚠️ 通信エラーで解説を取得できませんでした。少し時間をおいて再度お試しください。" });
    }
    setExplanationLoading(false);
  }

  async function runAIAnalysis() {    if (analysisLoading) return;
    if (answerHistory.length < 3) {
      setAiAnalysis({ error: "もう少しバトルしてからお試しください（3問以上必要）" });
      return;
    }
    setAnalysisLoading(true);
    setAiAnalysis(null);
    SFX.open();
    try {
      // ジャンル別の正答率を集計
      const byGenre = {};
      answerHistory.forEach(h => {
        if (!byGenre[h.genre]) byGenre[h.genre] = { total:0, correct:0, wrongs:[] };
        byGenre[h.genre].total++;
        if (h.correct) byGenre[h.genre].correct++;
        else byGenre[h.genre].wrongs.push({
          q: h.q,
          chose: h.choices[h.chosenIdx] || "（時間切れ）",
          correct: h.choices[h.correctIdx],
        });
      });

      // プロンプト用に要約
      const summary = Object.entries(byGenre).map(([g, d]) => {
        const label = GENRES.find(x => x.id === g)?.label || g;
        const rate = Math.round((d.correct / d.total) * 100);
        const wrongSample = d.wrongs.slice(-5).map(w =>
          "・" + w.q + " → 自分の答え: " + w.chose + " / 正解: " + w.correct
        ).join("\n");
        return "【" + label + "】" + d.correct + "/" + d.total + "問正解 (" + rate + "%)\n間違えた問題:\n" + (wrongSample || "（なし）");
      }).join("\n\n");

      const prompt = "あなたは学習コーチです。以下の生徒の解答データを分析し、必ずJSONのみで日本語で返してください。前置き・説明・コードブロック記号は一切不要。\n\n" + summary + "\n\n返すJSONフォーマット:\n" +
        '{"strongPoints":["得意な傾向を20字以内で1-2個"],"weakPoints":["苦手な傾向を20字以内で1-2個"],"advice":"具体的アドバイスを80字以内","encouragement":"励まし30字以内"}';

      const text = await callAI(prompt);
      console.log("AI診断 text:", text);
      if (!text) throw new Error("AIが空の応答を返しました");
      
      // JSON抽出（最初の{から最後の}まで）
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("JSON形式の応答が見つかりません");
      }
      const cleaned = text.substring(jsonStart, jsonEnd + 1);
      const json = JSON.parse(cleaned);
      setAiAnalysis(json);
      SFX.levelUp();
    } catch (e) {
      console.error("AI診断エラー:", e);
      setAiAnalysis({ error: "診断に失敗しました: " + (e.message || "不明なエラー") });
    } finally {
      setAnalysisLoading(false);
    }
  }

  // コイン獲得（ポップアニメ付き）
  function addCoins(amount) {
    if (amount <= 0) return;
    // 季節イベントのコインボーナス
    const season = getCurrentSeason();
    let finalAmount = season ? Math.round(amount * season.coinBonus) : amount;
    // ペット満腹ボーナス (+10%)
    if (petHunger >= 80) finalAmount = Math.round(finalAmount * 1.1);
    setCoins(c => {
      const newC = c + finalAmount;
      setMaxCoins(prev => Math.max(prev, newC));
      return newC;
    });
    setCoinPop({ amount: finalAmount, id: Date.now() });
    SFX.coin();
    setTimeout(() => setCoinPop(null), 1500);
  }

  // Gem追加（高級通貨）
  function addGems(amount) {
    if (amount <= 0) return;
    setGems(g => {
      const newG = g + amount;
      setMaxGems(prev => Math.max(prev, newG));
      return newG;
    });
    SFX.levelUp();
  }

  // XP追加ヘルパー（ブースター適用）
  // ── プレイヤーレベル計算 ───────────────────────────
  // 累計XPから現在レベルを計算。レベルアップ必要XP = 100 * level^1.5
  function calcPlayerLevel(totalXp) {
    let lv = 1;
    let need = 0;
    while (true) {
      const next = need + Math.floor(100 * Math.pow(lv, 1.5));
      if (totalXp < next) break;
      lv++;
      need = next;
      if (lv > 9999) break; // 念のため上限
    }
    return lv;
  }
  function calcXpForNextLevel(level) {
    // 現在レベルから次のレベルまでに必要なXP
    return Math.floor(100 * Math.pow(level, 1.5));
  }
  function calcLevelProgress(totalXp, currentLevel) {
    // 現在レベルでの進捗（0-1）と、現在レベルでの累計XP、次までに必要なXP
    let need = 0;
    for (let lv = 1; lv < currentLevel; lv++) {
      need += Math.floor(100 * Math.pow(lv, 1.5));
    }
    const xpInLevel = totalXp - need;
    const xpForNext = calcXpForNextLevel(currentLevel);
    return {
      xpInLevel,
      xpForNext,
      progress: Math.min(1, xpInLevel / xpForNext),
    };
  }

  // XP合計が変わるたびにレベル再計算
  useEffect(() => {
    if (!dataLoaded) return;
    const totalXp = Object.values(genreXp).reduce((s,v) => s + v, 0);
    const newLevel = calcPlayerLevel(totalXp);
    if (newLevel > playerLevel) {
      // レベルアップ！演出のタイプを決定
      let type = "normal";
      if (newLevel >= 1000) type = "milestone1000";
      else if (newLevel >= 100 && newLevel % 100 === 0) type = "milestone100";
      else if (newLevel % 10 === 0) type = "milestone10";
      // 連続レベルアップの場合は最高のものだけ表示
      for (let lv = playerLevel + 1; lv <= newLevel; lv++) {
        if (lv >= 1000 && lv % 1000 === 0) type = "milestone1000";
        else if (lv >= 100 && lv % 100 === 0 && type !== "milestone1000") type = "milestone100";
        else if (lv % 10 === 0 && type === "normal") type = "milestone10";
      }
      setLevelUpPopup({ level: newLevel, type, prevLevel: playerLevel });
      setPlayerLevel(newLevel);
      // 報酬: コインボーナス
      const coinBonus = type === "milestone1000" ? 100000
                      : type === "milestone100" ? 10000
                      : type === "milestone10" ? 500
                      : 100;
      addCoins(coinBonus);
      // Gem報酬: 10/100/1000刻みで
      if (type === "milestone1000") {
        setGems(g => g + 100);
        setMaxGems(prev => Math.max(prev, gems + 100));
      } else if (type === "milestone100") {
        setGems(g => g + 20);
        setMaxGems(prev => Math.max(prev, gems + 20));
      } else if (type === "milestone10") {
        setGems(g => g + 3);
        setMaxGems(prev => Math.max(prev, gems + 3));
      }
      // SFX
      if (type === "milestone1000") {
        SFX.victory();
        setTimeout(() => SFX.levelUp(), 300);
        setTimeout(() => SFX.victory(), 800);
      } else if (type === "milestone100") {
        SFX.victory();
        setTimeout(() => SFX.levelUp(), 300);
      } else if (type === "milestone10") {
        SFX.levelUp();
        setTimeout(() => SFX.coin(), 200);
      } else {
        SFX.levelUp();
      }
      HAPTIC.critical();
    } else if (newLevel < playerLevel) {
      // ダウンロード時の整合性
      setPlayerLevel(newLevel);
    }
  }, [genreXp, dataLoaded]);

  function addGenreXp(g, amount) {
    if (amount <= 0) return;
    const isBoosterActive = Date.now() < xpBoosterUntil;
    const finalXp = isBoosterActive ? amount * 2 : amount;
    setGenreXp(prev => ({ ...prev, [g]: (prev[g] || 0) + finalXp }));
    return finalXp;
  }

  // トロフィー判定（statsオブジェクトから新規解除をチェック）
  function checkTrophies(stats) {
    const newlyUnlocked = [];
    TROPHIES.forEach(t => {
      if (!unlockedTrophies.includes(t.id) && t.check(stats)) {
        newlyUnlocked.push(t);
      }
    });
    if (newlyUnlocked.length > 0) {
      setUnlockedTrophies(prev => [...prev, ...newlyUnlocked.map(t => t.id)]);
      setTrophyToast(newlyUnlocked[0]);
      SFX.levelUp();
      setTimeout(() => setTrophyToast(null), 3500);
      addCoins(newlyUnlocked.length * 50);
    }
  }

  // 称号獲得チェック（XPやログイン更新時など）
  function checkTitles() {
    const totalCorrect = answerHistory.filter(h => h.correct).length;
    const got = checkTitleUnlocks(genreXp, totalCorrect, maxCorrectStreak, loginStreak, userRating, ownedItems, {
      hasPetName: !!(petName && petName.trim().length > 0),
      petsUnlocked: unlockedPets.length,
      bossKills,
      legendItems,
      playerLevel,
    });
    // 既に取得してない＆新規分があれば通知
    const known = JSON.parse(window.__STUDYUM_TITLES || "[]");
    const newOnes = got.filter(id => !known.includes(id));
    if (newOnes.length > 0) {
      window.__STUDYUM_TITLES = JSON.stringify(got);
      const newTitles = newOnes.map(id => TITLES.find(x => x.id === id)).filter(Boolean);
      // 学習画面中はキューに溜めて結果画面で表示
      const learningScreens = [S.BATTLE, S.BOSS, S.ENDLESS, S.TIMEATTACK, S.REVIEW, S.LISTENING, S.SPEAKING, S.FLASHCARD];
      if (learningScreens.includes(screen)) {
        setPendingTitles(prev => [...prev, ...newTitles]);
        addCoins(50 * newTitles.length); // コインだけは即時付与
      } else {
        // 学習中以外なら即発火
        setTitleUnlockToast(newTitles[0]);
        SFX.levelUp();
        addCoins(50);
        setTimeout(() => setTitleUnlockToast(null), 3500);
      }
    } else {
      window.__STUDYUM_TITLES = JSON.stringify(got);
    }
  }

  // 結果画面に遷移時、保留中の称号があれば順次表示
  useEffect(() => {
    const resultScreens = [S.RESULT, S.ENDLESS_RESULT, S.TIMEATTACK_RESULT, S.BOSS_RESULT];
    if (!resultScreens.includes(screen)) return;
    if (pendingTitles.length === 0) return;
    if (titleUnlockToast) return; // 既に表示中
    // 少し遅延して表示（結果画面演出と被らないように）
    const timer = setTimeout(() => {
      const next = pendingTitles[0];
      setTitleUnlockToast(next);
      SFX.levelUp();
      setPendingTitles(prev => prev.slice(1));
      setTimeout(() => setTitleUnlockToast(null), 3800);
    }, 2000);
    return () => clearTimeout(timer);
  }, [screen, pendingTitles, titleUnlockToast]);

  // バトル履歴の記録（結果画面に到達した瞬間）
  useEffect(() => {
    if (screen !== S.RESULT) return;
    if (battleAnswers.length === 0) return;
    const userPlayer = players.find(p => p.isUser);
    if (!userPlayer) return;
    const correctCount = battleAnswers.filter(a => a.correct).length;
    const rank = players.slice().sort((a,b) => b.score - a.score).findIndex(p => p.isUser) + 1;
    const record = {
      timestamp: Date.now(),
      genre: genre || "english",
      mode: battleMode,
      correctCount,
      totalQ: battleAnswers.length,
      score: userPlayer.score || 0,
      rank,
      totalPlayers: players.length,
    };
    setBattleHistory(prev => {
      // 同じバトル（5秒以内の重複）は弾く
      const last = prev[0];
      if (last && Math.abs(last.timestamp - record.timestamp) < 5000) return prev;
      const newHistory = [record, ...prev].slice(0, 20);
      // 10試合達成＆まだ表示してない＆「あとで」されてないなら少し遅延してレビュー誘導
      if (newHistory.length === 10 && !reviewPromptShown && !reviewDeclined) {
        setTimeout(() => {
          setShowReviewPrompt(true);
          setReviewPromptShown(true);
        }, 3500);
      }
      return newHistory;
    });
  }, [screen]);

  // ショップ購入
  function buyItem(item) {
    if (coins < item.price) { SFX.wrong(); return; }
    if (ownedItems.includes(item.id)) return;
    setCoins(c => c - item.price);
    setOwnedItems(arr => [...arr, item.id]);
    SFX.claim();
    // 自動装備
    if (item.type === "hat") setEquippedHat(item.id);
    else if (item.type === "aura") setEquippedAura(item.id);
    else if (item.type === "title") setEquippedTitle(item.id);
  }

  // 装備切り替え
  function toggleEquip(item) {
    SFX.select();
    if (item.type === "hat") setEquippedHat(equippedHat === item.id ? null : item.id);
    else if (item.type === "aura") setEquippedAura(equippedAura === item.id ? null : item.id);
    else if (item.type === "title") setEquippedTitle(equippedTitle === item.id ? null : item.id);
  }

  // 復習モード開始（間違えた問題から最大10問）
  function startReview() {
    const wrongs = answerHistory.filter(h => !h.correct);
    if (wrongs.length === 0) return;
    // ランダムに10問まで
    const shuffled = [...wrongs].sort(() => Math.random() - 0.5).slice(0, 10);
    setReviewIdx(0);
    setReviewSelected(null);
    setReviewFlash(null);
    setReviewQ(shuffled[0]);
    // 全問保管
    window.__REVIEW_QUEUE = shuffled;
    setScreen(S.REVIEW);
    SFX.start();
  }

  function handleReviewAnswer(idx) {
    if (reviewSelected !== null) return;
    setReviewSelected(idx);
    const correct = idx === reviewQ.correctIdx;
    setReviewFlash(correct ? "correct" : "wrong");
    if (correct) {
      SFX.correct();
      setCoins(c => c + 8); // 復習報酬は多め
    } else {
      SFX.wrong();
    }
    setTimeout(() => {
      const next = reviewIdx + 1;
      const queue = window.__REVIEW_QUEUE || [];
      if (next >= queue.length) {
        // 終了
        setScreen(S.HOME);
        setReviewQ(null);
      } else {
        setReviewIdx(next);
        setReviewSelected(null);
        setReviewFlash(null);
        setReviewQ(queue[next]);
      }
    }, 1200);
  }

  // ガチャを引く
  function spinGacha(cost, isFree) {
    if (!isFree && coins < cost) { SFX.wrong(); return; }
    if (isFree) {
      // 無料ガチャ使用記録
      const today = new Date().toISOString().slice(0,10);
      setFreeGachaDate(today);
    } else {
      setCoins(c => c - cost);
    }
    setGachaSpinning(true);
    setGachaResult(null);
    SFX.open();
    setGachaPulls(prev => prev + 1); // ガチャ回数増加
    // 連続ガチャ＆天井判定
    const newPity = gachaPity + 1;
    const isPityHit = newPity >= 30; // 30連でレジェンド確定
    setTimeout(() => {
      let rarityRoll = Math.random();
      // コンボボーナス: 連続でガチャ引くたびレア率UP
      const comboBonus = Math.min(gachaCombo * 0.02, 0.15); // 最大+15%
      rarityRoll -= comboBonus;
      let pool;
      let rarity;
      if (isPityHit) {
        // 天井: レジェ確定
        pool = SHOP_ITEMS.filter(i => i.price >= 500);
        rarity = "legend";
      } else if (cost >= 500) {
        if (rarityRoll < 0.3) { pool = SHOP_ITEMS.filter(i => i.price >= 500); rarity = "legend"; }
        else if (rarityRoll < 0.8) { pool = SHOP_ITEMS.filter(i => i.price >= 200 && i.price < 500); rarity = "rare"; }
        else { pool = SHOP_ITEMS.filter(i => i.price < 200); rarity = "common"; }
      } else if (cost >= 200) {
        if (rarityRoll < 0.1) { pool = SHOP_ITEMS.filter(i => i.price >= 500); rarity = "legend"; }
        else if (rarityRoll < 0.5) { pool = SHOP_ITEMS.filter(i => i.price >= 200 && i.price < 500); rarity = "rare"; }
        else { pool = SHOP_ITEMS.filter(i => i.price < 200); rarity = "common"; }
      } else {
        if (rarityRoll < 0.03) { pool = SHOP_ITEMS.filter(i => i.price >= 500); rarity = "legend"; }
        else if (rarityRoll < 0.2) { pool = SHOP_ITEMS.filter(i => i.price >= 200 && i.price < 500); rarity = "rare"; }
        else { pool = SHOP_ITEMS.filter(i => i.price < 200); rarity = "common"; }
      }
      const unowned = pool.filter(i => !ownedItems.includes(i.id));
      const preferUnowned = unowned.length > 0 && Math.random() < 0.7;
      const finalPool = preferUnowned ? unowned : pool;
      const item = finalPool[Math.floor(Math.random() * finalPool.length)] || SHOP_ITEMS[0];
      const isDuplicate = ownedItems.includes(item.id);
      if (!isDuplicate) {
        setOwnedItems(arr => [...arr, item.id]);
        SFX.levelUp();
      } else {
        const refund = item.price >= 500 ? Math.floor(item.price * 0.6) : item.price >= 200 ? Math.floor(item.price * 0.5) : Math.floor(item.price * 0.4);
        setCoins(c => c + refund);
        SFX.coin();
      }
      const refund = isDuplicate ? (item.price >= 500 ? Math.floor(item.price * 0.6) : item.price >= 200 ? Math.floor(item.price * 0.5) : Math.floor(item.price * 0.4)) : 0;
      // コンボ更新（5分以内ならコンボ継続）
      setGachaCombo(c => Math.min(c + 1, 10));
      // 天井リセット or インクリメント
      if (rarity === "legend") {
        setGachaPity(0);
        setLegendItems(prev => prev + 1); // レジェンド獲得カウント
      } else {
        setGachaPity(newPity);
      }
      const resultObj = { item, isDuplicate, refund, rarity, pityHit: isPityHit, comboBonus };
      setGachaResult(resultObj);
      setGachaResultHistory(prev => [resultObj, ...prev].slice(0, 5));
      setGachaSpinning(false);
    }, 2800);
  }

  // ミュート切り替え
  function toggleMute() {
    if (isMuted) {
      setIsMuted(false);
      setVolumeLevel(prevVolume);
      if (typeof window !== "undefined") window.__STUDYUM_VOL = prevVolume;
    } else {
      setIsMuted(true);
      setPrevVolume(volumeLevel);
      setVolumeLevel(0);
      if (typeof window !== "undefined") window.__STUDYUM_VOL = 0;
    }
  }

  // タイムアタック開始
  // ── リスニング ──────────────────────────────
  function speakText(text, onEnd) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.85; // やや遅め
    if (onEnd) utter.onend = onEnd;
    window.speechSynthesis.speak(utter);
  }

  // 学年→レベル変換
  function gradeToLevel(grade) {
    if (!grade) return null;
    if (grade === "jh1" || grade === "jh2") return "easy";
    if (grade === "jh3" || grade === "hs1") return "normal";
    return "hard"; // hs2, hs3
  }

  function startListening(grade) {
    const level = gradeToLevel(grade);
    let pool = LISTENING_QUESTIONS;
    if (level) pool = pool.filter(q => q.level === level);
    if (pool.length === 0) pool = LISTENING_QUESTIONS;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
    window.__LISTEN_QUEUE = shuffled;
    setListenIdx(0);
    setListenScore(0);
    setListenSelected(null);
    setListenQ(shuffled[0]);
    setScreen(S.LISTENING);
    SFX.start();
    setTimeout(() => {
      setListenSpeaking(true);
      speakText(shuffled[0].audio, () => setListenSpeaking(false));
    }, 600);
  }

  function handleListenAnswer(idx) {
    if (listenSelected !== null) return;
    setListenSelected(idx);
    const correct = idx === listenQ.answer;
    if (correct) {
      setListenScore(s => s + 1);
      SFX.correct();
      setCoins(c => c + 6);
    } else {
      SFX.wrong();
    }
    setTimeout(() => {
      const next = listenIdx + 1;
      const queue = window.__LISTEN_QUEUE || [];
      if (next >= queue.length) {
        setScreen(S.HOME);
        setListenQ(null);
      } else {
        setListenIdx(next);
        setListenSelected(null);
        setListenQ(queue[next]);
        setTimeout(() => {
          setListenSpeaking(true);
          speakText(queue[next].audio, () => setListenSpeaking(false));
        }, 400);
      }
    }, 1400);
  }

  // ── スピーキング ────────────────────────────
  function startSpeaking(grade) {
    const level = gradeToLevel(grade);
    let pool = SPEAKING_QUESTIONS;
    if (level) pool = pool.filter(q => q.level === level);
    if (pool.length === 0) pool = SPEAKING_QUESTIONS;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
    window.__SPEAK_QUEUE = shuffled;
    setSpeakIdx(0);
    setSpeakScore(0);
    setSpeakResult(null);
    setSpeakListening(false);
    // ブラウザ対応チェック
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    setSpeakSupported(!!SR);
    setSpeakQ(shuffled[0]);
    setScreen(S.SPEAKING);
    SFX.start();
  }

  // 録音して判定
  function recordSpeech() {
    if (speakListening) return; // 二重起動防止
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      setSpeakSupported(false);
      setSpeakResult({ heard:"このブラウザは音声認識に対応していません", score:0, pass:false, error:true });
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    setSpeakListening(true);
    setSpeakResult(null);

    rec.onresult = (e) => {
      const target = speakQ.phrase.toLowerCase().replace(/[.,?!']/g, "").trim();
      const targetWords = target.split(/\s+/);
      let bestScore = 0;
      let bestHeard = "";
      let bestWordChecks = []; // [{word, ok, heardWord}]

      // 単語類似度を測る関数（編集距離）
      const similarity = (a, b) => {
        if (a === b) return 1;
        const len = Math.max(a.length, b.length);
        if (len === 0) return 0;
        // Levenshtein距離（簡易）
        const dp = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
          for (let j = 1; j <= b.length; j++) {
            if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1];
            else dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
          }
        }
        return 1 - dp[a.length][b.length] / len;
      };

      for (let i = 0; i < e.results[0].length; i++) {
        const heard = e.results[0][i].transcript;
        const heardClean = heard.toLowerCase().replace(/[.,?!']/g, "").trim();
        const heardWords = heardClean.split(/\s+/);

        // 各targetWordが対応位置の近くにあるかチェック
        const wordChecks = targetWords.map((tw, idx) => {
          // 同じインデックス周辺(±1)で類似度の高い語を探す
          let bestSim = 0;
          let bestMatch = "";
          const searchStart = Math.max(0, idx - 1);
          const searchEnd = Math.min(heardWords.length, idx + 2);
          for (let j = searchStart; j < searchEnd; j++) {
            const sim = similarity(tw, heardWords[j] || "");
            if (sim > bestSim) {
              bestSim = sim;
              bestMatch = heardWords[j] || "";
            }
          }
          // 全体検索もしてみる（位置ズレた場合）
          for (let j = 0; j < heardWords.length; j++) {
            if (j >= searchStart && j < searchEnd) continue;
            const sim = similarity(tw, heardWords[j]) * 0.85; // 位置ズレ罰
            if (sim > bestSim) {
              bestSim = sim;
              bestMatch = heardWords[j];
            }
          }
          return {
            word: tw,
            ok: bestSim >= 0.75, // 75%以上類似で合格
            sim: bestSim,
            heardWord: bestMatch,
          };
        });

        const okCount = wordChecks.filter(c => c.ok).length;
        const score = Math.round((okCount / targetWords.length) * 100);

        if (score > bestScore) {
          bestScore = score;
          bestHeard = heard;
          bestWordChecks = wordChecks;
        }
      }

      const isPass = bestScore >= 80; // 80%以上で合格（厳しめ）
      const missed = bestWordChecks.filter(c => !c.ok).map(c => c.word);
      setSpeakResult({
        heard: bestHeard,
        score: bestScore,
        pass: isPass,
        wordChecks: bestWordChecks,
        matched: bestWordChecks.filter(c => c.ok).map(c => c.word),
        missed,
      });
      if (isPass) {
        setSpeakScore(s => s + 1);
        SFX.correct();
        setCoins(c => c + 6);
      } else {
        SFX.wrong();
      }
      setSpeakListening(false);
    };
    rec.onerror = (e) => {
      setSpeakListening(false);
      const errType = e.error || "";
      let msg = "認識できませんでした。もう一度話してください。";
      if (errType === "not-allowed" || errType === "service-not-allowed") {
        msg = "マイクの使用が許可されていません。設定からマイク権限を許可してください。";
      } else if (errType === "no-speech") {
        msg = "声が聞こえませんでした。もう少し大きな声で話してください。";
      } else if (errType === "audio-capture") {
        msg = "マイクが使えません。デバイスを確認してください。";
      } else if (errType === "network") {
        msg = "ネットワーク接続を確認してください。";
      }
      setSpeakResult({ heard: msg, score:0, pass:false, error:true });
    };
    rec.onend = () => setSpeakListening(false);

    try {
      rec.start();
      // 8秒で自動停止
      setTimeout(() => { try { rec.stop(); } catch(e) {} }, 8000);
    } catch (e) {
      setSpeakListening(false);
      setSpeakResult({ heard:"録音を開始できませんでした。マイク権限を確認してください。", score:0, pass:false, error:true });
    }
  }

  function nextSpeaking() {
    const next = speakIdx + 1;
    const queue = window.__SPEAK_QUEUE || [];
    if (next >= queue.length) {
      setScreen(S.HOME);
      setSpeakQ(null);
    } else {
      setSpeakIdx(next);
      setSpeakResult(null);
      setSpeakQ(queue[next]);
    }
  }

  function startTimeAttack(g) {
    setTaGenre(g);
    setTaTimeLeft(60);
    setTaScore(0);
    setTaCorrect(0);
    setTaTotal(0);
    setTaSelected(null);
    setTaFlash(null);
    // 最初の問題
    const pool = QUESTIONS[g] || QUESTIONS.english;
    setTaCurrentQ(pool[Math.floor(Math.random() * pool.length)]);
    setScreen(S.TIMEATTACK);
    SFX.start();
  }

  // タイムアタック解答処理
  function handleTaAnswer(idx) {
    if (taSelected !== null) return;
    setTaSelected(idx);
    const correct = idx === taCurrentQ.answer;
    setTaTotal(t => t + 1);
    if (correct) {
      setTaCorrect(c => c + 1);
      setTaScore(s => s + 10);
      setTaFlash("correct");
      SFX.correct();
      addCoins(2);
    } else {
      setTaFlash("wrong");
      SFX.wrong();
    }
    // 次の問題（速め）
    setTimeout(() => {
      setTaFlash(null);
      setTaSelected(null);
      const pool = QUESTIONS[taGenre] || QUESTIONS.english;
      const next = pool[Math.floor(Math.random() * pool.length)];
      setTaCurrentQ(next);
    }, 450);
  }

  function trackMission(updates) {
    setMissionProgress(prev => {
      const next = { ...prev };
      const justCompleted = [];
      Object.entries(updates).forEach(([key, val]) => {
        const before = prev[key] || 0;
        const after = key === "streak" ? Math.max(before, val) : before + val;
        next[key] = after;
        // 達成チェック
        todaysMissions.forEach(m => {
          if (m.track === key && before < m.target && after >= m.target && !claimedMissions.includes(m.id)) {
            justCompleted.push(m);
          }
        });
      });
      if (justCompleted.length > 0) {
        setMissionToast(justCompleted[0]);
        SFX.levelUp();
        setTimeout(() => setMissionToast(null), 3500);
      }
      // トロフィー判定（追跡データ + ランク + コイン + ペット + 新統計）
      const trophyStats = {
        ...next,
        maxRating,
        maxCoins,
        petsUnlocked: unlockedPets.length,
        loginStreak,
        gachaPulls,
        legendItems,
        bossKills,
        bookmarks: bookmarkedQs.length,
        flashcards: flashcardCount,
        hasPetName: !!(petName && petName.trim().length > 0),
      };
      setTimeout(() => checkTrophies(trophyStats), 100);
      setTimeout(() => checkTitles(), 200);
      return next;
    });
  }

  function claimMission(m) {
    if (claimedMissions.includes(m.id)) return;
    setClaimedMissions(arr => [...arr, m.id]);
    // XP報酬を主ジャンルに付与
    setGenreXp(gx => {
      const next = { ...gx };
      next.english = (next.english || 0) + m.reward;
      return next;
    });
    // コインも獲得（XPと同額）
    setCoins(c => c + m.reward);
    setMissionToast({ ...m, claimed:true });
    SFX.claim();
    setTimeout(() => setMissionToast(null), 2500);
  }

  function handleAnswer(idx) {
    // 二重発火防止: 既に答えが選択されてたら何もしない
    if (selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(idx);
    const correct = currentQ && idx === currentQ.answer;
    const isBoss = battleMode === "boss";
    const isRanked = battleMode === "ranked";
    const isLastQuestion = qIndex >= questions.length - 1;
    // ソロモードは最終問題以外は攻撃演出をスキップ（シンプルに進む）
    const skipAttack = !isBoss && !isRanked && !isLastQuestion;
    // 学習履歴に記録（最大100問まで）
    if (currentQ) {
      setAnswerHistory(prev => {
        const next = [...prev, {
          genre: genre || "english",
          q: currentQ.q,
          choices: currentQ.choices,
          correctIdx: currentQ.answer,
          chosenIdx: idx,
          correct,
          timestamp: Date.now(),
        }];
        return next.slice(-100);
      });
      // バトル振り返り用にも記録
      setBattleAnswers(prev => [...prev, {
        q: currentQ.q,
        choices: currentQ.choices,
        correctIdx: currentQ.answer,
        chosenIdx: idx,
        correct,
      }]);
    }
    if (correct) {
      const dmg = Math.floor(Math.random() * 20) + 15 + (timeLeft > 10 ? 10 : 0);
      const isCrit = timeLeft >= 12;
      const isSuper = timeLeft >= 10 && correctStreak >= 2;
      const finalDmg = isCrit ? Math.floor(dmg * 1.5) : dmg;

      // ── ステップ1: 正解判定演出だけ先に ─────────
      setBgFlash("correct");
      SFX.correct();
      // デイリー統計加算
      const today = new Date().toDateString();
      setDailyStats(prev => prev.date === today ? { ...prev, correct: prev.correct + 1 } : { date: today, correct: 1, wins: 0, battles: 0 });
      // デイリーチャレンジ進捗（該当教科の正解時）
      if (dailyChallenge && !dailyChallenge.done && genre === dailyChallenge.genre) {
        setDailyChallenge(prev => {
          if (!prev || prev.done) return prev;
          const np = prev.progress + 1;
          const done = np >= prev.target;
          if (done) { SFX.levelUp(); }
          return { ...prev, progress: np, done };
        });
      }
      // XP/スコアはすぐ加算（演出は後）
      setGenreXp(gx => ({ ...gx, [genre || "english"]: (gx[genre || "english"] || 0) + 20 }));
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      trackMission({
        correct: 1,
        streak: newStreak,
        [`correct_${genre}`]: 1,
        boss_dmg: dmg,
      });
      setPlayers(ps => ps.map(p => {
        if (p.isUser) return { ...p, score: p.score + (timeLeft > 10 ? 3 : timeLeft > 5 ? 2 : 1) };
        const ok = Math.random() > (p.level > 25 ? 0.35 : 0.5);
        return { ...p, score: p.score + (ok ? Math.floor(Math.random()*3)+1 : 0), dmgDealt: (p.dmgDealt||0) + (ok ? Math.floor(Math.random()*25)+10 : 0) };
      }));
      addCoins(COIN_REWARDS.correct);

      // ── コンボボーナス（3連続正解以上で発動） ─────
      const newStreakAfter = newStreak;
      if (newStreakAfter > maxCorrectStreak) setMaxCorrectStreak(newStreakAfter);
      if (newStreakAfter >= 3) {
        const bonusCoins = Math.min(newStreakAfter * 2, 30); // 3連=6, 5連=10, 15連で30固定
        const bonusXp = Math.min(newStreakAfter * 3, 50);
        addCoins(bonusCoins);
        setGenreXp(prev => ({ ...prev, [genre]: (prev[genre] || 0) + bonusXp }));
        setComboPopup({ count: newStreakAfter, coins: bonusCoins, xp: bonusXp });
        setTimeout(() => setComboPopup(null), 1800);
        if (newStreakAfter % 5 === 0) SFX.levelUp(); // 5・10・15...で特別音
      }

      if (skipAttack) {
        // ソロモード（非最終問題）: 攻撃演出スキップ。スコアとダメージだけ内部で進める
        setPlayers(ps => {
          const enemies = ps.filter(p => !p.isUser && p.hp > 0);
          if (enemies.length === 0) return ps;
          const target = enemies[Math.floor(Math.random() * enemies.length)];
          return ps.map(p => p.id === target.id ? { ...p, hp: Math.max(0, p.hp - finalDmg) } : (p.isUser ? { ...p, dmgDealt: (p.dmgDealt||0) + finalDmg } : p));
        });
      } else {
        // ── ステップ2: 600ms 後に攻撃モーション ────
        setTimeout(() => {
          setAttacking(true);
          setTimeout(() => setAttacking(false), 500);
          setSlashEffect({ id: Date.now(), type: isCrit ? "crit" : isSuper ? "super" : "hit" });
          setTimeout(() => setSlashEffect(null), 600);
          setScreenShake(true);
          setTimeout(() => setScreenShake(false), 400);
          SFX.hit();
          if (isCrit) setTimeout(() => SFX.hit(), 100);

          setTimeout(() => {
            setMonHit(true);
            setDmgPop({ amount: finalDmg, crit: isCrit }); setDmgKey(k => k + 1);
            if (isBoss) {
              setMonster(m => ({ ...m, hp: Math.max(0, m.hp - finalDmg) }));
              setAttackEffect({ targetId: "boss", type: isCrit ? "crit" : "hit", dmg: finalDmg });
            } else {
              setPlayers(ps => {
                const enemies = ps.filter(p => !p.isUser && p.hp > 0);
                if (enemies.length === 0) return ps;
                const target = enemies[Math.floor(Math.random() * enemies.length)];
                setAttackEffect({ targetId: target.id, type: isCrit ? "crit" : "hit", dmg: finalDmg });
                return ps.map(p => p.id === target.id ? { ...p, hp: Math.max(0, p.hp - finalDmg) } : p);
              });
            }
            setPlayers(ps => ps.map(p => p.isUser ? { ...p, dmgDealt: (p.dmgDealt||0) + finalDmg } : p));
            setTimeout(() => setMonHit(false), 350);
            setTimeout(() => setDmgPop(null), 1100);
            setTimeout(() => setAttackEffect(null), 700);
            // ランクマッチ: HP0で脱落、自分が最後の生存者なら勝利
            if (battleMode === "ranked" && !isBoss) {
              setTimeout(() => {
                setPlayers(ps => {
                  const alive = ps.filter(p => p.hp > 0);
                  const user = ps.find(p => p.isUser);
                  if (user && user.hp > 0 && alive.length === 1) {
                    setTimeout(() => setScreen(S.RESULT), 800);
                  }
                  return ps;
                });
              }, 500);
            }
          }, 280);
        }, 600);
      }
    } else if (idx !== -1) {
      setCorrectStreak(0);
      const dmgToUser = isBoss ? (monster?.atk || 20) : 18;
      if (skipAttack) {
        // ソロモード: 被ダメージ演出スキップ、HPだけ減らす
        setPlayers(ps => ps.map(p => p.isUser ? { ...p, hp: Math.max(0, p.hp - dmgToUser) } : p));
        setBgFlash("wrong");
        SFX.wrong();
      } else {
        // ランクマ/ボス: 通常の被ダメージ演出
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 350);
        SFX.hit();
        setTimeout(() => {
          setDmgPop({ amount: dmgToUser, taken: true }); setDmgKey(k => k + 1);
          setPlayers(ps => ps.map(p => p.isUser ? { ...p, hp: Math.max(0, p.hp - dmgToUser) } : p));
          setAttackEffect({ targetId: 99, type: "taken", dmg: dmgToUser });
          setTimeout(() => setDmgPop(null), 900);
          setTimeout(() => setAttackEffect(null), 700);
          // ランクマッチ: 自分のHPが0になったら敗北
          if (battleMode === "ranked") {
            setTimeout(() => {
              setPlayers(ps => {
                const user = ps.find(p => p.isUser);
                if (user && user.hp <= 0) {
                  setTimeout(() => setScreen(S.RESULT), 800);
                }
                return ps;
              });
            }, 500);
          }
        }, 200);
        setBgFlash("wrong");
        SFX.wrong();
      }
    }
    setTimeout(() => {
      setBgFlash(null);
      if (qIndex + 1 >= questions.length) { setScreen(S.RESULT); }
      else {
        // AI/プレイヤー更新（攻撃しあいなど）
        if (!isBoss) {
          setPlayers(ps => {
            const updated = [...ps];
            updated.forEach((p, idx) => {
              if (p.isUser || p.hp <= 0) return;
              if (Math.random() < 0.3) {
                const targets = updated.filter(x => x.id !== p.id && x.hp > 0);
                if (targets.length > 0) {
                  const t = targets[Math.floor(Math.random() * targets.length)];
                  const tIdx = updated.findIndex(x => x.id === t.id);
                  const aiDmg = Math.floor(Math.random() * 12) + 5;
                  updated[tIdx] = { ...updated[tIdx], hp: Math.max(0, updated[tIdx].hp - aiDmg) };
                  updated[idx] = { ...updated[idx], dmgDealt: (updated[idx].dmgDealt||0) + aiDmg };
                }
              }
              if (Math.random() < 0.5) updated[idx] = { ...updated[idx], score: updated[idx].score + 1 };
            });
            return updated;
          });
        } else {
          setPlayers(ps => ps.map(p => {
            if (p.isUser) return p;
            const r = Math.random();
            return { ...p, hp: Math.max(0, p.hp - (r > 0.5 ? Math.floor(Math.random()*12)+3 : 0)), score: p.score + (r > 0.6 ? 1 : 0) };
          }));
        }
        // 中間スコア画面を表示（skipAttack時はスキップ）
        if (skipAttack) {
          setSelected(null);
          setQIndex(q => q + 1);
        } else {
          setShowInterim(true);
          SFX.select();
          setTimeout(() => {
            setShowInterim(false);
            setSelected(null);
            setQIndex(q => q + 1);
          }, 1500);
        }
      }
    }, skipAttack ? 900 : 2200); // skipAttack時は短縮
  }

  function startFlashcard(g) {
    setFcGenre(g);
    // 問題を集める
    const allQs = [];
    const main = (GRADE_TOPIC_QUESTIONS[g] && GRADE_TOPIC_QUESTIONS[g][selectedGrade]) ? Object.values(GRADE_TOPIC_QUESTIONS[g][selectedGrade]).flat() : [];
    const extra = (GRADE_TOPIC_EXTRA[g] && GRADE_TOPIC_EXTRA[g][selectedGrade]) ? Object.values(GRADE_TOPIC_EXTRA[g][selectedGrade]).flat() : [];
    const extra2 = (GRADE_TOPIC_EXTRA2[g] && GRADE_TOPIC_EXTRA2[g][selectedGrade]) ? Object.values(GRADE_TOPIC_EXTRA2[g][selectedGrade]).flat() : [];
    const pool = [...main, ...extra, ...extra2];
    if (pool.length === 0) {
      // フォールバック: QUESTIONS
      const fb = (QUESTIONS[g] || []).slice();
      pool.push(...fb);
    }
    // シャッフルして15問
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 15);
    setFcQuestions(shuffled);
    setFcIndex(0);
    setFcFlipped(false);
    setFcResults([]);
    setScreen(S.FLASHCARD);
  }

  // ワールドボス: 他プレイヤーがランダムタイミングで攻撃するシミュレーション
  useEffect(() => {
    if (screen !== S.BOSS || !bossData || bossHp <= 0) return;
    const interval = setInterval(() => {
      // 30%の確率で攻撃発生
      if (Math.random() > 0.3) return;
      setBossPlayers(prev => {
        const others = prev.filter(p => !p.isUser);
        if (others.length === 0) return prev;
        const attacker = others[Math.floor(Math.random() * others.length)];
        const isCrit = Math.random() < 0.1;
        const dmg = isCrit ? 50 + Math.floor(Math.random() * 30) : 5 + Math.floor(Math.random() * 30);
        setBossAttackLog(logs => [{ name: attacker.name, dmg, isCrit, isWeakness:false, isUser:false, ts: Date.now() }, ...logs].slice(0, 6));
        setBossHp(hp => Math.max(0, hp - dmg));
        return prev.map(p => p.id === attacker.id ? { ...p, dmg: p.dmg + dmg } : p);
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [screen, bossData, bossHp]);

  // 学習時間トラッキング: 学習画面に入った/出た時刻で計測
  useEffect(() => {
    const learningScreens = [S.BATTLE, S.BOSS, S.ENDLESS, S.TIMEATTACK, S.REVIEW, S.LISTENING, S.SPEAKING, "flashcard"];
    const isLearning = learningScreens.includes(screen);
    if (isLearning && !sessionStartTime) {
      setSessionStartTime(Date.now());
    } else if (!isLearning && sessionStartTime) {
      const elapsedMs = Date.now() - sessionStartTime;
      const elapsedMin = Math.max(1, Math.round(elapsedMs / 60000));
      const cappedMin = Math.min(elapsedMin, 90);
      const today = new Date().toISOString().slice(0, 10);
      setStudyTimeByDate(prev => ({ ...prev, [today]: (prev[today] || 0) + cappedMin }));
      setSessionStartTime(null);
    }
  }, [screen, sessionStartTime]);

  // XP変動時に日次スナップショット
  useEffect(() => {
    if (!dataLoaded) return;
    const today = new Date().toISOString().slice(0, 10);
    setXpHistoryByDate(prev => ({ ...prev, [today]: { ...genreXp } }));
  }, [genreXp, dataLoaded]);

  // ペットの空腹度: 30秒ごとに1ずつ減る（最低0）
  useEffect(() => {
    if (!dataLoaded) return;
    const interval = setInterval(() => {
      setPetHunger(h => Math.max(0, h - 1));
    }, 30000);
    return () => clearInterval(interval);
  }, [dataLoaded]);

  // オンライン状態の監視（オフラインになったら通知＆自動オフラインモード）
  useEffect(() => {
    if (typeof window === "undefined" || !navigator) return;
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineToast({ type:"online" });
      setTimeout(() => setOfflineToast(null), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setOfflineToast({ type:"offline" });
      setTimeout(() => setOfflineToast(null), 4000);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 勉強リマインダー: 指定時刻に通知（ブラウザ通知＆セッション内アラート）
  useEffect(() => {
    if (!reminderEnabled || !reminderTime) return;
    let timeoutId;
    const scheduleNext = () => {
      const now = new Date();
      const [hh, mm] = reminderTime.split(":").map(Number);
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0);
      let msUntil = target.getTime() - now.getTime();
      if (msUntil < 0) msUntil += 24 * 60 * 60 * 1000;
      timeoutId = setTimeout(() => {
        // ブラウザ通知
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          try {
            new Notification("📚 Studyum", {
              body: "勉強の時間です！今日もがんばろう✨",
              icon: "/favicon.ico",
              tag: "studyum-reminder",
            });
          } catch (e) { console.warn("Notification failed:", e); }
        }
        // 内部通知
        SFX.levelUp();
        setOfflineToast({ type:"reminder" });
        setTimeout(() => setOfflineToast(null), 5000);
        scheduleNext();
      }, msUntil);
    };
    scheduleNext();
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [reminderEnabled, reminderTime]);

  // 通知許可リクエスト
  function requestNotificationPermission() {
    if (typeof window === "undefined" || !("Notification" in window)) return Promise.resolve(false);
    if (Notification.permission === "granted") return Promise.resolve(true);
    if (Notification.permission === "denied") return Promise.resolve(false);
    return Notification.requestPermission().then(p => p === "granted");
  }

  // 餌やり関数
  // ポモドーロタイマー: アクティブ時に1秒ごとカウントダウン
  useEffect(() => {
    if (!pomodoroActive) return;
    const interval = setInterval(() => {
      setPomodoroSeconds(s => {
        if (s <= 1) {
          // フェーズ切替
          const isWork = pomodoroPhase === "work";
          SFX.levelUp();
          HAPTIC.success();
          // 通知
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            try {
              new Notification("⏰ ポモドーロ", {
                body: isWork ? "お疲れさま！5分休憩しよう☕" : "休憩終了！次の25分集中しよう📚",
                tag: "studyum-pomodoro",
              });
            } catch (e) {}
          }
          if (isWork) {
            setPomodoroPhase("break");
            setPomodoroCount(c => c + 1);
            return 5 * 60; // 5分休憩
          } else {
            setPomodoroPhase("work");
            return 25 * 60; // 25分作業
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroPhase]);

  function feedPet() {
    const cost = 10;
    if (coins < cost) { SFX.wrong(); return false; }
    if (petHunger >= 100) { SFX.back(); return false; } // 満腹なら不可
    const today = new Date().toISOString().slice(0,10);
    const todayCount = petFedToday[today] || 0;
    if (todayCount >= 10) { SFX.back(); return false; } // 1日10回まで
    setCoins(c => c - cost);
    setPetHunger(h => Math.min(100, h + 25));
    setLastFedAt(Date.now());
    setPetFedToday(prev => ({ ...prev, [today]: todayCount + 1 }));
    SFX.coin();
    return true;
  }

  function startBoss() {
    const boss = getCurrentBoss();
    setBossData(boss);
    // ワールドボスHPは既に何割か削られた状態（他のプレイヤーが既に攻撃した想定）
    const initialDmg = Math.floor(boss.hp * (0.15 + Math.random() * 0.2)); // 15-35%減
    setBossHp(boss.hp - initialDmg);
    setBossMaxHp(boss.hp);
    setBossTurn(0);
    setMyBossDmg(0);
    setBossAttackLog([]);
    // 模擬プレイヤー10人＋自分（実際はサーバーから取得想定）
    const fakeNames = ["ゆうき","あおい","はるか","そら","つばさ","りく","みお","けんた","しおり","だいき","あや","ひかる","なお","まなみ","ともき","るい","かな","しん"];
    const fakeAvatars = ["🎓","📚","✨","⭐","🌟","💎","🎯","🔥","⚡","🎨"];
    const shuffledNames = fakeNames.sort(() => Math.random() - 0.5).slice(0, 10);
    const players = shuffledNames.map((n, i) => ({
      id: `p${i}`,
      name: n,
      avatar: fakeAvatars[i % fakeAvatars.length],
      dmg: Math.floor(initialDmg / 10 + Math.random() * (initialDmg / 8)), // 既に攻撃済み
      isUser: false,
    }));
    // 自分を11人目に
    players.push({ id:"me", name: petName || "あなた", avatar:"👤", dmg: 0, isUser: true });
    setBossPlayers(players);
    // 問題は全教科ランダム
    const allQs = [];
    GENRES.forEach(g => {
      const main = (GRADE_TOPIC_QUESTIONS[g.id] && GRADE_TOPIC_QUESTIONS[g.id][selectedGrade]) ? Object.values(GRADE_TOPIC_QUESTIONS[g.id][selectedGrade]).flat() : [];
      const extra = (GRADE_TOPIC_EXTRA[g.id] && GRADE_TOPIC_EXTRA[g.id][selectedGrade]) ? Object.values(GRADE_TOPIC_EXTRA[g.id][selectedGrade]).flat() : [];
      const extra2 = (GRADE_TOPIC_EXTRA2[g.id] && GRADE_TOPIC_EXTRA2[g.id][selectedGrade]) ? Object.values(GRADE_TOPIC_EXTRA2[g.id][selectedGrade]).flat() : [];
      const pool = [...main, ...extra, ...extra2];
      pool.forEach(q => allQs.push({ ...q, _genre: g.id }));
    });
    // シャッフル
    const shuffled = allQs.sort(() => Math.random() - 0.5).slice(0, 10);
    setBattleQuestions(shuffled);
    setQIndex(0);
    setSelected(null);
    setBattleAnswers([]);
    setReviewExplanations({});
    setScreen(S.BOSS);

    // 他プレイヤーがリアルタイムで攻撃するシミュレーション
    if (window.__bossAttackInterval) clearInterval(window.__bossAttackInterval);
    window.__bossAttackInterval = setInterval(() => {
      // ランダムなプレイヤーが攻撃
      const fakePlayers = ["ゆうき","あおい","はるか","そら","つばさ","りく","みお","けんた","しおり","だいき"];
      const name = fakePlayers[Math.floor(Math.random() * fakePlayers.length)];
      const isCrit = Math.random() < 0.15;
      const dmg = (15 + Math.floor(Math.random() * 20)) * (isCrit ? 2 : 1);
      // ボスHPを減らす
      setBossHp(hp => Math.max(0, hp - dmg));
      // プレイヤーリストに反映（最初の10人の誰か）
      setBossPlayers(prev => {
        const idx = Math.floor(Math.random() * Math.min(10, prev.length));
        return prev.map((p, i) => i === idx ? { ...p, dmg: p.dmg + dmg } : p);
      });
      // ログ追加
      setBossAttackLog(prev => [{ name, dmg, isCrit, isWeakness:false, isUser:false, ts: Date.now() }, ...prev].slice(0, 6));
    }, 2500 + Math.random() * 2000); // 2.5〜4.5秒ごと
  }

  // ボス画面を出る時にintervalクリア
  useEffect(() => {
    if (screen !== S.BOSS && window.__bossAttackInterval) {
      clearInterval(window.__bossAttackInterval);
      window.__bossAttackInterval = null;
    }
  }, [screen]);

  function startBattle(g, useCustom=false, mode="solo", topic=null, grade=null) {
    // 連続タップ防止: 既に遷移中なら無視
    if (typeof window !== "undefined") {
      if (window.__STUDYUM_STARTING) return;
      window.__STUDYUM_STARTING = true;
      setTimeout(() => { window.__STUDYUM_STARTING = false; }, 800);
    }
    // 英語のリスニング/スピーキングは専用画面へ
    if (g === "english" && topic === "listening") { startListening(grade); return; }
    if (g === "english" && topic === "speaking")  { startSpeaking(grade); return; }
    setGenre(g); setQIndex(0); setSelected(null); setBgFlash(null);
    setCorrectStreak(0);
    setBattleAnswers([]); // 今回のバトルの記録をクリア
    setReviewExplanations({});
    if (!useCustom) setCustomQuestions(null);
    // 問題をランダム選択（学年×分野→学年のみ→分野のみ→教科全体の順でフォールバック）
    if (!useCustom) {
      let pool = null;
      // ① 学年×分野指定がある場合
      if (grade && topic && GRADE_TOPIC_QUESTIONS[g] && GRADE_TOPIC_QUESTIONS[g][grade] && GRADE_TOPIC_QUESTIONS[g][grade][topic] && GRADE_TOPIC_QUESTIONS[g][grade][topic].length > 0) {
        pool = GRADE_TOPIC_QUESTIONS[g][grade][topic];
      }
      // ② 学年×分野（追加プール）
      else if (grade && topic && GRADE_TOPIC_EXTRA[g] && GRADE_TOPIC_EXTRA[g][grade] && GRADE_TOPIC_EXTRA[g][grade][topic]) {
        pool = GRADE_TOPIC_EXTRA[g][grade][topic];
      }
      // ②-2 さらに追加プール
      else if (grade && topic && GRADE_TOPIC_EXTRA2[g] && GRADE_TOPIC_EXTRA2[g][grade] && GRADE_TOPIC_EXTRA2[g][grade][topic]) {
        pool = GRADE_TOPIC_EXTRA2[g][grade][topic];
      }
      // ③ 学年指定のみ → その学年の全分野から集める（メイン＋追加プール）
      else if (grade) {
        const main = (GRADE_TOPIC_QUESTIONS[g] && GRADE_TOPIC_QUESTIONS[g][grade]) ? Object.values(GRADE_TOPIC_QUESTIONS[g][grade]).flat() : [];
        const extra = (GRADE_TOPIC_EXTRA[g] && GRADE_TOPIC_EXTRA[g][grade]) ? Object.values(GRADE_TOPIC_EXTRA[g][grade]).flat() : [];
        const extra2 = (GRADE_TOPIC_EXTRA2[g] && GRADE_TOPIC_EXTRA2[g][grade]) ? Object.values(GRADE_TOPIC_EXTRA2[g][grade]).flat() : [];
        const combined = [...main, ...extra, ...extra2];
        if (combined.length > 0) pool = combined;
      }
      // ④ 分野指定のみ
      if (!pool && topic && TOPIC_QUESTIONS[g + "_" + topic]) {
        pool = TOPIC_QUESTIONS[g + "_" + topic];
      }
      // ⑤ フォールバック
      if (!pool || pool.length === 0) {
        pool = QUESTIONS[g] || QUESTIONS.english;
      }
      // ── 同じ問題文の重複を削除（最初の1個だけ残す） ──
      const seen = new Set();
      pool = pool.filter(p => {
        if (seen.has(p.q)) return false;
        seen.add(p.q);
        return true;
      });
      const numQ = mode === "ranked" ? 6 : mode === "boss" ? 5 : questionCount;
      // ── 苦手問題（過去に間違えた問題）を25%程度混ぜる ──
      const wrongPool = answerHistory
        .filter(h => h.genre === g && !h.correct && h.timestamp > Date.now() - 30 * 24 * 60 * 60 * 1000)
        .reduce((acc, h) => {
          // 同じ問題が何度も来ないよう、最新のものだけ
          if (!acc.find(x => x.q === h.q)) {
            // poolの中から同じ問題を探して使う（再現性のため）
            const match = pool.find(p => p.q === h.q);
            if (match) acc.push(match);
          }
          return acc;
        }, []);
      const numWrongToInclude = Math.min(wrongPool.length, Math.max(1, Math.floor(numQ * 0.25)));
      const selectedWrong = wrongPool.sort(() => Math.random() - 0.5).slice(0, numWrongToInclude);
      // 苦手以外をシャッフル
      const remainingPool = pool.filter(p => !selectedWrong.find(w => w.q === p.q));
      const remainingShuffled = [...remainingPool].sort(() => Math.random() - 0.5);
      const remainingNeeded = numQ - selectedWrong.length;
      // 苦手と通常を混ぜてシャッフル
      const combined = [...selectedWrong, ...remainingShuffled.slice(0, remainingNeeded)].sort(() => Math.random() - 0.5);
      // 選択肢の順番もシャッフル（answer indexも追従）
      const shuffledQs = combined.map(q => {
        const indexed = q.choices.map((c, i) => ({ c, isAnswer: i === q.answer }));
        const shuffled = indexed.sort(() => Math.random() - 0.5);
        const newAnswerIdx = shuffled.findIndex(x => x.isAnswer);
        return { ...q, choices: shuffled.map(x => x.c), answer: newAnswerIdx };
      });
      setBattleQuestions(shuffledQs);
    }
    setBattleMode(mode);
    // ボスモードだけモンスターを使う
    if (mode === "boss") {
      const mon = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
      mon.hp = mon.maxHp = mon.maxHp * 3;
      mon.atk = Math.floor(mon.atk * 1.5);
      setMonster({ ...mon });
    } else {
      setMonster(null); // PVPはモンスター不使用
    }
    const user = { id:99, name:"YOU", level:12, avatar:"⭐", score:0, hp:100, maxHp:100, dmgDealt:0, isUser:true, isPet:true };
    // ボスモードは7体のAI、それ以外は3体（個人戦）
    const aiCount = mode === "boss" ? 7 : 3;
    // 各AIに「ペット」プロパティを与える（ジャンル別ランダム）
    // AI選択ロジック：ランクマッチ時はレート近似で、それ以外はシャッフル
    let selectedAIs;
    if (mode === "ranked") {
      // 自分のレートに近い順にソート、上位N人からランダムN人選ぶ
      const sorted = [...AI_POOL].sort((a, b) => Math.abs(a.rating - userRating) - Math.abs(b.rating - userRating));
      const candidates = sorted.slice(0, Math.min(aiCount + 2, sorted.length));
      // シャッフル
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      selectedAIs = candidates.slice(0, aiCount);
    } else {
      // 通常モードはシャッフル
      const shuffled = [...AI_POOL].sort(() => Math.random() - 0.5);
      selectedAIs = shuffled.slice(0, aiCount);
    }
    const aiPlayers = selectedAIs.map((p,i) => {
      const randGenre = GENRES[Math.floor(Math.random() * GENRES.length)].id;
      const aiGenreXp = { english:0, math:0, japanese:0, social:0, science:0, history:0 };
      // AIのレベルに応じて疑似XPを与えてペット段階を決める
      const aiTotalXp = p.level * 25; // Lv24→600XP（Stage5相当）
      aiGenreXp[randGenre] = aiTotalXp;
      return { ...p, id:i+1, score:0, hp:100, maxHp:100, dmgDealt:0, isPet:true, petGenreXp:aiGenreXp, petStarterColor:GENRES.find(x=>x.id===randGenre)?.color || "#a78bfa" };
    });
    setPlayers([user, ...aiPlayers]);
    const updates = { battles: 1 };
    if (mode === "ranked") updates.ranked = 1;
    if (useCustom) updates.photos = 1;
    trackMission(updates);
    setScreen(S.LOBBY);
  }

  // ランクマッチ開始（教科指定 or ランダム）
  function startRankedMatch(g) {
    const actualGenre = g === "random" ? GENRES[Math.floor(Math.random() * GENRES.length)].id : g;
    setRankedMatching(true);
    // マッチング演出（2.5秒）
    setTimeout(() => {
      setRankedMatching(false);
      startBattle(actualGenre, false, "ranked");
    }, 2500);
  }

  // ファイル/写真選択 → リサイズしてbase64化（PDFはそのまま）
  async function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    setPhotoFileName(file.name);

    // サイズ上限チェック (20MB)
    if (file.size > 20 * 1024 * 1024) {
      setPhotoError("ファイルが大きすぎます（20MB以下にしてください）");
      return;
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/");

    if (!isPdf && !isImage) {
      setPhotoError("画像かPDFを選んでください");
      return;
    }

    try {
      if (isPdf) {
        // PDFはそのまま
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          setPhotoPreview("PDF");  // PDFアイコン表示用
          setPhotoData({ base64: dataUrl.split(",")[1], mediaType: "application/pdf", isPdf:true });
        };
        reader.onerror = () => setPhotoError("PDFの読み込みに失敗しました");
        reader.readAsDataURL(file);
      } else {
        // 画像はリサイズ
        const resized = await resizeImage(file, 1400);
        setPhotoPreview(resized.dataUrl);
        setPhotoData({ base64:resized.base64, mediaType:"image/jpeg", isPdf:false });
      }
    } catch (err) {
      console.error(err);
      setPhotoError("ファイルの処理に失敗しました");
    }
    // input をリセット（同じファイル再選択可）
    if (e.target) e.target.value = "";
  }

  // 画像リサイズ
  function resizeImage(file, maxDim=1400) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = ev => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) { height = Math.round((height/width)*maxDim); width = maxDim; }
            else { width = Math.round((width/height)*maxDim); height = maxDim; }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolve({ dataUrl, base64: dataUrl.split(",")[1] });
        };
        img.onerror = () => reject(new Error("画像の読み込み失敗"));
        img.src = ev.target.result;
      };
      reader.onerror = () => reject(new Error("ファイル読み込み失敗"));
      reader.readAsDataURL(file);
    });
  }

  // AI で問題生成
  async function generateQuestions() {
    if (!photoData) return;
    setGenerating(true);
    setPhotoError(null);
    try {
      const contentBlock = photoData.isPdf
        ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: photoData.base64 } }
        : { type: "image",    source: { type: "base64", media_type: photoData.mediaType, data: photoData.base64 } };

      // モード別プロンプト
      let modeInstruction = "";
      if (quizMode === "vocab") {
        modeInstruction = `【モード】単語暗記モード
- 画像/PDFに単語リスト・単語帳・用語集が写っている前提
- 単語と意味のペアを抽出して、覚えるための4択問題を作る
- 出題パターンの例：
  ・「○○」の意味は？ → 選択肢4つ（正解1+ダミー3）
  ・「△△の意味」を持つ単語は？ → 選択肢4つ
  ・英単語ならスペル違いの選択肢も使う（Library/Liberary/Librery/Libray など）
- ダミーの選択肢も、同じリスト内の他の単語/意味から取って混乱させる
- 同じ単語ばかりにならないように、できるだけ違う単語をカバーする`;
      } else if (quizMode === "content") {
        modeInstruction = `【モード】内容理解モード
- 画像/PDFの内容（教科書・解説文・図解など）を読み取る
- 内容の理解度を測る問題を作る
- 「〜とは何か」「〜の特徴は」「〜が起こった年は」など概念や事実を問う
- 選択肢は全て本物っぽく、ダミーも紛らわしいものにする`;
      } else {
        modeInstruction = `【モード】自動判別
- まず画像/PDFが「単語リスト/単語帳」か「説明文/教科書」かを判別
- 単語リストっぽい：意味を問う4択（例：「courage」の意味は？→勇気/臆病/勇敢/恐怖）
- 説明文っぽい：内容理解の4択（例：〜の特徴は？→A/B/C/D）
- 表や年表なら：項目と説明のマッチング`;
      }

      const promptText = "この" + (photoData.isPdf?"PDF":"画像") + "から学習用の4択クイズを作ってください。\n\n" +
        modeInstruction + "\n\n" +
        "【ルール】\n" +
        "- 問題と選択肢は日本語（英単語問題なら英語のまま）\n" +
        "- 必ず4択を3〜4問\n" +
        "- 問題文40字以内、選択肢20字以内\n" +
        "- 画像が読み取れる範囲で問題を作る。内容が薄ければ関連する基礎知識でOK\n\n" +
        "【出力】下のJSON形式そのままで返す。説明・前置き・コードブロック記号は一切含めない:\n" +
        '{"questions":[{"q":"問題文","choices":["A","B","C","D"],"answer":0}]}\n\n' +
        "answerは0〜3の数字（正解の選択肢のインデックス）。必ずJSONから始めてJSONで終わってください。";

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2500,
          messages: [{
            role: "user",
            content: [ contentBlock, { type: "text", text: promptText } ]
          }]
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("API error:", res.status, errText);
        throw new Error("APIエラー(" + res.status + "): " + errText.substring(0, 200));
      }

      const data = await res.json();
      console.log("API response:", data);

      // APIがエラーオブジェクトを返した場合（200 OKでも中身がエラーのケース）
      if (data.error) {
        const errMsg = data.error.message || JSON.stringify(data.error);
        console.error("API returned error object:", data.error);
        throw new Error("API: " + errMsg);
      }

      if (!data.content || !Array.isArray(data.content)) {
        console.error("Unexpected API response shape:", data);
        throw new Error("予期しない応答形式: " + JSON.stringify(data).substring(0, 150));
      }

      const text = data.content.map(c => c.text || "").join("").trim();
      if (!text) throw new Error("AIが何も返しませんでした");
      console.log("Raw AI text:", text);

      // AIが画像を読めないと返してきた場合を検出
      const refusalPatterns = [
        /画像.*?(読み取|認識|判別).{0,20}(できません|不可|無理|失敗)/,
        /(画像|写真|資料).{0,30}(不鮮明|低解像度|内容.{0,10}わかりません|読み取れません)/,
        /申し訳.{0,10}(ありません|ございません)/,
        /(I cannot|I'm unable|I can't).{0,30}(read|see|identify|process).{0,20}image/i,
      ];
      const looksLikeRefusal = refusalPatterns.some(p => p.test(text)) && text.length < 200;
      if (looksLikeRefusal) {
        throw new Error("画像から問題を抽出できませんでした。もっとはっきり写ったテキスト/単語が映る画像で試してください");
      }

      // ── JSON抽出を多段階で試す ───────────────────
      const parsed = extractQuestions(text);
      if (!parsed || parsed.length === 0) {
        console.error("Failed to parse, raw text:", text);
        const preview = text.length > 100 ? text.substring(0, 100) + "..." : text;
        throw new Error("AIの応答を解析できませんでした。応答: " + preview);
      }

      setCustomQuestions(parsed);
      setGenerating(false);
      startBattle("english", true, "solo");
    } catch (err) {
      console.error("generateQuestions error:", err);
      // エラーメッセージをユーザーフレンドリーに
      let userMsg = err.message || "問題の生成に失敗しました";
      if (userMsg.includes("Failed to fetch") || userMsg.includes("NetworkError") || userMsg.includes("ネットワーク")) {
        userMsg = "ネットワークに接続できませんでした。通信環境を確認してください。";
      } else if (userMsg.includes("401") || userMsg.includes("403")) {
        userMsg = "現在AI機能が利用できない状態です。少し時間をおいてもう一度お試しください。";
      } else if (userMsg.includes("429")) {
        userMsg = "利用が混雑しています。少し時間をおいてお試しください。";
      } else if (userMsg.includes("500") || userMsg.includes("502") || userMsg.includes("503")) {
        userMsg = "サーバーが一時的に応答していません。少し待ってから再度お試しください。";
      } else if (userMsg.length > 200) {
        userMsg = "問題生成中にエラー: " + userMsg.substring(0, 100) + "...";
      }
      setPhotoError(userMsg);
      setGenerating(false);
    }
  }

  // 多様な形式から問題リストを抽出
  function extractQuestions(text) {
    // ステップ1: コードブロックや余計な記号を除去
    let cleaned = text
      .replace(/```(?:json|javascript|js)?\s*/gi, "")
      .replace(/```/g, "")
      .replace(/^\s*[\u201C\u201D"]|[\u201C\u201D"]\s*$/g, "")  // 前後のスマートクオート
      .trim();

    // ステップ2: 完全なJSONとしてパースを試す
    let parsed = tryParseJson(cleaned);

    // ステップ3: 最初に出てくる {...} を抽出してパース
    if (!parsed) {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) parsed = tryParseJson(match[0]);
    }

    // ステップ4: 配列だけ返ってきた場合
    if (!parsed) {
      const arrMatch = cleaned.match(/\[[\s\S]*\]/);
      if (arrMatch) {
        const arr = tryParseJson(arrMatch[0]);
        if (Array.isArray(arr)) parsed = { questions: arr };
      }
    }

    // ステップ5: JSON修復（末尾カンマ、シングルクォートなど）
    if (!parsed) {
      const repaired = cleaned
        .replace(/,(\s*[}\]])/g, "$1")            // 末尾カンマ
        .replace(/'/g, '"')                         // シングル→ダブル
        .replace(/(\w+):/g, '"$1":');              // unquoted key
      parsed = tryParseJson(repaired);
      if (!parsed) {
        const match = repaired.match(/\{[\s\S]*\}/);
        if (match) parsed = tryParseJson(match[0]);
      }
    }

    if (!parsed) return null;

    // ── 問題配列を取り出す（さまざまなキー名に対応）─────
    const list = parsed.questions || parsed.quiz || parsed.problems
              || parsed.items || parsed.data
              || (Array.isArray(parsed) ? parsed : null);

    if (!Array.isArray(list)) return null;

    // ── 各問題を正規化（多様なキー名・形式に対応）────
    const normalized = list.map(item => normalizeQuestion(item)).filter(Boolean);
    return normalized.length > 0 ? normalized : null;
  }

  function tryParseJson(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  function normalizeQuestion(item) {
    if (!item || typeof item !== "object") return null;

    // 問題文：q, question, text, prompt, 問題, 問
    const q = item.q || item.question || item.text || item.prompt
           || item.問題 || item.問 || item.Q;
    if (!q || typeof q !== "string") return null;

    // 選択肢：choices, options, answers, 選択肢
    let choices = item.choices || item.options || item.answers
               || item.選択肢 || item.choice;

    // 選択肢が {a,b,c,d} 形式の場合
    if (!Array.isArray(choices) && typeof choices === "object" && choices) {
      choices = Object.values(choices);
    }
    // 選択肢が各フィールド分かれてる場合
    if (!Array.isArray(choices)) {
      const c = [item.a, item.b, item.c, item.d].filter(x => x != null);
      if (c.length > 0) choices = c;
    }
    if (!Array.isArray(choices) || choices.length === 0) return null;

    // 全部文字列化、空のものを除外
    choices = choices.map(c => String(c).trim()).filter(c => c.length > 0);
    if (choices.length < 2) return null;

    // 4つに調整（多すぎる→切り捨て、少ない→ダミーで埋める）
    if (choices.length > 4) choices = choices.slice(0, 4);
    while (choices.length < 4) choices.push(`選択肢${choices.length + 1}`);

    // 正解：answer, correct, correctAnswer, 正解
    let answer = item.answer ?? item.correct ?? item.correctAnswer
              ?? item.正解 ?? item.ans;

    // 文字列の正解（"A", "a", "1" など）
    if (typeof answer === "string") {
      const upper = answer.trim().toUpperCase();
      if (["A","B","C","D"].includes(upper)) {
        answer = upper.charCodeAt(0) - 65;  // A=0, B=1...
      } else if (/^[1-4]$/.test(upper)) {
        answer = parseInt(upper, 10) - 1;
      } else {
        // 選択肢のテキスト一致
        const idx = choices.findIndex(c => c === answer);
        answer = idx >= 0 ? idx : 0;
      }
    }
    answer = Number(answer);
    if (!Number.isInteger(answer) || answer < 0 || answer >= choices.length) {
      answer = 0;
    }

    return { q: q.trim(), choices, answer };
  }

  function resetPhoto() {
    setPhotoData(null);
    setPhotoPreview(null);
    setPhotoFileName(null);
    setPhotoError(null);
    setCustomQuestions(null);
  }

  // ── エンドレスモード ─────────────────────────────────
  function startEndless(mode) {
    setEndlessMode(mode);
    setEndlessIdx(0);
    setEndlessScore(0);
    setEndlessLives(3);
    setEndlessSelected(null);
    const qs = [...(ENDLESS_QUESTIONS[mode.id] || [])];
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [qs[i], qs[j]] = [qs[j], qs[i]];
    }
    setEndlessShuffled(qs);
    setEndlessTimer(10);
    setScreen(S.ENDLESS);
  }

  function handleEndlessAnswer(idx) {
    clearInterval(endlessTimerRef.current);
    setEndlessSelected(idx);
    const q = endlessShuffled[endlessIdx];
    const correct = q && idx === q.answer;
    setBgFlash(correct ? "correct" : "wrong");
    if (correct) { SFX.correct(); addCoins(3); } else SFX.wrong();
    if (correct) {
      setEndlessScore(s => s + 1);
      setCoins(c => c + 3); // エンドレス正解は3コイン
      const genreMap = { english_words:"english", kanji:"japanese", yojijukugo:"history", math_calc:"math", capitals:"social" };
      const gid = genreMap[endlessMode.id] || "english";
      setGenreXp(gx => ({ ...gx, [gid]: (gx[gid] || 0) + 5 }));
    } else {
      setEndlessLives(l => l - 1);
    }
    setTimeout(() => {
      setBgFlash(null);
      const livesLeft = correct ? endlessLives : endlessLives - 1;
      if (livesLeft <= 0) {
        const best = endlessBest[endlessMode.id] || 0;
        const newScore = correct ? endlessScore + 1 : endlessScore;
        if (newScore > best) setEndlessBest(b => ({ ...b, [endlessMode.id]: newScore }));
        setScreen(S.ENDLESS_RESULT);
      } else {
        const nextIdx = endlessIdx + 1;
        if (nextIdx >= endlessShuffled.length) {
          const qs = [...endlessShuffled];
          for (let i = qs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [qs[i], qs[j]] = [qs[j], qs[i]];
          }
          setEndlessShuffled(qs);
          setEndlessIdx(0);
        } else {
          setEndlessIdx(nextIdx);
        }
        setEndlessSelected(null);
        setEndlessTimer(10);
      }
    }, 800);
  }

  const sortedByScore = [...players].sort((a,b) => b.score - a.score);
  const sortedByDmg   = [...players].sort((a,b) => (b.dmgDealt||0) - (a.dmgDealt||0));
  const userRank      = sortedByScore.findIndex(p => p.isUser) + 1;
  const userPlayer    = players.find(p => p.isUser);
  const totalDmg      = players.reduce((s,p) => s + (p.dmgDealt||0), 0);

  // 実効テーマ: autoならシステム設定に追従
  const effectiveTheme = theme === "auto" ? (systemDark ? "dark" : "light") : theme;
  const themeData = THEMES[effectiveTheme] || THEMES.dark;
  const pageBg = bgFlash === "correct" ? "#0a1f12"
    : bgFlash === "wrong" ? "#1f0a0a"
    : themeData.bg;

  // バトル中はメニュー非表示
  const showNav = [S.HOME, S.FRIENDS, S.RANKING, S.GACHA, S.PROFILE].includes(screen);
  const isTab = (id) => screen === id;

  return (
    <div style={{
      minHeight:"100vh", background:pageBg, fontFamily:FONT, color:themeData.text,
      overflowX:"hidden", transition:"background 0.2s, color 0.2s",
      paddingBottom: showNav ? `calc(140px + env(safe-area-inset-bottom, 0px))` : `env(safe-area-inset-bottom, 0px)`,
      paddingTop: `env(safe-area-inset-top, 0px)`,
      position:"relative",
    }}>
      {/* 背景パーティクル（軽量・装飾のみ） */}
      <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
        {[
          { left:"8%", size:6, color:"#60A5FA", duration:14, delay:0,  anim:"particleFloat" },
          { left:"22%", size:4, color:"#A78BFA", duration:18, delay:3,  anim:"particleFloat2" },
          { left:"38%", size:5, color:"#FBBF24", duration:16, delay:7,  anim:"particleFloat" },
          { left:"52%", size:3, color:"#34D399", duration:20, delay:2,  anim:"particleFloat2" },
          { left:"68%", size:5, color:"#F472B6", duration:15, delay:9,  anim:"particleFloat" },
          { left:"82%", size:4, color:"#60A5FA", duration:17, delay:5,  anim:"particleFloat2" },
          { left:"15%", size:3, color:"#A78BFA", duration:22, delay:11, anim:"particleFloat" },
          { left:"45%", size:6, color:"#FBBF24", duration:19, delay:14, anim:"particleFloat2" },
          { left:"75%", size:4, color:"#F472B6", duration:13, delay:6,  anim:"particleFloat" },
        ].map((p, i) => (
          <div key={i} style={{
            position:"absolute", left:p.left,
            width:p.size, height:p.size, borderRadius:"50%",
            background: p.color,
            boxShadow:`0 0 ${p.size*2}px ${p.color}`,
            animation:`${p.anim} ${p.duration}s ease-in infinite`,
            animationDelay:`${p.delay}s`,
            opacity:0,
          }}/>
        ))}
      </div>
      <div style={{ position:"relative", zIndex:1 }}>
      <style>{`
        @keyframes monsterFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes monsterAttack{0%{transform:translateX(0)}35%{transform:translateX(55px) scale(1.2)}100%{transform:translateX(0)}}
        @keyframes monsterHit{0%,100%{filter:brightness(1)}50%{filter:brightness(3) saturate(0);transform:scale(0.9)}}
        @keyframes dmgFloat{0%{transform:translateX(-50%) translateY(0);opacity:1}100%{transform:translateX(-50%) translateY(-70px) scale(0.7);opacity:0}}
        @keyframes dmgCrit{0%{transform:translateX(-50%) translateY(0) scale(0.3);opacity:0}30%{transform:translateX(-50%) translateY(-15px) scale(1.6);opacity:1}60%{transform:translateX(-50%) translateY(-30px) scale(1.1);opacity:1}100%{transform:translateX(-50%) translateY(-100px) scale(0.8);opacity:0}}
        @keyframes screenShake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)}}
        @keyframes slashDiagonal{0%{transform:translate(-100%,100%) rotate(-45deg);opacity:0}30%{opacity:1}60%{opacity:1}100%{transform:translate(100%,-100%) rotate(-45deg);opacity:0}}
        @keyframes flashExpand{0%{transform:scale(0);opacity:1}100%{transform:scale(3);opacity:0}}
        @keyframes critRing{0%{transform:scale(0.3);opacity:1;border-width:8px}100%{transform:scale(2.5);opacity:0;border-width:1px}}
        @keyframes impactFlash{0%,100%{opacity:0}50%{opacity:0.4}}
        @keyframes popIn{0%{transform:scale(0.85) translateY(20px);opacity:0}70%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}
        @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeInUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeInDown{from{transform:translateY(-30px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes screenEnter{0%{transform:translateY(20px) scale(0.98);opacity:0}60%{opacity:1}100%{transform:translateY(0) scale(1);opacity:1}}
        @keyframes cardCascade{from{transform:translateY(15px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes victoryGlow{0%,100%{opacity:0.5}50%{opacity:0.9}}
        @keyframes victoryBounce{0%{transform:scale(0) rotate(-360deg);opacity:0}50%{transform:scale(1.3) rotate(15deg);opacity:1}70%{transform:scale(0.9) rotate(-5deg)}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes victoryRay{0%{transform:rotate(var(--a)) translateY(40px) scaleY(0);opacity:0}50%{opacity:1}100%{transform:rotate(var(--a)) translateY(40px) scaleY(1.5);opacity:0}}
        @keyframes confettiFall{0%{transform:translateY(-100vh) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
        @keyframes spinReel{0%{transform:translateY(-3px)}50%{transform:translateY(3px)}100%{transform:translateY(-3px)}}
        @keyframes titleGlow{0%,100%{opacity:0.5;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.2)}}
        @keyframes titleRay{0%{opacity:0;transform:rotate(var(--a)) translateY(80px) scaleY(0)}50%{opacity:1}100%{opacity:0;transform:rotate(var(--a)) translateY(80px) scaleY(1.6)}}
        @keyframes titleUnlockPop{0%{transform:scale(0.3) rotate(-15deg);opacity:0}50%{transform:scale(1.1) rotate(5deg);opacity:1}70%{transform:scale(0.95) rotate(-2deg)}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes titleIconBounce{0%{transform:scale(0);opacity:0}50%{transform:scale(1.4)}75%{transform:scale(0.9)}100%{transform:scale(1);opacity:1}}
        @keyframes spinReel{0%{transform:translateY(-4px)}50%{transform:translateY(4px)}100%{transform:translateY(-4px)}}
        @keyframes gradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes slotSpin{0%{transform:translateY(0)}100%{transform:translateY(-2000px)}}
        @keyframes countPop{0%{transform:scale(2);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes coinPopAnim{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-30px);opacity:0}}
        @keyframes petReactPop{0%{transform:scale(0) translateY(0);opacity:0}20%{transform:scale(1.15) translateY(-5px);opacity:1}80%{transform:scale(1) translateY(-12px);opacity:1}100%{transform:scale(0.9) translateY(-20px);opacity:0}}
        @keyframes evolveBeam{0%,100%{opacity:0.2}50%{opacity:0.9}}
        @keyframes sparkleOut{0%{transform:rotate(var(--rot,0deg)) translateY(0) scale(0);opacity:0}30%{opacity:1;transform:rotate(var(--rot,0deg)) translateY(-100px) scale(1.2)}100%{transform:rotate(var(--rot,0deg)) translateY(-200px) scale(0.3);opacity:0}}
        @keyframes evolveFromShrink{0%{opacity:1;transform:scale(1)}100%{opacity:0.3;transform:scale(0.7)}}
        @keyframes evolveAppear{0%{opacity:0;transform:scale(0.3) rotate(-180deg)}50%{opacity:1;transform:scale(1.3) rotate(0deg)}100%{opacity:1;transform:scale(1) rotate(0deg)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        button:active:not(:disabled){transform:scale(0.97);transition:transform 0.05s ease}
        button{transition:transform 0.15s ease}
        @keyframes eggShake{0%,100%{transform:translateX(0) rotate(0)}25%{transform:translateX(-3px) rotate(-2deg)}75%{transform:translateX(3px) rotate(2deg)}}
        @keyframes eggGrow{0%{transform:scale(0.7)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
        /* 小画面対応（iPhone SE / 320-374px） */
        @media (max-width: 374px) {
          h1, h2 { font-size: 90% !important; }
          .battle-question { font-size: 90% !important; }
        }
        /* タップ感を改善 */
        button { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        /* 長い単語の折返し */
        p, div { word-wrap: break-word; overflow-wrap: break-word; }
        @keyframes eggTopCrack{0%,60%{transform:translate(-50%, -75%) rotate(0)}80%{transform:translate(-50%, -110%) rotate(-25deg) translateX(-30px)}100%{transform:translate(-50%, -180%) rotate(-45deg) translateX(-80px);opacity:0}}
        @keyframes eggBottomCrack{0%,60%{transform:translate(-50%, -25%) rotate(0)}80%{transform:translate(-50%, 10%) rotate(15deg) translateX(20px)}100%{transform:translate(-50%, 80%) rotate(35deg) translateX(60px);opacity:0}}
        @keyframes crackAppear{0%,40%{opacity:0;transform:translate(-50%,-50%) scale(0.5)}55%{opacity:1;transform:translate(-50%,-50%) scale(1.5)}65%{opacity:1;transform:translate(-50%,-50%) scale(1)}80%,100%{opacity:0;transform:translate(-50%,-50%) scale(0.5)}}
        @keyframes fragmentFly{0%{opacity:0;transform:translate(-50%,-50%) rotate(0deg)}5%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--fragX)), calc(-50% + var(--fragY))) rotate(var(--fragRot))}}
        @keyframes gachaFlash{0%,70%{opacity:0;transform:translate(-50%,-50%) scale(0.3)}78%{opacity:1;transform:translate(-50%,-50%) scale(1.5)}90%,100%{opacity:0;transform:translate(-50%,-50%) scale(3)}}
        @keyframes gachaBeam{0%,75%{opacity:0}85%{opacity:0.9}100%{opacity:0}}
        @keyframes recordingPulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.7), 0 0 30px rgba(239,68,68,0.3)}50%{box-shadow:0 0 0 20px rgba(239,68,68,0), 0 0 40px rgba(239,68,68,0.5)}}
        @keyframes recordingDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.6)}}
        @keyframes micShake{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
        @keyframes waveBar{0%,100%{height:20%}50%{height:90%}}
        @keyframes loadingSlide{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}
        @keyframes comboPopup{0%{transform:translate(-50%, -50%) scale(0.3);opacity:0}20%{transform:translate(-50%, -50%) scale(1.1);opacity:1}30%{transform:translate(-50%, -50%) scale(1);opacity:1}80%{transform:translate(-50%, -50%) scale(1);opacity:1}100%{transform:translate(-50%, -60%) scale(0.9);opacity:0}}
        @keyframes particleFloat{0%{transform:translateY(100vh) translateX(0) scale(0.5);opacity:0}10%{opacity:0.6}90%{opacity:0.6}100%{transform:translateY(-20vh) translateX(40px) scale(1);opacity:0}}
        @keyframes particleFloat2{0%{transform:translateY(100vh) translateX(0) scale(0.5);opacity:0}10%{opacity:0.4}90%{opacity:0.4}100%{transform:translateY(-20vh) translateX(-30px) scale(0.8);opacity:0}}
        @keyframes splashGlow{0%,100%{opacity:0.4;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.7;transform:translate(-50%,-50%) scale(1.15)}}
        @keyframes splashSparkle{0%,100%{opacity:0;transform:rotate(var(--angle)) translateY(-150px) scale(0.5)}50%{opacity:1}}
        @keyframes splashBounce{0%{transform:scale(0) rotate(-180deg);opacity:0}60%{transform:scale(1.2) rotate(15deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
        @keyframes splashProgress{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes screenSlide{0%{opacity:0;transform:translateX(20px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(105vh) rotate(720deg);opacity:0.3}}
        @keyframes rankRow{from{transform:translateX(-16px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes toastSlide{from{transform:translate(-50%,-30px);opacity:0}to{transform:translate(-50%,0);opacity:1}}
        *{box-sizing:border-box}
        button:active{transform:scale(0.97) !important}
      `}</style>

      {/* ══ ONBOARDING ══════════════════════════════════════ */}
      {screen === S.ONBOARDING && (() => {
        const step = onboardStep || 0;
        return (
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", animation:"fadeIn 0.5s ease" }}>
          <div style={{ flex:1, overflowY:"auto", padding:"32px 20px 20px" }}>
            <div style={{ maxWidth:440, width:"100%", margin:"0 auto" }}>
              {/* ステップ進捗 */}
              <div style={{ display:"flex", gap:5, marginBottom:24, justifyContent:"center" }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    width:i === step ? 24 : 8, height:6, borderRadius:99,
                    background: i <= step ? "#60A5FA" : "rgba(255,255,255,0.1)",
                    transition:"all 0.3s",
                  }}/>
                ))}
              </div>

              {/* ステップ0: ウェルカム */}
              {step === 0 && (
                <div style={{ textAlign:"center", animation:"fadeIn 0.4s ease" }}>
                  <div style={{ fontSize:72, marginBottom:14, animation:"monsterFloat 2.5s ease-in-out infinite" }}>📚</div>
                  <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:4, fontWeight:700, marginBottom:8 }}>WELCOME TO</div>
                  <h1 style={{ fontSize:36, fontWeight:900, margin:"0 0 14px", letterSpacing:-1, color:"#f8fafc", background:"linear-gradient(135deg, #60A5FA, #A78BFA)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>STUDYUM</h1>
                  <p style={{ color:"#cbd5e1", fontSize:14, lineHeight:1.7, marginBottom:24 }}>
                    勉強するほど強くなる<br/>
                    あなただけの<span style={{ color:"#FBBF24", fontWeight:700 }}>学習バトルRPG</span>
                  </p>
                  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px 16px", textAlign:"left" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                      <span style={{ fontSize:24 }}>⚔️</span>
                      <div>
                        <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>問題で戦う</div>
                        <div style={{ fontSize:10, color:"#94a3b8" }}>4人バトルで学習</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                      <span style={{ fontSize:24 }}>🐣</span>
                      <div>
                        <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>ペットが進化</div>
                        <div style={{ fontSize:10, color:"#94a3b8" }}>勉強でレベルアップ</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ fontSize:24 }}>🏆</span>
                      <div>
                        <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>ランクで競う</div>
                        <div style={{ fontSize:10, color:"#94a3b8" }}>世界のプレイヤーと対戦</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ステップ1: 教科紹介 */}
              {step === 1 && (
                <div style={{ animation:"fadeIn 0.4s ease" }}>
                  <div style={{ textAlign:"center", marginBottom:18 }}>
                    <div style={{ fontSize:54, marginBottom:8 }}>📚</div>
                    <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 6px", color:"#f8fafc" }}>6つの教科で勉強</h2>
                    <p style={{ color:"#94a3b8", fontSize:12, margin:0 }}>得意な教科でペットが進化していくよ</p>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {GENRES.map(g => (
                      <div key={g.id} style={{
                        background:`linear-gradient(135deg, ${g.dark} 0%, rgba(255,255,255,0.02) 100%)`,
                        border:`1px solid ${g.color}44`,
                        borderRadius:12, padding:"12px 10px",
                        display:"flex", alignItems:"center", gap:8,
                      }}>
                        <div style={{ width:30, height:30, borderRadius:8, background:`${g.color}22`, border:`1.5px solid ${g.color}55`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <PixelIcon name={g.id} size={18} color={g.color}/>
                        </div>
                        <div>
                          <div style={{ fontSize:11, fontWeight:800, color:g.color }}>{g.label}</div>
                          <div style={{ fontSize:9, color:"#94a3b8" }}>{GENRE_FORMS[g.id]?.creature}型</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:16, background:"rgba(96,165,250,0.08)", border:"1px solid rgba(96,165,250,0.25)", borderRadius:10, padding:"10px 14px", fontSize:11, color:"#cbd5e1", lineHeight:1.6, textAlign:"center" }}>
                    💡 中1〜高3まで学年別に問題があるよ
                  </div>
                </div>
              )}

              {/* ステップ2: 卵選択 */}
              {step === 2 && (
                <div style={{ animation:"fadeIn 0.4s ease" }}>
                  <div style={{ textAlign:"center", marginBottom:18 }}>
                    <div style={{ fontSize:54, marginBottom:8 }}>🥚</div>
                    <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 6px", color:"#f8fafc" }}>卵を選ぼう</h2>
                    <p style={{ color:"#94a3b8", fontSize:12, margin:0 }}>あなたが育てる相棒になります</p>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    {STARTER_EGGS.map(egg => {
                      const selected = starterEgg?.id === egg.id;
                      return (
                        <button key={egg.id} onClick={() => setStarterEgg(egg)} style={{
                          background: selected ? `${egg.color}22` : "rgba(255,255,255,0.03)",
                          border: `2px solid ${selected ? egg.color : "rgba(255,255,255,0.08)"}`,
                          borderRadius:18, padding:"14px 10px", cursor:"pointer",
                          color:"#f1f5f9", fontFamily:FONT, textAlign:"center",
                          transition:"all 0.2s",
                          transform: selected ? "translateY(-2px)" : "none",
                          boxShadow: selected ? `0 8px 24px ${egg.color}44` : "none",
                        }}>
                          <div style={{ display:"flex", justifyContent:"center", marginBottom:6, animation:selected?"monsterFloat 2s ease-in-out infinite":"none" }}>
                            <PixelSprite pattern={PIXEL_EGG} palette={petPalette("english", egg.color)} size={56} glow={selected?egg.color+"66":null} />
                          </div>
                          <div style={{ fontSize:13, fontWeight:800, marginBottom:2, color: selected ? egg.color : "#f8fafc" }}>{egg.name}</div>
                          <div style={{ fontSize:10, color:"#cbd5e1" }}>{egg.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ステップ3: 名付け */}
              {step === 3 && (
                <div style={{ animation:"fadeIn 0.4s ease", textAlign:"center" }}>
                  <div style={{ fontSize:54, marginBottom:8 }}>{starterEgg?.icon || "🥚"}</div>
                  <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 6px", color:"#f8fafc" }}>名前を決めよう</h2>
                  <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 20px" }}>
                    あなたの<span style={{ color: starterEgg?.color, fontWeight:700 }}>{starterEgg?.name}</span>に名前をつけてあげて
                  </p>
                  <div style={{
                    background:`linear-gradient(135deg, ${starterEgg?.color}22, rgba(0,0,0,0.2))`,
                    border:`2px solid ${starterEgg?.color}55`,
                    borderRadius:18, padding:"24px 20px", marginBottom:14,
                  }}>
                    <div style={{ marginBottom:14, display:"flex", justifyContent:"center" }}>
                      <PixelSprite pattern={PIXEL_EGG} palette={petPalette("english", starterEgg?.color || "#FBBF24")} size={72} glow={(starterEgg?.color || "#FBBF24")+"66"} />
                    </div>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value.slice(0, 12))}
                      placeholder="名前を入力（12文字まで）"
                      autoFocus
                      style={{
                        width:"100%", background:"rgba(0,0,0,0.4)",
                        border:`1px solid ${starterEgg?.color}55`,
                        borderRadius:10, padding:"10px 14px",
                        color:"#fff", fontSize:16, fontWeight:700,
                        fontFamily:FONT, outline:"none", textAlign:"center",
                        boxSizing:"border-box",
                      }}
                    />
                    <div style={{ fontSize:10, color:"#94a3b8", marginTop:6 }}>あとから変更できます</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ position:"sticky", bottom:0, padding:"14px 20px 24px", background:"linear-gradient(180deg, transparent, #0a0f1e 30%, #0a0f1e)" }}>
            <div style={{ maxWidth:440, margin:"0 auto", display:"flex", gap:8 }}>
              {step > 0 && (
                <button onClick={() => setOnboardStep(step - 1)} style={{
                  background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:14, padding:"14px 18px", cursor:"pointer",
                  color:"#cbd5e1", fontSize:13, fontWeight:700, fontFamily:FONT,
                }}>← 戻る</button>
              )}
              <button
                onClick={() => {
                  if (step === 0 || step === 1) setOnboardStep(step + 1);
                  else if (step === 2) {
                    if (starterEgg) setOnboardStep(3);
                  } else if (step === 3) {
                    setScreen(S.HOME);
                    if (!tutorialDone) { setTutorialStep(0); setShowTutorial(true); }
                  }
                }}
                disabled={step === 2 && !starterEgg}
                style={{
                  flex:1,
                  background: (step === 2 && !starterEgg) ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg, ${starterEgg?.color || "#60A5FA"}, ${shade(starterEgg?.color || "#60A5FA", -20)})`,
                  border:"none", borderRadius:14, padding:"14px",
                  cursor: (step === 2 && !starterEgg) ? "not-allowed" : "pointer",
                  color: (step === 2 && !starterEgg) ? "#94a3b8" : "#fff",
                  fontSize:14, fontWeight:800, fontFamily:FONT,
                  boxShadow: (step === 2 && !starterEgg) ? "none" : `0 6px 20px ${starterEgg?.color || "#60A5FA"}55`,
                }}
              >
                {step === 0 ? "始める →"
                 : step === 1 ? "次へ →"
                 : step === 2 ? (starterEgg ? `${starterEgg.name}にする →` : "卵を選んでください")
                 : "冒険を始める！"}
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* ══ HOME ══════════════════════════════════════════ */}
      {screen === S.HOME && (() => {
        const mood = getPetMood(winStreak, lossStreak);
        const wrongCount = answerHistory.filter(h => !h.correct).length;
        return (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"22px 18px 24px", animation:"slideUp 0.4s ease" }}>
          {/* ヘッダー: タイトル＋アクション群（1行に集約） */}
          <div style={{ marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:22, fontWeight:900, letterSpacing:-0.5, color:"#f8fafc", lineHeight:1 }}>STUDYUM</span>
                {/* プレイヤーレベルバッジ */}
                <button onClick={() => setScreen(S.PROFILE)} style={{
                  background: playerLevel >= 1000 ? "linear-gradient(135deg, #FBBF24, #F472B6, #A78BFA)"
                            : playerLevel >= 100 ? "linear-gradient(135deg, #A78BFA, #8B5CF6)"
                            : playerLevel >= 50 ? "linear-gradient(135deg, #60A5FA, #3B82F6)"
                            : playerLevel >= 10 ? "linear-gradient(135deg, #34D399, #10B981)"
                            : "rgba(96,165,250,0.2)",
                  border: playerLevel >= 10 ? "none" : "1px solid rgba(96,165,250,0.4)",
                  color: playerLevel >= 10 ? "#fff" : "#60A5FA",
                  borderRadius:99, padding:"2px 8px",
                  fontSize:10, fontWeight:900, fontFamily:FONT,
                  cursor:"pointer",
                  boxShadow: playerLevel >= 1000 ? "0 0 12px rgba(251,191,36,0.6)" 
                           : playerLevel >= 100 ? "0 0 8px rgba(167,139,250,0.5)"
                           : "none",
                  animation: playerLevel >= 100 ? "pulse 2s ease-in-out infinite" : "none",
                }}>Lv {playerLevel}</button>
                {offlineMode && (
                  <span style={{ fontSize:8, background:"rgba(148,163,184,0.2)", border:"1px solid rgba(148,163,184,0.4)", color:"#94a3b8", borderRadius:99, padding:"1px 6px", fontWeight:800 }}>📵</span>
                )}
              </div>
              <div style={{ fontSize:10, color:"#94a3b8", marginTop:3 }}>
                {(() => {
                  const h = new Date().getHours();
                  if (h < 12) return "おはよう、今日もがんばろう ☀️";
                  if (h < 18) return "こんにちは、休憩がてら一問！☕";
                  return "こんばんは、今日の復習しよう 🌙";
                })()}
              </div>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              {/* コイン残高（アクセント表示） */}
              <button data-sfx="open" onClick={() => setScreen(S.GACHA)} style={{
                background:"linear-gradient(135deg, #FBBF24, #F59E0B)",
                border:"none", borderRadius:11, padding:"7px 11px",
                cursor:"pointer", color:"#7c2d12",
                display:"flex", alignItems:"center", gap:4,
                fontFamily:FONT, boxShadow:"0 4px 12px rgba(251,191,36,0.35)",
                position:"relative",
              }}>
                <span style={{ fontSize:13, lineHeight:1 }}>💰</span>
                <span style={{ fontSize:13, fontWeight:900, lineHeight:1 }}>{coins}</span>
                {coinPop && (
                  <div style={{
                    position:"absolute", top:-22, right:0,
                    fontSize:14, fontWeight:900, color:"#FBBF24",
                    textShadow:"0 0 8px #FBBF24",
                    animation:"coinPopAnim 1.2s ease forwards",
                    pointerEvents:"none",
                  }}>+{coinPop.amount}</div>
                )}
              </button>
              {/* Gem表示 */}
              {gems > 0 && (
                <button data-sfx="open" onClick={() => setScreen(S.GACHA)} style={{
                  background:"linear-gradient(135deg, #A78BFA, #8B5CF6)",
                  border:"none", borderRadius:11, padding:"7px 11px",
                  cursor:"pointer", color:"#fff",
                  display:"flex", alignItems:"center", gap:4,
                  fontFamily:FONT, boxShadow:"0 4px 12px rgba(167,139,250,0.5)",
                }}>
                  <span style={{ fontSize:13, lineHeight:1 }}>💎</span>
                  <span style={{ fontSize:13, fontWeight:900, lineHeight:1 }}>{gems}</span>
                </button>
              )}
              {/* XPブースター表示 */}
              {Date.now() < xpBoosterUntil && (
                <div style={{
                  background:"linear-gradient(135deg, #F472B6, #EC4899)",
                  border:"none", borderRadius:11, padding:"7px 10px",
                  color:"#fff",
                  display:"flex", alignItems:"center", gap:3,
                  fontFamily:FONT, boxShadow:"0 4px 12px rgba(244,114,182,0.5)",
                  animation:"pulse 2s ease-in-out infinite",
                  fontSize:11, fontWeight:900,
                }}>
                  <span>⚡</span>
                  <span>×2</span>
                </div>
              )}
              {/* 検索ボタン */}
              <button onClick={() => setShowHistorySearch(true)} data-sfx="select" style={{
                background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, width:34, height:34,
                cursor:"pointer", color:"#cbd5e1",
                fontSize:14, fontFamily:FONT,
              }}>🔍</button>
              {/* ミュートボタン */}
              <button onClick={toggleMute} data-sfx="none" style={{
                background: isMuted ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${isMuted ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius:10, width:34, height:34,
                cursor:"pointer", color: isMuted ? "#FCA5A5" : "#cbd5e1",
                fontSize:14, fontFamily:FONT,
              }}>{isMuted ? "🔇" : "🔊"}</button>
            </div>
          </div>

          {/* 初心者向け「最初の一歩」ガイド（バトル0回時のみ） */}
          {answerHistory.length === 0 && (
            <div style={{
              background:"linear-gradient(135deg, rgba(167,139,250,0.18), rgba(244,114,182,0.08))",
              border:"1.5px solid rgba(167,139,250,0.4)",
              borderRadius:14, padding:"14px 16px", marginBottom:12,
              position:"relative", overflow:"hidden",
            }}>
              {/* キラキラ装飾 */}
              <div style={{ position:"absolute", top:4, right:8, fontSize:16, opacity:0.4 }}>✨</div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:24 }}>👋</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:"#A78BFA", letterSpacing:2, fontWeight:800, marginBottom:2 }}>はじめまして！</div>
                  <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>
                    {petName || "あなた"}と一緒にスタート🎉
                  </div>
                </div>
              </div>
              <div style={{ fontSize:11, color:"#cbd5e1", lineHeight:1.6, marginBottom:10 }}>
                まずは<strong style={{ color:"#FBBF24" }}>好きな教科</strong>を選んで、<br/>
                <strong style={{ color:"#34D399" }}>1問だけ</strong>挑戦してみよう！
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {GENRES.slice(0, 3).map(g => (
                  <button key={g.id} onClick={() => startBattle(g.id, false, "solo")} style={{
                    flex:1,
                    background: `linear-gradient(135deg, ${g.color}30, ${g.color}10)`,
                    border:`1px solid ${g.color}55`,
                    borderRadius:10, padding:"8px 4px",
                    cursor:"pointer", color: g.color, fontFamily:FONT,
                    fontSize:11, fontWeight:800, textAlign:"center",
                  }}>
                    <div style={{ fontSize:16, marginBottom:2 }}>{g.icon}</div>
                    {g.label}
                  </button>
                ))}
              </div>
              <div style={{ fontSize:9, color:"#94a3b8", marginTop:6, textAlign:"center" }}>
                💡 教科は下のリストからも選べます
              </div>
            </div>
          )}

          {/* イベントクエスト（期間限定） */}
          {(() => {
            const event = getCurrentEvent();
            if (!event) return null;
            // 進捗計算
            let progress = 0;
            if (event.type === "correct") progress = answerHistory.filter(h => h.correct).length;
            else if (event.type === "streak") progress = maxCorrectStreak;
            else if (event.type === "battles") progress = battleHistory.length;
            else if (event.type === "login") progress = loginStreak;
            else if (event.type === "bookmark") progress = bookmarkedQs.length;
            else if (event.type === "all_genres_win") {
              const wonGenres = new Set(battleHistory.filter(b => b.rank === 1).map(b => b.genre));
              progress = wonGenres.size;
            }
            else progress = eventProgress[event.id] || 0;
            const claimed = eventClaimed.includes(event.id);
            const completed = progress >= event.target;
            const pct = Math.min(100, (progress / event.target) * 100);
            return (
              <div style={{
                background: `linear-gradient(135deg, ${event.color}25, ${event.color}08)`,
                border: `1.5px solid ${event.color}66`,
                borderRadius:14, padding:"12px 14px", marginBottom:12,
                position:"relative", overflow:"hidden",
                boxShadow: completed && !claimed ? `0 0 20px ${event.color}55` : "none",
              }}>
                <div style={{
                  position:"absolute", top:-2, right:8,
                  background: event.color, color:"#0f172a",
                  fontSize:8, fontWeight:900, letterSpacing:1,
                  padding:"2px 8px", borderRadius:"0 0 8px 8px",
                }}>EVENT</div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <div style={{ fontSize:32 }}>{event.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:9, color: event.color, letterSpacing:2, fontWeight:800, marginBottom:2 }}>
                      🎯 期間限定チャレンジ
                    </div>
                    <div style={{ fontSize:13, fontWeight:800, color:"#fff", marginBottom:2 }}>
                      {event.title}
                    </div>
                    <div style={{ fontSize:10, color:"#cbd5e1" }}>
                      {event.desc}
                    </div>
                  </div>
                </div>
                {/* プログレスバー */}
                <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:8, overflow:"hidden", marginBottom:6 }}>
                  <div style={{
                    width:`${pct}%`, height:"100%",
                    background:`linear-gradient(90deg, ${event.color}, ${shade(event.color, -25)})`,
                    transition:"width 0.5s",
                    boxShadow:`0 0 8px ${event.color}`,
                  }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:10 }}>
                  <span style={{ color:"#94a3b8" }}>進捗: <span style={{ color:"#fff", fontWeight:800 }}>{progress}/{event.target}</span></span>
                  <span style={{ color: event.color, fontWeight:800 }}>{Math.round(pct)}%</span>
                </div>
                {completed && !claimed && (
                  <button onClick={() => {
                    setEventClaimed(prev => [...prev, event.id]);
                    addCoins(event.reward);
                    SFX.levelUp();
                    setTimeout(() => alert(`🎉 報酬獲得！\n+${event.reward}💰 がもらえました`), 100);
                  }} style={{
                    width:"100%", marginTop:8,
                    background:`linear-gradient(135deg, ${event.color}, ${shade(event.color, -25)})`,
                    border:"none", borderRadius:10, padding:"8px",
                    cursor:"pointer", color:"#0f172a", fontSize:12, fontWeight:900, fontFamily:FONT,
                    boxShadow:`0 4px 12px ${event.color}55`,
                    animation:"pulse 1.5s ease-in-out infinite",
                  }}>🎁 報酬を受け取る ({event.reward}💰)</button>
                )}
                {claimed && (
                  <div style={{
                    marginTop:6, fontSize:10, color:"#34D399", fontWeight:800, textAlign:"center",
                    background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)",
                    borderRadius:8, padding:"5px",
                  }}>✓ 報酬受け取り済み</div>
                )}
              </div>
            );
          })()}

          {/* 季節イベントバナー */}
          {(() => {
            const season = getCurrentSeason();
            if (!season) return null;
            return (
              <div style={{
                background: `linear-gradient(135deg, ${season.color}25, ${season.color}08)`,
                border:`1.5px solid ${season.color}55`,
                borderRadius:14, padding:"10px 14px", marginBottom:12,
                position:"relative", overflow:"hidden",
                display:"flex", alignItems:"center", gap:12,
              }}>
                {/* 装飾粒子 */}
                <div style={{ position:"absolute", top:4, right:8, fontSize:16, opacity:0.4 }}>{season.particle}</div>
                <div style={{ position:"absolute", bottom:4, left:8, fontSize:14, opacity:0.3 }}>{season.particle}</div>
                <div style={{ fontSize:28 }}>{season.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:9, color:season.color, letterSpacing:2, fontWeight:800, marginBottom:2 }}>
                    🎉 SEASONAL EVENT
                  </div>
                  <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{season.label}</div>
                  <div style={{ fontSize:10, color:"#cbd5e1" }}>
                    全コイン獲得 <span style={{ color: season.color, fontWeight:900 }}>×{season.coinBonus}</span> 期間中！
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 無料ガチャ通知 */}
          {(() => {
            const today = new Date().toISOString().slice(0,10);
            if (freeGachaDate === today) return null;
            return (
              <button onClick={() => setScreen(S.GACHA)} style={{
                width:"100%",
                background:"linear-gradient(135deg, rgba(52,211,153,0.2), rgba(96,165,250,0.08))",
                border:"1.5px solid rgba(52,211,153,0.5)",
                borderRadius:14, padding:"10px 14px", marginBottom:12,
                cursor:"pointer", fontFamily:FONT, textAlign:"left",
                display:"flex", alignItems:"center", gap:10, position:"relative",
              }}>
                <div style={{
                  position:"absolute", top:-6, right:8,
                  background:"#EF4444", color:"#fff",
                  fontSize:8, fontWeight:900,
                  padding:"2px 8px", borderRadius:99,
                  animation:"pulse 1.5s ease-in-out infinite",
                }}>NEW</div>
                <div style={{ fontSize:24 }}>🎁</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:"#34D399" }}>無料ガチャ券</div>
                  <div style={{ fontSize:10, color:"#94a3b8" }}>今日まだ使ってないよ！</div>
                </div>
                <div style={{ fontSize:11, color:"#34D399", fontWeight:800 }}>引く →</div>
              </button>
            );
          })()}

          {/* ペットの気分カード＋空腹度＋餌やり */}
          <div style={{
            background: `linear-gradient(135deg, ${mood.aura}20, ${mood.aura}08)`,
            border: `1px solid ${mood.aura}50`,
            borderRadius:14, padding:"10px 14px",
            marginBottom:12,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <div style={{ fontSize:24 }}>{mood.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:2, fontWeight:700 }}>あなたのペット</div>
                <div style={{ fontSize:13, fontWeight:800, color: mood.aura }}>
                  {petName || "YOU"} は{mood.label}！
                </div>
              </div>
              <PetDisplay
                genreXp={genreXp} size={32} starterEgg={starterEgg}
                hat={equippedHat ? SHOP_ITEMS.find(i=>i.id===equippedHat)?.icon : null}
                aura={equippedAura ? SHOP_ITEMS.find(i=>i.id===equippedAura)?.icon : null}
              />
            </div>
            {/* 空腹度＋餌やりボタン */}
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:9, color:"#94a3b8", fontWeight:700 }}>
                    {petHunger >= 80 ? "🍖 満腹" : petHunger >= 40 ? "😋 普通" : petHunger >= 15 ? "🤤 お腹空いた" : "😢 ペコペコ"}
                  </span>
                  <span style={{ fontSize:9, color: petHunger >= 50 ? "#34D399" : petHunger >= 20 ? "#FBBF24" : "#EF4444", fontWeight:800 }}>{petHunger}/100</span>
                </div>
                <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:6, overflow:"hidden" }}>
                  <div style={{
                    width:`${petHunger}%`, height:"100%",
                    background: petHunger >= 50 ? "linear-gradient(90deg, #34D399, #10B981)"
                              : petHunger >= 20 ? "linear-gradient(90deg, #FBBF24, #F59E0B)"
                              :                    "linear-gradient(90deg, #EF4444, #DC2626)",
                    transition:"width 0.3s",
                  }}/>
                </div>
                {petHunger >= 80 && (
                  <div style={{ fontSize:8, color:"#34D399", fontWeight:700, marginTop:2 }}>
                    ✨ XPボーナス +10%
                  </div>
                )}
              </div>
              <button onClick={() => {
                const today = new Date().toISOString().slice(0,10);
                const cnt = petFedToday[today] || 0;
                if (petHunger >= 100) return;
                if (cnt >= 10) return;
                if (coins < 10) return;
                feedPet();
              }} disabled={petHunger >= 100 || (petFedToday[new Date().toISOString().slice(0,10)] || 0) >= 10 || coins < 10} style={{
                background: petHunger >= 100 ? "rgba(255,255,255,0.05)" 
                          : coins < 10 ? "rgba(255,255,255,0.05)"
                          : "linear-gradient(135deg, #34D399, #10B981)",
                border:"none", borderRadius:10, padding:"8px 12px",
                cursor: (petHunger >= 100 || coins < 10) ? "not-allowed" : "pointer",
                color: (petHunger >= 100 || coins < 10) ? "#64748b" : "#0f172a",
                fontSize:11, fontWeight:900, fontFamily:FONT,
                display:"flex", flexDirection:"column", alignItems:"center", gap:1,
                minWidth:60,
              }}>
                <span style={{ fontSize:14 }}>🍖</span>
                <span style={{ fontSize:8 }}>10💰</span>
              </button>
            </div>
          </div>

          {/* 今日の学習記録 */}
          {(() => {
            const today = new Date().toISOString().slice(0,10);
            const todayMin = studyTimeByDate[today] || 0;
            const hasData = dailyStats.correct > 0 || dailyStats.wins > 0 || todayMin > 0;
            if (!hasData) return null;
            // 累計分→時間表示
            const hours = Math.floor(todayMin / 60);
            const mins = todayMin % 60;
            const timeStr = hours > 0 ? `${hours}h${mins}` : `${mins}`;
            return (
              <div style={{
                background:"linear-gradient(135deg, rgba(96,165,250,0.1), rgba(52,211,153,0.06))",
                border:"1px solid rgba(96,165,250,0.2)",
                borderRadius:14, padding:"12px 16px", marginBottom:12,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:16 }}>📖</span>
                  <span style={{ fontSize:11, color:"#60A5FA", fontWeight:800, letterSpacing:2 }}>今日の学習</span>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ flex:1, textAlign:"center", background:"rgba(0,0,0,0.15)", borderRadius:8, padding:"6px 4px" }}>
                    <div style={{ fontSize:20, fontWeight:900, color:"#34D399", lineHeight:1 }}>{dailyStats.correct}</div>
                    <div style={{ fontSize:8, color:"#94a3b8", fontWeight:700, marginTop:3 }}>正解</div>
                  </div>
                  <div style={{ flex:1, textAlign:"center", background:"rgba(0,0,0,0.15)", borderRadius:8, padding:"6px 4px" }}>
                    <div style={{ fontSize:20, fontWeight:900, color:"#60A5FA", lineHeight:1 }}>{dailyStats.battles}</div>
                    <div style={{ fontSize:8, color:"#94a3b8", fontWeight:700, marginTop:3 }}>挑戦</div>
                  </div>
                  <div style={{ flex:1, textAlign:"center", background:"rgba(0,0,0,0.15)", borderRadius:8, padding:"6px 4px" }}>
                    <div style={{ fontSize:20, fontWeight:900, color:"#F472B6", lineHeight:1 }}>{timeStr}<span style={{ fontSize:9, color:"#94a3b8" }}>{hours > 0 ? "分" : "分"}</span></div>
                    <div style={{ fontSize:8, color:"#94a3b8", fontWeight:700, marginTop:3 }}>勉強時間</div>
                  </div>
                  {loginStreak > 1 && (
                    <div style={{ flex:1, textAlign:"center", background:"rgba(0,0,0,0.15)", borderRadius:8, padding:"6px 4px" }}>
                      <div style={{ fontSize:20, fontWeight:900, color:"#FBBF24", lineHeight:1 }}>{loginStreak}<span style={{ fontSize:9, color:"#94a3b8" }}>日</span></div>
                      <div style={{ fontSize:8, color:"#94a3b8", fontWeight:700, marginTop:3 }}>連続</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 復習ボタン＋忘却曲線通知 */}
          {(() => {
            const reviewQueue = getReviewQueue(answerHistory);
            const dueNow = reviewQueue.filter(r => r.due);
            const dueDay1 = dueNow.filter(r => r.label === "1日後").length;
            const dueDay3 = dueNow.filter(r => r.label === "3日後").length;
            const dueDay7 = dueNow.filter(r => r.label === "7日後").length;
            const totalDue = dueNow.length;
            if (wrongCount === 0) return null;
            return (
              <>
                {/* 忘却曲線アラート（復習タイミング） */}
                {totalDue > 0 && (
                  <div style={{
                    background:"linear-gradient(135deg, rgba(251,191,36,0.18), rgba(244,114,182,0.08))",
                    border:"1.5px solid rgba(251,191,36,0.5)",
                    borderRadius:14, padding:"12px 14px", marginBottom:10,
                    animation:"popIn 0.4s ease",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:18 }}>🔔</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:10, color:"#FBBF24", letterSpacing:2, fontWeight:800 }}>復習タイミング！</div>
                        <div style={{ fontSize:11, color:"#cbd5e1" }}>{totalDue}問が記憶定着の好機です</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6, fontSize:9 }}>
                      {dueDay1 > 0 && (
                        <div style={{ flex:1, background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:6, padding:"4px 6px", textAlign:"center" }}>
                          <div style={{ color:"#FCA5A5", fontWeight:800 }}>1日後</div>
                          <div style={{ color:"#fff", fontSize:13, fontWeight:900 }}>{dueDay1}問</div>
                        </div>
                      )}
                      {dueDay3 > 0 && (
                        <div style={{ flex:1, background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.4)", borderRadius:6, padding:"4px 6px", textAlign:"center" }}>
                          <div style={{ color:"#FBBF24", fontWeight:800 }}>3日後</div>
                          <div style={{ color:"#fff", fontSize:13, fontWeight:900 }}>{dueDay3}問</div>
                        </div>
                      )}
                      {dueDay7 > 0 && (
                        <div style={{ flex:1, background:"rgba(167,139,250,0.15)", border:"1px solid rgba(167,139,250,0.4)", borderRadius:6, padding:"4px 6px", textAlign:"center" }}>
                          <div style={{ color:"#A78BFA", fontWeight:800 }}>7日後</div>
                          <div style={{ color:"#fff", fontSize:13, fontWeight:900 }}>{dueDay7}問</div>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize:8, color:"#94a3b8", marginTop:6, textAlign:"center", lineHeight:1.5 }}>
                      💡 エビングハウスの忘却曲線に基づき記憶定着の最適タイミングを通知
                    </div>
                  </div>
                )}

                {/* 通常の復習ボタン */}
                <button onClick={startReview} style={{
                  width:"100%",
                  background:"linear-gradient(135deg, rgba(244,114,182,0.18), rgba(167,139,250,0.08))",
                  border:"1px solid rgba(244,114,182,0.4)",
                  borderRadius:14, padding:"12px 14px", marginBottom:14,
                  cursor:"pointer", color:"#f8fafc", textAlign:"left", fontFamily:FONT,
                  display:"flex", alignItems:"center", gap:12,
                }}>
                  <div style={{ fontSize:24 }}>📝</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:800 }}>復習モード</div>
                    <div style={{ fontSize:10, color:"#94a3b8" }}>{wrongCount}問の間違いを復習しよう</div>
                  </div>
                  <div style={{ fontSize:11, color:"#F472B6", fontWeight:700, background:"rgba(244,114,182,0.15)", borderRadius:99, padding:"3px 10px" }}>+8💰/正解</div>
                </button>
              </>
            );
          })()}

          {/* デイリーチャレンジ */}
          {dailyChallenge && (
            <div style={{
              background:`linear-gradient(135deg, ${dailyChallenge.genreColor}20, rgba(251,191,36,0.06))`,
              border:`1px solid ${dailyChallenge.genreColor}50`,
              borderRadius:16, padding:"14px 16px", marginBottom:14,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ fontSize:24 }}>🎯</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:"#FBBF24", letterSpacing:2, fontWeight:800 }}>デイリーチャレンジ</div>
                  <div style={{ fontSize:13, fontWeight:800, color:"#f8fafc" }}>
                    {dailyChallenge.genreIcon} {dailyChallenge.genreLabel}・{dailyChallenge.topicLabel}で{dailyChallenge.target}問正解
                  </div>
                </div>
                <div style={{ fontSize:11, color:"#FBBF24", fontWeight:800, background:"rgba(251,191,36,0.15)", borderRadius:99, padding:"3px 10px" }}>+{dailyChallenge.reward}💰</div>
              </div>
              {/* 進捗バー */}
              <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:8, overflow:"hidden", marginBottom:8 }}>
                <div style={{ width:`${Math.min(100, (dailyChallenge.progress / dailyChallenge.target) * 100)}%`, height:"100%", background:`linear-gradient(90deg, ${dailyChallenge.genreColor}, #FBBF24)`, transition:"width 0.4s", borderRadius:99 }}/>
              </div>
              {dailyChallenge.done && !dailyChallenge.claimed ? (
                <button onClick={() => {
                  setCoins(c => c + dailyChallenge.reward);
                  setDailyChallenge(prev => ({ ...prev, claimed: true }));
                  SFX.claim();
                }} style={{
                  width:"100%", background:"linear-gradient(135deg, #FBBF24, #F59E0B)", border:"none",
                  borderRadius:10, padding:"8px", cursor:"pointer", color:"#7c2d12", fontSize:12, fontWeight:800, fontFamily:FONT,
                }}>🎁 報酬を受け取る (+{dailyChallenge.reward}💰)</button>
              ) : dailyChallenge.claimed ? (
                <div style={{ textAlign:"center", fontSize:11, color:"#34D399", fontWeight:700 }}>✓ 達成済み！また明日</div>
              ) : (
                <div style={{ textAlign:"center", fontSize:11, color:"#94a3b8" }}>{dailyChallenge.progress} / {dailyChallenge.target} 問</div>
              )}
            </div>
          )}

          {/* ペット */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"16px 18px", marginBottom:24, display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ minWidth:70, display:"flex", justifyContent:"center" }}>
              <PetDisplay genreXp={genreXp} size={54} starterEgg={starterEgg} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                <span style={{ fontSize:14, fontWeight:700 }}>{getPetTitle(genreXp)}</span>
                <span style={{ background:"rgba(192,132,252,0.2)", border:"1px solid rgba(192,132,252,0.3)", borderRadius:99, padding:"2px 10px", fontSize:11, fontWeight:600, color:"#c084fc" }}>Lv.{getStage(getTotalXp(genreXp))}</span>
              </div>
              <HPBar hp={getTotalXp(genreXp)} maxHp={getNextStageXp(getTotalXp(genreXp))} color="#a78bfa" />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:5, fontSize:11, color:"#64748b" }}>
                <span>{getTotalXp(genreXp)} XP</span><span>あと {Math.max(0, getNextStageXp(getTotalXp(genreXp)) - getTotalXp(genreXp))} で進化</span>
              </div>
            </div>
          </div>

          {/* デイリーミッション */}
          <div style={{ background:"linear-gradient(135deg, rgba(251,191,36,0.08), rgba(244,114,182,0.05))", border:"1px solid rgba(251,191,36,0.25)", borderRadius:20, padding:"16px 18px", marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <PixelIcon name="calendar" size={20} color="#FBBF24"/>
                <span style={{ fontSize:13, fontWeight:800, color:"#FBBF24" }}>デイリーミッション</span>
              </div>
              <span style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>{claimedMissions.filter(id => todaysMissions.some(m => m.id===id)).length}/{todaysMissions.length} 達成</span>
            </div>
            {todaysMissions.map((m, i) => {
              const prog = missionProgress[m.track] || 0;
              const done = prog >= m.target;
              const claimed = claimedMissions.includes(m.id);
              const pct = Math.min((prog / m.target) * 100, 100);
              return (
                <div key={m.id} style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"10px 0", borderBottom: i < todaysMissions.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  opacity: claimed ? 0.5 : 1,
                }}>
                  <div style={{
                    width:34, height:34, borderRadius:8,
                    background: claimed ? "rgba(74,222,128,0.15)" : done ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.05)",
                    border:`2px solid ${claimed?"rgba(74,222,128,0.4)":done?"rgba(251,191,36,0.4)":"rgba(255,255,255,0.1)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                  }}>
                    {claimed
                      ? <PixelIcon name="check" size={18} color="#4ade80"/>
                      : <PixelIcon name={m.iconName} size={18} color={done?"#FBBF24":"#94a3b8"}/>
                    }
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:3 }}>
                      <span style={{ fontSize:12, fontWeight:700, color: claimed ? "#94a3b8" : "#e2e8f0", textDecoration: claimed ? "line-through" : "none" }}>{m.title}</span>
                      <span style={{ fontSize:10, fontWeight:700, color: done ? "#FBBF24" : "#64748b", fontFamily:"monospace" }}>{prog}/{m.target}</span>
                    </div>
                    <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:99, height:4, overflow:"hidden" }}>
                      <div style={{ width:`${pct}%`, height:"100%", borderRadius:99, background: claimed ? "#4ade80" : done ? "linear-gradient(90deg,#FBBF24,#F472B6)" : "#60A5FA", transition:"width 0.5s" }}/>
                    </div>
                  </div>
                  {done && !claimed ? (
                    <button onClick={() => claimMission(m)} style={{
                      background:"linear-gradient(135deg, #FBBF24, #F472B6)",
                      border:"none", borderRadius:10, padding:"6px 12px",
                      cursor:"pointer", color:"#0f172a", fontSize:11, fontWeight:800,
                      fontFamily:FONT, boxShadow:"0 2px 8px rgba(251,191,36,0.4)",
                      animation:"pulse 1.5s ease-in-out infinite",
                    }}>+{m.reward}XP</button>
                  ) : (
                    <div style={{ fontSize:11, fontWeight:700, color: claimed ? "#4ade80" : "#475569", minWidth:50, textAlign:"right" }}>
                      {claimed ? "受取済" : `+${m.reward}XP`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ランクマッチ（オフライン時は無効） */}
          <button onClick={() => !offlineMode && setScreen(S.RANKED)} disabled={offlineMode} style={{
            width:"100%",
            background: offlineMode ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)",
            border: offlineMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(251,191,36,0.4)",
            borderRadius:18, padding:"16px 18px", marginBottom:14,
            cursor: offlineMode ? "not-allowed" : "pointer",
            opacity: offlineMode ? 0.5 : 1,
            color:"#f8fafc", textAlign:"left",
            display:"flex", alignItems:"center", gap:16, fontFamily:FONT,
            boxShadow: offlineMode ? "none" : "0 4px 20px rgba(251,191,36,0.15)",
          }}>
            <div style={{ width:48, height:48, borderRadius:8, background: offlineMode ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #FBBF24, #F472B6)", border:"2px solid rgba(251,191,36,0.5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <PixelIcon name="crown" size={28} color={offlineMode ? "#64748b" : "#0f172a"}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                <span style={{ fontSize:16, fontWeight:800 }}>ランクマッチ</span>
                {offlineMode ? (
                  <span style={{ fontSize:9, background:"#64748b", color:"#fff", borderRadius:99, padding:"1px 7px", fontWeight:700, letterSpacing:1 }}>OFFLINE</span>
                ) : (
                  <span style={{ fontSize:9, background:"#ef4444", color:"#fff", borderRadius:99, padding:"1px 7px", fontWeight:700, letterSpacing:1 }}>🌐 LIVE</span>
                )}
              </div>
              <div style={{ fontSize:11, color:"#cbd5e1" }}>
                {offlineMode ? "オフラインでは利用できません" : <>世界のプレイヤーと4人対戦・<span style={{ color:getRank(userRating).color, fontWeight:700 }}>{getRank(userRating).icon} {getRank(userRating).name}</span> · {userRating}</>}
              </div>
            </div>
            <div style={{ fontSize:18, color: offlineMode ? "#64748b" : "#FBBF24" }}>{offlineMode ? "🔒" : "›"}</div>
          </button>

          {/* 日替わりワールドボス */}
          {(() => {
            const boss = getCurrentBoss();
            const todayKey = getTodayKey();
            const alreadyDone = bossDailyChallenged[todayKey] === boss.id;
            // 簡易的に「世界の進捗」を表示
            const seed = Math.floor(Date.now() / 1000 / 60 / 10);
            const worldProgress = 0.3 + ((seed * 1234567) % 100000) / 200000;
            const worldHp = Math.floor(boss.hp * (1 - worldProgress));
            const playerCount = 1200 + ((seed * 7) % 800);
            // 次のリセット時刻（明日の0時）
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const msUntilReset = tomorrow - now;
            const hUntilReset = Math.floor(msUntilReset / (1000 * 60 * 60));
            const mUntilReset = Math.floor((msUntilReset % (1000 * 60 * 60)) / (1000 * 60));
            const isWeekend = [0, 6].includes(now.getDay());
            return (
              <button onClick={() => { if (!alreadyDone) startBoss(); }} disabled={alreadyDone} style={{
                width:"100%",
                background: alreadyDone 
                  ? "rgba(255,255,255,0.03)" 
                  : `linear-gradient(135deg, ${boss.color}30 0%, ${boss.color}10 100%)`,
                border: alreadyDone ? "1px solid rgba(255,255,255,0.06)" : `1.5px solid ${boss.color}`,
                borderRadius:18, padding:"14px 16px", marginBottom:14,
                cursor: alreadyDone ? "not-allowed" : "pointer",
                opacity: alreadyDone ? 0.6 : 1,
                color:"#f8fafc", textAlign:"left",
                display:"flex", alignItems:"center", gap:12, fontFamily:FONT,
                boxShadow: alreadyDone ? "none" : `0 4px 20px ${boss.color}33`,
                position:"relative", overflow:"hidden",
              }}>
                {!alreadyDone && (
                  <div style={{
                    position:"absolute", top:-2, right:8,
                    background: isWeekend ? "linear-gradient(135deg, #FBBF24, #F472B6)" : "#EF4444",
                    color:"#fff",
                    fontSize:8, fontWeight:900,
                    padding:"2px 8px", borderRadius:"0 0 8px 8px", letterSpacing:1,
                    display:"flex", alignItems:"center", gap:3,
                  }}>
                    <span style={{ display:"inline-block", width:4, height:4, borderRadius:"50%", background:"#fff", animation:"pulse 1.5s ease-in-out infinite" }}/>
                    {isWeekend ? "✨ 週末SP" : "TODAY"}
                  </div>
                )}
                {alreadyDone && (
                  <div style={{
                    position:"absolute", top:-2, right:8,
                    background:"#34D399", color:"#0f172a",
                    fontSize:8, fontWeight:900, padding:"2px 8px", borderRadius:"0 0 8px 8px", letterSpacing:1,
                  }}>✓ 完了</div>
                )}
                <div style={{ fontSize:44, filter: alreadyDone ? "grayscale(1)" : "none", animation: alreadyDone ? "none" : "monsterFloat 2.5s ease-in-out infinite" }}>{boss.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                    <span style={{ fontSize:9, color: alreadyDone ? "#94a3b8" : boss.color, letterSpacing:2, fontWeight:800 }}>
                      🌐 今日のワールドボス · {playerCount}人挑戦中
                    </span>
                  </div>
                  <div style={{ fontSize:15, fontWeight:800, color: alreadyDone ? "#94a3b8" : "#fff" }}>{boss.name}</div>
                  {alreadyDone ? (
                    <div style={{ fontSize:10, color:"#cbd5e1", marginTop:2 }}>
                      明日も挑戦できます ⏰ <span style={{ color:"#FBBF24", fontWeight:700 }}>あと{hUntilReset}h{mUntilReset}m</span>でリセット
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize:10, color:"#cbd5e1", marginBottom:6 }}>{boss.desc}</div>
                      {/* 報酬ハイライト */}
                      <div style={{
                        background:"rgba(0,0,0,0.3)",
                        border:`1px solid ${boss.color}55`,
                        borderRadius:8, padding:"4px 8px", marginBottom:4,
                        display:"flex", alignItems:"center", gap:6,
                      }}>
                        <span style={{ fontSize:9, color:"#FBBF24", fontWeight:800 }}>🎁 報酬:</span>
                        <span style={{ fontSize:9, color:"#FBBF24", fontWeight:800 }}>+{boss.reward}💰</span>
                        <span style={{ fontSize:9, color:"#34D399", fontWeight:800 }}>🎁×{boss.gachaTickets}</span>
                        {boss.weakness && (
                          <span style={{ fontSize:9, color:GENRES.find(g=>g.id===boss.weakness)?.color, fontWeight:700 }}>
                            +{GENRES.find(g=>g.id===boss.weakness)?.label}XP
                          </span>
                        )}
                      </div>
                      {/* 世界全体のHP残量バー */}
                      <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:99, height:5, overflow:"hidden", marginBottom:4 }}>
                        <div style={{ width:`${(worldHp/boss.hp)*100}%`, height:"100%", background:`linear-gradient(90deg, ${boss.color}, ${shade(boss.color, -25)})`, transition:"width 0.5s", boxShadow:`0 0 8px ${boss.color}` }}/>
                      </div>
                      <div style={{ display:"flex", gap:6, alignItems:"center", fontSize:9 }}>
                        <span style={{ color:"#FCA5A5", fontWeight:800 }}>残HP {worldHp.toLocaleString()}/{boss.hp.toLocaleString()}</span>
                        {boss.weakness && (
                          <span style={{ background:`${GENRES.find(g=>g.id===boss.weakness)?.color}33`, color:GENRES.find(g=>g.id===boss.weakness)?.color, padding:"1px 6px", borderRadius:6, fontWeight:700 }}>
                            弱点 {GENRES.find(g=>g.id===boss.weakness)?.icon}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {!alreadyDone && <div style={{ fontSize:18, color: boss.color }}>›</div>}
              </button>
            );
          })()}

          {/* ジャンル */}
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:11, color:"#94a3b8", letterSpacing:3, fontWeight:700 }}>ソロバトル</span>
                <span style={{ fontSize:9, color:"#A78BFA", fontWeight:800, background:"rgba(167,139,250,0.15)", border:"1px solid rgba(167,139,250,0.3)", padding:"2px 7px", borderRadius:99 }}>🤖 AI対戦</span>
              </div>
              <div style={{ fontSize:10, color:"#a78bfa", fontWeight:700 }}>学年×分野で選択</div>
            </div>

            {/* 学年タブ（常時表示） */}
            <div style={{ display:"flex", gap:5, marginBottom:10, overflowX:"auto", paddingBottom:2 }}>
              {GRADES.map(gr => {
                const active = selectedGrade === gr.id;
                return (
                  <button key={gr.id} onClick={() => setSelectedGrade(gr.id)} style={{
                    flex:"1 0 auto",
                    background: active ? `${gr.color}33` : "rgba(255,255,255,0.04)",
                    border: active ? `1.5px solid ${gr.color}` : "1px solid rgba(255,255,255,0.08)",
                    borderRadius:9, padding:"7px 10px", cursor:"pointer",
                    color: active ? gr.color : "#cbd5e1",
                    fontSize:12, fontWeight:800, fontFamily:FONT, whiteSpace:"nowrap",
                    transition:"all 0.15s",
                  }}>{gr.label}</button>
                );
              })}
            </div>

            {/* 問題数選択 */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, padding:"6px 10px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
              <span style={{ fontSize:10, color:"#94a3b8", fontWeight:700, letterSpacing:1 }}>問題数</span>
              <div style={{ display:"flex", gap:4, flex:1 }}>
                {[
                  { n:4,  label:"4問", desc:"サクッと" },
                  { n:10, label:"10問", desc:"しっかり" },
                  { n:20, label:"20問", desc:"じっくり" },
                ].map(opt => {
                  const active = questionCount === opt.n;
                  return (
                    <button key={opt.n} onClick={() => setQuestionCount(opt.n)} style={{
                      flex:1,
                      background: active ? "rgba(96,165,250,0.25)" : "rgba(255,255,255,0.04)",
                      border: active ? "1.5px solid #60A5FA" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius:8, padding:"5px 6px", cursor:"pointer",
                      color: active ? "#60A5FA" : "#cbd5e1",
                      fontSize:11, fontWeight:800, fontFamily:FONT,
                    }}>{opt.label}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {GENRES.map(g => {
                const topics = SUBTOPICS[g.id] || [];
                const selectedTopic = selectedTopics[g.id] || topics[0]?.id;
                return (
                  <div key={g.id} style={{
                    background:`linear-gradient(135deg, ${g.dark} 0%, rgba(255,255,255,0.02) 100%)`,
                    border:`1px solid ${g.color}44`,
                    borderRadius:18, padding:"14px 12px",
                    color:"#f1f5f9", fontFamily:FONT,
                    display:"flex", flexDirection:"column",
                  }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:8 }}>
                      <div style={{ width:42, height:42, borderRadius:8, background:`${g.color}22`, border:`2px solid ${g.color}55`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:5 }}>
                        <PixelIcon name={g.id} size={24} color={g.color}/>
                      </div>
                      <div style={{ fontSize:13, fontWeight:800, color:"#f8fafc" }}>{g.label}</div>
                      <div style={{ fontSize:9, color:"#94a3b8", marginTop:2 }}>{GRADES.find(gr => gr.id === selectedGrade)?.label}</div>
                    </div>
                    {/* 分野ボタン */}
                    <div style={{ display:"flex", flexDirection:"column", gap:3, marginBottom:8, flex:1 }}>
                      {topics.map(t => {
                        const active = selectedTopic === t.id;
                        // この学年×分野の問題があるかチェック（メイン or EXTRA or EXTRA2）
                        const hasGradeTopic = GRADE_TOPIC_QUESTIONS[g.id]?.[selectedGrade]?.[t.id] || GRADE_TOPIC_EXTRA[g.id]?.[selectedGrade]?.[t.id] || GRADE_TOPIC_EXTRA2[g.id]?.[selectedGrade]?.[t.id];
                        return (
                          <button key={t.id} onClick={() => setSelectedTopics(prev => ({ ...prev, [g.id]: t.id }))} style={{
                            background: active ? `${g.color}33` : "rgba(255,255,255,0.03)",
                            border: active ? `1.5px solid ${g.color}` : "1px solid rgba(255,255,255,0.06)",
                            borderRadius:7, padding:"5px 6px",
                            cursor:"pointer", color: active ? g.color : "#cbd5e1",
                            fontSize:10, fontWeight: active ? 800 : 600, fontFamily:FONT,
                            display:"flex", alignItems:"center", gap:5,
                            transition:"all 0.15s",
                            position:"relative",
                          }}>
                            <span style={{ fontSize:11 }}>{t.icon}</span>
                            <span style={{ flex:1, textAlign:"left" }}>{t.label}</span>
                            {hasGradeTopic && <span style={{ fontSize:8, color:"#34D399" }}>●</span>}
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={() => startBattle(g.id, false, "solo", selectedTopic, selectedGrade)} style={{
                      width:"100%",
                      background:`linear-gradient(135deg, ${g.color}, ${shade(g.color, -20)})`,
                      border:"none", borderRadius:10, padding:"8px",
                      cursor:"pointer", color:"#fff",
                      fontSize:11, fontWeight:800, fontFamily:FONT,
                      boxShadow:`0 4px 12px ${g.color}55`,
                      marginTop:"auto",
                    }}>▶ スタート</button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 写真・ファイルから問題を作る（オフライン時は無効） */}
          <button onClick={() => { if (offlineMode) return; resetPhoto(); setScreen(S.PHOTO); }} disabled={offlineMode} style={{
            width:"100%",
            background: offlineMode ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, rgba(244,114,182,0.15), rgba(251,191,36,0.1))",
            border: offlineMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(244,114,182,0.4)",
            borderRadius:18, padding:"16px 18px", marginBottom:10,
            cursor: offlineMode ? "not-allowed" : "pointer",
            opacity: offlineMode ? 0.5 : 1,
            color:"#f8fafc", textAlign:"left",
            display:"flex", alignItems:"center", gap:16, fontFamily:FONT,
          }}>
            <div style={{ width:46, height:46, borderRadius:8, background: offlineMode ? "rgba(255,255,255,0.05)" : "rgba(244,114,182,0.2)", border:"2px solid rgba(244,114,182,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <PixelIcon name="camera" size={26} color={offlineMode ? "#64748b" : "#F472B6"}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:3 }}>画像・PDFから出題</div>
              <div style={{ fontSize:12, color:"#cbd5e1" }}>
                {offlineMode ? "オフラインでは利用できません" : "教科書を撮影 or ファイル選択"}
              </div>
            </div>
            {offlineMode ? (
              <div style={{ fontSize:11, color:"#64748b", fontWeight:700, background:"rgba(100,116,139,0.15)", borderRadius:99, padding:"4px 12px" }}>🔒 OFFLINE</div>
            ) : (
              <div style={{ fontSize:11, color:"#F472B6", fontWeight:700, background:"rgba(244,114,182,0.12)", border:"1px solid rgba(244,114,182,0.3)", borderRadius:99, padding:"4px 12px" }}>AI ✨</div>
            )}
          </button>

          {/* エンドレス＆タイムアタック＆暗記カード（3列） */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:10 }}>
            <button onClick={() => setScreen(S.ENDLESS_SELECT)} style={{
              background:"linear-gradient(135deg, rgba(96,165,250,0.15), rgba(167,139,250,0.1))",
              border:"1px solid rgba(96,165,250,0.4)",
              borderRadius:14, padding:"12px 8px",
              cursor:"pointer", color:"#f8fafc", textAlign:"center", fontFamily:FONT,
            }}>
              <div style={{ width:34, height:34, borderRadius:8, background:"rgba(96,165,250,0.2)", border:"2px solid rgba(96,165,250,0.4)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 6px" }}>
                <PixelIcon name="fire" size={18} color="#60A5FA"/>
              </div>
              <div style={{ fontSize:11, fontWeight:800, marginBottom:1 }}>エンドレス</div>
              <div style={{ fontSize:8, color:"#94a3b8" }}>連続正解</div>
            </button>
            <button onClick={() => setScreen(S.TIMEATTACK_SELECT)} style={{
              background:"linear-gradient(135deg, rgba(239,68,68,0.18), rgba(251,191,36,0.1))",
              border:"1px solid rgba(239,68,68,0.4)",
              borderRadius:14, padding:"12px 8px",
              cursor:"pointer", color:"#f8fafc", textAlign:"center", fontFamily:FONT,
            }}>
              <div style={{ width:34, height:34, borderRadius:8, background:"rgba(239,68,68,0.25)", border:"2px solid rgba(239,68,68,0.5)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 6px", fontSize:18 }}>
                ⏱️
              </div>
              <div style={{ fontSize:11, fontWeight:800, marginBottom:1 }}>タイムアタック</div>
              <div style={{ fontSize:8, color:"#94a3b8" }}>60秒</div>
            </button>
            <button onClick={() => setScreen(S.FLASHCARD_SELECT)} style={{
              background:"linear-gradient(135deg, rgba(167,139,250,0.18), rgba(244,114,182,0.1))",
              border:"1px solid rgba(167,139,250,0.4)",
              borderRadius:14, padding:"12px 8px",
              cursor:"pointer", color:"#f8fafc", textAlign:"center", fontFamily:FONT,
            }}>
              <div style={{ width:34, height:34, borderRadius:8, background:"rgba(167,139,250,0.25)", border:"2px solid rgba(167,139,250,0.5)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 6px", fontSize:18 }}>
                🃏
              </div>
              <div style={{ fontSize:11, fontWeight:800, marginBottom:1 }}>暗記カード</div>
              <div style={{ fontSize:8, color:"#94a3b8" }}>フラッシュ</div>
            </button>
          </div>
        </div>
        );
      })()}

      {/* ══ RANKED ══════════════════════════════════════════ */}
      {screen === S.RANKED && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"24px 18px 80px", animation:"screenEnter 0.4s ease" }}>
          {/* ヘッダー */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={() => setScreen(S.HOME)} disabled={rankedMatching} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:rankedMatching?"default":"pointer", color:"#94a3b8", fontSize:17, fontWeight:700, fontFamily:FONT, opacity:rankedMatching?0.4:1 }}>←</button>
            <div>
              <h2 style={{ margin:"0 0 2px", fontSize:22, fontWeight:700 }}>👑 ランクマッチ</h2>
              <p style={{ color:"#64748b", fontSize:12, margin:0 }}>世界中のプレイヤーと4人対戦</p>
            </div>
          </div>

          {/* マッチング中の演出 */}
          {rankedMatching ? (
            <div style={{
              background:"linear-gradient(135deg, rgba(251,191,36,0.1), rgba(244,114,182,0.08))",
              border:"1px solid rgba(251,191,36,0.3)",
              borderRadius:24, padding:"40px 20px", textAlign:"center",
            }}>
              <div style={{ fontSize:9, color:"#EF4444", fontWeight:800, letterSpacing:3, marginBottom:14 }}>● LIVE MATCHMAKING</div>
              <div style={{ display:"inline-block", marginBottom:20 }}>
                <div style={{
                  width:60, height:60, border:"4px solid rgba(251,191,36,0.2)",
                  borderTop:"4px solid #FBBF24", borderRadius:"50%",
                  animation:"spin 1s linear infinite",
                }}/>
              </div>
              <div style={{ fontSize:18, fontWeight:800, color:"#FBBF24", marginBottom:6 }}>マッチング中…</div>
              <div style={{ fontSize:12, color:"#94a3b8", marginBottom:4 }}>🌐 世界中の同レート帯プレイヤーを検索</div>
              <div style={{ fontSize:10, color:"#64748b" }}>{getRank(userRating).icon} {getRank(userRating).name} · レート {userRating}</div>
              <div style={{ display:"flex", justifyContent:"center", gap:14, marginTop:24 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    width:42, height:42, borderRadius:12,
                    background: i === 0 ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.04)",
                    border:`1px solid ${i === 0 ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.1)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
                    animation:i === 0 ? "none" : `pulse 1.5s ease-in-out infinite ${i*0.3}s`,
                  }}>
                    {i === 0 ? "⭐" : "?"}
                  </div>
                ))}
              </div>
              <div style={{ fontSize:9, color:"#64748b", marginTop:14 }}>通常5〜15秒でマッチング完了</div>
            </div>
          ) : (
            <>
              {/* レート・ランク情報 */}
              {(() => {
                const curRank = getRank(userRating);
                const nextRank = getNextRank(userRating);
                const progress = Math.min(100, ((userRating - curRank.min) / (curRank.max - curRank.min)) * 100);
                return (
                  <div style={{
                    background:`linear-gradient(135deg, ${curRank.color}22, rgba(255,255,255,0.03))`,
                    border:`2px solid ${curRank.color}66`,
                    borderRadius:20, padding:"18px 20px", marginBottom:18,
                  }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                      <div>
                        <div style={{ fontSize:10, color:"#cbd5e1", letterSpacing:2, fontWeight:700 }}>あなたのレート</div>
                        <div style={{ fontSize:34, fontWeight:900, color:curRank.color, lineHeight:1.1 }}>{userRating}</div>
                      </div>
                      <div style={{
                        background:`${curRank.color}33`, border:`2px solid ${curRank.color}`,
                        borderRadius:14, padding:"10px 16px", textAlign:"center",
                      }}>
                        <div style={{ fontSize:28, lineHeight:1 }}>{curRank.icon}</div>
                        <div style={{ fontSize:11, color:curRank.color, fontWeight:800, marginTop:4 }}>{curRank.name}</div>
                      </div>
                    </div>
                    <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:8, overflow:"hidden", marginBottom:4 }}>
                      <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg, ${curRank.color}, ${nextRank.color})`, borderRadius:99, boxShadow:`0 0 8px ${curRank.color}aa` }}/>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#cbd5e1", fontWeight:600 }}>
                      <span>{curRank.name}</span>
                      <span>{nextRank.id !== curRank.id ? `${nextRank.name}まであと ${nextRank.min - userRating}` : "最高ランク！"}</span>
                    </div>
                    {/* 現在のランク称号 */}
                    <div style={{ marginTop:12, padding:"8px 12px", background:"rgba(0,0,0,0.25)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <span style={{ fontSize:11, color:"#94a3b8", fontWeight:600 }}>現在の称号</span>
                      <span style={{ fontSize:13, fontWeight:800, color:curRank.color }}>⚜ {curRank.title}</span>
                    </div>
                  </div>
                );
              })()}

              {/* 連勝ボーナス＆統計 */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
                <div style={{
                  background: winStreak > 0 ? "linear-gradient(135deg, rgba(239,68,68,0.18), rgba(251,191,36,0.08))" : "rgba(255,255,255,0.03)",
                  border: winStreak > 0 ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.07)",
                  borderRadius:14, padding:"12px 14px",
                }}>
                  <div style={{ fontSize:10, color: winStreak > 0 ? "#FCA5A5" : "#94a3b8", fontWeight:700, letterSpacing:2, marginBottom:4 }}>🔥 現在の連勝</div>
                  <div style={{ fontSize:24, fontWeight:900, color: winStreak > 0 ? "#EF4444" : "#cbd5e1" }}>{winStreak}<span style={{ fontSize:11, color:"#94a3b8", marginLeft:4 }}>連勝</span></div>
                  {winStreak >= 2 && <div style={{ fontSize:9, color:"#FCA5A5", fontWeight:700, marginTop:2 }}>+{winStreak * 10}💰ボーナス次回</div>}
                </div>
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius:14, padding:"12px 14px",
                }}>
                  <div style={{ fontSize:10, color:"#94a3b8", fontWeight:700, letterSpacing:2, marginBottom:4 }}>⭐ 最高連勝</div>
                  <div style={{ fontSize:24, fontWeight:900, color:"#FBBF24" }}>{bestWinStreak}<span style={{ fontSize:11, color:"#94a3b8", marginLeft:4 }}>連勝</span></div>
                </div>
              </div>

              {/* ランクピラミッド */}
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"16px 18px", marginBottom:18 }}>
                <div style={{ fontSize:11, color:"#cbd5e1", letterSpacing:3, fontWeight:700, marginBottom:14, textAlign:"center" }}>🏆 ランク分布</div>
                {[...RANK_TIERS].reverse().map((tier, i) => {
                  const width = 30 + (RANK_TIERS.length - 1 - i) * 12;
                  const isCurrent = tier.id === getRank(userRating).id;
                  return (
                    <div key={tier.id} style={{ display:"flex", justifyContent:"center", marginBottom:6 }}>
                      <div style={{
                        width:`${width}%`,
                        background: isCurrent ? `linear-gradient(135deg, ${tier.color}, ${shade(tier.color, -20)})` : `${tier.color}22`,
                        border: `2px solid ${isCurrent ? tier.color : tier.color+"44"}`,
                        borderRadius: 8,
                        padding:"6px 12px",
                        display:"flex", alignItems:"center", justifyContent:"space-between",
                        boxShadow: isCurrent ? `0 4px 16px ${tier.color}66` : "none",
                        transform: isCurrent ? "scale(1.05)" : "none",
                        transition:"all 0.2s",
                      }}>
                        <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ fontSize:14 }}>{tier.icon}</span>
                          <span style={{ fontSize:12, fontWeight:isCurrent?800:600, color: isCurrent ? "#fff" : tier.color }}>{tier.name}</span>
                        </span>
                        <span style={{ fontSize:10, color: isCurrent ? "rgba(255,255,255,0.85)" : "#94a3b8", fontWeight:700 }}>{tier.pop}%</span>
                      </div>
                    </div>
                  );
                })}
                <div style={{ fontSize:10, color:"#94a3b8", textAlign:"center", marginTop:10, lineHeight:1.5 }}>
                  全プレイヤーの分布<br/>上位ほどレアになります
                </div>
              </div>

              {/* ルール説明 */}
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"12px 14px", marginBottom:18, fontSize:11, color:"#cbd5e1", lineHeight:1.7 }}>
                <div style={{ color:"#fff", fontWeight:700, marginBottom:4, fontSize:12 }}>📜 ルール</div>
                ・4人で4問の早押しバトル<br/>
                ・勝つとレート +30、負けると -20<br/>
                ・連勝でボーナス追加
              </div>

              {/* ランダムマッチ */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:11, color:"#64748b", letterSpacing:3, fontWeight:600, marginBottom:10 }}>クイックマッチ</div>
                <button onClick={() => startRankedMatch("random")} style={{
                  width:"100%",
                  background:"linear-gradient(135deg, #FBBF24, #F472B6)",
                  border:"none", borderRadius:18, padding:"18px",
                  cursor:"pointer", color:"#0f172a", fontFamily:FONT, textAlign:"left",
                  display:"flex", alignItems:"center", gap:14,
                  boxShadow:"0 6px 20px rgba(251,191,36,0.3)",
                }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:"rgba(15,23,42,0.15)", border:"1px solid rgba(15,23,42,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🎲</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:16, fontWeight:800, marginBottom:2 }}>ランダム教科で対戦</div>
                    <div style={{ fontSize:11, opacity:0.7 }}>運も実力のうち！どの教科が出るかは開始時に</div>
                  </div>
                  <div style={{ fontSize:20 }}>›</div>
                </button>
              </div>

              {/* 教科指定 */}
              <div>
                <div style={{ fontSize:11, color:"#64748b", letterSpacing:3, fontWeight:600, marginBottom:10 }}>教科を指定して対戦</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {GENRES.map(g => (
                    <button key={g.id} onClick={() => startRankedMatch(g.id)} style={{
                      background:`linear-gradient(135deg, ${g.dark} 0%, rgba(255,255,255,0.02) 100%)`,
                      border:`1px solid ${g.color}44`,
                      borderRadius:16, padding:"14px 12px",
                      cursor:"pointer", color:"#f1f5f9", textAlign:"center",
                      fontFamily:FONT, position:"relative",
                    }}>
                      <div style={{ width:40, height:40, borderRadius:12, background:`${g.color}22`, border:`1px solid ${g.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, margin:"0 auto 6px" }}>{g.icon}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#f8fafc" }}>{g.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══ ENDLESS_SELECT ══════════════════════════════════ */}
      {screen === S.ENDLESS_SELECT && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"24px 18px 80px", animation:"screenEnter 0.4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={() => setScreen(S.HOME)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:40, height:40, cursor:"pointer", color:"#cbd5e1", fontSize:18, fontWeight:700, fontFamily:FONT }}>←</button>
            <div>
              <h2 style={{ margin:"0 0 2px", fontSize:24, fontWeight:800, color:"#f8fafc" }}>エンドレスモード</h2>
              <p style={{ color:"#94a3b8", fontSize:13, margin:0 }}>ライフ3つ・連続正解で記録更新！</p>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {ENDLESS_MODES.map(m => {
              const best = endlessBest[m.id] || 0;
              return (
                <button key={m.id} onClick={() => startEndless(m)} style={{
                  background:`linear-gradient(135deg, ${m.color}22 0%, rgba(255,255,255,0.02) 100%)`,
                  border:`1px solid ${m.color}55`,
                  borderRadius:18, padding:"16px 18px",
                  cursor:"pointer", color:"#f1f5f9", textAlign:"left",
                  display:"flex", alignItems:"center", gap:14, fontFamily:FONT,
                }}>
                  <div style={{ width:50, height:50, borderRadius:10, background:`${m.color}22`, border:`2px solid ${m.color}66`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <PixelIcon name={m.icon} size={28} color={m.color}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:17, fontWeight:800, color:"#fff", marginBottom:3 }}>{m.label}</div>
                    <div style={{ fontSize:12, color:"#94a3b8" }}>{m.desc}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:10, color:"#64748b", fontWeight:600, letterSpacing:1 }}>BEST</div>
                    <div style={{ fontSize:18, fontWeight:800, color:m.color }}>{best}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ ENDLESS ═════════════════════════════════════════ */}
      {screen === S.ENDLESS && endlessShuffled[endlessIdx] && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"16px 16px 24px" }}>
          {/* 上部ヘッダー */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <button onClick={() => setScreen(S.HOME)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, width:36, height:36, cursor:"pointer", color:"#94a3b8", fontSize:16, fontFamily:FONT }}>×</button>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              {[1,2,3].map(i => (
                <span key={i} style={{ fontSize:22, opacity: i <= endlessLives ? 1 : 0.2, transition:"opacity 0.3s", filter:i<=endlessLives?"drop-shadow(0 0 4px #EF4444)":"none" }}>❤️</span>
              ))}
            </div>
            <div style={{ background:`${endlessMode.color}22`, border:`2px solid ${endlessMode.color}`, borderRadius:99, padding:"5px 18px", fontSize:18, fontWeight:800, color:endlessMode.color, minWidth:64, textAlign:"center" }}>{endlessTimer}</div>
          </div>

          {/* スコア */}
          <div style={{ textAlign:"center", marginBottom:18 }}>
            <div style={{ fontSize:11, color:"#64748b", letterSpacing:2, fontWeight:600 }}>SCORE</div>
            <div style={{ fontSize:48, fontWeight:900, color:endlessMode.color, lineHeight:1.1, textShadow:`0 0 20px ${endlessMode.color}66` }}>{endlessScore}</div>
            <div style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>
              BEST: <span style={{ color:"#FBBF24", fontWeight:700 }}>{endlessBest[endlessMode.id] || 0}</span>
            </div>
          </div>

          {/* タイマーバー */}
          <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:99, height:4, marginBottom:18, overflow:"hidden" }}>
            <div style={{ width:`${(endlessTimer/10)*100}%`, height:"100%", background:endlessTimer<=3?"#EF4444":endlessMode.color, transition:"width 1s linear" }}/>
          </div>

          {/* 問題 */}
          <div style={{ background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.12)", borderRadius:20, padding:"32px 20px", marginBottom:16, textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#64748b", letterSpacing:2, marginBottom:14, fontWeight:600 }}>意味は？</div>
            <div style={{ fontSize:32, fontWeight:800, color:"#fff", lineHeight:1.3 }}>{endlessShuffled[endlessIdx].q}</div>
          </div>

          {/* 選択肢 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {endlessShuffled[endlessIdx].choices.map((c,i) => {
              const q = endlessShuffled[endlessIdx];
              const ok = i === q.answer;
              const chosen = i === endlessSelected;
              let bg="rgba(255,255,255,0.05)", border="rgba(255,255,255,0.15)", color="#f1f5f9";
              if (endlessSelected !== null) {
                if (ok)     { bg="rgba(52,211,153,0.2)"; border="#34D399"; color="#34D399"; }
                else if (chosen) { bg="rgba(239,68,68,0.2)"; border="#EF4444"; color="#EF4444"; }
              }
              return <button key={i} onClick={() => endlessSelected===null&&handleEndlessAnswer(i)} style={{ background:bg, border:`2px solid ${border}`, borderRadius:16, padding:"18px 12px", cursor:endlessSelected===null?"pointer":"default", color, fontSize:16, fontWeight:700, lineHeight:1.4, fontFamily:FONT, minHeight:60 }}>{c}</button>;
            })}
          </div>
        </div>
      )}

      {/* ══ ENDLESS_RESULT ══════════════════════════════════ */}
      {screen === S.ENDLESS_RESULT && endlessMode && (() => {
        const prevBest = endlessBest[endlessMode.id] || 0;
        const isNewRecord = endlessScore > prevBest;
        const earnedCoins = endlessScore * 2; // 1問につき2💰
        // メダル評価
        let medal = null;
        if (endlessScore >= 30) medal = { icon:"🏆", label:"ゴールド", color:"#FBBF24" };
        else if (endlessScore >= 20) medal = { icon:"🥈", label:"シルバー", color:"#94a3b8" };
        else if (endlessScore >= 10) medal = { icon:"🥉", label:"ブロンズ", color:"#A78BFA" };
        return (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"32px 20px", animation:"popIn 0.5s ease" }}>
          {/* 結果アイコン */}
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ fontSize:72, marginBottom:6, animation: isNewRecord ? "monsterFloat 1.5s ease-in-out infinite" : "none" }}>
              {isNewRecord ? "🏆" : medal?.icon || "💪"}
            </div>
            {isNewRecord && (
              <div style={{ fontSize:10, color:"#FBBF24", letterSpacing:4, fontWeight:900, marginBottom:6 }}>★ NEW RECORD ★</div>
            )}
            <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 4px", color:"#fff" }}>
              {isNewRecord ? "新記録達成！" : medal ? `${medal.label}メダル！` : "おつかれさま！"}
            </h2>
            <p style={{ color:"#94a3b8", fontSize:12, margin:0 }}>{endlessMode.label} エンドレス</p>
          </div>

          {/* メインスコアカード */}
          <div style={{
            background:`linear-gradient(135deg, ${endlessMode.color}15, rgba(0,0,0,0.3))`,
            border:`2px solid ${endlessMode.color}55`,
            borderRadius:22, padding:"22px 20px", marginBottom:12,
            boxShadow:`0 0 30px ${endlessMode.color}33`,
          }}>
            <div style={{ fontSize:10, color:"#64748b", letterSpacing:4, fontWeight:800, marginBottom:6, textAlign:"center" }}>FINAL SCORE</div>
            <div style={{ fontSize:72, fontWeight:900, color:endlessMode.color, lineHeight:1, textShadow:`0 0 24px ${endlessMode.color}88`, textAlign:"center", marginBottom:14 }}>
              {endlessScore}
            </div>
            {/* ベストと比較 */}
            <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:10, padding:"10px 12px", display:"flex", justifyContent:"space-around", alignItems:"center" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:9, color:"#64748b", fontWeight:700, letterSpacing:2, marginBottom:2 }}>これまでの最高</div>
                <div style={{ fontSize:20, fontWeight:900, color:"#FBBF24" }}>{Math.max(prevBest, endlessScore)}</div>
              </div>
              <div style={{ width:1, height:32, background:"rgba(255,255,255,0.1)" }}/>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:9, color:"#64748b", fontWeight:700, letterSpacing:2, marginBottom:2 }}>今回</div>
                <div style={{ fontSize:20, fontWeight:900, color:"#fff" }}>{endlessScore}</div>
              </div>
              {isNewRecord && prevBest > 0 && (
                <>
                  <div style={{ width:1, height:32, background:"rgba(255,255,255,0.1)" }}/>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:9, color:"#34D399", fontWeight:700, letterSpacing:2, marginBottom:2 }}>更新</div>
                    <div style={{ fontSize:20, fontWeight:900, color:"#34D399" }}>+{endlessScore - prevBest}</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 獲得報酬 */}
          <div style={{
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:14, padding:"12px 14px", marginBottom:16,
          }}>
            <div style={{ fontSize:10, color:"#94a3b8", fontWeight:800, letterSpacing:2, marginBottom:8 }}>🎁 獲得報酬</div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#cbd5e1", marginBottom:5 }}>
              <span>💰 コイン</span>
              <span style={{ color:"#FBBF24", fontWeight:900 }}>+{earnedCoins}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#cbd5e1" }}>
              <span>✨ XP</span>
              <span style={{ color:endlessMode.color, fontWeight:900 }}>+{endlessScore * 5}</span>
            </div>
            {medal && (
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#cbd5e1", marginTop:5 }}>
                <span>{medal.icon} メダル</span>
                <span style={{ color: medal.color, fontWeight:900 }}>{medal.label}</span>
              </div>
            )}
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => startEndless(endlessMode)} style={{ flex:2, background:`linear-gradient(135deg, ${endlessMode.color}, ${shade(endlessMode.color, -20)})`, border:"none", borderRadius:14, padding:14, color:"#fff", fontWeight:800, cursor:"pointer", fontSize:14, fontFamily:FONT, boxShadow:`0 6px 20px ${endlessMode.color}55` }}>もう一回</button>
            <button onClick={() => setScreen(S.ENDLESS_SELECT)} style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:14, color:"#cbd5e1", cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:FONT }}>モード選択</button>
          </div>
        </div>
        );
      })()}

      {/* ══ DEX (ペット図鑑) ════════════════════════════════ */}
      {screen === S.DEX && (() => {
        // 一番XPが多い教科 = 現在の進化ライン
        const sortedGenres = [...GENRES].sort((a, b) => (genreXp[b.id] || 0) - (genreXp[a.id] || 0));
        const primaryGenre = sortedGenres[0];
        const primaryXp = genreXp[primaryGenre.id] || 0;
        // 現在のステージ判定
        let currentStage = 1;
        for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
          if (primaryXp >= STAGE_THRESHOLDS[i]) { currentStage = i + 1; break; }
        }
        return (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"24px 18px 80px", animation:"screenEnter 0.4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <button onClick={() => setScreen(S.PROFILE)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:40, height:40, cursor:"pointer", color:"#cbd5e1", fontSize:18, fontWeight:700, fontFamily:FONT }}>←</button>
            <div>
              <h2 style={{ margin:"0 0 2px", fontSize:22, fontWeight:800, color:"#f8fafc" }}>🌳 進化系統樹</h2>
              <p style={{ color:"#94a3b8", fontSize:12, margin:0 }}>{unlockedPets.length} / 18 種類 解放済み</p>
            </div>
          </div>

          {/* プログレス */}
          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:99, height:6, overflow:"hidden", marginBottom:14 }}>
            <div style={{ width:`${(unlockedPets.length/18)*100}%`, height:"100%", background:"linear-gradient(90deg, #34D399, #60A5FA)", boxShadow:"0 0 8px #34D39988" }}/>
          </div>

          {/* 現在のメインライン表示 */}
          <div style={{
            background:`linear-gradient(135deg, ${primaryGenre.color}22, rgba(0,0,0,0.2))`,
            border:`1px solid ${primaryGenre.color}55`,
            borderRadius:12, padding:"10px 14px", marginBottom:18,
          }}>
            <div style={{ fontSize:9, color: primaryGenre.color, fontWeight:800, letterSpacing:2, marginBottom:4 }}>🌟 現在のメインライン</div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:20 }}>{primaryGenre.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{primaryGenre.label}型</div>
                <div style={{ fontSize:10, color:"#94a3b8" }}>一番XPの多い教科で進化系統が決まります</div>
              </div>
              <div style={{ fontSize:13, fontWeight:900, color: primaryGenre.color }}>Lv.{currentStage}</div>
            </div>
          </div>

          {/* ━━━ 1本の系統樹 ━━━ */}
          <div style={{
            background:"linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.04))",
            border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:20, padding:"22px 16px 26px",
            position:"relative",
          }}>
            {/* ── 共通の幹 ── */}
            {/* Lv1 たまご */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div style={{ fontSize:8, color:"#FBBF24", letterSpacing:3, fontWeight:800, marginBottom:4 }}>START</div>
              <div style={{
                width:60, height:60, borderRadius:"50%",
                background:"linear-gradient(135deg, rgba(251,191,36,0.3), rgba(251,191,36,0.1))",
                border:"2.5px solid #FBBF24",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:34, marginBottom:2,
                boxShadow:"0 0 18px rgba(251,191,36,0.5)",
              }}>🥚</div>
              <div style={{ fontSize:10, color:"#FBBF24", fontWeight:800 }}>たまご</div>
              <div style={{ fontSize:8, color:"#94a3b8" }}>Lv.1 ・全員共通</div>
            </div>

            {/* 幹: たまご→ヒナ */}
            <div style={{ width:2, height:20, background:"linear-gradient(180deg, #FBBF24, #FB7185)", margin:"4px auto" }}/>

            {/* Lv2 ヒナ */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div style={{
                width:56, height:56, borderRadius:"50%",
                background:"linear-gradient(135deg, rgba(251,113,133,0.3), rgba(251,113,133,0.1))",
                border:"2.5px solid #FB7185",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:30, marginBottom:2,
                boxShadow:"0 0 15px rgba(251,113,133,0.4)",
              }}>🐣</div>
              <div style={{ fontSize:10, color:"#FB7185", fontWeight:800 }}>ヒナ</div>
              <div style={{ fontSize:8, color:"#94a3b8" }}>Lv.2 ・全員共通</div>
            </div>

            {/* ── 分岐ポイント ── */}
            <div style={{ height:30, position:"relative", margin:"6px 0" }}>
              {/* 中心から外向きへの分岐ライン（SVGっぽいCSS） */}
              <div style={{ width:2, height:14, background:"linear-gradient(180deg, #FB7185, rgba(255,255,255,0.2))", margin:"0 auto" }}/>
              <div style={{
                position:"absolute", left:"15%", right:"15%", top:14,
                height:2, background:"rgba(255,255,255,0.15)",
              }}/>
            </div>

            <div style={{ textAlign:"center", marginBottom:14, fontSize:9, color:"#94a3b8", fontStyle:"italic" }}>
              ↓ ここから勉強の傾向で進化が分岐 ↓
            </div>

            {/* ── Lv3〜5: 6方向への枝（縦並び） ── */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {GENRES.map(g => {
                const stages = [3, 4, 5];
                const unlockedCount = stages.filter(s => unlockedPets.includes(`${g.id}_${s}`)).length;
                const allUnlocked = unlockedCount === 3;
                const isMainLine = g.id === primaryGenre.id;
                const branchXp = genreXp[g.id] || 0;
                return (
                  <div key={g.id} style={{
                    background: isMainLine
                      ? `linear-gradient(135deg, ${g.color}18, rgba(0,0,0,0.2))`
                      : "rgba(255,255,255,0.02)",
                    border: `${isMainLine ? "2px" : "1px"} solid ${isMainLine ? g.color+"66" : "rgba(255,255,255,0.06)"}`,
                    borderRadius:14, padding:"10px 12px",
                    boxShadow: isMainLine ? `0 0 16px ${g.color}33` : "none",
                    position:"relative",
                  }}>
                    {isMainLine && (
                      <div style={{
                        position:"absolute", top:-7, left:10,
                        background:g.color, color:"#0f172a",
                        fontSize:8, fontWeight:900, letterSpacing:1.5,
                        padding:"1px 7px", borderRadius:99,
                      }}>MAIN</div>
                    )}

                    {/* 教科ヘッダー */}
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <div style={{
                        width:28, height:28, borderRadius:8,
                        background:`${g.color}22`, border:`1.5px solid ${g.color}55`,
                        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                      }}>
                        <PixelIcon name={g.id} size={18} color={g.color}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, fontWeight:800, color: isMainLine ? g.color : "#cbd5e1" }}>
                          {g.label}型
                        </div>
                        <div style={{ fontSize:9, color:"#94a3b8" }}>
                          XP {branchXp} ・解放 {unlockedCount}/3
                        </div>
                      </div>
                      {allUnlocked && <span style={{ fontSize:14 }}>👑</span>}
                    </div>

                    {/* Lv3 → Lv4 → Lv5 横並び */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:4 }}>
                      {stages.map((stage, idx) => {
                        const petId = `${g.id}_${stage}`;
                        const unlocked = unlockedPets.includes(petId);
                        const fakeXp = { [g.id]: STAGE_THRESHOLDS[stage-1] + 10 };
                        const stageLabel = ["", "", "幼年", "成長", "成体"][stage];
                        return (
                          <div key={stage} style={{ display:"flex", alignItems:"center", flex:1 }}>
                            <div style={{
                              flex:1,
                              background: unlocked ? `${g.color}28` : "rgba(0,0,0,0.25)",
                              border: `1.5px solid ${unlocked ? g.color : "rgba(255,255,255,0.08)"}`,
                              borderRadius:10, padding:"6px 4px",
                              textAlign:"center",
                              position:"relative",
                              boxShadow: unlocked ? `0 0 10px ${g.color}55` : "none",
                            }}>
                              {unlocked ? (
                                <div style={{ display:"flex", justifyContent:"center", marginBottom:2 }}>
                                  <PetDisplay genreXp={fakeXp} size={26} starterEgg={starterEgg}/>
                                </div>
                              ) : (
                                <div style={{
                                  fontSize:22, lineHeight:1, marginBottom:2,
                                  filter:"brightness(0) saturate(100%)",
                                  opacity: isMainLine ? 0.5 : 0.25,
                                }}>
                                  {GENRE_FORMS[g.id]?.creature || "👾"}
                                </div>
                              )}
                              <div style={{ fontSize:8, color: unlocked ? g.color : "#64748b", fontWeight:700 }}>
                                Lv.{stage}
                              </div>
                              <div style={{ fontSize:7, color: unlocked ? "#94a3b8" : "#475569" }}>
                                {unlocked ? stageLabel : "???"}
                              </div>
                              {!unlocked && (
                                <div style={{
                                  position:"absolute", top:2, right:2,
                                  fontSize:9, opacity:0.5,
                                }}>🔒</div>
                              )}
                            </div>
                            {idx < 2 && (
                              <div style={{
                                fontSize:11, color: unlocked ? g.color : "#475569",
                                opacity: unlocked ? 0.9 : 0.3, padding:"0 3px",
                                fontWeight:900,
                              }}>›</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 系統樹の説明 */}
            <div style={{ marginTop:18, padding:"10px 12px", background:"rgba(96,165,250,0.06)", border:"1px solid rgba(96,165,250,0.2)", borderRadius:10, fontSize:9, color:"#94a3b8", textAlign:"center", lineHeight:1.6 }}>
              💡 一番XPが高い教科の「MAIN」ラインが現在のあなたのペットの進化系統です<br/>
              他の教科を勉強すると、そちらの分岐も進化していきます
            </div>
          </div>
        </div>
        );
      })()}

      {/* ══ PHOTO ═══════════════════════════════════════════ */}
      {screen === S.PHOTO && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"22px 18px 80px", animation:"screenEnter 0.4s ease" }}>
          {/* ヘッダー */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <button onClick={() => { resetPhoto(); setScreen(S.HOME); }} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:"pointer", color:"#94a3b8", fontSize:17, fontWeight:700, fontFamily:FONT }}>←</button>
            <div style={{ flex:1 }}>
              <h2 style={{ margin:"0 0 2px", fontSize:20, fontWeight:800, color:"#F472B6" }}>📸 AI出題</h2>
              <p style={{ color:"#94a3b8", fontSize:11, margin:0 }}>画像・PDFから問題を自動生成</p>
            </div>
          </div>

          {/* オフライン警告 */}
          {offlineMode && (
            <div style={{
              background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
              borderRadius:12, padding:"12px 14px", marginBottom:14,
              fontSize:11, color:"#FCA5A5", lineHeight:1.6,
            }}>
              📵 オフラインモードでは利用できません。<br/>
              設定からオフラインを解除してください。
            </div>
          )}

          {/* ステップインジケーター */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, padding:"0 4px" }}>
            {[
              { n:1, label:"選択", active: true, done: !!photoPreview },
              { n:2, label:"モード", active: !!photoPreview, done: !!photoPreview && !generating },
              { n:3, label:"生成", active: generating, done: false },
            ].map((s, i, arr) => (
              <div key={s.n} style={{ display:"flex", alignItems:"center", flex: i === arr.length-1 ? "0 0 auto" : 1 }}>
                <div style={{
                  display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0,
                }}>
                  <div style={{
                    width:26, height:26, borderRadius:"50%",
                    background: s.done ? "#F472B6" : s.active ? "rgba(244,114,182,0.2)" : "rgba(255,255,255,0.05)",
                    border: `1.5px solid ${s.done || s.active ? "#F472B6" : "rgba(255,255,255,0.15)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:11, fontWeight:900,
                    color: s.done ? "#fff" : s.active ? "#F472B6" : "#64748b",
                  }}>{s.done ? "✓" : s.n}</div>
                  <div style={{ fontSize:9, color: s.active || s.done ? "#F472B6" : "#64748b", fontWeight:700, marginTop:3 }}>{s.label}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ flex:1, height:2, background: s.done ? "#F472B6" : "rgba(255,255,255,0.1)", margin:"0 6px", marginBottom:14 }}/>
                )}
              </div>
            ))}
          </div>

          {/* hidden inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            style={{ display:"none" }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,.pdf"
            onChange={handlePhotoSelect}
            style={{ display:"none" }}
          />

          {/* 未選択 → 2つの選択肢を表示 */}
          {!photoPreview && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                <button onClick={() => cameraInputRef.current?.click()} disabled={offlineMode} style={{
                  background: offlineMode ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, rgba(244,114,182,0.2), rgba(244,114,182,0.05))",
                  border:`1.5px solid ${offlineMode ? "rgba(255,255,255,0.08)" : "rgba(244,114,182,0.5)"}`,
                  borderRadius:18, padding:"28px 14px", cursor: offlineMode ? "not-allowed" : "pointer",
                  color: offlineMode ? "#64748b" : "#fff",
                  opacity: offlineMode ? 0.5 : 1,
                  fontFamily:FONT, textAlign:"center",
                  transition:"transform 0.15s",
                  boxShadow: offlineMode ? "none" : "0 4px 14px rgba(244,114,182,0.2)",
                }}>
                  <div style={{ fontSize:44, marginBottom:8 }}>📷</div>
                  <div style={{ fontSize:14, fontWeight:800, marginBottom:3 }}>写真を撮る</div>
                  <div style={{ fontSize:10, opacity:0.8 }}>カメラ起動</div>
                </button>
                <button onClick={() => fileInputRef.current?.click()} disabled={offlineMode} style={{
                  background: offlineMode ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, rgba(96,165,250,0.2), rgba(96,165,250,0.05))",
                  border:`1.5px solid ${offlineMode ? "rgba(255,255,255,0.08)" : "rgba(96,165,250,0.5)"}`,
                  borderRadius:18, padding:"28px 14px", cursor: offlineMode ? "not-allowed" : "pointer",
                  color: offlineMode ? "#64748b" : "#fff",
                  opacity: offlineMode ? 0.5 : 1,
                  fontFamily:FONT, textAlign:"center",
                  boxShadow: offlineMode ? "none" : "0 4px 14px rgba(96,165,250,0.2)",
                }}>
                  <div style={{ fontSize:44, marginBottom:8 }}>📁</div>
                  <div style={{ fontSize:14, fontWeight:800, marginBottom:3 }}>ファイルから</div>
                  <div style={{ fontSize:10, opacity:0.8 }}>画像・PDF</div>
                </button>
              </div>

              {/* オススメ素材 */}
              <div style={{
                background:"linear-gradient(135deg, rgba(251,191,36,0.08), rgba(244,114,182,0.04))",
                border:"1px solid rgba(251,191,36,0.2)",
                borderRadius:14, padding:"12px 14px", marginBottom:12,
              }}>
                <div style={{ fontSize:10, color:"#FBBF24", letterSpacing:2, fontWeight:800, marginBottom:8 }}>💡 こんな素材がオススメ</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  {[
                    { icon:"📚", label:"教科書" },
                    { icon:"📝", label:"授業ノート" },
                    { icon:"📄", label:"参考書PDF" },
                    { icon:"🗒️", label:"単語リスト" },
                  ].map((s, i) => (
                    <div key={i} style={{
                      display:"flex", alignItems:"center", gap:6,
                      background:"rgba(0,0,0,0.15)", borderRadius:8, padding:"6px 10px",
                    }}>
                      <span style={{ fontSize:14 }}>{s.icon}</span>
                      <span style={{ fontSize:11, color:"#cbd5e1", fontWeight:700 }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 仕組みの説明 */}
              <div style={{
                background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)",
                borderRadius:14, padding:"12px 14px",
              }}>
                <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:2, fontWeight:800, marginBottom:8 }}>🤖 仕組み</div>
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {[
                    "①画像 or PDFをアップロード",
                    "②AIが内容を読み取って分析",
                    "③4択クイズを4問自動生成",
                    "④バトル感覚で覚える！",
                  ].map((step, i) => (
                    <div key={i} style={{ fontSize:11, color:"#cbd5e1", lineHeight:1.5 }}>{step}</div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 選択済み → プレビュー */}
          {photoPreview && (
            <div style={{
              background:"rgba(255,255,255,0.03)",
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:18, padding:12, marginBottom:14,
            }}>
              <div style={{ fontSize:9, color:"#94a3b8", letterSpacing:2, fontWeight:800, marginBottom:8 }}>✓ アップロード完了</div>
              <div style={{ position:"relative", borderRadius:12, overflow:"hidden", marginBottom:10, background:"#000" }}>
                {photoPreview === "PDF" ? (
                  <div style={{ padding:"36px 20px", textAlign:"center", background:"linear-gradient(135deg,#1e1b4b,#312e81)" }}>
                    <div style={{ fontSize:54, marginBottom:8 }}>📄</div>
                    <div style={{ fontSize:13, fontWeight:800, color:"#a78bfa" }}>{photoFileName || "PDF ファイル"}</div>
                    <div style={{ fontSize:10, color:"#94a3b8", marginTop:4 }}>PDFをアップロードしました</div>
                  </div>
                ) : (
                  <img src={photoPreview} alt="プレビュー" style={{ width:"100%", display:"block", maxHeight:240, objectFit:"contain" }} />
                )}
              </div>
              {photoFileName && photoPreview !== "PDF" && (
                <div style={{ fontSize:10, color:"#94a3b8", marginBottom:10, textAlign:"center" }}>📎 {photoFileName}</div>
              )}
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={() => cameraInputRef.current?.click()} disabled={generating} style={{
                  flex:1, background:"rgba(244,114,182,0.1)", border:"1px solid rgba(244,114,182,0.3)",
                  borderRadius:10, padding:"8px", cursor:generating?"default":"pointer",
                  color:"#F472B6", fontSize:10, fontWeight:700, fontFamily:FONT, opacity:generating?0.5:1,
                }}>📷 撮り直す</button>
                <button onClick={() => fileInputRef.current?.click()} disabled={generating} style={{
                  flex:1, background:"rgba(96,165,250,0.1)", border:"1px solid rgba(96,165,250,0.3)",
                  borderRadius:10, padding:"8px", cursor:generating?"default":"pointer",
                  color:"#60A5FA", fontSize:10, fontWeight:700, fontFamily:FONT, opacity:generating?0.5:1,
                }}>📁 別ファイル</button>
                <button onClick={resetPhoto} disabled={generating} style={{
                  flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:10, padding:"8px", cursor:generating?"default":"pointer",
                  color:"#94a3b8", fontSize:10, fontWeight:700, fontFamily:FONT, opacity:generating?0.5:1,
                }}>🗑 削除</button>
              </div>
            </div>
          )}

          {/* モード選択 */}
          {photoPreview && !generating && (
            <div style={{
              background:"rgba(255,255,255,0.03)",
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:16, padding:"12px 14px 14px", marginBottom:14,
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:2, fontWeight:800 }}>🎯 出題モード</div>
                <div style={{ fontSize:9, color:"#64748b" }}>素材に合わせて選んでね</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:7 }}>
                {[
                  {id:"auto",    icon:"✨", label:"自動",     desc:"AIが判別"},
                  {id:"vocab",   icon:"📝", label:"単語暗記", desc:"単語↔意味"},
                  {id:"content", icon:"📖", label:"内容理解", desc:"概念・事実"},
                ].map(m => {
                  const active = quizMode === m.id;
                  return (
                    <button key={m.id} onClick={() => setQuizMode(m.id)} style={{
                      background: active ? "linear-gradient(135deg, rgba(244,114,182,0.25), rgba(244,114,182,0.05))" : "rgba(255,255,255,0.04)",
                      border:`1.5px solid ${active ? "#F472B6" : "rgba(255,255,255,0.08)"}`,
                      borderRadius:11, padding:"10px 6px",
                      cursor:"pointer", color: active ? "#F472B6" : "#94a3b8",
                      fontFamily:FONT, textAlign:"center", transition:"all 0.15s",
                      boxShadow: active ? "0 4px 12px rgba(244,114,182,0.2)" : "none",
                    }}>
                      <div style={{ fontSize:22, marginBottom:3 }}>{m.icon}</div>
                      <div style={{ fontSize:11, fontWeight:800, marginBottom:2 }}>{m.label}</div>
                      <div style={{ fontSize:9, opacity:0.7 }}>{m.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* エラー */}
          {photoError && (
            <div style={{
              background:"linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))",
              border:"1px solid rgba(239,68,68,0.4)",
              borderRadius:14, padding:"12px 14px", marginBottom:14,
              animation:"popIn 0.3s ease",
            }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                <span style={{ fontSize:20, flexShrink:0 }}>⚠️</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, color:"#EF4444", fontWeight:800, marginBottom:4 }}>エラーが発生しました</div>
                  <div style={{ fontSize:11, color:"#FCA5A5", lineHeight:1.5 }}>{photoError}</div>
                  <div style={{ fontSize:10, color:"#94a3b8", marginTop:8, lineHeight:1.5 }}>
                    💡 解決のヒント:<br/>
                    ・通信環境を確認してみる<br/>
                    ・画像がブレてないか確認<br/>
                    ・文字がはっきり見える素材を選ぶ
                  </div>
                </div>
              </div>
              {photoPreview && (
                <button onClick={() => { setPhotoError(null); generateQuestions(); }} style={{
                  width:"100%", marginTop:10,
                  background:"linear-gradient(135deg, #EF4444, #DC2626)",
                  border:"none", borderRadius:10, padding:"8px",
                  cursor:"pointer", color:"#fff", fontSize:11, fontWeight:800, fontFamily:FONT,
                }}>🔄 もう一度試す</button>
              )}
            </div>
          )}

          {/* 生成ボタン */}
          {photoPreview && !generating && (
            <button onClick={generateQuestions} style={{
              width:"100%",
              background:"linear-gradient(135deg, #F472B6, #FBBF24)",
              border:"none", borderRadius:16, padding:"16px",
              cursor:"pointer", color:"#0f172a", fontSize:15, fontWeight:900, fontFamily:FONT,
              boxShadow:"0 8px 24px rgba(244,114,182,0.4)",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}>
              <span style={{ fontSize:18 }}>✨</span>
              <span>AIで問題を作る</span>
              <span style={{ fontSize:18 }}>→</span>
            </button>
          )}

          {/* ローディング（より派手に） */}
          {generating && (
            <div style={{
              background:"linear-gradient(135deg, rgba(244,114,182,0.15), rgba(251,191,36,0.08))",
              border:"1.5px solid rgba(244,114,182,0.4)",
              borderRadius:18, padding:"24px 18px", textAlign:"center",
              boxShadow:"0 0 30px rgba(244,114,182,0.2)",
            }}>
              {/* AIアイコン */}
              <div style={{ position:"relative", display:"inline-block", marginBottom:14 }}>
                <div style={{ fontSize:54, animation:"monsterFloat 1.5s ease-in-out infinite" }}>🤖</div>
                {/* グルグル */}
                <div style={{
                  position:"absolute", top:-6, right:-6,
                  width:24, height:24,
                  border:"2.5px solid rgba(244,114,182,0.2)",
                  borderTop:"2.5px solid #F472B6",
                  borderRadius:"50%",
                  animation:"spin 0.8s linear infinite",
                }}/>
              </div>
              <div style={{ fontSize:9, color:"#F472B6", letterSpacing:3, fontWeight:800, marginBottom:6 }}>AI ANALYZING</div>
              <div style={{ fontSize:14, fontWeight:800, color:"#fff", marginBottom:4 }}>内容を読み取って問題を作っています</div>
              <div style={{ fontSize:10, color:"#94a3b8", marginBottom:14 }}>10〜30秒ほどかかります</div>
              {/* 進捗バー（不定） */}
              <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:5, overflow:"hidden", marginBottom:12 }}>
                <div style={{
                  width:"40%", height:"100%",
                  background:"linear-gradient(90deg, transparent, #F472B6, #FBBF24, transparent)",
                  animation:"loadingSlide 1.5s linear infinite",
                }}/>
              </div>
              {/* 処理ステップの表示 */}
              <div style={{ fontSize:10, color:"#94a3b8", fontStyle:"italic" }}>
                文字を読み取り → 内容を分析 → 問題を作成 → 完成！
              </div>
            </div>
          )}
        </div>
      )}

      {screen === S.FRIENDS && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"22px 18px 24px", animation:"screenEnter 0.4s ease" }}>
          <h2 style={{ margin:"0 0 4px", fontSize:22, fontWeight:800 }}>👥 友達</h2>
          <p style={{ color:"#94a3b8", fontSize:11, margin:"0 0 16px" }}>勉強仲間と切磋琢磨しよう</p>

          {/* 自分のフレンドコードカード */}
          <div style={{
            background:"linear-gradient(135deg, rgba(96,165,250,0.15), rgba(167,139,250,0.05))",
            border:"1.5px solid rgba(96,165,250,0.4)",
            borderRadius:14, padding:"12px 14px", marginBottom:10,
            display:"flex", alignItems:"center", gap:10,
          }}>
            <div style={{ fontSize:28 }}>🆔</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9, color:"#60A5FA", letterSpacing:2, fontWeight:800, marginBottom:2 }}>あなたのフレンドコード</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#fff", letterSpacing:4, fontFamily:"monospace" }}>{myFriendCode || "------"}</div>
            </div>
            <button onClick={() => setShowFriendQR(true)} style={{
              background:"rgba(96,165,250,0.2)", border:"1px solid rgba(96,165,250,0.5)",
              borderRadius:10, padding:"8px 10px", cursor:"pointer",
              color:"#60A5FA", fontSize:11, fontWeight:800, fontFamily:FONT,
            }}>📱 QR</button>
          </div>

          {/* 友達追加ボタン */}
          <button onClick={() => setShowAddFriend(true)} style={{
            width:"100%", background:"rgba(52,211,153,0.12)",
            border:"1.5px solid rgba(52,211,153,0.4)",
            borderRadius:12, padding:"10px", marginBottom:16,
            cursor:"pointer", color:"#34D399", fontSize:13, fontWeight:800, fontFamily:FONT,
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
          }}>
            <span style={{ fontSize:16 }}>➕</span>
            <span>友達を追加</span>
          </button>

          {/* 追加済み友達 */}
          {myFriends.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:2, fontWeight:800, marginBottom:8 }}>
                ⭐ 追加した友達 ({myFriends.length}人)
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {myFriends.map((f, i) => (
                  <div key={i} style={{
                    background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
                    borderRadius:10, padding:"8px 12px",
                    display:"flex", alignItems:"center", gap:10,
                  }}>
                    <div style={{ fontSize:22 }}>🎓</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>{f.name || "友達"}</div>
                      <div style={{ fontSize:9, color:"#94a3b8", fontFamily:"monospace" }}>#{f.code}</div>
                    </div>
                    <button onClick={() => setMyFriends(prev => prev.filter((_, idx) => idx !== i))} style={{
                      background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
                      borderRadius:8, padding:"4px 8px", cursor:"pointer",
                      color:"#FCA5A5", fontSize:9, fontFamily:FONT,
                    }}>削除</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* タブ */}
          <div style={{ display:"flex", gap:8, marginBottom:18 }}>
            {["苦手","得意","全員"].map(t => (
              <button key={t} onClick={() => setCommunityTab(t)} style={{
                background:communityTab===t?"rgba(96,165,250,0.12)":"rgba(255,255,255,0.04)",
                border:`1px solid ${communityTab===t?"rgba(96,165,250,0.4)":"rgba(255,255,255,0.08)"}`,
                borderRadius:99, padding:"7px 18px", cursor:"pointer",
                color:communityTab===t?"#60A5FA":"#64748b", fontSize:13, fontWeight:600, fontFamily:FONT,
              }}>{t}</button>
            ))}
          </div>

          {/* オンラインの友達 */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, color:"#64748b", letterSpacing:3, fontWeight:600, marginBottom:10 }}>オンラインの友達</div>
            <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:6 }}>
              {AI_POOL.map(p => (
                <div key={p.id} style={{ textAlign:"center", flexShrink:0 }}>
                  <div style={{ position:"relative", width:60, height:60, borderRadius:18, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, marginBottom:6 }}>
                    {p.avatar}
                    <div style={{ position:"absolute", bottom:2, right:2, width:12, height:12, borderRadius:99, background:"#34D399", border:"2px solid #0a0f1e" }}/>
                  </div>
                  <div style={{ fontSize:11, fontWeight:600, color:"#cbd5e1" }}>{p.name}</div>
                  <div style={{ fontSize:9, color:"#64748b" }}>Lv.{p.level}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ジャンル別ルーム */}
          <div style={{ fontSize:11, color:"#64748b", letterSpacing:3, fontWeight:600, marginBottom:10 }}>ジャンル別ルーム</div>
          {GENRES.map(g => (
            <div key={g.id} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:16, marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <div style={{ width:46, height:46, borderRadius:14, background:`${g.color}15`, border:`1px solid ${g.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{g.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:"#e2e8f0" }}>{g.label}の部屋</div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:1 }}><span style={{ color:"#34D399" }}>●</span> {Math.floor(Math.random()*40)+10}人 オンライン</div>
                </div>
                <button style={{ background:`${g.color}15`, border:`1px solid ${g.color}33`, borderRadius:10, padding:"7px 16px", cursor:"pointer", color:g.color, fontSize:12, fontWeight:600, fontFamily:FONT }}>参加</button>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                {["🦊","🐺","🦋","🐉","🦁"].slice(0,4).map((a,i) => (
                  <div key={i} style={{ width:28, height:28, borderRadius:9, background:"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, border:"1px solid rgba(255,255,255,0.08)" }}>{a}</div>
                ))}
                <span style={{ fontSize:11, color:"#334155", marginLeft:4, alignSelf:"center" }}>+{Math.floor(Math.random()*20)+5}人</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ RANKING ═════════════════════════════════════════ */}
      {screen === S.RANKING && (() => {
        // ランキングデータ準備
        const userEntry = {
          id:99, name:"YOU", avatar:"⭐", rating:userRating, wins:missionProgress.wins||0,
          weeklyXp: getTotalXp(genreXp),
          isUser:true,
          petGenreXp: genreXp, starterColor: starterEgg?.color, hat: equippedHat, aura: equippedAura,
        };
        let entries = [];
        let scoreKey = "rating", scoreLabel = "rating";
        if (rankingTab === "global") {
          entries = [...AI_POOL.map(a => ({ ...a })), userEntry];
          entries.sort((a,b) => (b.rating||0) - (a.rating||0));
          scoreKey = "rating"; scoreLabel = "rating";
        } else if (rankingTab === "weekly") {
          entries = [...AI_POOL.map(a => ({ ...a })), userEntry];
          entries.sort((a,b) => (b.weeklyXp||0) - (a.weeklyXp||0));
          scoreKey = "weeklyXp"; scoreLabel = "週間XP";
        } else {
          // 友達 — AI_POOLのうち3〜5人を「友達」と仮定
          entries = [AI_POOL[0], AI_POOL[2], AI_POOL[4], AI_POOL[6], userEntry].map(a => ({ ...a }));
          entries.sort((a,b) => (b.rating||0) - (a.rating||0));
          scoreKey = "rating"; scoreLabel = "rating";
        }
        const top3 = entries.slice(0, 3);
        const rest = entries.slice(3, 20);
        const myRank = entries.findIndex(e => e.isUser) + 1;

        return (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"32px 18px 24px", animation:"screenEnter 0.4s ease" }}>
          <h2 style={{ margin:"0 0 4px", fontSize:26, fontWeight:800 }}>🏆 ランキング</h2>
          <p style={{ color:"#94a3b8", fontSize:13, margin:"0 0 16px" }}>あなたの順位: <span style={{ color:"#FBBF24", fontWeight:800 }}>#{myRank}</span> / {entries.length}人中</p>

          {/* タブ */}
          <div style={{ display:"flex", gap:6, marginBottom:18, background:"rgba(255,255,255,0.04)", padding:4, borderRadius:12 }}>
            {[
              { id:"global", label:"🌍 全体" },
              { id:"weekly", label:"🔥 週間" },
              { id:"friends",label:"👥 友達" },
            ].map(t => (
              <button key={t.id} onClick={() => setRankingTab(t.id)} style={{
                flex:1, background:rankingTab===t.id?"linear-gradient(135deg, #60A5FA, #818CF8)":"transparent",
                border:"none", borderRadius:9, padding:"8px",
                cursor:"pointer", color:rankingTab===t.id?"#fff":"#cbd5e1",
                fontSize:12, fontWeight:800, fontFamily:FONT,
              }}>{t.label}</button>
            ))}
          </div>

          {/* TOP3 表彰台 */}
          {top3.length >= 3 && (
            <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-end", gap:10, marginBottom:18, padding:"18px 0" }}>
              {[top3[1], top3[0], top3[2]].map((p, idx) => {
                const r = [2,1,3][idx];
                const h = [88,108,72][idx];
                const c = ["#94a3b8","#FBBF24","#b45309"][idx];
                const clickable = !p.isUser && (p.privacy !== "private");
                return (
                  <button key={p.id} onClick={() => clickable && (setViewingUser(p), setScreen(S.USER_PROFILE))} disabled={!clickable} style={{
                    textAlign:"center", flex:1, animation:`rankRow 0.5s ease ${idx*0.15}s both`,
                    background:"transparent", border:"none", padding:0, cursor: clickable?"pointer":"default",
                    fontFamily:FONT,
                  }}>
                    {r===1 && <div style={{ fontSize:20, marginBottom:2 }}>👑</div>}
                    <div style={{ fontSize:r===1?38:32, marginBottom:4, filter:`drop-shadow(0 0 10px ${c}66)` }}>{p.avatar}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:p.isUser?"#60A5FA":"#e2e8f0", marginBottom:2 }}>{p.name}</div>
                    <div style={{ fontSize:12, fontWeight:800, color:c, marginBottom:6 }}>{p[scoreKey]||0}</div>
                    <div style={{ height:h, background:`linear-gradient(180deg, ${c}33, ${c}11)`, border:`1px solid ${c}44`, borderRadius:"10px 10px 0 0", display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:6, fontSize:22, fontWeight:800, color:c }}>{r}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 4位以降 */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"6px 12px" }}>
            {rest.map((p, i) => {
              const r = i + 4;
              const clickable = !p.isUser && (p.privacy !== "private");
              return (
                <button key={p.id} onClick={() => clickable && (setViewingUser(p), setScreen(S.USER_PROFILE))} disabled={!clickable} style={{
                  width:"100%",
                  display:"flex", alignItems:"center", gap:10, padding:"10px 4px",
                  borderBottom:i<rest.length-1?"1px solid rgba(255,255,255,0.04)":"none",
                  background:p.isUser?"rgba(96,165,250,0.08)":"transparent",
                  border:"none", borderRadius:p.isUser?10:0,
                  cursor: clickable?"pointer":"default",
                  fontFamily:FONT, textAlign:"left",
                }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#94a3b8", width:28 }}>#{r}</span>
                  <span style={{ fontSize:22 }}>{p.avatar}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:p.isUser?800:600, color:p.isUser?"#93C5FD":"#cbd5e1" }}>{p.name}</div>
                    {p.privacy === "private" && <div style={{ fontSize:9, color:"#64748b" }}>🔒 非公開</div>}
                  </div>
                  <span style={{ fontSize:13, fontWeight:800, color:"#60A5FA" }}>{p[scoreKey]||0}</span>
                  {clickable && <span style={{ fontSize:14, color:"#475569" }}>›</span>}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize:10, color:"#64748b", textAlign:"center", marginTop:12 }}>
            タップでプロフィール閲覧（非公開ユーザーは見られません）
          </div>
        </div>
        );
      })()}

      {/* ══ PROFILE ═════════════════════════════════════════ */}
      {screen === S.PROFILE && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"22px 18px 24px", animation:"screenEnter 0.4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <h2 style={{ margin:"0 0 2px", fontSize:22, fontWeight:800 }}>プロフィール</h2>
              <p style={{ color:"#94a3b8", fontSize:11, margin:0 }}>あなたの戦績・進化</p>
            </div>
            <button onClick={() => setShowSettings(true)} data-sfx="select" style={{
              background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:11, width:38, height:38, cursor:"pointer",
              color:"#cbd5e1", fontSize:18, fontFamily:FONT,
            }}>⚙️</button>
          </div>

          {/* プロフィールカード（ペットアイコン） */}
          <div style={{ background:"linear-gradient(135deg, rgba(96,165,250,0.1), rgba(167,139,250,0.06))", border:"1px solid rgba(96,165,250,0.2)", borderRadius:22, padding:"24px 20px", marginBottom:16, textAlign:"center" }}>
            {/* ペット（タップで戯れる） */}
            <button data-sfx="none" onClick={() => {
              const reactions = [
                { emoji:"💖", msg:"うれしい！" },
                { emoji:"✨", msg:"もっと撫でて〜" },
                { emoji:"😊", msg:"えへへ" },
                { emoji:"🍖", msg:"おなかすいた" },
                { emoji:"💤", msg:"ねむい..." },
                { emoji:"🎵", msg:"らんらん♪" },
                { emoji:"⭐", msg:"きみが大好き！" },
                { emoji:"🌸", msg:"きれいだね" },
              ];
              const r = reactions[Math.floor(Math.random() * reactions.length)];
              setPetReaction({ ...r, id: Date.now() });
              SFX.coin();
              setTimeout(() => setPetReaction(null), 1800);
            }} style={{
              background:"none", border:"none", padding:0,
              display:"flex", justifyContent:"center", margin:"0 auto 10px",
              cursor:"pointer", position:"relative",
            }}>
              <PetDisplay genreXp={genreXp} size={72} starterEgg={starterEgg} hat={equippedHat ? SHOP_ITEMS.find(i=>i.id===equippedHat)?.icon : null} aura={equippedAura ? SHOP_ITEMS.find(i=>i.id===equippedAura)?.icon : null} />
              {/* 反応の吹き出し */}
              {petReaction && (
                <div style={{
                  position:"absolute", top:-10, right:-20,
                  background:"linear-gradient(135deg, #FBBF24, #F472B6)",
                  color:"#fff", padding:"6px 12px", borderRadius:16,
                  fontSize:12, fontWeight:800, whiteSpace:"nowrap",
                  boxShadow:"0 4px 12px rgba(0,0,0,0.3)",
                  animation:"petReactPop 1.8s ease forwards",
                  pointerEvents:"none", zIndex:10,
                }}>
                  <span style={{ fontSize:14 }}>{petReaction.emoji}</span> {petReaction.msg}
                </div>
              )}
            </button>
            {/* ペット名（タップで編集） */}
            {editingPetName ? (
              <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:6 }}>
                <input
                  type="text"
                  value={tempPetName}
                  onChange={(e) => setTempPetName(e.target.value.slice(0, 12))}
                  placeholder="ペットの名前"
                  autoFocus
                  style={{
                    background:"rgba(255,255,255,0.1)",
                    border:"1px solid rgba(96,165,250,0.5)",
                    borderRadius:8, padding:"4px 10px",
                    fontSize:16, fontWeight:800, color:"#fff", textAlign:"center",
                    width:140, fontFamily:FONT, outline:"none",
                  }}
                />
                <button onClick={() => { setPetName(tempPetName.trim() || "YOU"); setEditingPetName(false); SFX.claim(); }} style={{
                  background:"#34D399", border:"none", borderRadius:8, padding:"4px 10px",
                  cursor:"pointer", color:"#0f172a", fontSize:12, fontWeight:800, fontFamily:FONT,
                }}>OK</button>
              </div>
            ) : (
              <button data-sfx="select" onClick={() => { setTempPetName(petName || "YOU"); setEditingPetName(true); }} style={{
                background:"none", border:"none", padding:0, cursor:"pointer",
                fontSize:20, fontWeight:800, marginBottom:6, color:"#fff", fontFamily:FONT,
                display:"inline-flex", alignItems:"center", gap:6,
              }}>
                {petName || "YOU"} <span style={{ fontSize:11, opacity:0.6 }}>✏️</span>
              </button>
            )}
            {equippedTitle && (() => {
              const t = SHOP_ITEMS.find(i => i.id === equippedTitle);
              return t ? <div style={{ fontSize:13, fontWeight:700, color:"#FBBF24", marginBottom:8 }}>{t.icon} {t.name}</div> : null;
            })()}
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${getRank(userRating).color}22`, border:`1px solid ${getRank(userRating).color}66`, borderRadius:99, padding:"4px 14px", fontSize:12, fontWeight:700, color:getRank(userRating).color, marginRight:6 }}>
              {getRank(userRating).icon} {getRank(userRating).name}
            </div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(167,139,250,0.15)", border:"1px solid rgba(167,139,250,0.3)", borderRadius:99, padding:"4px 14px", fontSize:12, fontWeight:700, color:"#a78bfa" }}>
              ペットLv.{getStage(getTotalXp(genreXp))}
            </div>
            <div style={{ fontSize:10, color:"#64748b", marginTop:10 }}>👆 ペットをタップして戯れよう</div>
          </div>

          {/* プレイヤーレベルカード */}
          {(() => {
            const totalXp = Object.values(genreXp).reduce((s,v) => s + v, 0);
            const prog = calcLevelProgress(totalXp, playerLevel);
            const isElite = playerLevel >= 100;
            const isMaster = playerLevel >= 1000;
            const nextMilestone = playerLevel < 10 ? 10 
                                : playerLevel < 100 ? Math.ceil((playerLevel+1)/10)*10
                                : playerLevel < 1000 ? Math.ceil((playerLevel+1)/100)*100
                                : Math.ceil((playerLevel+1)/1000)*1000;
            return (
              <div style={{
                background: isMaster 
                  ? "linear-gradient(135deg, rgba(251,191,36,0.18), rgba(244,114,182,0.12), rgba(167,139,250,0.08))"
                  : isElite 
                  ? "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(96,165,250,0.08))"
                  : "linear-gradient(135deg, rgba(96,165,250,0.12), rgba(96,165,250,0.04))",
                border: isMaster 
                  ? "1.5px solid rgba(251,191,36,0.5)"
                  : isElite 
                  ? "1.5px solid rgba(167,139,250,0.4)"
                  : "1px solid rgba(96,165,250,0.3)",
                borderRadius:16, padding:"14px 16px", marginBottom:14,
                boxShadow: isMaster 
                  ? "0 0 24px rgba(251,191,36,0.25)"
                  : isElite 
                  ? "0 0 16px rgba(167,139,250,0.2)" 
                  : "none",
                position:"relative", overflow:"hidden",
              }}>
                {isElite && (
                  <div style={{ position:"absolute", top:0, right:0, fontSize:40, opacity:0.1 }}>
                    {isMaster ? "👑" : "⭐"}
                  </div>
                )}
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                  <div style={{
                    width:56, height:56, borderRadius:14,
                    background: isMaster 
                      ? "linear-gradient(135deg, #FBBF24, #F472B6, #A78BFA)"
                      : isElite 
                      ? "linear-gradient(135deg, #A78BFA, #8B5CF6)" 
                      : playerLevel >= 50
                      ? "linear-gradient(135deg, #60A5FA, #3B82F6)"
                      : playerLevel >= 10
                      ? "linear-gradient(135deg, #34D399, #10B981)"
                      : "linear-gradient(135deg, #60A5FA, #A78BFA)",
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    color:"#fff", fontFamily:FONT,
                    boxShadow: `0 4px 14px ${isMaster ? "rgba(251,191,36,0.4)" : "rgba(167,139,250,0.3)"}`,
                  }}>
                    <div style={{ fontSize:8, fontWeight:800, opacity:0.9 }}>LV</div>
                    <div style={{ fontSize:22, fontWeight:900, lineHeight:1 }}>{playerLevel}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, color: isMaster ? "#FBBF24" : isElite ? "#A78BFA" : "#60A5FA", letterSpacing:2, fontWeight:800 }}>
                      {isMaster ? "👑 MASTER" : isElite ? "⭐ ELITE" : "🎯 LEVEL"}
                    </div>
                    <div style={{ fontSize:14, fontWeight:800, color:"#fff", marginBottom:4 }}>
                      プレイヤーレベル {playerLevel}
                    </div>
                    <div style={{ fontSize:10, color:"#94a3b8" }}>
                      累計XP {totalXp.toLocaleString()} · 次のマイルストーン: Lv{nextMilestone}
                    </div>
                  </div>
                </div>
                {/* プログレスバー */}
                <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:8, overflow:"hidden", marginBottom:4 }}>
                  <div style={{
                    width:`${prog.progress * 100}%`, height:"100%",
                    background: isMaster 
                      ? "linear-gradient(90deg, #FBBF24, #F472B6, #A78BFA)"
                      : isElite 
                      ? "linear-gradient(90deg, #A78BFA, #8B5CF6)" 
                      : "linear-gradient(90deg, #60A5FA, #A78BFA)",
                    transition:"width 0.5s ease",
                    boxShadow: isMaster ? "0 0 12px #FBBF24" : isElite ? "0 0 8px #A78BFA" : "none",
                  }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#94a3b8" }}>
                  <span>次のレベルまで</span>
                  <span><span style={{ color: isMaster ? "#FBBF24" : "#A78BFA", fontWeight:800 }}>{prog.xpForNext - prog.xpInLevel}</span> XP</span>
                </div>
              </div>
            );
          })()}

          {/* スタッツ（新項目） */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            {[
              {label:"勝利数",    val:Object.values(missionProgress).reduce((a,b)=>typeof b==="number"?a+b:a,0) > 0 ? (missionProgress.wins||0) : 12, c:"#60A5FA"},
              {label:"勝率",      val:"58%", c:"#34D399"},
              {label:"ボス撃破",  val:"7",   c:"#F472B6"},
              {label:"エンドレス最高", val:Math.max(0, ...Object.values(endlessBest)), c:"#FBBF24"},
            ].map((s,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"14px 16px" }}>
                <div style={{ fontSize:24, fontWeight:800, color:s.c, marginBottom:2 }}>{s.val}</div>
                <div style={{ fontSize:11, color:"#cbd5e1", fontWeight:600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* 称号セクション */}
          {(() => {
            const totalCorrect = answerHistory.filter(h => h.correct).length;
            const unlocked = checkTitleUnlocks(genreXp, totalCorrect, maxCorrectStreak, loginStreak, userRating, ownedItems, {
              hasPetName: !!(petName && petName.trim().length > 0),
              petsUnlocked: unlockedPets.length,
              bossKills,
              legendItems,
              playerLevel,
            });
            const unlockedTitles = TITLES.filter(t => unlocked.includes(t.id));
            const currentTitle = selectedTitle ? TITLES.find(t => t.id === selectedTitle) : null;
            return (
              <div style={{ background:"linear-gradient(135deg, rgba(251,191,36,0.08), rgba(244,114,182,0.04))", border:"1px solid rgba(251,191,36,0.2)", borderRadius:18, padding:"14px 16px", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ fontSize:11, color:"#FBBF24", letterSpacing:2, fontWeight:800 }}>🏷️ 称号</div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>{unlocked.length} / {TITLES.length} 獲得</div>
                </div>
                {/* 装備中の称号 */}
                {currentTitle && (
                  <div style={{
                    background:`linear-gradient(135deg, ${currentTitle.color}22, rgba(0,0,0,0.2))`,
                    border:`1.5px solid ${currentTitle.color}`,
                    borderRadius:10, padding:"8px 12px", marginBottom:10,
                    display:"flex", alignItems:"center", gap:8,
                  }}>
                    <span style={{ fontSize:20 }}>{currentTitle.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:800, color: currentTitle.color }}>{currentTitle.label}</div>
                      <div style={{ fontSize:9, color:"#94a3b8" }}>{currentTitle.desc}</div>
                    </div>
                    <button onClick={() => setSelectedTitle(null)} style={{
                      background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:8, padding:"4px 8px", cursor:"pointer",
                      color:"#94a3b8", fontSize:9, fontFamily:FONT,
                    }}>外す</button>
                  </div>
                )}
                {/* 称号一覧（横スクロール） */}
                <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4 }}>
                  {TITLES.map(t => {
                    const isUnlocked = unlocked.includes(t.id);
                    const isSelected = selectedTitle === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => isUnlocked && setSelectedTitle(isSelected ? null : t.id)}
                        disabled={!isUnlocked}
                        style={{
                          flexShrink:0,
                          background: isSelected ? `${t.color}33` : isUnlocked ? `${t.color}15` : "rgba(255,255,255,0.03)",
                          border: `1.5px solid ${isSelected ? t.color : isUnlocked ? t.color+"55" : "rgba(255,255,255,0.05)"}`,
                          borderRadius:10, padding:"6px 8px",
                          cursor: isUnlocked ? "pointer" : "not-allowed",
                          color: isUnlocked ? t.color : "#475569",
                          fontFamily:FONT, textAlign:"center",
                          opacity: isUnlocked ? 1 : 0.4,
                          minWidth:60,
                        }}
                      >
                        <div style={{ fontSize:16, marginBottom:2, filter: isUnlocked ? "none" : "grayscale(1)" }}>{isUnlocked ? t.icon : "🔒"}</div>
                        <div style={{ fontSize:8, fontWeight:800, lineHeight:1.2 }}>{isUnlocked ? t.label : "???"}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ペット情報 */}
          <div style={{ background:"linear-gradient(135deg, rgba(167,139,250,0.08), rgba(96,165,250,0.04))", border:"1px solid rgba(167,139,250,0.2)", borderRadius:20, padding:"18px", marginBottom:16 }}>
            <div style={{ fontSize:11, color:"#a78bfa", letterSpacing:3, fontWeight:700, marginBottom:14 }}>育成中のペット</div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ minWidth:80, display:"flex", justifyContent:"center" }}>
                <PetDisplay genreXp={genreXp} size={64} starterEgg={starterEgg} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:16, fontWeight:800, marginBottom:3, color:"#fff" }}>{getPetTitle(genreXp)}</div>
                <div style={{ fontSize:11, color:"#94a3b8", marginBottom:8 }}>Stage {getStage(getTotalXp(genreXp))} / 5</div>
                <HPBar hp={getTotalXp(genreXp)} maxHp={getNextStageXp(getTotalXp(genreXp))} color="#a78bfa" />
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:5, fontSize:11, color:"#94a3b8" }}>
                  <span>{getTotalXp(genreXp)} XP</span><span>あと {Math.max(0, getNextStageXp(getTotalXp(genreXp)) - getTotalXp(genreXp))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* エンドレス記録 */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:3, fontWeight:700, marginBottom:12 }}>🔥 エンドレス最高記録</div>
            {ENDLESS_MODES.map(m => {
              const best = endlessBest[m.id] || 0;
              return (
                <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <PixelIcon name={m.icon} size={16} color={m.color}/>
                  <span style={{ flex:1, fontSize:13, fontWeight:600, color:"#cbd5e1" }}>{m.label}</span>
                  <span style={{ fontSize:14, fontWeight:800, color:m.color }}>{best}</span>
                </div>
              );
            })}
          </div>

          {/* 教科別 マイレベル */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:"16px 18px", marginBottom:12 }}>
            <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:3, fontWeight:700, marginBottom:14 }}>⭐ 教科別 マイレベル</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {GENRES.map(g => {
                const xp = (genreXp || {})[g.id] || 0;
                const lv = getGenreLevel(xp);
                const prog = getGenreLevelProgress(xp);
                return (
                  <div key={g.id} style={{
                    background:`${g.color}10`, border:`1px solid ${g.color}30`,
                    borderRadius:12, padding:"10px 12px",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                      <span style={{ fontSize:14 }}>{g.icon}</span>
                      <span style={{ fontSize:11, color:"#cbd5e1", fontWeight:700, flex:1 }}>{g.label}</span>
                      <span style={{ fontSize:13, color:g.color, fontWeight:900 }}>LV{lv}</span>
                    </div>
                    <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:5, overflow:"hidden", marginBottom:3 }}>
                      <div style={{ width:`${prog*100}%`, height:"100%", background:`linear-gradient(90deg, ${g.color}, ${shade(g.color, 30)})`, transition:"width 0.5s", borderRadius:99 }}/>
                    </div>
                    <div style={{ fontSize:9, color:"#94a3b8", textAlign:"right" }}>
                      {xp % 100}/100 XP
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 学習レポート（週次・月次） */}
          {(() => {
            const now = Date.now();
            const dayMs = 24 * 60 * 60 * 1000;
            const weekAgo = now - 7 * dayMs;
            const monthAgo = now - 30 * dayMs;
            const weekData = answerHistory.filter(h => h.timestamp >= weekAgo);
            const monthData = answerHistory.filter(h => h.timestamp >= monthAgo);
            const weekCorrect = weekData.filter(h => h.correct).length;
            const monthCorrect = monthData.filter(h => h.correct).length;
            const weekRate = weekData.length > 0 ? Math.round((weekCorrect / weekData.length) * 100) : 0;
            const monthRate = monthData.length > 0 ? Math.round((monthCorrect / monthData.length) * 100) : 0;
            const byGenre = {};
            weekData.forEach(h => {
              if (!byGenre[h.genre]) byGenre[h.genre] = 0;
              if (h.correct) byGenre[h.genre]++;
            });
            const topGenre = Object.entries(byGenre).sort((a,b) => b[1]-a[1])[0];
            const topGenreInfo = topGenre ? GENRES.find(g => g.id === topGenre[0]) : null;
            const dailyAvg = weekData.length > 0 ? Math.round(weekData.length / 7) : 0;
            return (
              <div style={{ background:"linear-gradient(135deg, rgba(96,165,250,0.08), rgba(167,139,250,0.04))", border:"1px solid rgba(96,165,250,0.2)", borderRadius:18, padding:"14px 16px", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <span style={{ fontSize:18 }}>📊</span>
                  <div style={{ fontSize:11, color:"#60A5FA", letterSpacing:3, fontWeight:800 }}>学習レポート</div>
                </div>
                <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:12, padding:"10px 12px", marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <span style={{ fontSize:10, color:"#60A5FA", fontWeight:800, letterSpacing:2 }}>📅 今週（7日間）</span>
                    <span style={{ fontSize:8, color:"#94a3b8" }}>1日平均 {dailyAvg}問</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>{weekData.length}</div>
                      <div style={{ fontSize:8, color:"#94a3b8", fontWeight:700 }}>挑戦数</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:18, fontWeight:900, color:"#34D399" }}>{weekCorrect}</div>
                      <div style={{ fontSize:8, color:"#94a3b8", fontWeight:700 }}>正解</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:18, fontWeight:900, color:"#FBBF24" }}>{weekRate}%</div>
                      <div style={{ fontSize:8, color:"#94a3b8", fontWeight:700 }}>正答率</div>
                    </div>
                  </div>
                  {topGenreInfo && (
                    <div style={{ marginTop:8, padding:"6px 10px", background:`${topGenreInfo.color}15`, border:`1px solid ${topGenreInfo.color}40`, borderRadius:8, fontSize:10, color:topGenreInfo.color, fontWeight:700, textAlign:"center" }}>
                      🏆 今週のメイン: {topGenreInfo.icon} {topGenreInfo.label}（{topGenre[1]}問正解）
                    </div>
                  )}
                </div>
                <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:12, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, color:"#A78BFA", fontWeight:800, letterSpacing:2, marginBottom:8 }}>📆 今月（30日間）</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>{monthData.length}</div>
                      <div style={{ fontSize:8, color:"#94a3b8", fontWeight:700 }}>挑戦数</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:18, fontWeight:900, color:"#34D399" }}>{monthCorrect}</div>
                      <div style={{ fontSize:8, color:"#94a3b8", fontWeight:700 }}>正解</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:18, fontWeight:900, color:"#FBBF24" }}>{monthRate}%</div>
                      <div style={{ fontSize:8, color:"#94a3b8", fontWeight:700 }}>正答率</div>
                    </div>
                  </div>
                </div>
                {weekData.length === 0 && (
                  <div style={{ marginTop:8, fontSize:10, color:"#64748b", textAlign:"center", fontStyle:"italic" }}>
                    今週はまだ学習データがありません。バトルしよう！
                  </div>
                )}
              </div>
            );
          })()}

          {/* 連続日数達成カレンダー（草表示） */}
          {(() => {
            // 過去 12週 = 84日 のグリッド
            const weeks = 12;
            const days = weeks * 7;
            const dayMs = 24 * 60 * 60 * 1000;
            const now = new Date();
            // 今日の曜日基準で並べる
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const cells = [];
            for (let i = days - 1; i >= 0; i--) {
              const d = new Date(today.getTime() - i * dayMs);
              const dateStr = d.toISOString().slice(0, 10);
              // 学習データ取得
              const studyMin = studyTimeByDate[dateStr] || 0;
              const dayAnswers = answerHistory.filter(h => {
                const hd = new Date(h.timestamp);
                return hd.getFullYear() === d.getFullYear() && hd.getMonth() === d.getMonth() && hd.getDate() === d.getDate();
              }).length;
              // 活動度: 0=何もない, 1=1-2問, 2=3-9問, 3=10-29問, 4=30+
              let level = 0;
              if (dayAnswers >= 30 || studyMin >= 30) level = 4;
              else if (dayAnswers >= 10 || studyMin >= 15) level = 3;
              else if (dayAnswers >= 3 || studyMin >= 5) level = 2;
              else if (dayAnswers >= 1 || studyMin >= 1) level = 1;
              cells.push({ date: d, dateStr, level, count: dayAnswers, min: studyMin });
            }
            // 連続日数
            let currentStreak = 0;
            for (let i = cells.length - 1; i >= 0; i--) {
              if (cells[i].level > 0) currentStreak++;
              else break;
            }
            // 最長連続
            let maxStreak = 0, tempStreak = 0;
            cells.forEach(c => {
              if (c.level > 0) { tempStreak++; maxStreak = Math.max(maxStreak, tempStreak); }
              else tempStreak = 0;
            });
            // 累計活動日
            const activeDays = cells.filter(c => c.level > 0).length;
            const colorOf = (lv) => {
              const colors = [
                "rgba(255,255,255,0.04)",         // 0
                "rgba(52,211,153,0.25)",         // 1
                "rgba(52,211,153,0.5)",          // 2
                "rgba(52,211,153,0.75)",         // 3
                "#34D399",                       // 4
              ];
              return colors[lv];
            };
            // 7行 × 12列のグリッドに並べ替え（曜日が縦軸）
            // cells は古い順に並んでる、グリッドは「左→右」が週、「上→下」が曜日
            const grid = [];
            for (let row = 0; row < 7; row++) {
              const weekRow = [];
              for (let col = 0; col < weeks; col++) {
                const idx = col * 7 + row;
                if (idx < cells.length) weekRow.push(cells[idx]);
                else weekRow.push(null);
              }
              grid.push(weekRow);
            }
            return (
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:"14px 16px", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:16 }}>🌱</span>
                  <div style={{ fontSize:11, color:"#34D399", letterSpacing:3, fontWeight:800 }}>学習カレンダー</div>
                </div>
                {/* 統計 */}
                <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                  <div style={{ flex:1, background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.25)", borderRadius:10, padding:"8px 6px", textAlign:"center" }}>
                    <div style={{ fontSize:22, fontWeight:900, color:"#34D399", lineHeight:1 }}>{currentStreak}</div>
                    <div style={{ fontSize:8, color:"#94a3b8", marginTop:3 }}>連続日数</div>
                  </div>
                  <div style={{ flex:1, background:"rgba(96,165,250,0.1)", border:"1px solid rgba(96,165,250,0.25)", borderRadius:10, padding:"8px 6px", textAlign:"center" }}>
                    <div style={{ fontSize:22, fontWeight:900, color:"#60A5FA", lineHeight:1 }}>{maxStreak}</div>
                    <div style={{ fontSize:8, color:"#94a3b8", marginTop:3 }}>最長</div>
                  </div>
                  <div style={{ flex:1, background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.25)", borderRadius:10, padding:"8px 6px", textAlign:"center" }}>
                    <div style={{ fontSize:22, fontWeight:900, color:"#A78BFA", lineHeight:1 }}>{activeDays}</div>
                    <div style={{ fontSize:8, color:"#94a3b8", marginTop:3 }}>学習日</div>
                  </div>
                </div>
                {/* グリッド */}
                <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:10, padding:"8px 6px", overflowX:"auto" }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                    {grid.map((row, ri) => (
                      <div key={ri} style={{ display:"flex", gap:2 }}>
                        {row.map((cell, ci) => (
                          <div key={ci} title={cell ? `${cell.dateStr}: ${cell.count}問` : ""} style={{
                            width:"calc((100% - 22px) / 12)",
                            aspectRatio:"1/1",
                            background: cell ? colorOf(cell.level) : "transparent",
                            borderRadius:3,
                            border: cell && cell.level > 0 ? "1px solid rgba(52,211,153,0.3)" : "none",
                            transition:"background 0.3s",
                          }}/>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                {/* 凡例 */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:4, marginTop:8, fontSize:8, color:"#94a3b8" }}>
                  <span>少ない</span>
                  {[0,1,2,3,4].map(lv => (
                    <div key={lv} style={{ width:9, height:9, background:colorOf(lv), borderRadius:2, border:"1px solid rgba(255,255,255,0.06)" }}/>
                  ))}
                  <span>多い</span>
                </div>
              </div>
            );
          })()}

          {/* XP推移グラフ（過去14日間） */}
          {(() => {
            // 過去14日のデータ
            const dates = [];
            const dayMs = 24 * 60 * 60 * 1000;
            const now = Date.now();
            for (let i = 13; i >= 0; i--) {
              const d = new Date(now - i * dayMs);
              dates.push(d.toISOString().slice(0, 10));
            }
            // 各日のXP合計（履歴がない日は前日値を引き継ぎ）
            let lastXp = { english:0, math:0, japanese:0, social:0, science:0, history:0 };
            const dailyXp = dates.map(d => {
              const snap = xpHistoryByDate[d];
              if (snap) {
                lastXp = { ...lastXp, ...snap };
                return { date:d, ...lastXp };
              }
              return { date:d, ...lastXp };
            });
            // 最大値
            const maxXp = Math.max(1, ...dailyXp.flatMap(d => GENRES.map(g => d[g.id] || 0)));
            // 何かしらデータあるか
            const hasData = dailyXp.some(d => GENRES.some(g => (d[g.id] || 0) > 0));
            if (!hasData) return null;
            return (
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:"14px 16px", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:16 }}>📈</span>
                  <div style={{ fontSize:11, color:"#A78BFA", letterSpacing:3, fontWeight:800 }}>XP推移（14日間）</div>
                </div>
                {/* SVGライングラフ */}
                <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:10, padding:"10px 6px", marginBottom:8 }}>
                  <svg viewBox="0 0 280 100" style={{ width:"100%", height:90 }}>
                    {/* グリッド線 */}
                    {[0,25,50,75,100].map(y => (
                      <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                    ))}
                    {/* 各教科のライン */}
                    {GENRES.map(g => {
                      const points = dailyXp.map((d, i) => {
                        const x = (i / (dailyXp.length - 1)) * 280;
                        const xp = d[g.id] || 0;
                        const y = 100 - (xp / maxXp) * 95;
                        return `${x},${y}`;
                      }).join(" ");
                      const hasG = dailyXp.some(d => (d[g.id] || 0) > 0);
                      if (!hasG) return null;
                      return (
                        <polyline
                          key={g.id}
                          points={points}
                          fill="none"
                          stroke={g.color}
                          strokeWidth="2"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          style={{ filter:`drop-shadow(0 0 3px ${g.color})` }}
                        />
                      );
                    })}
                  </svg>
                </div>
                {/* 凡例 */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, fontSize:9 }}>
                  {GENRES.filter(g => dailyXp.some(d => (d[g.id] || 0) > 0)).map(g => (
                    <div key={g.id} style={{ display:"flex", alignItems:"center", gap:3 }}>
                      <div style={{ width:8, height:2, background:g.color, borderRadius:1 }}/>
                      <span style={{ color:"#94a3b8", fontWeight:700 }}>{g.icon}{g.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:8, color:"#64748b", marginTop:6, textAlign:"center" }}>
                  {dates[0].slice(5)} 〜 {dates[dates.length-1].slice(5)}
                </div>
              </div>
            );
          })()}

          {/* 苦手分野ヒートマップ */}
          {(() => {
            // 教科 × 分野 のマトリクスで正答率
            if (answerHistory.length < 5) return null; // データ少なすぎる場合は非表示
            const matrix = {};
            answerHistory.forEach(h => {
              const g = h.genre;
              if (!matrix[g]) matrix[g] = { total:0, correct:0 };
              matrix[g].total++;
              if (h.correct) matrix[g].correct++;
            });
            const cells = GENRES.map(g => {
              const d = matrix[g.id] || { total:0, correct:0 };
              const rate = d.total > 0 ? d.correct / d.total : null;
              return { ...g, total: d.total, rate };
            });
            // 色: 緑（高）→黄→赤（低）
            const colorOf = (rate) => {
              if (rate === null) return "rgba(255,255,255,0.04)";
              if (rate >= 0.8) return "rgba(52,211,153,0.4)";
              if (rate >= 0.6) return "rgba(96,165,250,0.4)";
              if (rate >= 0.4) return "rgba(251,191,36,0.4)";
              return "rgba(239,68,68,0.4)";
            };
            // 弱い順
            const weakSorted = cells.filter(c => c.rate !== null).sort((a, b) => a.rate - b.rate);
            const weakest = weakSorted[0];
            return (
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:"14px 16px", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:16 }}>🔥</span>
                  <div style={{ fontSize:11, color:"#EF4444", letterSpacing:3, fontWeight:800 }}>弱点ヒートマップ</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:10 }}>
                  {cells.map(c => (
                    <div key={c.id} style={{
                      background: colorOf(c.rate),
                      border:`1.5px solid ${c.rate !== null && c.rate < 0.5 ? "#EF4444" : `${c.color}33`}`,
                      borderRadius:10, padding:"8px 6px",
                      textAlign:"center",
                      position:"relative",
                    }}>
                      {c.rate !== null && c.rate < 0.5 && (
                        <div style={{
                          position:"absolute", top:-4, right:-4,
                          background:"#EF4444", color:"#fff",
                          fontSize:8, fontWeight:900,
                          padding:"1px 5px", borderRadius:99,
                          animation:"pulse 1.5s ease-in-out infinite",
                        }}>!</div>
                      )}
                      <div style={{ fontSize:18 }}>{c.icon}</div>
                      <div style={{ fontSize:9, color:"#fff", fontWeight:800, marginTop:2 }}>{c.label}</div>
                      <div style={{ fontSize:13, color: c.rate === null ? "#64748b" : "#fff", fontWeight:900, marginTop:3 }}>
                        {c.rate === null ? "—" : `${Math.round(c.rate*100)}%`}
                      </div>
                      <div style={{ fontSize:8, color:"#cbd5e1", opacity:0.7 }}>{c.total}問</div>
                    </div>
                  ))}
                </div>
                {/* 凡例 */}
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:8, color:"#94a3b8", marginBottom:8 }}>
                  <span style={{ display:"flex", alignItems:"center", gap:2 }}>
                    <span style={{ width:8, height:8, background:"rgba(239,68,68,0.6)", borderRadius:2 }}/>苦手 &lt;40%
                  </span>
                  <span style={{ display:"flex", alignItems:"center", gap:2 }}>
                    <span style={{ width:8, height:8, background:"rgba(251,191,36,0.6)", borderRadius:2 }}/>40-60%
                  </span>
                  <span style={{ display:"flex", alignItems:"center", gap:2 }}>
                    <span style={{ width:8, height:8, background:"rgba(96,165,250,0.6)", borderRadius:2 }}/>60-80%
                  </span>
                  <span style={{ display:"flex", alignItems:"center", gap:2 }}>
                    <span style={{ width:8, height:8, background:"rgba(52,211,153,0.6)", borderRadius:2 }}/>得意 80%+
                  </span>
                </div>
                {weakest && weakest.rate < 0.6 && (
                  <button onClick={() => { startBattle(weakest.id, false, "solo"); }} style={{
                    width:"100%", background: `linear-gradient(135deg, ${weakest.color}25, ${weakest.color}10)`,
                    border:`1px solid ${weakest.color}55`, borderRadius:10, padding:"8px",
                    cursor:"pointer", color: weakest.color, fontSize:11, fontWeight:800, fontFamily:FONT,
                  }}>
                    💪 {weakest.label}を集中練習する →
                  </button>
                )}
              </div>
            );
          })()}

          {/* 教科別 正答率グラフ */}
          {answerHistory.length > 0 && (() => {
            const byGenre = {};
            answerHistory.forEach(h => {
              if (!byGenre[h.genre]) byGenre[h.genre] = { total:0, correct:0 };
              byGenre[h.genre].total++;
              if (h.correct) byGenre[h.genre].correct++;
            });
            const genreStats = GENRES.map(g => {
              const d = byGenre[g.id] || { total:0, correct:0 };
              const rate = d.total > 0 ? Math.round((d.correct / d.total) * 100) : null;
              return { ...g, total:d.total, rate };
            }).filter(g => g.total > 0);
            // 苦手分野（正答率最低、3問以上やってる教科）
            const weakest = [...genreStats].filter(g => g.total >= 3).sort((a,b) => a.rate - b.rate)[0];
            return (
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:"16px 18px", marginBottom:12 }}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:3, fontWeight:700, marginBottom:14 }}>📊 教科別 正答率</div>
                {genreStats.map(g => (
                  <div key={g.id} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
                      <span style={{ color:"#cbd5e1", fontWeight:700 }}>{g.icon} {g.label}</span>
                      <span style={{ color:g.color, fontWeight:800 }}>{g.rate}% <span style={{ color:"#64748b", fontWeight:600 }}>({g.total}問)</span></span>
                    </div>
                    <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:7, overflow:"hidden" }}>
                      <div style={{ width:`${g.rate}%`, height:"100%", background:`linear-gradient(90deg, ${g.color}, ${shade(g.color, 20)})`, transition:"width 0.5s", borderRadius:99 }}/>
                    </div>
                  </div>
                ))}
                {/* 苦手おすすめ */}
                {weakest && weakest.rate < 70 && (
                  <div style={{ marginTop:14, background:`${weakest.color}15`, border:`1px solid ${weakest.color}40`, borderRadius:12, padding:"10px 12px", display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ fontSize:22 }}>{weakest.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:10, color:"#94a3b8", fontWeight:700 }}>💡 おすすめ</div>
                      <div style={{ fontSize:12, color:"#f8fafc", fontWeight:700 }}>{weakest.label}が苦手かも。練習しよう！</div>
                    </div>
                    <button onClick={() => { setScreen(S.HOME); }} style={{
                      background:weakest.color, border:"none", borderRadius:8, padding:"6px 12px",
                      cursor:"pointer", color:"#0f172a", fontSize:11, fontWeight:800, fontFamily:FONT,
                    }}>挑戦</button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* AIチューター・学習目標 2ボタン */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
            <button onClick={() => setShowTutor(true)} disabled={offlineMode} style={{
              background: offlineMode ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(129,140,248,0.08))",
              border: `1px solid ${offlineMode ? "rgba(255,255,255,0.06)" : "rgba(167,139,250,0.4)"}`,
              borderRadius:14, padding:"12px 10px",
              cursor: offlineMode ? "not-allowed" : "pointer",
              opacity: offlineMode ? 0.5 : 1,
              color:"#f8fafc", textAlign:"left", fontFamily:FONT,
              display:"flex", alignItems:"center", gap:10,
            }}>
              <div style={{ fontSize:24 }}>🤖</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:800 }}>AI チューター</div>
                <div style={{ fontSize:9, color:"#94a3b8" }}>質問してみる</div>
              </div>
            </button>
            <button onClick={() => setShowGoalSettings(true)} style={{
              background:"linear-gradient(135deg, rgba(96,165,250,0.18), rgba(52,211,153,0.08))",
              border:"1px solid rgba(96,165,250,0.4)",
              borderRadius:14, padding:"12px 10px",
              cursor:"pointer", color:"#f8fafc", textAlign:"left", fontFamily:FONT,
              display:"flex", alignItems:"center", gap:10,
            }}>
              <div style={{ fontSize:24 }}>🎯</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:800 }}>学習目標</div>
                <div style={{ fontSize:9, color:"#94a3b8" }}>週{weeklyGoal.target}問</div>
              </div>
            </button>
          </div>

          {/* AI学習診断 */}
          <div style={{
            background:"linear-gradient(135deg, rgba(167,139,250,0.15), rgba(96,165,250,0.08))",
            border:"1px solid rgba(167,139,250,0.3)",
            borderRadius:18, padding:"16px 18px", marginBottom:12,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ fontSize:24 }}>🤖</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#a78bfa" }}>AI学習診断</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>これまでの解答からあなたの傾向を分析</div>
              </div>
            </div>

            {aiAnalysis && !aiAnalysis.error && (
              <div style={{ animation:"fadeIn 0.4s ease" }}>
                {aiAnalysis.strongPoints?.length > 0 && (
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:10, color:"#34D399", fontWeight:800, letterSpacing:2, marginBottom:4 }}>💪 得意なこと</div>
                    {aiAnalysis.strongPoints.map((p, i) => (
                      <div key={i} style={{ fontSize:12, color:"#cbd5e1", padding:"4px 10px", background:"rgba(52,211,153,0.1)", borderLeft:"3px solid #34D399", borderRadius:"0 8px 8px 0", marginBottom:4 }}>{p}</div>
                    ))}
                  </div>
                )}
                {aiAnalysis.weakPoints?.length > 0 && (
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:10, color:"#FBBF24", fontWeight:800, letterSpacing:2, marginBottom:4 }}>📝 ここを伸ばそう</div>
                    {aiAnalysis.weakPoints.map((p, i) => (
                      <div key={i} style={{ fontSize:12, color:"#cbd5e1", padding:"4px 10px", background:"rgba(251,191,36,0.1)", borderLeft:"3px solid #FBBF24", borderRadius:"0 8px 8px 0", marginBottom:4 }}>{p}</div>
                    ))}
                  </div>
                )}
                {aiAnalysis.advice && (
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:10, color:"#60A5FA", fontWeight:800, letterSpacing:2, marginBottom:4 }}>💡 アドバイス</div>
                    <div style={{ fontSize:12, color:"#e2e8f0", lineHeight:1.6, padding:"8px 12px", background:"rgba(96,165,250,0.08)", borderRadius:10 }}>{aiAnalysis.advice}</div>
                  </div>
                )}
                {aiAnalysis.encouragement && (
                  <div style={{ fontSize:13, color:"#a78bfa", fontWeight:700, textAlign:"center", padding:"8px", background:"rgba(167,139,250,0.1)", borderRadius:10, marginBottom:8 }}>
                    ✨ {aiAnalysis.encouragement}
                  </div>
                )}
              </div>
            )}
            {aiAnalysis?.error && (
              <div style={{
                background:"linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))",
                border:"1px solid rgba(239,68,68,0.3)",
                borderRadius:12, padding:"10px 12px", marginBottom:10,
              }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:6 }}>
                  <span style={{ fontSize:14 }}>⚠️</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, color:"#FCA5A5", fontWeight:800, marginBottom:3 }}>エラーが発生しました</div>
                    <div style={{ fontSize:10, color:"#fecaca", lineHeight:1.5 }}>{aiAnalysis.error}</div>
                  </div>
                </div>
                <button onClick={() => { setAiAnalysis(null); runAIAnalysis(); }} style={{
                  width:"100%", marginTop:8,
                  background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.4)",
                  borderRadius:8, padding:"6px", cursor:"pointer",
                  color:"#FCA5A5", fontSize:10, fontWeight:800, fontFamily:FONT,
                }}>🔄 もう一度試す</button>
              </div>
            )}

            <button onClick={runAIAnalysis} disabled={analysisLoading || offlineMode} style={{
              width:"100%",
              background: offlineMode ? "rgba(255,255,255,0.04)" : analysisLoading ? "rgba(167,139,250,0.2)" : "linear-gradient(135deg, #A78BFA, #818CF8)",
              border: offlineMode ? "1px solid rgba(255,255,255,0.08)" : "none",
              borderRadius:12, padding:"12px",
              cursor: (analysisLoading || offlineMode) ? "not-allowed" : "pointer",
              color: offlineMode ? "#64748b" : "#fff", fontSize:13, fontWeight:800, fontFamily:FONT,
              boxShadow: (analysisLoading || offlineMode) ? "none" : "0 4px 14px rgba(167,139,250,0.4)",
            }}>
              {offlineMode ? "🔒 オフライン中（AI診断はオンライン専用）" : analysisLoading ? "🤔 分析中..." : aiAnalysis && !aiAnalysis.error ? "🔄 再診断する" : "🪄 診断してもらう"}
            </button>
            <div style={{ fontSize:10, color:"#64748b", textAlign:"center", marginTop:6 }}>
              これまで {answerHistory.length} 問の解答を分析対象
            </div>
          </div>

          {/* ポモドーロタイマー */}
          <button onClick={() => setShowPomodoro(true)} style={{
            width:"100%",
            background: pomodoroActive 
              ? "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))"
              : "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(167,139,250,0.04))",
            border: pomodoroActive 
              ? "1.5px solid rgba(239,68,68,0.4)"
              : "1px solid rgba(167,139,250,0.3)",
            borderRadius:14, padding:"14px 16px", marginBottom:12,
            cursor:"pointer", color:"#f8fafc",
            display:"flex", alignItems:"center", gap:14, fontFamily:FONT,
          }}>
            <div style={{ width:38, height:38, borderRadius:8, background: pomodoroActive ? "rgba(239,68,68,0.2)" : "rgba(167,139,250,0.2)", border:`2px solid ${pomodoroActive ? "rgba(239,68,68,0.4)" : "rgba(167,139,250,0.4)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
              🍅
            </div>
            <div style={{ flex:1, textAlign:"left" }}>
              <div style={{ fontSize:14, fontWeight:800, marginBottom:2 }}>ポモドーロタイマー</div>
              <div style={{ fontSize:11, color:"#94a3b8" }}>
                {pomodoroActive 
                  ? `${pomodoroPhase === "work" ? "📚 集中中" : "☕ 休憩中"} · ${String(Math.floor(pomodoroSeconds/60)).padStart(2,"0")}:${String(pomodoroSeconds%60).padStart(2,"0")}`
                  : "25分集中 → 5分休憩"}
              </div>
            </div>
            <div style={{ fontSize:18, color: pomodoroActive ? "#EF4444" : "#A78BFA" }}>›</div>
          </button>

          {/* ブックマーク */}
          <button onClick={() => setScreen(S.BOOKMARKS)} style={{
            width:"100%",
            background:"linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.04))",
            border:"1px solid rgba(251,191,36,0.3)",
            borderRadius:14, padding:"14px 16px", marginBottom:12,
            cursor:"pointer", color:"#f8fafc",
            display:"flex", alignItems:"center", gap:14, fontFamily:FONT,
          }}>
            <div style={{ width:38, height:38, borderRadius:8, background:"rgba(251,191,36,0.2)", border:"2px solid rgba(251,191,36,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
              ⭐
            </div>
            <div style={{ flex:1, textAlign:"left" }}>
              <div style={{ fontSize:14, fontWeight:800, marginBottom:2 }}>ブックマーク</div>
              <div style={{ fontSize:11, color:"#94a3b8" }}>{bookmarkedQs.length}問 保存中</div>
            </div>
            <div style={{ fontSize:18, color:"#FBBF24" }}>›</div>
          </button>

          {/* 対戦履歴 */}
          {battleHistory.length > 0 && (
            <button onClick={() => setShowBattleHistory(true)} style={{
              width:"100%",
              background:"linear-gradient(135deg, rgba(96,165,250,0.12), rgba(96,165,250,0.04))",
              border:"1px solid rgba(96,165,250,0.3)",
              borderRadius:14, padding:"14px 16px", marginBottom:12,
              cursor:"pointer", color:"#f8fafc",
              display:"flex", alignItems:"center", gap:14, fontFamily:FONT,
            }}>
              <div style={{ width:38, height:38, borderRadius:8, background:"rgba(96,165,250,0.2)", border:"2px solid rgba(96,165,250,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                📋
              </div>
              <div style={{ flex:1, textAlign:"left" }}>
                <div style={{ fontSize:14, fontWeight:800, marginBottom:2 }}>対戦履歴</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>直近{battleHistory.length}試合の戦績</div>
              </div>
              <div style={{ fontSize:18, color:"#60A5FA" }}>›</div>
            </button>
          )}

          {/* トロフィー */}
          <button onClick={() => setScreen(S.TROPHIES)} style={{
            width:"100%",
            background:"linear-gradient(135deg, rgba(251,191,36,0.18), rgba(244,114,182,0.08))",
            border:"1px solid rgba(251,191,36,0.4)",
            borderRadius:14, padding:"14px 16px", marginBottom:12,
            cursor:"pointer", color:"#f8fafc",
            display:"flex", alignItems:"center", gap:14, fontFamily:FONT,
          }}>
            <div style={{ width:38, height:38, borderRadius:8, background:"rgba(251,191,36,0.25)", border:"2px solid rgba(251,191,36,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
              🏆
            </div>
            <div style={{ flex:1, textAlign:"left" }}>
              <div style={{ fontSize:14, fontWeight:800, marginBottom:2 }}>トロフィー</div>
              <div style={{ fontSize:11, color:"#94a3b8" }}>{unlockedTrophies.length}/{TROPHIES.length} 個獲得</div>
            </div>
            <div style={{ fontSize:18, color:"#FBBF24" }}>›</div>
          </button>

          {/* プライバシー設定 */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px 16px", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <span style={{ fontSize:18 }}>🔐</span>
              <div style={{ fontSize:13, fontWeight:800 }}>プロフィール公開設定</div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {[
                { id:"public",  label:"🌍 全員", desc:"誰でも見られる" },
                { id:"friends", label:"👥 友達", desc:"友達のみ" },
                { id:"private", label:"🔒 非公開", desc:"自分のみ" },
              ].map(opt => (
                <button key={opt.id} onClick={() => setProfilePrivacy(opt.id)} style={{
                  flex:1, background: profilePrivacy===opt.id ? "linear-gradient(135deg, #60A5FA, #818CF8)" : "rgba(255,255,255,0.04)",
                  border: profilePrivacy===opt.id ? "none" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius:10, padding:"8px 4px",
                  cursor:"pointer", color: profilePrivacy===opt.id ? "#fff" : "#cbd5e1",
                  fontSize:11, fontWeight:700, fontFamily:FONT,
                }}>{opt.label}</button>
              ))}
            </div>
            <div style={{ fontSize:10, color:"#64748b", marginTop:6, textAlign:"center" }}>
              現在: {profilePrivacy === "public" ? "全員がプロフィールを見られます" : profilePrivacy === "friends" ? "友達のみプロフィールが見られます" : "プロフィールは非公開です"}
            </div>
          </div>

          {/* クローゼット（装備管理） */}
          <button onClick={() => setScreen(S.SHOP)} style={{
            width:"100%",
            background:"linear-gradient(135deg, rgba(167,139,250,0.18), rgba(96,165,250,0.08))",
            border:"1px solid rgba(167,139,250,0.4)",
            borderRadius:14, padding:"14px 16px", marginBottom:12,
            cursor:"pointer", color:"#f8fafc",
            display:"flex", alignItems:"center", gap:14, fontFamily:FONT,
          }}>
            <div style={{ width:38, height:38, borderRadius:8, background:"rgba(167,139,250,0.25)", border:"2px solid rgba(167,139,250,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
              👗
            </div>
            <div style={{ flex:1, textAlign:"left" }}>
              <div style={{ fontSize:14, fontWeight:800, marginBottom:2 }}>クローゼット</div>
              <div style={{ fontSize:11, color:"#94a3b8" }}>{ownedItems.length}/{SHOP_ITEMS.length} アイテム所持</div>
            </div>
            <div style={{ fontSize:18, color:"#A78BFA" }}>›</div>
          </button>

          {/* ペット図鑑へのリンク */}
          <button onClick={() => setScreen(S.DEX)} style={{
            width:"100%",
            background:"linear-gradient(135deg, rgba(52,211,153,0.15), rgba(96,165,250,0.08))",
            border:"1px solid rgba(52,211,153,0.4)",
            borderRadius:14, padding:"14px 16px", marginBottom:12,
            cursor:"pointer", color:"#f8fafc",
            display:"flex", alignItems:"center", gap:14, fontFamily:FONT,
          }}>
            <div style={{ width:38, height:38, borderRadius:8, background:"rgba(52,211,153,0.2)", border:"2px solid rgba(52,211,153,0.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <PixelIcon name="diamond" size={20} color="#34D399"/>
            </div>
            <div style={{ flex:1, textAlign:"left" }}>
              <div style={{ fontSize:14, fontWeight:800, marginBottom:2 }}>ペット図鑑</div>
              <div style={{ fontSize:11, color:"#94a3b8" }}>{unlockedPets.length}/18 種類を発見</div>
            </div>
            <div style={{ fontSize:18, color:"#34D399" }}>›</div>
          </button>

          {/* 設定 */}
          <button onClick={() => setShowSettings(true)} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px", cursor:"pointer", color:"#cbd5e1", fontSize:13, fontWeight:700, fontFamily:FONT }}>⚙️ 設定</button>
        </div>
      )}

      {/* ══ USER_PROFILE（他人のプロフィール） ═══════════════ */}
      {screen === S.USER_PROFILE && viewingUser && (() => {
        const u = viewingUser;
        if (u.privacy === "private") {
          return (
            <div style={{ maxWidth:440, margin:"0 auto", padding:"32px 18px", animation:"screenEnter 0.4s ease" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:30 }}>
                <button onClick={() => setScreen(S.RANKING)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:"pointer", color:"#cbd5e1", fontSize:17, fontWeight:700, fontFamily:FONT }}>←</button>
                <h2 style={{ margin:0, fontSize:20, fontWeight:800 }}>プロフィール</h2>
              </div>
              <div style={{ textAlign:"center", padding:"40px 20px", background:"rgba(255,255,255,0.03)", borderRadius:20 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🔒</div>
                <div style={{ fontSize:16, fontWeight:800, marginBottom:6 }}>{u.name}のプロフィールは非公開です</div>
                <div style={{ fontSize:12, color:"#94a3b8" }}>このユーザーはプロフィールを公開していません</div>
              </div>
            </div>
          );
        }
        const isFriendsOnly = u.privacy === "friends";
        const myWeekly = getTotalXp(genreXp);
        const compareData = [
          { label:"レート",    me:userRating, you:u.rating, c:"#FBBF24" },
          { label:"勝利数",    me:missionProgress.wins||0, you:u.wins, c:"#34D399" },
          { label:"週間XP",    me:myWeekly, you:u.weeklyXp, c:"#A78BFA" },
        ];
        return (
          <div style={{ maxWidth:440, margin:"0 auto", padding:"32px 18px 24px", animation:"screenEnter 0.4s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
              <button onClick={() => setScreen(S.RANKING)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:"pointer", color:"#cbd5e1", fontSize:17, fontWeight:700, fontFamily:FONT }}>←</button>
              <h2 style={{ margin:0, fontSize:20, fontWeight:800 }}>{u.name}のプロフィール</h2>
            </div>

            {/* プロフィールカード */}
            <div style={{ background:"linear-gradient(135deg, rgba(96,165,250,0.1), rgba(167,139,250,0.06))", border:"1px solid rgba(96,165,250,0.2)", borderRadius:22, padding:"24px 20px", marginBottom:16, textAlign:"center" }}>
              <div style={{ fontSize:60, marginBottom:10, filter:`drop-shadow(0 0 12px ${getRank(u.rating).color}66)` }}>{u.avatar}</div>
              <div style={{ fontSize:22, fontWeight:800, marginBottom:6, color:"#fff" }}>{u.name}</div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${getRank(u.rating).color}22`, border:`1px solid ${getRank(u.rating).color}66`, borderRadius:99, padding:"4px 14px", fontSize:12, fontWeight:700, color:getRank(u.rating).color }}>
                {getRank(u.rating).icon} {getRank(u.rating).name}
              </div>
              {u.bio && <div style={{ fontSize:12, color:"#cbd5e1", marginTop:12, lineHeight:1.5, padding:"8px 12px", background:"rgba(0,0,0,0.2)", borderRadius:10 }}>"{u.bio}"</div>}
              {u.joinDate && <div style={{ fontSize:10, color:"#64748b", marginTop:8 }}>登録: {u.joinDate}</div>}
            </div>

            {isFriendsOnly && (
              <div style={{ background:"rgba(96,165,250,0.08)", border:"1px solid rgba(96,165,250,0.3)", borderRadius:10, padding:"8px 12px", marginBottom:12, fontSize:11, color:"#93C5FD", textAlign:"center" }}>
                👥 友達のみに公開されているプロフィールです
              </div>
            )}

            {/* スタッツ */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"14px 16px" }}>
                <div style={{ fontSize:24, fontWeight:800, color:"#FBBF24", marginBottom:2 }}>{u.rating}</div>
                <div style={{ fontSize:11, color:"#cbd5e1", fontWeight:600 }}>レート</div>
              </div>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"14px 16px" }}>
                <div style={{ fontSize:24, fontWeight:800, color:"#34D399", marginBottom:2 }}>{u.wins}</div>
                <div style={{ fontSize:11, color:"#cbd5e1", fontWeight:600 }}>勝利数</div>
              </div>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"14px 16px" }}>
                <div style={{ fontSize:24, fontWeight:800, color:"#60A5FA", marginBottom:2 }}>{Math.round((u.wins/u.battles)*100)}%</div>
                <div style={{ fontSize:11, color:"#cbd5e1", fontWeight:600 }}>勝率</div>
              </div>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"14px 16px" }}>
                <div style={{ fontSize:24, fontWeight:800, color:"#A78BFA", marginBottom:2 }}>{u.weeklyXp}</div>
                <div style={{ fontSize:11, color:"#cbd5e1", fontWeight:600 }}>週間XP</div>
              </div>
            </div>

            {/* 自分との比較 */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:16, marginBottom:16 }}>
              <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:3, fontWeight:700, marginBottom:14 }}>⚔️ あなたとの比較</div>
              {compareData.map((d, i) => {
                const total = (d.me||0) + (d.you||0);
                const mePct = total > 0 ? ((d.me||0)/total)*100 : 50;
                const winning = (d.me||0) > (d.you||0);
                return (
                  <div key={i} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:700, marginBottom:4 }}>
                      <span style={{ color:winning?"#34D399":"#cbd5e1" }}>あなた {d.me||0}</span>
                      <span style={{ color:"#94a3b8" }}>{d.label}</span>
                      <span style={{ color:!winning?"#34D399":"#cbd5e1" }}>{d.you||0} {u.name}</span>
                    </div>
                    <div style={{ display:"flex", height:6, borderRadius:99, overflow:"hidden", background:"rgba(0,0,0,0.3)" }}>
                      <div style={{ width:`${mePct}%`, background:d.c, transition:"width 0.4s" }}/>
                      <div style={{ width:`${100-mePct}%`, background:shade(d.c, -30), transition:"width 0.4s" }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            <button style={{ width:"100%", background:"rgba(96,165,250,0.15)", border:"1px solid rgba(96,165,250,0.4)", borderRadius:12, padding:"12px", cursor:"pointer", color:"#60A5FA", fontSize:13, fontWeight:800, fontFamily:FONT }}>
              👥 フレンド申請を送る
            </button>
          </div>
        );
      })()}

      {/* ══ TROPHIES（業績一覧） ════════════════════════════ */}
      {screen === S.TROPHIES && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"22px 18px 24px", animation:"screenEnter 0.4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
            <button onClick={() => setScreen(S.PROFILE)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:"pointer", color:"#cbd5e1", fontSize:17, fontWeight:700, fontFamily:FONT }}>←</button>
            <div>
              <h2 style={{ margin:0, fontSize:22, fontWeight:800 }}>🏆 トロフィー</h2>
              <p style={{ color:"#94a3b8", fontSize:11, margin:"2px 0 0" }}>{unlockedTrophies.length} / {TROPHIES.length} 個獲得</p>
            </div>
          </div>

          {/* 統計カード */}
          <div style={{
            background:"linear-gradient(135deg, rgba(251,191,36,0.12), rgba(244,114,182,0.05))",
            border:"1px solid rgba(251,191,36,0.3)",
            borderRadius:16, padding:"14px 16px", marginBottom:14,
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ fontSize:10, color:"#FBBF24", letterSpacing:2, fontWeight:800 }}>🏅 達成度</div>
              <div style={{ fontSize:13, fontWeight:900, color:"#fff" }}>{Math.round((unlockedTrophies.length/TROPHIES.length)*100)}%</div>
            </div>
            <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:6, overflow:"hidden", marginBottom:10 }}>
              <div style={{ width:`${(unlockedTrophies.length/TROPHIES.length)*100}%`, height:"100%", background:"linear-gradient(90deg, #FBBF24, #F472B6)", boxShadow:"0 0 8px #FBBF2488", transition:"width 0.4s" }}/>
            </div>
            {/* レア度別カウント */}
            <div style={{ display:"flex", gap:8, justifyContent:"space-around", fontSize:11 }}>
              {["legend","rare","common"].map(r => {
                const total = TROPHIES.filter(t => t.rare === r).length;
                const got = TROPHIES.filter(t => t.rare === r && unlockedTrophies.includes(t.id)).length;
                const icon = r === "legend" ? "🌟" : r === "rare" ? "💎" : "🥉";
                return (
                  <div key={r} style={{ flex:1, textAlign:"center", background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"6px 4px" }}>
                    <div style={{ fontSize:16 }}>{icon}</div>
                    <div style={{ fontSize:12, fontWeight:900, color: RARITY_COLORS[r] }}>{got}/{total}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* レア度別 */}
          {["legend","rare","common"].map(rarity => {
            const list = TROPHIES.filter(t => t.rare === rarity);
            const unlockedInRarity = list.filter(t => unlockedTrophies.includes(t.id));
            const rareLabel = rarity === "legend" ? "🌟 レジェンド" : rarity === "rare" ? "💎 レア" : "🥉 コモン";
            return (
              <div key={rarity} style={{ marginBottom:18 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ fontSize:12, color:RARITY_COLORS[rarity], fontWeight:800, letterSpacing:2 }}>{rareLabel}</div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>{unlockedInRarity.length}/{list.length} 獲得</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {list.map(t => {
                    const unlocked = unlockedTrophies.includes(t.id);
                    return (
                      <div key={t.id} style={{
                        background: unlocked ? `linear-gradient(135deg, ${RARITY_COLORS[rarity]}22, rgba(255,255,255,0.03))` : "rgba(255,255,255,0.02)",
                        border:`1.5px solid ${unlocked ? RARITY_COLORS[rarity] : "rgba(255,255,255,0.08)"}`,
                        borderRadius:14, padding:"14px 10px",
                        textAlign:"center",
                        opacity: unlocked ? 1 : 0.55,
                        boxShadow: unlocked ? `0 4px 14px ${RARITY_COLORS[rarity]}33` : "none",
                        position:"relative",
                      }}>
                        {unlocked && (
                          <div style={{
                            position:"absolute", top:6, right:6,
                            background: RARITY_COLORS[rarity], color:"#0f172a",
                            fontSize:8, fontWeight:900,
                            padding:"1px 5px", borderRadius:99,
                          }}>✓</div>
                        )}
                        <div style={{ fontSize:32, marginBottom:6, filter: unlocked ? "none" : "grayscale(1)" }}>{unlocked ? t.icon : "🔒"}</div>
                        <div style={{ fontSize:12, fontWeight:800, color: unlocked ? "#fff" : "#94a3b8", marginBottom:3 }}>{unlocked ? t.title : "???"}</div>
                        <div style={{ fontSize:9, color:"#94a3b8", lineHeight:1.3 }}>{t.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ SHOP ════════════════════════════════════════════ */}
      {/* ══ CLOSET（装備管理） ═══════════════════════════════ */}
      {screen === S.SHOP && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"32px 18px 24px", animation:"screenEnter 0.4s ease" }}>
          {/* ヘッダー */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
            <button data-sfx="back" onClick={() => setScreen(S.HOME)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:"pointer", color:"#cbd5e1", fontSize:17, fontWeight:700, fontFamily:FONT, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
            <div style={{ flex:1 }}>
              <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:"#A78BFA" }}>👗 クローゼット</h2>
              <p style={{ color:"#94a3b8", fontSize:11, margin:"2px 0 0" }}>所持アイテムで着飾る</p>
            </div>
            <button onClick={() => setScreen(S.GACHA)} data-sfx="open" style={{
              background:"linear-gradient(135deg, #FBBF24, #F472B6)",
              border:"none", borderRadius:14, padding:"8px 14px",
              color:"#0f172a", fontWeight:900, fontSize:12, cursor:"pointer",
              display:"flex", alignItems:"center", gap:4,
              boxShadow:"0 4px 14px rgba(251,191,36,0.4)",
              fontFamily:FONT,
            }}>🎰 ガチャ</button>
          </div>

          {/* ペットプレビュー */}
          <div style={{ background:"linear-gradient(135deg, rgba(96,165,250,0.1), rgba(167,139,250,0.06))", border:"1px solid rgba(96,165,250,0.2)", borderRadius:18, padding:"18px", marginBottom:16, textAlign:"center" }}>
            <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:2, fontWeight:700, marginBottom:10 }}>PREVIEW</div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}>
              <PetDisplay genreXp={genreXp} size={70} starterEgg={starterEgg} hat={equippedHat ? SHOP_ITEMS.find(i=>i.id===equippedHat)?.icon : null} aura={equippedAura ? SHOP_ITEMS.find(i=>i.id===equippedAura)?.icon : null} />
            </div>
            {equippedTitle && (() => {
              const t = SHOP_ITEMS.find(i => i.id === equippedTitle);
              return t ? <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.4)", borderRadius:99, padding:"4px 12px", fontSize:12, fontWeight:800, color:"#FBBF24" }}>{t.icon} {t.name}</div> : null;
            })()}
            <div style={{ fontSize:11, color:"#94a3b8", marginTop:10 }}>
              所持: {ownedItems.length} / {SHOP_ITEMS.length} 種類
            </div>
          </div>

          {/* タブ */}
          <div style={{ display:"flex", gap:6, marginBottom:14, background:"rgba(255,255,255,0.04)", padding:4, borderRadius:12 }}>
            {[
              { id:"hat",   label:"🎩 帽子" },
              { id:"aura",  label:"✨ オーラ" },
              { id:"title", label:"🏆 肩書き" },
            ].map(t => (
              <button key={t.id} onClick={() => setShopFilter(t.id)} style={{
                flex:1, background:shopFilter===t.id?"linear-gradient(135deg, #A78BFA, #818CF8)":"transparent",
                border:"none", borderRadius:9, padding:"8px",
                cursor:"pointer", color:shopFilter===t.id?"#fff":"#cbd5e1",
                fontSize:12, fontWeight:800, fontFamily:FONT,
              }}>{t.label}</button>
            ))}
          </div>

          {/* アイテムグリッド（所持品のみ表示、未所持はロック） */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {SHOP_ITEMS.filter(i => i.type === shopFilter).map(item => {
              const owned = ownedItems.includes(item.id);
              const equipped = (item.type === "hat" && equippedHat === item.id) ||
                               (item.type === "aura" && equippedAura === item.id) ||
                               (item.type === "title" && equippedTitle === item.id);
              const rarityColor = item.price >= 500 ? "#FBBF24" : item.price >= 200 ? "#60A5FA" : "#94a3b8";
              return (
                <div key={item.id} style={{
                  background: !owned ? "rgba(255,255,255,0.02)"
                            : equipped ? `linear-gradient(135deg, ${rarityColor}25, rgba(255,255,255,0.04))`
                            : "rgba(255,255,255,0.03)",
                  border:`1.5px solid ${
                    equipped ? rarityColor
                    : !owned ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.08)"
                  }`,
                  borderRadius:14, padding:"14px 10px",
                  textAlign:"center",
                  opacity: owned ? 1 : 0.45,
                  boxShadow: equipped ? `0 4px 16px ${rarityColor}40` : "none",
                  position:"relative",
                }}>
                  {!owned && (
                    <div style={{ position:"absolute", top:6, right:6, fontSize:11 }}>🔒</div>
                  )}
                  <div style={{ fontSize:36, marginBottom:6, filter: owned ? "none" : "grayscale(1)" }}>
                    {owned ? item.icon : "❓"}
                  </div>
                  <div style={{ fontSize:13, fontWeight:800, color: owned ? "#f8fafc" : "#64748b", marginBottom:2 }}>
                    {owned ? item.name : "???"}
                  </div>
                  <div style={{ fontSize:10, color:"#94a3b8", marginBottom:8, minHeight:24, lineHeight:1.3 }}>
                    {owned ? item.desc : "ガチャで入手"}
                  </div>
                  {/* レア度バッジ */}
                  <div style={{ fontSize:9, color: rarityColor, fontWeight:800, marginBottom:6, letterSpacing:1 }}>
                    {item.price >= 500 ? "🌟 LEGEND" : item.price >= 200 ? "💎 RARE" : "🥉 COMMON"}
                  </div>
                  {owned && (
                    <button onClick={() => toggleEquip(item)} style={{
                      width:"100%",
                      background: equipped ? "rgba(251,191,36,0.25)" : "rgba(167,139,250,0.18)",
                      border: equipped ? "1px solid #FBBF24" : "1px solid rgba(167,139,250,0.5)",
                      borderRadius:8, padding:"6px",
                      cursor:"pointer", color: equipped ? "#FBBF24" : "#A78BFA",
                      fontSize:11, fontWeight:800, fontFamily:FONT,
                    }}>{equipped ? "✓ 装備中" : "装備する"}</button>
                  )}
                </div>
              );
            })}
          </div>

          {/* ガチャに誘導 */}
          <button onClick={() => setScreen(S.GACHA)} style={{
            width:"100%", marginTop:16,
            background:"linear-gradient(135deg, rgba(251,191,36,0.18), rgba(244,114,182,0.1))",
            border:"1px solid rgba(251,191,36,0.4)",
            borderRadius:14, padding:"14px",
            cursor:"pointer", color:"#FBBF24", fontSize:13, fontWeight:800, fontFamily:FONT,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>🎰 ガチャでアイテムを増やそう →</button>
        </div>
      )}

      {/* ══ LOBBY ═══════════════════════════════════════════ */}
      {screen === S.LOBBY && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"48px 20px", textAlign:"center", animation:"screenEnter 0.4s ease" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:battleMode==="ranked"?"linear-gradient(135deg,#FBBF24,#F472B6)":battleMode==="boss"?"linear-gradient(135deg,#EF4444,#7c2d12)":`${genreInfo.color}15`, border:battleMode!=="solo"?"none":`1px solid ${genreInfo.color}44`, borderRadius:99, padding:"7px 20px", marginBottom:14, fontSize:13, fontWeight:700, color:battleMode!=="solo"?"#fff":genreInfo.color }}>
            {battleMode==="ranked" && "👑 "}{battleMode==="boss" && "🔥 "}{genreInfo.icon} {genreInfo.label}{battleMode==="ranked" && " · ランクマッチ"}{battleMode==="boss" && " · ボスレイド"}
          </div>

          {battleMode === "boss" ? (
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:24, padding:"28px 20px", marginBottom:28 }}>
              <div style={{ fontSize:11, color:"#cbd5e1", letterSpacing:3, marginBottom:14, fontWeight:700 }}>ボスモンスター</div>
              <div style={{ marginBottom:12, display:"inline-block", animation:"monsterFloat 2.5s ease-in-out infinite" }}>
                <PixelMonster monster={monster} size={140} />
              </div>
              <div style={{ fontSize:18, fontWeight:800, color:monster.color, marginBottom:10 }}>{monster.name}</div>
              <HPBar hp={monster.hp} maxHp={monster.maxHp} color={monster.color} showText />
            </div>
          ) : (
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:24, padding:"24px 20px", marginBottom:28 }}>
              <div style={{ fontSize:11, color:"#cbd5e1", letterSpacing:3, marginBottom:16, fontWeight:700 }}>個人戦・ペット対決</div>
              {/* 敵3体（上に並ぶ） */}
              <div style={{ display:"flex", justifyContent:"space-around", marginBottom:14 }}>
                {players.filter(p => !p.isUser).map((p, i) => (
                  <div key={p.id} style={{ textAlign:"center" }}>
                    <div style={{ animation:"monsterFloat 2.5s ease-in-out infinite", animationDelay:`${i*0.2}s`, transform:"scaleX(-1)", display:"inline-block" }}>
                      <PetDisplay
                        genreXp={p.petGenreXp||{}}
                        size={42}
                        starterEgg={{ color: p.petStarterColor }}
                      />
                    </div>
                    <div style={{ fontSize:10, fontWeight:700, color:"#cbd5e1", marginTop:3 }}>{p.name}</div>
                  </div>
                ))}
              </div>
              {/* VS */}
              <div style={{ display:"flex", alignItems:"center", gap:10, margin:"8px 0" }}>
                <div style={{ flex:1, height:1, background:"linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)" }}/>
                <span style={{ fontSize:16, fontWeight:900, color:"#EF4444", letterSpacing:3 }}>VS</span>
                <div style={{ flex:1, height:1, background:"linear-gradient(90deg, transparent, rgba(96,165,250,0.4), transparent)" }}/>
              </div>
              {/* 自分（下中央に大きく） */}
              <div style={{ textAlign:"center", marginTop:14 }}>
                <div style={{ display:"inline-block", animation:"monsterFloat 2.8s ease-in-out infinite" }}>
                  <PetDisplay genreXp={genreXp} size={64} starterEgg={starterEgg} />
                </div>
                <div style={{ fontSize:12, fontWeight:800, color:"#60A5FA", marginTop:4 }}>YOU</div>
              </div>
            </div>
          )}

          <div style={{ fontSize:80, fontWeight:800, animation:"countPop 0.4s ease", color:lobbyCount>0?"#60A5FA":"#34D399", textShadow:`0 0 40px ${lobbyCount>0?"#60A5FA":"#34D399"}` }}>
            {lobbyCount > 0 ? lobbyCount : "GO!"}
          </div>
        </div>
      )}

      {/* ══ BATTLE ══════════════════════════════════════════ */}
      {screen === S.BATTLE && currentQ && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"8px 12px 16px", animation: screenShake ? "screenShake 0.4s ease" : "none" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:600, color:"#cbd5e1" }}>Q{qIndex+1}/{questions.length}</div>
            <div style={{ background:timeLeft<=5?"rgba(239,68,68,0.15)":"rgba(96,165,250,0.1)", border:`1.5px solid ${timeLeft<=5?"#EF4444":"rgba(96,165,250,0.4)"}`, borderRadius:99, padding:"3px 18px", fontSize:20, fontWeight:800, color:timeLeft<=5?"#EF4444":"#93C5FD", transition:"all 0.3s" }}>{timeLeft}</div>
            <div style={{ fontSize:13 }}>{genreInfo.icon}</div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:99, height:3, marginBottom:8, overflow:"hidden" }}>
            <div style={{ width:`${(timeLeft/15)*100}%`, height:"100%", background:timeLeft<=5?"#EF4444":genreInfo.color, transition:"width 1s linear" }} />
          </div>
          <div style={{ position:"relative", textAlign:"center", padding:"4px 0", marginBottom:6 }}>
            {dmgPop && <DmgPop dmg={dmgPop} id={dmgKey} />}
            {/* 攻撃時の斬撃エフェクト */}
            {slashEffect && (
              <>
                <div style={{
                  position:"absolute", inset:0, pointerEvents:"none", zIndex:40,
                  overflow:"hidden", borderRadius:12,
                }}>
                  <div style={{
                    position:"absolute", top:"30%", left:0, width:"200%", height:"6px",
                    background: slashEffect.type === "crit"
                      ? "linear-gradient(90deg, transparent, #FBBF24, #fff, #FBBF24, transparent)"
                      : "linear-gradient(90deg, transparent, #F472B6, #fff, transparent)",
                    boxShadow: slashEffect.type === "crit" ? "0 0 30px #FBBF24, 0 0 60px #FBBF24" : "0 0 20px #F472B6",
                    animation:"slashDiagonal 0.6s ease forwards",
                    filter:"blur(0.5px)",
                  }} />
                  {slashEffect.type === "crit" && (
                    <div style={{
                      position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                      width:120, height:120, borderRadius:"50%",
                      border:"4px solid #FBBF24",
                      boxShadow:"0 0 40px #FBBF24, inset 0 0 40px #FBBF24",
                      animation:"critRing 0.6s ease forwards",
                    }} />
                  )}
                </div>
                {/* 衝撃フラッシュ */}
                <div style={{
                  position:"absolute", inset:0, pointerEvents:"none", zIndex:35,
                  background: slashEffect.type === "crit"
                    ? "radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 50%)"
                    : "radial-gradient(circle, rgba(244,114,182,0.3) 0%, transparent 50%)",
                  animation:"impactFlash 0.4s ease",
                  borderRadius:12,
                }} />
              </>
            )}
            {battleMode === "boss" ? (
              <>
                <div style={{ lineHeight:1, display:"inline-block", animation:attacking?"monsterAttack 0.45s ease":monHit?"monsterHit 0.35s ease":"monsterFloat 3s ease-in-out infinite" }}>
                  <PixelMonster monster={monster} size={120} />
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:monster.color, marginBottom:5 }}>{monster.name}</div>
                <HPBar hp={monster.hp} maxHp={monster.maxHp} color={monster.color} showText />

                {/* ボスモード: 右上に貢献ランキング小窓 */}
                <div style={{
                  position:"absolute", top:0, right:0,
                  background:"rgba(15,23,42,0.85)", backdropFilter:"blur(8px)",
                  border:"1px solid rgba(251,191,36,0.4)", borderRadius:12,
                  padding:"8px 10px", minWidth:120,
                }}>
                  <div style={{ fontSize:9, fontWeight:700, color:"#FBBF24", letterSpacing:1, marginBottom:6, textAlign:"center" }}>⚔️ 貢献度TOP4</div>
                  {[...players].sort((a,b) => (b.dmgDealt||0) - (a.dmgDealt||0)).slice(0,4).map((p, i) => (
                    <div key={p.id} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, padding:"2px 0" }}>
                      <span style={{ fontSize:11, fontWeight:800, color:["#FBBF24","#cbd5e1","#CD7F32","#94a3b8"][i], width:12 }}>{i+1}</span>
                      <span style={{ fontSize:13 }}>{p.avatar}</span>
                      <span style={{ flex:1, fontWeight:p.isUser?800:600, color:p.isUser?"#60A5FA":"#cbd5e1", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</span>
                      <span style={{ fontWeight:800, color:"#fff" }}>{p.dmgDealt||0}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : battleMode === "ranked" ? (
              // ─── ランクマッチ専用: ミニマル表示 ───
              <div style={{ position:"relative", padding:"4px 0", minHeight:60 }}>
                {/* 上端: 全プレイヤーアイコン+HPだけのコンパクト表示 */}
                <div style={{ display:"flex", justifyContent:"space-around", gap:6, alignItems:"flex-start" }}>
                  {[...players].sort((a,b) => a.isUser ? -1 : b.isUser ? 1 : 0).map((p, i) => {
                    const hpCol = p.hp > 50 ? "#34D399" : p.hp > 25 ? "#FBBF24" : "#EF4444";
                    const isHit = attackEffect && attackEffect.targetId === p.id;
                    const isDead = p.hp <= 0;
                    return (
                      <div key={p.id} style={{
                        flex:1, position:"relative",
                        opacity: isDead ? 0.3 : 1,
                        transition:"opacity 0.4s",
                      }}>
                        {/* 被弾フラッシュ */}
                        {isHit && (
                          <div style={{
                            position:"absolute", top:-4, left:"50%", transform:"translateX(-50%)",
                            width:40, height:40, borderRadius:"50%",
                            background: attackEffect.type === "crit" ? "rgba(251,191,36,0.5)" : "rgba(239,68,68,0.4)",
                            boxShadow: attackEffect.type === "crit" ? "0 0 20px #FBBF24" : "0 0 15px #EF4444",
                            animation:"flashExpand 0.5s ease forwards",
                            pointerEvents:"none", zIndex:30,
                          }}/>
                        )}
                        <div style={{
                          background: p.isUser ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.04)",
                          border: `1.5px solid ${p.isUser ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.1)"}`,
                          borderRadius:10, padding:"4px 6px",
                          display:"flex", flexDirection:"column", alignItems:"center", gap:2,
                          animation: isHit ? "monsterHit 0.4s ease 3" : "none",
                          filter: isHit ? `brightness(1.8) drop-shadow(0 0 6px ${attackEffect.type === "crit" ? "#FBBF24" : "#EF4444"})` : "none",
                        }}>
                          <div style={{ fontSize:18, lineHeight:1, transform: p.isUser ? "none" : "scaleX(-1)" }}>
                            {p.isPet !== false ? (
                              <PetDisplay
                                genreXp={p.isUser ? genreXp : (p.petGenreXp || {})}
                                size={22}
                                starterEgg={p.isUser ? starterEgg : { color: p.petStarterColor || "#a78bfa" }}
                              />
                            ) : p.avatar}
                          </div>
                          <div style={{ fontSize:8, fontWeight:700, color: p.isUser ? "#60A5FA" : "#cbd5e1", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:45 }}>{p.name}</div>
                          <div style={{ width:"100%", background:"rgba(0,0,0,0.4)", borderRadius:99, height:4, overflow:"hidden" }}>
                            <div style={{ width:`${(p.hp/p.maxHp)*100}%`, height:"100%", background:hpCol, transition:"width 0.5s" }}/>
                          </div>
                          <div style={{ fontSize:8, fontWeight:800, color: isDead ? "#EF4444" : hpCol }}>
                            {isDead ? "💀" : `${p.hp}HP`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 攻撃時だけ大きいペット表示（オーバーレイ） */}
                {(attacking || attackEffect) && (
                  <div style={{
                    position:"absolute", top:0, left:0, right:0, height:80,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    gap:30, pointerEvents:"none", zIndex:25,
                    animation:"popIn 0.3s ease",
                  }}>
                    <div style={{ animation: attacking ? "monsterAttack 0.45s ease" : "none" }}>
                      <PetDisplay genreXp={genreXp} size={56} starterEgg={starterEgg} />
                    </div>
                    <div style={{ fontSize:18, color:"#EF4444", fontWeight:900, textShadow:"0 0 10px #EF4444" }}>⚔️</div>
                    {attackEffect && attackEffect.targetId !== 99 && (() => {
                      const target = players.find(p => p.id === attackEffect.targetId);
                      if (!target) return null;
                      return (
                        <div style={{ animation:"monsterHit 0.4s ease", filter:"brightness(1.5)", transform:"scaleX(-1)" }}>
                          <PetDisplay
                            genreXp={target.petGenreXp || {}}
                            size={56}
                            starterEgg={{ color: target.petStarterColor || "#a78bfa" }}
                          />
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            ) : (
              // PVP（ソロ）: 4人対峙コンパクト版（横並び・通常モード）
              <div style={{ position:"relative", padding:"4px 0" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6 }}>
                  {/* 左: 敵3体 */}
                  <div style={{ display:"flex", flex:1, justifyContent:"space-around", gap:4 }}>
                    {players.filter(p => !p.isUser).map((p, i) => {
                      const hpCol = p.hp > 50 ? "#34D399" : p.hp > 25 ? "#FBBF24" : "#EF4444";
                      const isHit = attackEffect && attackEffect.targetId === p.id;
                      return (
                        <div key={p.id} style={{ flex:1, textAlign:"center", opacity:p.hp<=0?0.4:1, position:"relative" }}>
                          {/* 被弾フラッシュ */}
                          {isHit && (
                            <div style={{
                              position:"absolute", top:-5, left:"50%", transform:"translateX(-50%)",
                              width:60, height:60, borderRadius:"50%",
                              background: attackEffect.type === "crit" ? "rgba(251,191,36,0.5)" : "rgba(239,68,68,0.4)",
                              boxShadow: attackEffect.type === "crit" ? "0 0 30px #FBBF24" : "0 0 20px #EF4444",
                              animation:"flashExpand 0.5s ease forwards",
                              pointerEvents:"none", zIndex:30,
                            }}/>
                          )}
                          <div style={{
                            animation: isHit ? "monsterHit 0.4s ease 3" : monHit ? "monsterHit 0.35s ease" : `monsterFloat ${3+i*0.2}s ease-in-out infinite`,
                            transform:"scaleX(-1)",
                            display:"inline-block",
                            filter: isHit ? `brightness(2) drop-shadow(0 0 8px ${attackEffect.type === "crit" ? "#FBBF24" : "#EF4444"})` : "none",
                            transition: isHit ? "none" : "filter 0.3s",
                          }}>
                            <PetDisplay
                              genreXp={p.petGenreXp || {}}
                              size={36}
                              starterEgg={{ color: p.petStarterColor || "#a78bfa" }}
                            />
                          </div>
                          <div style={{ fontSize:8, fontWeight:700, color:"#cbd5e1", marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                          <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:3, overflow:"hidden", marginTop:2 }}>
                            <div style={{ width:`${(p.hp/p.maxHp)*100}%`, height:"100%", background:hpCol, borderRadius:99 }}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* 中央: VS */}
                  <div style={{ fontSize:13, fontWeight:900, color:"#EF4444", padding:"0 4px", textShadow:"0 0 8px #EF444466" }}>VS</div>
                  {/* 右: 自分（大きめ） */}
                  <div style={{ textAlign:"center", minWidth:90, position:"relative" }}>
                    {/* 被弾フラッシュ */}
                    {attackEffect && attackEffect.targetId === 99 && (
                      <div style={{
                        position:"absolute", top:-5, left:"50%", transform:"translateX(-50%)",
                        width:70, height:70, borderRadius:"50%",
                        background:"rgba(239,68,68,0.5)",
                        boxShadow:"0 0 30px #EF4444",
                        animation:"flashExpand 0.5s ease forwards",
                        pointerEvents:"none", zIndex:30,
                      }}/>
                    )}
                    <div style={{
                      display:"inline-block",
                      animation: attackEffect && attackEffect.targetId === 99
                        ? "monsterHit 0.35s ease 3"
                        : attacking
                        ? "monsterAttack 0.45s ease"
                        : "monsterFloat 2.8s ease-in-out infinite",
                      filter: attackEffect && attackEffect.targetId === 99
                        ? "brightness(2) drop-shadow(0 0 8px #EF4444)"
                        : "none",
                    }}>
                      <PetDisplay genreXp={genreXp} size={48} starterEgg={starterEgg} />
                    </div>
                    <div style={{ fontSize:10, fontWeight:800, color:"#60A5FA", marginTop:1 }}>YOU</div>
                    {(() => {
                      const user = players.find(p => p.isUser);
                      if (!user) return null;
                      const hpCol = user.hp > 50 ? "#34D399" : user.hp > 25 ? "#FBBF24" : "#EF4444";
                      return (
                        <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:4, overflow:"hidden", marginTop:2, border:"1px solid rgba(255,255,255,0.1)" }}>
                          <div style={{ width:`${(user.hp/user.maxHp)*100}%`, height:"100%", background:hpCol, borderRadius:99, boxShadow:`0 0 4px ${hpCol}aa`, transition:"width 0.4s" }}/>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* 問題ボックス: ランクマ時は大きめ */}
          <div style={{
            background:"linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
            border:"2px solid rgba(255,255,255,0.22)",
            borderRadius:18, padding: battleMode === "ranked" ? "26px 20px" : "18px 18px",
            marginBottom:14,
            textAlign:"center",
            boxShadow:"0 4px 24px rgba(0,0,0,0.4)",
            minHeight: battleMode === "ranked" ? 110 : "auto",
            display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative",
          }}>
            {/* ブックマークボタン */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const qKey = currentQ.q;
                const isBookmarked = bookmarkedQs.some(b => b.q === qKey);
                if (isBookmarked) {
                  setBookmarkedQs(prev => prev.filter(b => b.q !== qKey));
                } else {
                  setBookmarkedQs(prev => [...prev, {
                    q: currentQ.q,
                    choices: currentQ.choices,
                    answer: currentQ.answer,
                    genre: genre || "english",
                    bookmarkedAt: Date.now(),
                  }]);
                  SFX.coin();
                }
              }}
              data-sfx="none"
              style={{
                position:"absolute", top:8, right:8,
                background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:8, width:32, height:32, cursor:"pointer",
                color: bookmarkedQs.some(b => b.q === currentQ.q) ? "#FBBF24" : "#64748b",
                fontSize:14, fontFamily:FONT,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}
              title="ブックマーク"
            >{bookmarkedQs.some(b => b.q === currentQ.q) ? "⭐" : "☆"}</button>
            {/* 問題報告ボタン */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReportIssue({ q: currentQ.q, choices: currentQ.choices, answer: currentQ.answer, reason: "" });
              }}
              data-sfx="none"
              style={{
                position:"absolute", top:8, left:8,
                background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:8, width:32, height:32, cursor:"pointer",
                color: reportedQuestions.some(r => r.q === currentQ.q) ? "#FB923C" : "#64748b",
                fontSize:13, fontFamily:FONT,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}
              title="問題を報告"
            >{reportedQuestions.some(r => r.q === currentQ.q) ? "📩" : "⚠️"}</button>
            <p style={{
              fontSize: battleMode === "ranked" ? 22 : 18,
              fontWeight:800, margin:0,
              lineHeight:1.5, color:"#ffffff", letterSpacing:0.3,
              padding:"0 28px",
            }}>{currentQ.q}</p>
          </div>
          {/* 選択肢: コントラスト高めで読みやすく */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {currentQ.choices.map((c,i) => {
              const ok = i===currentQ.answer, chosen = i===selected;
              let bg="rgba(30,41,59,0.95)", border="rgba(255,255,255,0.2)", color="#f8fafc", glow="none";
              if (selected !== null) {
                if (ok)     { bg="linear-gradient(135deg, rgba(52,211,153,0.35), rgba(52,211,153,0.2))"; border="#34D399"; color="#d1fae5"; glow="0 0 16px rgba(52,211,153,0.5)"; }
                else if (chosen) { bg="linear-gradient(135deg, rgba(239,68,68,0.35), rgba(239,68,68,0.2))"; border="#EF4444"; color="#fecaca"; glow="0 0 16px rgba(239,68,68,0.5)"; }
                else            { bg="rgba(30,41,59,0.5)"; color="#94a3b8"; }
              }
              return (
                <button
                  key={i}
                  onClick={() => selected===null&&handleAnswer(i)}
                  data-sfx="none"
                  style={{
                    background:bg,
                    border:`2px solid ${border}`,
                    borderRadius:14,
                    padding:"16px 10px",
                    cursor:selected===null?"pointer":"default",
                    color,
                    fontSize:15,
                    fontWeight:800,
                    lineHeight:1.4,
                    transition:"all 0.15s",
                    fontFamily:FONT,
                    minHeight:56,
                    boxShadow:glow,
                    letterSpacing:0.3,
                  }}
                >{c}</button>
              );
            })}
          </div>
          {/* 解説ボタン（回答後・オフライン以外） */}
          {selected !== null && !offlineMode && (
            <div style={{ marginTop:10 }}>
              {!explanation || explanation.q !== currentQ.q ? (
                <button onClick={() => fetchExplanation(currentQ)} disabled={explanationLoading} data-sfx="select" style={{
                  width:"100%",
                  background: explanationLoading ? "rgba(167,139,250,0.15)" : "rgba(167,139,250,0.18)",
                  border:"1px solid rgba(167,139,250,0.4)",
                  borderRadius:10, padding:"8px",
                  cursor: explanationLoading ? "default" : "pointer",
                  color:"#A78BFA", fontSize:11, fontWeight:800, fontFamily:FONT,
                }}>
                  {explanationLoading ? "🤔 考え中..." : "💡 解説を見る (AI)"}
                </button>
              ) : (
                <div style={{
                  background:"linear-gradient(135deg, rgba(167,139,250,0.15), rgba(96,165,250,0.08))",
                  border:"1px solid rgba(167,139,250,0.4)",
                  borderRadius:10, padding:"10px 12px",
                  fontSize:12, color:"#e0e7ff", lineHeight:1.6, fontFamily:FONT,
                  animation:"popIn 0.3s ease",
                }}>
                  <div style={{ fontSize:9, color:"#A78BFA", fontWeight:800, letterSpacing:2, marginBottom:4 }}>💡 解説</div>
                  {explanation.text}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══ INTERIM SCORE（問題間のスコア表示） ════════════ */}
      {showInterim && screen === S.BATTLE && (() => {
        const sorted = [...players].sort((a,b) => b.score - a.score);
        const userP = players.find(p => p.isUser);
        const userIdx = sorted.findIndex(p => p.isUser);
        return (
          <div style={{
            position:"fixed", inset:0, zIndex:150,
            background:"radial-gradient(circle at center, rgba(15,23,42,0.92), rgba(15,23,42,0.98))",
            display:"flex", alignItems:"center", justifyContent:"center",
            animation:"screenEnter 0.4s ease",
            padding:"20px",
          }}>
            <div style={{
              maxWidth:380, width:"100%",
              background:"linear-gradient(135deg, rgba(96,165,250,0.08), rgba(167,139,250,0.04))",
              border:"1px solid rgba(96,165,250,0.3)",
              borderRadius:24, padding:"22px 18px",
              animation:"popIn 0.4s ease",
              boxShadow:"0 0 40px rgba(96,165,250,0.3)",
            }}>
              {/* ヘッダー */}
              <div style={{ textAlign:"center", marginBottom:18 }}>
                <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:3, fontWeight:700, marginBottom:4 }}>📊 中間スコア</div>
                <div style={{ fontSize:14, color:"#cbd5e1" }}>Q{qIndex+1} 終了 — あと{questions.length - qIndex - 1}問</div>
              </div>

              {/* スコアランキング */}
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
                {sorted.map((p, i) => {
                  const rankBg = ["linear-gradient(135deg, #FBBF24, #F59E0B)", "linear-gradient(135deg, #94a3b8, #64748b)", "linear-gradient(135deg, #b45309, #92400e)", "rgba(255,255,255,0.06)"];
                  const rankColor = i < 3 ? "#0f172a" : "#94a3b8";
                  const hpCol = p.hp > 50 ? "#34D399" : p.hp > 25 ? "#FBBF24" : "#EF4444";
                  return (
                    <div key={p.id} style={{
                      background: p.isUser ? "linear-gradient(90deg, rgba(96,165,250,0.18), rgba(96,165,250,0.05))" : "rgba(255,255,255,0.03)",
                      border: p.isUser ? "2px solid rgba(96,165,250,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius:14, padding:"10px 12px",
                      display:"flex", alignItems:"center", gap:10,
                      opacity: p.hp <= 0 ? 0.4 : 1,
                      animation:`rankRow 0.4s ease ${i * 0.08}s both`,
                      boxShadow: p.isUser ? "0 0 16px rgba(96,165,250,0.3)" : "none",
                    }}>
                      <div style={{
                        width:30, height:30, borderRadius:8,
                        background: rankBg[i] || rankBg[3],
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:13, fontWeight:900, color:rankColor,
                        flexShrink:0,
                      }}>{i+1}</div>
                      {/* ペットアイコン */}
                      <div style={{ width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {p.isPet !== false ? (
                          <PetDisplay
                            genreXp={p.isUser ? genreXp : (p.petGenreXp || {})}
                            size={32}
                            starterEgg={p.isUser ? starterEgg : { color: p.petStarterColor }}
                          />
                        ) : (
                          <span style={{ fontSize:24 }}>{p.avatar}</span>
                        )}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                          <span style={{ fontSize:12, fontWeight:p.isUser?800:700, color:p.isUser?"#93C5FD":"#e2e8f0" }}>{p.name}</span>
                          {p.hp <= 0 && <span style={{ fontSize:8, background:"#7c2d12", color:"#fecaca", borderRadius:99, padding:"1px 5px", fontWeight:800 }}>DOWN</span>}
                        </div>
                        <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:4, overflow:"hidden" }}>
                          <div style={{ width:`${(p.hp/p.maxHp)*100}%`, height:"100%", background:hpCol, transition:"width 0.5s" }}/>
                        </div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <div style={{ fontSize:20, fontWeight:900, color: p.isUser ? "#FBBF24" : "#f1f5f9", lineHeight:1 }}>{p.score}</div>
                        <div style={{ fontSize:8, color:"#94a3b8", letterSpacing:1, marginTop:1 }}>pts</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* あなたの状況コメント */}
              <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:12, padding:"10px 14px", textAlign:"center" }}>
                <div style={{ fontSize:11, color:"#94a3b8", marginBottom:2 }}>あなたの順位</div>
                <div style={{ fontSize:15, fontWeight:800, color: userIdx===0 ? "#FBBF24" : userIdx===1 ? "#94a3b8" : userIdx===2 ? "#b45309" : "#EF4444" }}>
                  #{userIdx + 1} / {players.length}人中
                  {userIdx === 0 && " 🔥 首位キープ！"}
                  {userIdx === 1 && " ⚔️ あと一歩！"}
                  {userIdx === 2 && " 💪 追い上げよう"}
                  {userIdx >= 3 && " 🚀 まだ巻き返せる"}
                </div>
              </div>

              {/* カウントダウン的な進行表示 */}
              <div style={{ marginTop:12, textAlign:"center", fontSize:10, color:"#64748b", letterSpacing:2 }}>
                次の問題まで...
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ OFFLINE TOAST ═════════════════════════════════ */}
      {offlineToast && (
        <div style={{
          position:"fixed", top:"calc(20px + env(safe-area-inset-top, 0px))", left:"50%",
          transform:"translateX(-50%)",
          zIndex:340, animation:"toastSlide 0.4s ease",
          background: offlineToast.type === "online" 
            ? "linear-gradient(135deg, #34D399, #10B981)"
            : offlineToast.type === "reminder"
            ? "linear-gradient(135deg, #A78BFA, #8B5CF6)"
            : "linear-gradient(135deg, #EF4444, #DC2626)",
          color:"#fff", padding:"10px 18px", borderRadius:99,
          boxShadow:`0 8px 24px ${
            offlineToast.type === "online" ? "rgba(52,211,153,0.4)" 
            : offlineToast.type === "reminder" ? "rgba(167,139,250,0.4)"
            : "rgba(239,68,68,0.4)"
          }`,
          display:"flex", alignItems:"center", gap:8, fontFamily:FONT,
          fontSize:12, fontWeight:800,
        }}>
          <span style={{ fontSize:14 }}>{
            offlineToast.type === "online" ? "🌐" 
            : offlineToast.type === "reminder" ? "📚"
            : "📵"
          }</span>
          <span>{
            offlineToast.type === "online" ? "オンラインに戻りました" 
            : offlineToast.type === "reminder" ? "勉強の時間だよ✨"
            : "オフライン中 - AI機能は使えません"
          }</span>
        </div>
      )}

      {/* ══ SLOT GAME MODAL ═══════════════════════════════ */}
      {showSlot && (() => {
        const SYMBOLS = [
          { icon:"🍒", weight:30, payout: 2 },
          { icon:"🍋", weight:30, payout: 2 },
          { icon:"🍇", weight:25, payout: 3 },
          { icon:"🔔", weight:20, payout: 4 },
          { icon:"⭐", weight:12, payout: 10 },
          { icon:"💎", weight:5, payout: 30 },
          { icon:"🎰", weight:2, payout: 100 }, // JACKPOT
        ];
        const spinSlot = (bet) => {
          if (coins < bet || slotSpinning) return;
          setCoins(c => c - bet);
          setSlotSpinning(true);
          setSlotResult(null);
          SFX.tap();
          // 3つランダム選択（重み付け）
          const pickWeighted = () => {
            const totalWeight = SYMBOLS.reduce((s, x) => s + x.weight, 0);
            let r = Math.random() * totalWeight;
            for (const sym of SYMBOLS) {
              r -= sym.weight;
              if (r <= 0) return sym;
            }
            return SYMBOLS[0];
          };
          // 3つ独立にスピン（演出のため時間差で確定）
          const reels = [pickWeighted(), pickWeighted(), pickWeighted()];
          setTimeout(() => {
            setSlotReels([reels[0].icon, "?", "?"]);
            SFX.coin();
          }, 600);
          setTimeout(() => {
            setSlotReels([reels[0].icon, reels[1].icon, "?"]);
            SFX.coin();
          }, 1200);
          setTimeout(() => {
            setSlotReels([reels[0].icon, reels[1].icon, reels[2].icon]);
            // 判定
            const allSame = reels[0].icon === reels[1].icon && reels[1].icon === reels[2].icon;
            const twoMatch = (reels[0].icon === reels[1].icon) || (reels[1].icon === reels[2].icon) || (reels[0].icon === reels[2].icon);
            let win = 0;
            let type = "lose";
            if (allSame) {
              win = bet * reels[0].payout;
              type = reels[0].icon === "🎰" ? "jackpot" : "all";
              SFX.levelUp();
              setCoins(c => c + win);
              // Gemボーナス: 💎 or 🎰 揃いでGem付与
              if (reels[0].icon === "💎") { addGems(1); }
              if (reels[0].icon === "🎰") { addGems(5); }
            } else if (twoMatch) {
              // 2つ揃いはbet戻し（実質損なし）
              win = bet;
              type = "two";
              setCoins(c => c + win);
            }
            setSlotResult({ win, type, bet, reels });
            setSlotSpinning(false);
          }, 1800);
        };
        return (
          <div onClick={() => { if (!slotSpinning) { setShowSlot(false); setSlotResult(null); }}} style={{
            position:"fixed", inset:0, zIndex:310,
            background:"rgba(0,0,0,0.9)",
            display:"flex", alignItems:"center", justifyContent:"center", padding:20,
            animation:"fadeIn 0.3s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background:"linear-gradient(180deg, #1e293b, #0f172a)",
              border:"2px solid rgba(239,68,68,0.4)",
              borderRadius:24, padding:24,
              maxWidth:340, width:"100%",
              animation:"popIn 0.4s ease", fontFamily:FONT,
              textAlign:"center",
              boxShadow:"0 0 50px rgba(239,68,68,0.3)",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <h3 style={{ margin:0, fontSize:20, fontWeight:900, color:"#EF4444" }}>🎰 スロット</h3>
                <button onClick={() => { setShowSlot(false); setSlotResult(null); }} disabled={slotSpinning} style={{
                  background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:10, width:32, height:32, cursor: slotSpinning ? "not-allowed" : "pointer", color:"#cbd5e1",
                  fontSize:14, fontFamily:FONT,
                }}>✕</button>
              </div>
              {/* リール */}
              <div style={{
                background:"linear-gradient(180deg, #0f172a, #1e293b)",
                border:"3px solid #FBBF24",
                borderRadius:18, padding:"20px 12px", marginBottom:14,
                display:"flex", justifyContent:"center", gap:8,
                boxShadow:"inset 0 0 20px rgba(0,0,0,0.5), 0 0 30px rgba(251,191,36,0.3)",
              }}>
                {slotReels.map((r, i) => (
                  <div key={i} style={{
                    width:70, height:90, background:"#fff", borderRadius:10,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:48, fontWeight:900, color:"#0f172a",
                    boxShadow:"inset 0 2px 8px rgba(0,0,0,0.2)",
                    animation: slotSpinning ? `eggShake 0.1s ease infinite` : "none",
                  }}>{r}</div>
                ))}
              </div>
              {/* 結果表示 */}
              {slotResult && (
                <div style={{
                  background: slotResult.type === "jackpot" ? "linear-gradient(135deg, #FBBF24, #F472B6)" :
                              slotResult.type === "all" ? "linear-gradient(135deg, #34D399, #10B981)" :
                              slotResult.type === "two" ? "rgba(96,165,250,0.2)" :
                              "rgba(239,68,68,0.15)",
                  border: slotResult.type === "lose" ? "1px solid rgba(239,68,68,0.3)" : "1.5px solid rgba(255,255,255,0.4)",
                  borderRadius:14, padding:"10px 14px", marginBottom:14,
                  animation: slotResult.win > slotResult.bet ? "popIn 0.4s ease" : "fadeIn 0.3s ease",
                }}>
                  {slotResult.type === "jackpot" && (
                    <>
                      <div style={{ fontSize:11, color:"#0f172a", fontWeight:900, letterSpacing:4 }}>★ JACKPOT ★</div>
                      <div style={{ fontSize:24, fontWeight:900, color:"#0f172a" }}>+{slotResult.win}💰 ＋ 💎×5</div>
                    </>
                  )}
                  {slotResult.type === "all" && slotResult.reels[0].icon !== "🎰" && (
                    <>
                      <div style={{ fontSize:11, color:"#0f172a", fontWeight:900, letterSpacing:3 }}>🎉 3つ揃い！</div>
                      <div style={{ fontSize:22, fontWeight:900, color:"#0f172a" }}>+{slotResult.win}💰</div>
                      {slotResult.reels[0].icon === "💎" && <div style={{ fontSize:11, color:"#0f172a", fontWeight:800 }}>＋ 💎×1</div>}
                    </>
                  )}
                  {slotResult.type === "two" && (
                    <>
                      <div style={{ fontSize:10, color:"#60A5FA", fontWeight:800 }}>あと一歩...！</div>
                      <div style={{ fontSize:16, fontWeight:900, color:"#60A5FA" }}>賭け金返却</div>
                    </>
                  )}
                  {slotResult.type === "lose" && (
                    <>
                      <div style={{ fontSize:10, color:"#FCA5A5", fontWeight:800 }}>残念！</div>
                      <div style={{ fontSize:14, fontWeight:900, color:"#FCA5A5" }}>もう一回挑戦！</div>
                    </>
                  )}
                </div>
              )}
              {/* ベットボタン */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:10 }}>
                {[10, 50, 100].map(bet => (
                  <button key={bet} onClick={() => spinSlot(bet)} disabled={slotSpinning || coins < bet} style={{
                    background: coins < bet ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #EF4444, #DC2626)",
                    border:"none", borderRadius:10, padding:"10px",
                    cursor: (slotSpinning || coins < bet) ? "not-allowed" : "pointer",
                    color: coins < bet ? "#64748b" : "#fff", fontSize:12, fontWeight:900, fontFamily:FONT,
                    opacity: (slotSpinning || coins < bet) ? 0.5 : 1,
                    boxShadow: coins >= bet ? "0 4px 12px rgba(239,68,68,0.4)" : "none",
                  }}>
                    <div>💰{bet}</div>
                    <div style={{ fontSize:8, marginTop:2, opacity:0.9 }}>を賭ける</div>
                  </button>
                ))}
              </div>
              {/* 配当表 */}
              <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:10, padding:"8px 12px", fontSize:9, color:"#94a3b8", textAlign:"left", lineHeight:1.6 }}>
                <div style={{ fontSize:10, color:"#FBBF24", fontWeight:800, marginBottom:4, textAlign:"center" }}>💰 配当表（3つ揃い時）</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
                  <div>🍒🍒🍒 ×2倍</div>
                  <div>🍋🍋🍋 ×2倍</div>
                  <div>🍇🍇🍇 ×3倍</div>
                  <div>🔔🔔🔔 ×4倍</div>
                  <div>⭐⭐⭐ ×10倍</div>
                  <div>💎💎💎 ×30+💎</div>
                  <div style={{ gridColumn:"span 2", color:"#FBBF24", fontWeight:800, textAlign:"center" }}>🎰🎰🎰 JACKPOT ×100+💎×5</div>
                </div>
              </div>
              <div style={{ fontSize:9, color:"#64748b", marginTop:8 }}>
                💡 2つ揃いは賭け金返却 · 所持: 💰{coins} {gems > 0 ? `💎${gems}` : ""}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ CASINO MODAL (スロット) ═══════════════════════ */}
      {showCasino && (() => {
        // スロットのシンボル一覧（重み付き）
        const SYMBOLS = [
          { icon:"💰", weight:30, label:"コイン" },
          { icon:"🍒", weight:25, label:"チェリー" },
          { icon:"🔔", weight:20, label:"ベル" },
          { icon:"⭐", weight:13, label:"スター" },
          { icon:"💎", weight:8,  label:"ジェム" },
          { icon:"7️⃣", weight:4,  label:"セブン" },
        ];
        // 払い戻し倍率（3つ揃ったとき）
        const PAYOUT = {
          "💰": 2,    // 等倍 + 1
          "🍒": 3,
          "🔔": 5,
          "⭐": 10,
          "💎": 25,
          "7️⃣": 100, // ジャックポット
        };
        const BET = 30; // 1回30コイン
        // 重み付き抽選
        const drawSymbol = () => {
          const total = SYMBOLS.reduce((s, x) => s + x.weight, 0);
          let r = Math.random() * total;
          for (const sym of SYMBOLS) {
            r -= sym.weight;
            if (r <= 0) return sym.icon;
          }
          return SYMBOLS[0].icon;
        };
        const spin = () => {
          if (casinoSpinning || coins < BET) { SFX.wrong(); return; }
          setCoins(c => c - BET);
          setCasinoSpinning(true);
          setCasinoResult(null);
          SFX.start();
          // スロットアニメ: 0.5秒ごとに各リールが止まる
          let step = 0;
          const symbols = [drawSymbol(), drawSymbol(), drawSymbol()];
          const animInterval = setInterval(() => {
            setCasinoReels(prev => prev.map((_, i) => i <= step ? symbols[i] : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].icon));
            step++;
            if (step >= 3) {
              clearInterval(animInterval);
              setTimeout(() => {
                // 結果判定
                const allSame = symbols[0] === symbols[1] && symbols[1] === symbols[2];
                const twoSame = symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2];
                let payout = 0;
                let type = "miss";
                if (allSame) {
                  payout = BET * (PAYOUT[symbols[0]] || 2);
                  type = symbols[0] === "7️⃣" ? "jackpot" : "big";
                } else if (twoSame) {
                  payout = Math.floor(BET * 1.5); // 2つ揃いで1.5倍
                  type = "small";
                }
                if (payout > 0) {
                  setCoins(c => c + payout);
                  if (type === "jackpot") {
                    SFX.victory();
                    HAPTIC.critical();
                  } else {
                    SFX.levelUp();
                    HAPTIC.success();
                  }
                } else {
                  SFX.wrong();
                  HAPTIC.error();
                }
                setCasinoResult({ symbols, payout, type });
                setCasinoSpinning(false);
              }, 200);
            }
          }, 350);
        };
        return (
          <div onClick={() => { if (!casinoSpinning) setShowCasino(false); }} style={{
            position:"fixed", inset:0, zIndex:300,
            background:"rgba(0,0,0,0.88)",
            display:"flex", alignItems:"center", justifyContent:"center", padding:20,
            animation:"fadeIn 0.3s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background:"linear-gradient(135deg, #1e1b4b, #0a0f1e)",
              border:"2px solid rgba(251,191,36,0.5)",
              borderRadius:24, padding:24,
              maxWidth:340, width:"100%",
              animation:"popIn 0.4s ease", fontFamily:FONT,
              boxShadow:"0 0 50px rgba(251,191,36,0.3)",
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div>
                  <h3 style={{ margin:0, fontSize:18, fontWeight:900, color:"#FBBF24" }}>🎰 ラッキースロット</h3>
                  <div style={{ fontSize:9, color:"#94a3b8", marginTop:2 }}>3つ揃えて大当たり！</div>
                </div>
                <button onClick={() => { if (!casinoSpinning) setShowCasino(false); }} disabled={casinoSpinning} style={{
                  background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:10, width:32, height:32, cursor: casinoSpinning ? "not-allowed" : "pointer", color:"#cbd5e1",
                  fontSize:14, fontFamily:FONT,
                }}>✕</button>
              </div>

              {/* 残高 */}
              <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                <div style={{ flex:1, background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
                  <div style={{ fontSize:9, color:"#FBBF24", fontWeight:800 }}>所持</div>
                  <div style={{ fontSize:18, fontWeight:900, color:"#FBBF24" }}>💰 {coins}</div>
                </div>
                <div style={{ flex:1, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
                  <div style={{ fontSize:9, color:"#FCA5A5", fontWeight:800 }}>BET</div>
                  <div style={{ fontSize:18, fontWeight:900, color:"#EF4444" }}>💰 {BET}</div>
                </div>
              </div>

              {/* スロット本体 */}
              <div style={{
                background:"linear-gradient(135deg, #000, #1a1f3a)",
                border:"3px solid #FBBF24",
                borderRadius:18, padding:"20px 14px",
                marginBottom:14,
                boxShadow:"inset 0 4px 20px rgba(0,0,0,0.6)",
              }}>
                <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                  {casinoReels.map((sym, i) => (
                    <div key={i} style={{
                      flex:1, aspectRatio:"1/1",
                      background:"linear-gradient(180deg, #fff, #f3f4f6)",
                      border:"2px solid #FBBF24",
                      borderRadius:12,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize: 44,
                      animation: casinoSpinning ? "spinReel 0.1s linear infinite" : "none",
                      boxShadow:"0 4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.1)",
                    }}>{sym}</div>
                  ))}
                </div>
              </div>

              {/* 結果メッセージ */}
              {casinoResult && !casinoSpinning && (
                <div style={{
                  background: casinoResult.type === "jackpot" 
                    ? "linear-gradient(135deg, #FBBF24, #F59E0B)"
                    : casinoResult.type === "big"
                    ? "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05))"
                    : casinoResult.type === "small"
                    ? "linear-gradient(135deg, rgba(96,165,250,0.2), rgba(96,165,250,0.05))"
                    : "rgba(239,68,68,0.1)",
                  border: casinoResult.type === "jackpot" ? "2px solid #fff" 
                    : casinoResult.type === "big" ? "1.5px solid rgba(52,211,153,0.5)"
                    : casinoResult.type === "small" ? "1.5px solid rgba(96,165,250,0.5)"
                    : "1px solid rgba(239,68,68,0.3)",
                  borderRadius:12, padding:"10px 14px", marginBottom:12,
                  textAlign:"center",
                  animation: casinoResult.type === "jackpot" ? "pulse 0.6s ease-in-out infinite" : "popIn 0.3s ease",
                }}>
                  <div style={{ fontSize:11, fontWeight:900, color: casinoResult.type === "jackpot" ? "#7c2d12" : casinoResult.type === "big" ? "#34D399" : casinoResult.type === "small" ? "#60A5FA" : "#FCA5A5", marginBottom:2 }}>
                    {casinoResult.type === "jackpot" ? "🎉 ★ JACKPOT ★ 🎉" 
                     : casinoResult.type === "big" ? "🎊 大当たり！" 
                     : casinoResult.type === "small" ? "✨ ちょい当たり" 
                     : "残念..."}
                  </div>
                  <div style={{ fontSize: casinoResult.type === "jackpot" ? 22 : 16, fontWeight:900, color: casinoResult.type === "jackpot" ? "#7c2d12" : "#fff" }}>
                    {casinoResult.payout > 0 ? `+${casinoResult.payout} 💰` : "0 💰"}
                  </div>
                </div>
              )}

              {/* スピンボタン */}
              <button onClick={spin} disabled={casinoSpinning || coins < BET} style={{
                width:"100%",
                background: casinoSpinning || coins < BET 
                  ? "rgba(255,255,255,0.04)"
                  : "linear-gradient(135deg, #FBBF24, #F59E0B)",
                border:"none", borderRadius:14, padding:"14px",
                cursor: casinoSpinning || coins < BET ? "not-allowed" : "pointer",
                color: casinoSpinning || coins < BET ? "#64748b" : "#7c2d12",
                fontSize:16, fontWeight:900, fontFamily:FONT,
                boxShadow: casinoSpinning || coins < BET ? "none" : "0 6px 18px rgba(251,191,36,0.5)",
              }}>
                {casinoSpinning ? "🎰 SPIN..." : coins < BET ? "コインが足りません" : `🎰 SPIN! (-${BET}💰)`}
              </button>

              {/* 払い戻し表 */}
              <div style={{ marginTop:14, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 12px" }}>
                <div style={{ fontSize:9, color:"#94a3b8", fontWeight:800, letterSpacing:2, marginBottom:6 }}>💎 PAYOUT TABLE</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, fontSize:10 }}>
                  <div style={{ color:"#cbd5e1" }}>7️⃣7️⃣7️⃣ <span style={{ color:"#FBBF24", fontWeight:900 }}>×100</span></div>
                  <div style={{ color:"#cbd5e1" }}>💎💎💎 <span style={{ color:"#A78BFA", fontWeight:900 }}>×25</span></div>
                  <div style={{ color:"#cbd5e1" }}>⭐⭐⭐ <span style={{ color:"#60A5FA", fontWeight:900 }}>×10</span></div>
                  <div style={{ color:"#cbd5e1" }}>🔔🔔🔔 <span style={{ color:"#34D399", fontWeight:900 }}>×5</span></div>
                  <div style={{ color:"#cbd5e1" }}>🍒🍒🍒 <span style={{ color:"#F472B6", fontWeight:900 }}>×3</span></div>
                  <div style={{ color:"#cbd5e1" }}>💰💰💰 <span style={{ color:"#FBBF24", fontWeight:900 }}>×2</span></div>
                  <div style={{ color:"#cbd5e1", gridColumn:"1 / -1", marginTop:4, borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:4 }}>
                    2つ揃い <span style={{ color:"#94a3b8" }}>×1.5</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize:9, color:"#64748b", textAlign:"center", marginTop:8, lineHeight:1.5 }}>
                💡 余ったコインの使い道に！
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ HELP CENTER MODAL ═════════════════════════════ */}
      {showHelpCenter && (() => {
        const FAQ_DATA = [
          { id:"start", q:"どうやって始めればいい？", a:"ホーム画面で教科を選んで「バトル開始」を押すだけ！4人対戦で楽しく勉強できます。連続正解でコインも貯まります🎉" },
          { id:"pet", q:"ペットってどうやって進化する？", a:"バトルで正解するとXPが貯まり、レベルアップでペットが進化します。Lv2、Lv3でそれぞれ別の進化形に変身！" },
          { id:"coin", q:"コインは何に使える？", a:"ガチャで装飾アイテム（帽子、オーラ、肩書き）を引いたり、ペットに餌をあげたり、特別演出に使えます🎁" },
          { id:"boss", q:"ワールドボスって何？", a:"世界中のプレイヤーと協力して倒す週替わりの巨大ボス！1問正解ごとに攻撃して、上位なら追加報酬💰" },
          { id:"streak", q:"連続正解コンボとは？", a:"3問以上連続正解で発動！5問、10問と続けるほどボーナスXPと💰が増えます。連続記録は最大100まで！" },
          { id:"flashcard", q:"暗記カードの使い方は？", a:"ホームの「🃏暗記カード」から教科を選択。問題を見て自分で答えを考えて、タップで答え合わせ。素早い復習に最適です" },
          { id:"bookmark", q:"ブックマーク機能とは？", a:"バトル中、問題画面の右上☆をタップで保存。後で見返したり、ブックマーク問題だけでバトルもできます⭐" },
          { id:"report", q:"問題が間違ってるみたい...", a:"バトル中、問題の左上⚠️ボタンから報告できます！「答えが違う」「分かりにくい」など理由を選んで送信を" },
          { id:"forgetting", q:"忘却曲線って何？", a:"記憶定着に最適なタイミング（1日後・3日後・7日後）に間違えた問題を復習できます。ホームに通知が出ます" },
          { id:"title", q:"称号と肩書きの違いは？", a:"称号は実績で自動獲得（無料）、肩書きはガチャで入手（コイン必要）。両方をプロフィールで装備できます！" },
          { id:"ranked", q:"ランクマッチとソロの違いは？", a:"ランクマッチ＝レート変動あり、世界中のプレイヤーと対戦（6問・本気モード）。ソロ＝AIと気軽に対戦できます" },
          { id:"data", q:"データを引き継ぎたい", a:"設定→アカウント→「📥書き出し」でJSONファイルに保存できます。新しい端末で「📤読み込み」すれば復元！" },
          { id:"offline", q:"オフラインでも使える？", a:"AI機能（解説・写真AI・チューター）以外はオフラインでも全部使えます！通勤・通学中でもOK🚃" },
          { id:"pomodoro", q:"ポモドーロタイマーって何？", a:"25分集中→5分休憩を繰り返す学習法。プロフィールから起動。タイマーは他の画面に移動しても動き続けます🍅" },
          { id:"event", q:"季節イベントは？", a:"春・夏・秋・冬で背景や演出が変化！さらにクリスマス・お正月などの特別期間はコイン1.5倍ボーナス🎉" },
          { id:"sound", q:"音を消したい", a:"設定→音タブで音量調整、BGM ON/OFF、触覚フィードバック（バイブ）も切り替えられます🔇" },
          { id:"theme", q:"テーマを変えたい", a:"設定→外観タブで8種類のテーマから選べます。ダーク／ライト／オーシャン／さくら／サイバー／パステル／ミント／サンセット🎨" },
        ];
        return (
          <div onClick={() => { setShowHelpCenter(false); setHelpExpanded(null); }} style={{
            position:"fixed", inset:0, zIndex:300,
            background:"rgba(0,0,0,0.85)",
            display:"flex", alignItems:"center", justifyContent:"center", padding:20,
            animation:"fadeIn 0.3s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background:"#0f172a", border:"1px solid rgba(96,165,250,0.3)",
              borderRadius:20, padding:18,
              maxWidth:420, width:"100%", maxHeight:"85vh", overflowY:"auto",
              animation:"popIn 0.3s ease", fontFamily:FONT,
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, position:"sticky", top:0, background:"#0f172a", paddingBottom:8, zIndex:10 }}>
                <div>
                  <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:"#60A5FA" }}>❓ ヘルプセンター</h3>
                  <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>よくある質問</div>
                </div>
                <button onClick={() => { setShowHelpCenter(false); setHelpExpanded(null); }} style={{
                  background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:10, width:32, height:32, cursor:"pointer", color:"#cbd5e1",
                  fontSize:14, fontFamily:FONT,
                }}>✕</button>
              </div>

              {/* FAQ */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {FAQ_DATA.map((faq) => {
                  const expanded = helpExpanded === faq.id;
                  return (
                    <div key={faq.id} style={{
                      background: expanded ? "rgba(96,165,250,0.08)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${expanded ? "rgba(96,165,250,0.3)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius:10, overflow:"hidden",
                      transition:"all 0.2s",
                    }}>
                      <button onClick={() => setHelpExpanded(expanded ? null : faq.id)} style={{
                        width:"100%", background:"transparent", border:"none",
                        padding:"12px 14px", cursor:"pointer", color: expanded ? "#60A5FA" : "#f8fafc",
                        textAlign:"left", fontFamily:FONT,
                        display:"flex", alignItems:"center", justifyContent:"space-between", gap:10,
                      }}>
                        <span style={{ fontSize:12, fontWeight:700, flex:1 }}>
                          Q. {faq.q}
                        </span>
                        <span style={{ fontSize:12, transition:"transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}>▼</span>
                      </button>
                      {expanded && (
                        <div style={{
                          padding:"0 14px 12px",
                          fontSize:11, color:"#cbd5e1", lineHeight:1.7,
                          animation:"fadeIn 0.2s ease",
                        }}>
                          <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"10px 12px" }}>
                            💡 {faq.a}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 連絡先 */}
              <div style={{
                marginTop:14, background:"linear-gradient(135deg, rgba(167,139,250,0.1), rgba(96,165,250,0.05))",
                border:"1px solid rgba(167,139,250,0.3)", borderRadius:12, padding:"12px 14px",
                fontSize:11, color:"#cbd5e1", lineHeight:1.7, textAlign:"center",
              }}>
                <div style={{ fontSize:24, marginBottom:4 }}>💌</div>
                <div style={{ fontSize:11, fontWeight:800, color:"#A78BFA", marginBottom:4 }}>
                  解決しない場合
                </div>
                <div style={{ fontSize:10, color:"#94a3b8" }}>
                  バトル中の問題報告（⚠️ボタン）、または<br/>
                  ストアのレビューでお気軽にお知らせください
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ REPORT ISSUE MODAL ════════════════════════════ */}
      {showReportIssue && (
        <div onClick={() => setShowReportIssue(null)} style={{
          position:"fixed", inset:0, zIndex:310,
          background:"rgba(0,0,0,0.85)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:20,
          animation:"fadeIn 0.3s ease",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background:"#1e293b", border:"1px solid rgba(251,146,60,0.4)",
            borderRadius:20, padding:20,
            maxWidth:360, width:"100%",
            animation:"popIn 0.3s ease", fontFamily:FONT,
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:"#FB923C" }}>⚠️ 問題を報告</h3>
              <button onClick={() => setShowReportIssue(null)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, width:32, height:32, cursor:"pointer", color:"#cbd5e1",
                fontSize:14, fontFamily:FONT,
              }}>✕</button>
            </div>
            {/* 問題プレビュー */}
            <div style={{
              background:"rgba(0,0,0,0.3)", borderRadius:10,
              padding:"10px 12px", marginBottom:12,
              fontSize:11, color:"#cbd5e1", lineHeight:1.5,
              maxHeight:80, overflow:"auto",
            }}>
              <div style={{ fontSize:9, color:"#94a3b8", marginBottom:4 }}>問題:</div>
              {showReportIssue.q}
              <div style={{ fontSize:9, color:"#94a3b8", marginTop:6 }}>
                正解: <span style={{ color:"#34D399", fontWeight:700 }}>{showReportIssue.choices[showReportIssue.answer]}</span>
              </div>
            </div>
            <div style={{ fontSize:10, color:"#94a3b8", marginBottom:8 }}>
              どんな問題がありますか？
            </div>
            {/* 報告理由ボタン */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:12 }}>
              {[
                { id:"wrong_answer", label:"答えが間違っている", icon:"❌" },
                { id:"unclear", label:"問題文が分かりにくい", icon:"❓" },
                { id:"too_hard", label:"学年に対して難しすぎる", icon:"📈" },
                { id:"too_easy", label:"学年に対して簡単すぎる", icon:"📉" },
                { id:"typo", label:"誤字脱字がある", icon:"✏️" },
                { id:"other", label:"その他", icon:"💬" },
              ].map(reason => (
                <button key={reason.id} onClick={() => setShowReportIssue({ ...showReportIssue, reason: reason.id })} style={{
                  background: showReportIssue.reason === reason.id ? "rgba(251,146,60,0.2)" : "rgba(255,255,255,0.04)",
                  border: showReportIssue.reason === reason.id ? "1.5px solid rgba(251,146,60,0.5)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius:10, padding:"10px 12px",
                  cursor:"pointer", color: showReportIssue.reason === reason.id ? "#FB923C" : "#cbd5e1",
                  fontSize:12, fontWeight:700, fontFamily:FONT,
                  textAlign:"left",
                  display:"flex", alignItems:"center", gap:8,
                }}>
                  <span style={{ fontSize:16 }}>{reason.icon}</span>
                  <span>{reason.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => {
              if (!showReportIssue.reason) return;
              setReportedQuestions(prev => [...prev, {
                q: showReportIssue.q,
                reason: showReportIssue.reason,
                timestamp: Date.now(),
              }]);
              SFX.coin();
              setShowReportIssue(null);
              setTimeout(() => alert("📩 ご報告ありがとうございました！\n問題改善に活用させていただきます"), 100);
            }} disabled={!showReportIssue.reason} style={{
              width:"100%",
              background: showReportIssue.reason ? "linear-gradient(135deg, #FB923C, #EA580C)" : "rgba(255,255,255,0.05)",
              border:"none", borderRadius:12, padding:"12px",
              cursor: showReportIssue.reason ? "pointer" : "not-allowed",
              color: showReportIssue.reason ? "#fff" : "#64748b",
              fontSize:13, fontWeight:900, fontFamily:FONT,
              boxShadow: showReportIssue.reason ? "0 6px 18px rgba(251,146,60,0.4)" : "none",
            }}>📩 報告を送信</button>
            <div style={{ fontSize:9, color:"#64748b", marginTop:8, textAlign:"center", lineHeight:1.5 }}>
              💡 報告は開発チームに届きます<br/>
              皆さんのおかげで品質が上がります！
            </div>
          </div>
        </div>
      )}

      {/* ══ CASINO MODAL (スロット) ═══════════════════════ */}
      {showCasino && (() => {
        const SYMBOLS = ["🍒", "🍋", "🍊", "🔔", "💎", "7️⃣"];
        const PAYOUTS = {
          "7️⃣7️⃣7️⃣": 100,  // JACKPOT
          "💎💎💎": 50,
          "🔔🔔🔔": 20,
          "🍊🍊🍊": 10,
          "🍋🍋🍋": 8,
          "🍒🍒🍒": 5,
          "two_match": 1.5, // 2つ揃い
        };
        return (
          <div onClick={() => !casinoSpinning && setShowCasino(false)} style={{
            position:"fixed", inset:0, zIndex:310,
            background:"rgba(0,0,0,0.9)",
            display:"flex", alignItems:"center", justifyContent:"center", padding:20,
            animation:"fadeIn 0.3s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background:"linear-gradient(135deg, #1e293b, #0f172a)",
              border:"2px solid rgba(239,68,68,0.5)",
              borderRadius:20, padding:22,
              maxWidth:340, width:"100%", textAlign:"center",
              animation:"popIn 0.3s ease", fontFamily:FONT,
              boxShadow:"0 0 50px rgba(239,68,68,0.3)",
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <h3 style={{ margin:0, fontSize:18, fontWeight:900, color:"#EF4444" }}>🎰 スロット</h3>
                {!casinoSpinning && (
                  <button onClick={() => { setShowCasino(false); setCasinoResult(null); }} style={{
                    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                    borderRadius:10, width:32, height:32, cursor:"pointer", color:"#cbd5e1",
                    fontSize:14, fontFamily:FONT,
                  }}>✕</button>
                )}
              </div>

              {/* スロット表示 */}
              <div style={{
                background:"linear-gradient(135deg, #fbbf24, #f59e0b)",
                borderRadius:14, padding:"14px", marginBottom:12,
                boxShadow:"inset 0 4px 12px rgba(0,0,0,0.3)",
              }}>
                <div style={{
                  background:"#1f1611", borderRadius:10, padding:"18px 10px",
                  display:"flex", gap:6, justifyContent:"center",
                }}>
                  {casinoReels.map((s, i) => (
                    <div key={i} style={{
                      width:60, height:70, background:"#fff",
                      borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:38,
                      animation: casinoSpinning ? `spinReel 0.1s linear infinite` : "none",
                    }}>{SYMBOLS[s]}</div>
                  ))}
                </div>
              </div>

              {/* 結果表示 */}
              {casinoResult && (
                <div style={{
                  background: casinoResult.win 
                    ? "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(244,114,182,0.08))"
                    : "rgba(255,255,255,0.04)",
                  border: casinoResult.win 
                    ? "1.5px solid rgba(251,191,36,0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius:12, padding:"10px", marginBottom:12,
                  animation:"popIn 0.4s ease",
                }}>
                  <div style={{ fontSize:11, color: casinoResult.win ? "#FBBF24" : "#94a3b8", fontWeight:800, marginBottom:2 }}>
                    {casinoResult.label}
                  </div>
                  <div style={{ fontSize:18, fontWeight:900, color: casinoResult.win ? "#FBBF24" : "#94a3b8" }}>
                    {casinoResult.win ? `+${casinoResult.win}💰` : "残念...またチャレンジ！"}
                  </div>
                </div>
              )}

              {/* ペイアウト表 */}
              <div style={{
                background:"rgba(0,0,0,0.3)", borderRadius:10, padding:"8px 12px", marginBottom:12,
                fontSize:9, color:"#cbd5e1", textAlign:"left",
              }}>
                <div style={{ color:"#FBBF24", fontWeight:800, marginBottom:4 }}>💎 配当表 (×倍率)</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px 8px" }}>
                  <span>7️⃣7️⃣7️⃣ <span style={{ color:"#FBBF24", fontWeight:900 }}>×100</span></span>
                  <span>💎💎💎 <span style={{ color:"#A78BFA", fontWeight:900 }}>×50</span></span>
                  <span>🔔🔔🔔 <span style={{ color:"#60A5FA", fontWeight:900 }}>×20</span></span>
                  <span>🍊🍊🍊 <span style={{ color:"#FB923C", fontWeight:900 }}>×10</span></span>
                  <span>🍋🍋🍋 <span style={{ color:"#FBBF24", fontWeight:900 }}>×8</span></span>
                  <span>🍒🍒🍒 <span style={{ color:"#F472B6", fontWeight:900 }}>×5</span></span>
                  <span style={{ gridColumn:"span 2" }}>2つ揃い <span style={{ color:"#94a3b8", fontWeight:900 }}>×1.5</span></span>
                </div>
              </div>

              {/* スピンボタン */}
              <button onClick={() => {
                const cost = 30;
                if (casinoSpinning) return;
                if (coins < cost) { SFX.wrong(); return; }
                setCoins(c => c - cost);
                setCasinoResult(null);
                setCasinoSpinning(true);
                SFX.tap();
                // アニメーション中のリール
                const spinInterval = setInterval(() => {
                  setCasinoReels([
                    Math.floor(Math.random() * 6),
                    Math.floor(Math.random() * 6),
                    Math.floor(Math.random() * 6),
                  ]);
                }, 80);
                // 2秒後に結果確定
                setTimeout(() => {
                  clearInterval(spinInterval);
                  // 確率調整: 7️⃣をレアに、🍒を多めに
                  const weights = [0.3, 0.25, 0.2, 0.13, 0.08, 0.04]; // 🍒🍋🍊🔔💎7️⃣
                  const pickSymbol = () => {
                    const r = Math.random();
                    let acc = 0;
                    for (let i = 0; i < weights.length; i++) {
                      acc += weights[i];
                      if (r < acc) return i;
                    }
                    return 0;
                  };
                  const finalReels = [pickSymbol(), pickSymbol(), pickSymbol()];
                  setCasinoReels(finalReels);
                  // 判定
                  const s = finalReels.map(i => SYMBOLS[i]);
                  const key = s.join("");
                  let payout = 0, label = "ハズレ";
                  if (PAYOUTS[key]) {
                    payout = cost * PAYOUTS[key];
                    label = key === "7️⃣7️⃣7️⃣" ? "🎉 ジャックポット！" : `🎁 ${s[0]}揃い！`;
                  } else if (s[0] === s[1] || s[1] === s[2] || s[0] === s[2]) {
                    payout = Math.floor(cost * 1.5);
                    label = "🎁 2つ揃い";
                  }
                  if (payout > 0) {
                    setCoins(c => c + payout);
                    SFX.coin();
                    if (key === "7️⃣7️⃣7️⃣") SFX.levelUp();
                  }
                  setCasinoResult({ win: payout, label });
                  setCasinoSpinning(false);
                }, 2000);
              }} disabled={casinoSpinning || coins < 30} style={{
                width:"100%",
                background: casinoSpinning ? "rgba(255,255,255,0.06)" 
                  : coins < 30 ? "rgba(255,255,255,0.04)"
                  : "linear-gradient(135deg, #EF4444, #DC2626)",
                border:"none", borderRadius:12, padding:"14px",
                cursor: (casinoSpinning || coins < 30) ? "not-allowed" : "pointer",
                color: (casinoSpinning || coins < 30) ? "#64748b" : "#fff",
                fontSize:14, fontWeight:900, fontFamily:FONT,
                boxShadow: (casinoSpinning || coins < 30) ? "none" : "0 6px 18px rgba(239,68,68,0.4)",
              }}>
                {casinoSpinning ? "🎰 回転中..." : coins < 30 ? "💰不足" : `🎰 スピン (30💰)`}
              </button>
              <div style={{ fontSize:9, color:"#64748b", marginTop:8 }}>
                💡 1回30💰でレッツチャレンジ！
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ PLAYER LEVEL UP POPUP ═════════════════════════ */}
      {levelUpPopup && (() => {
        const isMilestone1000 = levelUpPopup.type === "milestone1000";
        const isMilestone100 = levelUpPopup.type === "milestone100";
        const isMilestone10 = levelUpPopup.type === "milestone10";
        const isMilestone = isMilestone10 || isMilestone100 || isMilestone1000;
        const mainColor = isMilestone1000 ? "#FBBF24"
                        : isMilestone100 ? "#A78BFA"
                        : isMilestone10 ? "#34D399"
                        : "#60A5FA";
        const reward = isMilestone1000 ? { coin:100000, gem:100 }
                     : isMilestone100 ? { coin:10000, gem:20 }
                     : isMilestone10 ? { coin:500, gem:3 }
                     : { coin:100, gem:0 };
        return (
          <div style={{
            position:"fixed", inset:0, zIndex:450,
            background:"rgba(0,0,0,0.85)",
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:20, animation:"fadeIn 0.4s ease",
            pointerEvents:"auto",
          }}>
            {/* 紙吹雪（マイルストーン時のみ） */}
            {isMilestone && Array.from({length: isMilestone1000 ? 40 : isMilestone100 ? 24 : 14}).map((_, i) => {
              const colors = isMilestone1000 ? ["#FBBF24", "#F472B6", "#A78BFA", "#60A5FA", "#34D399"]
                          : isMilestone100 ? ["#A78BFA", "#8B5CF6", "#F472B6"]
                          : ["#34D399", "#10B981", "#60A5FA"];
              return (
                <div key={i} style={{
                  position:"absolute", top:-20,
                  left:`${Math.random() * 100}%`,
                  width: isMilestone1000 ? 12 : 8,
                  height: isMilestone1000 ? 12 : 8,
                  background: colors[i % colors.length],
                  borderRadius: i % 2 ? "50%" : "2px",
                  animation:`confettiFall ${2 + Math.random() * 2}s linear ${Math.random() * 0.5}s forwards`,
                  pointerEvents:"none",
                }}/>
              );
            })}
            
            {/* 背景の光線（100以上） */}
            {(isMilestone100 || isMilestone1000) && Array.from({length: 12}).map((_, i) => (
              <div key={`ray-${i}`} style={{
                position:"absolute", top:"50%", left:"50%",
                width:6, height: isMilestone1000 ? 400 : 300,
                background:`linear-gradient(180deg, ${mainColor}, transparent)`,
                transformOrigin:"50% 0",
                transform:`rotate(${i * 30}deg) translateY(-50%)`,
                animation:`titleRay ${isMilestone1000 ? 3 : 2}s ease-in-out infinite`,
                animationDelay:`${i * 0.1}s`,
                pointerEvents:"none",
                opacity:0.6,
              }}/>
            ))}

            {/* グロー */}
            <div style={{
              position:"absolute", top:"50%", left:"50%",
              transform:"translate(-50%, -50%)",
              width: isMilestone1000 ? 600 : isMilestone100 ? 500 : 400,
              height: isMilestone1000 ? 600 : isMilestone100 ? 500 : 400,
              background: `radial-gradient(circle, ${mainColor}55 0%, transparent 60%)`,
              animation:"titleGlow 2s ease-in-out infinite",
              pointerEvents:"none",
            }}/>

            {/* メインカード */}
            <div style={{
              position:"relative",
              background: isMilestone1000 
                ? "linear-gradient(135deg, #FBBF24, #F472B6, #A78BFA)"
                : isMilestone100 
                ? "linear-gradient(135deg, #A78BFA, #8B5CF6)"
                : isMilestone10 
                ? "linear-gradient(135deg, #34D399, #10B981)"
                : "linear-gradient(135deg, #60A5FA, #3B82F6)",
              color: "#0f172a",
              padding: isMilestone1000 ? "36px 40px" : isMilestone100 ? "30px 36px" : "26px 32px",
              borderRadius: isMilestone ? 28 : 22,
              boxShadow: `0 0 ${isMilestone1000 ? 100 : isMilestone100 ? 70 : 40}px ${mainColor}, 0 12px 40px rgba(0,0,0,0.5)`,
              textAlign:"center", fontFamily:FONT,
              border:`3px solid rgba(255,255,255,${isMilestone ? 0.6 : 0.4})`,
              animation:"titleUnlockPop 0.7s ease-out",
              maxWidth: 360,
            }}>
              <div style={{
                fontSize: 9, fontWeight:900, letterSpacing:5, marginBottom:6,
                opacity: 0.7, color: "#0f172a",
              }}>
                {isMilestone1000 ? "★ LEGENDARY MILESTONE ★"
                 : isMilestone100 ? "★★ ELITE MILESTONE ★★"
                 : isMilestone10 ? "✦ MILESTONE ✦"
                 : "★ LEVEL UP ★"}
              </div>
              <div style={{
                fontSize: isMilestone1000 ? 22 : 18, fontWeight:900, marginBottom:8,
                opacity:0.9, letterSpacing:3,
              }}>
                {isMilestone1000 ? "🌌 MASTER ACHIEVEMENT 🌌"
                 : isMilestone100 ? "👑 ELITE LEVEL 👑"
                 : isMilestone10 ? "🎉 LEVEL UP! 🎉"
                 : "レベルアップ"}
              </div>
              <div style={{ 
                display:"flex", alignItems:"center", justifyContent:"center", gap:14,
                marginBottom:12,
              }}>
                <div style={{ 
                  fontSize: 32, fontWeight:900, opacity:0.5,
                  textDecoration:"line-through",
                }}>Lv{levelUpPopup.prevLevel}</div>
                <div style={{ fontSize:24 }}>→</div>
                <div style={{
                  fontSize: isMilestone1000 ? 80 : isMilestone100 ? 70 : 56,
                  fontWeight:900, lineHeight:1,
                  textShadow:"0 2px 12px rgba(0,0,0,0.3)",
                  animation:"titleIconBounce 1s ease-out",
                }}>Lv{levelUpPopup.level}</div>
              </div>
              {/* 報酬表示 */}
              <div style={{
                background:"rgba(0,0,0,0.25)",
                borderRadius:14, padding:"10px 14px",
                display:"flex", justifyContent:"center", gap:14, alignItems:"center",
                marginBottom: isMilestone ? 14 : 4,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:20 }}>💰</span>
                  <span style={{ fontSize:18, fontWeight:900, color:"#0f172a" }}>+{reward.coin.toLocaleString()}</span>
                </div>
                {reward.gem > 0 && (
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:20 }}>💎</span>
                    <span style={{ fontSize:18, fontWeight:900, color:"#0f172a" }}>+{reward.gem}</span>
                  </div>
                )}
              </div>

              {isMilestone1000 && (
                <div style={{ fontSize:11, fontWeight:800, opacity:0.85, lineHeight:1.5, marginBottom:6 }}>
                  🏆 称号「真の覇王」を獲得！<br/>
                  あなたは伝説の存在になりました。
                </div>
              )}
              {isMilestone100 && (
                <div style={{ fontSize:11, fontWeight:800, opacity:0.85, lineHeight:1.5, marginBottom:6 }}>
                  ✨ 一握りの精鋭の仲間入り！<br/>
                  上位の称号がアンロックされました。
                </div>
              )}
              {isMilestone10 && (
                <div style={{ fontSize:11, fontWeight:800, opacity:0.85, marginBottom:6 }}>
                  🌟 順調に成長中！この調子！
                </div>
              )}

              <button onClick={() => setLevelUpPopup(null)} style={{
                background:"rgba(0,0,0,0.3)",
                border:"2px solid rgba(255,255,255,0.4)",
                borderRadius:12, padding:"10px 24px",
                cursor:"pointer", color:"#fff", fontSize:13, fontWeight:900, fontFamily:FONT,
                marginTop:4,
              }}>続ける</button>
            </div>
          </div>
        );
      })()}

      {/* ══ EXCHANGE MODAL (Gem両替) ════════════════════════ */}
      {showExchange && (
        <div onClick={() => setShowExchange(false)} style={{
          position:"fixed", inset:0, zIndex:310,
          background:"rgba(0,0,0,0.85)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:20,
          animation:"fadeIn 0.3s ease",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background:"linear-gradient(135deg, #1e293b, #0f172a)",
            border:"2px solid rgba(167,139,250,0.5)",
            borderRadius:20, padding:22,
            maxWidth:340, width:"100%", textAlign:"center",
            animation:"popIn 0.3s ease", fontFamily:FONT,
            boxShadow:"0 0 50px rgba(167,139,250,0.3)",
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0, fontSize:18, fontWeight:900, color:"#A78BFA" }}>💎 Gem両替</h3>
              <button onClick={() => setShowExchange(false)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, width:32, height:32, cursor:"pointer", color:"#cbd5e1",
                fontSize:14, fontFamily:FONT,
              }}>✕</button>
            </div>
            <div style={{
              background:"linear-gradient(135deg, rgba(167,139,250,0.12), rgba(167,139,250,0.04))",
              border:"1px solid rgba(167,139,250,0.3)",
              borderRadius:14, padding:"16px", marginBottom:14,
            }}>
              <div style={{ fontSize:36, marginBottom:6 }}>💰→💎</div>
              <div style={{ fontSize:13, color:"#cbd5e1", marginBottom:4 }}>
                <span style={{ color:"#FBBF24", fontWeight:900 }}>1,000💰</span> = <span style={{ color:"#A78BFA", fontWeight:900 }}>1💎</span>
              </div>
              <div style={{ fontSize:10, color:"#94a3b8" }}>
                💎は将来の特別ガチャに使えます
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
              {[1, 5, 10, 50].map(amount => {
                const cost = amount * 1000;
                const affordable = coins >= cost;
                return (
                  <button key={amount} onClick={() => {
                    if (!affordable) { SFX.wrong(); return; }
                    setCoins(c => c - cost);
                    setGems(g => {
                      const newG = g + amount;
                      setMaxGems(prev => Math.max(prev, newG));
                      return newG;
                    });
                    SFX.levelUp();
                    setTimeout(() => alert(`💎 ${amount} 個を獲得しました！`), 100);
                  }} disabled={!affordable} style={{
                    background: affordable 
                      ? "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(167,139,250,0.08))"
                      : "rgba(255,255,255,0.04)",
                    border: affordable 
                      ? "1.5px solid rgba(167,139,250,0.4)"
                      : "1px solid rgba(255,255,255,0.08)",
                    borderRadius:12, padding:"10px",
                    cursor: affordable ? "pointer" : "not-allowed",
                    color: affordable ? "#A78BFA" : "#64748b",
                    fontFamily:FONT,
                    opacity: affordable ? 1 : 0.5,
                  }}>
                    <div style={{ fontSize:18, marginBottom:2 }}>💎×{amount}</div>
                    <div style={{ fontSize:11, fontWeight:800 }}>{cost.toLocaleString()}💰</div>
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize:9, color:"#64748b", lineHeight:1.5 }}>
              💡 累計Gem: {maxGems} · 現在Gem: {gems}
            </div>
          </div>
        </div>
      )}

      {/* ══ POMODORO FLOATING WIDGET ══════════════════════ */}
      {pomodoroActive && !showPomodoro && screen !== S.SPLASH && screen !== S.ONBOARDING && (
        <button onClick={() => setShowPomodoro(true)} style={{
          position:"fixed",
          bottom: `calc(150px + env(safe-area-inset-bottom, 0px))`,
          right: 14,
          zIndex: 90,
          background: pomodoroPhase === "work" ? "linear-gradient(135deg, #EF4444, #DC2626)" : "linear-gradient(135deg, #34D399, #10B981)",
          border:"none", borderRadius:99, padding:"10px 14px",
          cursor:"pointer", color:"#fff", fontFamily:FONT, fontSize:13, fontWeight:900,
          boxShadow:`0 6px 20px ${pomodoroPhase === "work" ? "rgba(239,68,68,0.5)" : "rgba(52,211,153,0.5)"}`,
          display:"flex", alignItems:"center", gap:6,
          animation:"pulse 2s ease-in-out infinite",
        }}>
          <span>{pomodoroPhase === "work" ? "🍅" : "☕"}</span>
          <span style={{ fontFamily:"monospace" }}>
            {String(Math.floor(pomodoroSeconds/60)).padStart(2,"0")}:{String(pomodoroSeconds%60).padStart(2,"0")}
          </span>
        </button>
      )}

      {/* ══ POMODORO MODAL ═══════════════════════════════ */}
      {showPomodoro && (
        <div onClick={() => setShowPomodoro(false)} style={{
          position:"fixed", inset:0, zIndex:310,
          background:"rgba(0,0,0,0.85)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:20,
          animation:"fadeIn 0.3s ease",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background:"linear-gradient(135deg, #1e293b, #0f172a)",
            border: pomodoroActive 
              ? (pomodoroPhase === "work" ? "2px solid rgba(239,68,68,0.5)" : "2px solid rgba(52,211,153,0.5)")
              : "2px solid rgba(167,139,250,0.4)",
            borderRadius:24, padding:24,
            maxWidth:340, width:"100%", textAlign:"center",
            animation:"popIn 0.3s ease", fontFamily:FONT,
            boxShadow: pomodoroActive
              ? (pomodoroPhase === "work" ? "0 0 50px rgba(239,68,68,0.3)" : "0 0 50px rgba(52,211,153,0.3)")
              : "0 0 50px rgba(167,139,250,0.3)",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <h3 style={{ margin:0, fontSize:18, fontWeight:900, color:"#fff" }}>
                🍅 ポモドーロタイマー
              </h3>
              <button onClick={() => setShowPomodoro(false)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, width:32, height:32, cursor:"pointer", color:"#cbd5e1",
                fontSize:14, fontFamily:FONT,
              }}>✕</button>
            </div>

            {/* 説明 */}
            {!pomodoroActive && (
              <div style={{ fontSize:11, color:"#94a3b8", lineHeight:1.7, marginBottom:18, padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
                💡 25分集中 → 5分休憩を繰り返す<br/>
                集中力を保ちながら勉強できる学習法です
              </div>
            )}

            {/* タイマー本体 */}
            <div style={{
              background: pomodoroPhase === "work" 
                ? "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))" 
                : "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.05))",
              border: `2px solid ${pomodoroPhase === "work" ? "rgba(239,68,68,0.4)" : "rgba(52,211,153,0.4)"}`,
              borderRadius:18, padding:"24px 18px", marginBottom:14,
            }}>
              <div style={{ fontSize:10, color: pomodoroPhase === "work" ? "#FCA5A5" : "#6EE7B7", letterSpacing:4, fontWeight:800, marginBottom:6 }}>
                {pomodoroPhase === "work" ? "📚 集中タイム" : "☕ 休憩タイム"}
              </div>
              <div style={{ fontSize:54, fontFamily:"monospace", fontWeight:900, color:"#fff", lineHeight:1, marginBottom:8 }}>
                {String(Math.floor(pomodoroSeconds/60)).padStart(2,"0")}:{String(pomodoroSeconds%60).padStart(2,"0")}
              </div>
              {/* プログレスバー */}
              <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:6, overflow:"hidden", marginBottom:8 }}>
                <div style={{
                  width: `${100 - (pomodoroSeconds / (pomodoroPhase === "work" ? 25*60 : 5*60)) * 100}%`,
                  height:"100%",
                  background: pomodoroPhase === "work" 
                    ? "linear-gradient(90deg, #EF4444, #DC2626)" 
                    : "linear-gradient(90deg, #34D399, #10B981)",
                  transition:"width 1s linear",
                }}/>
              </div>
              <div style={{ fontSize:10, color:"#94a3b8" }}>
                完了サイクル: {pomodoroCount}回
              </div>
            </div>

            {/* ボタン */}
            <div style={{ display:"flex", gap:8 }}>
              {!pomodoroActive ? (
                <button onClick={() => {
                  setPomodoroActive(true);
                  setPomodoroPhase("work");
                  setPomodoroSeconds(25 * 60);
                  SFX.start();
                  // 通知許可
                  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
                    Notification.requestPermission();
                  }
                }} style={{
                  flex:1, background:"linear-gradient(135deg, #A78BFA, #8B5CF6)",
                  border:"none", borderRadius:12, padding:"12px",
                  cursor:"pointer", color:"#fff", fontSize:14, fontWeight:900, fontFamily:FONT,
                  boxShadow:"0 6px 18px rgba(167,139,250,0.4)",
                }}>▶ スタート</button>
              ) : (
                <>
                  <button onClick={() => {
                    setPomodoroActive(false);
                  }} style={{
                    flex:1, background:"rgba(251,191,36,0.2)",
                    border:"1.5px solid rgba(251,191,36,0.5)", borderRadius:12, padding:"12px",
                    cursor:"pointer", color:"#FBBF24", fontSize:13, fontWeight:800, fontFamily:FONT,
                  }}>⏸ 一時停止</button>
                  <button onClick={() => {
                    setPomodoroActive(false);
                    setPomodoroPhase("work");
                    setPomodoroSeconds(25 * 60);
                    setPomodoroCount(0);
                  }} style={{
                    flex:1, background:"rgba(239,68,68,0.15)",
                    border:"1px solid rgba(239,68,68,0.3)", borderRadius:12, padding:"12px",
                    cursor:"pointer", color:"#FCA5A5", fontSize:13, fontWeight:700, fontFamily:FONT,
                  }}>🔄 リセット</button>
                </>
              )}
            </div>
            <div style={{ fontSize:9, color:"#64748b", marginTop:10, textAlign:"center" }}>
              💡 タイマーは他の画面でも動き続けます
            </div>
          </div>
        </div>
      )}

      {/* ══ REVIEW PROMPT MODAL ═══════════════════════════ */}
      {showReviewPrompt && (
        <div style={{
          position:"fixed", inset:0, zIndex:320,
          background:"rgba(0,0,0,0.8)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:20, animation:"fadeIn 0.3s ease",
        }}>
          <div style={{
            background:"linear-gradient(135deg, #1e293b, #0f172a)",
            border:"2px solid rgba(251,191,36,0.5)",
            borderRadius:20, padding:24,
            maxWidth:340, width:"100%", textAlign:"center",
            boxShadow:"0 0 50px rgba(251,191,36,0.3)",
            animation:"popIn 0.4s ease", fontFamily:FONT,
          }}>
            {/* キラキラ星 */}
            <div style={{ display:"flex", justifyContent:"center", gap:4, marginBottom:8 }}>
              {[0,1,2,3,4].map(i => (
                <span key={i} style={{
                  fontSize:28,
                  animation:`titleIconBounce 0.6s ease ${i * 0.1}s both`,
                }}>⭐</span>
              ))}
            </div>
            <h3 style={{ margin:"4px 0 8px", fontSize:18, fontWeight:900, color:"#FBBF24" }}>
              いつもありがとう！
            </h3>
            <div style={{ fontSize:11, color:"#cbd5e1", lineHeight:1.6, marginBottom:18 }}>
              10回もバトルに挑戦してくれたね🎉<br/>
              気に入ってくれたら、星5つで応援してくれると嬉しいな
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <button onClick={() => {
                // 実機ではここでネイティブのレビュー誘導APIを呼ぶ
                // Web版では「ありがとう」を表示
                setShowReviewPrompt(false);
                setReviewDeclined(true); // 再度出ない
                setTimeout(() => alert("⭐ ストア公開時はここで評価画面が開きます！\n応援ありがとう🙏"), 200);
              }} style={{
                background:"linear-gradient(135deg, #FBBF24, #F59E0B)",
                border:"none", borderRadius:12, padding:"12px",
                cursor:"pointer", color:"#7c2d12", fontSize:14, fontWeight:900, fontFamily:FONT,
                boxShadow:"0 6px 18px rgba(251,191,36,0.4)",
              }}>⭐ 評価する</button>
              <button onClick={() => {
                setShowReviewPrompt(false);
                setReviewDeclined(true);
              }} style={{
                background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:12, padding:"10px",
                cursor:"pointer", color:"#94a3b8", fontSize:11, fontWeight:700, fontFamily:FONT,
              }}>あとで</button>
              <div style={{ fontSize:9, color:"#64748b", marginTop:4 }}>
                ご意見・要望は設定画面の「フィードバック」からも送れます
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ BATTLE HISTORY MODAL ══════════════════════════ */}
      {showBattleHistory && (
        <div onClick={() => setShowBattleHistory(false)} style={{
          position:"fixed", inset:0, zIndex:280,
          background:"rgba(0,0,0,0.85)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:20, animation:"fadeIn 0.2s ease",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background:"#0f172a", border:"1px solid rgba(96,165,250,0.3)",
            borderRadius:20, padding:18,
            maxWidth:380, width:"100%", maxHeight:"80vh", overflowY:"auto",
            animation:"popIn 0.3s ease", fontFamily:FONT,
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:"#60A5FA" }}>📋 対戦履歴</h3>
              <button onClick={() => setShowBattleHistory(false)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, width:32, height:32, cursor:"pointer", color:"#cbd5e1",
                fontSize:14, fontFamily:FONT,
              }}>✕</button>
            </div>
            {/* サマリー */}
            <div style={{ background:"rgba(96,165,250,0.08)", border:"1px solid rgba(96,165,250,0.2)", borderRadius:12, padding:"10px 12px", marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-around" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:900, color:"#60A5FA" }}>{battleHistory.length}</div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>試合</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:900, color:"#FBBF24" }}>{battleHistory.filter(b => b.rank === 1).length}</div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>1位</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:900, color:"#34D399" }}>
                    {Math.round(battleHistory.reduce((s,b) => s + (b.correctCount/b.totalQ)*100, 0) / battleHistory.length)}%
                  </div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>平均正答率</div>
                </div>
              </div>
            </div>
            {/* リスト */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {battleHistory.map((b, i) => {
                const gInfo = GENRES.find(g => g.id === b.genre) || GENRES[0];
                const rate = Math.round((b.correctCount / b.totalQ) * 100);
                const rankEmoji = b.rank === 1 ? "🥇" : b.rank === 2 ? "🥈" : b.rank === 3 ? "🥉" : "💪";
                const d = new Date(b.timestamp);
                const dStr = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
                return (
                  <div key={i} style={{
                    background:`linear-gradient(135deg, ${gInfo.color}10, rgba(0,0,0,0.2))`,
                    border:`1px solid ${gInfo.color}30`,
                    borderRadius:10, padding:"8px 10px",
                    display:"flex", alignItems:"center", gap:8,
                  }}>
                    <div style={{ fontSize:24 }}>{rankEmoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                        <span style={{ fontSize:9, color: gInfo.color, fontWeight:800, background:`${gInfo.color}20`, padding:"1px 5px", borderRadius:6 }}>
                          {gInfo.icon}
                        </span>
                        <span style={{ fontSize:10, color:"#fff", fontWeight:800 }}>{b.rank}位/{b.totalPlayers}</span>
                        <span style={{ fontSize:8, color:"#94a3b8", marginLeft:"auto" }}>{dStr}</span>
                      </div>
                      <div style={{ display:"flex", gap:8, fontSize:9, color:"#94a3b8" }}>
                        <span>正答 <span style={{ color:"#34D399", fontWeight:700 }}>{b.correctCount}/{b.totalQ}</span></span>
                        <span>正答率 <span style={{ color: rate >= 80 ? "#34D399" : rate >= 50 ? "#FBBF24" : "#EF4444", fontWeight:700 }}>{rate}%</span></span>
                        <span>スコア <span style={{ color:"#60A5FA", fontWeight:700 }}>{b.score}</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {battleHistory.length >= 20 && (
              <div style={{ fontSize:9, color:"#64748b", textAlign:"center", marginTop:10 }}>
                直近20試合まで保存されます
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ WRONG NOTE MODAL ══════════════════════════════ */}
      {showWrongNote && (
        <div onClick={() => setShowWrongNote(null)} style={{
          position:"fixed", inset:0, zIndex:300,
          background:"rgba(0,0,0,0.85)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:20, animation:"fadeIn 0.3s ease",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background:"#1e293b", border:"1px solid rgba(251,191,36,0.4)",
            borderRadius:20, padding:20,
            maxWidth:360, width:"100%",
            animation:"popIn 0.3s ease", fontFamily:FONT,
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:"#FBBF24" }}>📝 問題メモ</h3>
              <button onClick={() => setShowWrongNote(null)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, width:32, height:32, cursor:"pointer", color:"#cbd5e1",
                fontSize:14, fontFamily:FONT,
              }}>✕</button>
            </div>
            <div style={{
              background:"rgba(0,0,0,0.3)", borderRadius:10,
              padding:"10px 12px", marginBottom:12,
              fontSize:11, color:"#cbd5e1", lineHeight:1.5,
              maxHeight:80, overflow:"auto",
            }}>
              <div style={{ fontSize:9, color:"#94a3b8", marginBottom:4 }}>問題:</div>
              {showWrongNote.q}
            </div>
            <div style={{ fontSize:10, color:"#94a3b8", marginBottom:6 }}>
              なぜ間違えたか・覚えるコツなどメモしよう
            </div>
            <textarea
              value={showWrongNote.note}
              onChange={(e) => setShowWrongNote({ ...showWrongNote, note: e.target.value })}
              placeholder="例: be動詞と一般動詞を間違えた"
              maxLength={200}
              style={{
                width:"100%", background:"rgba(0,0,0,0.4)",
                border:"1.5px solid rgba(251,191,36,0.4)",
                borderRadius:10, padding:"10px 12px",
                color:"#fff", fontSize:12, lineHeight:1.5,
                fontFamily:FONT, outline:"none",
                minHeight:80, boxSizing:"border-box", resize:"vertical",
              }}
            />
            <div style={{ fontSize:9, color:"#64748b", textAlign:"right", marginTop:4 }}>
              {showWrongNote.note.length}/200
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              {wrongNotes[showWrongNote.q] && (
                <button onClick={() => {
                  setWrongNotes(prev => {
                    const next = { ...prev };
                    delete next[showWrongNote.q];
                    return next;
                  });
                  setShowWrongNote(null);
                }} style={{
                  flex:1, background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)",
                  borderRadius:10, padding:"10px", cursor:"pointer",
                  color:"#FCA5A5", fontSize:12, fontWeight:800, fontFamily:FONT,
                }}>削除</button>
              )}
              <button onClick={() => {
                if (showWrongNote.note.trim()) {
                  setWrongNotes(prev => ({ ...prev, [showWrongNote.q]: showWrongNote.note.trim() }));
                  SFX.coin();
                }
                setShowWrongNote(null);
              }} disabled={!showWrongNote.note.trim()} style={{
                flex:2,
                background: showWrongNote.note.trim() ? "linear-gradient(135deg, #FBBF24, #F59E0B)" : "rgba(255,255,255,0.05)",
                border:"none", borderRadius:10, padding:"10px",
                cursor: showWrongNote.note.trim() ? "pointer" : "not-allowed",
                color: showWrongNote.note.trim() ? "#7c2d12" : "#64748b",
                fontSize:12, fontWeight:900, fontFamily:FONT,
              }}>💾 保存</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ FRIEND QR MODAL ════════════════════════════════ */}
      {showFriendQR && (
        <div onClick={() => setShowFriendQR(false)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:300,
          display:"flex", alignItems:"center", justifyContent:"center", padding:20,
          animation:"fadeIn 0.3s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:"#fff", borderRadius:24, padding:24,
            maxWidth:320, width:"100%", textAlign:"center",
            animation:"popIn 0.3s ease",
          }}>
            <div style={{ fontSize:10, color:"#64748b", letterSpacing:3, fontWeight:800, marginBottom:6 }}>FRIEND CODE</div>
            <div style={{ fontSize:14, fontWeight:800, color:"#0f172a", marginBottom:14 }}>{petName || "あなた"}のコード</div>
            {/* 擬似QR */}
            <div style={{
              width:200, height:200, margin:"0 auto",
              background:"#fff", border:"2px solid #0f172a",
              borderRadius:12, padding:8,
              display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gap:0,
            }}>
              {(() => {
                // myFriendCodeから疑似QRパターン生成
                const code = myFriendCode || "AAAAAA";
                const seed = code.split("").reduce((a,c) => a + c.charCodeAt(0), 0);
                const cells = [];
                for (let i = 0; i < 144; i++) {
                  // 角の位置検出パターン
                  const row = Math.floor(i / 12), col = i % 12;
                  const inCorner = (row < 3 && col < 3) || (row < 3 && col >= 9) || (row >= 9 && col < 3);
                  const cornerCell = inCorner && ((row === 0 || row === 2 || row === 9 || row === 11) || (col === 0 || col === 2 || col === 9 || col === 11) || (row === 1 && col === 1) || (row === 1 && col === 10) || (row === 10 && col === 1));
                  // pseudo random
                  const v = ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280;
                  const fill = cornerCell || (!inCorner && v > 0.5);
                  cells.push(<div key={i} style={{ background: fill ? "#0f172a" : "#fff", aspectRatio:"1/1" }}/>);
                }
                return cells;
              })()}
            </div>
            <div style={{ fontSize:22, fontWeight:900, color:"#0f172a", letterSpacing:4, fontFamily:"monospace", marginTop:14 }}>
              {myFriendCode}
            </div>
            <div style={{ fontSize:10, color:"#64748b", marginTop:6 }}>
              このコードを友達に教えよう
            </div>
            <button onClick={() => setShowFriendQR(false)} style={{
              marginTop:14, background:"#0f172a",
              border:"none", borderRadius:12, padding:"10px 24px",
              cursor:"pointer", color:"#fff", fontSize:13, fontWeight:800, fontFamily:FONT,
            }}>閉じる</button>
          </div>
        </div>
      )}

      {/* ══ ADD FRIEND MODAL ══════════════════════════════ */}
      {showAddFriend && (
        <div onClick={() => { setShowAddFriend(false); setFriendCodeInput(""); }} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:300,
          display:"flex", alignItems:"center", justifyContent:"center", padding:20,
          animation:"fadeIn 0.3s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:"#1e293b", borderRadius:20, padding:20,
            maxWidth:340, width:"100%",
            border:"1px solid rgba(255,255,255,0.1)",
            animation:"popIn 0.3s ease",
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:"#fff" }}>➕ 友達を追加</h3>
              <button onClick={() => { setShowAddFriend(false); setFriendCodeInput(""); }} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, width:32, height:32, cursor:"pointer", color:"#cbd5e1",
                fontSize:14, fontFamily:FONT,
              }}>✕</button>
            </div>
            <div style={{ fontSize:11, color:"#94a3b8", marginBottom:12 }}>
              友達のフレンドコード（6桁）を入力してください
            </div>
            <input
              type="text"
              value={friendCodeInput}
              onChange={(e) => setFriendCodeInput(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="ABCD12"
              maxLength={6}
              autoCapitalize="characters"
              style={{
                width:"100%", background:"rgba(0,0,0,0.4)",
                border:"1.5px solid rgba(96,165,250,0.4)",
                borderRadius:10, padding:"12px 14px",
                color:"#fff", fontSize:22, fontWeight:900, letterSpacing:6,
                fontFamily:"monospace", textAlign:"center",
                outline:"none", boxSizing:"border-box",
              }}
            />
            <button
              onClick={() => {
                const code = friendCodeInput.trim().toUpperCase();
                if (code.length !== 6) return;
                if (code === myFriendCode) {
                  alert("自分のコードは追加できません");
                  return;
                }
                if (myFriends.some(f => f.code === code)) {
                  alert("もう追加済みです");
                  return;
                }
                // ランダム名を生成（実際はサーバーから取得する想定）
                const names = ["ゆうき", "あおい", "はるか", "そら", "つばさ", "りく", "みお", "けんた"];
                const name = names[Math.floor(Math.random() * names.length)];
                setMyFriends(prev => [...prev, { code, name, addedAt: Date.now() }]);
                setFriendCodeInput("");
                setShowAddFriend(false);
                SFX.levelUp();
              }}
              disabled={friendCodeInput.length !== 6}
              style={{
                width:"100%", marginTop:14,
                background: friendCodeInput.length === 6 ? "linear-gradient(135deg, #34D399, #10B981)" : "rgba(255,255,255,0.05)",
                border:"none", borderRadius:12, padding:"12px",
                cursor: friendCodeInput.length === 6 ? "pointer" : "not-allowed",
                color: friendCodeInput.length === 6 ? "#0f172a" : "#64748b",
                fontSize:14, fontWeight:900, fontFamily:FONT,
              }}
            >追加する</button>
            <div style={{ fontSize:9, color:"#64748b", marginTop:10, textAlign:"center", lineHeight:1.5 }}>
              💡 自分のコードは「友達」タブの上部にあります
            </div>
          </div>
        </div>
      )}

      {/* ══ FRIEND QR MODAL を残しつつ続く ══ */}
      {/* ══ BOOKMARKS ═════════════════════════════════════ */}
      {screen === S.BOOKMARKS && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"22px 18px 24px", animation:"screenEnter 0.4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <button onClick={() => setScreen(S.PROFILE)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:"pointer", color:"#cbd5e1", fontSize:17, fontWeight:700, fontFamily:FONT }}>←</button>
            <div>
              <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:"#FBBF24" }}>⭐ ブックマーク</h2>
              <p style={{ color:"#94a3b8", fontSize:11, margin:"2px 0 0" }}>{bookmarkedQs.length}問 保存中</p>
            </div>
          </div>

          {bookmarkedQs.length === 0 ? (
            <div style={{
              background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:18, padding:"40px 20px", textAlign:"center",
            }}>
              <div style={{ fontSize:54, marginBottom:10, opacity:0.5 }}>📭</div>
              <div style={{ fontSize:14, fontWeight:800, color:"#cbd5e1", marginBottom:6 }}>
                ブックマークがありません
              </div>
              <div style={{ fontSize:11, color:"#94a3b8", lineHeight:1.6 }}>
                バトル中に右上の ☆ ボタンで<br/>
                覚えておきたい問題を保存できます
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize:10, color:"#94a3b8", marginBottom:10, padding:"0 4px" }}>
                💡 タップで問題と答えを確認
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {bookmarkedQs.slice().reverse().map((b, i) => {
                  const gInfo = GENRES.find(g => g.id === b.genre) || GENRES[0];
                  return (
                    <div key={i} style={{
                      background:`linear-gradient(135deg, ${gInfo.dark} 0%, rgba(255,255,255,0.02) 100%)`,
                      border:`1px solid ${gInfo.color}40`,
                      borderRadius:12, padding:"10px 12px",
                      position:"relative",
                    }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{
                          fontSize:9, color: gInfo.color, fontWeight:800,
                          background:`${gInfo.color}20`, padding:"2px 6px", borderRadius:99,
                        }}>{gInfo.icon} {gInfo.label}</span>
                        <button onClick={() => {
                          setBookmarkedQs(prev => prev.filter(x => x.q !== b.q));
                        }} style={{
                          background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
                          borderRadius:6, padding:"2px 8px", cursor:"pointer",
                          color:"#FCA5A5", fontSize:9, fontFamily:FONT,
                        }}>解除</button>
                      </div>
                      <div style={{ fontSize:12, fontWeight:700, color:"#fff", marginBottom:6, lineHeight:1.5 }}>
                        {b.q}
                      </div>
                      <div style={{ fontSize:10, color:"#94a3b8", marginBottom:4 }}>
                        正解: <span style={{ color:"#34D399", fontWeight:800 }}>{b.choices[b.answer]}</span>
                      </div>
                      <details style={{ fontSize:10, color:"#64748b" }}>
                        <summary style={{ cursor:"pointer", padding:"2px 0" }}>他の選択肢を見る</summary>
                        <div style={{ marginTop:4, paddingLeft:10 }}>
                          {b.choices.filter((_, idx) => idx !== b.answer).map((c, ci) => (
                            <div key={ci} style={{ marginTop:2 }}>・{c}</div>
                          ))}
                        </div>
                      </details>
                    </div>
                  );
                })}
              </div>
              {bookmarkedQs.length >= 3 && (
                <button onClick={() => {
                  // ブックマーク問題でバトル開始
                  const shuffled = bookmarkedQs.slice().sort(() => Math.random() - 0.5).slice(0, 10);
                  setCustomQuestions(shuffled);
                  startBattle(shuffled[0].genre || "english", true, "solo");
                }} style={{
                  width:"100%", marginTop:16,
                  background:"linear-gradient(135deg, #FBBF24, #F59E0B)",
                  border:"none", borderRadius:14, padding:"14px",
                  cursor:"pointer", color:"#7c2d12", fontSize:14, fontWeight:900, fontFamily:FONT,
                  boxShadow:"0 6px 18px rgba(251,191,36,0.4)",
                }}>⚔️ ブックマーク問題でバトル</button>
              )}
            </>
          )}
        </div>
      )}

      {/* ══ FLASHCARD SELECT ══════════════════════════════ */}
      {screen === S.FLASHCARD_SELECT && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"22px 18px", animation:"screenEnter 0.4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <button onClick={() => setScreen(S.HOME)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:"pointer", color:"#cbd5e1", fontSize:17, fontWeight:700, fontFamily:FONT }}>←</button>
            <div>
              <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:"#A78BFA" }}>🃏 暗記カード</h2>
              <p style={{ color:"#94a3b8", fontSize:11, margin:"2px 0 0" }}>フラッシュカード式で素早く復習</p>
            </div>
          </div>

          <div style={{
            background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.25)",
            borderRadius:12, padding:"10px 14px", marginBottom:16, fontSize:11, color:"#cbd5e1", lineHeight:1.6,
          }}>
            💡 カードをタップで答えを表示、「知ってる/知らない」で記録して<br/>記憶定着を確認できます
          </div>

          <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:3, fontWeight:800, marginBottom:8 }}>📚 教科を選択</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {GENRES.map(g => (
              <button key={g.id} onClick={() => startFlashcard(g.id)} style={{
                background:`linear-gradient(135deg, ${g.dark} 0%, rgba(255,255,255,0.02) 100%)`,
                border:`1.5px solid ${g.color}55`,
                borderRadius:14, padding:"14px 12px",
                cursor:"pointer", color:"#fff", fontFamily:FONT, textAlign:"left",
                display:"flex", alignItems:"center", gap:10,
                boxShadow:`0 4px 12px ${g.color}22`,
              }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${g.color}25`, border:`1.5px solid ${g.color}55`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <PixelIcon name={g.id} size={22} color={g.color}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:g.color }}>{g.label}</div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>15問のカード</div>
                </div>
                <div style={{ fontSize:14, color:g.color }}>›</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══ FLASHCARD ═════════════════════════════════════ */}
      {screen === S.FLASHCARD && fcGenre && (() => {
        const currentCard = fcQuestions[fcIndex];
        if (!currentCard) {
          // 終了 → サマリー画面（簡易）
          const known = fcResults.filter(r => r.known).length;
          const total = fcResults.length;
          return (
            <div style={{ maxWidth:440, margin:"0 auto", padding:"40px 20px", animation:"screenEnter 0.4s ease", textAlign:"center" }}>
              <div style={{ fontSize:72, marginBottom:8 }}>{known/total >= 0.8 ? "🏆" : known/total >= 0.5 ? "👍" : "📚"}</div>
              <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 6px", color:"#A78BFA" }}>暗記カード完了！</h2>
              <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 24px" }}>
                {known} / {total} 知ってた（{Math.round((known/total)*100)}%）
              </p>
              <div style={{ background:"linear-gradient(135deg, rgba(167,139,250,0.2), rgba(167,139,250,0.05))", border:"1.5px solid rgba(167,139,250,0.4)", borderRadius:18, padding:"24px 18px", marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-around" }}>
                  <div>
                    <div style={{ fontSize:30, fontWeight:900, color:"#34D399" }}>{known}</div>
                    <div style={{ fontSize:10, color:"#94a3b8" }}>覚えてる</div>
                  </div>
                  <div>
                    <div style={{ fontSize:30, fontWeight:900, color:"#EF4444" }}>{total-known}</div>
                    <div style={{ fontSize:10, color:"#94a3b8" }}>要復習</div>
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => startFlashcard(fcGenre)} style={{ flex:1, background:"linear-gradient(135deg, #A78BFA, #8B5CF6)", border:"none", borderRadius:14, padding:14, color:"#fff", fontWeight:800, cursor:"pointer", fontSize:14, fontFamily:FONT, boxShadow:"0 4px 14px rgba(167,139,250,0.5)" }}>もう一回</button>
                <button onClick={() => setScreen(S.FLASHCARD_SELECT)} style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:14, color:"#cbd5e1", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:FONT }}>教科選択へ</button>
              </div>
            </div>
          );
        }
        const gInfo = GENRES.find(g => g.id === fcGenre);
        const correctAnswer = currentCard.choices[currentCard.answer];
        return (
          <div style={{ maxWidth:440, margin:"0 auto", padding:"22px 18px", animation:"screenEnter 0.4s ease" }}>
            {/* ヘッダー */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <button onClick={() => setScreen(S.FLASHCARD_SELECT)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:36, height:36, cursor:"pointer", color:"#cbd5e1", fontSize:13 }}>✕</button>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9, color:gInfo.color, letterSpacing:3, fontWeight:800 }}>🃏 FLASHCARD</div>
                <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{gInfo.icon} {gInfo.label}</div>
              </div>
              <div style={{ fontSize:11, color:"#94a3b8", fontWeight:700 }}>{fcIndex+1}/{fcQuestions.length}</div>
            </div>

            {/* プログレスバー */}
            <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:99, height:5, overflow:"hidden", marginBottom:20 }}>
              <div style={{ width:`${((fcIndex+1)/fcQuestions.length)*100}%`, height:"100%", background:`linear-gradient(90deg, ${gInfo.color}, ${shade(gInfo.color, -25)})`, transition:"width 0.4s" }}/>
            </div>

            {/* カード本体（タップで裏返る） */}
            <div onClick={() => setFcFlipped(!fcFlipped)} style={{
              perspective:"1000px",
              cursor:"pointer",
              marginBottom:20,
            }}>
              <div style={{
                position:"relative", width:"100%",
                minHeight:280,
                transformStyle:"preserve-3d",
                transition:"transform 0.6s",
                transform: fcFlipped ? "rotateY(180deg)" : "none",
              }}>
                {/* 表（問題） */}
                <div style={{
                  position:"absolute", inset:0, backfaceVisibility:"hidden",
                  background:`linear-gradient(135deg, ${gInfo.dark} 0%, rgba(255,255,255,0.03) 100%)`,
                  border:`2px solid ${gInfo.color}66`,
                  borderRadius:18, padding:"28px 20px",
                  boxShadow:`0 8px 32px ${gInfo.color}33`,
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  textAlign:"center",
                }}>
                  <div style={{ fontSize:10, color: gInfo.color, letterSpacing:3, fontWeight:800, marginBottom:10 }}>QUESTION</div>
                  <div style={{ fontSize:18, fontWeight:800, color:"#fff", lineHeight:1.6, marginBottom:14 }}>{currentCard.q}</div>
                  <div style={{ fontSize:10, color:"#64748b", marginTop:"auto" }}>👆 タップして答えを見る</div>
                </div>
                {/* 裏（答え） */}
                <div style={{
                  position:"absolute", inset:0, backfaceVisibility:"hidden",
                  transform:"rotateY(180deg)",
                  background:`linear-gradient(135deg, ${gInfo.color}25, rgba(0,0,0,0.3))`,
                  border:`2px solid ${gInfo.color}`,
                  borderRadius:18, padding:"28px 20px",
                  boxShadow:`0 8px 32px ${gInfo.color}55`,
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  textAlign:"center",
                }}>
                  <div style={{ fontSize:10, color: "#34D399", letterSpacing:3, fontWeight:800, marginBottom:10 }}>ANSWER</div>
                  <div style={{ fontSize:22, fontWeight:900, color:gInfo.color, lineHeight:1.4, marginBottom:14 }}>{correctAnswer}</div>
                  <div style={{ fontSize:11, color:"#cbd5e1", marginBottom:14, padding:"8px 12px", background:"rgba(0,0,0,0.25)", borderRadius:10, maxWidth:"100%" }}>
                    Q: {currentCard.q}
                  </div>
                </div>
              </div>
            </div>

            {/* ボタン: 知ってる / 知らない */}
            {fcFlipped && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, animation:"fadeIn 0.3s ease" }}>
                <button onClick={() => {
                  setFcResults(prev => [...prev, { idx: fcIndex, known: false }]);
                  // 答え履歴に間違いとして記録
                  setAnswerHistory(prev => [...prev, {
                    genre: fcGenre, q: currentCard.q, choices: currentCard.choices,
                    correctIdx: currentCard.answer, chosenIdx: -1, correct: false, timestamp: Date.now(),
                  }].slice(-100));
                  setFcFlipped(false);
                  setFcIndex(i => i + 1);
                }} style={{
                  background:"linear-gradient(135deg, rgba(239,68,68,0.18), rgba(239,68,68,0.05))",
                  border:"1.5px solid rgba(239,68,68,0.5)",
                  borderRadius:14, padding:"16px",
                  cursor:"pointer", color:"#FCA5A5", fontSize:15, fontWeight:800, fontFamily:FONT,
                }}>
                  <div style={{ fontSize:24, marginBottom:3 }}>🤔</div>
                  <div>まだ覚えてない</div>
                </button>
                <button onClick={() => {
                  setFcResults(prev => [...prev, { idx: fcIndex, known: true }]);
                  setAnswerHistory(prev => [...prev, {
                    genre: fcGenre, q: currentCard.q, choices: currentCard.choices,
                    correctIdx: currentCard.answer, chosenIdx: currentCard.answer, correct: true, timestamp: Date.now(),
                  }].slice(-100));
                  addCoins(3);
                  setGenreXp(prev => ({ ...prev, [fcGenre]: (prev[fcGenre] || 0) + 5 }));
                  setFlashcardCount(prev => prev + 1); // 暗記カード達成カウント
                  setFcFlipped(false);
                  setFcIndex(i => i + 1);
                }} style={{
                  background:"linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05))",
                  border:"1.5px solid rgba(52,211,153,0.5)",
                  borderRadius:14, padding:"16px",
                  cursor:"pointer", color:"#34D399", fontSize:15, fontWeight:800, fontFamily:FONT,
                }}>
                  <div style={{ fontSize:24, marginBottom:3 }}>✨</div>
                  <div>覚えてる！</div>
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* ══ BOSS ════════════════════════════════════════════ */}
      {screen === S.BOSS && bossData && (() => {
        const currentQ = battleQuestions[qIndex] || null;
        // 問題が尽きるか、HPがゼロ→ボス結果へ
        if (!currentQ || bossHp <= 0) {
          const won = bossHp <= 0;
          const todayKey = getTodayKey();
          if (won && bossDailyChallenged[todayKey] !== bossData.id) {
            setBossDailyChallenged(prev => ({ ...prev, [todayKey]: bossData.id }));
            // ── 報酬: コイン＋ガチャ無料券＋累計カウント ──
            addCoins(bossData.reward);
            setFreeGachaTickets(prev => prev + (bossData.gachaTickets || 1));
            setBossKills(prev => prev + 1);
            setBossTotalKills(prev => prev + 1);
            // 弱点教科の問題を多く正解したらXPボーナス
            if (bossData.weakness) {
              const weaknessCorrect = battleAnswers.filter(a => a.correct && a._genre === bossData.weakness).length;
              if (weaknessCorrect > 0) {
                addGenreXp(bossData.weakness, weaknessCorrect * 30);
              }
            }
          }
          setTimeout(() => setScreen(S.BOSS_RESULT), 200);
          return null;
        }
        const handleBossAnswer = (idx) => {
          if (selected !== null) return;
          setSelected(idx);
          const correct = idx === currentQ.answer;
          const qGenre = currentQ._genre || "english";
          const isWeakness = bossData.weakness === qGenre;
          // 1問1問攻撃。クリティカル20%確率
          const isCrit = correct && Math.random() < 0.2;
          const baseDmg = correct ? (15 + Math.floor(Math.random() * 10)) : 0;
          const weaknessMul = isWeakness ? 2 : 1;
          const critMul = isCrit ? 2.5 : 1;
          const finalDmg = Math.floor(baseDmg * weaknessMul * critMul);
          if (correct) {
            SFX.correct();
            setBossHp(hp => Math.max(0, hp - finalDmg));
            setMyBossDmg(d => d + finalDmg);
            addCoins(5);
            // 自分の攻撃アニメ
            setBossAttackAnim({ dmg: finalDmg, isCrit, weakness: isWeakness });
            setTimeout(() => setBossAttackAnim(null), 1500);
            // 自分のダメージをプレイヤーリストに反映
            setBossPlayers(prev => prev.map(p => p.isUser ? { ...p, dmg: p.dmg + finalDmg } : p));
            // 自分の攻撃をログに
            setBossAttackLog(prev => [{ name:"あなた", dmg: finalDmg, isCrit, isWeakness, isUser:true, ts: Date.now() }, ...prev].slice(0, 6));
            setBattleAnswers(prev => [...prev, { q: currentQ.q, choices: currentQ.choices, correctIdx: currentQ.answer, chosenIdx: idx, correct: true, dmg: finalDmg, weakness: isWeakness, crit: isCrit }]);
          } else {
            SFX.wrong();
            setBattleAnswers(prev => [...prev, { q: currentQ.q, choices: currentQ.choices, correctIdx: currentQ.answer, chosenIdx: idx, correct: false }]);
          }
          setBossTurn(t => t + 1);
          setAnswerHistory(prev => {
            const next = [...prev, {
              genre: qGenre, q: currentQ.q, choices: currentQ.choices,
              correctIdx: currentQ.answer, chosenIdx: idx, correct, timestamp: Date.now(),
            }];
            return next.slice(-100);
          });
          setTimeout(() => {
            setSelected(null);
            setQIndex(i => i + 1);
          }, 1800);
        };
        const hpPct = (bossHp / bossMaxHp) * 100;
        const qGenre = currentQ._genre || "english";
        const qGenreInfo = GENRES.find(g => g.id === qGenre);
        const isWeakness = bossData.weakness === qGenre;
        // ランキング: 与ダメ順
        const rankedPlayers = [...bossPlayers].sort((a, b) => b.dmg - a.dmg);
        const myRank = rankedPlayers.findIndex(p => p.isUser) + 1;
        return (
          <div style={{ maxWidth:440, margin:"0 auto", padding:"16px 14px 24px", animation:"screenEnter 0.4s ease" }}>
            {/* ヘッダー */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <button onClick={() => { if(confirm("ワールドボス戦を離脱しますか？")) setScreen(S.HOME); }} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:34, height:34, cursor:"pointer", color:"#cbd5e1", fontSize:13 }}>✕</button>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:8, color:"#EF4444", letterSpacing:3, fontWeight:900, display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:"#EF4444", animation:"pulse 1.5s ease-in-out infinite" }}/>
                  LIVE · WORLD BOSS
                </div>
                <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{bossData.name}</div>
              </div>
              <div style={{ fontSize:10, color:"#94a3b8", fontWeight:700 }}>Q{qIndex+1}/{battleQuestions.length}</div>
            </div>

            {/* ボス本体 */}
            <div style={{
              background:`linear-gradient(135deg, ${bossData.color}25, rgba(0,0,0,0.3))`,
              border:`2px solid ${bossData.color}`,
              borderRadius:14, padding:"10px 12px 12px", marginBottom:10,
              textAlign:"center", position:"relative", overflow:"hidden",
              boxShadow:`0 0 24px ${bossData.color}44`,
            }}>
              {/* 自分の攻撃演出 */}
              {bossAttackAnim && (
                <>
                  <div style={{
                    position:"absolute", top:"35%", left:"50%",
                    transform:"translate(-50%, -50%)",
                    fontSize: bossAttackAnim.isCrit ? 38 : 30,
                    fontWeight:900,
                    color: bossAttackAnim.isCrit ? "#FBBF24" : bossAttackAnim.weakness ? "#F472B6" : "#fff",
                    textShadow: `0 0 16px ${bossAttackAnim.isCrit ? "#FBBF24" : bossAttackAnim.weakness ? "#F472B6" : "#fff"}`,
                    animation:"dmgCrit 1.5s ease-out forwards",
                    zIndex:5, pointerEvents:"none",
                  }}>-{bossAttackAnim.dmg}</div>
                  {bossAttackAnim.isCrit && (
                    <div style={{
                      position:"absolute", top:"15%", left:"50%",
                      transform:"translateX(-50%)",
                      fontSize:11, fontWeight:900, color:"#FBBF24", letterSpacing:3,
                      textShadow:"0 0 8px #FBBF24",
                      animation:"fadeIn 0.3s ease",
                      zIndex:5,
                    }}>★ CRITICAL ★</div>
                  )}
                </>
              )}
              <div style={{ 
                fontSize:50, lineHeight:1, marginBottom:4,
                animation: bossAttackAnim ? "monsterHit 0.4s ease-out" : "monsterFloat 2s ease-in-out infinite",
                filter: bossHp <= 0 ? "grayscale(1) opacity(0.5)" : "none",
              }}>{bossData.emoji}</div>
              {/* HPバー */}
              <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:99, height:12, overflow:"hidden", border:"1px solid rgba(255,255,255,0.15)", marginBottom:4, position:"relative" }}>
                <div style={{
                  width:`${hpPct}%`, height:"100%",
                  background: hpPct < 30 ? "linear-gradient(90deg, #EF4444, #DC2626)" : `linear-gradient(90deg, ${bossData.color}, ${shade(bossData.color, -25)})`,
                  transition:"width 0.6s ease-out",
                  boxShadow:`0 0 8px ${bossData.color}`,
                }}/>
                <div style={{
                  position:"absolute", top:0, left:0, right:0, bottom:0,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:9, fontWeight:900, color:"#fff",
                  textShadow:"0 0 4px rgba(0,0,0,0.8)",
                }}>{bossHp.toLocaleString()} / {bossMaxHp.toLocaleString()}</div>
              </div>
              <div style={{ fontSize:9, color:"#94a3b8" }}>残り {hpPct.toFixed(1)}%</div>
            </div>

            {/* 自分のステータス＆ランキングサマリー */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 }}>
              <div style={{
                background:"linear-gradient(135deg, rgba(96,165,250,0.15), rgba(0,0,0,0.2))",
                border:"1px solid rgba(96,165,250,0.4)",
                borderRadius:10, padding:"6px 10px",
              }}>
                <div style={{ fontSize:8, color:"#60A5FA", fontWeight:800, letterSpacing:1 }}>あなたの与ダメ</div>
                <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>{myBossDmg.toLocaleString()}</div>
              </div>
              <div style={{
                background:`linear-gradient(135deg, ${myRank<=3?"rgba(251,191,36,0.18)":"rgba(255,255,255,0.05)"}, rgba(0,0,0,0.2))`,
                border:`1px solid ${myRank<=3?"rgba(251,191,36,0.5)":"rgba(255,255,255,0.1)"}`,
                borderRadius:10, padding:"6px 10px",
              }}>
                <div style={{ fontSize:8, color: myRank<=3?"#FBBF24":"#94a3b8", fontWeight:800, letterSpacing:1 }}>あなたの順位</div>
                <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>{myRank}位 <span style={{ fontSize:10, color:"#94a3b8" }}>/{bossPlayers.length}</span></div>
              </div>
            </div>

            {/* 攻撃ログ（最新の他プレイヤー攻撃） */}
            {bossAttackLog.length > 0 && (
              <div style={{
                background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:10, padding:"8px 12px", marginBottom:10, maxHeight:80, overflow:"hidden",
              }}>
                <div style={{ fontSize:8, color:"#94a3b8", letterSpacing:2, fontWeight:800, marginBottom:4 }}>⚔️ 攻撃ログ</div>
                <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  {bossAttackLog.slice(0, 3).map((log, i) => (
                    <div key={i} style={{ fontSize:10, color: log.isUser ? "#FBBF24" : "#cbd5e1", display:"flex", justifyContent:"space-between", animation: i === 0 ? "fadeIn 0.3s ease" : "none" }}>
                      <span>
                        {log.isUser ? "🌟" : "👤"} <span style={{ fontWeight: log.isUser ? 800 : 600 }}>{log.name}</span>
                        {log.isCrit && <span style={{ color:"#FBBF24", marginLeft:4, fontWeight:800 }}>CRIT!</span>}
                        {log.isWeakness && <span style={{ color:"#F472B6", marginLeft:4, fontWeight:800 }}>弱点</span>}
                      </span>
                      <span style={{ fontWeight:800, color: log.isCrit ? "#FBBF24" : log.isWeakness ? "#F472B6" : "#fff" }}>-{log.dmg}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 教科ラベル＋弱点アラート */}
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <span style={{ fontSize:10, color: qGenreInfo.color, fontWeight:800, background:`${qGenreInfo.color}20`, border:`1px solid ${qGenreInfo.color}50`, padding:"2px 8px", borderRadius:99 }}>
                {qGenreInfo.icon} {qGenreInfo.label}
              </span>
              {isWeakness && selected === null && (
                <span style={{ fontSize:9, color:"#F472B6", fontWeight:900, background:"rgba(244,114,182,0.2)", border:"1px solid rgba(244,114,182,0.5)", padding:"2px 8px", borderRadius:99, animation:"pulse 1.2s ease-in-out infinite" }}>
                  ⚡ 弱点 ×2
                </span>
              )}
            </div>

            {/* 問題 */}
            <div style={{
              background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)",
              borderRadius:12, padding:"12px 14px", marginBottom:10, minHeight:48,
            }}>
              <p style={{ fontSize:14, fontWeight:800, margin:0, lineHeight:1.5, color:"#fff" }}>{currentQ.q}</p>
            </div>

            {/* 選択肢 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {currentQ.choices.map((c, i) => {
                const ok = i === currentQ.answer, chosen = i === selected;
                let bg = "rgba(30,41,59,0.95)", border = "rgba(255,255,255,0.2)", color = "#f8fafc";
                if (selected !== null) {
                  if (ok) { bg = "linear-gradient(135deg, rgba(52,211,153,0.35), rgba(52,211,153,0.2))"; border = "#34D399"; color = "#d1fae5"; }
                  else if (chosen) { bg = "linear-gradient(135deg, rgba(239,68,68,0.35), rgba(239,68,68,0.2))"; border = "#EF4444"; color = "#fecaca"; }
                  else { bg = "rgba(30,41,59,0.5)"; color = "#64748b"; }
                }
                return (
                  <button key={i} onClick={() => handleBossAnswer(i)} disabled={selected !== null} style={{
                    background:bg, border:`2px solid ${border}`,
                    borderRadius:11, padding:"12px 8px",
                    cursor: selected === null ? "pointer" : "default",
                    color, fontSize:12, fontWeight:800, fontFamily:FONT,
                    minHeight:46, transition:"all 0.2s",
                  }}>{c}</button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ══ BOSS RESULT ════════════════════════════════════ */}
      {screen === S.BOSS_RESULT && bossData && (() => {
        const won = bossHp <= 0;
        const correctCount = battleAnswers.filter(a => a.correct).length;
        const rankedPlayers = [...bossPlayers].sort((a, b) => b.dmg - a.dmg);
        const myRank = rankedPlayers.findIndex(p => p.isUser) + 1;
        // ランキングボーナス: 1位+200, 2位+100, 3位+50
        const rankBonus = myRank === 1 ? 200 : myRank === 2 ? 100 : myRank === 3 ? 50 : 0;
        return (
          <div style={{ maxWidth:440, margin:"0 auto", padding:"32px 18px 24px", animation:"screenEnter 0.5s ease", position:"relative" }}>
            {/* 勝利時の派手な背景演出 */}
            {won && (
              <>
                {/* 放射状光線 */}
                <div style={{
                  position:"fixed", top:0, left:0, right:0, height:"60vh",
                  background:"radial-gradient(circle at 50% 30%, rgba(251,191,36,0.3) 0%, transparent 60%)",
                  pointerEvents:"none", zIndex:0,
                  animation:"victoryGlow 2s ease-in-out infinite",
                }}/>
                {/* 紙吹雪 - 大量 */}
                <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1 }}>
                  {Array.from({length: 40}).map((_, i) => {
                    const colors = ["#FBBF24", "#F472B6", "#A78BFA", "#60A5FA", "#34D399", "#EF4444"];
                    const color = colors[i % colors.length];
                    const left = (i * 7.3) % 100;
                    const delay = (i * 0.08) % 2;
                    const duration = 2.5 + (i % 5) * 0.4;
                    return (
                      <div key={i} style={{
                        position:"absolute", top:-20, left:`${left}%`,
                        width: 8 + (i%3)*3, height: 8 + (i%3)*3,
                        background: color,
                        borderRadius: i%3===0 ? "50%" : "2px",
                        animation:`confettiFall ${duration}s ease-in ${delay}s infinite`,
                        transform: `rotate(${i*30}deg)`,
                        opacity: 0,
                      }}/>
                    );
                  })}
                </div>
                {/* 中央スパーク */}
                <div style={{
                  position:"absolute", top:30, left:"50%",
                  transform:"translateX(-50%)",
                  width:300, height:300, marginLeft:-150,
                  pointerEvents:"none", zIndex:1,
                }}>
                  {Array.from({length: 8}).map((_, i) => {
                    const angle = (i * 45);
                    return (
                      <div key={i} style={{
                        position:"absolute", top:"50%", left:"50%",
                        width:3, height:80,
                        background:"linear-gradient(180deg, rgba(251,191,36,0.8), transparent)",
                        transformOrigin:"50% 0",
                        transform:`rotate(${angle}deg) translateY(40px)`,
                        animation:"victoryRay 2s ease-out infinite",
                        animationDelay:`${i*0.1}s`,
                      }}/>
                    );
                  })}
                </div>
              </>
            )}
            <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ textAlign:"center", marginBottom:18 }}>
              <div style={{
                fontSize: won ? 100 : 80, marginBottom:8,
                animation: won ? "victoryBounce 1.2s ease, monsterFloat 2s ease-in-out 1.2s infinite" : "none",
                filter: won ? "drop-shadow(0 0 24px rgba(251,191,36,0.8))" : "grayscale(0.5)",
              }}>
                {won ? "🏆" : bossData.emoji}
              </div>
              <div style={{
                fontSize:10, color: won ? "#FBBF24" : "#94a3b8",
                letterSpacing:4, fontWeight:900, marginBottom:4,
                animation: won ? "fadeIn 0.5s ease 0.4s both" : "none",
              }}>
                {won ? "★ WORLD BOSS DEFEATED ★" : "BATTLE ENDED"}
              </div>
              <h2 style={{
                fontSize: won ? 26 : 22, fontWeight:900, margin:"0 0 4px",
                color: won ? "#FBBF24" : "#fff",
                textShadow: won ? "0 0 24px rgba(251,191,36,0.6)" : "none",
                animation: won ? "fadeIn 0.5s ease 0.6s both" : "none",
              }}>
                {won ? `${bossData.name}を撃破！` : "ボスは生き残った"}
              </h2>
              <p style={{ color:"#94a3b8", fontSize:11, margin:0, animation: won ? "fadeIn 0.5s ease 0.8s both" : "none" }}>
                {won ? "世界中のプレイヤーと共闘で撃破！🎊" : "他のプレイヤーが引き続き攻撃中..."}
              </p>
            </div>

            {/* 自分の与ダメ＆順位 */}
            <div style={{
              background: myRank <= 3 
                ? "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(244,114,182,0.1))"
                : "rgba(255,255,255,0.04)",
              border: myRank <= 3 ? "1.5px solid rgba(251,191,36,0.5)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius:16, padding:"14px", marginBottom:12, textAlign:"center",
              boxShadow: myRank <= 3 ? "0 0 24px rgba(251,191,36,0.2)" : "none",
            }}>
              <div style={{ fontSize:9, color: myRank <= 3 ? "#FBBF24" : "#94a3b8", letterSpacing:3, fontWeight:800, marginBottom:6 }}>
                🏅 あなたの成績
              </div>
              <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>順位</div>
                  <div style={{ fontSize:30, fontWeight:900, color: myRank===1?"#FBBF24":myRank===2?"#94a3b8":myRank===3?"#A78BFA":"#fff", lineHeight:1 }}>
                    {myRank}<span style={{ fontSize:12 }}>位</span>
                  </div>
                </div>
                <div style={{ width:1, height:40, background:"rgba(255,255,255,0.1)" }}/>
                <div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>与ダメ</div>
                  <div style={{ fontSize:28, fontWeight:900, color:"#EF4444", lineHeight:1 }}>{myBossDmg.toLocaleString()}</div>
                </div>
              </div>
              {rankBonus > 0 && (
                <div style={{
                  marginTop:8, padding:"4px 10px",
                  background:"rgba(251,191,36,0.2)", border:"1px solid rgba(251,191,36,0.4)",
                  borderRadius:99, display:"inline-block",
                  fontSize:10, color:"#FBBF24", fontWeight:900,
                }}>
                  🎁 順位ボーナス +{rankBonus}💰
                </div>
              )}
            </div>

            {/* 攻撃ランキング */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"12px 14px", marginBottom:12 }}>
              <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:2, fontWeight:800, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                <span>⚔️</span>
                <span>攻撃ランキング (世界 {bossPlayers.length}人中)</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {rankedPlayers.slice(0, 10).map((p, idx) => {
                  const rank = idx + 1;
                  const rankIcon = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}`;
                  const dmgPct = (p.dmg / (rankedPlayers[0].dmg || 1)) * 100;
                  return (
                    <div key={p.id} style={{
                      background: p.isUser ? "rgba(96,165,250,0.18)" : "rgba(255,255,255,0.02)",
                      border: p.isUser ? "1.5px solid rgba(96,165,250,0.5)" : "1px solid rgba(255,255,255,0.05)",
                      borderRadius:8, padding:"6px 10px",
                      display:"flex", alignItems:"center", gap:8,
                      position:"relative", overflow:"hidden",
                    }}>
                      {/* ダメージバー背景 */}
                      <div style={{
                        position:"absolute", left:0, top:0, bottom:0,
                        width:`${dmgPct}%`,
                        background: rank===1?"rgba(251,191,36,0.12)":rank===2?"rgba(148,163,184,0.1)":rank===3?"rgba(167,139,250,0.1)":"rgba(96,165,250,0.05)",
                        zIndex:0,
                      }}/>
                      <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:8, width:"100%" }}>
                        <div style={{ minWidth:24, fontSize: rank<=3?16:11, fontWeight:900, color: rank===1?"#FBBF24":rank===2?"#94a3b8":rank===3?"#A78BFA":"#64748b", textAlign:"center" }}>
                          {rankIcon}
                        </div>
                        <div style={{ fontSize:14 }}>{p.avatar}</div>
                        <div style={{ flex:1, fontSize:11, fontWeight: p.isUser ? 900 : 700, color: p.isUser ? "#60A5FA" : "#cbd5e1" }}>
                          {p.name} {p.isUser && <span style={{ fontSize:8, background:"#60A5FA", color:"#0f172a", padding:"1px 5px", borderRadius:99, marginLeft:2 }}>YOU</span>}
                        </div>
                        <div style={{ fontSize:12, fontWeight:900, color:"#fff" }}>
                          {p.dmg.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 戦績サマリー */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 12px", marginBottom:10 }}>
              <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:2, fontWeight:800, marginBottom:6 }}>📊 戦績</div>
              <div style={{ display:"flex", justifyContent:"space-around" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:16, fontWeight:900, color:"#34D399" }}>{correctCount}</div>
                  <div style={{ fontSize:8, color:"#94a3b8" }}>正解</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:16, fontWeight:900, color:"#60A5FA" }}>{battleAnswers.length > 0 ? Math.round((correctCount/battleAnswers.length)*100) : 0}%</div>
                  <div style={{ fontSize:8, color:"#94a3b8" }}>正答率</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:16, fontWeight:900, color:"#EF4444" }}>{bossPlayers.find(p => p.isUser)?.dmg || 0}</div>
                  <div style={{ fontSize:8, color:"#94a3b8" }}>与ダメ</div>
                </div>
              </div>
            </div>

            {/* 🎁 報酬カード（勝利時のみ派手） */}
            {won && (
              <div style={{
                background:"linear-gradient(135deg, rgba(251,191,36,0.18), rgba(244,114,182,0.08))",
                border:"1.5px solid rgba(251,191,36,0.5)",
                borderRadius:14, padding:"14px 16px", marginBottom:14,
                boxShadow:"0 0 30px rgba(251,191,36,0.25)",
                animation:"popIn 0.6s ease 0.5s both",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:20 }}>🎁</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:9, color:"#FBBF24", letterSpacing:3, fontWeight:800 }}>BOSS REWARDS</div>
                    <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>ボス撃破報酬</div>
                  </div>
                </div>
                <div style={{ display:"grid", gap:6 }}>
                  {/* コイン */}
                  <div style={{
                    background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.3)",
                    borderRadius:10, padding:"8px 12px",
                    display:"flex", alignItems:"center", gap:10,
                  }}>
                    <span style={{ fontSize:24 }}>💰</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:10, color:"#FBBF24", fontWeight:800 }}>コイン</div>
                      <div style={{ fontSize:9, color:"#94a3b8" }}>ボス撃破ボーナス</div>
                    </div>
                    <div style={{ fontSize:20, fontWeight:900, color:"#FBBF24" }}>+{bossData.reward}</div>
                  </div>
                  {/* ガチャ無料券 */}
                  <div style={{
                    background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)",
                    borderRadius:10, padding:"8px 12px",
                    display:"flex", alignItems:"center", gap:10,
                  }}>
                    <span style={{ fontSize:24 }}>🎫</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:10, color:"#34D399", fontWeight:800 }}>無料ガチャ券</div>
                      <div style={{ fontSize:9, color:"#94a3b8" }}>レア確定！</div>
                    </div>
                    <div style={{ fontSize:20, fontWeight:900, color:"#34D399" }}>×{bossData.gachaTickets}</div>
                  </div>
                  {/* 弱点教科XP */}
                  {bossData.weakness && (() => {
                    const wInfo = GENRES.find(g => g.id === bossData.weakness);
                    const weaknessCorrect = battleAnswers.filter(a => a.correct && a._genre === bossData.weakness).length;
                    if (weaknessCorrect === 0) return null;
                    return (
                      <div style={{
                        background:`${wInfo.color}15`, border:`1px solid ${wInfo.color}40`,
                        borderRadius:10, padding:"8px 12px",
                        display:"flex", alignItems:"center", gap:10,
                      }}>
                        <span style={{ fontSize:24 }}>{wInfo.icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:10, color: wInfo.color, fontWeight:800 }}>{wInfo.label}XPボーナス</div>
                          <div style={{ fontSize:9, color:"#94a3b8" }}>弱点教科正解 ×30XP</div>
                        </div>
                        <div style={{ fontSize:20, fontWeight:900, color: wInfo.color }}>+{weaknessCorrect * 30}</div>
                      </div>
                    );
                  })()}
                  {/* ランキングボーナス */}
                  {rankBonus > 0 && (
                    <div style={{
                      background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.3)",
                      borderRadius:10, padding:"8px 12px",
                      display:"flex", alignItems:"center", gap:10,
                    }}>
                      <span style={{ fontSize:24 }}>{myRank === 1 ? "🥇" : myRank === 2 ? "🥈" : "🥉"}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:10, color:"#A78BFA", fontWeight:800 }}>ランキング報酬</div>
                        <div style={{ fontSize:9, color:"#94a3b8" }}>世界{myRank}位！</div>
                      </div>
                      <div style={{ fontSize:20, fontWeight:900, color:"#A78BFA" }}>+{rankBonus}💰</div>
                    </div>
                  )}
                </div>
                <div style={{ fontSize:9, color:"#64748b", marginTop:8, textAlign:"center", lineHeight:1.5 }}>
                  💡 明日また新しいボスが登場します！
                </div>
              </div>
            )}

            <div style={{ display:"flex", gap:10 }}>
              {!won && (
                <button onClick={startBoss} style={{
                  flex:1, background:`linear-gradient(135deg, ${bossData.color}, ${shade(bossData.color, -20)})`,
                  border:"none", borderRadius:14, padding:14, color:"#fff", fontWeight:800,
                  cursor:"pointer", fontSize:14, fontFamily:FONT,
                  boxShadow:`0 4px 14px ${bossData.color}55`,
                }}>再挑戦</button>
              )}
              <button onClick={() => setScreen(S.HOME)} style={{
                flex:1, background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:14,
                color:"#cbd5e1", cursor:"pointer", fontSize:14, fontWeight:700, fontFamily:FONT,
              }}>ホームへ</button>
            </div>
            </div>
          </div>
        );
      })()}

      {/* ══ RESULT ══════════════════════════════════════════ */}
      {screen === S.RESULT && (
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", animation:"popIn 0.5s ease" }}>
          {/* スクロール可能エリア */}
          <div style={{ flex:1, overflowY:"auto", padding:"28px 18px 16px", textAlign:"center" }}>
            <div style={{ maxWidth:440, margin:"0 auto" }}>
              <div style={{ fontSize:64, marginBottom:10 }}>{userRank===1?"🏆":userRank===2?"🥈":userRank===3?"🥉":"💪"}</div>
              <h2 style={{ fontSize:28, fontWeight:700, margin:"0 0 4px", color:userRank===1?"#FBBF24":"#f1f5f9" }}>
                {userRank===1?"勝利！":userRank<=2?"惜しい！":"おつかれさま！"}
              </h2>
              <p style={{ color:"#cbd5e1", fontSize:12, margin:"0 0 12px" }}>{userRank}位 / {players.length}人中{battleMode==="ranked" && " · ランクマッチ"}{battleMode==="boss" && " · ボスレイド"}</p>

              {/* ランクマッチのレート変動 */}
              {battleMode === "ranked" && (() => {
                const delta = userRank===1?(30 + Math.min(20, (winStreak-1) * 5)) :userRank===2?10:userRank===3?-10:-20;
                const newRating = userRating; // 既に更新済み
                const oldRating = userRating - delta;
                return (
                  <div style={{
                    background: userRank===1 ? "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(251,191,36,0.1))" : userRank<=2 ? "rgba(96,165,250,0.1)" : "rgba(239,68,68,0.08)",
                    border: `1px solid ${userRank===1?"rgba(74,222,128,0.4)":userRank<=2?"rgba(96,165,250,0.3)":"rgba(239,68,68,0.3)"}`,
                    borderRadius:16, padding:"12px 16px", marginBottom:14,
                  }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom: winStreak > 1 ? 8 : 0 }}>
                      <span style={{ fontSize:24 }}>{getRank(newRating).icon}</span>
                      <div style={{ textAlign:"left" }}>
                        <div style={{ fontSize:10, color:"#cbd5e1", letterSpacing:1, fontWeight:600 }}>レート変動</div>
                        <div style={{ fontSize:18, fontWeight:800, color:userRank===1?"#4ade80":userRank<=2?"#60A5FA":"#EF4444" }}>
                          {oldRating} → {newRating}
                          <span style={{ fontSize:13, marginLeft:6 }}>
                            ({delta > 0 ? "+" : ""}{delta})
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 連勝表示 */}
                    {userRank === 1 && winStreak >= 2 && (
                      <div style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, padding:"6px 10px", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontSize:12 }}>
                        <span style={{ fontSize:16 }}>🔥</span>
                        <span style={{ color:"#FCA5A5", fontWeight:800 }}>{winStreak}連勝！</span>
                        <span style={{ color:"#FBBF24", fontWeight:700 }}>+{Math.min(20, (winStreak-1)*5)}ボーナス</span>
                      </div>
                    )}
                    {userRank !== 1 && winStreak === 0 && (() => {
                      const cur = getRank(newRating);
                      const isClose = (newRating - cur.min) < 50;
                      if (isClose && userRank >= 3) {
                        return <div style={{ fontSize:11, color:"#FBBF24", fontWeight:700, textAlign:"center", marginTop:4 }}>🛡️ 降格保護が発動しました</div>;
                      }
                      return null;
                    })()}
                  </div>
                );
              })()}

              {/* 試合ハイライト */}
              {matchHighlights && (
                <div style={{ background:"linear-gradient(135deg, rgba(167,139,250,0.1), rgba(96,165,250,0.05))", border:"1px solid rgba(167,139,250,0.25)", borderRadius:14, padding:"10px 14px", marginBottom:14, textAlign:"left" }}>
                  <div style={{ fontSize:10, color:"#a78bfa", fontWeight:800, letterSpacing:2, marginBottom:6 }}>⚡ 試合ハイライト</div>
                  <div style={{ fontSize:11, color:"#cbd5e1", lineHeight:1.6 }}>
                    {matchHighlights.topDmg && (
                      <div>💥 最大ダメージ: <span style={{ color: matchHighlights.topDmg.isUser ? "#FBBF24" : "#fff", fontWeight:800 }}>{matchHighlights.topDmg.name}</span> ({matchHighlights.topDmg.dmg})</div>
                    )}
                    <div>🎯 あなたのダメージ: <span style={{ color:"#60A5FA", fontWeight:800 }}>{matchHighlights.userDmg}</span></div>
                    <div>💰 獲得コイン: <span style={{ color:"#FBBF24", fontWeight:800 }}>+{matchHighlights.coinBonus}</span></div>
                  </div>
                </div>
              )}

              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:22, padding:"18px 16px", marginBottom:14 }}>
                {/* 学習サマリー */}
                {(() => {
                  const myCorrect = answerHistory.slice(-questions.length).filter(h => h.correct).length;
                  const total = questions.length;
                  return (
                    <div style={{ background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.25)", borderRadius:12, padding:"10px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ fontSize:22 }}>📚</div>
                      <div style={{ flex:1, textAlign:"left" }}>
                        <div style={{ fontSize:10, color:"#94a3b8", fontWeight:700 }}>今回の学習</div>
                        <div style={{ fontSize:13, fontWeight:800, color:"#34D399" }}>{total}問中 {myCorrect}問 正解（{total>0?Math.round(myCorrect/total*100):0}%）</div>
                      </div>
                    </div>
                  );
                })()}
                <div style={{ display:"flex", justifyContent:"space-around", marginBottom:16 }}>
                  {[{label:"スコア",val:userPlayer?.score||0,c:"#60A5FA"},{label:"XP獲得",val:`+${userRank===1?40:userRank===2?25:15}`,c:"#a78bfa"},{label:"順位",val:`#${userRank}`,c:"#FBBF24"}].map((s,i) => (
                    <div key={i}><div style={{ fontSize:26, fontWeight:700, color:s.c }}>{s.val}</div><div style={{ fontSize:10, color:"#cbd5e1", marginTop:3 }}>{s.label}</div></div>
                  ))}
                </div>
                {battleMode === "boss" && monster && (
                  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"12px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ flexShrink:0 }}><PixelMonster monster={monster} size={56} /></div>
                    <div style={{ flex:1, textAlign:"left" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:monster.color, marginBottom:4 }}>{monster.name}</div>
                      <HPBar hp={monster.hp} maxHp={monster.maxHp} color={monster.color} showText />
                      {monster.hp<=0 && <div style={{ fontSize:11, color:"#34D399", fontWeight:700, marginTop:4 }}>💀 撃破成功！</div>}
                    </div>
                  </div>
                )}
                <div style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"center" }}>
                  <PetDisplay genreXp={genreXp} size={48} starterEgg={starterEgg} hat={equippedHat} aura={equippedAura} />
                  <div style={{ flex:1, maxWidth:160, textAlign:"left" }}>
                    <div style={{ fontSize:12, fontWeight:700, marginBottom:5, color:"#cbd5e1" }}>{getPetTitle(genreXp)}</div>
                    <HPBar hp={getTotalXp(genreXp)} maxHp={getNextStageXp(getTotalXp(genreXp))} color="#a78bfa" />
                  </div>
                </div>
              </div>

              {/* 貢献ランキング: ボス時は「ボスへのダメージ」、PVP時は「与ダメージ」 */}
              {battleMode === "boss" ? (
                <div style={{ background:"rgba(251,191,36,0.05)", border:"1px solid rgba(251,191,36,0.25)", borderRadius:22, padding:"16px", marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:700, marginBottom:14, color:"#FBBF24" }}>⚔️ ボスへのダメージランキング</div>
                  {sortedByDmg.map((p,i) => {
                    const pct = totalDmg > 0 ? Math.round(((p.dmgDealt||0)/totalDmg)*100) : 0;
                    const barColors = ["#FBBF24","#94a3b8","#b45309","#6366f1"];
                    const medals = ["🥇","🥈","🥉","💀"];
                    return (
                      <div key={p.id} style={{ marginBottom:i<sortedByDmg.length-1?10:0, animation:`rankRow 0.4s ease ${i*0.1}s both` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                          <span style={{ fontSize:18 }}>{medals[i]||"💀"}</span>
                          <span style={{ fontSize:20 }}>{p.avatar}</span>
                          <span style={{ flex:1, fontSize:13, fontWeight:700, color:p.isUser?"#f1f5f9":"#cbd5e1" }}>{p.name}</span>
                          <span style={{ fontSize:14, fontWeight:700, color:barColors[i]||"#94a3b8" }}>{p.dmgDealt||0}<span style={{ fontSize:10, fontWeight:500 }}> dmg</span></span>
                          <span style={{ fontSize:11, color:"#94a3b8", minWidth:30, textAlign:"right" }}>{pct}%</span>
                        </div>
                        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:99, height:6, overflow:"hidden" }}>
                          <div style={{ width:`${pct}%`, height:"100%", borderRadius:99, background:barColors[i]||barColors[3], transition:"width 0.8s cubic-bezier(.34,1.56,.64,1)", boxShadow:`0 0 8px ${barColors[i]||barColors[3]}88` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* スコアランキング */}
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:22, padding:"16px", marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:700, marginBottom:12, color:"#cbd5e1", letterSpacing:2 }}>スコアランキング</div>
                {sortedByScore.map((p,i) => {
                  const hpCol = p.hp>50?"#34D399":p.hp>25?"#FBBF24":"#EF4444";
                  return (
                    <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<sortedByScore.length-1?"1px solid rgba(255,255,255,0.04)":"none", animation:`rankRow 0.4s ease ${i*0.08}s both` }}>
                      <div style={{ width:24, height:24, borderRadius:8, background:["rgba(251,191,36,0.2)","rgba(148,163,184,0.2)","rgba(180,83,9,0.2)","rgba(255,255,255,0.05)"][i]||"rgba(255,255,255,0.05)", border:`1px solid ${["#FBBF24","#94a3b8","#b45309","#334155"][i]||"#334155"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:["#FBBF24","#94a3b8","#b45309","#cbd5e1"][i]||"#cbd5e1", flexShrink:0 }}>{i+1}</div>
                      <span style={{ fontSize:20 }}>{p.avatar}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:p.isUser?"#93C5FD":"#cbd5e1", marginBottom:3 }}>{p.name}</div>
                        <HPBar hp={p.hp} maxHp={p.maxHp} color={hpCol} compact />
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <div style={{ fontSize:16, fontWeight:700, color:"#f1f5f9" }}>{p.score}</div>
                        <div style={{ fontSize:9, color:"#94a3b8" }}>pts</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── 今回の問題と解説 ──────────────── */}
              {battleAnswers.length > 0 && (
                <div style={{ marginTop:16, textAlign:"left" }}>
                  <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:3, fontWeight:700, marginBottom:10 }}>📖 今回の問題と解説</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {battleAnswers.map((ans, i) => {
                      const exp = reviewExplanations[i];
                      const loading = reviewLoadingIdx === i;
                      return (
                        <div key={i} style={{
                          background: ans.correct ? "rgba(52,211,153,0.06)" : "rgba(239,68,68,0.06)",
                          border:`1px solid ${ans.correct ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)"}`,
                          borderRadius:12, padding:"10px 12px",
                        }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                            <span style={{ fontSize:11, fontWeight:800, color: ans.correct ? "#34D399" : "#FCA5A5" }}>
                              {ans.correct ? "✓" : "✗"} Q{i+1}
                            </span>
                          </div>
                          <div style={{ fontSize:12, color:"#f8fafc", fontWeight:700, marginBottom:6, lineHeight:1.5 }}>
                            {ans.q}
                          </div>
                          <div style={{ fontSize:10, color:"#94a3b8", marginBottom:6 }}>
                            正解: <span style={{ color:"#34D399", fontWeight:700 }}>{ans.choices[ans.correctIdx]}</span>
                            {!ans.correct && ans.chosenIdx >= 0 && (
                              <> · あなた: <span style={{ color:"#EF4444", fontWeight:700 }}>{ans.choices[ans.chosenIdx]}</span></>
                            )}
                          </div>
                          {/* 解説部分 */}
                          {exp ? (
                            <div style={{
                              background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.3)",
                              borderRadius:8, padding:"8px 10px", marginTop:4,
                            }}>
                              <div style={{ fontSize:9, color:"#A78BFA", fontWeight:800, letterSpacing:1, marginBottom:3 }}>💡 解説</div>
                              <div style={{ fontSize:11, color:"#e0e7ff", lineHeight:1.6 }}>{exp}</div>
                            </div>
                          ) : !offlineMode && (
                            <button onClick={async () => {
                              setReviewLoadingIdx(i);
                              try {
                                const prompt = `次の選択問題について、なぜその答えが正解なのかを中学生にもわかるように日本語で簡潔に（100字以内）解説してください。\n\n問題: ${ans.q}\n選択肢: ${ans.choices.join(" / ")}\n正解: ${ans.choices[ans.correctIdx]}\n\n解説:`;
                                const text = await callAI(prompt);
                                setReviewExplanations(prev => ({ ...prev, [i]: text || "解説を取得できませんでした。" }));
                              } catch (e) {
                                setReviewExplanations(prev => ({ ...prev, [i]: "⚠️ 通信エラーで解説を取得できませんでした。" }));
                              }
                              setReviewLoadingIdx(null);
                            }} disabled={loading} data-sfx="select" style={{
                              width:"100%",
                              background: loading ? "rgba(167,139,250,0.1)" : "rgba(167,139,250,0.15)",
                              border:"1px solid rgba(167,139,250,0.3)",
                              borderRadius:8, padding:"6px",
                              cursor: loading ? "default" : "pointer",
                              color:"#A78BFA", fontSize:10, fontWeight:700, fontFamily:FONT,
                              marginTop:4,
                            }}>{loading ? "🤔 考え中..." : "💡 解説を見る (AI)"}</button>
                          )}
                          {offlineMode && !exp && (
                            <div style={{ fontSize:9, color:"#64748b", marginTop:4, textAlign:"center" }}>
                              🔒 オフライン中は解説を取得できません
                            </div>
                          )}
                          {/* メモ機能（間違えた問題のみ） */}
                          {!ans.correct && (() => {
                            const existingNote = wrongNotes[ans.q];
                            return (
                              <div style={{ marginTop:6 }}>
                                {existingNote ? (
                                  <div style={{
                                    background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.3)",
                                    borderRadius:8, padding:"7px 10px",
                                    display:"flex", alignItems:"flex-start", gap:6,
                                  }}>
                                    <span style={{ fontSize:11 }}>📝</span>
                                    <div style={{ flex:1 }}>
                                      <div style={{ fontSize:8, color:"#FBBF24", fontWeight:800, letterSpacing:1, marginBottom:2 }}>あなたのメモ</div>
                                      <div style={{ fontSize:10, color:"#FCD34D", lineHeight:1.5 }}>{existingNote}</div>
                                    </div>
                                    <button onClick={() => setShowWrongNote({ q: ans.q, note: existingNote })} style={{
                                      background:"transparent", border:"none", cursor:"pointer",
                                      color:"#94a3b8", fontSize:11, fontFamily:FONT, padding:"0 4px",
                                    }}>✏️</button>
                                  </div>
                                ) : (
                                  <button onClick={() => setShowWrongNote({ q: ans.q, note: "" })} style={{
                                    width:"100%",
                                    background:"rgba(251,191,36,0.08)",
                                    border:"1px dashed rgba(251,191,36,0.3)",
                                    borderRadius:8, padding:"6px",
                                    cursor:"pointer",
                                    color:"#FBBF24", fontSize:10, fontWeight:700, fontFamily:FONT,
                                  }}>📝 なぜ間違えたかメモする</button>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 下部固定ボタン */}
          <div style={{ position:"sticky", bottom:0, padding:"12px 18px 20px", background:"linear-gradient(180deg, transparent, #0a0f1e 30%, #0a0f1e)" }}>
            <div style={{ maxWidth:440, margin:"0 auto" }}>
              {/* シェアボタン */}
              <button onClick={() => setShowShareCard(true)} style={{
                width:"100%",
                background:"linear-gradient(135deg, rgba(96,165,250,0.18), rgba(167,139,250,0.1))",
                border:"1px solid rgba(96,165,250,0.4)",
                borderRadius:14, padding:"10px", cursor:"pointer",
                color:"#60A5FA", fontSize:12, fontWeight:800, fontFamily:FONT,
                marginBottom:10,
                display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              }}>
                <span style={{ fontSize:14 }}>📤</span>
                <span>結果をシェア</span>
              </button>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => { if (genre) startBattle(genre, false, battleMode); else setScreen(S.HOME); }} style={{ flex:1, background:`linear-gradient(135deg, ${genreInfo.color}, ${shade(genreInfo.color, -20)})`, border:"none", borderRadius:14, padding:14, color:"#fff", fontWeight:800, cursor:"pointer", fontSize:14, fontFamily:FONT, boxShadow:`0 4px 14px ${genreInfo.color}55` }}>もう一回</button>
                <button onClick={() => setScreen(S.HOME)} style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:14, color:"#cbd5e1", cursor:"pointer", fontSize:14, fontWeight:700, fontFamily:FONT }}>ホームへ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ SHARE CARD MODAL ══════════════════════════════ */}
      {showShareCard && (() => {
        const userPlayer = players.find(p => p.isUser);
        const userRank = userPlayer ? players.slice().sort((a,b) => b.score - a.score).findIndex(p => p.isUser) + 1 : 1;
        const rankEmoji = userRank === 1 ? "🏆" : userRank === 2 ? "🥈" : userRank === 3 ? "🥉" : "💪";
        const rankColor = userRank === 1 ? "#FBBF24" : userRank === 2 ? "#94a3b8" : userRank === 3 ? "#A78BFA" : "#60A5FA";
        const genreInfo = GENRES.find(g => g.id === genre) || GENRES[0];
        const correctCount = battleAnswers.filter(a => a.correct).length;
        const accuracy = battleAnswers.length > 0 ? Math.round((correctCount/battleAnswers.length)*100) : 0;

        // Canvas描画関数
        const drawAndDownload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 800;
          canvas.height = 1000;
          const ctx = canvas.getContext("2d");
          // 背景グラデ
          const grad = ctx.createLinearGradient(0, 0, 0, 1000);
          grad.addColorStop(0, "#1e293b");
          grad.addColorStop(1, "#0a0f1e");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 800, 1000);
          // 装飾ライン
          ctx.fillStyle = genreInfo.color + "20";
          ctx.fillRect(0, 0, 800, 8);
          ctx.fillRect(0, 992, 800, 8);
          // タイトル
          ctx.fillStyle = "#94a3b8";
          ctx.font = "bold 22px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("STUDYUM", 400, 70);
          ctx.fillStyle = "#64748b";
          ctx.font = "14px sans-serif";
          ctx.fillText("バトル結果", 400, 100);
          // ランクアイコン
          ctx.font = "120px sans-serif";
          ctx.fillText(rankEmoji, 400, 250);
          // ランク
          ctx.fillStyle = rankColor;
          ctx.font = "bold 56px sans-serif";
          ctx.fillText(`${userRank}位 / ${players.length}人中`, 400, 330);
          // 教科
          ctx.fillStyle = genreInfo.color;
          ctx.font = "bold 28px sans-serif";
          ctx.fillText(`${genreInfo.icon} ${genreInfo.label}`, 400, 390);
          // スコアカード背景
          ctx.fillStyle = "rgba(255,255,255,0.04)";
          ctx.fillRect(80, 440, 640, 320);
          ctx.strokeStyle = genreInfo.color + "44";
          ctx.lineWidth = 2;
          ctx.strokeRect(80, 440, 640, 320);
          // スコア
          ctx.fillStyle = "#94a3b8";
          ctx.font = "16px sans-serif";
          ctx.fillText("獲得スコア", 400, 490);
          ctx.fillStyle = "#FBBF24";
          ctx.font = "bold 80px sans-serif";
          ctx.fillText(`${userPlayer?.score || 0}`, 400, 580);
          // 正答数
          ctx.fillStyle = "#94a3b8";
          ctx.font = "16px sans-serif";
          ctx.fillText("正答数", 230, 660);
          ctx.fillStyle = "#34D399";
          ctx.font = "bold 36px sans-serif";
          ctx.fillText(`${correctCount}/${battleAnswers.length}`, 230, 710);
          // 正答率
          ctx.fillStyle = "#94a3b8";
          ctx.font = "16px sans-serif";
          ctx.fillText("正答率", 570, 660);
          ctx.fillStyle = "#60A5FA";
          ctx.font = "bold 36px sans-serif";
          ctx.fillText(`${accuracy}%`, 570, 710);
          // ペット名
          if (petName) {
            ctx.fillStyle = "#A78BFA";
            ctx.font = "20px sans-serif";
            ctx.fillText(`💎 ${petName}と一緒に！`, 400, 820);
          }
          // フッター
          ctx.fillStyle = "#475569";
          ctx.font = "14px sans-serif";
          ctx.fillText("勉強で進化する学習バトルRPG", 400, 920);
          ctx.fillStyle = "#60A5FA";
          ctx.font = "bold 18px sans-serif";
          ctx.fillText("#STUDYUM #勉強記録", 400, 955);

          // ダウンロード
          canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `studyum_battle_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, "image/png");
        };

        return (
          <div style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:300,
            display:"flex", alignItems:"center", justifyContent:"center", padding:20,
            animation:"screenEnter 0.4s ease",
          }} onClick={() => setShowShareCard(false)}>
            <div onClick={e => e.stopPropagation()} style={{
              background:"linear-gradient(180deg, #1e293b, #0a0f1e)",
              border:`2px solid ${genreInfo.color}55`,
              borderRadius:22, maxWidth:340, width:"100%",
              animation:"popIn 0.3s ease",
              overflow:"hidden",
            }}>
              {/* ヘッダー */}
              <div style={{
                background: `${genreInfo.color}15`,
                borderBottom:`1px solid ${genreInfo.color}33`,
                padding:"14px 18px",
                display:"flex", alignItems:"center", justifyContent:"space-between",
              }}>
                <div>
                  <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:3, fontWeight:800 }}>SHARE</div>
                  <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>結果をシェア</div>
                </div>
                <button onClick={() => setShowShareCard(false)} style={{
                  background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:10, width:32, height:32, cursor:"pointer", color:"#cbd5e1",
                  fontSize:14, fontFamily:FONT,
                }}>✕</button>
              </div>

              {/* プレビューカード */}
              <div style={{ padding:18 }}>
                <div style={{
                  background:"linear-gradient(180deg, #1e293b, #0a0f1e)",
                  border:`1px solid ${genreInfo.color}44`,
                  borderRadius:16, padding:"24px 16px",
                  textAlign:"center",
                  position:"relative",
                  overflow:"hidden",
                }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background: genreInfo.color, opacity:0.3 }}/>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background: genreInfo.color, opacity:0.3 }}/>
                  <div style={{ fontSize:9, color:"#94a3b8", letterSpacing:4, fontWeight:800 }}>STUDYUM</div>
                  <div style={{ fontSize:8, color:"#64748b", marginTop:2, marginBottom:12 }}>バトル結果</div>
                  <div style={{ fontSize:64, lineHeight:1, marginBottom:6 }}>{rankEmoji}</div>
                  <div style={{ fontSize:26, fontWeight:900, color: rankColor, marginBottom:4 }}>
                    {userRank}位 / {players.length}人中
                  </div>
                  <div style={{ fontSize:14, fontWeight:800, color: genreInfo.color, marginBottom:14 }}>
                    {genreInfo.icon} {genreInfo.label}
                  </div>
                  <div style={{
                    background:"rgba(255,255,255,0.03)", border:`1px solid ${genreInfo.color}33`,
                    borderRadius:12, padding:"14px 12px",
                  }}>
                    <div style={{ fontSize:9, color:"#94a3b8", marginBottom:2 }}>獲得スコア</div>
                    <div style={{ fontSize:40, fontWeight:900, color:"#FBBF24", lineHeight:1, marginBottom:10 }}>
                      {userPlayer?.score || 0}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-around", borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:8 }}>
                      <div>
                        <div style={{ fontSize:8, color:"#94a3b8" }}>正答数</div>
                        <div style={{ fontSize:16, fontWeight:900, color:"#34D399" }}>{correctCount}/{battleAnswers.length}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:8, color:"#94a3b8" }}>正答率</div>
                        <div style={{ fontSize:16, fontWeight:900, color:"#60A5FA" }}>{accuracy}%</div>
                      </div>
                    </div>
                  </div>
                  {petName && (
                    <div style={{ fontSize:10, color:"#A78BFA", marginTop:10, fontWeight:700 }}>
                      💎 {petName}と一緒に！
                    </div>
                  )}
                  <div style={{ fontSize:8, color:"#475569", marginTop:12 }}>勉強で進化する学習バトルRPG</div>
                  <div style={{ fontSize:9, color:"#60A5FA", fontWeight:700, marginTop:2 }}>#STUDYUM #勉強記録</div>
                </div>

                {/* アクション */}
                <button onClick={drawAndDownload} style={{
                  width:"100%", marginTop:14,
                  background:"linear-gradient(135deg, #60A5FA, #A78BFA)",
                  border:"none", borderRadius:14, padding:"14px",
                  cursor:"pointer", color:"#fff", fontSize:14, fontWeight:900, fontFamily:FONT,
                  boxShadow:"0 6px 18px rgba(96,165,250,0.4)",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                }}>
                  <span style={{ fontSize:18 }}>📥</span>
                  <span>画像をダウンロード</span>
                </button>
                <div style={{ fontSize:9, color:"#64748b", textAlign:"center", marginTop:8, lineHeight:1.5 }}>
                  保存した画像はInstagram, Twitter, LINEなど<br/>お好きなSNSにシェアできます
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ AD BANNER (Google AdSense) ════════════════════ */}
      {showNav && typeof window !== "undefined" && !window.__STUDYUM_AD_OFF && (
        <div style={{
          position:"fixed",
          bottom: `calc(80px + env(safe-area-inset-bottom, 0px))`,
          left:0, right:0,
          background:"rgba(10,15,30,0.95)",
          borderTop:"1px solid rgba(255,255,255,0.06)",
          display:"flex", justifyContent:"center", alignItems:"center",
          padding:"4px 0",
          zIndex:90,
          minHeight:50,
          maxHeight:60,
        }}>
          {/* AdSense埋め込み枠（審査通過後にコード貼る） */}
          <div style={{ width:320, height:50, position:"relative" }}>
            <ins className="adsbygoogle"
              style={{ display:"block", width:"320px", height:"50px" }}
              data-ad-client="ca-pub-XXXXXXXXXX"
              data-ad-slot="XXXXXXXXXX"
              data-ad-format="auto"
              data-full-width-responsive="true"/>
            {/* プレースホルダ（広告未表示時） */}
            <div style={{
              position:"absolute", inset:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#475569", fontSize:9, letterSpacing:1,
              pointerEvents:"none",
            }}>広告枠（AdSense審査中）</div>
          </div>
        </div>
      )}

      {/* ══ BOTTOM NAV ══════════════════════════════════════ */}
      {showNav && <BottomNav current={screen} onChange={setScreen} />}

      {/* ══ MISSION TOAST ══════════════════════════════════ */}
      {missionToast && (
        <div style={{
          position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
          zIndex:200, animation:"toastSlide 0.4s ease",
          background: missionToast.claimed
            ? "linear-gradient(135deg, #4ade80, #22d3ee)"
            : "linear-gradient(135deg, #FBBF24, #F472B6)",
          color:"#0f172a", padding:"12px 20px", borderRadius:16,
          boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
          display:"flex", alignItems:"center", gap:12,
          fontFamily:FONT, maxWidth:340,
        }}>
          <div style={{ width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <PixelIcon name={missionToast.claimed ? "spark" : missionToast.iconName} size={26} color="#0f172a"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:800, letterSpacing:1, opacity:0.7 }}>
              {missionToast.claimed ? "報酬を受け取りました" : "ミッション達成！"}
            </div>
            <div style={{ fontSize:13, fontWeight:800 }}>
              {missionToast.claimed ? `+${missionToast.reward} XP` : missionToast.title}
            </div>
          </div>
        </div>
      )}

      {/* ══ PROMOTION OVERLAY（昇格演出） ══════════════════ */}
      {promotionAnim && (
        <div onClick={() => setPromotionAnim(null)} style={{
          position:"fixed", inset:0, zIndex:300,
          background:"radial-gradient(circle at center, rgba(0,0,0,0.85), rgba(0,0,0,0.95))",
          display:"flex", alignItems:"center", justifyContent:"center",
          animation:"fadeIn 0.4s ease", cursor:"pointer",
        }}>
          <div style={{
            textAlign:"center", padding:"40px 30px",
            background:`linear-gradient(135deg, ${promotionAnim.to.color}22, rgba(0,0,0,0.6))`,
            border:`3px solid ${promotionAnim.to.color}`,
            borderRadius:24,
            boxShadow:`0 0 80px ${promotionAnim.to.color}aa`,
            maxWidth:340, animation:"popIn 0.6s ease",
          }}>
            <div style={{ fontSize:14, color:"#FBBF24", letterSpacing:5, fontWeight:800, marginBottom:8 }}>✨ 昇格 ✨</div>
            <div style={{ fontSize:11, color:"#94a3b8", marginBottom:24 }}>新しい階級に到達しました！</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:20 }}>
              <div style={{ opacity:0.4 }}>
                <div style={{ fontSize:40 }}>{promotionAnim.from.icon}</div>
                <div style={{ fontSize:11, color:promotionAnim.from.color, fontWeight:700, marginTop:2 }}>{promotionAnim.from.name}</div>
              </div>
              <div style={{ fontSize:24, color:"#FBBF24" }}>→</div>
              <div style={{ animation:"monsterFloat 2s ease-in-out infinite" }}>
                <div style={{ fontSize:64, filter:`drop-shadow(0 0 20px ${promotionAnim.to.color})` }}>{promotionAnim.to.icon}</div>
                <div style={{ fontSize:14, color:promotionAnim.to.color, fontWeight:800, marginTop:4 }}>{promotionAnim.to.name}</div>
              </div>
            </div>
            <div style={{ background:`${promotionAnim.to.color}22`, border:`1px solid ${promotionAnim.to.color}66`, borderRadius:12, padding:"10px 16px", marginBottom:16 }}>
              <div style={{ fontSize:10, color:"#94a3b8", fontWeight:700, marginBottom:3 }}>新しい称号</div>
              <div style={{ fontSize:16, fontWeight:800, color:promotionAnim.to.color }}>⚜ {promotionAnim.to.title}</div>
            </div>
            <div style={{ fontSize:12, color:"#FBBF24", fontWeight:700 }}>+100💰 昇格ボーナス！</div>
            <div style={{ fontSize:10, color:"#64748b", marginTop:16 }}>タップで閉じる</div>
          </div>
        </div>
      )}

      {/* ══ LISTENING（リスニング） ═════════════════════════ */}
      {screen === S.LISTENING && listenQ && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"24px 18px", animation:"screenEnter 0.4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
            <button onClick={() => { setScreen(S.HOME); setListenQ(null); if (typeof window !== "undefined") window.speechSynthesis.cancel(); }} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:"pointer", color:"#cbd5e1", fontSize:17, fontWeight:700, fontFamily:FONT }}>←</button>
            <div style={{ flex:1 }}>
              <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#60A5FA" }}>🎧 リスニング</h2>
              <p style={{ color:"#94a3b8", fontSize:11, margin:"2px 0 0" }}>
                {listenIdx + 1} / {(window.__LISTEN_QUEUE||[]).length}問 · 正解 {listenScore} · {listenQ.level === "easy" ? "やさしい" : listenQ.level === "normal" ? "ふつう" : "むずかしい"}
              </p>
            </div>
          </div>
          {/* プログレス */}
          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:99, height:5, overflow:"hidden", marginBottom:18 }}>
            <div style={{
              width:`${((listenIdx+1) / (window.__LISTEN_QUEUE||[]).length)*100}%`,
              height:"100%", background:"linear-gradient(90deg, #60A5FA, #818CF8)", transition:"width 0.4s",
            }}/>
          </div>
          {/* 音声再生ボタン */}
          <div style={{
            background:"linear-gradient(135deg, rgba(96,165,250,0.15), rgba(167,139,250,0.08))",
            border:"2px solid rgba(96,165,250,0.4)",
            borderRadius:20, padding:"30px 20px", marginBottom:16, textAlign:"center",
          }}>
            <button onClick={() => {
              setListenSpeaking(true);
              speakText(listenQ.audio, () => setListenSpeaking(false));
            }} data-sfx="none" disabled={listenSpeaking} style={{
              width:90, height:90, borderRadius:"50%",
              background:`linear-gradient(135deg, #60A5FA, #818CF8)`,
              border:"none", color:"#fff",
              fontSize:36, cursor: listenSpeaking ? "default" : "pointer",
              boxShadow: listenSpeaking ? "0 0 40px rgba(96,165,250,0.7)" : "0 6px 20px rgba(96,165,250,0.4)",
              animation: listenSpeaking ? "monsterFloat 0.6s ease-in-out infinite" : "none",
              fontFamily:FONT,
            }}>{listenSpeaking ? "🔊" : "▶"}</button>
            <div style={{ fontSize:11, color:"#94a3b8", marginTop:14 }}>
              {listenSpeaking ? "再生中..." : "タップで再生（何度でも聞ける）"}
            </div>
          </div>
          {/* 質問 */}
          <div style={{ fontSize:14, fontWeight:700, color:"#cbd5e1", marginBottom:10, textAlign:"center" }}>
            {listenQ.q}
          </div>
          {/* 選択肢 */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {listenQ.choices.map((c,i) => {
              const ok = i === listenQ.answer, chosen = i === listenSelected;
              let bg = "rgba(30,41,59,0.95)", border = "rgba(255,255,255,0.2)", color = "#f8fafc";
              if (listenSelected !== null) {
                if (ok) { bg = "rgba(52,211,153,0.3)"; border = "#34D399"; color = "#d1fae5"; }
                else if (chosen) { bg = "rgba(239,68,68,0.3)"; border = "#EF4444"; color = "#fecaca"; }
                else { bg = "rgba(30,41,59,0.5)"; color = "#94a3b8"; }
              }
              return (
                <button key={i} onClick={() => handleListenAnswer(i)} data-sfx="none" disabled={listenSelected !== null} style={{
                  background:bg, border:`2px solid ${border}`, borderRadius:12,
                  padding:"12px 14px", cursor:listenSelected===null?"pointer":"default",
                  color, fontSize:13, fontWeight:700, fontFamily:FONT, transition:"all 0.2s",
                  textAlign:"left",
                }}>{c}</button>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ SPEAKING（スピーキング） ════════════════════════ */}
      {screen === S.SPEAKING && speakQ && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"24px 18px", animation:"screenEnter 0.4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
            <button onClick={() => { setScreen(S.HOME); setSpeakQ(null); if (typeof window !== "undefined") window.speechSynthesis.cancel(); }} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:"pointer", color:"#cbd5e1", fontSize:17, fontWeight:700, fontFamily:FONT }}>←</button>
            <div style={{ flex:1 }}>
              <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#F472B6" }}>🎤 スピーキング</h2>
              <p style={{ color:"#94a3b8", fontSize:11, margin:"2px 0 0" }}>
                {speakIdx + 1} / {(window.__SPEAK_QUEUE||[]).length}問 · 正解 {speakScore} · {speakQ.level === "easy" ? "やさしい" : speakQ.level === "normal" ? "ふつう" : "むずかしい"}
              </p>
            </div>
          </div>

          {/* プログレス */}
          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:99, height:5, overflow:"hidden", marginBottom:18 }}>
            <div style={{
              width:`${((speakIdx+1) / (window.__SPEAK_QUEUE||[]).length)*100}%`,
              height:"100%", background:"linear-gradient(90deg, #F472B6, #A78BFA)", transition:"width 0.4s",
            }}/>
          </div>

          {/* 発音するフレーズ */}
          <div style={{
            background:"linear-gradient(135deg, rgba(244,114,182,0.15), rgba(167,139,250,0.08))",
            border:"2px solid rgba(244,114,182,0.4)",
            borderRadius:20, padding:"22px 18px", marginBottom:14, textAlign:"center",
          }}>
            <div style={{ fontSize:11, color:"#F472B6", letterSpacing:2, fontWeight:800, marginBottom:10 }}>このフレーズを発音</div>
            <div style={{ fontSize:24, fontWeight:800, color:"#fff", marginBottom:6, letterSpacing:0.5 }}>{speakQ.phrase}</div>
            <div style={{ fontSize:12, color:"#94a3b8", marginBottom:10 }}>{speakQ.jp}</div>
            <button onClick={() => speakText(speakQ.phrase)} data-sfx="none" style={{
              background:"rgba(96,165,250,0.15)", border:"1px solid rgba(96,165,250,0.4)",
              borderRadius:10, padding:"6px 14px", cursor:"pointer",
              color:"#60A5FA", fontSize:11, fontWeight:700, fontFamily:FONT,
            }}>🔊 お手本を聞く</button>
          </div>

          {!speakResult ? (
            <>
              {/* 録音中のフルスクリーン演出 */}
              {speakListening && (
                <div style={{
                  position:"fixed", inset:0, zIndex:400,
                  background:"radial-gradient(circle, rgba(127,29,29,0.95), rgba(0,0,0,0.98))",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  flexDirection:"column", gap:20,
                  animation:"fadeIn 0.2s ease",
                }}>
                  {/* 大きなRECバッジ */}
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", background:"#EF4444", animation:"recordingDot 1s ease-in-out infinite" }}/>
                    <span style={{ fontSize:18, color:"#EF4444", fontWeight:900, letterSpacing:6 }}>● REC</span>
                  </div>

                  {/* マイクアイコン（大きい） */}
                  <div style={{
                    fontSize:140, animation:"micShake 0.4s ease-in-out infinite",
                    filter:"drop-shadow(0 0 30px rgba(239,68,68,0.7))",
                  }}>🎙️</div>

                  {/* 音波バー */}
                  <div style={{ display:"flex", alignItems:"flex-end", gap:5, height:60, marginBottom:8 }}>
                    {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
                      <div key={i} style={{
                        width:5, background:"linear-gradient(180deg, #EF4444, #FBBF24)",
                        borderRadius:99,
                        animation:`waveBar 0.7s ease-in-out ${i*0.06}s infinite`,
                        height:"40%",
                        boxShadow:"0 0 8px rgba(239,68,68,0.6)",
                      }}/>
                    ))}
                  </div>

                  <div style={{ textAlign:"center", padding:"0 30px" }}>
                    <div style={{ fontSize:22, color:"#fff", fontWeight:900, marginBottom:8 }}>
                      🗣️ 話してください
                    </div>
                    <div style={{ fontSize:24, color:"#FBBF24", fontWeight:800, marginBottom:14, padding:"10px 20px", background:"rgba(0,0,0,0.4)", borderRadius:12, border:"2px dashed rgba(251,191,36,0.5)" }}>
                      "{speakQ.phrase}"
                    </div>
                    <div style={{ fontSize:12, color:"#FCA5A5" }}>
                      ⏱ 8秒以内に発音してください
                    </div>
                  </div>
                </div>
              )}

              {/* 通常の録音ボタン */}
              <div style={{ textAlign:"center", marginBottom:14 }}>
                <button onClick={recordSpeech} data-sfx="none" disabled={!speakSupported} style={{
                  width:120, height:120, borderRadius:"50%",
                  background: speakSupported ? "linear-gradient(135deg, #F472B6, #EC4899)" : "rgba(100,116,139,0.3)",
                  border:"4px solid rgba(244,114,182,0.4)",
                  color:"#fff", fontSize:52,
                  cursor: speakSupported ? "pointer" : "not-allowed",
                  boxShadow: speakSupported ? "0 8px 30px rgba(244,114,182,0.6)" : "none",
                  fontFamily:FONT,
                  animation: speakSupported ? "monsterFloat 2.5s ease-in-out infinite" : "none",
                }}>🎤</button>
                <div style={{ fontSize:15, color:"#f8fafc", marginTop:14, fontWeight:800 }}>
                  {speakSupported ? "タップして録音開始" : "ブラウザが音声認識に非対応"}
                </div>
                <div style={{ fontSize:10, color:"#94a3b8", marginTop:4 }}>
                  {speakSupported ? "マイクの許可を求められたら「許可」を選んでください" : "Chrome や 最新Safariをお試しください"}
                </div>
              </div>
            </>
          ) : (
            // 結果画面
            <div style={{
              background: speakResult.pass ? "linear-gradient(135deg, rgba(52,211,153,0.18), rgba(52,211,153,0.05))" : "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))",
              border:`2px solid ${speakResult.pass ? "#34D399" : "#EF4444"}`,
              borderRadius:16, padding:"18px", animation:"popIn 0.4s ease",
            }}>
              <div style={{ textAlign:"center", marginBottom:14 }}>
                <div style={{ fontSize:48, marginBottom:4 }}>
                  {speakResult.error ? "⚠️" : speakResult.pass ? "✨" : "💪"}
                </div>
                <div style={{ fontSize:18, fontWeight:800, color: speakResult.pass ? "#34D399" : "#FCA5A5", marginBottom:4 }}>
                  {speakResult.error ? "エラー" : speakResult.pass ? "Great Job!" : "おしい！"}
                </div>
                {!speakResult.error && (
                  <div style={{ fontSize:32, fontWeight:900, color:"#fff", lineHeight:1 }}>
                    {speakResult.score}<span style={{ fontSize:18, color:"#94a3b8" }}>%</span>
                  </div>
                )}
              </div>

              {/* 認識結果 */}
              <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:10, padding:"10px 14px", marginBottom:10 }}>
                <div style={{ fontSize:10, color:"#94a3b8", marginBottom:4, fontWeight:700 }}>
                  {speakResult.error ? "💬 メッセージ" : "🗣 あなたの発音はこう聞こえました"}
                </div>
                <div style={{ fontSize:13, color:"#f8fafc", fontWeight:600 }}>「{speakResult.heard}」</div>
              </div>

              {/* 単語ごとのチェック（エラー時以外） */}
              {!speakResult.error && speakResult.wordChecks && (
                <>
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"10px 14px", marginBottom:10 }}>
                    <div style={{ fontSize:10, color:"#94a3b8", marginBottom:6, fontWeight:700 }}>📝 単語ごとのチェック</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {speakResult.wordChecks.map((c, i) => (
                        <span key={i} style={{
                          background: c.ok ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)",
                          border:`1px solid ${c.ok ? "#34D399" : "#EF4444"}`,
                          color: c.ok ? "#34D399" : "#FCA5A5",
                          borderRadius:6, padding:"3px 8px",
                          fontSize:12, fontWeight:700, fontFamily:FONT,
                        }}>
                          {c.ok ? "✓" : "✗"} {c.word}
                          {!c.ok && c.heardWord && (
                            <span style={{ color:"#64748b", fontSize:9, marginLeft:4 }}>→「{c.heardWord}」と聞こえた</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 改善ポイント（発音記号と解説付き） */}
                  {speakResult.missed && speakResult.missed.length > 0 && (
                    <div style={{ background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
                      <div style={{ fontSize:11, color:"#FBBF24", marginBottom:8, fontWeight:800 }}>💡 苦手な単語の発音解説</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {speakResult.missed.map((w, i) => {
                          const wLower = w.toLowerCase();
                          const tip = PRONUNCIATION_TIPS[wLower];
                          return (
                            <div key={i} style={{ background:"rgba(0,0,0,0.25)", borderRadius:8, padding:"8px 10px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:tip ? 4 : 0 }}>
                                <button onClick={() => speakText(w)} data-sfx="none" style={{
                                  background:"rgba(251,191,36,0.25)", border:"1px solid rgba(251,191,36,0.5)",
                                  color:"#FBBF24", borderRadius:6, padding:"3px 9px",
                                  fontSize:13, fontWeight:800, fontFamily:FONT, cursor:"pointer",
                                }}>🔊 {w}</button>
                                {tip && (
                                  <span style={{ fontSize:13, color:"#A78BFA", fontWeight:700, fontFamily:"Georgia, serif" }}>
                                    {tip.ipa}
                                  </span>
                                )}
                              </div>
                              {tip && (
                                <div style={{ fontSize:10, color:"#cbd5e1", lineHeight:1.5, paddingLeft:2 }}>
                                  💬 {tip.tip}
                                </div>
                              )}
                              {!tip && (
                                <div style={{ fontSize:9, color:"#94a3b8" }}>タップで発音を再生</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* お手本を再生 */}
              <button onClick={() => speakText(speakQ.phrase)} data-sfx="none" style={{
                width:"100%", background:"rgba(96,165,250,0.15)", border:"1px solid rgba(96,165,250,0.4)",
                borderRadius:10, padding:"8px", cursor:"pointer",
                color:"#60A5FA", fontSize:12, fontWeight:700, fontFamily:FONT, marginBottom:10,
              }}>🔊 お手本をもう一度聞く</button>

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => { setSpeakResult(null); }} style={{
                  flex:1, background:"rgba(244,114,182,0.15)", border:"1px solid rgba(244,114,182,0.4)",
                  borderRadius:10, padding:"12px", cursor:"pointer",
                  color:"#F472B6", fontSize:12, fontWeight:800, fontFamily:FONT,
                }}>🔄 もう一度</button>
                <button onClick={nextSpeaking} style={{
                  flex:1, background:"linear-gradient(135deg, #F472B6, #A78BFA)", border:"none",
                  borderRadius:10, padding:"12px", cursor:"pointer",
                  color:"#fff", fontSize:12, fontWeight:800, fontFamily:FONT,
                  boxShadow:"0 4px 14px rgba(244,114,182,0.4)",
                }}>次へ →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ REVIEW（復習モード） ════════════════════════════ */}
      {screen === S.REVIEW && reviewQ && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"24px 18px", animation:"screenEnter 0.4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
            <button onClick={() => setScreen(S.HOME)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:"pointer", color:"#cbd5e1", fontSize:17, fontWeight:700, fontFamily:FONT }}>←</button>
            <div style={{ flex:1 }}>
              <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#F472B6" }}>📝 復習モード</h2>
              <p style={{ color:"#94a3b8", fontSize:11, margin:"2px 0 0" }}>
                {reviewIdx + 1} / {(window.__REVIEW_QUEUE||[]).length} 問
              </p>
            </div>
            <div style={{ fontSize:11, color:"#94a3b8", background:"rgba(244,114,182,0.15)", border:"1px solid rgba(244,114,182,0.3)", borderRadius:99, padding:"4px 10px", fontWeight:700, color:"#F472B6" }}>
              +8💰 / 正解
            </div>
          </div>

          {/* プログレスバー */}
          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:99, height:5, overflow:"hidden", marginBottom:18 }}>
            <div style={{
              width:`${((reviewIdx+1) / (window.__REVIEW_QUEUE||[]).length)*100}%`,
              height:"100%", background:"linear-gradient(90deg, #F472B6, #A78BFA)", transition:"width 0.4s",
            }}/>
          </div>

          {/* ジャンル表示 */}
          <div style={{ fontSize:10, color:"#94a3b8", marginBottom:6, letterSpacing:2 }}>
            ジャンル: {GENRES.find(g => g.id === reviewQ.genre)?.label || reviewQ.genre}
          </div>

          {/* 問題 */}
          <div style={{
            background: reviewFlash === "correct" ? "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05))" : reviewFlash === "wrong" ? "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))" : "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))",
            border:`2px solid ${reviewFlash === "correct" ? "#34D399" : reviewFlash === "wrong" ? "#EF4444" : "rgba(255,255,255,0.18)"}`,
            borderRadius:18, padding:"24px 18px", marginBottom:16,
            textAlign:"center", minHeight:80,
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.2s",
          }}>
            <p style={{ fontSize:18, fontWeight:800, margin:0, lineHeight:1.5, color:"#fff" }}>{reviewQ.q}</p>
          </div>

          {/* 選択肢 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {reviewQ.choices.map((c,i) => {
              const ok = i === reviewQ.correctIdx, chosen = i === reviewSelected;
              let bg = "rgba(30,41,59,0.95)", border = "rgba(255,255,255,0.2)", color = "#f8fafc";
              if (reviewSelected !== null) {
                if (ok) { bg = "rgba(52,211,153,0.3)"; border = "#34D399"; color = "#d1fae5"; }
                else if (chosen) { bg = "rgba(239,68,68,0.3)"; border = "#EF4444"; color = "#fecaca"; }
                else { bg = "rgba(30,41,59,0.5)"; color = "#94a3b8"; }
              }
              return (
                <button key={i} onClick={() => handleReviewAnswer(i)} data-sfx="none" disabled={reviewSelected !== null} style={{
                  background:bg, border:`2px solid ${border}`, borderRadius:14,
                  padding:"14px 10px", cursor:reviewSelected===null?"pointer":"default",
                  color, fontSize:14, fontWeight:700, fontFamily:FONT, transition:"all 0.2s",
                }}>{c}</button>
              );
            })}
          </div>

          {/* 前回の自分の答えのヒント */}
          {reviewSelected === null && (
            <div style={{ marginTop:14, fontSize:11, color:"#94a3b8", textAlign:"center", background:"rgba(255,255,255,0.03)", padding:"8px 12px", borderRadius:10 }}>
              💡 前回あなたが選んだ答え: <span style={{ color:"#EF4444", fontWeight:800 }}>{reviewQ.choices[reviewQ.chosenIdx] || "（時間切れ）"}</span>
            </div>
          )}
        </div>
      )}

      {/* ══ GACHA（ガチャ） ═════════════════════════════════ */}
      {screen === S.GACHA && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"24px 18px", animation:"screenEnter 0.4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <button onClick={() => { setScreen(S.HOME); setGachaResult(null); }} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:"pointer", color:"#cbd5e1", fontSize:17, fontWeight:700, fontFamily:FONT }}>←</button>
            <div style={{ flex:1 }}>
              <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:"#FBBF24" }}>🎰 ガチャ</h2>
              <p style={{ color:"#94a3b8", fontSize:11, margin:"2px 0 0" }}>装飾アイテムを引く！</p>
            </div>
          </div>

          {/* 残高バー */}
          <div style={{ display:"flex", gap:6, marginBottom:14 }}>
            <div style={{ flex:1, background:"linear-gradient(135deg, #FBBF24, #F59E0B)", borderRadius:10, padding:"8px 10px", color:"#7c2d12", display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:FONT, fontWeight:900, fontSize:13 }}>
              💰 {coins}
            </div>
            <div style={{ flex:1, background:"linear-gradient(135deg, #A78BFA, #8B5CF6)", borderRadius:10, padding:"8px 10px", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:FONT, fontWeight:900, fontSize:13, position:"relative" }}>
              💎 {gems}
            </div>
          </div>

          {/* ✨ アイテム・サービス（コインの使い道） */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, color:"#A78BFA", letterSpacing:3, fontWeight:800, marginBottom:8 }}>✨ ショップ</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {/* XPブースター */}
              <button onClick={() => {
                const cost = 500;
                if (Date.now() < xpBoosterUntil) { SFX.back(); return; }
                if (coins < cost) { SFX.wrong(); return; }
                setCoins(c => c - cost);
                setXpBoosterUntil(Date.now() + 30 * 60 * 1000); // 30分
                SFX.levelUp();
                setTimeout(() => alert("⚡ XPブースター発動！\n30分間XPが2倍になります"), 100);
              }} disabled={Date.now() < xpBoosterUntil || coins < 500} style={{
                background: Date.now() < xpBoosterUntil 
                  ? "rgba(244,114,182,0.1)"
                  : coins < 500 ? "rgba(255,255,255,0.04)"
                  : "linear-gradient(135deg, rgba(244,114,182,0.18), rgba(244,114,182,0.06))",
                border: Date.now() < xpBoosterUntil 
                  ? "1.5px solid rgba(244,114,182,0.5)"
                  : "1px solid rgba(244,114,182,0.3)",
                borderRadius:12, padding:"10px",
                cursor: (Date.now() < xpBoosterUntil || coins < 500) ? "not-allowed" : "pointer",
                color: "#F472B6", fontFamily:FONT,
                textAlign:"left",
                opacity: coins < 500 && Date.now() >= xpBoosterUntil ? 0.5 : 1,
              }}>
                <div style={{ fontSize:22, marginBottom:2 }}>⚡</div>
                <div style={{ fontSize:11, fontWeight:800, marginBottom:2 }}>XPブースター</div>
                <div style={{ fontSize:9, color:"#94a3b8" }}>
                  {Date.now() < xpBoosterUntil 
                    ? `発動中 残${Math.ceil((xpBoosterUntil - Date.now()) / 60000)}分`
                    : "30分間XP×2"}
                </div>
                {Date.now() >= xpBoosterUntil && (
                  <div style={{ fontSize:9, color:"#FBBF24", fontWeight:900, marginTop:2 }}>500💰</div>
                )}
              </button>

              {/* カジノ */}
              <button onClick={() => setShowCasino(true)} style={{
                background:"linear-gradient(135deg, rgba(239,68,68,0.18), rgba(239,68,68,0.06))",
                border:"1px solid rgba(239,68,68,0.3)",
                borderRadius:12, padding:"10px",
                cursor:"pointer", color:"#FCA5A5", fontFamily:FONT,
                textAlign:"left",
              }}>
                <div style={{ fontSize:22, marginBottom:2 }}>🎰</div>
                <div style={{ fontSize:11, fontWeight:800, marginBottom:2 }}>スロット</div>
                <div style={{ fontSize:9, color:"#94a3b8" }}>30💰で運試し</div>
                <div style={{ fontSize:9, color:"#FBBF24", fontWeight:900, marginTop:2 }}>最大100倍！</div>
              </button>

              {/* Gem両替 */}
              <button onClick={() => setShowExchange(true)} disabled={coins < 1000} style={{
                background: coins < 1000 ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(167,139,250,0.06))",
                border: "1px solid rgba(167,139,250,0.3)",
                borderRadius:12, padding:"10px",
                cursor: coins < 1000 ? "not-allowed" : "pointer",
                color:"#A78BFA", fontFamily:FONT,
                textAlign:"left",
                opacity: coins < 1000 ? 0.5 : 1,
              }}>
                <div style={{ fontSize:22, marginBottom:2 }}>💎</div>
                <div style={{ fontSize:11, fontWeight:800, marginBottom:2 }}>Gem両替</div>
                <div style={{ fontSize:9, color:"#94a3b8" }}>1000💰 → 1💎</div>
                <div style={{ fontSize:9, color:"#A78BFA", fontWeight:900, marginTop:2 }}>特別ガチャに</div>
              </button>

              {/* 餌やり（既存機能のショートカット） */}
              <button onClick={() => setScreen(S.PROFILE)} style={{
                background:"linear-gradient(135deg, rgba(52,211,153,0.18), rgba(52,211,153,0.06))",
                border:"1px solid rgba(52,211,153,0.3)",
                borderRadius:12, padding:"10px",
                cursor:"pointer", color:"#34D399", fontFamily:FONT,
                textAlign:"left",
              }}>
                <div style={{ fontSize:22, marginBottom:2 }}>🍖</div>
                <div style={{ fontSize:11, fontWeight:800, marginBottom:2 }}>ペット餌やり</div>
                <div style={{ fontSize:9, color:"#94a3b8" }}>満腹でXP+10%</div>
                <div style={{ fontSize:9, color:"#FBBF24", fontWeight:900, marginTop:2 }}>10💰/回</div>
              </button>
            </div>
          </div>

          {/* ボス報酬・無料ガチャ券 */}
          {freeGachaTickets > 0 && (
            <div style={{
              background:"linear-gradient(135deg, rgba(167,139,250,0.2), rgba(244,114,182,0.08))",
              border:"1.5px solid rgba(167,139,250,0.5)",
              borderRadius:14, padding:"12px 14px", marginBottom:10,
              display:"flex", alignItems:"center", gap:12,
              boxShadow:"0 0 20px rgba(167,139,250,0.3)",
              animation:"pulse 2s ease-in-out infinite",
            }}>
              <div style={{ fontSize:32 }}>🎫</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9, color:"#A78BFA", letterSpacing:2, fontWeight:800 }}>🏰 BOSS REWARD</div>
                <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>ボス報酬ガチャ券</div>
                <div style={{ fontSize:10, color:"#cbd5e1" }}>
                  <span style={{ color:"#FBBF24", fontWeight:700 }}>レア確定</span> · 残り{freeGachaTickets}枚
                </div>
              </div>
              <button onClick={() => {
                if (freeGachaTickets <= 0 || gachaSpinning) return;
                setFreeGachaTickets(prev => prev - 1);
                // レア確定で引く（200円ガチャ相当）
                spinGacha(200, true);
              }} disabled={gachaSpinning} style={{
                background:"linear-gradient(135deg, #A78BFA, #8B5CF6)",
                border:"none", borderRadius:10, padding:"10px 16px",
                cursor: gachaSpinning ? "not-allowed" : "pointer",
                color:"#fff", fontSize:13, fontWeight:900, fontFamily:FONT,
                boxShadow:"0 4px 12px rgba(167,139,250,0.5)",
                opacity: gachaSpinning ? 0.5 : 1,
              }}>引く！</button>
            </div>
          )}

          {/* 🛍️ ショップアイテム（XPブースター・Gem両替） */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:3, fontWeight:800, marginBottom:8 }}>🛍️ アイテム</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {/* XPブースター（30分） */}
              <button onClick={() => {
                if (coins < 500) { SFX.wrong(); return; }
                setCoins(c => c - 500);
                setXpBoosterUntil(Date.now() + 30 * 60 * 1000); // 30分
                SFX.levelUp();
                setTimeout(() => alert("⚡ XPブースター発動！\n30分間XP×2倍！今のうちにバトルしよう✨"), 100);
              }} disabled={coins < 500 || Date.now() < xpBoosterUntil} style={{
                background: Date.now() < xpBoosterUntil 
                  ? "rgba(244,114,182,0.1)"
                  : coins < 500 
                    ? "rgba(255,255,255,0.04)"
                    : "linear-gradient(135deg, rgba(244,114,182,0.15), rgba(244,114,182,0.05))",
                border: Date.now() < xpBoosterUntil 
                  ? "1.5px solid rgba(244,114,182,0.5)"
                  : "1.5px solid rgba(244,114,182,0.3)",
                borderRadius:12, padding:"12px 8px",
                cursor: (coins < 500 || Date.now() < xpBoosterUntil) ? "not-allowed" : "pointer",
                color: coins < 500 ? "#64748b" : "#F472B6",
                fontFamily:FONT, textAlign:"center",
                opacity: coins < 500 && Date.now() >= xpBoosterUntil ? 0.5 : 1,
              }}>
                <div style={{ fontSize:24, marginBottom:4 }}>⚡</div>
                <div style={{ fontSize:11, fontWeight:900 }}>XPブースター</div>
                <div style={{ fontSize:8, color:"#94a3b8", marginTop:2 }}>30分XP×2倍</div>
                {Date.now() < xpBoosterUntil ? (
                  <div style={{ fontSize:9, color:"#F472B6", marginTop:4, fontWeight:800 }}>
                    ⏱ あと{Math.floor((xpBoosterUntil - Date.now()) / 60000)}分
                  </div>
                ) : (
                  <div style={{ fontSize:10, color:"#FBBF24", marginTop:4, fontWeight:800 }}>500💰</div>
                )}
              </button>
              {/* Gem両替（1000💰→1💎） */}
              <button onClick={() => {
                if (coins < 1000) { SFX.wrong(); return; }
                if (!confirm("💰 1000 を 💎 1 に両替しますか？")) return;
                setCoins(c => c - 1000);
                addGems(1);
                setTimeout(() => alert("💎 Gem +1!\n伝説ガチャに使えます✨"), 100);
              }} disabled={coins < 1000} style={{
                background: coins < 1000 
                  ? "rgba(255,255,255,0.04)"
                  : "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(167,139,250,0.05))",
                border:"1.5px solid rgba(167,139,250,0.3)",
                borderRadius:12, padding:"12px 8px",
                cursor: coins < 1000 ? "not-allowed" : "pointer",
                color: coins < 1000 ? "#64748b" : "#A78BFA",
                fontFamily:FONT, textAlign:"center",
                opacity: coins < 1000 ? 0.5 : 1,
              }}>
                <div style={{ fontSize:24, marginBottom:4 }}>💎</div>
                <div style={{ fontSize:11, fontWeight:900 }}>Gem両替</div>
                <div style={{ fontSize:8, color:"#94a3b8", marginTop:2 }}>1000💰→💎1</div>
                <div style={{ fontSize:10, color:"#FBBF24", marginTop:4, fontWeight:800 }}>1000💰</div>
              </button>
            </div>
          </div>

          {/* 💎 伝説ガチャ（Gem使用） */}
          {gems > 0 && (
            <button onClick={() => {
              if (gems < 1 || gachaSpinning) return;
              if (!confirm("💎 1 でレジェンド確定ガチャを引きますか？")) return;
              setGems(g => g - 1);
              // 強制レジェンド
              setGachaSpinning(true);
              setGachaResult(null);
              SFX.open();
              setTimeout(() => {
                const legends = SHOP_ITEMS.filter(i => i.price >= 700);
                const reward = legends[Math.floor(Math.random() * legends.length)];
                const owned = ownedItems.includes(reward.id);
                if (!owned) setOwnedItems(arr => [...arr, reward.id]);
                setLegendItems(prev => prev + 1);
                setGachaResult({ item: reward, rare:"legend", isDup: owned, pityHit:false });
                setGachaSpinning(false);
                SFX.levelUp();
              }, 1500);
            }} disabled={gachaSpinning} style={{
              width:"100%", marginBottom:14,
              background:"linear-gradient(135deg, #A78BFA, #F472B6, #FBBF24)",
              backgroundSize:"200% 200%",
              animation:"gradientShift 3s ease infinite",
              border:"2px solid rgba(251,191,36,0.6)",
              borderRadius:14, padding:"14px 18px",
              cursor: gachaSpinning ? "not-allowed" : "pointer",
              color:"#fff", fontSize:14, fontWeight:900, fontFamily:FONT,
              boxShadow:"0 0 30px rgba(167,139,250,0.5)",
              display:"flex", alignItems:"center", gap:10,
              opacity: gachaSpinning ? 0.5 : 1,
            }}>
              <span style={{ fontSize:28 }}>💎</span>
              <div style={{ flex:1, textAlign:"left" }}>
                <div style={{ fontSize:9, letterSpacing:3, opacity:0.9 }}>★ LEGEND GACHA ★</div>
                <div style={{ fontSize:14, fontWeight:900 }}>伝説ガチャ（レア確定）</div>
                <div style={{ fontSize:9, opacity:0.9 }}>所持💎{gems}個 · 1回で💎×1</div>
              </div>
              <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, padding:"6px 12px", fontSize:12, fontWeight:900 }}>引く！</div>
            </button>
          )}

          {/* 🎰 スロットゲーム */}
          <button onClick={() => setShowSlot(true)} style={{
            width:"100%", marginBottom:14,
            background:"linear-gradient(135deg, rgba(239,68,68,0.18), rgba(251,191,36,0.1))",
            border:"1.5px solid rgba(239,68,68,0.4)",
            borderRadius:14, padding:"12px 16px",
            cursor:"pointer", color:"#f8fafc", fontFamily:FONT,
            display:"flex", alignItems:"center", gap:12,
            position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute", top:-2, right:8, background:"#EF4444", color:"#fff", fontSize:8, fontWeight:900, padding:"2px 8px", borderRadius:"0 0 8px 8px", letterSpacing:1 }}>NEW</div>
            <div style={{ fontSize:28 }}>🎰</div>
            <div style={{ flex:1, textAlign:"left" }}>
              <div style={{ fontSize:9, color:"#EF4444", letterSpacing:2, fontWeight:800 }}>MINI GAME</div>
              <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>スロットゲーム</div>
              <div style={{ fontSize:10, color:"#cbd5e1" }}>絵柄を揃えてコインGET！</div>
            </div>
            <div style={{ fontSize:18, color:"#EF4444" }}>›</div>
          </button>

          {/* デイリー無料ガチャ */}
          {(() => {
            const today = new Date().toISOString().slice(0,10);
            const canFree = freeGachaDate !== today;
            return (
              <div style={{
                background: canFree
                  ? "linear-gradient(135deg, rgba(52,211,153,0.18), rgba(96,165,250,0.08))"
                  : "rgba(255,255,255,0.03)",
                border: canFree ? "1.5px solid rgba(52,211,153,0.5)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius:14, padding:"12px 14px", marginBottom:14,
                display:"flex", alignItems:"center", gap:12,
                position:"relative", overflow:"hidden",
                opacity: canFree ? 1 : 0.6,
              }}>
                {canFree && (
                  <div style={{
                    position:"absolute", top:-1, right:8,
                    background:"#34D399", color:"#0f172a",
                    fontSize:8, fontWeight:900, letterSpacing:1.5,
                    padding:"2px 8px", borderRadius:"0 0 8px 8px",
                  }}>NEW!</div>
                )}
                <div style={{ fontSize:32 }}>🎁</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:9, color: canFree ? "#34D399" : "#64748b", letterSpacing:2, fontWeight:800 }}>
                    {canFree ? "🎉 DAILY FREE" : "✓ TODAY'S DONE"}
                  </div>
                  <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>無料ガチャ券</div>
                  <div style={{ fontSize:10, color:"#94a3b8" }}>
                    {canFree ? "毎日1回タダで引ける！" : "明日また使えるよ"}
                  </div>
                </div>
                <button
                  onClick={() => canFree && spinGacha(100, true)}
                  disabled={!canFree || gachaSpinning}
                  style={{
                    background: canFree ? "linear-gradient(135deg, #34D399, #10B981)" : "rgba(255,255,255,0.06)",
                    border:"none", borderRadius:10, padding:"10px 16px",
                    cursor: canFree && !gachaSpinning ? "pointer" : "not-allowed",
                    color: canFree ? "#0f172a" : "#64748b",
                    fontSize:12, fontWeight:900, fontFamily:FONT,
                    boxShadow: canFree ? "0 4px 12px rgba(52,211,153,0.4)" : "none",
                  }}
                >{canFree ? "引く！" : "明日"}</button>
              </div>
            );
          })()}

          {/* ガチャ結果 */}
          {gachaResult && !gachaSpinning ? (
            <div style={{
              background:`linear-gradient(135deg, ${gachaResult.item.price >= 500 ? "rgba(251,191,36,0.2)" : gachaResult.item.price >= 200 ? "rgba(96,165,250,0.15)" : "rgba(148,163,184,0.1)"}, rgba(0,0,0,0.3))`,
              border:`2px solid ${gachaResult.item.price >= 500 ? "#FBBF24" : gachaResult.item.price >= 200 ? "#60A5FA" : "#94a3b8"}`,
              borderRadius:20, padding:"26px 20px 20px", marginBottom:16, textAlign:"center",
              animation:"popIn 0.5s ease",
              boxShadow:`0 0 30px ${gachaResult.item.price >= 500 ? "#FBBF2466" : gachaResult.item.price >= 200 ? "#60A5FA66" : "transparent"}`,
            }}>
              <div style={{ fontSize:11, color: gachaResult.item.price >= 500 ? "#FBBF24" : gachaResult.item.price >= 200 ? "#60A5FA" : "#94a3b8", letterSpacing:3, fontWeight:800, marginBottom:8 }}>
                {gachaResult.item.price >= 500 ? "🌟 LEGEND 🌟" : gachaResult.item.price >= 200 ? "💎 RARE 💎" : "🥉 COMMON"}
              </div>
              {gachaResult.pityHit && (
                <div style={{ fontSize:10, background:"rgba(244,114,182,0.2)", border:"1px solid rgba(244,114,182,0.5)", color:"#F472B6", borderRadius:99, padding:"2px 10px", display:"inline-block", marginBottom:8, fontWeight:800 }}>
                  💖 天井ボーナス！
                </div>
              )}
              <div style={{ fontSize:80, marginBottom:10, animation:"monsterFloat 2s ease-in-out infinite" }}>{gachaResult.item.icon}</div>
              <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginBottom:4 }}>{gachaResult.item.name}</div>
              <div style={{ fontSize:11, color:"#cbd5e1", marginBottom:14 }}>{gachaResult.item.desc}</div>
              {gachaResult.isDuplicate ? (
                <div style={{ background:"rgba(96,165,250,0.15)", border:"1px solid rgba(96,165,250,0.4)", borderRadius:10, padding:"8px 12px", fontSize:11, color:"#60A5FA", fontWeight:700 }}>
                  ⚡ 重複: +{gachaResult.refund}💰 還元
                </div>
              ) : (
                <div style={{ background:"rgba(52,211,153,0.15)", border:"1px solid rgba(52,211,153,0.4)", borderRadius:10, padding:"8px 12px", fontSize:11, color:"#34D399", fontWeight:700 }}>
                  ✨ 新アイテム獲得！
                </div>
              )}
              <button onClick={() => setGachaResult(null)} style={{
                marginTop:14, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:10, padding:"8px 20px", cursor:"pointer", color:"#cbd5e1", fontSize:12, fontWeight:700, fontFamily:FONT,
              }}>続ける</button>
            </div>
          ) : (
            <div style={{
              background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:18, padding:"22px 20px", marginBottom:16, textAlign:"center",
            }}>
              <div style={{ fontSize:50, marginBottom:8 }}>📦</div>
              <div style={{ fontSize:12, color:"#94a3b8" }}>ガチャを引いてアイテムをゲット！</div>
            </div>
          )}

          {/* 天井＆コンボ表示 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
            {/* 天井カウンタ */}
            <div style={{
              background:"linear-gradient(135deg, rgba(244,114,182,0.1), rgba(244,114,182,0.03))",
              border:"1px solid rgba(244,114,182,0.3)",
              borderRadius:12, padding:"10px 12px",
            }}>
              <div style={{ fontSize:9, color:"#F472B6", fontWeight:800, letterSpacing:2, marginBottom:4 }}>🎯 天井まで</div>
              <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginBottom:4, lineHeight:1 }}>
                あと {Math.max(0, 30 - gachaPity)} <span style={{ fontSize:10, color:"#94a3b8" }}>連</span>
              </div>
              <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:5, overflow:"hidden" }}>
                <div style={{ width:`${Math.min(100, (gachaPity / 30) * 100)}%`, height:"100%", background:"linear-gradient(90deg, #F472B6, #EC4899)", transition:"width 0.4s" }}/>
              </div>
              <div style={{ fontSize:8, color:"#94a3b8", marginTop:3 }}>30連でレジェ確定！</div>
            </div>
            {/* コンボボーナス */}
            <div style={{
              background:`linear-gradient(135deg, ${gachaCombo > 0 ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.04)"}, rgba(0,0,0,0.2))`,
              border:`1px solid ${gachaCombo > 0 ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.08)"}`,
              borderRadius:12, padding:"10px 12px",
            }}>
              <div style={{ fontSize:9, color:"#FBBF24", fontWeight:800, letterSpacing:2, marginBottom:4 }}>🔥 連続ボーナス</div>
              <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginBottom:4, lineHeight:1 }}>
                {gachaCombo} <span style={{ fontSize:10, color:"#94a3b8" }}>連続</span>
              </div>
              <div style={{ fontSize:11, color:"#FBBF24", fontWeight:800 }}>
                +{Math.min(gachaCombo * 2, 15)}% レア率UP
              </div>
              <div style={{ fontSize:8, color:"#94a3b8", marginTop:3 }}>最大+15%（10連まで）</div>
            </div>
          </div>

          {/* 確率表 */}
          <div style={{
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:12, padding:"10px 12px", marginBottom:14,
          }}>
            <div style={{ fontSize:9, color:"#94a3b8", fontWeight:800, letterSpacing:2, marginBottom:6 }}>📊 確率表</div>
            <div style={{ display:"grid", gridTemplateColumns:"60px 1fr 1fr 1fr", gap:4, fontSize:10, fontFamily:FONT }}>
              <div style={{ color:"#94a3b8" }}></div>
              <div style={{ color:"#94a3b8", textAlign:"center" }}>普通</div>
              <div style={{ color:"#94a3b8", textAlign:"center" }}>レア</div>
              <div style={{ color:"#94a3b8", textAlign:"center" }}>レジェ</div>
              <div style={{ color:"#94a3b8", fontWeight:700 }}>100💰</div>
              <div style={{ color:"#94a3b8", textAlign:"center" }}>80%</div>
              <div style={{ color:"#60A5FA", textAlign:"center", fontWeight:700 }}>17%</div>
              <div style={{ color:"#FBBF24", textAlign:"center", fontWeight:700 }}>3%</div>
              <div style={{ color:"#94a3b8", fontWeight:700 }}>200💰</div>
              <div style={{ color:"#94a3b8", textAlign:"center" }}>50%</div>
              <div style={{ color:"#60A5FA", textAlign:"center", fontWeight:700 }}>40%</div>
              <div style={{ color:"#FBBF24", textAlign:"center", fontWeight:700 }}>10%</div>
              <div style={{ color:"#94a3b8", fontWeight:700 }}>500💰</div>
              <div style={{ color:"#94a3b8", textAlign:"center" }}>20%</div>
              <div style={{ color:"#60A5FA", textAlign:"center", fontWeight:700 }}>50%</div>
              <div style={{ color:"#FBBF24", textAlign:"center", fontWeight:700 }}>30%</div>
            </div>
          </div>

          {/* ガチャラインナップ */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { cost:100, label:"普通ガチャ",   icon:"🎁", rates:"コモン80% / レア17% / レジェ3%", border:"rgba(148,163,184,0.4)", bg:"linear-gradient(135deg, rgba(148,163,184,0.15), rgba(148,163,184,0.05))" },
              { cost:200, label:"レアガチャ",   icon:"🎀", rates:"コモン50% / レア40% / レジェ10%", border:"rgba(96,165,250,0.5)", bg:"linear-gradient(135deg, rgba(96,165,250,0.18), rgba(96,165,250,0.05))" },
              { cost:500, label:"レジェガチャ", icon:"🏆", rates:"コモン20% / レア50% / レジェ30%", border:"rgba(251,191,36,0.6)", bg:"linear-gradient(135deg, rgba(251,191,36,0.2), rgba(244,114,182,0.1))" },
            ].map(g => (
              <button key={g.cost} onClick={() => spinGacha(g.cost)} disabled={coins < g.cost || gachaSpinning} style={{
                background: coins >= g.cost ? g.bg : "rgba(255,255,255,0.02)",
                border: `1.5px solid ${coins >= g.cost ? g.border : "rgba(255,255,255,0.06)"}`,
                borderRadius:14, padding:"12px 14px",
                cursor: (coins >= g.cost && !gachaSpinning) ? "pointer" : "not-allowed",
                opacity: coins >= g.cost ? 1 : 0.5,
                color:"#f8fafc", textAlign:"left", fontFamily:FONT,
                display:"flex", alignItems:"center", gap:12,
              }}>
                <div style={{ fontSize:32 }}>{g.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:800, marginBottom:2 }}>{g.label}</div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>{g.rates}</div>
                </div>
                <div style={{ background:"linear-gradient(135deg, #FBBF24, #F59E0B)", color:"#7c2d12", padding:"4px 10px", borderRadius:8, fontWeight:900, fontSize:13 }}>
                  💰{g.cost}
                </div>
              </button>
            ))}
          </div>

          <div style={{ fontSize:10, color:"#64748b", textAlign:"center", marginTop:14, lineHeight:1.6 }}>
            🎫 重複アイテムは半額コインで還元されます
          </div>
        </div>
      )}

      {/* ══ SPLASH（起動時ロゴ） ════════════════════════════ */}
      {screen === S.SPLASH && (
        <div style={{
          minHeight:"100vh",
          background:"radial-gradient(ellipse at center, #1e1b4b 0%, #0a0f1e 70%)",
          display:"flex", alignItems:"center", justifyContent:"center",
          flexDirection:"column", gap:0,
          animation:"screenEnter 0.4s ease",
          position:"relative", overflow:"hidden",
        }}>
          {/* 後ろの円形グロー */}
          <div style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%, -50%)",
            width:400, height:400, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(96,165,250,0.2), transparent 70%)",
            animation:"splashGlow 3s ease-in-out infinite",
          }}/>
          {/* キラキラ12個 */}
          {Array.from({length:12}).map((_, i) => {
            const angle = (i / 12) * 360;
            const radius = 120 + (i % 3) * 30;
            return (
              <div key={i} style={{
                position:"absolute", top:"50%", left:"50%",
                width:6, height:6, borderRadius:"50%",
                background: i%3===0?"#FBBF24":i%3===1?"#60A5FA":"#A78BFA",
                boxShadow:`0 0 12px currentColor`,
                color: i%3===0?"#FBBF24":i%3===1?"#60A5FA":"#A78BFA",
                transform:`rotate(${angle}deg) translateY(-${radius}px)`,
                animation:`splashSparkle 2s ease-in-out infinite ${i*0.1}s`,
                transformOrigin:"center",
              }}/>
            );
          })}
          {/* 真ん中のアイコン */}
          <div style={{
            fontSize:96, marginBottom:8,
            animation:"splashBounce 1.5s ease-out, monsterFloat 2.5s ease-in-out 1.5s infinite",
            filter:"drop-shadow(0 0 40px rgba(96,165,250,0.8))",
            position:"relative", zIndex:2,
          }}>📚</div>
          {/* タイトル */}
          <div style={{
            fontSize:48, fontWeight:900, letterSpacing:6,
            background:"linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            backgroundClip:"text", color:"transparent",
            textShadow:"0 0 30px rgba(96,165,250,0.6)",
            animation:"popIn 1s ease 0.3s both",
            fontFamily:FONT,
            position:"relative", zIndex:2,
          }}>STUDYUM</div>
          {/* サブタイトル */}
          <div style={{
            fontSize:13, color:"#A78BFA", letterSpacing:5, fontWeight:700,
            marginTop:8,
            animation:"fadeIn 1.2s ease 0.7s both",
            position:"relative", zIndex:2,
          }}>勉強で進化する</div>
          <div style={{
            fontSize:11, color:"#64748b", letterSpacing:4, fontWeight:600,
            marginTop:4,
            animation:"fadeIn 1.2s ease 1s both",
            position:"relative", zIndex:2,
          }}>LEARNING BATTLE RPG</div>
          {/* プログレスバー */}
          <div style={{
            marginTop:36, width:160, height:5,
            background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden",
            position:"relative", zIndex:2,
            border:"1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{
              width:"100%", height:"100%",
              background:"linear-gradient(90deg, transparent, #60A5FA, #A78BFA, #F472B6, transparent)",
              animation:"splashProgress 2s linear infinite",
            }}/>
          </div>
          <div style={{
            marginTop:14, fontSize:9, color:"#475569", letterSpacing:2, fontWeight:600,
            animation:"fadeIn 1.5s ease 1.3s both",
            position:"relative", zIndex:2,
          }}>NOW LOADING...</div>
        </div>
      )}

      {/* ══ EVOLUTION（ペット進化演出） ══════════════════════ */}
      {evolutionAnim && (
        <div onClick={() => setEvolutionAnim(null)} style={{
          position:"fixed", inset:0, zIndex:400,
          background:"radial-gradient(circle, rgba(15,23,42,0.95), rgba(0,0,0,0.98))",
          display:"flex", alignItems:"center", justifyContent:"center",
          flexDirection:"column", cursor:"pointer",
          animation:"fadeIn 0.4s ease",
          overflow:"hidden",
        }}>
          {/* 背景の光線 */}
          {[0,1,2,3,4,5,6,7].map(i => (
            <div key={i} style={{
              position:"absolute", top:"50%", left:"50%",
              width:"3px", height:"200vh",
              background:`linear-gradient(180deg, transparent, ${["#FBBF24","#F472B6","#60A5FA","#A78BFA"][i%4]}, transparent)`,
              transformOrigin:"top",
              transform:`translate(-50%, -50%) rotate(${i * 45}deg)`,
              animation:`evolveBeam 1.5s ease-in-out infinite ${i * 0.1}s`,
              opacity:0.6,
            }}/>
          ))}
          {/* スパーク */}
          {[...Array(12)].map((_, i) => (
            <div key={"s"+i} style={{
              position:"absolute", top:"50%", left:"50%",
              fontSize:24,
              animation:`sparkleOut 1.8s ease-out infinite ${i * 0.15}s`,
              transform:`rotate(${i * 30}deg) translateY(-100px)`,
            }}>✨</div>
          ))}

          <div style={{ textAlign:"center", position:"relative", zIndex:10 }}>
            <div style={{
              fontSize:11, color:"#FBBF24", letterSpacing:8, fontWeight:900, marginBottom:24,
              textShadow:"0 0 15px #FBBF24",
              animation:"popIn 0.6s ease",
            }}>✨ E V O L U T I O N ✨</div>

            <div style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:30, marginBottom:30,
            }}>
              {/* 進化前（小さく、薄く） */}
              <div style={{
                opacity:0.3,
                animation:"evolveFromShrink 1.2s ease forwards",
              }}>
                <div style={{ fontSize:48 }}>
                  {evolutionAnim.fromStage === 1 ? "🥚" : evolutionAnim.fromStage === 2 ? "🐣" : (GENRE_FORMS[getTopGenres(genreXp)[0]?.[0]]?.creature || "🐾")}
                </div>
                <div style={{ fontSize:10, color:"#64748b", marginTop:4 }}>Lv.{evolutionAnim.fromStage}</div>
              </div>

              {/* 矢印 */}
              <div style={{
                fontSize:32, color:"#FBBF24",
                animation:"monsterFloat 1s ease-in-out infinite",
              }}>→</div>

              {/* 進化後（大きく、輝く） */}
              <div style={{
                animation:"evolveAppear 1.2s ease 0.6s both",
                filter:"drop-shadow(0 0 25px #FBBF24)",
              }}>
                <div style={{ fontSize:96 }}>
                  {evolutionAnim.toStage === 1 ? "🥚" : evolutionAnim.toStage === 2 ? "🐣" : (GENRE_FORMS[getTopGenres(genreXp)[0]?.[0]]?.creature || "🐾")}
                </div>
                <div style={{ fontSize:14, color:"#FBBF24", marginTop:6, fontWeight:900 }}>Lv.{evolutionAnim.toStage}</div>
              </div>
            </div>

            <div style={{
              background:"linear-gradient(135deg, rgba(251,191,36,0.2), rgba(244,114,182,0.15))",
              border:"2px solid rgba(251,191,36,0.5)",
              borderRadius:14, padding:"10px 20px",
              fontSize:16, fontWeight:800, color:"#FBBF24",
              animation:"popIn 0.6s ease 1.2s both",
              boxShadow:"0 0 30px rgba(251,191,36,0.3)",
            }}>
              新しい姿に進化しました！
            </div>
            <div style={{ marginTop:30, fontSize:11, color:"#64748b", animation:"fadeIn 1s ease 1.8s both" }}>
              タップで閉じる
            </div>
          </div>
        </div>
      )}

      {/* ══ TIMEATTACK_SELECT（教科選択） ══════════════════ */}
      {screen === S.TIMEATTACK_SELECT && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"32px 18px 24px", animation:"screenEnter 0.4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
            <button onClick={() => setScreen(S.HOME)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, width:38, height:38, cursor:"pointer", color:"#cbd5e1", fontSize:17, fontWeight:700, fontFamily:FONT }}>←</button>
            <div>
              <h2 style={{ margin:0, fontSize:22, fontWeight:800 }}>⏱️ タイムアタック</h2>
              <p style={{ color:"#94a3b8", fontSize:11, margin:"2px 0 0" }}>60秒で何問解けるか挑戦！</p>
            </div>
          </div>

          <div style={{ background:"linear-gradient(135deg, rgba(251,191,36,0.1), rgba(239,68,68,0.05))", border:"1px solid rgba(251,191,36,0.3)", borderRadius:18, padding:"18px", marginBottom:20, textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:6 }}>⏱️</div>
            <div style={{ fontSize:13, color:"#cbd5e1", lineHeight:1.6 }}>
              60秒間で出来るだけ多くの問題に正解しよう！<br/>
              正解1問につき <span style={{ color:"#FBBF24", fontWeight:800 }}>+2💰</span>、終了時に <span style={{ color:"#FBBF24", fontWeight:800 }}>+3💰×正解数</span>
            </div>
          </div>

          <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:2, fontWeight:700, marginBottom:8 }}>教科を選ぶ</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {GENRES.map(g => {
              const best = taBest[g.id] || 0;
              return (
                <button key={g.id} onClick={() => startTimeAttack(g.id)} style={{
                  background:`linear-gradient(135deg, ${g.color}25, ${g.color}10)`,
                  border:`1.5px solid ${g.color}66`,
                  borderRadius:16, padding:"16px 12px",
                  cursor:"pointer", color:"#fff", textAlign:"left", fontFamily:FONT,
                }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{g.icon}</div>
                  <div style={{ fontSize:14, fontWeight:800, marginBottom:4 }}>{g.label}</div>
                  <div style={{ fontSize:10, color:"#94a3b8" }}>ベスト: <span style={{ color:g.color, fontWeight:800 }}>{best}問</span></div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ TIMEATTACK（プレイ画面） ═══════════════════════ */}
      {screen === S.TIMEATTACK && taCurrentQ && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"20px 16px", animation:"screenEnter 0.4s ease" }}>
          {/* ヘッダー */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"10px 14px" }}>
              <div style={{ fontSize:10, color:"#94a3b8", fontWeight:700, letterSpacing:2 }}>SCORE</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#60A5FA" }}>{taCorrect}<span style={{ fontSize:11, color:"#94a3b8", marginLeft:4 }}>/ {taTotal}問</span></div>
            </div>
            <div style={{
              background: taTimeLeft <= 10 ? "rgba(239,68,68,0.2)" : "rgba(251,191,36,0.15)",
              border: `2px solid ${taTimeLeft <= 10 ? "#EF4444" : "#FBBF24"}`,
              borderRadius:12, padding:"10px 16px",
              animation: taTimeLeft <= 10 ? "monsterHit 0.5s ease infinite" : "none",
            }}>
              <div style={{ fontSize:10, color: taTimeLeft <= 10 ? "#FCA5A5" : "#FBBF24", fontWeight:800, letterSpacing:1 }}>TIME</div>
              <div style={{ fontSize:26, fontWeight:900, color: taTimeLeft <= 10 ? "#EF4444" : "#FBBF24", lineHeight:1 }}>{taTimeLeft}</div>
            </div>
          </div>

          {/* プログレスバー */}
          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:99, height:6, overflow:"hidden", marginBottom:20 }}>
            <div style={{
              width:`${(taTimeLeft/60)*100}%`, height:"100%",
              background: taTimeLeft <= 10 ? "linear-gradient(90deg, #EF4444, #DC2626)" : "linear-gradient(90deg, #FBBF24, #F59E0B)",
              transition:"width 1s linear",
            }}/>
          </div>

          {/* 問題 */}
          <div style={{
            background: taFlash === "correct" ? "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05))" : taFlash === "wrong" ? "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))" : "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))",
            border:`2px solid ${taFlash === "correct" ? "#34D399" : taFlash === "wrong" ? "#EF4444" : "rgba(255,255,255,0.2)"}`,
            borderRadius:18, padding:"24px 18px", marginBottom:14,
            textAlign:"center", minHeight:90,
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.2s",
          }}>
            <p style={{ fontSize:20, fontWeight:800, margin:0, lineHeight:1.5, color:"#fff" }}>{taCurrentQ.q}</p>
          </div>

          {/* 選択肢 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {taCurrentQ.choices.map((c,i) => {
              const ok = i === taCurrentQ.answer, chosen = i === taSelected;
              let bg = "rgba(30,41,59,0.95)", border = "rgba(255,255,255,0.2)", color = "#f8fafc";
              if (taSelected !== null) {
                if (ok) { bg = "rgba(52,211,153,0.3)"; border = "#34D399"; color = "#d1fae5"; }
                else if (chosen) { bg = "rgba(239,68,68,0.3)"; border = "#EF4444"; color = "#fecaca"; }
                else { bg = "rgba(30,41,59,0.5)"; color = "#94a3b8"; }
              }
              return (
                <button key={i} onClick={() => handleTaAnswer(i)} data-sfx="none" disabled={taSelected !== null} style={{
                  background:bg, border:`2px solid ${border}`, borderRadius:14,
                  padding:"16px 10px", cursor:taSelected===null?"pointer":"default",
                  color, fontSize:14, fontWeight:700, fontFamily:FONT,
                  transition:"all 0.2s",
                }}>{c}</button>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ TIMEATTACK_RESULT ═══════════════════════════════ */}
      {screen === S.TIMEATTACK_RESULT && (() => {
        const prevBest = taBest[taGenre] || 0;
        const isNewRecord = taCorrect > prevBest;
        const accuracy = taTotal > 0 ? Math.round((taCorrect/taTotal)*100) : 0;
        const earnedCoins = taCorrect * 3 + taCorrect * 2;
        const gInfo = GENRES.find(g => g.id === taGenre);
        // メダル評価
        let medal = null;
        if (taCorrect >= 20) medal = { icon:"🏆", label:"ゴールド", color:"#FBBF24" };
        else if (taCorrect >= 15) medal = { icon:"🥈", label:"シルバー", color:"#94a3b8" };
        else if (taCorrect >= 10) medal = { icon:"🥉", label:"ブロンズ", color:"#A78BFA" };
        return (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"32px 18px 24px", animation:"popIn 0.5s ease" }}>
          {/* ヘッダー */}
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ fontSize:72, marginBottom:6, animation: isNewRecord ? "monsterFloat 1.5s ease-in-out infinite" : "none" }}>
              {isNewRecord ? "🏆" : medal?.icon || "⏱️"}
            </div>
            {isNewRecord && (
              <div style={{ fontSize:10, color:"#FBBF24", letterSpacing:4, fontWeight:900, marginBottom:6 }}>★ NEW RECORD ★</div>
            )}
            <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 4px", color:"#fff" }}>
              {isNewRecord ? "新記録達成！" : medal ? `${medal.label}メダル！` : "おつかれさま！"}
            </h2>
            <p style={{ color:"#94a3b8", fontSize:12, margin:0 }}>{gInfo?.icon} {gInfo?.label}・タイムアタック</p>
          </div>

          {/* メインスコア */}
          <div style={{
            background:"linear-gradient(135deg, rgba(251,191,36,0.15), rgba(96,165,250,0.08))",
            border:"2px solid rgba(251,191,36,0.4)",
            borderRadius:22, padding:"22px 20px", marginBottom:12, textAlign:"center",
            boxShadow:"0 0 30px rgba(251,191,36,0.2)",
          }}>
            <div style={{ fontSize:10, color:"#64748b", letterSpacing:4, fontWeight:800, marginBottom:4 }}>60秒で解いた数</div>
            <div style={{ fontSize:72, fontWeight:900, color:"#FBBF24", lineHeight:1, textShadow:"0 0 24px rgba(251,191,36,0.5)" }}>{taCorrect}<span style={{ fontSize:20, color:"#94a3b8" }}>/{taTotal}</span></div>
            <div style={{ fontSize:11, color:"#cbd5e1", marginTop:6 }}>正答率 <span style={{ color:"#34D399", fontWeight:900, fontSize:14 }}>{accuracy}%</span></div>
          </div>

          {/* ベスト比較 */}
          <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:12, padding:"10px 14px", marginBottom:12, display:"flex", justifyContent:"space-around", alignItems:"center" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:9, color:"#64748b", fontWeight:700, letterSpacing:2 }}>これまでの最高</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#FBBF24" }}>{Math.max(prevBest, taCorrect)}</div>
            </div>
            <div style={{ width:1, height:32, background:"rgba(255,255,255,0.1)" }}/>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:9, color:"#64748b", fontWeight:700, letterSpacing:2 }}>今回</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#fff" }}>{taCorrect}</div>
            </div>
            {isNewRecord && prevBest > 0 && (
              <>
                <div style={{ width:1, height:32, background:"rgba(255,255,255,0.1)" }}/>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:9, color:"#34D399", fontWeight:700, letterSpacing:2 }}>更新</div>
                  <div style={{ fontSize:22, fontWeight:900, color:"#34D399" }}>+{taCorrect - prevBest}</div>
                </div>
              </>
            )}
          </div>

          {/* 獲得報酬 */}
          <div style={{
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:14, padding:"12px 14px", marginBottom:16,
          }}>
            <div style={{ fontSize:10, color:"#94a3b8", fontWeight:800, letterSpacing:2, marginBottom:8 }}>🎁 獲得報酬</div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#cbd5e1", marginBottom:5 }}>
              <span>💰 コイン</span>
              <span style={{ color:"#FBBF24", fontWeight:900 }}>+{earnedCoins}</span>
            </div>
            {medal && (
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#cbd5e1" }}>
                <span>{medal.icon} メダル</span>
                <span style={{ color: medal.color, fontWeight:900 }}>{medal.label}</span>
              </div>
            )}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10 }}>
            <button onClick={() => startTimeAttack(taGenre)} style={{
              background:"linear-gradient(135deg, #FBBF24, #F59E0B)", border:"none",
              borderRadius:14, padding:"14px", cursor:"pointer", color:"#7c2d12", fontSize:14, fontWeight:800, fontFamily:FONT,
              boxShadow:"0 4px 14px rgba(251,191,36,0.4)",
            }}>もう一度</button>
            <button onClick={() => setScreen(S.HOME)} style={{
              background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:14, padding:"14px", cursor:"pointer", color:"#cbd5e1", fontSize:12, fontWeight:700, fontFamily:FONT,
            }}>ホームへ</button>
          </div>
        </div>
        );
      })()}

      {/* ══ GACHA SPINNING (卵パカッ) ═══════════════════════ */}
      {gachaSpinning && (
        <div style={{
          position:"fixed", inset:0, zIndex:350,
          background:"radial-gradient(circle, rgba(15,23,42,0.95), rgba(0,0,0,0.98))",
          display:"flex", alignItems:"center", justifyContent:"center",
          animation:"screenEnter 0.4s ease",
          overflow:"hidden",
        }}>
          {/* 背景の光線（出現は割れる瞬間） */}
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
            <div key={i} style={{
              position:"absolute", top:"50%", left:"50%",
              width:"3px", height:"200vh",
              background:`linear-gradient(180deg, transparent, ${["#FBBF24","#F472B6","#60A5FA","#A78BFA"][i%4]}, transparent)`,
              transformOrigin:"top",
              transform:`translate(-50%, -50%) rotate(${i * 30}deg)`,
              animation:`gachaBeam 2.8s ease-in-out forwards`,
              opacity:0,
            }}/>
          ))}

          <div style={{ textAlign:"center", position:"relative", zIndex:10 }}>
            <div style={{
              fontSize:11, color:"#FBBF24", letterSpacing:5, fontWeight:800, marginBottom:30,
              animation:"fadeIn 0.5s ease",
            }}>🎰 抽選中...</div>

            {/* 卵本体 */}
            <div style={{ position:"relative", width:180, height:220, margin:"0 auto" }}>
              {/* 卵全体（震えるアニメ） */}
              <div style={{
                position:"absolute", inset:0,
                animation:"eggShake 0.15s ease-in-out infinite, eggGrow 2.8s ease-out forwards",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {/* 卵上半分 */}
                <div style={{
                  position:"absolute", top:"50%", left:"50%",
                  width:140, height:160,
                  transform:"translate(-50%, -75%)",
                  background:"linear-gradient(135deg, #FBBF24, #F59E0B)",
                  borderRadius:"50% 50% 45% 45% / 60% 60% 40% 40%",
                  boxShadow:"inset -10px -10px 20px rgba(0,0,0,0.15), 0 0 40px rgba(251,191,36,0.5)",
                  animation:"eggTopCrack 2.8s ease-in forwards",
                }}>
                  {/* ハイライト */}
                  <div style={{
                    position:"absolute", top:20, left:25,
                    width:30, height:50,
                    background:"rgba(255,255,255,0.5)",
                    borderRadius:"50%",
                    filter:"blur(5px)",
                  }}/>
                </div>
                {/* 卵下半分 */}
                <div style={{
                  position:"absolute", top:"50%", left:"50%",
                  width:140, height:160,
                  transform:"translate(-50%, -25%)",
                  background:"linear-gradient(135deg, #F59E0B, #B45309)",
                  borderRadius:"45% 45% 50% 50% / 40% 40% 60% 60%",
                  boxShadow:"inset -10px -10px 20px rgba(0,0,0,0.2), 0 0 40px rgba(251,191,36,0.5)",
                  animation:"eggBottomCrack 2.8s ease-in forwards",
                }}/>
                {/* ヒビ（時間経過で出現） */}
                <div style={{
                  position:"absolute", top:"50%", left:"50%",
                  transform:"translate(-50%, -50%)",
                  fontSize:80, color:"#0f172a", fontWeight:900,
                  opacity:0,
                  animation:"crackAppear 2.8s ease forwards",
                  zIndex:5,
                  pointerEvents:"none",
                }}>⚡</div>
              </div>

              {/* 殻の破片（割れる瞬間に飛ぶ） */}
              {[0,1,2,3,4,5,6,7].map(i => (
                <div key={"frag"+i} style={{
                  position:"absolute", top:"50%", left:"50%",
                  width:20, height:14,
                  background:"linear-gradient(135deg, #FBBF24, #B45309)",
                  borderRadius:"30%",
                  animation:`fragmentFly 2.8s ease-out forwards`,
                  animationDelay:`${2.0 + i*0.02}s`,
                  transform:`translate(-50%,-50%) rotate(${i*45}deg)`,
                  opacity:0,
                  "--fragX": `${(Math.cos(i * Math.PI / 4)) * 200}px`,
                  "--fragY": `${(Math.sin(i * Math.PI / 4)) * 200}px`,
                  "--fragRot": `${i * 90 + 180}deg`,
                }}/>
              ))}

              {/* 光のフラッシュ（割れる瞬間） */}
              <div style={{
                position:"absolute", top:"50%", left:"50%",
                width:300, height:300,
                transform:"translate(-50%,-50%)",
                background:"radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(251,191,36,0.4) 30%, transparent 70%)",
                borderRadius:"50%",
                animation:"gachaFlash 2.8s ease-out forwards",
                opacity:0,
                pointerEvents:"none",
              }}/>
            </div>

            <div style={{
              fontSize:12, color:"#94a3b8", marginTop:30,
              animation:"fadeIn 0.5s ease",
            }}>何が出るかな...？</div>
          </div>
        </div>
      )}

      {/* ══ STUDY REMINDER ═════════════════════════════════ */}
      {showReminder && (
        <div onClick={() => setShowReminder(false)} style={{
          position:"fixed", inset:0, zIndex:300,
          background:"rgba(0,0,0,0.7)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"24px", animation:"screenEnter 0.4s ease",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background:"linear-gradient(135deg, #A78BFA, #60A5FA)",
            borderRadius:24, padding:"28px 24px",
            maxWidth:340, width:"100%", textAlign:"center",
            animation:"popIn 0.4s ease",
            boxShadow:"0 0 50px rgba(167,139,250,0.5)",
            fontFamily:FONT,
          }}>
            <div style={{ fontSize:64, marginBottom:10, animation:"monsterFloat 2s ease-in-out infinite" }}>📚</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.85)", letterSpacing:4, fontWeight:800, marginBottom:6 }}>STUDY TIME!</div>
            <div style={{ fontSize:20, fontWeight:900, color:"#fff", marginBottom:8 }}>勉強の時間です！</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.85)", marginBottom:20, lineHeight:1.6 }}>
              今日も{petName || "あなた"}と一緒に<br/>
              少しだけ学習を進めよう！
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setShowReminder(false)} style={{
                flex:1, background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.3)",
                borderRadius:12, padding:"12px", cursor:"pointer",
                color:"#fff", fontSize:12, fontWeight:700, fontFamily:FONT,
              }}>あとで</button>
              <button onClick={() => { setShowReminder(false); setScreen(S.HOME); }} style={{
                flex:2, background:"rgba(255,255,255,0.95)", border:"none",
                borderRadius:12, padding:"12px", cursor:"pointer",
                color:"#0f172a", fontSize:13, fontWeight:800, fontFamily:FONT,
                boxShadow:"0 4px 12px rgba(0,0,0,0.2)",
              }}>▶ 始める</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ HISTORY SEARCH MODAL ════════════════════════════ */}
      {showHistorySearch && (
        <div onClick={() => { setShowHistorySearch(false); setSearchQuery(""); }} style={{
          position:"fixed", inset:0, zIndex:300,
          background:"rgba(0,0,0,0.7)",
          display:"flex", alignItems:"flex-start", justifyContent:"center",
          padding:"40px 20px 20px", animation:"fadeIn 0.2s ease",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background:"#0f172a",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:20, padding:"20px 18px",
            maxWidth:420, width:"100%",
            maxHeight:"80vh", display:"flex", flexDirection:"column",
            animation:"popIn 0.3s ease",
            fontFamily:FONT,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:"#f8fafc", flex:1 }}>🔍 問題を検索</h3>
              <button data-sfx="back" onClick={() => { setShowHistorySearch(false); setSearchQuery(""); }} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, width:30, height:30, cursor:"pointer", color:"#cbd5e1",
                fontSize:13, fontFamily:FONT,
              }}>✕</button>
            </div>
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワード（例: 二次関数、源氏、cat...）"
              style={{
                width:"100%", background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(96,165,250,0.4)",
                borderRadius:10, padding:"10px 14px",
                color:"#fff", fontSize:14, fontFamily:FONT, outline:"none",
                marginBottom:10, boxSizing:"border-box",
              }}
            />
            {/* 検索フィルタタブ */}
            <div style={{ display:"flex", gap:6, marginBottom:10 }}>
              {[
                { id:"history", label:"📖 履歴", count: answerHistory.length },
                { id:"bookmark", label:"⭐ ブックマーク", count: bookmarkedQs.length },
                { id:"wrong", label:"✗ 間違いのみ", count: answerHistory.filter(h => !h.correct).length },
              ].map(tab => (
                <button key={tab.id} onClick={() => setSearchFilter(tab.id)} style={{
                  flex:1,
                  background: searchFilter === tab.id ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.04)",
                  border: searchFilter === tab.id ? "1px solid rgba(96,165,250,0.5)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius:8, padding:"6px 4px",
                  cursor:"pointer", color: searchFilter === tab.id ? "#60A5FA" : "#94a3b8",
                  fontSize:10, fontWeight:700, fontFamily:FONT,
                }}>
                  <div>{tab.label}</div>
                  <div style={{ fontSize:8, opacity:0.7 }}>{tab.count}</div>
                </button>
              ))}
            </div>
            <div style={{ fontSize:10, color:"#94a3b8", marginBottom:8 }}>
              {searchFilter === "bookmark" ? `ブックマーク ${bookmarkedQs.length}問` 
               : searchFilter === "wrong" ? `間違えた問題 ${answerHistory.filter(h => !h.correct).length}問`
               : `履歴 ${answerHistory.length}問`}から検索
            </div>
            {/* 結果 */}
            <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:8 }}>
              {(() => {
                const q = searchQuery.toLowerCase().trim();
                let source;
                if (searchFilter === "bookmark") {
                  source = bookmarkedQs.map(b => ({ q: b.q, choices: b.choices, correctIdx: b.answer, chosenIdx: b.answer, correct: true, genre: b.genre }));
                } else if (searchFilter === "wrong") {
                  source = answerHistory.filter(h => !h.correct);
                } else {
                  source = answerHistory;
                }
                if (!q) {
                  if (source.length === 0) {
                    return <div style={{ textAlign:"center", color:"#64748b", padding:"30px 10px", fontSize:12 }}>
                      {searchFilter === "bookmark" ? "⭐ ブックマークがありません" 
                       : searchFilter === "wrong" ? "✨ 間違えた問題がありません" 
                       : "履歴がありません"}
                    </div>;
                  }
                  // キーワード無しなら全件表示（最新30件）
                  const results = source.slice(-30).reverse();
                  return results.map((h, i) => {
                    const gInfo = GENRES.find(g => g.id === h.genre);
                    return (
                      <div key={i} style={{
                        background: h.correct ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)",
                        border: `1px solid ${h.correct ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)"}`,
                        borderRadius:10, padding:"10px 12px",
                      }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                          <span style={{ fontSize:13 }}>{gInfo?.icon}</span>
                          <span style={{ fontSize:9, color: gInfo?.color, fontWeight:800 }}>{gInfo?.label}</span>
                          <span style={{ fontSize:9, color: h.correct ? "#34D399" : "#EF4444", fontWeight:800, marginLeft:"auto" }}>
                            {searchFilter === "bookmark" ? "⭐" : (h.correct ? "✓ 正解" : "✗ 不正解")}
                          </span>
                        </div>
                        <div style={{ fontSize:12, color:"#f8fafc", fontWeight:700, marginBottom:4 }}>{h.q}</div>
                        <div style={{ fontSize:10, color:"#94a3b8" }}>
                          正解: <span style={{ color:"#34D399", fontWeight:700 }}>{h.choices[h.correctIdx]}</span>
                        </div>
                      </div>
                    );
                  });
                }
                const results = source.filter(h =>
                  h.q.toLowerCase().includes(q) ||
                  h.choices.some(c => c.toLowerCase().includes(q))
                ).slice(-30).reverse();
                if (results.length === 0) {
                  return <div style={{ textAlign:"center", color:"#64748b", padding:"30px 10px", fontSize:12 }}>該当する問題が見つかりません</div>;
                }
                return results.map((h, i) => {
                  const gInfo = GENRES.find(g => g.id === h.genre);
                  return (
                    <div key={i} style={{
                      background: h.correct ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)",
                      border: `1px solid ${h.correct ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)"}`,
                      borderRadius:10, padding:"10px 12px",
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        <span style={{ fontSize:13 }}>{gInfo?.icon}</span>
                        <span style={{ fontSize:9, color: gInfo?.color, fontWeight:800 }}>{gInfo?.label}</span>
                        <span style={{ fontSize:9, color: h.correct ? "#34D399" : "#EF4444", fontWeight:800, marginLeft:"auto" }}>
                          {searchFilter === "bookmark" ? "⭐" : (h.correct ? "✓ 正解" : "✗ 不正解")}
                        </span>
                      </div>
                      <div style={{ fontSize:12, color:"#f8fafc", fontWeight:700, marginBottom:4 }}>{h.q}</div>
                      <div style={{ fontSize:10, color:"#94a3b8" }}>
                        正解: <span style={{ color:"#34D399", fontWeight:700 }}>{h.choices[h.correctIdx]}</span>
                        {!h.correct && h.chosenIdx >= 0 && (
                          <> · あなた: <span style={{ color:"#EF4444", fontWeight:700 }}>{h.choices[h.chosenIdx]}</span></>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ══ LOGIN BONUS POPUP ════════════════════════════ */}
      {showLoginBonus && (
        <div onClick={() => setShowLoginBonus(null)} style={{
          position:"fixed", inset:0, zIndex:280,
          background:"rgba(0,0,0,0.75)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"20px", animation:"screenEnter 0.4s ease",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background:`linear-gradient(135deg, ${showLoginBonus.isJackpot ? "#FBBF24" : "#60A5FA"}, ${showLoginBonus.isJackpot ? "#F472B6" : "#A78BFA"})`,
            borderRadius:24, padding:"28px 24px",
            maxWidth:340, width:"100%", textAlign:"center",
            animation:"popIn 0.5s ease",
            boxShadow:`0 0 60px ${showLoginBonus.isJackpot ? "#FBBF24" : "#60A5FA"}88`,
            fontFamily:FONT,
          }}>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.85)", letterSpacing:4, fontWeight:800, marginBottom:6 }}>
              {showLoginBonus.isJackpot ? "🎊 JACKPOT! 🎊" : "DAILY LOGIN"}
            </div>
            <div style={{ fontSize:18, color:"#fff", fontWeight:800, marginBottom:18 }}>
              {showLoginBonus.streak}日連続ログイン！
            </div>
            <div style={{ fontSize:70, marginBottom:10, animation:"monsterFloat 2s ease-in-out infinite" }}>
              {showLoginBonus.isJackpot ? "👑" : showLoginBonus.day >= 5 ? "💎" : "🪙"}
            </div>
            <div style={{ fontSize:38, fontWeight:900, color:"#fff", marginBottom:4, textShadow:"0 2px 4px rgba(0,0,0,0.3)" }}>
              +{showLoginBonus.reward}💰
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.8)", marginBottom:20 }}>
              {showLoginBonus.day}日目の報酬
            </div>
            {/* 7日サイクル可視化 */}
            <div style={{ display:"flex", gap:4, justifyContent:"center", marginBottom:20 }}>
              {[1,2,3,4,5,6,7].map(d => (
                <div key={d} style={{
                  width:30, height:30, borderRadius:"50%",
                  background: d <= showLoginBonus.day ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
                  border: d === showLoginBonus.day ? "2px solid #fff" : "none",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, fontWeight:800, color: d <= showLoginBonus.day ? "#0f172a" : "rgba(255,255,255,0.5)",
                  boxShadow: d === showLoginBonus.day ? "0 0 12px rgba(255,255,255,0.6)" : "none",
                }}>{d === 7 ? "👑" : d}</div>
              ))}
            </div>
            <button onClick={() => setShowLoginBonus(null)} style={{
              width:"100%", background:"rgba(255,255,255,0.95)", border:"none",
              borderRadius:12, padding:"12px",
              cursor:"pointer", color:"#0f172a", fontSize:14, fontWeight:800, fontFamily:FONT,
            }}>受け取る ✨</button>
          </div>
        </div>
      )}

      {/* ══ CONFETTI（勝利の紙吹雪） ════════════════════════ */}
      {confetti && (
        <div style={{ position:"fixed", inset:0, zIndex:500, pointerEvents:"none", overflow:"hidden" }}>
          {[...Array(50)].map((_, i) => {
            const colors = ["#FBBF24","#F472B6","#60A5FA","#34D399","#A78BFA","#EF4444"];
            const c = colors[i % colors.length];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const dur = 2 + Math.random() * 1.5;
            const size = 6 + Math.random() * 8;
            const isCircle = i % 2 === 0;
            return (
              <div key={i} style={{
                position:"absolute", top:"-20px", left:`${left}%`,
                width:size, height: isCircle ? size : size * 1.6,
                background:c, borderRadius: isCircle ? "50%" : "2px",
                animation:`confettiFall ${dur}s ease-in ${delay}s forwards`,
                opacity:0.9,
              }}/>
            );
          })}
        </div>
      )}

      {/* ══ TUTORIAL ════════════════════════════════════════ */}
      {showTutorial && (() => {
        const steps = [
          { icon:"🥚", title:"ようこそStudyumへ！", desc:"クイズで戦って、ペットを育てる学習アプリだよ。正解するとペットが攻撃＆経験値ゲット！" },
          { icon:"📚", title:"教科を選んで対戦", desc:"6教科それぞれに分野がある。好きな分野を選んで「スタート」でバトル開始！AIと4人で競争だ。" },
          { icon:"🐣", title:"ペットが進化する", desc:"勉強してXPを貯めると、たまご→ヒナ→…と進化！得意な教科でペットの姿が変わるよ。" },
          { icon:"🎰", title:"コインでガチャ", desc:"正解やバトル勝利でコインGET。ガチャで帽子・オーラ・称号を集めてペットを着飾ろう！" },
          { icon:"🏆", title:"ランクを上げよう", desc:"ランクマッチで勝つとレートUP。トロフィーやデイリーミッションも挑戦してね。さあ始めよう！" },
        ];
        const step = steps[tutorialStep];
        const isLast = tutorialStep >= steps.length - 1;
        return (
          <div style={{
            position:"fixed", inset:0, zIndex:320,
            background:"rgba(0,0,0,0.8)",
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"24px", animation:"screenEnter 0.4s ease",
          }}>
            <div style={{
              background:"linear-gradient(135deg, #1a1f3a, #0f172a)",
              border:"1px solid rgba(96,165,250,0.3)",
              borderRadius:24, padding:"32px 24px",
              maxWidth:360, width:"100%", textAlign:"center",
              animation:"popIn 0.4s ease",
              boxShadow:"0 0 40px rgba(96,165,250,0.2)",
              fontFamily:FONT,
            }}>
              <div style={{ fontSize:72, marginBottom:16, animation:"monsterFloat 2.5s ease-in-out infinite" }}>{step.icon}</div>
              <h3 style={{ margin:"0 0 12px", fontSize:20, fontWeight:800, color:"#f8fafc" }}>{step.title}</h3>
              <p style={{ fontSize:13, color:"#cbd5e1", lineHeight:1.7, margin:"0 0 24px" }}>{step.desc}</p>
              {/* ドット */}
              <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:20 }}>
                {steps.map((_, i) => (
                  <div key={i} style={{
                    width: i === tutorialStep ? 20 : 8, height:8, borderRadius:99,
                    background: i === tutorialStep ? "#60A5FA" : "rgba(255,255,255,0.2)",
                    transition:"all 0.3s",
                  }}/>
                ))}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {!isLast && (
                  <button onClick={() => { setShowTutorial(false); setTutorialDone(true); }} style={{
                    flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                    borderRadius:12, padding:"12px", cursor:"pointer",
                    color:"#94a3b8", fontSize:13, fontWeight:700, fontFamily:FONT,
                  }}>スキップ</button>
                )}
                <button onClick={() => {
                  if (isLast) { setShowTutorial(false); setTutorialDone(true); }
                  else setTutorialStep(s => s + 1);
                }} style={{
                  flex:2, background:"linear-gradient(135deg, #60A5FA, #818CF8)", border:"none",
                  borderRadius:12, padding:"12px", cursor:"pointer",
                  color:"#fff", fontSize:13, fontWeight:800, fontFamily:FONT,
                  boxShadow:"0 4px 14px rgba(96,165,250,0.4)",
                }}>{isLast ? "始める！ 🚀" : "次へ →"}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ AI TUTOR ════════════════════════════════════════ */}
      {showTutor && (
        <div style={{
          position:"fixed", inset:0, zIndex:280,
          background:"rgba(0,0,0,0.85)",
          display:"flex", alignItems:"flex-end", justifyContent:"center",
          animation:"fadeIn 0.2s ease",
        }}>
          <div style={{
            background:"#0f172a",
            borderTopLeftRadius:24, borderTopRightRadius:24,
            border:"1px solid rgba(167,139,250,0.3)",
            borderBottom:"none",
            maxWidth:440, width:"100%", height:"85vh",
            display:"flex", flexDirection:"column",
            animation:"slideUp 0.3s ease",
            fontFamily:FONT,
          }}>
            {/* ヘッダー */}
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"16px 18px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg, #A78BFA, #818CF8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🤖</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#f8fafc" }}>AI チューター</div>
                <div style={{ fontSize:10, color:"#94a3b8" }}>勉強の疑問を聞いてみよう</div>
              </div>
              <button data-sfx="back" onClick={() => setShowTutor(false)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, width:32, height:32, cursor:"pointer", color:"#cbd5e1",
                fontSize:14, fontFamily:FONT,
              }}>✕</button>
            </div>

            {/* メッセージリスト */}
            <div style={{ flex:1, overflowY:"auto", padding:"16px 18px", display:"flex", flexDirection:"column", gap:12 }}>
              {tutorMessages.length === 0 && (
                <div style={{ textAlign:"center", padding:"30px 10px", color:"#64748b" }}>
                  <div style={{ fontSize:42, marginBottom:10 }}>💡</div>
                  <div style={{ fontSize:13, color:"#cbd5e1", marginBottom:8, fontWeight:700 }}>何でも聞いてね！</div>
                  <div style={{ fontSize:11, lineHeight:1.7 }}>
                    例:<br/>
                    「二次方程式の解の公式を教えて」<br/>
                    「present perfectって何？」<br/>
                    「平安京遷都は何年？」
                  </div>
                </div>
              )}
              {tutorMessages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth:"85%",
                  background: m.role === "user" ? "linear-gradient(135deg, #A78BFA, #818CF8)" : "rgba(255,255,255,0.06)",
                  border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.1)",
                  color: m.role === "user" ? "#fff" : "#f8fafc",
                  borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  padding:"10px 14px",
                  fontSize:13, lineHeight:1.6, fontFamily:FONT,
                  whiteSpace:"pre-wrap",
                }}>{m.content}</div>
              ))}
              {tutorLoading && (
                <div style={{
                  alignSelf:"flex-start", background:"rgba(255,255,255,0.06)",
                  border:"1px solid rgba(255,255,255,0.1)", borderRadius:"14px 14px 14px 4px",
                  padding:"10px 14px", color:"#94a3b8", fontSize:13, fontFamily:FONT,
                }}>
                  <span style={{ animation:"recordingDot 1s ease-in-out infinite" }}>● ● ●</span>
                </div>
              )}
            </div>

            {/* 入力欄 */}
            <div style={{ padding:"12px 14px 18px", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", gap:8 }}>
              <input
                type="text"
                value={tutorInput}
                onChange={(e) => setTutorInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !tutorLoading) askTutor(); }}
                placeholder={offlineMode ? "オフラインでは利用できません" : "質問を入力..."}
                disabled={tutorLoading || offlineMode}
                style={{
                  flex:1, background:"rgba(255,255,255,0.06)",
                  border:"1px solid rgba(167,139,250,0.3)",
                  borderRadius:12, padding:"10px 14px",
                  color:"#fff", fontSize:14, fontFamily:FONT, outline:"none",
                }}
              />
              <button onClick={askTutor} disabled={tutorLoading || !tutorInput.trim() || offlineMode} style={{
                background: (tutorLoading || !tutorInput.trim() || offlineMode) ? "rgba(167,139,250,0.2)" : "linear-gradient(135deg, #A78BFA, #818CF8)",
                border:"none", borderRadius:12, padding:"10px 16px",
                cursor: (tutorLoading || !tutorInput.trim() || offlineMode) ? "not-allowed" : "pointer",
                color:"#fff", fontSize:13, fontWeight:800, fontFamily:FONT,
              }}>送信</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ STUDY GOAL SETTINGS ════════════════════════════ */}
      {showGoalSettings && (() => {
        const presets = [
          { target: 20,  label:"気楽に", desc:"週20問", color:"#34D399" },
          { target: 50,  label:"普通",   desc:"週50問", color:"#60A5FA" },
          { target: 100, label:"頑張る", desc:"週100問", color:"#F472B6" },
          { target: 200, label:"全力",   desc:"週200問", color:"#FBBF24" },
        ];
        // 今週の問題数を集計
        const now = new Date();
        const dayOfWeek = now.getDay();
        const monday = new Date(now); monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); monday.setHours(0,0,0,0);
        const weekStart = monday.getTime();
        const thisWeekCount = answerHistory.filter(h => h.timestamp >= weekStart).length;
        const progress = weeklyGoal.target ? Math.min(100, Math.round((thisWeekCount / weeklyGoal.target) * 100)) : 0;
        return (
          <div onClick={() => setShowGoalSettings(false)} style={{
            position:"fixed", inset:0, zIndex:280,
            background:"rgba(0,0,0,0.7)",
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"24px", animation:"fadeIn 0.2s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background:"#0f172a", border:"1px solid rgba(96,165,250,0.3)",
              borderRadius:20, padding:"22px 20px",
              maxWidth:380, width:"100%",
              animation:"popIn 0.3s ease", fontFamily:FONT,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <span style={{ fontSize:22 }}>🎯</span>
                <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:"#f8fafc", flex:1 }}>学習目標</h3>
                <button data-sfx="back" onClick={() => setShowGoalSettings(false)} style={{
                  background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:10, width:30, height:30, cursor:"pointer", color:"#cbd5e1",
                  fontSize:13, fontFamily:FONT,
                }}>✕</button>
              </div>

              {/* 現在の進捗 */}
              <div style={{ background:"linear-gradient(135deg, rgba(96,165,250,0.15), rgba(167,139,250,0.05))", border:"1px solid rgba(96,165,250,0.3)", borderRadius:12, padding:"14px", marginBottom:16 }}>
                <div style={{ fontSize:10, color:"#94a3b8", marginBottom:6, letterSpacing:2, fontWeight:700 }}>今週の進捗</div>
                <div style={{ fontSize:24, fontWeight:900, color:"#fff", marginBottom:8 }}>
                  {thisWeekCount} <span style={{ fontSize:14, color:"#94a3b8" }}>/ {weeklyGoal.target} 問</span>
                </div>
                <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:99, height:8, overflow:"hidden", marginBottom:4 }}>
                  <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg, ${progress>=100?"#34D399":"#60A5FA"}, ${progress>=100?"#10B981":"#818CF8"})`, transition:"width 0.4s" }}/>
                </div>
                <div style={{ fontSize:11, color: progress>=100 ? "#34D399" : "#94a3b8", fontWeight:700, textAlign:"right" }}>
                  {progress>=100 ? "🎉 目標達成！" : `あと ${weeklyGoal.target - thisWeekCount}問`}
                </div>
              </div>

              <div style={{ fontSize:11, color:"#94a3b8", marginBottom:8, fontWeight:700 }}>週の目標を選ぼう</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                {presets.map(p => {
                  const active = weeklyGoal.target === p.target;
                  return (
                    <button key={p.target} onClick={() => setWeeklyGoal({ target: p.target, week: "" })} style={{
                      background: active ? `${p.color}33` : "rgba(255,255,255,0.04)",
                      border: active ? `1.5px solid ${p.color}` : "1px solid rgba(255,255,255,0.08)",
                      borderRadius:12, padding:"12px 10px", cursor:"pointer",
                      color: active ? p.color : "#cbd5e1", fontFamily:FONT,
                    }}>
                      <div style={{ fontSize:13, fontWeight:800, marginBottom:2 }}>{p.label}</div>
                      <div style={{ fontSize:10, color:"#94a3b8" }}>{p.desc}</div>
                    </button>
                  );
                })}
              </div>
              {/* カスタム目標 */}
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 14px", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:14 }}>✏️</span>
                  <div style={{ fontSize:11, color:"#94a3b8", fontWeight:700, flex:1 }}>カスタム目標</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <input
                    type="number"
                    min="5"
                    max="999"
                    value={weeklyGoal.target}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      if (!isNaN(v) && v >= 5 && v <= 999) {
                        setWeeklyGoal({ target: v, week: "" });
                      }
                    }}
                    style={{
                      flex:1, background:"rgba(0,0,0,0.4)",
                      border:"1.5px solid rgba(96,165,250,0.4)",
                      borderRadius:8, padding:"8px 12px",
                      color:"#fff", fontSize:16, fontWeight:900, textAlign:"center",
                      fontFamily:"monospace", outline:"none",
                    }}
                  />
                  <span style={{ fontSize:12, color:"#94a3b8", fontWeight:700 }}>問/週</span>
                </div>
                <div style={{ fontSize:9, color:"#64748b", marginTop:6, textAlign:"center" }}>
                  5〜999の範囲で設定できます
                </div>
              </div>
              <div style={{ fontSize:10, color:"#64748b", textAlign:"center", lineHeight:1.5 }}>
                目標達成でトロフィー＋200💰ボーナス
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ SETTINGS MODAL ══════════════════════════════════ */}
      {showSettings && (
        <div onClick={() => setShowSettings(false)} style={{
          position:"fixed", inset:0, zIndex:250,
          background:"rgba(0,0,0,0.7)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"20px", animation:"fadeIn 0.2s ease",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background:"#0f172a",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:20, padding:"24px 20px",
            maxWidth:380, width:"100%",
            animation:"popIn 0.3s ease",
            fontFamily:FONT,
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0, fontSize:20, fontWeight:800, color:"#f8fafc" }}>⚙️ 設定</h3>
              <button data-sfx="back" onClick={() => setShowSettings(false)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, width:32, height:32, cursor:"pointer", color:"#cbd5e1",
                fontSize:14, fontFamily:FONT,
              }}>✕</button>
            </div>

            {/* タブ */}
            <div style={{ display:"flex", gap:4, marginBottom:18, background:"rgba(255,255,255,0.04)", padding:3, borderRadius:11 }}>
              {[
                { id:"audio",   icon:"🔊", label:"音" },
                { id:"display", icon:"🎨", label:"外観" },
                { id:"study",   icon:"📚", label:"学習" },
                { id:"account", icon:"👤", label:"アカウント" },
              ].map(t => {
                const active = settingsTab === t.id;
                return (
                  <button key={t.id} onClick={() => setSettingsTab(t.id)} style={{
                    flex:1, background: active ? "rgba(96,165,250,0.2)" : "transparent",
                    border: active ? "1px solid rgba(96,165,250,0.5)" : "1px solid transparent",
                    borderRadius:8, padding:"6px 4px", cursor:"pointer",
                    color: active ? "#60A5FA" : "#94a3b8",
                    fontSize:9, fontWeight:800, fontFamily:FONT,
                    display:"flex", flexDirection:"column", alignItems:"center", gap:2,
                  }}>
                    <span style={{ fontSize:14 }}>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 🔊 音タブ */}
            {settingsTab === "audio" && (<>

            {/* 音量 */}
            <div style={{ marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#cbd5e1" }}>🔊 音量</span>
                <span style={{ fontSize:12, color:"#94a3b8", fontWeight:600 }}>{Math.round(volumeLevel * 100)}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05" value={volumeLevel}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolumeLevel(v);
                  if (typeof window !== "undefined") window.__STUDYUM_VOL = v;
                }}
                style={{ width:"100%", accentColor:"#60A5FA" }}
              />
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#64748b", marginTop:2 }}>
                <span>無音</span>
                <span>最大</span>
              </div>
            </div>

            {/* BGM ON/OFF */}
            <div style={{ marginBottom:20 }}>
              <button onClick={() => {
                const next = !bgmOff;
                setBgmOff(next);
                if (typeof window !== "undefined") window.__STUDYUM_BGM_OFF = next;
                if (next) BGM.stop();
              }} style={{
                width:"100%", background: bgmOff ? "rgba(255,255,255,0.04)" : "rgba(96,165,250,0.12)",
                border:`1.5px solid ${bgmOff ? "rgba(255,255,255,0.1)" : "rgba(96,165,250,0.5)"}`,
                borderRadius:12, padding:"12px 14px", cursor:"pointer",
                color: bgmOff ? "#94a3b8" : "#60A5FA",
                fontFamily:FONT,
                display:"flex", alignItems:"center", justifyContent:"space-between",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>🎵</span>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontSize:13, fontWeight:800 }}>BGM</div>
                    <div style={{ fontSize:9, color:"#94a3b8" }}>ホーム・バトルで音楽を再生</div>
                  </div>
                </div>
                <div style={{ fontSize:12, fontWeight:800 }}>{bgmOff ? "OFF" : "ON"}</div>
              </button>
            </div>

            {/* 触覚フィードバック ON/OFF */}
            <div style={{ marginBottom:20 }}>
              <button onClick={() => {
                const next = !hapticOff;
                setHapticOff(next);
                if (typeof window !== "undefined") window.__STUDYUM_HAPTIC_OFF = next;
                if (!next) HAPTIC.medium(); // ON時にバイブで確認
              }} style={{
                width:"100%", background: hapticOff ? "rgba(255,255,255,0.04)" : "rgba(244,114,182,0.12)",
                border:`1.5px solid ${hapticOff ? "rgba(255,255,255,0.1)" : "rgba(244,114,182,0.5)"}`,
                borderRadius:12, padding:"12px 14px", cursor:"pointer",
                color: hapticOff ? "#94a3b8" : "#F472B6",
                fontFamily:FONT,
                display:"flex", alignItems:"center", justifyContent:"space-between",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>📳</span>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontSize:13, fontWeight:800 }}>触覚フィードバック</div>
                    <div style={{ fontSize:9, color:"#94a3b8" }}>タップ・正解時にバイブ</div>
                  </div>
                </div>
                <div style={{ fontSize:12, fontWeight:800 }}>{hapticOff ? "OFF" : "ON"}</div>
              </button>
            </div>
            </>)}

            {/* 📚 学習タブ */}
            {settingsTab === "study" && (<>
            {/* 難易度 */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#cbd5e1", marginBottom:8 }}>⚔️ 難易度</div>
              <div style={{ display:"flex", gap:6 }}>
                {[
                  { id:"easy",   label:"やさしい", desc:"時間+5秒", color:"#34D399" },
                  { id:"normal", label:"ふつう",   desc:"標準",      color:"#60A5FA" },
                  { id:"hard",   label:"むずかしい",desc:"時間-3秒", color:"#EF4444" },
                ].map(d => (
                  <button key={d.id} onClick={() => setDifficulty(d.id)} style={{
                    flex:1, background: difficulty===d.id ? `${d.color}33` : "rgba(255,255,255,0.04)",
                    border: difficulty===d.id ? `1.5px solid ${d.color}` : "1px solid rgba(255,255,255,0.08)",
                    borderRadius:10, padding:"8px 4px",
                    cursor:"pointer", color: difficulty===d.id ? d.color : "#cbd5e1",
                    fontFamily:FONT,
                  }}>
                    <div style={{ fontSize:11, fontWeight:800 }}>{d.label}</div>
                    <div style={{ fontSize:8, color:"#94a3b8", marginTop:2 }}>{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* SE試聴 */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#cbd5e1", marginBottom:8 }}>🎵 効果音を試す</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
                {[
                  { name:"tap", label:"タップ" },
                  { name:"correct", label:"正解" },
                  { name:"victory", label:"勝利" },
                ].map(s => (
                  <button key={s.name} onClick={() => SFX[s.name]()} data-sfx="none" style={{
                    background:"rgba(96,165,250,0.1)", border:"1px solid rgba(96,165,250,0.3)",
                    borderRadius:8, padding:"6px", cursor:"pointer",
                    color:"#93C5FD", fontSize:11, fontWeight:700, fontFamily:FONT,
                  }}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* オフラインモード */}
            <div style={{ marginBottom:20 }}>
              <button onClick={() => setOfflineMode(m => !m)} style={{
                width:"100%",
                background: offlineMode ? "linear-gradient(135deg, rgba(148,163,184,0.2), rgba(100,116,139,0.1))" : "rgba(255,255,255,0.04)",
                border: `1px solid ${offlineMode ? "rgba(148,163,184,0.5)" : "rgba(255,255,255,0.08)"}`,
                borderRadius:12, padding:"12px 14px",
                cursor:"pointer", color:"#f8fafc", fontFamily:FONT,
                display:"flex", alignItems:"center", gap:12,
              }}>
                <div style={{ fontSize:22 }}>{offlineMode ? "📵" : "📶"}</div>
                <div style={{ flex:1, textAlign:"left" }}>
                  <div style={{ fontSize:13, fontWeight:800, marginBottom:2 }}>
                    オフラインモード {offlineMode && <span style={{ fontSize:10, color:"#94a3b8" }}>ON</span>}
                  </div>
                  <div style={{ fontSize:10, color:"#94a3b8", lineHeight:1.4 }}>
                    {offlineMode
                      ? "ランクマッチ・AI機能を無効化"
                      : "ネットなしでも遊べる設定"}
                  </div>
                </div>
                {/* トグルスイッチ */}
                <div style={{
                  width:42, height:24,
                  background: offlineMode ? "#60A5FA" : "rgba(255,255,255,0.15)",
                  borderRadius:99, position:"relative",
                  transition:"background 0.2s",
                }}>
                  <div style={{
                    position:"absolute", top:2, left: offlineMode ? 20 : 2,
                    width:20, height:20, borderRadius:"50%",
                    background:"#fff",
                    transition:"left 0.2s",
                    boxShadow:"0 2px 4px rgba(0,0,0,0.3)",
                  }}/>
                </div>
              </button>
              {offlineMode && (
                <div style={{ fontSize:10, color:"#94a3b8", marginTop:6, padding:"6px 10px", background:"rgba(148,163,184,0.1)", borderRadius:8, lineHeight:1.5 }}>
                  📵 オフライン中:<br/>
                  • ランクマッチ・写真AI出題・AI診断 利用不可<br/>
                  • ソロバトル・エンドレス・タイムアタック・ガチャ・復習はOK
                </div>
              )}
            </div>

            {/* テーマ切替 */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#cbd5e1", marginBottom:8 }}>🎨 テーマ</div>
              {/* Auto モード（端末設定追従） */}
              <button onClick={() => setTheme("auto")} style={{
                width:"100%", marginBottom:6,
                background: theme === "auto" ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.04)",
                border: theme === "auto" ? "1.5px solid rgba(167,139,250,0.6)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius:10, padding:"10px 12px",
                cursor:"pointer", color: theme === "auto" ? "#A78BFA" : "#cbd5e1",
                fontFamily:FONT,
                display:"flex", alignItems:"center", gap:8,
              }}>
                <span style={{ fontSize:20 }}>🌗</span>
                <div style={{ flex:1, textAlign:"left" }}>
                  <div style={{ fontSize:12, fontWeight:800 }}>自動（端末設定に合わせる）</div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>現在: {systemDark ? "🌙 ダーク" : "☀️ ライト"}</div>
                </div>
                {theme === "auto" && <span style={{ fontSize:11, color:"#A78BFA" }}>✓</span>}
              </button>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {Object.values(THEMES).map(t => {
                  const active = theme === t.id;
                  return (
                    <button key={t.id} onClick={() => setTheme(t.id)} style={{
                      background: active ? `${t.accent}33` : "rgba(255,255,255,0.04)",
                      border: active ? `1.5px solid ${t.accent}` : "1px solid rgba(255,255,255,0.08)",
                      borderRadius:10, padding:"10px 8px",
                      cursor:"pointer", color: active ? t.accent : "#cbd5e1",
                      fontFamily:FONT,
                      display:"flex", alignItems:"center", gap:8,
                    }}>
                      <span style={{ fontSize:20 }}>{t.icon}</span>
                      <div style={{ flex:1, textAlign:"left" }}>
                        <div style={{ fontSize:11, fontWeight:800 }}>{t.label}</div>
                      </div>
                      {active && <span style={{ fontSize:11, color:t.accent }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* スケジュール（勉強リマインダー） */}
            <div style={{ marginBottom:20 }}>
              <button onClick={async () => {
                const next = !reminderEnabled;
                if (next) {
                  // 通知許可を求める
                  const granted = await requestNotificationPermission();
                  if (!granted) {
                    alert("⚠️ 通知の許可がありません\n\nブラウザの設定で通知を許可するとリマインダーが動きます");
                  }
                }
                setReminderEnabled(next);
              }} style={{
                width:"100%",
                background: reminderEnabled ? "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(96,165,250,0.1))" : "rgba(255,255,255,0.04)",
                border: `1px solid ${reminderEnabled ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.08)"}`,
                borderRadius:12, padding:"12px 14px",
                cursor:"pointer", color:"#f8fafc", fontFamily:FONT,
                display:"flex", alignItems:"center", gap:12,
              }}>
                <div style={{ fontSize:22 }}>⏰</div>
                <div style={{ flex:1, textAlign:"left" }}>
                  <div style={{ fontSize:13, fontWeight:800, marginBottom:2 }}>
                    勉強リマインダー {reminderEnabled && <span style={{ fontSize:10, color:"#A78BFA" }}>ON</span>}
                  </div>
                  <div style={{ fontSize:10, color:"#94a3b8", lineHeight:1.4 }}>
                    {reminderEnabled ? `毎日 ${reminderTime || "未設定"} に通知` : "毎日決まった時間に勉強リマインド"}
                  </div>
                </div>
                <div style={{
                  width:42, height:24,
                  background: reminderEnabled ? "#A78BFA" : "rgba(255,255,255,0.15)",
                  borderRadius:99, position:"relative",
                  transition:"background 0.2s",
                }}>
                  <div style={{
                    position:"absolute", top:2, left: reminderEnabled ? 20 : 2,
                    width:20, height:20, borderRadius:"50%",
                    background:"#fff",
                    transition:"left 0.2s",
                    boxShadow:"0 2px 4px rgba(0,0,0,0.3)",
                  }}/>
                </div>
              </button>
              {reminderEnabled && (
                <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:10 }}>
                  <span style={{ fontSize:11, color:"#cbd5e1", fontWeight:700 }}>時刻</span>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    style={{
                      flex:1, background:"rgba(0,0,0,0.3)",
                      border:"1px solid rgba(167,139,250,0.4)",
                      borderRadius:8, padding:"6px 10px",
                      color:"#fff", fontSize:14, fontWeight:700,
                      fontFamily:FONT, outline:"none",
                    }}
                  />
                  <span style={{ fontSize:9, color:"#94a3b8" }}>毎日</span>
                </div>
              )}
            </div>
            </>)}

            {/* 🎨 外観タブ */}
            {settingsTab === "display" && (<>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#cbd5e1", marginBottom:8 }}>🎨 テーマ</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {Object.values(THEMES).map(t => {
                  const active = theme === t.id;
                  return (
                    <button key={t.id} onClick={() => setTheme(t.id)} style={{
                      background: active ? `${t.accent}30` : "rgba(255,255,255,0.04)",
                      border: active ? `1.5px solid ${t.accent}` : "1px solid rgba(255,255,255,0.08)",
                      borderRadius:10, padding:"10px 12px", cursor:"pointer",
                      color: active ? t.accent : "#cbd5e1",
                      fontFamily:FONT, display:"flex", alignItems:"center", gap:8,
                    }}>
                      <span style={{ fontSize:18 }}>{t.icon}</span>
                      <span style={{ fontSize:12, fontWeight:800 }}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize:9, color:"#64748b", marginTop:6, textAlign:"center" }}>
                テーマは背景色を変えます
              </div>
            </div>
            </>)}

            {/* 👤 アカウントタブ */}
            {settingsTab === "account" && (<>
            {/* プライバシー */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#cbd5e1", marginBottom:8 }}>🔐 プロフィール公開</div>
              <div style={{ display:"flex", gap:6 }}>
                {[
                  { id:"public",  label:"🌍 全員" },
                  { id:"friends", label:"👥 友達" },
                  { id:"private", label:"🔒 非公開" },
                ].map(opt => (
                  <button key={opt.id} onClick={() => setProfilePrivacy(opt.id)} style={{
                    flex:1, background: profilePrivacy===opt.id ? "linear-gradient(135deg, #60A5FA, #818CF8)" : "rgba(255,255,255,0.04)",
                    border: profilePrivacy===opt.id ? "none" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius:8, padding:"8px 4px",
                    cursor:"pointer", color: profilePrivacy===opt.id ? "#fff" : "#cbd5e1",
                    fontSize:10, fontWeight:700, fontFamily:FONT,
                  }}>{opt.label}</button>
                ))}
              </div>
            </div>

            {/* アカウント情報 */}
            <div style={{ marginBottom:20, padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10, fontSize:11, color:"#94a3b8" }}>
              <div style={{ marginBottom:4 }}>📊 解答した問題数: <span style={{ color:"#cbd5e1", fontWeight:700 }}>{answerHistory.length}</span></div>
              <div style={{ marginBottom:4 }}>🏆 解除トロフィー: <span style={{ color:"#cbd5e1", fontWeight:700 }}>{unlockedTrophies.length}/{TROPHIES.length}</span></div>
              <div>🐾 発見ペット: <span style={{ color:"#cbd5e1", fontWeight:700 }}>{unlockedPets.length}/18</span></div>
            </div>

            {/* データバックアップ */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:"#94a3b8", letterSpacing:2, fontWeight:800, marginBottom:6 }}>💾 データバックアップ</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:6 }}>
                <button onClick={() => {
                  // 全データをJSONで出力
                  const exportData = {
                    version: "1.0",
                    exportedAt: new Date().toISOString(),
                    petName, starterEgg, genreXp, coins, maxCoins,
                    ownedItems, unlockedPets, unlockedTrophies,
                    userRating, maxRating, bestWinStreak, maxCorrectStreak,
                    missionProgress, claimedMissions, endlessBest, taBest,
                    answerHistory, profilePrivacy, loginStreak,
                    selectedGrade, studyMode, questionCount,
                    bookmarkedQs, studyTimeByDate, xpHistoryByDate,
                    myFriendCode, myFriends, bossWeeklyDefeated,
                    freeGachaDate, gachaPity, theme, difficulty,
                    weeklyGoal, selectedTitle,
                  };
                  const json = JSON.stringify(exportData, null, 2);
                  const blob = new Blob([json], { type:"application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `studyum_backup_${new Date().toISOString().slice(0,10)}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  SFX.levelUp();
                }} style={{
                  background:"rgba(96,165,250,0.12)", border:"1px solid rgba(96,165,250,0.4)",
                  borderRadius:10, padding:"10px 6px", cursor:"pointer",
                  color:"#60A5FA", fontSize:11, fontWeight:800, fontFamily:FONT,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:4,
                }}>📥 書き出し</button>
                <button onClick={() => {
                  // ファイル選択で読み込み
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "application/json,.json";
                  input.onchange = (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const data = JSON.parse(ev.target.result);
                        if (!data.version) {
                          alert("⚠️ このファイルはStudyumのバックアップではありません");
                          return;
                        }
                        if (!confirm("現在のデータを上書きします。よろしいですか？")) return;
                        // 復元
                        if (data.petName) setPetName(data.petName);
                        if (data.starterEgg) setStarterEgg(data.starterEgg);
                        if (data.genreXp) setGenreXp(data.genreXp);
                        if (typeof data.coins === "number") setCoins(data.coins);
                        if (typeof data.maxCoins === "number") setMaxCoins(data.maxCoins);
                        if (data.ownedItems) setOwnedItems(data.ownedItems);
                        if (data.unlockedPets) setUnlockedPets(data.unlockedPets);
                        if (data.unlockedTrophies) setUnlockedTrophies(data.unlockedTrophies);
                        if (typeof data.userRating === "number") setUserRating(data.userRating);
                        if (typeof data.maxRating === "number") setMaxRating(data.maxRating);
                        if (typeof data.bestWinStreak === "number") setBestWinStreak(data.bestWinStreak);
                        if (data.endlessBest) setEndlessBest(data.endlessBest);
                        if (data.taBest) setTaBest(data.taBest);
                        if (data.answerHistory) setAnswerHistory(data.answerHistory);
                        if (data.bookmarkedQs) setBookmarkedQs(data.bookmarkedQs);
                        if (data.studyTimeByDate) setStudyTimeByDate(data.studyTimeByDate);
                        if (data.myFriendCode) setMyFriendCode(data.myFriendCode);
                        if (data.myFriends) setMyFriends(data.myFriends);
                        if (data.theme) setTheme(data.theme);
                        if (typeof data.difficulty === "number") setDifficulty(data.difficulty);
                        SFX.levelUp();
                        setTimeout(() => alert("✅ データを復元しました！"), 100);
                      } catch (err) {
                        console.error("Import error:", err);
                        alert("⚠️ ファイルの読み込みに失敗しました。\n破損している可能性があります。");
                      }
                    };
                    reader.readAsText(file);
                  };
                  input.click();
                }} style={{
                  background:"rgba(167,139,250,0.12)", border:"1px solid rgba(167,139,250,0.4)",
                  borderRadius:10, padding:"10px 6px", cursor:"pointer",
                  color:"#A78BFA", fontSize:11, fontWeight:800, fontFamily:FONT,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:4,
                }}>📤 読み込み</button>
              </div>
              <div style={{ fontSize:9, color:"#64748b", textAlign:"center", lineHeight:1.5 }}>
                💡 機種変更時にデータを引き継げます<br/>
                書き出したファイルは大切に保管してください
              </div>
            </div>

            {/* データリセット */}
            <div style={{ marginBottom:8 }}>
              {!confirmReset ? (
                <button onClick={() => setConfirmReset(true)} style={{
                  width:"100%", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
                  borderRadius:10, padding:"10px", cursor:"pointer",
                  color:"#FCA5A5", fontSize:12, fontWeight:700, fontFamily:FONT,
                }}>🗑️ データをリセット</button>
              ) : (
                <div style={{ padding:"12px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:10 }}>
                  <div style={{ fontSize:11, color:"#FCA5A5", marginBottom:8, fontWeight:700, textAlign:"center" }}>
                    本当にすべてのデータをリセットしますか？<br/>この操作は取り消せません。
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={() => setConfirmReset(false)} style={{
                      flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:8, padding:"8px", cursor:"pointer",
                      color:"#cbd5e1", fontSize:11, fontWeight:700, fontFamily:FONT,
                    }}>キャンセル</button>
                    <button onClick={() => {
                      // すべてリセット
                      setGenreXp({ english:0, math:0, japanese:0, social:0, science:0, history:0 });
                      setCoins(150); setMaxCoins(150);
                      setOwnedItems([]); setEquippedHat(null); setEquippedAura(null); setEquippedTitle(null);
                      setUserRating(1240); setMaxRating(1240);
                      setWinStreak(0); setBestWinStreak(0);
                      setUnlockedPets([]); setUnlockedTrophies([]);
                      setMissionProgress({}); setClaimedMissions([]);
                      setEndlessBest({ english_words:0, kanji:0, yojijukugo:0, math_calc:0, capitals:0 });
                      setAnswerHistory([]); setAiAnalysis(null);
                      setLastLoginDate(null); setLoginStreak(0);
                      setPetName(""); setProfilePrivacy("public");
                      setConfirmReset(false); setShowSettings(false);
                      setScreen(S.ONBOARDING);
                      setStarterEgg(null);
                    }} style={{
                      flex:1, background:"#EF4444", border:"none",
                      borderRadius:8, padding:"8px", cursor:"pointer",
                      color:"#fff", fontSize:11, fontWeight:800, fontFamily:FONT,
                    }}>削除する</button>
                  </div>
                </div>
              )}
            </div>
            </>)}

            {/* ヘルプセンター（どのタブでも表示） */}
            <button onClick={() => { setShowSettings(false); setShowHelpCenter(true); }} style={{
              width:"100%", marginTop:14,
              background:"linear-gradient(135deg, rgba(96,165,250,0.12), rgba(167,139,250,0.06))",
              border:"1px solid rgba(96,165,250,0.3)", borderRadius:12, padding:"10px",
              cursor:"pointer", color:"#60A5FA", fontSize:12, fontWeight:800, fontFamily:FONT,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            }}>
              <span style={{ fontSize:16 }}>❓</span>
              <span>ヘルプセンター・FAQ</span>
            </button>

            <div style={{ fontSize:9, color:"#64748b", textAlign:"center", marginTop:12 }}>
              Studyum v1.0 — Made with care 💝
            </div>
          </div>
        </div>
      )}

      {/* ══ TITLE UNLOCK TOAST（フルスクリーン演出版） ════ */}
      {titleUnlockToast && (
        <div style={{
          position:"fixed", inset:0, zIndex:400,
          background:"rgba(0,0,0,0.7)",
          display:"flex", alignItems:"center", justifyContent:"center",
          animation:"fadeIn 0.3s ease",
          pointerEvents:"none",
        }}>
          {/* 背景の光の輪 */}
          <div style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%, -50%)",
            width:500, height:500,
            background: `radial-gradient(circle, ${titleUnlockToast.color}55 0%, transparent 60%)`,
            animation:"titleGlow 2s ease-in-out infinite",
          }}/>
          
          {/* キラキラ装飾 8個 */}
          {Array.from({length: 8}).map((_, i) => {
            const angle = (i * 45);
            return (
              <div key={i} style={{
                position:"absolute", top:"50%", left:"50%",
                width:4, height:60,
                background:`linear-gradient(180deg, ${titleUnlockToast.color}, transparent)`,
                transformOrigin:"50% 0",
                transform:`rotate(${angle}deg) translateY(80px)`,
                animation:"titleRay 1.5s ease-out forwards",
                animationDelay:`${0.3 + i*0.05}s`,
                opacity:0,
              }}/>
            );
          })}
          
          {/* メインカード */}
          <div style={{
            position:"relative",
            background:`linear-gradient(135deg, ${titleUnlockToast.color}, ${shade(titleUnlockToast.color, -30)})`,
            color:"#0f172a", padding:"30px 36px", borderRadius:24,
            boxShadow:`0 0 80px ${titleUnlockToast.color}, 0 12px 40px rgba(0,0,0,0.5)`,
            textAlign:"center", fontFamily:FONT,
            border:"3px solid rgba(255,255,255,0.5)",
            animation:"titleUnlockPop 0.6s ease-out",
            maxWidth:340,
          }}>
            <div style={{ fontSize:9, fontWeight:900, opacity:0.7, letterSpacing:4, marginBottom:8 }}>
              ★ TITLE UNLOCKED ★
            </div>
            <div style={{
              fontSize:80, marginBottom:8,
              animation:"titleIconBounce 1s ease-out, monsterFloat 2s ease-in-out 1s infinite",
              filter:`drop-shadow(0 0 24px ${titleUnlockToast.color})`,
            }}>{titleUnlockToast.icon}</div>
            <div style={{
              fontSize:11, fontWeight:900, letterSpacing:3, marginBottom:4,
              opacity:0.7,
            }}>🏷️ 新しい称号を獲得</div>
            <div style={{
              fontSize:24, fontWeight:900, marginBottom:6,
              textShadow:"0 2px 8px rgba(0,0,0,0.2)",
            }}>{titleUnlockToast.label}</div>
            <div style={{ fontSize:11, opacity:0.8, marginBottom:10, lineHeight:1.5 }}>
              {titleUnlockToast.desc}
            </div>
            <div style={{
              display:"inline-block",
              background:"rgba(0,0,0,0.3)",
              padding:"6px 14px", borderRadius:99,
              fontSize:12, fontWeight:900,
              color:"#FBBF24",
            }}>+50💰 ボーナス</div>
          </div>
        </div>
      )}

      {/* ══ COMBO POPUP ════════════════════════════════════ */}
      {comboPopup && (
        <div style={{
          position:"fixed", top:"35%", left:"50%", transform:"translate(-50%, -50%)",
          zIndex:220, pointerEvents:"none",
          animation:"comboPopup 1.8s ease forwards",
        }}>
          <div style={{
            background: comboPopup.count >= 10 ? "linear-gradient(135deg, #FBBF24, #EF4444)" 
                      : comboPopup.count >= 5  ? "linear-gradient(135deg, #F472B6, #A78BFA)"
                      :                          "linear-gradient(135deg, #60A5FA, #34D399)",
            color:"#fff", padding:"16px 24px", borderRadius:20,
            textAlign:"center", fontFamily:FONT,
            boxShadow:`0 0 40px ${comboPopup.count >= 10 ? "#FBBF24" : comboPopup.count >= 5 ? "#F472B6" : "#60A5FA"}aa`,
            border:"2px solid rgba(255,255,255,0.4)",
          }}>
            <div style={{ fontSize:10, letterSpacing:4, fontWeight:900, opacity:0.9, marginBottom:4 }}>
              {comboPopup.count >= 10 ? "✨ AMAZING ✨" : comboPopup.count >= 5 ? "🔥 GREAT 🔥" : "⚡ NICE ⚡"}
            </div>
            <div style={{ fontSize:36, fontWeight:900, lineHeight:1, marginBottom:6 }}>
              {comboPopup.count} <span style={{ fontSize:18 }}>COMBO!</span>
            </div>
            <div style={{ fontSize:11, fontWeight:800, opacity:0.95 }}>
              +{comboPopup.coins}💰 +{comboPopup.xp}✨
            </div>
          </div>
        </div>
      )}

      {/* ══ TROPHY TOAST ══════════════════════════════════ */}
      {trophyToast && (
        <div style={{
          position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
          zIndex:200, animation:"toastSlide 0.4s ease",
          background: `linear-gradient(135deg, ${RARITY_COLORS[trophyToast.rare]}, ${shade(RARITY_COLORS[trophyToast.rare], -25)})`,
          color:"#0f172a", padding:"14px 22px", borderRadius:18,
          boxShadow:`0 8px 32px ${RARITY_COLORS[trophyToast.rare]}88`,
          display:"flex", alignItems:"center", gap:14,
          fontFamily:FONT, maxWidth:360,
        }}>
          <div style={{ fontSize:36 }}>{trophyToast.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:800, letterSpacing:2, opacity:0.7, marginBottom:2 }}>
              🏆 トロフィー獲得！
            </div>
            <div style={{ fontSize:15, fontWeight:800, marginBottom:2 }}>
              {trophyToast.title}
            </div>
            <div style={{ fontSize:10, opacity:0.7 }}>+50💰 ボーナス</div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

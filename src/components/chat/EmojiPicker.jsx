import React, { useState } from "react";

const EMOJIS = {
  "😊 Smileys": ["😀","😁","😂","🤣","😃","😄","😅","😆","😊","😋","😎","😍","🥰","😘","🤩","😇","🙂","😉","😌","🥹","😏","😒","😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🫡","🤔","🤫","🫢","🤭","🧐","🤓","😜","🤪","😝","🤑","🤗","😷","🤒","🤕","🤧","🥴","😵","💫","🤠","🥸","🤡","👻","💀","☠️","👽","👾"],
  "👋 Gestures": ["👍","👎","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👋","🤚","🖐️","✋","🖖","🤜","🤛","👊","✊","🙌","👏","🫶","🤲","🙏","💪","🦾","🦿","🦵","🦶","✍️"],
  "❤️ Hearts":  ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","❤️‍🔥","❤️‍🩹","💔","💕","💞","💓","💗","💖","💘","💝","💟","♥️","💌","🫀","💋","💍","💎"],
  "🌿 Nature":  ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧","🐦","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🌸","🌺","🌻","🌹","🌷","🌱","🌿","🍀","🎋","🎍","🍃","🍂","🍁","🌾","🌵","🌴","🌲","🌳","🌞","🌝","🌛","🌜","⭐","🌟","✨","⚡","❄️","🔥","💧","🌊"],
  "🍕 Food":    ["🍕","🍔","🍟","🌭","🍿","🧂","🥓","🥚","🍳","🧇","🥞","🧈","🍞","🥐","🥨","🧀","🥗","🥙","🌮","🌯","🫔","🥫","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🥠","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧃","☕","🧋","🍵"],
  "⚽ Activities":["⚽","🏀","🏈","⚾","🎾","🏐","🏉","🎱","🏓","🏸","🥊","🥅","⛳","🏹","🎣","🤿","🎽","🎿","🛷","🥌","🎯","🎮","🎲","🧩","🎭","🎨","🖼️","🎬","🎤","🎧","🎼","🎵","🎶","🎷","🎸","🎹","🥁","🎺","🪕","🎻","🪗","🎙️","📺","📻","🎤","🏆","🥇","🥈","🥉","🏅","🎖️","🎗️","🎟️","🎫"]
};

export default function EmojiPicker({ onSelect }) {
  const [cat, setCat] = useState(Object.keys(EMOJIS)[0]);
  return (
    <div className="absolute bottom-14 right-0 w-72 bg-[#1c1e26] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden">
      {/* category tabs */}
      <div className="flex overflow-x-auto border-b border-white/5 px-1 pt-1 gap-0.5 scrollbar-none">
        {Object.keys(EMOJIS).map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`shrink-0 px-2 py-1.5 rounded-lg text-base transition-all ${
              cat === c ? "bg-blue-600/30 text-blue-300" : "hover:bg-white/5 text-gray-500 hover:text-gray-300"
            }`}>
            {c.split(" ")[0]}
          </button>
        ))}
      </div>
      {/* grid */}
      <div className="grid grid-cols-8 gap-0.5 p-2 max-h-52 overflow-y-auto" style={{scrollbarWidth:"thin",scrollbarColor:"#ffffff10 transparent"}}>
        {EMOJIS[cat].map((em) => (
          <button key={em} onClick={() => onSelect(em)}
            className="w-8 h-8 flex items-center justify-center text-xl rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            {em}
          </button>
        ))}
      </div>
    </div>
  );
}

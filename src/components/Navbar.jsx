import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <div className="navbar px-6 md:px-10 border-b border-white/10 bg-[#111418] z-20 min-h-[64px]">
      <div className="navbar-start gap-3">
        <div className="flex items-end gap-[3px] h-[22px]">
          <span className="w-1 h-[14px] rounded-sm bg-[#e84040] inline-block" />
          <span className="w-1 h-[18px] rounded-sm bg-[#f0a020] inline-block" />
          <span className="w-1 h-[10px] rounded-sm bg-[#60d0a0] inline-block" />
          <span className="w-1 h-[22px] rounded-sm bg-[#5080e0] inline-block" />
        </div>
        <span
          className="font-rajdhani text-xl font-bold tracking-widest text-white border border-[#5080e0] px-2 py-0.5 cursor-pointer"
          onClick={() => navigate('/')}
        >
          4B1K
        </span>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 text-sm text-white/70">
          <li><a className="hover:text-white hover:bg-white/5 rounded-lg">Concert Event</a></li>
          <li>
            <details>
              <summary className="hover:text-white hover:bg-white/5 rounded-lg">Artist Biology</summary>
              <ul className="bg-[#1a1e24] border border-white/10 rounded-lg mt-1 w-40 z-30">
                <li><a className="text-sm hover:bg-white/10">K-Pop Artists</a></li>
                <li><a className="text-sm hover:bg-white/10">Indie Artists</a></li>
                <li><a className="text-sm hover:bg-white/10">All Artists</a></li>
              </ul>
            </details>
          </li>
          <li><a className="hover:text-white hover:bg-white/5 rounded-lg">Community</a></li>
          <li><a className="hover:text-white hover:bg-white/5 rounded-lg">News</a></li>
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <button
          className="btn btn-sm btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white hidden sm:flex"
          onClick={() => navigate('/login')}
        >
          Log In
        </button>
        <button
          className="btn btn-sm text-[#1a2a1a] font-medium hidden sm:flex"
          style={{ background: 'linear-gradient(135deg, #a8e060, #60d0a0)', border: 'none' }}
          onClick={() => navigate('/register')}
        >
          Register
        </button>
        <div className="flex items-center gap-1 text-xs text-white/50 ml-1 hidden sm:flex">
          🌐 EN
        </div>
      </div>
    </div>
  )
}
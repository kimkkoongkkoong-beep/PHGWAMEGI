import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Menu, X, Instagram, MessageCircle, 
  ShieldCheck, MapPin, Map as MapIcon, 
  Sparkles, Users, Shield, MessageSquare, AlertTriangle,
  ChevronRight, Navigation, Info
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- [데이터 정의 영역] ---
const CLUB_NAME = "포항과메기라이더스";
const OPEN_CHAT_URL = "https://open.kakao.com/o/pgJRW5di";
const INSTAGRAM_URL = "https://www.instagram.com/pohang_gwamegi_riders";

const RULES = [
  { id: '1', title: '상호 존중', desc: '나이, 기종 관계없이 존댓말 사용 및 예의 준수', icon: Users },
  { id: '2', title: '정치/종교 언급 금지', desc: '분쟁 소지가 있는 민감한 주제 언급 자제', icon: MessageSquare },
  { id: '3', title: '클린 채팅', desc: '욕설, 비방, 도배 금지 (위반 시 즉시 강퇴)', icon: Shield }
];

const TOUR_TIPS = [
  "집결 시간 10분 전 도착 엄수",
  "출발 전 연료 가득 채우기",
  "대열 주행 시 추월 절대 금지",
  "헬멧 및 안전 보호구 필수 착용",
  "로드마스터 수신호 및 지시 준수",
  "투어 중 위치 공유(카카오맵) 확인"
];

// --- [메인 애플리케이션 컴포넌트] ---
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 스크롤 감지 및 상단바 상태 변경
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 특정 섹션으로 부드럽게 스크롤
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // AI 가이드 핸들러 (안전한 API 호출)
  const handleAskAi = async () => {
    if (!aiMessage.trim()) return;
    setIsAiThinking(true);
    try {
      // 런타임 에러 방지를 위해 window 객체에서 안전하게 가져옴
      const apiKey = (window as any).process?.env?.API_KEY || "";
      if (!apiKey) {
        alert("AI 가이드 이용을 위해 API 키 설정이 필요합니다.");
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `질문: ${aiMessage}. 당신은 '포항과메기라이더스' 바이크 크루의 명예 회원입니다. 포항의 라이딩 코스나 맛집, 안전 규칙에 대해 경상도 사투리로 아주 씩씩하고 위트 있게 답변해주세요.`,
      });
      
      alert(response.text);
    } catch (error) {
      console.error("AI Error:", error);
      alert("AI 라이더가 투어 중이라 응답을 못 하네요! 잠시 후 다시 물어봐주이소!");
    } finally {
      setIsAiThinking(false);
      setAiMessage('');
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-900 text-slate-100 selection:bg-orange-500/30">
      
      {/* 1. 상단 네비게이션 */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 flex justify-between items-center ${scrolled ? 'glass-morphism shadow-2xl py-3' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
          <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center font-black text-white italic shadow-lg rotate-3">P</div>
          <span className="font-extrabold tracking-tighter text-xl uppercase">Gwamegi <span className="text-orange-500 italic">Riders</span></span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-300 active:scale-90 transition-transform">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* 2. 메뉴 오버레이 */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/98 flex flex-col items-center justify-center gap-10 p-10 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          <button onClick={() => scrollToSection('home')} className="text-4xl font-black italic tracking-tight hover:text-orange-500 transition-colors uppercase">Home</button>
          <button onClick={() => scrollToSection('rules')} className="text-4xl font-black italic tracking-tight hover:text-orange-500 transition-colors uppercase">Rules</button>
          <button onClick={() => scrollToSection('map')} className="text-4xl font-black italic tracking-tight hover:text-orange-500 transition-colors uppercase">Map</button>
          <a href={OPEN_CHAT_URL} target="_blank" rel="noopener noreferrer" className="text-4xl font-black italic tracking-tight text-yellow-400 uppercase">Join Chat</a>
          <button onClick={() => setIsMenuOpen(false)} className="mt-12 p-4 rounded-full border border-white/10 active:bg-white/5"><X size={32}/></button>
        </div>
      )}

      {/* 3. 히어로 섹션 */}
      <section id="home" className="h-[95vh] flex flex-col items-center justify-center relative px-6 text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/70 to-slate-900"></div>
        <div className="relative z-10 animate-slide-up">
          <div className="inline-block px-4 py-1.5 bg-orange-600/20 border border-orange-600/40 rounded-full text-orange-500 text-[10px] font-bold tracking-[0.3em] mb-8 uppercase">Safe & Passionate Riding</div>
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-[1.05] italic tracking-tighter">
            포항의 파도를 가르는<br/>
            <span className="text-orange-500 underline decoration-white/10 underline-offset-8">과메기 라이더스</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-xl mb-12 max-w-sm mx-auto font-medium leading-relaxed opacity-90">
            자유와 안전, 그리고 뜨거운 열정으로 달리는<br/>포항 최고의 모터사이클 크루입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={OPEN_CHAT_URL} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 text-black font-black px-10 py-5 rounded-2xl shadow-2xl orange-glow transform active:scale-95 transition-all text-lg inline-flex items-center justify-center gap-3">
              <MessageCircle size={24} /> 오픈채팅방 참여
            </a>
            <button onClick={() => scrollToSection('rules')} className="bg-slate-800 text-white font-bold px-10 py-5 rounded-2xl border border-white/10 transform active:scale-95 transition-all text-lg">
              이용수칙 보기
            </button>
          </div>
        </div>
      </section>

      {/* 4. 이용수칙 섹션 */}
      <section id="rules" className="py-24 px-6 max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black italic mb-4 flex justify-center items-center gap-4 uppercase tracking-tighter">
            <ShieldCheck size={40} className="text-orange-500" /> Club Rules
          </h2>
          <div className="w-12 h-1 bg-orange-600 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">안전하고 즐거운 크루 활동을 위한 약속</p>
        </div>
        
        <div className="grid gap-6">
          {RULES.map((rule) => (
            <div key={rule.id} className="p-8 glass-morphism rounded-[2.5rem] flex gap-7 items-center hover:border-orange-500/40 transition-all group">
              <div className="bg-orange-600/10 p-5 rounded-3xl text-orange-500 shrink-0 group-hover:scale-110 group-hover:bg-orange-600/20 transition-all duration-300">
                <rule.icon size={32} />
              </div>
              <div>
                <h3 className="font-black text-2xl mb-2">{rule.title}</h3>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 투어 팁 */}
        <div className="mt-16 p-10 bg-slate-800/40 border border-white/5 rounded-[3.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Navigation size={150} />
          </div>
          <h3 className="font-black text-2xl mb-8 text-orange-500 flex items-center gap-3 italic">
            <Info size={28} /> 투어 에티켓 가이드
          </h3>
          <ul className="space-y-6 relative z-10">
            {TOUR_TIPS.map((tip, i) => (
              <li key={i} className="flex items-start gap-4 text-base sm:text-lg text-slate-300">
                <div className="mt-2.5 w-2 h-2 bg-orange-500 rounded-full shrink-0"></div>
                <span className="hover:text-white transition-colors">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. 지도 섹션 */}
      <section id="map" className="py-24 px-6 bg-slate-900/80 border-y border-white/5">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-black italic mb-4 flex justify-center items-center gap-4 uppercase tracking-tighter">
            <MapIcon size={40} className="text-orange-500" /> Riders Map
          </h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">포항 라이딩 집결지 및 추천 장소</p>
        </div>
        <div className="max-w-2xl mx-auto rounded-[3.5rem] overflow-hidden aspect-[3/4] border-4 border-slate-800 shadow-2xl bg-slate-800 relative group">
          <iframe 
            src="https://www.google.com/maps/d/embed?mid=1qiJWtAP_E66N5tqR6nhhluV1gMhf82g" 
            width="100%" 
            height="100%" 
            className="grayscale-[20%] contrast-[110%] group-hover:grayscale-0 transition-all duration-1000"
            style={{ border: 0 }}
            title="Pohang Riders Map"
          ></iframe>
        </div>
        <p className="text-slate-500 text-center mt-8 text-xs font-medium italic">※ 지도를 확대하여 상세 집결지 정보를 확인하세요.</p>
      </section>

      {/* 6. AI 가이드 섹션 */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto p-12 glass-morphism rounded-[3.5rem] border-orange-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-600/10 blur-3xl rounded-full"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
              <Sparkles size={24} />
            </div>
            <h3 className="text-3xl font-black italic tracking-tighter">AI 라이더 가이드</h3>
          </div>
          <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed font-medium">
            포항의 라이딩 코스, 맛집 등 궁금한 것이 있다면<br/>무엇이든 물어보이소! (Gemini AI 탑재)
          </p>
          <div className="space-y-4">
            <textarea 
              rows={3}
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              placeholder="예: 호미곶 말고 한적한 해안도로 추천해줘!"
              className="w-full bg-slate-900/80 border border-slate-700 rounded-[2rem] py-5 px-8 text-base focus:border-orange-500 outline-none transition-all placeholder:text-slate-600 text-white resize-none"
            />
            <button 
              onClick={handleAskAi}
              disabled={isAiThinking}
              className="w-full bg-orange-600 hover:bg-orange-500 py-5 rounded-[2rem] font-black text-white text-lg shadow-xl disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {isAiThinking ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  분석 중...
                </>
              ) : "질문하기"}
            </button>
          </div>
        </div>
      </section>

      {/* 7. 하단 탭 바 */}
      <div className="fixed bottom-0 left-0 right-0 h-22 glass-morphism z-[60] flex justify-around items-center px-6 border-t border-white/5 pb-2">
        <button onClick={() => scrollToSection('home')} className="flex flex-col items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors">
          <MapPin size={24} /><span className="text-[10px] font-black tracking-tighter uppercase">Home</span>
        </button>
        <button onClick={() => scrollToSection('rules')} className="flex flex-col items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors">
          <ShieldCheck size={24} /><span className="text-[10px] font-black tracking-tighter uppercase">Rules</span>
        </button>
        <div className="relative -top-7">
          <div className="absolute inset-0 bg-orange-600 rounded-full blur-2xl opacity-40 animate-pulse"></div>
          <button 
            onClick={() => window.open(OPEN_CHAT_URL, '_blank')}
            className="relative w-18 h-18 bg-yellow-400 rounded-full flex items-center justify-center text-black shadow-2xl border-4 border-slate-900 transform active:scale-90 transition-transform"
          >
            <MessageCircle size={32} fill="currentColor" />
          </button>
        </div>
        <button onClick={() => scrollToSection('map')} className="flex flex-col items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors">
          <MapIcon size={24} /><span className="text-[10px] font-black tracking-tighter uppercase">Map</span>
        </button>
        <button onClick={() => window.open(INSTAGRAM_URL, '_blank')} className="flex flex-col items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors">
          <Instagram size={24} /><span className="text-[10px] font-black tracking-tighter uppercase">Sns</span>
        </button>
      </div>

      {/* 푸터 */}
      <footer className="py-16 px-6 text-center border-t border-white/5 bg-slate-950/50">
        <p className="text-slate-600 text-[11px] font-black tracking-[0.4em] uppercase mb-3">Pohang Gwamegi Riders</p>
        <p className="text-slate-700 text-[10px] font-medium leading-relaxed">
          Safe Riding, Safe Life.<br/>포항의 바람과 파도를 사랑하는 라이더들의 공간입니다.<br/>
          © 2024. All riders safe and sound.
        </p>
      </footer>
    </div>
  );
};

// --- [렌더링 엔진] ---
const container = document.getElementById('root');
if (container) {
  try {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
    console.log("포항과메기라이더스 앱이 로드되었습니다.");
  } catch (err) {
    console.error("마운트 실패:", err);
    container.innerHTML = '<div style="height:100vh;display:flex;align-items:center;justify-content:center;color:white;text-align:center;padding:20px;">' +
      '<div><h2 style="color:#f97316">앱 로딩 실패</h2><p>브라우저 호환성 문제일 수 있습니다.<br/>새로고침을 시도해보세요.</p></div></div>';
  }
}

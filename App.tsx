import React, { useState, useRef, useEffect } from 'react';
import { AppStep, ImageAsset, GenerationHistoryItem } from './types';
import { PRESET_PERSONS, PRESET_CLOTHES } from './constants';
import { StepCard } from './components/StepCard';
import { Gallery } from './components/Gallery';
import { generateClothesImage, generateTryOn } from './services/geminiService';
import { fileToBase64, urlToBase64 } from './utils';
import { Upload, Sparkles, ArrowRight, RotateCcw, Loader2, Camera, Shirt } from 'lucide-react';

export default function App() {
  // State
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.SELECT_PERSON);
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothesImage, setClothesImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [generatedClothesList, setGeneratedClothesList] = useState<ImageAsset[]>([]);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  
  // Processing States
  const [isGeneratingClothes, setIsGeneratingClothes] = useState(false);
  const [isGeneratingResult, setIsGeneratingResult] = useState(false);
  const [clothesPrompt, setClothesPrompt] = useState("");

  // Refs for scrolling or focus
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  const handleSelectPerson = async (asset: ImageAsset) => {
    try {
      const base64 = await urlToBase64(asset.url);
      setPersonImage(base64);
      setCurrentStep(AppStep.SELECT_CLOTHES);
    } catch (e) {
      alert("无法加载该图片，请重试");
    }
  };

  const handleUploadPerson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setPersonImage(base64);
      setCurrentStep(AppStep.SELECT_CLOTHES);
    }
  };

  const handleSelectClothes = async (asset: ImageAsset) => {
    try {
      // If it's a generated asset stored as data URL, it's already base64 (mostly), 
      // but PRESET_CLOTHES are URLs.
      const base64 = asset.url.startsWith('data:') ? asset.url : await urlToBase64(asset.url);
      setClothesImage(base64);
    } catch (e) {
      alert("无法加载该衣物图片");
    }
  };

  const handleUploadClothes = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setClothesImage(base64);
    }
  };

  const handleGenerateClothes = async () => {
    if (!clothesPrompt.trim()) return;
    setIsGeneratingClothes(true);
    try {
      const resultBase64 = await generateClothesImage(clothesPrompt);
      const newAsset: ImageAsset = {
        id: `gen_${Date.now()}`,
        url: resultBase64,
        isPreset: false
      };
      setGeneratedClothesList(prev => [newAsset, ...prev]);
      setClothesImage(resultBase64); // Auto-select the generated cloth
    } catch (e) {
      alert("生成衣服失败，请稍后重试。");
    } finally {
      setIsGeneratingClothes(false);
    }
  };

  const handleGenerateResult = async () => {
    if (!personImage || !clothesImage) return;
    setIsGeneratingResult(true);
    setCurrentStep(AppStep.RESULT);
    
    try {
      const result = await generateTryOn(personImage, clothesImage);
      setResultImage(result);
      
      // Save to history
      const newHistoryItem: GenerationHistoryItem = {
        id: Date.now().toString(),
        personUrl: personImage,
        clothesUrl: clothesImage,
        resultUrl: result,
        timestamp: Date.now()
      };
      setHistory(prev => [...prev, newHistoryItem]);

    } catch (e) {
      alert("生成换装结果失败，请稍后重试。");
      setCurrentStep(AppStep.SELECT_CLOTHES); // Go back on fail
    } finally {
      setIsGeneratingResult(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(AppStep.SELECT_PERSON);
    setPersonImage(null);
    setClothesImage(null);
    setResultImage(null);
  };

  // --- Render Sections ---

  const renderPersonSelection = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">1. 选择模特 / 上传照片</h2>
        <label className="flex items-center gap-2 cursor-pointer bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-md">
          <Upload size={16} />
          <span>上传照片</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleUploadPerson} />
        </label>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PRESET_PERSONS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPerson(p)}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-yellow-400"
          >
            <img src={p.url} alt="preset" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderClothesSelection = () => (
    <div ref={step2Ref} className="space-y-8 animate-fade-in">
      {/* Context: Show selected person small */}
      <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-xl border border-gray-200">
         <div className="w-12 h-16 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
           {personImage && <img src={personImage} className="w-full h-full object-cover" alt="Selected person" />}
         </div>
         <div className="flex-1">
           <p className="text-sm text-gray-500">当前选择的模特</p>
           <button onClick={() => setCurrentStep(AppStep.SELECT_PERSON)} className="text-xs text-blue-500 hover:underline">更改</button>
         </div>
         <div className="flex gap-2">
            <button 
              onClick={handleGenerateResult}
              disabled={!clothesImage || isGeneratingResult}
              className={`
                px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg
                ${clothesImage 
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300 hover:scale-105' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
              {isGeneratingResult ? <Loader2 className="animate-spin" /> : <Sparkles />}
              开始生成试穿
            </button>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: AI Generator */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
             <Sparkles className="text-yellow-500" size={20} />
             AI 生成服装
           </h2>
           <div className="space-y-4">
             <textarea 
               value={clothesPrompt}
               onChange={(e) => setClothesPrompt(e.target.value)}
               placeholder="描述你想生成的衣服，例如：一件红色的丝绸晚礼服，带有金色的刺绣..."
               className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none resize-none text-sm"
             />
             <button 
               onClick={handleGenerateClothes}
               disabled={isGeneratingClothes || !clothesPrompt}
               className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
             >
               {isGeneratingClothes ? <Loader2 className="animate-spin" size={18} /> : '生成衣服'}
             </button>
           </div>
        </div>

        {/* Right: Library */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <h2 className="text-lg font-bold text-gray-800">服装库</h2>
             <label className="cursor-pointer text-sm text-gray-500 hover:text-black flex items-center gap-1">
               <Upload size={14} />
               本地上传
               <input type="file" accept="image/*" className="hidden" onChange={handleUploadClothes} />
             </label>
           </div>

           <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
             {[...generatedClothesList, ...PRESET_CLOTHES].map((c) => (
               <button
                 key={c.id}
                 onClick={() => handleSelectClothes(c)}
                 className={`
                   relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                   ${clothesImage && (c.url === clothesImage || (c.url.startsWith('data') && clothesImage.startsWith('data') && clothesImage.length === c.url.length)) // Simple comparison check
                     ? 'border-yellow-400 ring-2 ring-yellow-400 ring-offset-2' 
                     : 'border-transparent hover:border-gray-300'}
                 `}
               >
                 <img src={c.url} alt="clothes" className="w-full h-full object-cover" />
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );

  const renderResult = () => (
    <div ref={step3Ref} className="flex flex-col items-center justify-center space-y-8 animate-fade-in py-8">
      {isGeneratingResult ? (
        <div className="flex flex-col items-center justify-center h-96 w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center space-y-4">
           <div className="relative">
             <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div>
             <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500" />
           </div>
           <h3 className="text-xl font-bold text-gray-800">正在施展魔法...</h3>
           <p className="text-gray-500 text-sm">Nano Banana 正在为你合成全身试穿效果，请耐心等待。</p>
        </div>
      ) : resultImage ? (
        <div className="relative group w-full max-w-md aspect-[3/4] bg-white rounded-2xl shadow-2xl overflow-hidden ring-4 ring-white">
          <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button 
              onClick={handleReset}
              className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/30 transition flex items-center gap-2"
             >
               <RotateCcw size={16} /> 重来
             </button>
             <a 
               href={resultImage} 
               download="banana-fit-result.png"
               className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition shadow-lg flex items-center gap-2"
             >
               <Upload className="rotate-180" size={16} /> 保存
             </a>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-500">生成出错，请重试</div>
      )}
    </div>
  );

  // --- Main Render ---

  return (
    <div className="min-h-screen pb-40 bg-[#f8fafc]">
      {/* Header / Brand */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6 mb-8 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <div className="bg-yellow-400 p-1.5 rounded-lg">
            <Shirt className="text-black" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Banana Fit <span className="font-normal text-gray-400 text-sm ml-2">Nano Banana Engine</span></h1>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top Cards Visualizer */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12 perspective-container">
          <StepCard 
            stepNumber={1} 
            title="选择模特" 
            isActive={currentStep === AppStep.SELECT_PERSON} 
            isCompleted={!!personImage}
            imageSrc={personImage || undefined}
            icon="user"
          />
          <StepCard 
            stepNumber={2} 
            title="选择服装" 
            isActive={currentStep === AppStep.SELECT_CLOTHES} 
            isCompleted={!!clothesImage}
            imageSrc={clothesImage || undefined}
            icon="shirt"
          />
          <StepCard 
            stepNumber={3} 
            title="生成结果" 
            isActive={currentStep === AppStep.RESULT} 
            isCompleted={!!resultImage}
            imageSrc={resultImage || undefined}
            icon="magic"
          />
        </div>

        {/* Dynamic Content Area */}
        <div className="transition-all duration-500 ease-in-out">
          {currentStep === AppStep.SELECT_PERSON && renderPersonSelection()}
          {currentStep === AppStep.SELECT_CLOTHES && renderClothesSelection()}
          {currentStep === AppStep.RESULT && renderResult()}
        </div>
      </main>

      {/* History Gallery */}
      <Gallery history={history} />
    </div>
  );
}

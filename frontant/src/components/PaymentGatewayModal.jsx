import React, { useState, useEffect } from "react";

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  amount = 0,
  items = [],
  shippingAddress = "",
  onPaymentSuccess,
}) {
  const [selectedMethod, setSelectedMethod] = useState("upi"); // 'upi' | 'cod' | 'card' | 'netbanking' | 'wallet'
  
  // UPI Sub-methods: 'apps' | 'qr' | 'vpa'
  const [upiMode, setUpiMode] = useState("apps");
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [vpaInput, setVpaInput] = useState("");
  const [vpaVerified, setVpaVerified] = useState(false);
  const [qrTimer, setQrTimer] = useState(300); // 5 mins

  // COD State
  const [captchaCode, setCaptchaCode] = useState("742");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  // Card State
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [saveCard, setSaveCard] = useState(true);

  // NetBanking State
  const [selectedBank, setSelectedBank] = useState("HDFC");

  // Wallets State
  const [selectedWallet, setSelectedWallet] = useState("phonepe_wallet");

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1); // 1: Connecting, 2: Authorizing, 3: Success

  // Generate random 3-digit Captcha for COD
  const regenerateCaptcha = () => {
    const code = Math.floor(100 + Math.random() * 900).toString();
    setCaptchaCode(code);
    setCaptchaInput("");
    setCaptchaError("");
  };

  useEffect(() => {
    if (isOpen) {
      regenerateCaptcha();
      setQrTimer(300);
      setIsProcessing(false);
      setProcessingStep(1);
    }
  }, [isOpen]);

  // Countdown timer for QR code
  useEffect(() => {
    if (!isOpen || selectedMethod !== "upi" || upiMode !== "qr") return;
    const interval = setInterval(() => {
      setQrTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, selectedMethod, upiMode]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardData({ ...cardData, number: formatted });
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 3) {
      val = val.substring(0, 2) + "/" + val.substring(2, 4);
    }
    setCardData({ ...cardData, expiry: val });
  };

  // Trigger Realistic Payment Handshake
  const executePayment = (methodName, details = {}) => {
    setIsProcessing(true);
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2);
    }, 1200);

    setTimeout(() => {
      setProcessingStep(3);
    }, 2400);

    setTimeout(() => {
      setIsProcessing(false);
      if (onPaymentSuccess) {
        onPaymentSuccess({
          paymentMethod: methodName,
          transactionId: "TXN-" + Math.floor(10000000 + Math.random() * 90000000),
          paidAt: new Date().toISOString(),
          details,
        });
      }
    }, 3200);
  };

  const handlePayUPI = () => {
    if (upiMode === "vpa") {
      if (!vpaInput || !vpaInput.includes("@")) {
        alert("Please enter a valid UPI ID (e.g. yourname@oksbi)");
        return;
      }
      executePayment("UPI (ID: " + vpaInput + ")", { vpa: vpaInput });
    } else if (upiMode === "qr") {
      executePayment("UPI (QR Code Scan)", { upiApp: "Scanned QR" });
    } else {
      const appNames = {
        gpay: "Google Pay UPI",
        phonepe: "PhonePe UPI",
        paytm: "Paytm UPI",
        bhim: "BHIM UPI",
        cred: "CRED UPI",
      };
      executePayment(`UPI (${appNames[selectedUpiApp] || "UPI App"})`, {
        app: selectedUpiApp,
      });
    }
  };

  const handlePayCOD = (e) => {
    e.preventDefault();
    if (captchaInput.trim() !== captchaCode) {
      setCaptchaError("Incorrect security code. Please enter the 3 digits shown.");
      return;
    }
    executePayment("Cash on Delivery (COD)", { verifiedCaptcha: true });
  };

  const handlePayCard = (e) => {
    e.preventDefault();
    if (cardData.number.replace(/\s/g, "").length < 16) {
      alert("Please enter a valid 16-digit card number");
      return;
    }
    const last4 = cardData.number.slice(-4);
    executePayment(`Debit/Credit Card (ending in ${last4})`, {
      last4,
      name: cardData.name,
      saveCard,
    });
  };

  const handlePayNetBanking = () => {
    executePayment(`Net Banking (${selectedBank})`, { bank: selectedBank });
  };

  const handlePayWallet = () => {
    const walletNames = {
      phonepe_wallet: "PhonePe Wallet",
      paytm_wallet: "Paytm Wallet",
      amazon_pay: "Amazon Pay Balance",
      mobikwik: "MobiKwik",
    };
    executePayment(`Wallet (${walletNames[selectedWallet]})`, {
      wallet: selectedWallet,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs font-sans animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh] relative">
        
        {/* ================= MODAL HEADER (Flipkart Blue #2874f0) ================= */}
        <div className="bg-[#2874f0] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-lg">
              🔒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  Payment Options
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-black tracking-wider uppercase border border-emerald-400/30">
                  100% Safe & Secure
                </span>
              </div>
              <p className="text-[11px] text-white/80">
                256-Bit SSL Encrypted Banking Gateway
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase text-white/70 block font-bold">Total Payable</span>
              <span className="text-base font-black text-[#ffe500]">
                ${Number(amount).toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ================= ORDER RECAP RIBBON ================= */}
        <div className="bg-blue-50/70 border-b border-blue-100 px-5 py-2 text-xs text-slate-700 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">📦</span>
            <span className="font-bold text-slate-900">
              {items.length} {items.length === 1 ? "Product" : "Products"}
            </span>
            <span className="text-slate-400">•</span>
            <span className="truncate max-w-xs text-slate-600 font-medium">
              Deliver to: {shippingAddress || "Registered Customer Address"}
            </span>
          </div>
          <span className="text-emerald-700 font-black text-[11px] bg-emerald-100/80 px-2 py-0.5 rounded">
            ⚡ Free Express Delivery
          </span>
        </div>

        {/* ================= MAIN 2-COLUMN PAYMENT INTERFACE ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* LEFT: PAYMENT METHODS SIDEBAR (4 COLS) */}
          <div className="md:col-span-4 bg-slate-50 border-r border-slate-200 p-2 space-y-1">
            
            {/* 1. UPI */}
            <button
              type="button"
              onClick={() => setSelectedMethod("upi")}
              className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between cursor-pointer border ${
                selectedMethod === "upi"
                  ? "bg-white border-[#2874f0] shadow-sm font-black text-[#2874f0]"
                  : "bg-transparent border-transparent hover:bg-slate-100 text-slate-700 font-bold"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📱</span>
                <div>
                  <div className="text-xs">UPI Options</div>
                  <div className="text-[10px] text-slate-400 font-normal">GPay, PhonePe, QR, ID</div>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black text-[9px]">
                FAST
              </span>
            </button>

            {/* 2. CASH ON DELIVERY (COD) */}
            <button
              type="button"
              onClick={() => setSelectedMethod("cod")}
              className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between cursor-pointer border ${
                selectedMethod === "cod"
                  ? "bg-white border-[#2874f0] shadow-sm font-black text-[#2874f0]"
                  : "bg-transparent border-transparent hover:bg-slate-100 text-slate-700 font-bold"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">💵</span>
                <div>
                  <div className="text-xs">Cash on Delivery</div>
                  <div className="text-[10px] text-slate-400 font-normal">Pay cash upon delivery</div>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-[#2874f0] px-1.5 py-0.2 rounded font-black text-[9px]">
                COD
              </span>
            </button>

            {/* 3. CARDS */}
            <button
              type="button"
              onClick={() => setSelectedMethod("card")}
              className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between cursor-pointer border ${
                selectedMethod === "card"
                  ? "bg-white border-[#2874f0] shadow-sm font-black text-[#2874f0]"
                  : "bg-transparent border-transparent hover:bg-slate-100 text-slate-700 font-bold"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">💳</span>
                <div>
                  <div className="text-xs">Credit / Debit Card</div>
                  <div className="text-[10px] text-slate-400 font-normal">Visa, Mastercard, RuPay</div>
                </div>
              </div>
            </button>

            {/* 4. NET BANKING */}
            <button
              type="button"
              onClick={() => setSelectedMethod("netbanking")}
              className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between cursor-pointer border ${
                selectedMethod === "netbanking"
                  ? "bg-white border-[#2874f0] shadow-sm font-black text-[#2874f0]"
                  : "bg-transparent border-transparent hover:bg-slate-100 text-slate-700 font-bold"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🏦</span>
                <div>
                  <div className="text-xs">Net Banking</div>
                  <div className="text-[10px] text-slate-400 font-normal">All Indian & Global Banks</div>
                </div>
              </div>
            </button>

            {/* 5. WALLETS */}
            <button
              type="button"
              onClick={() => setSelectedMethod("wallet")}
              className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between cursor-pointer border ${
                selectedMethod === "wallet"
                  ? "bg-white border-[#2874f0] shadow-sm font-black text-[#2874f0]"
                  : "bg-transparent border-transparent hover:bg-slate-100 text-slate-700 font-bold"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">👛</span>
                <div>
                  <div className="text-xs">Wallets</div>
                  <div className="text-[10px] text-slate-400 font-normal">PhonePe, Paytm, Amazon</div>
                </div>
              </div>
            </button>

          </div>

          {/* RIGHT: METHOD CONFIGURATION & ACTION (8 COLS) */}
          <div className="md:col-span-8 p-5 sm:p-6 bg-white flex flex-col justify-between space-y-4">
            
            {/* ================= METHOD 1: UPI ================= */}
            {selectedMethod === "upi" && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Sub-modes tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setUpiMode("apps")}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                      upiMode === "apps"
                        ? "bg-white text-[#2874f0] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ⚡ UPI Apps
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiMode("qr")}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                      upiMode === "qr"
                        ? "bg-white text-[#2874f0] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>🔳</span> Scan QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiMode("vpa")}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                      upiMode === "vpa"
                        ? "bg-white text-[#2874f0] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ✍️ UPI ID
                  </button>
                </div>

                {/* --- 1A. UPI APPS --- */}
                {upiMode === "apps" && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">
                      Select your preferred UPI App:
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: "gpay", name: "Google Pay", icon: "🟢", color: "border-emerald-200 bg-emerald-50/50" },
                        { id: "phonepe", name: "PhonePe", icon: "🟣", color: "border-purple-200 bg-purple-50/50" },
                        { id: "paytm", name: "Paytm UPI", icon: "🔷", color: "border-blue-200 bg-blue-50/50" },
                        { id: "bhim", name: "BHIM UPI", icon: "🟠", color: "border-orange-200 bg-orange-50/50" },
                        { id: "cred", name: "CRED UPI", icon: "⚪", color: "border-slate-200 bg-slate-50/50" },
                      ].map((app) => (
                        <label
                          key={app.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition cursor-pointer ${
                            selectedUpiApp === app.id
                              ? "border-[#2874f0] bg-blue-50/60 shadow-xs"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="upiApp"
                            checked={selectedUpiApp === app.id}
                            onChange={() => setSelectedUpiApp(app.id)}
                            className="text-[#2874f0] focus:ring-[#2874f0]"
                          />
                          <span className="text-lg">{app.icon}</span>
                          <span className="text-xs font-bold text-slate-800">{app.name}</span>
                        </label>
                      ))}
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                      💡 Clicking <strong>"PROCEED TO PAY"</strong> will open your chosen UPI app to complete the authorization.
                    </div>
                  </div>
                )}

                {/* --- 1B. SCAN QR CODE --- */}
                {upiMode === "qr" && (
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    {/* Simulated Realistic Dynamic QR Code */}
                    <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200 flex flex-col items-center shrink-0">
                      <div className="w-36 h-36 bg-slate-900 rounded-lg p-2 flex items-center justify-center relative group">
                        {/* QR Grid Pattern Graphic */}
                        <div className="w-full h-full bg-white rounded flex items-center justify-center p-1.5 relative overflow-hidden">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                            {/* Outer squares */}
                            <rect x="5" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
                            <rect x="12" y="12" width="14" height="14" />
                            
                            <rect x="67" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
                            <rect x="74" y="12" width="14" height="14" />
                            
                            <rect x="5" y="67" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
                            <rect x="12" y="74" width="14" height="14" />

                            {/* Pixel Matrix Bits */}
                            <rect x="40" y="8" width="6" height="6" />
                            <rect x="50" y="8" width="8" height="6" />
                            <rect x="40" y="20" width="12" height="6" />
                            <rect x="56" y="20" width="6" height="6" />
                            
                            <rect x="8" y="42" width="14" height="6" />
                            <rect x="26" y="42" width="8" height="6" />
                            <rect x="42" y="40" width="16" height="16" />
                            <rect x="65" y="42" width="10" height="6" />
                            <rect x="82" y="42" width="10" height="6" />

                            <rect x="40" y="65" width="8" height="8" />
                            <rect x="54" y="65" width="6" height="8" />
                            <rect x="68" y="65" width="12" height="6" />
                            <rect x="42" y="80" width="18" height="6" />
                            <rect x="72" y="80" width="14" height="14" />
                          </svg>

                          {/* Center UPI Badge */}
                          <div className="absolute inset-0 m-auto w-7 h-7 bg-[#2874f0] rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-black">
                            UPI
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-slate-500 mt-2">
                        Scan with any UPI App
                      </span>
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span className="text-xs font-black text-slate-800">
                          Scan to pay ${Number(amount).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Open Google Pay, PhonePe, Paytm, BHIM, or any banking app and scan this QR code.
                      </p>
                      
                      <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-800">
                        <span>⏳</span>
                        <span>QR Expires in: <strong>{formatTimer(qrTimer)}</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 1C. UPI ID / VPA --- */}
                {upiMode === "vpa" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Enter your UPI ID / Virtual Payment Address (VPA)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. mobileNumber@upi or name@okhdfcbank"
                          value={vpaInput}
                          onChange={(e) => {
                            setVpaInput(e.target.value);
                            setVpaVerified(false);
                          }}
                          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (vpaInput && vpaInput.includes("@")) {
                              setVpaVerified(true);
                            } else {
                              alert("Please enter a valid format, e.g. username@okhdfcbank");
                            }
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                        >
                          {vpaVerified ? "✓ Verified" : "Verify"}
                        </button>
                      </div>
                    </div>

                    {/* Quick Bank Suffix Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-bold">Quick handles:</span>
                      {["@okhdfcbank", "@okicici", "@okaxis", "@ybl", "@paytm"].map((handle) => (
                        <button
                          key={handle}
                          type="button"
                          onClick={() => {
                            const prefix = vpaInput.split("@")[0] || "user";
                            setVpaInput(prefix + handle);
                            setVpaVerified(true);
                          }}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-[#2874f0] text-slate-600 rounded text-[11px] font-bold transition cursor-pointer"
                        >
                          {handle}
                        </button>
                      ))}
                    </div>

                    {vpaVerified && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                        <span>✓</span>
                        <span>UPI ID Verified! Ready to request payment.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <button
                  type="button"
                  onClick={handlePayUPI}
                  className="w-full py-3 bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <span>🔒</span>
                  <span>PAY ${Number(amount).toFixed(2)} VIA UPI</span>
                </button>
              </div>
            )}

            {/* ================= METHOD 2: CASH ON DELIVERY (COD) ================= */}
            {selectedMethod === "cod" && (
              <form onSubmit={handlePayCOD} className="space-y-4 animate-fade-in">
                
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-black text-xs">
                    <span className="text-base">💵</span>
                    <span>Cash on Delivery Verification</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    To prevent automated spam orders, Flipkart requires a quick security verification. Please keep exact cash ready at delivery.
                  </p>
                </div>

                {/* Flipkart Style Security Captcha */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Enter the 3 characters shown below:
                  </label>

                  <div className="flex items-center gap-3">
                    {/* Visual Captcha Box */}
                    <div className="px-5 py-2.5 bg-slate-900 text-white font-black text-xl tracking-[0.4em] rounded-xl select-none relative shadow-inner italic">
                      <span className="relative z-10 text-emerald-400">{captchaCode[0]}</span>
                      <span className="relative z-10 text-amber-400">{captchaCode[1]}</span>
                      <span className="relative z-10 text-rose-400">{captchaCode[2]}</span>
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]"></div>
                    </div>

                    <button
                      type="button"
                      onClick={regenerateCaptcha}
                      className="text-xs text-[#2874f0] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>🔄</span>
                      <span>Change Code</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    maxLength={3}
                    placeholder="Enter 3 digits"
                    value={captchaInput}
                    onChange={(e) => {
                      setCaptchaInput(e.target.value);
                      setCaptchaError("");
                    }}
                    required
                    className="w-44 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-black text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                  />

                  {captchaError && (
                    <p className="text-xs text-rose-600 font-bold">{captchaError}</p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span>Cash handling charges:</span>
                  <span className="text-emerald-700 font-black">FREE (₹0 / $0)</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>✓</span>
                  <span>CONFIRM ORDER (CASH ON DELIVERY)</span>
                </button>
              </form>
            )}

            {/* ================= METHOD 3: CARD ================= */}
            {selectedMethod === "card" && (
              <form onSubmit={handlePayCard} className="space-y-3.5 animate-fade-in">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4532 8901 2345 6789"
                      value={cardData.number}
                      onChange={handleCardNumberChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-black text-slate-400">
                      💳
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Valid Thru (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={handleExpiryChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gaurav Sharma"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="text-[#2874f0] rounded focus:ring-[#2874f0]"
                  />
                  <span>Save this card securely as per RBI guidelines</span>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <span>🔒</span>
                  <span>PAY ${Number(amount).toFixed(2)}</span>
                </button>
              </form>
            )}

            {/* ================= METHOD 4: NET BANKING ================= */}
            {selectedMethod === "netbanking" && (
              <div className="space-y-4 animate-fade-in">
                <span className="text-xs font-bold text-slate-700 block">
                  Popular Indian & International Banks:
                </span>
                
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "HDFC", name: "HDFC Bank", icon: "🏛️" },
                    { id: "ICICI", name: "ICICI Bank", icon: "🏢" },
                    { id: "SBI", name: "State Bank of India", icon: "🏦" },
                    { id: "Axis", name: "Axis Bank", icon: "🏛️" },
                    { id: "Kotak", name: "Kotak Mahindra", icon: "🏢" },
                    { id: "PNB", name: "Punjab National", icon: "🏦" },
                  ].map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBank(bank.id)}
                      className={`p-3 rounded-xl border-2 transition text-left cursor-pointer ${
                        selectedBank === bank.id
                          ? "border-[#2874f0] bg-blue-50 text-[#2874f0] font-black"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 font-bold"
                      }`}
                    >
                      <span className="text-lg block mb-1">{bank.icon}</span>
                      <span className="text-xs line-clamp-1">{bank.name}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Or select all other banks:
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                  >
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="SBI">State Bank of India (SBI)</option>
                    <option value="Axis">Axis Bank</option>
                    <option value="Kotak">Kotak Mahindra Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                    <option value="Canara Bank">Canara Bank</option>
                    <option value="Union Bank of India">Union Bank of India</option>
                    <option value="IndusInd Bank">IndusInd Bank</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handlePayNetBanking}
                  className="w-full py-3 bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <span>🔒</span>
                  <span>PROCEED TO {selectedBank.toUpperCase()}</span>
                </button>
              </div>
            )}

            {/* ================= METHOD 5: WALLETS ================= */}
            {selectedMethod === "wallet" && (
              <div className="space-y-4 animate-fade-in">
                <span className="text-xs font-bold text-slate-700 block">
                  Select your digital wallet:
                </span>

                <div className="space-y-2">
                  {[
                    { id: "phonepe_wallet", name: "PhonePe Wallet", desc: "Link & Pay instantly", icon: "🟣" },
                    { id: "paytm_wallet", name: "Paytm Wallet", desc: "Pay with Paytm balance", icon: "🔷" },
                    { id: "amazon_pay", name: "Amazon Pay Balance", desc: "Fast 1-click checkout", icon: "🟠" },
                    { id: "mobikwik", name: "MobiKwik Wallet", desc: "Zip & Wallet balance", icon: "🔵" },
                  ].map((w) => (
                    <label
                      key={w.id}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition cursor-pointer ${
                        selectedWallet === w.id
                          ? "border-[#2874f0] bg-blue-50/60 shadow-xs"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="walletOption"
                          checked={selectedWallet === w.id}
                          onChange={() => setSelectedWallet(w.id)}
                          className="text-[#2874f0] focus:ring-[#2874f0]"
                        />
                        <span className="text-lg">{w.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{w.name}</div>
                          <div className="text-[10px] text-slate-400">{w.desc}</div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#2874f0]">Link</span>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handlePayWallet}
                  className="w-full py-3 bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <span>🔒</span>
                  <span>CONTINUE WITH WALLET</span>
                </button>
              </div>
            )}

          </div>

        </div>

        {/* ================= REALISTIC PROCESSING OVERLAY ================= */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-blue-50 border-4 border-[#2874f0] border-t-transparent animate-spin mb-4 flex items-center justify-center">
              <span className="text-xl">🔒</span>
            </div>

            <h4 className="text-lg font-black text-slate-900 mb-1">
              {processingStep === 1 && "Contacting Secure Bank Gateway..."}
              {processingStep === 2 && "Authorizing Payment & Verifying Funds..."}
              {processingStep === 3 && "Payment Confirmed! Generating Order..."}
            </h4>
            
            <p className="text-xs text-slate-500 max-w-sm">
              {processingStep === 1 && "Establishing end-to-end 256-bit encryption with NPCI / Card Network."}
              {processingStep === 2 && "Please do not refresh the page or press the back button."}
              {processingStep === 3 && "Order reference created. Finalizing invoice details..."}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#2874f0]">
              <span className="w-2 h-2 rounded-full bg-[#2874f0] animate-ping"></span>
              <span>Secure Transaction in Progress</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
